"use client";

import type { RefObject } from "react";
import type { Database, PlaybackState } from "@/lib/types/database";
import { usePlaybackClock } from "@/lib/hooks/usePlaybackClock";
import { chordAtTimeMs } from "@/lib/analysis/timeline";
import { AcousticGuitarRhythm } from "@/components/instrument-views/AcousticGuitarRhythm";
import { AcousticGuitarFingerstyle } from "@/components/instrument-views/AcousticGuitarFingerstyle";
import { AcousticGuitarArpeggiated } from "@/components/instrument-views/AcousticGuitarArpeggiated";
import { ElectricLeadView } from "@/components/instrument-views/ElectricLeadView";
import { BassView } from "@/components/instrument-views/BassView";
import { PianoView } from "@/components/instrument-views/PianoView";
import { VocalsView } from "@/components/instrument-views/VocalsView";
import { DrumsView } from "@/components/instrument-views/DrumsView";
import { ChordTimeline } from "@/components/song/ChordTimeline";

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface Props {
  song: Song | null;
  playback: PlaybackState;
  instrument: string;
  style: string;
  audioRef: RefObject<HTMLAudioElement>;
}

export function SongStage({ song, playback, instrument, style, audioRef }: Props) {
  const positionMs = usePlaybackClock(playback);

  if (!song) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-center text-text-muted">
        <div>
          <p className="text-lg">Waiting for the host to pick a song.</p>
          <p className="mt-1 text-sm text-text-dim">
            When they do, your instrument view will appear here.
          </p>
        </div>
      </div>
    );
  }

  if (song.status !== "ready") {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-center text-text-muted">
        <div>
          <p className="text-lg">{song.title}</p>
          <p className="mt-2 text-sm">
            {song.status === "analyzing"
              ? "Analyzing… this runs once per song."
              : song.status === "pending"
                ? "Preparing song…"
                : "This song couldn't be analyzed."}
          </p>
        </div>
      </div>
    );
  }

  const at = chordAtTimeMs(song.analysis_json, positionMs);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <audio ref={audioRef} preload="auto" playsInline />

      <div className="flex-1 overflow-y-auto">
        <InstrumentView
          instrument={instrument}
          style={style}
          song={song}
          positionMs={positionMs}
          chordAt={at}
        />
      </div>

      <div className="border-t border-border bg-bg-raised">
        <ChordTimeline
          analysis={song.analysis_json}
          positionMs={positionMs}
          compact
        />
      </div>
    </div>
  );
}

function InstrumentView(props: {
  instrument: string;
  style: string;
  song: Song;
  positionMs: number;
  chordAt: ReturnType<typeof chordAtTimeMs>;
}) {
  const { instrument, style } = props;

  if (instrument === "acoustic_guitar") {
    if (style === "fingerstyle") return <AcousticGuitarFingerstyle {...props} />;
    if (style === "arpeggiated") return <AcousticGuitarArpeggiated {...props} />;
    return <AcousticGuitarRhythm {...props} />;
  }
  if (instrument === "electric_guitar") {
    return <ElectricLeadView {...props} />;
  }
  if (instrument === "bass") return <BassView {...props} />;
  if (instrument === "piano") return <PianoView {...props} />;
  if (instrument === "vocals") return <VocalsView {...props} />;
  if (instrument === "drums") return <DrumsView {...props} />;
  return <AcousticGuitarRhythm {...props} />;
}
