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
    <ul className="flex gap-1.5 overflow-x-auto">
      {participants.map((p) => {
        const isMe = p.participant_id === currentPid;
        return (
          <li
            key={p.participant_id}
            className={[
              "shrink-0 rounded-full border px-3 py-1.5 text-xs",
              isMe
                ? "border-jam/40 bg-jam/[0.08] text-jam"
                : "border-line bg-bg text-text-soft",
            ].join(" ")}
          >
            <span className="font-semibold">{p.display_name}</span>
            <span className={isMe ? "ml-1 text-jam/70" : "ml-1 text-text-muted"}>
              · {instrumentLabel(p.instrument)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
