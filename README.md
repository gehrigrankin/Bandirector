# Bandirector

A multi-part music app. See **[ROADMAP.md](./ROADMAP.md)** for all the parts.

- **Jam Together** (`/jam`) — host uploads an MP3, the browser analyzes
  chords/tempo/key, and everyone picks their instrument + style and sees their
  part synced to a timeline.
- **Songwriter Studio** (`/studio`) — a chord/loop workstation: pick a chord and
  its variations, choose a playing style per instrument, and lock loops to layer
  a whole band in sync (real sampled instruments via [smplr](https://github.com/danigb/smplr)).

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (Postgres + Auth + Realtime + Storage)
- **Tailwind CSS** (dark theme, mobile-first)
- **Web Worker** audio analysis (essentia.js / chord-detector)
- **smplr** soundfont sampler + sequencer (Songwriter Studio)
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
