import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-10 safe-top safe-bottom">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[360px] w-[500px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,165,36,0.12),transparent_70%)]" />
      <Link
        href="/"
        className="absolute left-5 top-5 text-sm text-text-muted hover:text-text"
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
              Log in to host jams and manage your library.
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-line bg-bg-raised p-6">
          <LoginForm />
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
