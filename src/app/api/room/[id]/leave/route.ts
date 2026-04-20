import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { participantId } = (await req.json().catch(() => ({}))) as {
    participantId?: string;
  };
  if (!participantId) return NextResponse.json({ ok: true });

  const supabase = createClient();
  await supabase
    .from("room_participants")
    .delete()
    .eq("room_id", params.id)
    .eq("participant_id", participantId);

  return NextResponse.json({ ok: true });
}
