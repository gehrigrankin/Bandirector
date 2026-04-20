import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoomView } from "@/components/room/RoomView";
import { normalizeCode } from "@/lib/utils/code";

export const dynamic = "force-dynamic";

export default async function RoomPage({
  params,
}: {
  params: { code: string };
}) {
  const code = normalizeCode(params.code);
  if (code.length !== 6) notFound();

  const supabase = createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .is("closed_at", null)
    .maybeSingle();

  if (!room) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Room not found</h1>
          <p className="mt-2 text-text-muted">
            This room may have closed. Ask your host for a new code.
          </p>
        </div>
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: song } = room.current_song_id
    ? await supabase
        .from("songs")
        .select("*")
        .eq("id", room.current_song_id)
        .maybeSingle()
    : { data: null };

  return (
    <RoomView
      room={room}
      initialSong={song ?? null}
      isHost={!!user && user.id === room.host_id}
      currentUserId={user?.id ?? null}
    />
  );
}
