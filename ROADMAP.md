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
The current Studio arrangement is versioned and autosaved locally, so refreshing
or reopening the app resumes the progression, layers, patterns, and mix.

## 3. Song Coach ("how to play a song") — *shipped (v1)*

`/songs/<id>/coach` teaches how to play a specific uploaded song: its chords
and sections and the part for each instrument. Bridges the Jam analysis and the
Studio's instrument/style vocabulary. Future: a full play-along mode.

## 4. Learn / progress tracker — *shipped (v2)*

The **music iceberg** (`/learn`): a six-tier curriculum from the surface (first
chords, note names) down to the trench (counterpoint, transcribing the masters)
for guitar and piano, with shared music-theory topics that count for both
tracks.

Every topic is a **dedicated lesson page** (`/learn/<topic-id>`): intro,
teaching sections, a numbered practice routine, a watch-out (the most common
mistake), the checkpoint, and prev/next navigation that follows your track.
Lessons embed **interactive visuals that make real sound** through the studio
audio engine — tappable guitar chord boxes, a clickable fretboard, a clickable
piano keyboard, and a step-sequence player for scales, progressions, and
rhythm/ear examples (185 visuals across 69 topics; content in
`src/lib/learning/lessons/`, visuals in `src/lib/learning/visuals/`).

Progress is not started → learning → known per topic. It persists per user
(`learning_progress` table) when Supabase is configured, and falls back to
device-local storage for signed-out visitors or deployments without Supabase —
local entries sync up automatically once the DB exists.

Future: drums track, a "quiz me" mode built on the checkpoints, per-topic
drills that link into the Studio/Coach, automatic progress from Coach sessions
and Jams, "what to learn next" suggestions.

---

### Out of scope (recorded, not built yet)

- Named projects, cloud sync, sharing, and MIDI / audio export. The current
  arrangement already autosaves locally as a recovery/resume baseline.
- Song sections (verse / chorus), tempo automation.
- Wiring Studio output into the Jam rooms.
- The "How to play a song" part above.
