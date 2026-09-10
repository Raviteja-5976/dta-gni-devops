-- ===================================================================
-- Workshop session-unlock storage
--
-- Run this once in your Supabase project:
--   Dashboard -> SQL Editor -> New query -> paste -> Run
--
-- It creates a tiny key/value table. The app stores a single row,
-- 'unlocked-sessions', whose value is a JSON array of session slugs:
--   ["session-1", "session-2"]
-- ===================================================================

create table if not exists public.workshop_settings (
  key        text primary key,
  value      jsonb       not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security ON with NO policies means: every anonymous and
-- authenticated client is denied. Only the service role key — which
-- bypasses RLS and lives solely in the server's environment — can read
-- or write. The app never touches this table from the browser.
alter table public.workshop_settings enable row level security;

-- Start with nothing unlocked. Safe to re-run: it won't clobber an
-- existing value.
insert into public.workshop_settings (key, value)
values ('unlocked-sessions', '[]'::jsonb)
on conflict (key) do nothing;
