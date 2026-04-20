"use client";

import type { Database } from "@/lib/types/database";
import { instrumentLabel } from "@/lib/instruments";

type Participant = Database["public"]["Tables"]["room_participants"]["Row"];

interface Props {
  participants: Participant[];
  currentPid: string;
}

export function ParticipantList({ participants, currentPid }: Props) {
  if (participants.length === 0) {
    return (
      <p className="text-sm text-text-muted">Waiting for bandmates…</p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {participants.map((p) => {
        const isMe = p.participant_id === currentPid;
        return (
          <li
            key={p.participant_id}
            className={[
              "rounded-full border px-3 py-1 text-xs",
              isMe
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-bg text-text",
            ].join(" ")}
          >
            <span className="font-medium">{p.display_name}</span>
            <span className="ml-1 text-text-muted">
              · {instrumentLabel(p.instrument)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
