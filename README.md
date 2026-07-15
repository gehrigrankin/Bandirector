# Bandirector

Bandirector is a multi-part music app. The two parts shipping today:

- **Songwriter Studio** (`/studio`) — a chord + loop workstation. Pick a root and
  quality, choose a playing style for an instrument, loop it, and lock loops to
  layer a full arrangement of real (soundfont) instruments under one transport.
- **Jam Together** (`/jam`) — the real-time jam: a host uploads an MP3, the
  browser analyzes chords/tempo/key, and everyone picks their instrument + style
  and sees their part synced to a timeline.

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
  Songwriter Studio
- **Web Worker** audio analysis (essentia.js / chord-detector)
- **LRCLIB** for synced lyrics

## Quickstart

```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Apply the schema in `supabase/migrations/0001_init.sql` to your Supabase project (SQL editor or `supabase db push`).

Create a public storage bucket named `songs` for MP3 uploads.

## Implementation order (from the spec)

1. Scaffold Next.js + Supabase + auth + schema + RLS
2. Landing + room creation + join + lobby with Realtime
3. Upload + metadata form
4. Web Worker analysis
5. LRCLIB lyrics
6. Chord timeline + playback + sync + host controls
7. Acoustic guitar rhythm view
8. Remaining instrument views
9. Manual chord correction
10. Favorites
