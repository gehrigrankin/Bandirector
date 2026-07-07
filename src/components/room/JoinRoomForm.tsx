"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { normalizeCode } from "@/lib/utils/code";

const SLOTS = [0, 1, 2, 3, 4, 5];

export function JoinRoomForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

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
    <form onSubmit={onSubmit} className="space-y-4">
      <div
        className="relative"
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        <div className="flex justify-center gap-2">
          {SLOTS.map((i) => {
            const char = code[i];
            const active = focused && i === code.length;
            return (
              <div
                key={i}
                className={cn(
                  "flex h-16 w-[52px] items-center justify-center rounded-xl border font-mono text-[26px] font-semibold transition-colors",
                  char
                    ? "border-jam/40 bg-[#0f1a19] text-jam"
                    : active
                      ? "border-jam bg-[#0f1a19]"
                      : "border-line bg-[#15151c] text-text-dim",
                )}
              >
                {char ?? (active ? <span className="h-7 w-0.5 bg-jam" /> : "")}
              </div>
            );
          })}
        </div>
        <input
          ref={inputRef}
          name="code"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          maxLength={6}
          value={code}
          aria-label="Room code"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setError(null);
            setCode(normalizeCode(e.target.value).slice(0, 6));
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      {error ? (
        <p className="text-center text-xs text-danger">{error}</p>
      ) : null}
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-jam text-[15px] font-semibold text-black transition-colors hover:bg-jam-soft"
      >
        Join jam
      </button>
    </form>
  );
}
