-- Saved prompts table for the Prompt Library feature.
-- Run after 0002_profiles.sql.

create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled prompt',
  content text not null,
  tool text,
  tags text[] not null default '{}',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_prompts_user_idx on public.saved_prompts (user_id, created_at desc);
create index if not exists saved_prompts_public_idx on public.saved_prompts (is_public, created_at desc) where is_public = true;

alter table public.saved_prompts enable row level security;

drop policy if exists "Users can read own prompts" on public.saved_prompts;
create policy "Users can read own prompts"
  on public.saved_prompts for select
  using (auth.uid() = user_id or is_public = true);

drop policy if exists "Users can insert own prompts" on public.saved_prompts;
create policy "Users can insert own prompts"
  on public.saved_prompts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own prompts" on public.saved_prompts;
create policy "Users can update own prompts"
  on public.saved_prompts for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own prompts" on public.saved_prompts;
create policy "Users can delete own prompts"
  on public.saved_prompts for delete
  using (auth.uid() = user_id);
