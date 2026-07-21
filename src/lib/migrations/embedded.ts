/**
 * Migrations runnable via GET /migrate (see src/app/migrate/route.ts).
 *
 * Keep each entry's SQL in sync with the matching file in
 * supabase/migrations/. The initial schema (0001) is assumed to already be
 * applied — it predates the runner and parts of it (realtime publication
 * changes) are not safe to re-run.
 *
 * Applied ids are recorded in public.schema_migrations, so each entry runs
 * exactly once per database. Never edit an entry after it has shipped; add a
 * new one instead.
 */

export interface EmbeddedMigration {
  id: string;
  sql: string;
}

export const MIGRATIONS: EmbeddedMigration[] = [
  {
    id: "0002_learning",
    sql: `
create table if not exists public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  status text not null check (status in ('learning', 'known')),
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create index if not exists learning_progress_user_idx on public.learning_progress(user_id);

alter table public.learning_progress enable row level security;

drop policy if exists "learning_progress_own" on public.learning_progress;
create policy "learning_progress_own" on public.learning_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
`,
  },
];
