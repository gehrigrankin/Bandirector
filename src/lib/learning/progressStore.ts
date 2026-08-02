// Device-local mirror of learning progress. The sole store on deployments
// without Supabase (userId null); a sync buffer everywhere else.

import type { TopicStatus } from "@/lib/types/database";
import { isValidTopicId } from "@/lib/learning/curriculum";

export function localKey(userId: string | null) {
  return `bandirector.learn.${userId ?? "local"}`;
}

export function loadLocal(userId: string | null): Record<string, TopicStatus> {
  try {
    const raw = localStorage.getItem(localKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, TopicStatus> = {};
    for (const [id, status] of Object.entries(parsed)) {
      if (isValidTopicId(id) && (status === "learning" || status === "known"))
        out[id] = status;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveLocal(
  userId: string | null,
  progress: Record<string, TopicStatus>,
) {
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(progress));
  } catch {
    // storage full or unavailable — nothing useful to do
  }
}

/** Update one topic in the local mirror (null clears it). */
export function saveLocalTopic(
  userId: string | null,
  topicId: string,
  status: TopicStatus | null,
) {
  const progress = loadLocal(userId);
  if (status === null) delete progress[topicId];
  else progress[topicId] = status;
  saveLocal(userId, progress);
}
