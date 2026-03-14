"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Bot, Loader2, RefreshCcw, TrendingUp } from "lucide-react";
import { type Account, type FinancialInsight, type Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AiCopilotProps {
  accounts: Account[];
  transactions: Transaction[];
  initialInsight?: FinancialInsight | null;
}

export function AiCopilot({ accounts, transactions, initialInsight = null }: AiCopilotProps) {
  const [insight, setInsight] = useState<FinancialInsight | null>(initialInsight);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function readJson<T>(response: Response): Promise<T | null> {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return null;
    }

    try {
      return (await response.json()) as T;
    } catch {
      return null;
    }
  }

  const loadInsight = useCallback(async () => {
    setError("");

    const response = await fetch("/api/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accounts, transactions: transactions.slice(0, 30) }),
    });

    if (!response.ok) {
      setError("Unable to generate insights right now.");
      return;
    }

    const payload = await readJson<FinancialInsight>(response);

    if (!payload) {
      setError("Unable to generate insights right now.");
      return;
    }

    setInsight(payload);
  }, [accounts, transactions]);

  useEffect(() => {
    if (!initialInsight) {
      void loadInsight();
    }
  }, [initialInsight, loadInsight]);

  return (
    <Card className="overflow-hidden bg-slate-950 text-white">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge className="mb-3 bg-white/10 text-teal-200">AI Financial Copilot</Badge>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5 text-teal-300" />
              Personalized account guidance
            </CardTitle>
            <CardDescription className="mt-2 text-slate-300">
              Generated from your latest 30 transactions and current balances.
            </CardDescription>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/10 text-white hover:bg-white/15"
            onClick={() => startTransition(() => void loadInsight())}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            {isPending ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Spending insight</p>
          <p className="mt-3 text-sm text-slate-100">{insight?.spending_insight ?? "Generating insight..."}</p>
        </div>
        <div className="rounded-3xl bg-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Saving tip</p>
          <p className="mt-3 text-sm text-slate-100">{insight?.saving_tip ?? "Generating recommendation..."}</p>
        </div>
        <div className="rounded-3xl bg-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Anomaly detection</p>
          <p className="mt-3 text-sm text-slate-100">{insight?.anomaly_detection ?? "Scanning recent activity..."}</p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-teal-500/30 to-sky-500/20 p-4">
          <div className="flex items-center gap-2 text-teal-200">
            <TrendingUp className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.2em]">Projected balance in 7 days</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {insight ? formatCurrency(insight.predicted_balance_7_days) : "..."}
          </p>
        </div>
        {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
