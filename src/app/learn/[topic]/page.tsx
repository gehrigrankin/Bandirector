import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";
import { AppShell } from "@/components/ui/AppNav";
import { LessonView } from "@/components/learn/LessonView";
import {
  ICEBERG,
  topicsForTrack,
  type Topic,
  type Tier,
  type Track,
} from "@/lib/learning/curriculum";
import type { TopicStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

function findTopic(id: string): { topic: Topic; tier: Tier } | null {
  for (const tier of ICEBERG) {
    const topic = tier.topics.find((t) => t.id === id);
    if (topic) return { topic, tier };
  }
  return null;
}

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: { topic: string };
  searchParams?: { track?: string };
}) {
  const found = findTopic(params.topic);
  if (!found) notFound();
  const { topic, tier } = found;

  // Instrument topics pin their track; theory follows the track you came from.
  const track: Track =
    topic.kind === "guitar" || topic.kind === "piano"
      ? topic.kind
      : searchParams?.track === "piano"
        ? "piano"
        : "guitar";

  const ordered = ICEBERG.flatMap((t) => topicsForTrack(t, track));
  const index = ordered.findIndex((t) => t.id === topic.id);
  const prev = index > 0 ? ordered[index - 1] : null;
  const next =
    index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null;

  let userId: string | null = null;
  let initials: string | undefined;
  let initialStatus: TopicStatus | "none" = "none";

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    userId = user.id;
    initials = getInitials(user.user_metadata?.display_name ?? user.email);

    const { data: row } = await supabase
      .from("learning_progress")
      .select("status")
      .eq("user_id", user.id)
      .eq("topic_id", topic.id)
      .maybeSingle();
    if (row?.status === "learning" || row?.status === "known")
      initialStatus = row.status;
  }

  return (
    <AppShell initials={initials}>
      <LessonView
        topic={topic}
        tierName={tier.name}
        depth={tier.depth}
        userId={userId}
        initialStatus={initialStatus}
        track={track}
        prev={prev ? { id: prev.id, title: prev.title } : null}
        next={next ? { id: next.id, title: next.title } : null}
      />
    </AppShell>
  );
}
