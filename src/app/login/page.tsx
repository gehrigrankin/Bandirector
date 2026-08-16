import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage({ searchParams }: { searchParams?: { returnTo?: string } }) {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 safe-top safe-bottom sm:px-5">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[360px] w-[500px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,165,36,0.12),transparent_70%)]" />
      <Link
        href="/"
        className="absolute left-4 top-[calc(1rem+env(safe-area-inset-top))] inline-flex h-10 items-center text-sm text-text-muted sm:left-5"
      >
        ← Back
      </Link>

      <div className="flex w-full max-w-[400px] flex-col gap-5">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent font-display text-[22px] font-bold text-black">
            B
          </span>
          <div>
            <h1 className="font-display text-[26px] font-bold">Welcome back</h1>
            <p className="mt-1 text-[13px] text-text-muted">
              Log in to host jams, sync your songs, and keep your progress.
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-line bg-bg-raised p-5 sm:p-6">
          <LoginForm returnTo={searchParams?.returnTo} />
        </div>

        <p className="text-center text-[13px] text-text-muted">
          No account?{" "}
          <Link href="/signup" className="font-medium text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
