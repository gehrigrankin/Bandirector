"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INSTRUMENTS, stylesFor } from "@/lib/instruments";

interface Props {
  initialName: string;
  roomCode: string;
  onSubmit: (
    displayName: string,
    instrument: string,
    style: string,
  ) => Promise<void> | void;
}

export function NameInstrumentDialog({ initialName, onSubmit, roomCode }: Props) {
  const [name, setName] = useState(initialName);
  const [instrument, setInstrument] = useState<string>("acoustic_guitar");
  const [style, setStyle] = useState<string>("rhythm");
  const [submitting, setSubmitting] = useState(false);

  const styles = stylesFor(instrument);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await onSubmit(name.trim(), instrument, style);
    setSubmitting(false);
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-10 safe-top safe-bottom">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[360px] w-[500px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(63,217,197,0.10),transparent_70%)]" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-[18px] border border-line bg-bg-raised p-6"
      >
        <div>
          <h1 className="font-display text-xl font-bold">Join room</h1>
          <p className="mt-1 text-sm text-text-muted">
            You&apos;re joining{" "}
            <span className="font-mono tracking-[0.3em] text-jam">
              {roomCode}
            </span>
          </p>
        </div>

        <Input
          label="Your name"
          name="displayName"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          label="Instrument"
          value={instrument}
          onChange={(e) => {
            const next = e.target.value;
            setInstrument(next);
            const first = stylesFor(next)[0];
            setStyle(first?.value ?? "rhythm");
          }}
        >
          {INSTRUMENTS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </Select>

        {styles.length > 1 ? (
          <Select
            label="Style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {styles.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        ) : null}

        <Button
          type="submit"
          variant="jam"
          size="lg"
          className="w-full"
          loading={submitting}
        >
          Join jam
        </Button>
      </form>
    </main>
  );
}
