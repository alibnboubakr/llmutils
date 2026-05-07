-- Tool usage tracking: per-user, per-tool, per-day counters.
-- Run this in your Supabase project's SQL editor (or via the Supabase CLI).

create table if not exists public.tool_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  tool text not null,
  day date not null default (timezone('utc', now()))::date,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, tool, day)
);

create index if not exists tool_usage_user_day_idx
  on public.tool_usage (user_id, day);

alter table public.tool_usage enable row level security;

drop policy if exists "Users can read their own usage" on public.tool_usage;
create policy "Users can read their own usage"
  on public.tool_usage for select
  using (auth.uid() = user_id);

-- Increment-or-insert RPC. Returns the new count.
create or replace function public.increment_tool_usage(p_tool text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_count integer;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.tool_usage (user_id, tool, day, count, updated_at)
  values (v_user, p_tool, (timezone('utc', now()))::date, 1, now())
  on conflict (user_id, tool, day)
  do update set
    count = public.tool_usage.count + 1,
    updated_at = now()
  returning count into v_count;

  return v_count;
end;
$$;

grant execute on function public.increment_tool_usage(text) to authenticated;
