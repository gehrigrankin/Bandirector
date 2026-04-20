"use client";

export async function fetchLrc(
  title: string,
  artist: string,
): Promise<string | null> {
  const url = new URL("https://lrclib.net/api/get");
  url.searchParams.set("track_name", title);
  url.searchParams.set("artist_name", artist);

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "Bandirector/0.1 (https://bandirector.app)" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { syncedLyrics?: string | null };
    return data.syncedLyrics ?? null;
  } catch {
    return null;
  }
}

export interface LrcLine {
  timeSec: number;
  text: string;
}

export function parseLrc(lrc: string | null | undefined): LrcLine[] {
  if (!lrc) return [];
  const lines: LrcLine[] = [];
  for (const raw of lrc.split(/\r?\n/)) {
    const match = raw.match(/^\s*\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);
    if (!match) continue;
    const m = parseInt(match[1], 10);
    const s = parseFloat(match[2]);
    const text = match[3].trim();
    if (Number.isFinite(m) && Number.isFinite(s)) {
      lines.push({ timeSec: m * 60 + s, text });
    }
  }
  lines.sort((a, b) => a.timeSec - b.timeSec);
  return lines;
}

export function lyricAtTimeMs(
  lines: LrcLine[],
  timeMs: number,
): { current: LrcLine | null; next: LrcLine | null; index: number } {
  if (!lines.length) return { current: null, next: null, index: -1 };
  const sec = timeMs / 1000;
  let idx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].timeSec <= sec) idx = i;
    else break;
  }
  return {
    current: idx >= 0 ? lines[idx] : null,
    next: lines[idx + 1] ?? null,
    index: idx,
  };
}
