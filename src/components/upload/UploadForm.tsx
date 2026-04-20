"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-muted">
          MP3 file
        </label>
        <div
          className="mt-1.5 flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) setFile(f);
          }}
        >
          <div>
            {file ? (
              <div className="text-sm">
                <div className="font-medium">{file.name}</div>
                <div className="text-text-muted">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                Drop an MP3 here, or click to pick one.
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => fileRef.current?.click()}
            >
              Choose file
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
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

      {stage !== "idle" && stage !== "error" ? (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-text-muted">{progressLabel}</p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={stage !== "idle" && stage !== "error" && stage !== "done"}
        disabled={!file || !title || !artist}
      >
        Upload & analyze
      </Button>
    </form>
  );
}
