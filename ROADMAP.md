# Bandirector Roadmap

Bandirector is a **musician workflow**: start with an idea or song, build it,
learn what is missing, practice it, and play it with other people. Each surface
shares the same Song Workspace and core (music theory, chord rendering, real
instrument sounds, mobile-first UI).

The primary navigation is **Today → Create → Songs → Jam → Learn**. Coach and
chord review are modes inside a Song Workspace rather than disconnected
destinations.

## 1. Jam Together — *shipped*

Upload a song, analyze its chords/tempo/key in the browser, and everyone joins a
synced room to play their part (instrument + style views, host transport, synced
lyrics). This is the original Bandirector flow, now one part of the app.

## 2. Songwriter Studio — *shipped (v2: whole songs)*

A GarageBand-style sketchpad for getting a whole song idea down fast, then
taking it somewhere else to finish:

- **Sections** — Intro / Verse / Pre-chorus / Chorus / Bridge / Solo / Outro,
  each with its own chord progression (one bar per chord, looping to fill the
  section's length), reorderable, duplicable, colour-coded.
- **An arrangement grid** — one row per instrument, one column per section.
  A filled block means the instrument plays there; a dashed one means it sits
  out. Click to bring an instrument in, double-click (or Delete) to take it
  out. The block shows the groove it plays and stretches with the section's
  length, so the whole song is readable at a glance.
- **Grooves** — every instrument has a default step pattern (melodic hits +
  articulation, a drum grid, or a two-hand keyboard comp) and any block can be
  given its own for just that section.
- **Chords that mean what they say** — the progression editor shows the
  chords in the song key; Triads / 7ths / 9ths rewrites the section's chords
  rather than hiding a global colour setting. A MIDI keyboard can play chords
  straight in.
- **Transport** — play the whole song, loop the selected section, or play from
  a section. One lookahead scheduler keeps every part sample-accurate under a
  shared BPM + bar clock; a playhead runs across the grid.
- **Export MIDI** — a format-1 Standard MIDI File with one track per
  instrument, GM program changes, drums on channel 10, section markers and the
  tempo, so the sketch lands in GarageBand / Logic / Ableton on separate tracks.

Audio is browser-only: one shared `AudioContext`, a custom lookahead scheduler
(the Web Audio "two clocks" pattern), and smplr for real GM instrument timbres.
The song autosaves locally (and the previous single-loop Studio project is
lifted into a one-section song the first time the page opens).

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

### Next workflow upgrades

- Named projects, cloud sync, sharing, and audio export.
- Tempo automation, per-bar chord splits, and arrangement transforms.
- Analysis confidence review and correction history before a song enters a Jam.
- Adaptive Coach practice plans and Learn-to-song recommendations.
- Jam lobby readiness, role-aware stages, rehearsal marks, and session recaps.
