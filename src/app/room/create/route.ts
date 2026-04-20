import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRoomCode } from "@/lib/utils/code";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRoomCode(6);
    const { data, error } = await supabase
      .from("rooms")
      .insert({ code, host_id: user.id })
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
