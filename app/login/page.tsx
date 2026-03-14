import Link from "next/link";
import { redirect } from "next/navigation";
import { Landmark, LineChart, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { loginAction, getViewer } from "@/lib/session";
import { AuthAlternativeMethods } from "@/components/auth-alternative-methods";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const viewer = await getViewer();

  if (viewer) {
    redirect("/dashboard");
  }

  return (
    <div className="page-shell relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Card className="hidden overflow-hidden bg-slate-950 text-white lg:block">
          <CardContent className="flex h-full flex-col justify-between p-10">
            <div>
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-100">
                MoneyMind
              </div>
              <h1 className="mt-6 max-w-lg font-display text-6xl font-semibold leading-[1.02] text-white">
                Banking UI crafted for high-stakes stakeholder presentations.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                Present account visibility, transfer workflows, card security controls, alerts, and financial AI in a single polished experience.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <Landmark className="h-4 w-4 text-amber-100" />
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-300">Uptime</p>
                  <p className="mt-1 font-display text-2xl text-white">99.98%</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <LineChart className="h-4 w-4 text-amber-100" />
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-300">Signal score</p>
                  <p className="mt-1 font-display text-2xl text-white">A+</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <ShieldCheck className="h-4 w-4 text-amber-100" />
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-300">Secure mode</p>
                  <p className="mt-1 font-display text-2xl text-white">RLS</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-gradient-to-br from-teal-500/25 to-amber-400/15 p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-teal-200" />
                <p className="font-medium text-white">Authentication options</p>
              </div>
              <p className="mt-4 text-sm text-slate-200">Email/password login is enabled.</p>
              <p className="mt-1 text-sm text-slate-200">Magic link and social sign-in are available.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mx-auto w-full max-w-xl border-amber-300/50">
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <CardTitle className="font-display text-4xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your MoneyMind workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={loginAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              {searchParams?.error ? <p className="text-sm text-destructive">{decodeURIComponent(searchParams.error)}</p> : null}
              <SubmitButton className="w-full" loadingText="Signing in...">
                Sign in
              </SubmitButton>
            </form>
            <AuthAlternativeMethods />

            <div className="mt-6 rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Platform highlights</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>Transfer simulation with double-entry updates and alerts</p>
                <p>AI copilot with structured financial insight output</p>
                <p>Admin command view for user and transaction oversight</p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              New to MoneyMind?{" "}
              <Link href="/signup" className="font-medium text-primary">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
