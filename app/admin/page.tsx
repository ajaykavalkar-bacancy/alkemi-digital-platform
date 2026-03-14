import { format } from "date-fns";
import { AlertTriangle, Radar, Shield, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminSnapshot } from "@/lib/data";
import { requireAdmin } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  const viewer = await requireAdmin();
  const snapshot = await getAdminSnapshot(viewer);
  const averageTransaction =
    snapshot.transactions.length > 0 ? snapshot.totalVolume / snapshot.transactions.length : 0;
  const flaggedCount = snapshot.transactions
    .slice(0, 20)
    .filter((transaction) => transaction.amount >= averageTransaction * 1.8).length;

  return (
    <AppShell
      viewer={viewer}
      title="Admin"
      description="A simple control room for users, transactions, and platform-wide banking volume."
    >
      <div className="space-y-6">
        <Card className="overflow-hidden bg-slate-950 text-white">
          <CardContent className="relative p-8">
            <div className="pointer-events-none absolute -right-14 -top-12 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-amber-300/15 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.4fr,1fr]">
              <div>
                <Badge className="mb-4 bg-white/10 text-amber-100">Admin command center</Badge>
                <h2 className="font-display text-5xl font-semibold leading-[1.04] text-white">
                  Platform health and transaction oversight in one pane.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Monitor user growth, payment activity, and unusual outliers with controls designed for governance walkthroughs.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <Users className="h-4 w-4 text-amber-100" />
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-300">Users</p>
                  <p className="mt-1 font-display text-3xl text-white">{snapshot.userCount}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <Radar className="h-4 w-4 text-amber-100" />
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-300">Flagged</p>
                  <p className="mt-1 font-display text-3xl text-white">{flaggedCount}</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-white/20 bg-gradient-to-r from-teal-400/25 to-amber-400/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Policy posture</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-teal-100" />
                    <p className="text-sm text-white">RLS policies active and admin scoped access enforced.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-emerald-300/50">
            <CardHeader>
              <CardTitle>Total transaction volume</CardTitle>
              <CardDescription>Combined debit and credit throughput.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-semibold">{formatCurrency(snapshot.totalVolume)}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-300/50">
            <CardHeader>
              <CardTitle>User count</CardTitle>
              <CardDescription>Profiles available to the banking workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-semibold">{snapshot.userCount}</p>
            </CardContent>
          </Card>
          <Card className="border-cyan-300/50">
            <CardHeader>
              <CardTitle>Average transaction</CardTitle>
              <CardDescription>Mean value across loaded transaction rows.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="font-display text-4xl font-semibold">{formatCurrency(averageTransaction)}</p>
                {flaggedCount > 0 ? (
                  <Badge variant="warning">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {flaggedCount} flagged
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Access level and onboarding timestamps.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "warning" : "outline"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(user.created_at), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>System-level activity feed for platform monitoring.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.transactions.slice(0, 12).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
