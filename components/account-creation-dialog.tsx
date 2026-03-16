"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowRightLeft, Sparkles, Wallet } from "lucide-react";
import { AccountCreationCard } from "@/components/account-creation-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AccountCreationDialog({
  accountsCount,
  autoOpen = false,
  children,
}: {
  accountsCount: number;
  autoOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoOpen && accountsCount === 0) {
      setOpen(true);
    }
  }, [accountsCount, autoOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50/60 to-sky-50/60 dark:border-emerald-400/20 dark:from-slate-950 dark:via-emerald-950/30 dark:to-sky-950/30">
        <DialogHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            Account setup
          </div>
          <DialogTitle className="mt-3 text-2xl">Open a new account</DialogTitle>
          <DialogDescription>
            Add at least two accounts to unlock transfers. You can create checking, savings, or credit accounts.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,1.1fr]">
          <div className="rounded-3xl border border-emerald-200/60 bg-white/70 p-5 text-sm text-muted-foreground dark:border-emerald-400/20 dark:bg-slate-950/50">
            <p className="text-base font-semibold text-foreground">Why two accounts?</p>
            <p className="mt-2">
              MoneyMind models real-world transfers with a source and destination. Add two accounts so you can move
              money, see notifications, and unlock AI insights.
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Real-time balance updates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span>Transfer confirmations + alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>AI insights with anomaly detection</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-600/80 dark:text-emerald-200/80">
              <Wallet className="h-3.5 w-3.5" />
              Ready to fund
            </div>
          </div>
          <AccountCreationCard accountsCount={accountsCount} onCreated={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
