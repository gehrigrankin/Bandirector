"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Circle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TopicStatus } from "@/lib/types/database";
import type { Topic, Track } from "@/lib/learning/curriculum";
import { LESSONS } from "@/lib/learning/lessons";
import { TOPIC_VISUALS } from "@/lib/learning/visuals";
import { DEPTH_ACCENT, DEPTH_BG } from "@/lib/learning/depth";
import {
  loadLocalWithGuest,
  saveLocalTopic,
} from "@/lib/learning/progressStore";
import { LessonVisuals } from "@/components/learn/visuals/LessonVisuals";
import { cn } from "@/lib/utils/cn";

type DisplayStatus = TopicStatus | "none";

interface TopicLink {
  id: string;
  title: string;
}

const NEXT_STATUS: Record<DisplayStatus, TopicStatus | null> = {
  none: "learning",
  learning: "known",
  known: null,
};

const STATUS_LABEL: Record<DisplayStatus, string> = {
  none: "Start learning",
  learning: "Mark as known",
  known: "Known — tap to reset",
};

export function LessonView({
  topic,
  tierName,
  depth,
  userId,
  initialStatus,
  track,
  prev,
  next,
}: {
  topic: Topic;
  tierName: string;
  depth: number;
  userId: string | null;
  initialStatus: DisplayStatus;
  track: Track;
  prev: TopicLink | null;
  next: TopicLink | null;
}) {
  const accent = DEPTH_ACCENT[depth - 1];
  const bg = DEPTH_BG[depth - 1];
  const lesson = LESSONS[topic.id];
  const visuals = TOPIC_VISUALS[topic.id] ?? [];
  const [status, setStatus] = useState<DisplayStatus>(initialStatus);

  const supabase = useMemo(
    () => (userId !== null ? createClient() : null),
    [userId],
  );

  // The device may know something the server didn't (table missing, no DB).
  useEffect(() => {
    if (initialStatus !== "none") return;
    const local = loadLocalWithGuest(userId)[topic.id];
    if (local) setStatus(local);
  }, [userId, topic.id, initialStatus]);

  async function cycle() {
    const nextStatus = NEXT_STATUS[status];
    setStatus(nextStatus ?? "none");
    saveLocalTopic(userId, topic.id, nextStatus);

    if (!supabase || userId === null) return;
    if (nextStatus === null) {
      await supabase
        .from("learning_progress")
        .delete()
        .eq("user_id", userId)
        .eq("topic_id", topic.id);
    } else {
      await supabase.from("learning_progress").upsert({
        user_id: userId,
        topic_id: topic.id,
        status: nextStatus,
        updated_at: new Date().toISOString(),
      });
    }
  }

  const href = (t: TopicLink) => `/learn/${t.id}?track=${track}`;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 md:gap-6 md:px-8 md:py-8">
      {/* header */}
      <div>
        <Link
          href="/learn"
          className="mb-4 inline-flex items-center gap-1 text-[12px] text-text-muted transition-colors hover:text-text"
        >
          <ChevronLeft className="size-3.5" strokeWidth={1.8} />
          The iceberg
        </Link>
        <div
          className="rounded-2xl border border-line p-4 sm:p-5 md:p-6"
          style={{ background: bg, borderLeft: `3px solid ${accent}` }}
        >
          <div
            className="font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: accent }}
          >
            Depth {depth} · {tierName}
            {topic.kind === "theory" ? " · theory, counts for both tracks" : ""}
          </div>
          <h1 className="mt-1.5 font-display text-[25px] font-bold leading-tight sm:text-[28px] md:text-3xl">
            {topic.title}
          </h1>
          <p className="mt-1.5 text-[13px] text-text-muted">{topic.summary}</p>
          <button
            onClick={cycle}
            className={cn(
              "mt-4 flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold transition-colors",
              status === "known"
                ? "border-ok/40 bg-ok/10 text-ok"
                : status === "learning"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line text-text-soft hover:border-text-muted",
            )}
          >
            {status === "known" ? (
              <Check className="size-4" strokeWidth={2.2} />
            ) : (
              <Circle
                className={cn(
                  "size-3",
                  status === "learning" && "fill-current",
                )}
              />
            )}
            {STATUS_LABEL[status]}
          </button>
          <Link href="/studio" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent-soft">
            Try this in Studio <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {lesson ? (
        <>
          {/* intro */}
          <div className="flex flex-col gap-3">
            {lesson.intro.map((p, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-text-soft">
                {p}
              </p>
            ))}
          </div>

          {/* sections */}
          {lesson.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-2">
              <h2
                className="font-mono text-[11px] uppercase tracking-[0.14em]"
                style={{ color: accent }}
              >
                {section.heading}
              </h2>
              {section.body.map((p, i) => (
                <p
                  key={i}
                  className="text-[14px] leading-relaxed text-text-soft"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* interactive visuals */}
          {visuals.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h2
                className="font-mono text-[11px] uppercase tracking-[0.14em]"
                style={{ color: accent }}
              >
                Try it — tap to hear
              </h2>
              <LessonVisuals visuals={visuals} accent={accent} />
            </section>
          ) : null}

          {/* practice */}
          <section className="flex flex-col gap-2">
            <h2
              className="font-mono text-[11px] uppercase tracking-[0.14em]"
              style={{ color: accent }}
            >
              Practice
            </h2>
            <ol className="flex list-decimal flex-col gap-1.5 pl-5 marker:text-text-dim">
              {lesson.practice.map((step, i) => (
                <li
                  key={i}
                  className="text-[14px] leading-relaxed text-text-soft"
                >
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {lesson.watchOut ? (
            <div className="rounded-xl border border-[#f0655a]/25 bg-[#f0655a]/[0.06] px-4 py-3 text-[13px] leading-relaxed">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#f0655a]">
                Watch out
              </span>{" "}
              <span className="text-text-soft">{lesson.watchOut}</span>
            </div>
          ) : null}
        </>
      ) : null}

      {/* checkpoint */}
      <div
        className="rounded-xl border border-line-soft bg-black/20 px-4 py-3 text-[13px] leading-relaxed"
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

      {/* prev / next */}
      <div className="mt-1 grid grid-cols-2 gap-2.5 border-t border-line-soft pt-5 sm:gap-3">
        {prev ? (
          <Link
            href={href(prev)}
            className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl border border-line-soft px-4 py-3 transition-colors hover:border-line"
          >
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-text-dim">
              <ArrowLeft className="size-3" strokeWidth={1.8} /> Previous
            </span>
            <span className="truncate text-[13px] font-semibold text-text-soft">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={href(next)}
            className="flex min-w-0 flex-1 flex-col items-end gap-0.5 rounded-xl border border-line-soft px-4 py-3 text-right transition-colors hover:border-line"
          >
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-text-dim">
              Next <ArrowRight className="size-3" strokeWidth={1.8} />
            </span>
            <span className="w-full truncate text-[13px] font-semibold text-text-soft">
              {next.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
