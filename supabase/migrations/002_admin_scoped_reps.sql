-- Migration 002: admin role, college-scoped school reps, RLS updates.
-- Run in Supabase SQL Editor AFTER your initial schema (001 / schema.sql) is applied.
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS where possible.

-- Helpers
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role = 'admin' from public.profiles where id = uid), false);
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

-- Extend profiles
alter table public.profiles add column if not exists college_id bigint references public.colleges (id);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student', 'school_rep', 'admin'));

drop index if exists public.profiles_unique_rep_college;
create unique index profiles_unique_rep_college
  on public.profiles (college_id)
  where role = 'school_rep' and college_id is not null;

-- Seed CIT row (UP is usually already "University of the Philippines" from base seed)
insert into public.colleges (name, location, description, program, status, button_color, button_action, application_deadline, requirements, contact_email)
select
  'CIT University',
  'Cebu City, Philippines',
  'CIT University (Cebu Institute of Technology University) — partner campus for COLLAPP demos.',
  'CIT University programs',
  'Available',
  'cyan',
  'APPLY',
  '2026-07-15'::date,
  array['High School Diploma', 'Entrance evaluation', 'Interview'],
  'admissions@cit.edu'
where not exists (select 1 from public.colleges c where c.name = 'CIT University');

-- === RLS: drop old policies ===
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists "colleges_select_auth" on public.colleges;
drop policy if exists "colleges_insert_rep" on public.colleges;
drop policy if exists "colleges_update_rep" on public.colleges;
drop policy if exists "colleges_delete_rep" on public.colleges;

drop policy if exists "applications_select" on public.applications;
drop policy if exists "applications_insert_student" on public.applications;
drop policy if exists "applications_update_rep" on public.applications;
drop policy if exists "applications_delete_rep" on public.applications;

-- === profiles ===
create policy "profiles_select_self" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

create policy "profiles_select_admin" on public.profiles
  for select to authenticated
  using (public.is_admin(auth.uid()));

create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- === colleges ===
create policy "colleges_select_student" on public.colleges
  for select to authenticated
  using (public.is_student(auth.uid()));

create policy "colleges_select_rep" on public.colleges
  for select to authenticated
  using (id = public.my_rep_college_id(auth.uid()));

create policy "colleges_select_admin" on public.colleges
  for select to authenticated
  using (public.is_admin(auth.uid()));

create policy "colleges_insert_admin" on public.colleges
  for insert to authenticated
  with check (public.is_admin(auth.uid()));

create policy "colleges_update_scope" on public.colleges
  for update to authenticated
  using (
    public.is_admin(auth.uid())
    or (
      public.is_school_rep(auth.uid())
      and id = public.my_rep_college_id(auth.uid())
    )
  )
  with check (
    public.is_admin(auth.uid())
    or (
      public.is_school_rep(auth.uid())
      and id = public.my_rep_college_id(auth.uid())
    )
  );

create policy "colleges_delete_admin" on public.colleges
  for delete to authenticated
  using (public.is_admin(auth.uid()));

-- === applications ===
create policy "applications_select_student" on public.applications
  for select to authenticated
  using (student_id = auth.uid());

create policy "applications_select_rep" on public.applications
  for select to authenticated
  using (
    public.is_school_rep(auth.uid())
    and college_id = public.my_rep_college_id(auth.uid())
  );

create policy "applications_select_admin" on public.applications
  for select to authenticated
  using (public.is_admin(auth.uid()));

create policy "applications_insert_student" on public.applications
  for insert to authenticated
  with check (
    student_id = auth.uid()
    and public.is_student(auth.uid())
  );

create policy "applications_update_rep" on public.applications
  for update to authenticated
  using (
    public.is_school_rep(auth.uid())
    and college_id = public.my_rep_college_id(auth.uid())
  )
  with check (
    public.is_school_rep(auth.uid())
    and college_id = public.my_rep_college_id(auth.uid())
  );

create policy "applications_update_admin" on public.applications
  for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "applications_delete_rep" on public.applications
  for delete to authenticated
  using (
    public.is_school_rep(auth.uid())
    and college_id = public.my_rep_college_id(auth.uid())
  );

create policy "applications_delete_admin" on public.applications
  for delete to authenticated
  using (public.is_admin(auth.uid()));

-- === Bootstrap notes ===
-- 1) Create your ONE admin in Authentication → Users, then run (replace UUID):
--    update public.profiles set role = 'admin', college_id = null where id = '<AUTH_USER_UUID>';
--
-- 2) Add .env.local SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API → service_role secret).
--
-- 3) Log in as admin → /admin/manageuser → create UP rep (pick "University of the Philippines")
--    and CIT rep (pick "CIT University"). Each rep only sees that college + applications to it.
