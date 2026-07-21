import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/ui/AppNav";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";
import { IcebergCourse } from "@/components/learn/IcebergCourse";
import { isValidTopicId } from "@/lib/learning/curriculum";
import type { TopicStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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

        <div className="mt-6">
          <IcebergCourse userId={user.id} initialProgress={initialProgress} />
        </div>
      </div>
    </AppShell>
  );
}
