import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRoundPlus } from "lucide-react";
import { getViewer, signupAction } from "@/lib/session";
import { AuthAlternativeMethods } from "@/components/auth-alternative-methods";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const viewer = await getViewer();

  if (viewer) {
    redirect("/dashboard");
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <UserRoundPlus className="h-5 w-5" />
          </div>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Create a secure MoneyMind profile with email/password, magic link, or social login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signupAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" type="text" placeholder="Avery Johnson" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Create a password" required />
            </div>
            {searchParams?.error ? <p className="text-sm text-destructive">{decodeURIComponent(searchParams.error)}</p> : null}
            <SubmitButton className="w-full" loadingText="Creating account...">
              Create account
            </SubmitButton>
          </form>
          <AuthAlternativeMethods />

          <p className="mt-6 text-sm text-muted-foreground">
            Already have access?{" "}
            <Link href="/login" className="font-medium text-primary">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
