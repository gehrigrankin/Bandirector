import { AppShell } from "@/components/ui/AppNav";
import { AccountSettings } from "@/components/ui/AccountSettings";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getInitials } from "@/lib/utils/initials";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let email: string | null = null;
  let initials = "··";
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email ?? null;
    initials = getInitials(user?.user_metadata?.display_name ?? user?.email);
  }

  return (
    <AppShell initials={initials}>
      <main className="mx-auto min-h-full max-w-3xl px-5 py-8 md:px-10 md:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim">Account</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Settings</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">Make Bandirector fit the way you practice, create, and play.</p>
        <div className="mt-8"><AccountSettings email={email} initials={initials} /></div>
      </main>
    </AppShell>
  );
}
