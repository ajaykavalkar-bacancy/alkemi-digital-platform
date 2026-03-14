"use client";

import { useState, useTransition } from "react";
import { Loader2, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { type AccountType } from "@/lib/types";
import { useToast } from "@/components/toast-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ACCOUNT_TYPES: { value: AccountType; label: string; description: string }[] = [
  { value: "checking", label: "Checking account", description: "Everyday spending and incoming deposits." },
  { value: "savings", label: "Savings account", description: "Store funds for goals and earn interest." },
  { value: "credit", label: "Credit account", description: "Track your line of credit or virtual card." },
];

export function AccountCreationCard({
  accountsCount,
  onCreated,
}: {
  accountsCount: number;
  onCreated?: () => void;
}) {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>(ACCOUNT_TYPES[0].value);
  const [balance, setBalance] = useState("0.00");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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

  async function handleCreate() {
    setError("");
    setMessage("");
    setIsLoading(true);

    const trimmedBalance = balance.trim();
    const parsedBalance = Number(trimmedBalance || 0);

    if (Number.isNaN(parsedBalance) || parsedBalance < 0) {
      setError("Enter a valid opening balance (zero is fine).");
      toast({ title: "Enter a valid opening balance.", variant: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType, balance: parsedBalance }),
      });

      const payload = await readJson<{ error?: string }>(response);

      if (!response.ok) {
        const errorMessage = payload?.error ?? "Unable to create account.";
        setError(errorMessage);
        toast({ title: errorMessage, variant: "error" });
        return;
      }

      const successMessage = `${ACCOUNT_TYPES.find((type) => type.value === accountType)?.label ?? "Account"} created.`;
      setMessage(successMessage);
      toast({ title: successMessage, variant: "success" });
      setBalance("0.00");

      startTransition(() => router.refresh());
      onCreated?.();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-emerald-300/60">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <CardTitle className="text-lg">Add an account</CardTitle>
        </div>
        <CardDescription>
          {accountsCount >= 2
            ? "Need more coverage? Add another account to keep transfers flexible."
            : "Add two connected accounts so you can move money between savings, checking, or credit lines."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Real banking flows require a funding source and a destination. Create an account with your preferred type and optionally fund it with an opening balance. Once you have two funded accounts you can run transfers.
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="account-type">Account type</Label>
            <Select value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
              <SelectTrigger id="account-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{ACCOUNT_TYPES.find((type) => type.value === accountType)?.description}</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="opening-balance">Opening balance</Label>
            <Input
              id="opening-balance"
              type="number"
              min="0"
              step="0.01"
              value={balance}
              onChange={(event) => setBalance(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">Tip: add a minimum of $5 to keep transfers unlocked.</p>
          </div>
        </div>
        <Button
          className="w-full"
          type="button"
          onClick={() => void handleCreate()}
          disabled={isPending || isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
          {isLoading ? "Creating..." : "Create account"}
        </Button>
        {message ? (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            {message}
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
