"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, SlidersHorizontal, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function AccountSettings({ email, initials, canSignOut = false }: { email?: string | null; initials: string; canSignOut?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      <section className="rounded-2xl border border-line bg-bg-card p-4 sm:rounded-3xl sm:p-5 md:p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/15 font-display text-xl font-bold text-accent">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="font-semibold">Your account</p>
            <p className="truncate text-sm text-text-muted">{email ?? "Guest mode"}</p>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="rounded-2xl border border-line-soft bg-bg-card p-3.5 sm:p-4">
          <UserRound className="size-5 text-accent" />
          <p className="mt-3 text-sm font-semibold">Musician profile</p>
          <p className="mt-1 hidden text-xs leading-relaxed text-text-muted sm:block">Set your instruments and preferred practice mode.</p>
        </div>
        <div className="rounded-2xl border border-line-soft bg-bg-card p-3.5 sm:p-4">
          <SlidersHorizontal className="size-5 text-jam" />
          <p className="mt-3 text-sm font-semibold">Audio settings</p>
          <p className="mt-1 hidden text-xs leading-relaxed text-text-muted sm:block">Tune latency, metronome, and MIDI preferences.</p>
        </div>
      </section>
      {canSignOut ? (
        <Button variant="secondary" className="w-full sm:w-auto" onClick={signOut} loading={loading}>
          <LogOut className="size-4" /> Sign out
        </Button>
      ) : (
        <p className="rounded-2xl border border-line-soft bg-bg-card px-4 py-3 text-sm text-text-muted">
          Guest mode is ready on this device. Sign in when you want cloud sync and shared rooms.
        </p>
      )}
    </div>
  );
}
