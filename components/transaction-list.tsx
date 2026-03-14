"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { type Transaction } from "@/lib/types";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TransactionListProps {
  transactions: Transaction[];
  compact?: boolean;
}

export function TransactionList({ transactions, compact = false }: TransactionListProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [dateWindow, setDateWindow] = useState(compact ? "all" : "30");
  const [page, setPage] = useState(1);
  const pageSize = compact ? 6 : 8;

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(transactions.map((transaction) => transaction.category)))],
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesQuery =
        transaction.description.toLowerCase().includes(query.toLowerCase()) ||
        transaction.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || transaction.category === category;
      const matchesDate =
        dateWindow === "all" ||
        Date.now() - new Date(transaction.created_at).getTime() <= Number(dateWindow) * 24 * 60 * 60 * 1000;

      return matchesQuery && matchesCategory && matchesDate;
    });
  }, [category, dateWindow, query, transactions]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [query, category, dateWindow]);

  const pageItems = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{compact ? "Recent transactions" : "Transaction history"}</CardTitle>
        <CardDescription>
          {compact
            ? "Latest debits and credits across linked accounts."
            : "Search, filter, and paginate historical account activity."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!compact ? (
          <div className="grid gap-3 md:grid-cols-[1.5fr,1fr,1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search transactions"
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item === "all" ? "All categories" : item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateWindow} onValueChange={setDateWindow}>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All dates</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Timestamp</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{transaction.account_type ?? "Account"}</Badge>
                      <span className="text-xs text-muted-foreground md:hidden">{transaction.category}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.category}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {formatDateTime(transaction.created_at)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-semibold",
                    transaction.type === "credit" ? "text-success" : "text-foreground",
                  )}
                >
                  {transaction.type === "credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!pageItems.length ? <p className="text-sm text-muted-foreground">No transactions match the current filters.</p> : null}

        {!compact && filteredTransactions.length > pageSize ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                disabled={page === pageCount}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
