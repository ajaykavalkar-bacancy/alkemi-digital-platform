import { Landmark, Sparkles, Wallet2 } from "lucide-react";
import { AccountCreationDialog } from "@/components/account-creation-dialog";
import { AccountSummary } from "@/components/account-summary";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/data";
import { requireViewer } from "@/lib/session";
import { formatAccountType, formatCurrency } from "@/lib/utils";

export default async function AccountsPage() {
  const viewer = await requireViewer();
  const snapshot = await getDashboardSnapshot(viewer);

  return (
    <AppShell
      viewer={viewer}
      title="Accounts"
      description="Explore your checking and savings positions with clear balances and account-level activity."
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <AccountSummary accounts={snapshot.accounts} />
          <Card className="relative overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:border-emerald-400/20 dark:from-emerald-950/30 dark:via-slate-950/70 dark:to-sky-950/30">
            <div className="pointer-events-none absolute -left-16 top-8 h-32 w-32 rounded-full bg-emerald-300/30 blur-2xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-32 w-32 rounded-full bg-sky-300/30 blur-3xl" />
            <CardHeader>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Account tools
              </div>
              <CardTitle className="mt-4 text-2xl">Add a new account</CardTitle>
              <CardDescription>
                Open another checking, savings, or credit account to expand your MoneyMind workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-emerald-200/60 bg-white/70 px-4 py-3 text-sm text-muted-foreground dark:border-emerald-400/20 dark:bg-slate-950/50">
                Add two or more accounts to unlock transfers and AI insights across balances.
              </div>
              <AccountCreationDialog accountsCount={snapshot.accounts.length}>
                <Button size="lg" className="w-full">
                  Add account
                </Button>
              </AccountCreationDialog>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.accounts.map((account) => (
            <Card key={account.id} className="card-static">
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle>{formatAccountType(account.account_type)}</CardTitle>
                  <CardDescription>Account ending in {account.id.slice(-4)}</CardDescription>
                </div>
                <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
                  {account.account_type === "savings" ? <Landmark className="h-5 w-5" /> : <Wallet2 className="h-5 w-5" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available balance</span>
                  <span className="text-2xl font-semibold">{formatCurrency(account.balance)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{formatAccountType(account.account_type)}</Badge>
                  <Badge variant="success">
                    {
                      snapshot.transactions.filter((transaction) => transaction.account_id === account.id).length
                    }{" "}
                    transactions
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
