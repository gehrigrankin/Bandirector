/**
 * Whether Supabase is configured for this deployment. The jam features
 * (accounts, uploads, synced rooms) need it; the Songwriter Studio does not.
 * When it returns false, jam/auth surfaces degrade to a friendly notice and
 * the auth middleware is skipped so the site still boots.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
