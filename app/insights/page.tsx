import { PiggyBank, TrendingDown } from "lucide-react";
import { AiCopilot } from "@/components/ai-copilot";
import { AppShell } from "@/components/app-shell";
import { SpendingChart } from "@/components/spending-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/data";
import { requireViewer } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export default async function InsightsPage() {
  const viewer = await requireViewer();
  const snapshot = await getDashboardSnapshot(viewer);
  const debitTotal = snapshot.transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <AppShell
      viewer={viewer}
      title="Insights"
      description="AI-generated guidance and visual analytics for spending, saving, and anomaly detection."
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>30-day spend</CardTitle>
                <CardDescription>Total outgoing transaction volume.</CardDescription>
              </div>
              <TrendingDown className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{formatCurrency(debitTotal)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Automated saving opportunity</CardTitle>
                <CardDescription>Modeled from current cash flow and spending rhythm.</CardDescription>
              </div>
              <PiggyBank className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{formatCurrency(debitTotal * 0.08)}</p>
            </CardContent>
          </Card>
        </div>

        <AiCopilot accounts={snapshot.accounts} transactions={snapshot.transactions} />
        <SpendingChart transactions={snapshot.transactions} />
      </div>
    </AppShell>
  );
}
