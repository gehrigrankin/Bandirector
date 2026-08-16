"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CreateRoomButton({ songId, className }: { songId?: string; className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/room/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(songId ? { songId } : {}) });
      const data = (await res.json()) as { code?: string; error?: string };
      if (data.code) router.push(`/room/${data.code}`);
      else setError(data.error ?? "Could not start a room");
    } catch {
      setError("Could not reach the Jam service. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button className="w-full" onClick={create} loading={loading} size="md"><Play className="size-4" />New room</Button>
      {error ? <p className="mt-2 max-w-[180px] text-right text-[11px] text-danger">{error}</p> : null}
    </div>
  );
}
