import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import { type AccountType, type Transaction } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatAccountType(value: AccountType) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function formatDateLabel(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

export function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function maskCardNumber(value: string) {
  return `•••• ${value.slice(-4)}`;
}

export function getTransactionSignedAmount(transaction: Transaction) {
  return transaction.type === "credit" ? transaction.amount : -transaction.amount;
}

export function getCategorySpendData(transactions: Transaction[]) {
  const totals = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] ?? 0) + transaction.amount;
      return acc;
    }, {});

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getDailyNetFlow(transactions: Transaction[]) {
  const totals = transactions.reduce<Record<string, number>>((acc, transaction) => {
    const key = format(new Date(transaction.created_at), "MMM d");
    acc[key] = (acc[key] ?? 0) + getTransactionSignedAmount(transaction);
    return acc;
  }, {});

  return Object.entries(totals).map(([day, value]) => ({ day, value }));
}

export function sumBalances(values: { balance: number }[]) {
  return values.reduce((total, item) => total + item.balance, 0);
}

export function copyText<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
