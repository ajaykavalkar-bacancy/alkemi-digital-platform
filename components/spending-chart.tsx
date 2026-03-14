'use client';

import { useEffect, useState } from "react";
import { type Transaction } from "@/lib/types";
import { formatCompactCurrency, getCategorySpendData, getDailyNetFlow } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function SpendingChart({ transactions }: { transactions: Transaction[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const spendByCategory = getCategorySpendData(transactions).slice(0, 6);
  const cashFlow = getDailyNetFlow(transactions).slice(-10);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending and cash flow</CardTitle>
          <CardDescription>Visualize how money is leaving and entering your accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-3 w-1/3 rounded-full bg-white/10" />
            <div className="h-[280px] rounded-2xl bg-white/10 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending and cash flow</CardTitle>
        <CardDescription>Visualize how money is leaving and entering your accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spend">
          <TabsList>
            <TabsTrigger value="spend">By category</TabsTrigger>
            <TabsTrigger value="flow">Daily flow</TabsTrigger>
          </TabsList>
          <TabsContent value="spend">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.15} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatCompactCurrency} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => formatCompactCurrency(value)} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="flow">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlow}>
                  <defs>
                    <linearGradient id="cashFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.15} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatCompactCurrency} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => formatCompactCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="url(#cashFlow)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
