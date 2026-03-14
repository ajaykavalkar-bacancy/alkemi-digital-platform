import { Activity, Bell, CreditCard, Sparkles } from "lucide-react";
import { AccountSummary } from "@/components/account-summary";
import { AiCopilot } from "@/components/ai-copilot";
import { AppShell } from "@/components/app-shell";
import { NotificationsPanel } from "@/components/notifications-panel";
import { SpendingChart } from "@/components/spending-chart";
import { TransactionList } from "@/components/transaction-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/data";
import { requireViewer } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const viewer = await requireViewer();
  const snapshot = await getDashboardSnapshot(viewer);
  const debitTotal = snapshot.transactions
    .filter((transaction) => transaction.type === "debit")
    .slice(0, 10)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const creditTotal = snapshot.transactions
    .filter((transaction) => transaction.type === "credit")
    .slice(0, 10)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const netFlow = creditTotal - debitTotal;
  const averageTicket = snapshot.transactions.length
    ? snapshot.transactions.slice(0, 10).reduce((sum, transaction) => sum + transaction.amount, 0) /
      Math.min(snapshot.transactions.length, 10)
    : 0;

  return (
    <AppShell
      viewer={viewer}
      title="Dashboard"
      description="Your complete digital banking overview with AI guidance and high-signal account activity."
    >
      <div className="space-y-6">
        <Card className="overflow-hidden bg-slate-950 text-white">
          <CardContent className="relative p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 h-28 w-28 rounded-full bg-amber-300/15 blur-2xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.35fr,1fr]">
              <div>
                <Badge className="mb-4 bg-white/10 text-amber-100">Portfolio pulse</Badge>
                <h2 className="max-w-2xl font-display text-5xl font-semibold leading-[1.04] text-white">
                  Your financial signal is stable, with liquidity headroom for the next week.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
                  MoneyMind merges account state, transfer behavior, and anomaly alerts into one executive-ready cockpit.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">10-day net flow</p>
                  <p className="mt-3 font-display text-3xl text-white">{formatCurrency(netFlow)}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Average ticket</p>
                  <p className="mt-3 font-display text-3xl text-white">{formatCurrency(averageTicket)}</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-white/20 bg-gradient-to-r from-teal-400/25 to-amber-400/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Session</p>
                <p className="mt-2 text-sm text-white">Live Supabase mode connected with authenticated account scope.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AccountSummary accounts={snapshot.accounts} />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-emerald-300/50">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Recent debit volume</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-semibold">{formatCurrency(debitTotal)}</p>
              <p className="mt-2 text-sm text-muted-foreground">Latest ten outgoing transactions.</p>
            </CardContent>
          </Card>
          <Card className="border-amber-300/50">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Active cards</CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-semibold">{snapshot.cards.filter((card) => card.status === "active").length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Cards ready for spending and travel controls.</p>
            </CardContent>
          </Card>
          <Card className="border-cyan-300/50">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Unread signals</CardTitle>
              <Bell className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="font-display text-4xl font-semibold">{snapshot.notifications.length}</p>
                <Badge variant="outline">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI + alerts
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Transfers, anomalies, and low-balance monitoring.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <SpendingChart transactions={snapshot.transactions} />
          <AiCopilot accounts={snapshot.accounts} transactions={snapshot.transactions} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <TransactionList transactions={snapshot.transactions} compact />
          <NotificationsPanel notifications={snapshot.notifications} compact />
        </div>
      </div>
    </AppShell>
  );
}
