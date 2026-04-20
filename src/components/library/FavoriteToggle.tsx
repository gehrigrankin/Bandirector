"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

interface Props {
  songId: string;
  initial: boolean;
}

export function FavoriteToggle({ songId, initial }: Props) {
  const [fav, setFav] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setBusy(false);
      return;
    }
    if (fav) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", auth.user.id)
        .eq("song_id", songId);
      setFav(false);
    } else {
      await supabase
        .from("favorites")
        .upsert({ user_id: auth.user.id, song_id: songId });
      setFav(true);
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "rounded-lg p-2 transition-colors",
        fav ? "text-accent" : "text-text-dim hover:text-text",
      )}
    >
      <Star
        className="size-5"
        fill={fav ? "currentColor" : "none"}
        strokeWidth={1.5}
      />
    </button>
  );
}
