"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Music4 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { analyzeAudioFile, type AnalysisResult } from "@/lib/analysis/analyze";
import { fetchLrc } from "@/lib/lyrics/lrclib";

interface Props {
  userId: string;
}

type Stage = "idle" | "uploading" | "analyzing" | "saving" | "done" | "error";

export function UploadForm({ userId }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim() || !artist.trim()) return;
    setError(null);

    const supabase = createClient();
    const bucket = process.env.NEXT_PUBLIC_SONGS_BUCKET ?? "songs";
    const ext = file.name.split(".").pop() ?? "mp3";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    try {
      setStage("uploading");
      setProgressLabel("Uploading…");
      setProgress(5);

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadErr) throw uploadErr;
      setProgress(20);

      const { data: song, error: insertErr } = await supabase
        .from("songs")
        .insert({
          title: title.trim(),
          artist: artist.trim(),
          audio_storage_path: path,
          uploaded_by: userId,
          status: "analyzing",
        })
        .select()
        .single();
      if (insertErr || !song) throw insertErr ?? new Error("Insert failed");

      setStage("analyzing");
      setProgressLabel("Analyzing chords and tempo — this runs once per song, then it's saved forever.");

      const lyricsPromise = fetchLrc(title.trim(), artist.trim()).catch(
        () => null,
      );

      const result: AnalysisResult = await analyzeAudioFile(file, (p, label) => {
        setProgress(20 + Math.round(p * 0.7));
        if (label) setProgressLabel(label);
      });

      const lyrics = await lyricsPromise;

      setStage("saving");
      setProgressLabel("Saving…");
      setProgress(95);

      const { error: updateErr } = await supabase
        .from("songs")
        .update({
          status: "ready",
          key: result.key ?? null,
          bpm: result.bpm ?? null,
          feel: result.feel ?? null,
          analysis_json: {
            version: 1,
            beats: result.beats,
            chords: result.chords,
            key: result.key,
            bpm: result.bpm,
            feel: result.feel,
          },
          lyrics_lrc: lyrics,
        })
        .eq("id", song.id);
      if (updateErr) throw updateErr;

      setProgress(100);
      setStage("done");
      router.push(`/songs/${song.id}/edit`);
    } catch (err) {
      console.error(err);
      setStage("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  const busy = stage !== "idle" && stage !== "error" && stage !== "done";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div
        className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#2e2e38] bg-bg-card p-6 text-center transition-colors hover:border-line"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) setFile(f);
        }}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <span className="flex size-10 items-center justify-center rounded-[11px] bg-accent/[0.12] text-accent">
          <Music4 className="size-[18px]" strokeWidth={1.8} />
        </span>
        {file ? (
          <>
            <div className="text-sm font-semibold">{file.name}</div>
            <div className="font-mono text-[11px] text-text-muted">
              {(file.size / 1024 / 1024).toFixed(1)} MB · MP3
            </div>
            <span className="text-xs font-medium text-accent">Replace file</span>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold">Drop an MP3 here</div>
            <div className="text-xs text-text-muted">
              or click to pick one — MP3 only
            </div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <Input
        label="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        label="Artist"
        required
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />

      {busy ? (
        <div className="rounded-2xl border border-line bg-bg-raised p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-accent">
              {progressLabel || "Analyzing chords & tempo…"}
            </span>
            <span className="font-mono text-xs text-text-muted">
              {progress}%
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line-soft">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#f5a524,#ffc252)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-text-dim">
            Runs once per song, then it&apos;s saved forever. Lyrics are matched
            in the background.
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={busy}
        disabled={!file || !title || !artist}
      >
        {busy ? "Uploading & analyzing…" : "Upload & analyze"}
      </Button>
    </form>
  );
}
