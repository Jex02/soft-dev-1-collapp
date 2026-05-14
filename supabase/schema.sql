-- COLLAPP full schema (greenfield). Run in Supabase SQL Editor.
-- Existing project: apply supabase/migrations/002_admin_scoped_reps.sql if you already ran an older schema.sql.
-- Auth: consider disabling "Confirm email" for local dev so sign-up returns a session.

-- === colleges (before profiles: profiles.college_id FK) ===
create table if not exists public.colleges (
  id bigint generated always as identity primary key,
  name text not null,
  location text not null,
  description text not null default '',
  program text not null default '',
  status text not null check (status in ('Available', 'Unavailable')) default 'Available',
  button_color text default 'cyan',
  button_action text default 'APPLY',
  application_deadline date,
  requirements text[] not null default array[]::text[],
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- === profiles ===
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text not null default '',
  role text not null check (role in ('student', 'school_rep', 'admin')),
  college_id bigint references public.colleges (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_unique_rep_college
  on public.profiles (college_id)
  where role = 'school_rep' and college_id is not null;

-- === applications ===
create table if not exists public.applications (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.profiles (id) on delete cascade,
  student_name text not null,
  college_id bigint not null references public.colleges (id) on delete restrict,
  college_name text not null,
  program text not null,
  status text not null check (status in ('Pending', 'Under Review', 'Accepted', 'Rejected')) default 'Pending',
  applied_date timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  documents jsonb not null default '[]'::jsonb,
  notes text
);

create index if not exists applications_student_id_idx on public.applications (student_id);
create index if not exists applications_college_id_idx on public.applications (college_id);

-- === Helper functions (after tables they reference) ===
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role = 'admin' from public.profiles where id = uid), false);
$$;

create or replace function public.is_school_rep(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role = 'school_rep' from public.profiles where id = uid), false);
$$;

create or replace function public.is_student(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role = 'student' from public.profiles where id = uid), false);
$$;

create or replace function public.my_rep_college_id(uid uuid)
returns bigint
language sql
security definer
set search_path = public
stable
as $$
  select college_id from public.profiles where id = uid and role = 'school_rep';
$$;

create or replace function public.username_available(check_username text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select not exists (
    select 1 from public.profiles where lower(trim(username)) = lower(trim(check_username))
  );
$$;

grant execute on function public.username_available(text) to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uname text;
begin
  uname := lower(trim(coalesce(new.raw_user_meta_data->>'username', '')));
  if uname = '' then
    uname := lower(split_part(coalesce(new.email, 'user'), '@', 1));
  end if;

  insert into public.profiles (id, username, full_name, role, college_id)
  values (new.id, uname, coalesce(new.raw_user_meta_data->>'full_name', ''), 'student', null);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- === RLS ===
alter table public.profiles enable row level security;
alter table public.colleges enable row level security;
alter table public.applications enable row level security;

drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_select_self" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_update_self" on public.profiles;

create policy "profiles_select_self" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles_select_admin" on public.profiles
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "profiles_update_self" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "colleges_select_auth" on public.colleges;
drop policy if exists "colleges_select_student" on public.colleges;
drop policy if exists "colleges_select_rep" on public.colleges;
drop policy if exists "colleges_select_admin" on public.colleges;
drop policy if exists "colleges_insert_rep" on public.colleges;
drop policy if exists "colleges_insert_admin" on public.colleges;
drop policy if exists "colleges_update_rep" on public.colleges;
drop policy if exists "colleges_update_scope" on public.colleges;
drop policy if exists "colleges_delete_rep" on public.colleges;
drop policy if exists "colleges_delete_admin" on public.colleges;

create policy "colleges_select_student" on public.colleges
  for select to authenticated using (public.is_student(auth.uid()));
create policy "colleges_select_rep" on public.colleges
  for select to authenticated using (id = public.my_rep_college_id(auth.uid()));
create policy "colleges_select_admin" on public.colleges
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "colleges_insert_admin" on public.colleges
  for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "colleges_update_scope" on public.colleges
  for update to authenticated
  using (
    public.is_admin(auth.uid())
    or (public.is_school_rep(auth.uid()) and id = public.my_rep_college_id(auth.uid()))
  )
  with check (
    public.is_admin(auth.uid())
    or (public.is_school_rep(auth.uid()) and id = public.my_rep_college_id(auth.uid()))
  );
create policy "colleges_delete_admin" on public.colleges
  for delete to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "applications_select" on public.applications;
drop policy if exists "applications_select_student" on public.applications;
drop policy if exists "applications_select_rep" on public.applications;
drop policy if exists "applications_select_admin" on public.applications;
drop policy if exists "applications_insert_student" on public.applications;
drop policy if exists "applications_update_rep" on public.applications;
drop policy if exists "applications_update_admin" on public.applications;
drop policy if exists "applications_delete_rep" on public.applications;
drop policy if exists "applications_delete_admin" on public.applications;

create policy "applications_select_student" on public.applications
  for select to authenticated using (student_id = auth.uid());
create policy "applications_select_rep" on public.applications
  for select to authenticated using (
    public.is_school_rep(auth.uid()) and college_id = public.my_rep_college_id(auth.uid())
  );
create policy "applications_select_admin" on public.applications
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "applications_insert_student" on public.applications
  for insert to authenticated with check (
    student_id = auth.uid() and public.is_student(auth.uid())
  );
create policy "applications_update_rep" on public.applications
  for update to authenticated
  using (
    public.is_school_rep(auth.uid()) and college_id = public.my_rep_college_id(auth.uid())
  )
  with check (
    public.is_school_rep(auth.uid()) and college_id = public.my_rep_college_id(auth.uid())
  );
create policy "applications_update_admin" on public.applications
  for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "applications_delete_rep" on public.applications
  for delete to authenticated using (
    public.is_school_rep(auth.uid()) and college_id = public.my_rep_college_id(auth.uid())
  );
create policy "applications_delete_admin" on public.applications
  for delete to authenticated using (public.is_admin(auth.uid()));

-- === Seeds ===
insert into public.colleges (name, location, description, program, status, button_color, button_action, application_deadline, requirements, contact_email)
select 'University of the Philippines', 'Quezon City, Philippines', 'Leading national university', 'Leading national university', 'Available', 'cyan', 'APPLY', '2026-06-30'::date,
  array['High School Diploma', 'Entrance Exam', 'Interview'], 'admissions@up.edu.ph'
where not exists (select 1 from public.colleges c where c.name = 'University of the Philippines');

insert into public.colleges (name, location, description, program, status, button_color, button_action, application_deadline, requirements, contact_email)
select 'CIT University', 'Cebu City, Philippines', 'CIT University (Cebu Institute of Technology University).',
  'CIT University programs', 'Available', 'cyan', 'APPLY', '2026-07-15'::date,
  array['High School Diploma', 'Entrance evaluation', 'Interview'], 'admissions@cit.edu'
where not exists (select 1 from public.colleges c where c.name = 'CIT University');

insert into public.colleges (name, location, description, program, status, button_color, button_action, application_deadline, requirements, contact_email)
select 'Ateneo de Manila University', 'Quezon City, Philippines', 'Private Catholic institution', 'Private Catholic institution', 'Available', 'cyan', 'APPLY', '2026-05-15'::date,
  array['High School Diploma', 'ACET Exam', 'Essay'], 'admissions@ateneo.edu'
where not exists (select 1 from public.colleges c where c.name = 'Ateneo de Manila University');

insert into public.colleges (name, location, description, program, status, button_color, button_action, application_deadline, requirements, contact_email)
select 'De La Salle University', 'Manila, Philippines', 'Lasallian educational excellence', 'Lasallian educational excellence', 'Available', 'cyan', 'APPLY', '2026-04-30'::date,
  array['High School Diploma', 'DLSU College Admission Test', 'Interview'], 'admissions@dlsu.edu.ph'
where not exists (select 1 from public.colleges c where c.name = 'De La Salle University');

-- Bootstrap:
-- 1) Admin: create user in Auth, then: update public.profiles set role = 'admin', college_id = null where id = '<uuid>';
-- 2) Add SUPABASE_SERVICE_ROLE_KEY to your Next server env; admin creates reps from /admin/manageuser.
-- 3) Reps log in with School Rep portal — they only see their college + applications to that college.
