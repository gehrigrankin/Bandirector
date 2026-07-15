"use client";

// Web MIDI input. Listens to every connected MIDI input (so it doesn't matter
// which port a keyboard shows up on), parses note-on/off, and tracks the set
// of currently held notes. Works in Chrome/Edge on desktop and Android —
// including USB-C and Bluetooth MIDI keyboards on a phone. iOS Safari has no
// Web MIDI, so `status` reports "unsupported" there and callers can explain.

import { useCallback, useEffect, useRef, useState } from "react";

export type MidiStatus =
  | "unsupported"
  | "idle"
  | "requesting"
  | "ready"
  | "denied";

export interface MidiNoteEvent {
  type: "on" | "off";
  /** MIDI note number (C4 = 60). */
  note: number;
  /** 1..127 for note-on; 0 for note-off. */
  velocity: number;
}

export interface MidiInputState {
  status: MidiStatus;
  /** Names of the connected MIDI input devices. */
  devices: string[];
  /** Currently held note numbers, ascending. */
  heldNotes: number[];
  /** Request MIDI access. Call from a user gesture (a tap). */
  connect: () => void;
}

export function useMidiInput(onNote?: (e: MidiNoteEvent) => void): MidiInputState {
  const [status, setStatus] = useState<MidiStatus>("idle");
  const [devices, setDevices] = useState<string[]>([]);
  const [heldNotes, setHeldNotes] = useState<number[]>([]);

  const accessRef = useRef<MIDIAccess | null>(null);
  const heldRef = useRef<Set<number>>(new Set());
  // Keep the latest callback without re-binding device handlers per render.
  const onNoteRef = useRef(onNote);
  useEffect(() => {
    onNoteRef.current = onNote;
  });

  useEffect(() => {
    if (typeof navigator === "undefined" || !("requestMIDIAccess" in navigator)) {
      setStatus("unsupported");
    }
  }, []);

  const emitHeld = useCallback(() => {
    setHeldNotes([...heldRef.current].sort((a, b) => a - b));
  }, []);

  const handleMessage = useCallback(
    (ev: Event) => {
      const data = (ev as MIDIMessageEvent).data;
      if (!data || data.length < 2) return;
      const type = data[0] & 0xf0;
      const note = data[1];
      const velocity = data[2] ?? 0;

      if (type === 0x90 && velocity > 0) {
        heldRef.current.add(note);
        emitHeld();
        onNoteRef.current?.({ type: "on", note, velocity });
      } else if (type === 0x80 || (type === 0x90 && velocity === 0)) {
        if (heldRef.current.delete(note)) emitHeld();
        onNoteRef.current?.({ type: "off", note, velocity: 0 });
      } else if (type === 0xb0 && (note === 120 || note === 123)) {
        // All sound off / all notes off
        for (const n of heldRef.current) onNoteRef.current?.({ type: "off", note: n, velocity: 0 });
        heldRef.current.clear();
        emitHeld();
      }
    },
    [emitHeld],
  );

  // (Re)bind to every input port and refresh the device list.
  const attach = useCallback(
    (access: MIDIAccess) => {
      const names: string[] = [];
      access.inputs.forEach((input) => {
        input.onmidimessage = handleMessage;
        names.push(input.name || "MIDI device");
      });
      setDevices(names);
    },
    [handleMessage],
  );

  const connect = useCallback(() => {
    if (accessRef.current) return;
    if (typeof navigator === "undefined" || !("requestMIDIAccess" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    navigator.requestMIDIAccess({ sysex: false }).then(
      (access) => {
        accessRef.current = access;
        attach(access);
        access.onstatechange = () => attach(access);
        setStatus("ready");
      },
      () => setStatus("denied"),
    );
  }, [attach]);

  useEffect(
    () => () => {
      const access = accessRef.current;
      if (access) {
        access.onstatechange = null;
        access.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      }
    },
    [],
  );

  return { status, devices, heldNotes, connect };
}
