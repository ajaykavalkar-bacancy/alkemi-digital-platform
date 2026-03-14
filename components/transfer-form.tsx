"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, CheckCircle2, Loader2 } from "lucide-react";
import { type Account } from "@/lib/types";
import { formatAccountType, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/toast-provider";

export function TransferForm({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id ?? "");
  const [toAccount, setToAccount] = useState(accounts[1]?.id ?? accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("250");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const source = useMemo(() => accounts.find((account) => account.id === fromAccount), [accounts, fromAccount]);
  const destination = useMemo(() => accounts.find((account) => account.id === toAccount), [accounts, toAccount]);

  async function handleTransfer() {
    setMessage("");
    setError("");
    setIsLoading(true);

    const parsedAmount = Number(amount);

    if (!fromAccount || !toAccount || fromAccount === toAccount || !parsedAmount || parsedAmount <= 0) {
      const errorMessage = "Choose two different accounts and enter a valid amount.";
      setError(errorMessage);
      toast({ title: errorMessage, variant: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAccount, toAccount, amount: parsedAmount }),
      });

      const payload = await readJson<{ error?: string; message?: string }>(response);

      if (!response.ok) {
        const errorMessage = payload?.error ?? "Transfer failed.";
        setError(errorMessage);
        toast({ title: errorMessage, variant: "error" });
        return;
      }

      const successMessage = payload?.message ?? "Transfer completed successfully.";
      setMessage(successMessage);
      toast({ title: successMessage, variant: "success" });
      startTransition(() => router.refresh());
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Move money</CardTitle>
          <CardDescription>Transfer funds instantly between your linked accounts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="from-account">Source account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger id="from-account">
                <SelectValue placeholder="Choose an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {formatAccountType(account.account_type)} · {formatCurrency(account.balance)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-account">Destination account</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger id="to-account">
                <SelectValue placeholder="Choose an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {formatAccountType(account.account_type)} · {formatCurrency(account.balance)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={() => void handleTransfer()}
            disabled={isPending || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
            {isLoading ? "Processing..." : "Confirm transfer"}
          </Button>

          {message ? (
            <div className="flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </div>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      <Card className="bg-slate-950 text-white">
        <CardHeader>
          <CardTitle className="text-white">Confirmation</CardTitle>
          <CardDescription className="text-slate-300">Review the transfer before you submit it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">From</p>
            <p className="mt-2 text-lg font-medium text-white">
              {source ? `${formatAccountType(source.account_type)} · ${formatCurrency(source.balance)}` : "Select source"}
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">To</p>
            <p className="mt-2 text-lg font-medium text-white">
              {destination
                ? `${formatAccountType(destination.account_type)} · ${formatCurrency(destination.balance)}`
                : "Select destination"}
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-teal-500/30 to-sky-500/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-teal-200">Transfer amount</p>
            <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(Number(amount || 0))}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
