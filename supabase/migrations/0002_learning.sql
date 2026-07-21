-- Learning progress: one row per (user, curriculum topic) the user has touched.
-- Topic ids live in code (src/lib/learning/curriculum.ts); absence of a row
-- means "not started".

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
