import { NextResponse } from "next/server";
import { z } from "zod";
import { generateFinancialInsights } from "@/lib/openai";
import { getViewer } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const requestSchema = z.object({
  accounts: z.array(
    z.object({
      id: z.string(),
      user_id: z.string(),
      account_type: z.enum(["checking", "savings", "credit"]),
      balance: z.number(),
      created_at: z.string(),
    }),
  ),
  transactions: z.array(
    z.object({
      id: z.string(),
      account_id: z.string(),
      type: z.enum(["debit", "credit"]),
      description: z.string(),
      category: z.string(),
      amount: z.number(),
      created_at: z.string(),
      account_type: z.enum(["checking", "savings", "credit"]).optional(),
    }),
  ),
});

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const insight = await generateFinancialInsights(parsed.data.accounts, parsed.data.transactions);

  const supabase = createSupabaseServerClient();

  if (supabase) {
    await supabase.from("ai_insights").insert({
      user_id: viewer.id,
      spending_insight: insight.spending_insight,
      saving_tip: insight.saving_tip,
      anomaly_detection: insight.anomaly_detection,
      predicted_balance_7_days: insight.predicted_balance_7_days,
    });
  }

  return NextResponse.json(insight);
}
