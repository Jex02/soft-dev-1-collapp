alter table public.profiles
  add column if not exists description text not null default '',
  add column if not exists address text not null default '',
  add column if not exists avatar_url text;

alter table public.colleges
  add column if not exists logo_url text;
