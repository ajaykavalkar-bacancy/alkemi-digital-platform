import { NextResponse } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const requestSchema = z.object({
  accountType: z.enum(["checking", "savings", "credit"]),
  balance: z.preprocess((value) => {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }, z.number().min(0)),
});

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid account data." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: viewer.id,
      account_type: parsed.data.accountType,
      balance: parsed.data.balance,
    })
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create account." }, { status: 400 });
  }

  return NextResponse.json({ account: data });
}
