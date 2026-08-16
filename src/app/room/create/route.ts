import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRoomCode } from "@/lib/utils/code";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Jam is not configured" }, { status: 503 });
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let songId: string | null = null;
  try {
    const body = (await request.json()) as { songId?: string };
    songId = body.songId ?? null;
  } catch {
    // Empty request bodies are valid when starting a blank room.
  }

  if (songId) {
    const { data: song } = await supabase.from("songs").select("id").eq("id", songId).eq("uploaded_by", user.id).maybeSingle();
    if (!song) return NextResponse.json({ error: "That song is not available in your Songs shelf" }, { status: 404 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRoomCode(6);
    const { data, error } = await supabase
      .from("rooms")
      .insert({ code, host_id: user.id, current_song_id: songId })
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json({ code: data.code, id: data.id });
    }

    if (error && !error.message.toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: "Could not allocate a room code" },
    { status: 500 },
  );
}
