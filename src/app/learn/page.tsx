import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppNav";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";
import { IcebergCourse } from "@/components/learn/IcebergCourse";
import Link from "next/link";
import { ArrowRight, Music4 } from "lucide-react";
import { isValidTopicId } from "@/lib/learning/curriculum";
import type { TopicStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

function LearnLayout({
  initials,
  children,
}: {
  initials?: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell initials={initials}>
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-5 py-7 md:px-8 md:py-9">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-2xl font-bold md:text-[28px]">
            Learn
          </h1>
          <span className="text-xs text-text-muted">
            The music iceberg — everything from first chords to the trench.
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/library" className="group rounded-2xl border border-line-soft bg-bg-card p-4 transition-colors hover:bg-bg-raised"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim">Learn through a song</p><p className="mt-2 text-sm font-semibold">Find your next practice target <ArrowRight className="ml-1 inline size-3.5 transition-transform group-hover:translate-x-1" /></p></Link>
          <Link href="/studio" className="group rounded-2xl border border-line-soft bg-bg-card p-4 transition-colors hover:bg-bg-raised"><p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-dim"><Music4 className="size-3.5 text-accent" /> Use it immediately</p><p className="mt-2 text-sm font-semibold">Turn a concept into a progression <ArrowRight className="ml-1 inline size-3.5 transition-transform group-hover:translate-x-1" /></p></Link>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </AppShell>
  );
}

export default async function LearnPage() {
  // No Supabase on this deployment — the course still works, with progress
  // stored on the device.
  if (!isSupabaseConfigured()) {
    return (
      <LearnLayout>
        <IcebergCourse userId={null} initialProgress={{}} />
      </LearnLayout>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <LearnLayout>
        <IcebergCourse userId={null} initialProgress={{}} />
      </LearnLayout>
    );
  }

  const { data: rows } = await supabase
    .from("learning_progress")
    .select("topic_id,status")
    .eq("user_id", user.id);

  const initialProgress: Record<string, TopicStatus> = {};
  for (const row of rows ?? []) {
    if (isValidTopicId(row.topic_id)) initialProgress[row.topic_id] = row.status;
  }

  const initials = getInitials(user.user_metadata?.display_name ?? user.email);

  return (
    <LearnLayout initials={initials}>
      <IcebergCourse userId={user.id} initialProgress={initialProgress} />
    </LearnLayout>
  );
}
