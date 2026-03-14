"use client";

import { FormEvent, useState } from "react";
import { Github, Globe, Mail, Sparkles } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Provider = "google" | "github";

export function AuthAlternativeMethods() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function signInWithProvider(provider: Provider) {
    setLoading(true);
    setFeedback(null);

    try {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setFeedback({ type: "error", message: "Supabase is not configured in this environment." });
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setFeedback({ type: "error", message: error.message });
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setFeedback({ type: "error", message: "Supabase is not configured in this environment." });
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setFeedback({ type: "error", message: error.message });
        return;
      }

      setFeedback({ type: "success", message: "Magic link sent. Check your inbox." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border/70" />
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border/70" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => void signInWithProvider("google")}
          disabled={loading}
          className="w-full"
        >
          <Globe className="h-4 w-4" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void signInWithProvider("github")}
          disabled={loading}
          className="w-full"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Button>
      </div>

      <form onSubmit={sendMagicLink} className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Magic link
        </div>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
          <Mail className="h-4 w-4" />
          Send magic link
        </Button>
      </form>

      {feedback ? (
        <p className={`text-sm ${feedback.type === "error" ? "text-destructive" : "text-success"}`}>
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
