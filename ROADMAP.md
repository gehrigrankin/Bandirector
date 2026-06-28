# Bandirector Roadmap

Bandirector is a multi-part music app. Each "part" is a focused tool, reachable
from the hub on the landing page. This file tracks the parts — shipped and
planned — so ideas aren't lost.

## Shipped

### 1. Jam Together (`/jam`)
Upload a song, analyze chords/tempo/key in the browser, and have everyone in a
room play their part on a synced timeline. (The app's original feature.)

### 2. Songwriter Studio (`/studio`)
A chord/loop workstation for writing songs:
- Pick any root (C–B) and expand it into quality variations (A → Am, Am7,
  Asus2, Asus4, Aadd9, A7, Amaj7, A6, Adim, Aaug, …).
- Choose a playing style for the selected instrument (rhythm 1/2/3,
  fingerstyle 1–3, pluck, arpeggio, walking bass, block chords, stabs, …).
- Pick from a full instrument roster — acoustic/electric guitar, bass, drums,
  piano, electric piano, organ, synth pad, trumpet, sax, flute, strings, cello
  — using real sampled sounds (smplr / FluidR3_GM soundfont).
- **Lock a loop** to add it to the track rack; locked loops keep playing in sync
  under one master tempo, so you can stack a whole band. Per-track mute, solo,
  and volume; global BPM and master volume.

Sounds stream from the soundfont CDN on first use, so the studio needs internet
and a brief load the first time each instrument is played.

## Planned

### 3. How to Play a Song
Learn a specific song: its chords, sections (verse/chorus/bridge), and each
instrument's part, with a play-along view.

### 4. Learn & Track Progress
Track what you already know and what to learn next, across categories:
- Instruments — guitar, piano, drums
- Music theory
- Songs learned
- "What's next to learn" queue

## Ideas / later
- Save & share progressions from the Studio (currently in-memory only).
- MIDI / audio (WAV) export of a locked arrangement (smplr supports offline
  render).
- Multi-bar progressions and song sections in the Studio.
- Feed a Studio progression straight into a Jam room.
