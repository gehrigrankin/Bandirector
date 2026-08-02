"use client";

// "Play it in" — connect a MIDI keyboard, hear the selected instrument live,
// and capture the chord you're holding straight into the progression.

import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePlus, Piano } from "lucide-react";
import { getEngine } from "@/lib/audio/engine";
import { getInstrument, type InstrumentId } from "@/lib/audio/instruments";
import { chordSymbol } from "@/lib/music/chord";
import { detectChord, type DetectedChord } from "@/lib/midi/detectChord";
import { useMidiInput, type MidiNoteEvent } from "@/lib/midi/useMidiInput";
import { HandsKeyboard } from "@/components/studio/HandsKeyboard";

interface Props {
  /** The instrument being auditioned; live notes play through it. */
  instrumentId: InstrumentId;
  onAddChord: (root: string, quality: string) => void;
}

export function MidiPanel({ instrumentId, onAddChord }: Props) {
  const engine = useMemo(() => getEngine(), []);
  // Drums can't voice a held chord — fall back to piano for live playing.
  const liveInstrument: InstrumentId = getInstrument(instrumentId).isDrums
    ? "piano"
    : instrumentId;

  const onNote = useCallback(
    (e: MidiNoteEvent) => {
      if (e.type === "on") engine.liveNoteOn(liveInstrument, e.note, e.velocity);
      else engine.liveNoteOff(liveInstrument, e.note);
    },
    [engine, liveInstrument],
  );

  const { status, devices, heldNotes, connect } = useMidiInput(onNote);

  // The last recognized chord sticks around after the keys are released so
  // there's time to tap "Add".
  const [detected, setDetected] = useState<DetectedChord | null>(null);
  useEffect(() => {
    const d = detectChord(heldNotes);
    if (d) setDetected(d);
  }, [heldNotes]);

  // Preload the live soundfont once connected (and when the instrument changes).
  useEffect(() => {
    if (status === "ready") engine.prepareLive(liveInstrument);
  }, [status, engine, liveInstrument]);

  const handleConnect = useCallback(async () => {
    await engine.resume(); // user gesture: unlock audio for live playback
    engine.prepareLive(liveInstrument);
    connect();
  }, [engine, liveInstrument, connect]);

  // Split held notes across the two display octaves: below middle C reads as
  // the left hand, the rest as the chord.
  const bassPcs = heldNotes.filter((n) => n < 60).map((n) => n % 12);
  const chordPcs = heldNotes.filter((n) => n >= 60).map((n) => n % 12);

  const label = (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-dim">
      <Piano className="size-3" />
      Play it in
    </div>
  );

  if (status === "unsupported") {
    return (
      <div className="rounded-2xl border border-line-soft bg-bg-card p-4">
        {label}
        <p className="mt-2 text-[11.5px] leading-relaxed text-text-muted">
          This browser doesn&apos;t support MIDI input. Use Chrome on Android or
          desktop to plug in a keyboard — on iPhone, a Web-MIDI-capable browser
          app is needed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line-soft bg-bg-card p-4">
      <div className="flex items-center gap-2">
        {label}
        {status === "ready" ? (
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="size-1.5 rounded-full bg-ok" />
            {devices.length > 0 ? devices.join(" · ") : "Waiting for a device…"}
          </span>
        ) : null}
      </div>

      {status === "idle" || status === "requesting" || status === "denied" ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={handleConnect}
            disabled={status === "requesting"}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[12px] font-semibold text-text-soft hover:bg-bg-higher disabled:opacity-50"
          >
            <Piano className="size-3.5" />
            {status === "requesting" ? "Waiting for permission…" : "Connect a MIDI keyboard"}
          </button>
          <p className="mt-2 text-[11.5px] leading-relaxed text-text-muted">
            {status === "denied"
              ? "MIDI access was blocked. Allow it in the browser's site settings and try again."
              : "Plug a keyboard into your phone or computer (USB or Bluetooth MIDI). Play chords to hear them and drop them into the progression."}
          </p>
        </div>
      ) : status === "ready" ? (
        <div className="mt-3 flex flex-col gap-3">
          <HandsKeyboard bass={bassPcs} chord={chordPcs} width={320} />
          <div className="flex items-center gap-3">
            {detected ? (
              <>
                <span className="font-display text-[17px] font-semibold text-accent">
                  {chordSymbol(detected.root, detected.quality)}
                </span>
                <button
                  type="button"
                  onClick={() => onAddChord(detected.root, detected.quality)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-semibold text-black"
                >
                  <CirclePlus className="size-3.5" />
                  Add to progression
                </button>
              </>
            ) : (
              <span className="text-[11.5px] text-text-muted">
                Hold a chord (3+ notes) to capture it.
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
