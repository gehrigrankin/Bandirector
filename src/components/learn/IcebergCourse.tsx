"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Circle,
  Guitar,
  HardDrive,
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
import { DEPTH_ACCENT, DEPTH_BG } from "@/lib/learning/depth";
import {
  clearLocal,
  loadLocal,
  loadLocalWithGuest,
  saveLocal,
} from "@/lib/learning/progressStore";
import { cn } from "@/lib/utils/cn";

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
  /** null on deployments without Supabase — progress stays on this device. */
  userId: string | null;
  initialProgress: Record<string, TopicStatus>;
}) {
  const [track, setTrack] = useState<Track>("guitar");
  const [progress, setProgress] =
    useState<Record<string, TopicStatus>>(initialProgress);
  /** false once a DB write fails (e.g. table missing) — local-only mode. */
  const [dbOk, setDbOk] = useState(userId !== null);

  const supabase = useMemo(
    () => (userId !== null ? createClient() : null),
    [userId],
  );

  // Merge the local mirror in on mount, and push any local-only entries up to
  // the DB (no-op when the table doesn't exist yet — we just flag local mode).
  useEffect(() => {
    const guest = userId !== null ? loadLocal(null) : {};
    const local = loadLocalWithGuest(userId);
    const localOnly = Object.entries(local).filter(
      ([id]) => !(id in initialProgress),
    );
    if (localOnly.length > 0) {
      setProgress((cur) => ({ ...Object.fromEntries(localOnly), ...cur }));
    }

    if (!supabase || userId === null) return;
    if (localOnly.length === 0) {
      if (Object.keys(guest).length > 0) clearLocal(null);
      return;
    }
    void supabase
      .from("learning_progress")
      .upsert(
        localOnly.map(([topic_id, status]) => ({
          user_id: userId,
          topic_id,
          status,
        })),
      )
      .then(({ error }) => {
        if (error) {
          setDbOk(false);
          return;
        }

        // Preserve a per-account mirror before removing the pre-login copy.
        saveLocal(userId, { ...local, ...initialProgress });
        if (Object.keys(guest).length > 0) clearLocal(null);
      });
  }, [userId, initialProgress, supabase]);

  async function cycleStatus(topic: Topic) {
    const current = statusOf(progress, topic.id);
    const next = NEXT_STATUS[current];

    const optimistic = { ...progress };
    if (next === null) delete optimistic[topic.id];
    else optimistic[topic.id] = next;
    setProgress(optimistic);
    saveLocal(userId, optimistic);

    if (!supabase || userId === null) return;

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
      // Keep the change — the local mirror has it; the DB will catch up on a
      // future visit once the table exists.
      console.warn("Progress saved locally only:", error.message);
      setDbOk(false);
    } else if (!dbOk) {
      setDbOk(true);
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
          Tap the circle to mark a topic: not started → learning → known. Open
          a topic for its full lesson — diagrams you can hear, practice steps,
          and the checkpoint. Theory topics count for both instruments.
        </div>
        {!dbOk ? (
          <div className="flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.06] px-3 py-2 text-[11px] text-accent">
            <HardDrive className="size-3.5 flex-shrink-0" strokeWidth={1.8} />
            {userId === null
              ? "Progress saves to this device."
              : "Progress is saving to this device only for now — it will sync to your account automatically once the database is set up."}
          </div>
        ) : null}
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
  onCycle,
}: {
  tier: Tier;
  track: Track;
  progress: Record<string, TopicStatus>;
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

                <Link
                  href={`/learn/${topic.id}?track=${track}`}
                  className="group min-w-0 flex-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[13.5px] font-semibold transition-colors group-hover:text-text",
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
                    <ChevronRight
                      className="ml-auto size-4 flex-shrink-0 text-text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-text-soft"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="mt-0.5 text-[12px] text-text-muted">
                    {topic.summary}
                  </div>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
