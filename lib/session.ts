"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { type Viewer } from "@/lib/types";

export async function getViewer(): Promise<Viewer | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.user_metadata.full_name ?? "MoneyMind User",
    role: profile?.role ?? "customer",
  };
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function requireViewer() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewer();

  if (viewer.role !== "admin") {
    redirect("/dashboard");
  }

  return viewer;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?error=Supabase%20is%20not%20configured");
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
    console.error("loginAction failed", error);
    const message = error instanceof Error ? error.message : "Authentication failed. Check Supabase configuration.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    redirect("/signup?error=Supabase%20is%20not%20configured");
  }

  let data: Awaited<ReturnType<typeof supabase.auth.signUp>>["data"] | null = null;
  let error: Awaited<ReturnType<typeof supabase.auth.signUp>>["error"] | null = null;

  try {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    data = result.data;
    error = result.error;
  } catch (caughtError) {
    if (isNextRedirect(caughtError)) {
      throw caughtError;
    }
    console.error("signupAction failed", caughtError);
    const message =
      caughtError instanceof Error ? caughtError.message : "Sign up failed. Check Supabase configuration.";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      email,
      full_name: fullName || "MoneyMind User",
      role: "customer",
    });
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/login");
}
