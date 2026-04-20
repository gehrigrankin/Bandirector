"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CreateRoomButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    try {
      const res = await fetch("/room/create", { method: "POST" });
      const data = (await res.json()) as { code?: string; error?: string };
      if (data.code) router.push(`/room/${data.code}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={create} loading={loading} size="md">
      <Play className="size-4" />
      New room
    </Button>
  );
}
