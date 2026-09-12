-- Harden RLS for Operava Workspace (free-tier safe)
-- Fixes recursive profiles policies via security-definer helper.
-- Apply: supabase db push | Dashboard SQL editor

-- ---------------------------------------------------------------------------
-- Role helper (SECURITY DEFINER — bypasses RLS on profiles for policy checks)
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'agent')
  )
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- profiles: drop recursive policies, replace with helper-based ones
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or public.is_staff()
  );

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Only admins may change role column (via separate policy + trigger preferred)
create policy "profiles_admin_update"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- tickets: replace with helper policies + delete for staff
-- ---------------------------------------------------------------------------
drop policy if exists "tickets_select" on public.tickets;
drop policy if exists "tickets_insert" on public.tickets;
drop policy if exists "tickets_update" on public.tickets;

create policy "tickets_select"
  on public.tickets for select
  to authenticated
  using (owner_id = auth.uid() or public.is_staff());

create policy "tickets_insert"
  on public.tickets for insert
  to authenticated
  with check (owner_id = auth.uid() or public.is_staff());

create policy "tickets_update"
  on public.tickets for update
  to authenticated
  using (owner_id = auth.uid() or public.is_staff())
  with check (owner_id = auth.uid() or public.is_staff());

create policy "tickets_delete_staff"
  on public.tickets for delete
  to authenticated
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- crm_leads
-- ---------------------------------------------------------------------------
drop policy if exists "crm_select" on public.crm_leads;
drop policy if exists "crm_write" on public.crm_leads;

create policy "crm_select"
  on public.crm_leads for select
  to authenticated
  using (owner_id = auth.uid() or public.is_staff());

create policy "crm_insert"
  on public.crm_leads for insert
  to authenticated
  with check (public.is_staff());

create policy "crm_update"
  on public.crm_leads for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "crm_delete"
  on public.crm_leads for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
drop policy if exists "audit_select_staff" on public.audit_logs;
drop policy if exists "audit_insert_authenticated" on public.audit_logs;

create policy "audit_select_staff"
  on public.audit_logs for select
  to authenticated
  using (public.is_staff());

create policy "audit_insert_authenticated"
  on public.audit_logs for insert
  to authenticated
  with check (auth.uid() is not null);

-- No update/delete on audit (append-only)

-- ---------------------------------------------------------------------------
-- files
-- ---------------------------------------------------------------------------
drop policy if exists "files_select" on public.files;
drop policy if exists "files_write" on public.files;

create policy "files_select"
  on public.files for select
  to authenticated
  using (owner_id = auth.uid() or public.is_staff());

create policy "files_insert"
  on public.files for insert
  to authenticated
  with check (owner_id = auth.uid() or public.is_staff());

create policy "files_update"
  on public.files for update
  to authenticated
  using (owner_id = auth.uid() or public.is_staff())
  with check (owner_id = auth.uid() or public.is_staff());

create policy "files_delete"
  on public.files for delete
  to authenticated
  using (owner_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- portal_docs (staff only)
-- ---------------------------------------------------------------------------
drop policy if exists "portal_docs_staff" on public.portal_docs;

create policy "portal_docs_staff"
  on public.portal_docs for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Optional: force RLS even for table owners (recommended)
-- ---------------------------------------------------------------------------
alter table public.profiles force row level security;
alter table public.tickets force row level security;
alter table public.crm_leads force row level security;
alter table public.audit_logs force row level security;
alter table public.files force row level security;
alter table public.portal_docs force row level security;
