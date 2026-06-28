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

- A **chord grid** — 12 roots × quality variations (A, Am, Am7, Asus2, …).
- Per-instrument **playing styles** — rhythm 1/2/3, fingerstyle 1–3, pluck for
  guitars; root / root-fifth / walking / octave for bass; block / arpeggio /
  broken / sustained for keys; sustained / swell / stabs / line for pads,
  strings and winds; rock / pop / funk / folk / ballad / latin for drums.
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

## 4. Learn / progress tracker — *future*

Track what you already know and what's next across categories — guitar, piano,
drums, music theory, and songs learned — with suggestions for what to learn next.

---

### Out of scope (recorded, not built yet)

- Saving / exporting progressions, MIDI / audio export.
- Song sections (verse / chorus), tempo automation.
- Wiring Studio output into the Jam rooms.
- The "How to play a song" and "Learn / progress tracker" parts above.
