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
      <main className="mx-auto min-h-full max-w-3xl px-4 py-5 sm:px-6 md:px-8 md:py-8 xl:px-10 xl:py-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-dim">Account</p>
        <h1 className="mt-1 font-display text-[30px] font-bold tracking-[-0.03em] sm:text-4xl">Settings</h1>
        <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-text-muted sm:text-sm">Your profile, audio, and account.</p>
        <div className="mt-5 md:mt-8"><AccountSettings email={email} initials={initials} canSignOut={isSupabaseConfigured() && Boolean(email)} /></div>
      </main>
    </AppShell>
  );
}
