import OpenAI from "openai";
import { z } from "zod";
import { type Account, type FinancialInsight, type Transaction } from "@/lib/types";

const FinancialInsightSchema = z.object({
  spending_insight: z.string(),
  saving_tip: z.string(),
  anomaly_detection: z.string(),
  predicted_balance_7_days: z.number(),
});

const DEFAULT_INSIGHT: FinancialInsight = {
  spending_insight: "Link your accounts and transactions so MoneyMind can highlight your largest expense categories.",
  saving_tip: "Set aside 8% of your outgoing spend as a habit to build a cash buffer.",
  anomaly_detection: "No unusual debit pattern stands out in the current 30 day window.",
  predicted_balance_7_days: 0,
};

function fallbackInsights(accounts: Account[], transactions: Transaction[]): FinancialInsight {
  if (!accounts.length || !transactions.length) {
    return DEFAULT_INSIGHT;
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const debits = transactions.filter((transaction) => transaction.type === "debit");
  const credits = transactions.filter((transaction) => transaction.type === "credit");
  const categoryTotals = debits.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] ?? 0) + transaction.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const averageDebit = debits.reduce((sum, transaction) => sum + transaction.amount, 0) / Math.max(debits.length, 1);
  const largestTransaction = debits.slice().sort((a, b) => b.amount - a.amount)[0];
  const netThirtyDay =
    credits.reduce((sum, transaction) => sum + transaction.amount, 0) -
    debits.reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    spending_insight: topCategory
      ? `${topCategory[0]} is your largest expense category over the last 30 days at roughly $${topCategory[1].toFixed(0)}.`
      : DEFAULT_INSIGHT.spending_insight,
    saving_tip:
      averageDebit > 0
        ? `Reducing your average discretionary debit by 15% would preserve about $${(averageDebit * 0.15 * 12).toFixed(0)} across the next month.`
        : DEFAULT_INSIGHT.saving_tip,
    anomaly_detection:
      largestTransaction && largestTransaction.amount > averageDebit * 1.8
        ? `${largestTransaction.description} looks unusually high relative to your recent average debit activity.`
        : DEFAULT_INSIGHT.anomaly_detection,
    predicted_balance_7_days: Number((totalBalance + (netThirtyDay / 30) * 7).toFixed(2)),
  };
}

export async function generateFinancialInsights(
  accounts: Account[],
  transactions: Transaction[],
): Promise<FinancialInsight> {
  const fallback = fallbackInsights(accounts, transactions);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallback;
  }

  try {
    const client = new OpenAI({ apiKey });
    const prompt = {
      balances: accounts.map((account) => ({
        account_type: account.account_type,
        balance: account.balance,
      })),
      transactions: transactions.slice(0, 30).map((transaction) => ({
        type: transaction.type,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        created_at: transaction.created_at,
      })),
    };

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a digital banking financial copilot. Return compact JSON only with keys spending_insight, saving_tip, anomaly_detection, predicted_balance_7_days.",
        },
        {
          role: "user",
          content: JSON.stringify(prompt),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return fallback;
    }

    return FinancialInsightSchema.parse(JSON.parse(content));
  } catch {
    return fallback;
  }
}
