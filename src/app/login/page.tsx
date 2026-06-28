import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { JamUnavailable } from "@/components/JamUnavailable";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  if (!isSupabaseConfigured()) return <JamUnavailable />;
  return (
    <main className="flex min-h-dvh flex-col px-6 py-10 safe-top safe-bottom">
      <Link href="/" className="text-sm text-text-muted">
        ← Back
      </Link>

      <div className="mx-auto mt-10 w-full max-w-md">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-text-muted">Log in to host jams.</p>

        <div className="mt-6 rounded-2xl border border-border bg-bg-raised p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          No account?{" "}
          <Link href="/signup" className="text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
