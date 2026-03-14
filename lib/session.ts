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
  } catch {
    redirect("/login?error=Authentication%20failed.%20Check%20Supabase%20configuration.");
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
  } catch {
    redirect("/signup?error=Sign%20up%20failed.%20Check%20Supabase%20configuration.");
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
