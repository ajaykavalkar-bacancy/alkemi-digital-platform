import { NextResponse } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const requestSchema = z.object({
  status: z.enum(["active", "frozen"]).optional(),
  online_payments_enabled: z.boolean().optional(),
  international_enabled: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { cardId: string } },
) {
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid card patch." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("cards")
    .update(parsed.data)
    .eq("id", params.cardId)
    .eq("user_id", viewer.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ...data,
    online_payments_enabled: Boolean(data.online_payments_enabled),
    international_enabled: Boolean(data.international_enabled),
  });
}
