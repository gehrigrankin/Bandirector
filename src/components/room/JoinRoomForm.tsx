"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { normalizeCode } from "@/lib/utils/code";

export function JoinRoomForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeCode(code);
    if (normalized.length !== 6) {
      setError("Room codes are 6 characters");
      return;
    }
    router.push(`/room/${normalized}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        name="code"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        placeholder="ROOMID"
        maxLength={6}
        value={code}
        onChange={(e) => {
          setError(null);
          setCode(e.target.value.toUpperCase());
        }}
        error={error ?? undefined}
        className="text-center text-2xl tracking-[0.3em]"
      />
      <Button type="submit" size="lg" className="w-full">
        Join jam
      </Button>
    </form>
  );
}
