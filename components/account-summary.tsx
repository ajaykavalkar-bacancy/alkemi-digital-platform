import { ArrowUpRight, Landmark, PiggyBank, Wallet } from "lucide-react";
import { type Account } from "@/lib/types";
import { formatAccountType, formatCurrency, sumBalances } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const accountIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit: Landmark,
};

export function AccountSummary({ accounts }: { accounts: Account[] }) {
  const totalBalance = sumBalances(accounts);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr,1fr]">
      <Card className="overflow-hidden bg-slate-950 text-white">
        <CardHeader>
          <CardDescription className="text-slate-300">Total available balance</CardDescription>
          <CardTitle className="text-4xl text-white">{formatCurrency(totalBalance)}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-300">Across {accounts.length} linked accounts</p>
            <p className="mt-1 text-sm text-slate-400">Updated from seeded activity and live banking flows.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <ArrowUpRight className="h-5 w-5 text-teal-200" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((account) => {
          const Icon = accountIcons[account.account_type];

          return (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{formatAccountType(account.account_type)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{formatCurrency(account.balance)}</p>
                <p className="mt-2 text-sm text-muted-foreground">Account ending in {account.id.slice(-4)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
