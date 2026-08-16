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
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 py-5 sm:px-6 md:px-8 md:py-8">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-none tracking-[-0.03em] sm:text-4xl">
            Learn
          </h1>
          <p className="mt-2 text-[13px] text-text-muted sm:text-sm">Pick an instrument. Find the next thing you can use.</p>
        </div>

        <div className="-mx-4 mt-5 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0">
          <Link href="/library" className="group w-[76vw] max-w-[300px] shrink-0 snap-start rounded-2xl border border-line-soft bg-bg-card p-4 sm:w-auto sm:max-w-none"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-dim">Use a song</p><p className="mt-2 text-sm font-semibold">Find your next practice target <ArrowRight className="ml-1 inline size-3.5" /></p></Link>
          <Link href="/studio" className="group w-[76vw] max-w-[300px] shrink-0 snap-start rounded-2xl border border-line-soft bg-bg-card p-4 sm:w-auto sm:max-w-none"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-dim"><Music4 className="size-3.5 text-accent" /> Try it now</p><p className="mt-2 text-sm font-semibold">Turn this idea into a progression <ArrowRight className="ml-1 inline size-3.5" /></p></Link>
        </div>
        <div className="mt-5 sm:mt-6">{children}</div>
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
