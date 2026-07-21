# Bandirector Roadmap

Bandirector is a **multi-part music app**: a set of tools for writing, learning,
and playing music together. Each "part" is a focused surface that shares the
same core (music theory, chord rendering, real instrument sounds, mobile-first
UI). The parts captured so far:

## 1. Jam Together — *shipped*

Upload a song, analyze its chords/tempo/key in the browser, and everyone joins a
synced room to play their part (instrument + style views, host transport, synced
lyrics). This is the original Bandirector flow, now one part of the app.

## 2. Songwriter Studio — *shipped*

A chord + loop workstation for writing songs:

- A **chord progression** — build an unlimited sequence (C · Am · F · G); the
  changes are global and every layer follows them in sync.
- A **step sequencer** — program a 16-step pattern per part. Melodic
  instruments toggle which steps fire and pick an articulation (strum / block /
  arpeggio / root / octave); drums get a row per voice (kick/snare/hat/…).
  Presets seed the grid, then everything is editable.
- **Groove + feel** — swing and humanize (micro-timing + velocity) so loops
  breathe instead of sounding quantized.
- A **loop player** that previews the current selection with real instrument
  samples (smplr soundfonts + drum machine).
- **Lock-and-layer** — lock a loop and it joins a multi-track rack; every locked
  loop plays together, sample-accurately in sync, under one global BPM and bar
  clock. Per-track mute / solo / volume.

Audio is browser-only: one shared `AudioContext`, a custom lookahead scheduler
(the Web Audio "two clocks" pattern), and smplr for real GM instrument timbres.

## 3. How to play a song — *future*

A page that teaches how to play a specific song: its chords and sections, the
part for each instrument, and a play-along mode. Bridges the Jam analysis and the
Studio's instrument/style vocabulary.

## 4. Learn / progress tracker — *shipped (v1)*

The **music iceberg** (`/learn`): a six-tier curriculum from the surface (first
chords, note names) down to the trench (counterpoint, transcribing the masters)
for guitar and piano, with shared music-theory topics that count for both
tracks. Each topic has a summary and a concrete checkpoint; you mark topics
not started → learning → known, and progress persists per user
(`learning_progress` table).

Future: drums track, per-topic drills that link into the Studio/Coach,
automatic progress from Coach sessions and Jams, "what to learn next"
suggestions.

---

### Out of scope (recorded, not built yet)

- Saving / exporting progressions, MIDI / audio export.
- Song sections (verse / chorus), tempo automation.
- Wiring Studio output into the Jam rooms.
- The "How to play a song" part above.
