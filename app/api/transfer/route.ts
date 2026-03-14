import { NextResponse } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const requestSchema = z.object({
  fromAccount: z.string().min(1),
  toAccount: z.string().min(1),
  amount: z.number().positive(),
});

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid transfer request." }, { status: 400 });
  }

  if (parsed.data.fromAccount === parsed.data.toAccount) {
    return NextResponse.json({ error: "Source and destination must be different." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { error } = await supabase.rpc("execute_transfer", {
    p_from_account: parsed.data.fromAccount,
    p_to_account: parsed.data.toAccount,
    p_amount: parsed.data.amount,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Transfer completed successfully." });
}
