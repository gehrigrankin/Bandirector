# Bandirector

Bandirector is a multi-part music app. The parts shipping today:

- **Songwriter Studio** (`/studio`) — a chord + loop workstation. Pick a root and
  quality, choose a playing style for an instrument, loop it, and lock loops to
  layer a full arrangement of real (soundfont) instruments under one transport.
  The current arrangement autosaves to the device and resumes after a refresh.
- **Jam Together** (`/jam`) — the real-time jam: a host uploads an MP3, the
  browser analyzes chords/tempo/key, and everyone picks their instrument + style
  and sees their part synced to a timeline.
- **Song Coach** (`/songs/<id>/coach`) — learn to play a specific uploaded song:
  its sections, chords, and per-instrument parts.
- **Learn** (`/learn`) — the music iceberg: a six-tier curriculum for guitar and
  piano. Every topic is a full lesson page with interactive diagrams you can
  hear (chord boxes, fretboard, piano keys, play-along sequences), practice
  steps, and a checkpoint, with not started → learning → known progress
  tracking. An account is optional; signed-out progress stays on the device.

Bandirector installs as a phone app (PWA — "Add to Home Screen" / the install
prompt) and takes **MIDI input**: plug a keyboard into your phone or computer
(USB or Bluetooth MIDI), hit *Connect a MIDI keyboard* in the Studio, and play —
notes sound through the selected instrument and held chords are recognized so
you can drop them straight into the progression. Web MIDI works in Chrome/Edge
on Android and desktop; iOS Safari doesn't support it.

See [ROADMAP.md](./ROADMAP.md) for where this is going.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (Postgres + Auth + Realtime + Storage)
- **Tailwind CSS** (dark theme, mobile-first)
- **smplr** (Soundfont + DrumMachine) with a custom lookahead scheduler for the
  Songwriter Studio; the Learn diagrams play through the same engine
- **Web Worker** audio analysis (essentia.js / chord-detector)
- **LRCLIB** for synced lyrics

## Quickstart

```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Supabase is **optional**: without it the Songwriter Studio and Learn work fully
(Learn keeps progress on the device); accounts, uploads, jam rooms, and the
Song Coach need it.

With Supabase, apply the schema in `supabase/migrations/0001_init.sql` to your
project (SQL editor or `supabase db push`). Later migrations (`0002_…` onward)
can be applied by visiting `/migrate?token=<MIGRATE_TOKEN>` — set
`SUPABASE_DB_URL` (the *Transaction pooler* connection string on serverless
hosts) and `MIGRATE_TOKEN` in the environment first (see `.env.example`).

Create a public storage bucket named `songs` for MP3 uploads.
