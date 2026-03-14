import { ArrowUpRight } from "lucide-react";
import { type Account } from "@/lib/types";
import { formatCurrency, sumBalances } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountSummary({ accounts }: { accounts: Account[] }) {
  const totalBalance = sumBalances(accounts);

  return (
    <div className="grid gap-4">
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
    </div>
  );
}
