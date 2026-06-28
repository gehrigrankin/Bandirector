import Link from "next/link";
import { Music2, Users, BookOpen, GraduationCap } from "lucide-react";
import { TopNav } from "@/components/ui/TopNav";

interface Part {
  href: string;
  title: string;
  desc: string;
  icon: typeof Music2;
  soon?: boolean;
}

const PARTS: Part[] = [
  {
    href: "/studio",
    title: "Songwriter Studio",
    desc: "Build chords, pick a playing style, loop it, and lock instruments together to layer an arrangement.",
    icon: Music2,
  },
  {
    href: "/jam",
    title: "Jam Together",
    desc: "Upload a song, analyze it, and everyone plays their part in a synced room.",
    icon: Users,
  },
  {
    href: "#",
    title: "How to Play a Song",
    desc: "Learn a specific song — chords, sections, and each instrument's part to play along.",
    icon: BookOpen,
    soon: true,
  },
  {
    href: "#",
    title: "Learn & Track Progress",
    desc: "Track what you know across guitar, piano, drums, theory, songs learned — and what's next.",
    icon: GraduationCap,
    soon: true,
  },
];

export default function HubPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 safe-bottom">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Bandirector</h1>
          <p className="mt-2 text-text-muted">
            Your music workshop — write, practice, and jam.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PARTS.map((part) => {
            const Icon = part.icon;
            const inner = (
              <>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-bg-higher text-accent">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-lg font-semibold">{part.title}</h2>
                  {part.soon ? (
                    <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-dim">
                      Soon
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-text-muted">{part.desc}</p>
              </>
            );

            if (part.soon) {
              return (
                <div
                  key={part.title}
                  className="cursor-not-allowed rounded-2xl border border-border bg-bg-raised p-5 opacity-60"
                >
                  {inner}
                </div>
              );
            }

            return (
              <Link
                key={part.title}
                href={part.href}
                className="rounded-2xl border border-border bg-bg-raised p-5 transition-colors hover:border-accent/50 hover:bg-bg-higher"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
