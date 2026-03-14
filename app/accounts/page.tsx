import { Landmark, Wallet2 } from "lucide-react";
import { AccountCreationCard } from "@/components/account-creation-card";
import { AccountSummary } from "@/components/account-summary";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
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
          <AccountCreationCard accountsCount={snapshot.accounts.length} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {snapshot.accounts.map((account) => (
            <Card key={account.id}>
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
