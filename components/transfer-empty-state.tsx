"use client";

import { ArrowRightLeft, Sparkles, Wallet } from "lucide-react";
import { AccountCreationDialog } from "@/components/account-creation-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TransferEmptyState({ accountsCount }: { accountsCount: number }) {
  return (
    <Card className="relative overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:border-emerald-400/20 dark:from-emerald-950/30 dark:via-slate-950/70 dark:to-sky-950/30">
      <div className="pointer-events-none absolute -left-10 top-6 h-28 w-28 rounded-full bg-emerald-300/30 blur-2xl" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full bg-sky-300/30 blur-3xl" />
      <CardHeader>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-200">
          <Sparkles className="h-3.5 w-3.5" />
          Transfer prep
        </div>
        <CardTitle className="mt-4 text-2xl">Link accounts before moving money</CardTitle>
        <CardDescription>
          Transfers need at least two accounts. Add a checking, savings, or credit account and fund it to unlock transfers.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[1.2fr,0.8fr] md:items-center">
        <div className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/60 bg-white/70 px-4 py-3 dark:border-emerald-400/20 dark:bg-slate-950/40">
            <Wallet className="h-4 w-4 text-emerald-500" />
            <span>Create your first account and set an opening balance.</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-sky-200/60 bg-white/70 px-4 py-3 dark:border-sky-400/20 dark:bg-slate-950/40">
            <ArrowRightLeft className="h-4 w-4 text-sky-500" />
            <span>Add a second account to enable transfers instantly.</span>
          </div>
        </div>

        <AccountCreationDialog accountsCount={accountsCount} autoOpen>
          <Button className="w-full" size="lg">
            <Wallet className="h-4 w-4" />
            Add an account
          </Button>
        </AccountCreationDialog>
      </CardContent>
    </Card>
  );
}
