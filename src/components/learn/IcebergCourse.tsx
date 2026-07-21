"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Circle,
  Guitar,
  Piano,
  Sparkles,
  Waves,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TopicStatus } from "@/lib/types/database";
import {
  ICEBERG,
  TRACKS,
  topicsForTrack,
  trackTopicCount,
  type Tier,
  type Topic,
  type Track,
} from "@/lib/learning/curriculum";
import { cn } from "@/lib/utils/cn";

/** Accent color per depth — sky blue at the surface, violet in the trench. */
const DEPTH_ACCENT = [
  "#7dd3fc",
  "#38bdf8",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
];

const DEPTH_BG = [
  "#141b26",
  "#121826",
  "#101524",
  "#0e1220",
  "#0b0e1a",
  "#090a14",
];

type DisplayStatus = TopicStatus | "none";

function statusOf(
  progress: Record<string, TopicStatus>,
  topicId: string,
): DisplayStatus {
  return progress[topicId] ?? "none";
}

const NEXT_STATUS: Record<DisplayStatus, TopicStatus | null> = {
  none: "learning",
  learning: "known",
  known: null,
};

export function IcebergCourse({
  userId,
  initialProgress,
}: {
  userId: string;
  initialProgress: Record<string, TopicStatus>;
}) {
  const [track, setTrack] = useState<Track>("guitar");
  const [progress, setProgress] =
    useState<Record<string, TopicStatus>>(initialProgress);
  const [expanded, setExpanded] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  async function cycleStatus(topic: Topic) {
    const current = statusOf(progress, topic.id);
    const next = NEXT_STATUS[current];
    const prev = progress;

    const optimistic = { ...progress };
    if (next === null) delete optimistic[topic.id];
    else optimistic[topic.id] = next;
    setProgress(optimistic);

    const { error } =
      next === null
        ? await supabase
            .from("learning_progress")
            .delete()
            .eq("user_id", userId)
            .eq("topic_id", topic.id)
        : await supabase.from("learning_progress").upsert({
            user_id: userId,
            topic_id: topic.id,
            status: next,
            updated_at: new Date().toISOString(),
          });
    if (error) {
      console.error("Failed to save progress", error);
      setProgress(prev);
    }
  }

  const total = trackTopicCount(track);
  const trackTopicIds = new Set(
    ICEBERG.flatMap((tier) => topicsForTrack(tier, track).map((t) => t.id)),
  );
  let known = 0;
  let learning = 0;
  for (const [id, status] of Object.entries(progress)) {
    if (!trackTopicIds.has(id)) continue;
    if (status === "known") known += 1;
    else learning += 1;
  }
  const pct = total === 0 ? 0 : Math.round((known / total) * 100);

  return (
    <div className="flex flex-col gap-5">
      {/* track switcher + overall progress */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-bg-raised p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-line-soft bg-bg p-1">
            {TRACKS.map((t) => {
              const Icon = t.id === "guitar" ? Guitar : Piano;
              const active = track === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTrack(t.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-accent text-black"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.8} />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="ml-auto text-right">
            <div className="font-mono text-lg font-semibold text-accent">
              {pct}%
            </div>
            <div className="text-[11px] text-text-muted">
              {known} known · {learning} learning · {total} topics
            </div>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-[#38bdf8] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[11px] text-text-dim">
          Tap the circle to mark a topic: not started → learning → known. Tap a
          row for its checkpoint. Theory topics count for both instruments.
        </div>
      </div>

      {/* the iceberg */}
      <div className="flex flex-col gap-3">
        {ICEBERG.map((tier, i) => (
          <div key={tier.id} className="flex flex-col gap-3">
            {i === 1 ? (
              <div className="flex items-center gap-3 px-1 text-[#38bdf8]/70">
                <Waves className="size-4" strokeWidth={1.8} />
                <div className="h-px flex-1 bg-gradient-to-r from-[#38bdf8]/40 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.14em]">
                  waterline
                </span>
              </div>
            ) : null}
            <TierCard
              tier={tier}
              track={track}
              progress={progress}
              expanded={expanded}
              onToggleExpand={(id) =>
                setExpanded((cur) => (cur === id ? null : id))
              }
              onCycle={cycleStatus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TierCard({
  tier,
  track,
  progress,
  expanded,
  onToggleExpand,
  onCycle,
}: {
  tier: Tier;
  track: Track;
  progress: Record<string, TopicStatus>;
  expanded: string | null;
  onToggleExpand: (id: string) => void;
  onCycle: (topic: Topic) => void;
}) {
  const accent = DEPTH_ACCENT[tier.depth - 1];
  const topics = topicsForTrack(tier, track);
  const known = topics.filter((t) => progress[t.id] === "known").length;
  const done = topics.length > 0 && known === topics.length;

  return (
    <section
      className="overflow-hidden rounded-2xl border border-line"
      style={{ background: DEPTH_BG[tier.depth - 1] }}
    >
      <div
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line-soft px-5 py-4"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        <span
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: accent }}
        >
          Depth {tier.depth}
        </span>
        <h2 className="font-display text-lg font-bold">{tier.name}</h2>
        <span className="text-[11px] text-text-muted">{tier.tagline}</span>
        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 font-mono text-[12px]",
            done ? "text-ok" : "text-text-muted",
          )}
        >
          {done ? <Sparkles className="size-3.5" strokeWidth={1.8} /> : null}
          {known}/{topics.length}
        </span>
      </div>

      <ul>
        {topics.map((topic) => {
          const status = statusOf(progress, topic.id);
          const isOpen = expanded === topic.id;
          return (
            <li
              key={topic.id}
              className="border-b border-line-soft/60 last:border-b-0"
            >
              <div className="flex items-start gap-3 px-5 py-3">
                <button
                  onClick={() => onCycle(topic)}
                  aria-label={`Status: ${status}. Tap to change.`}
                  title={
                    status === "none"
                      ? "Not started — tap to mark as learning"
                      : status === "learning"
                        ? "Learning — tap to mark as known"
                        : "Known — tap to reset"
                  }
                  className={cn(
                    "mt-0.5 flex size-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
                    status === "known"
                      ? "border-ok bg-ok text-black"
                      : status === "learning"
                        ? "border-accent text-accent"
                        : "border-line text-text-dim hover:border-text-muted",
                  )}
                >
                  {status === "known" ? (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  ) : status === "learning" ? (
                    <Circle className="size-2.5 fill-current" />
                  ) : null}
                </button>

                <button
                  onClick={() => onToggleExpand(topic.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[13.5px] font-semibold",
                        status === "known" && "text-text-muted line-through decoration-ok/50",
                      )}
                    >
                      {topic.title}
                    </span>
                    {topic.kind === "theory" ? (
                      <span className="rounded-full border border-jam/30 bg-jam/[0.08] px-2 py-px text-[9.5px] uppercase tracking-wide text-jam">
                        theory · shared
                      </span>
                    ) : null}
                    {status === "learning" ? (
                      <span className="rounded-full border border-accent/30 bg-accent/[0.08] px-2 py-px text-[9.5px] uppercase tracking-wide text-accent">
                        learning
                      </span>
                    ) : null}
                    <ChevronDown
                      className={cn(
                        "ml-auto size-3.5 flex-shrink-0 text-text-dim transition-transform",
                        isOpen && "rotate-180",
                      )}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="mt-0.5 text-[12px] text-text-muted">
                    {topic.summary}
                  </div>
                  {isOpen ? (
                    <div
                      className="mt-2 rounded-lg border border-line-soft bg-black/20 px-3 py-2 text-[12px]"
                      style={{ borderLeft: `2px solid ${accent}` }}
                    >
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.12em]"
                        style={{ color: accent }}
                      >
                        Checkpoint
                      </span>{" "}
                      <span className="text-text-soft">{topic.goal}</span>
                    </div>
                  ) : null}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
