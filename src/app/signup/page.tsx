import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh flex-col px-6 py-10 safe-top safe-bottom">
      <Link href="/" className="text-sm text-text-muted">
        ← Back
      </Link>

      <div className="mx-auto mt-10 w-full max-w-md">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-1 text-text-muted">Host rooms, upload songs, save favorites.</p>

        <div className="mt-6 rounded-2xl border border-border bg-bg-raised p-6">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have one?{" "}
          <Link href="/login" className="text-accent">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
