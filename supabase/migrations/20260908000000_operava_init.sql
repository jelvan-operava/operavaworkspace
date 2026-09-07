-- Operava Workspace — Supabase / Postgres base schema
-- Auth users live in auth.users (managed by Supabase Auth).
-- Apply via: supabase db push | dashboard SQL | local supabase start + db reset

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'client'
    check (role in ('admin', 'agent', 'client')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'agent')
  ));

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Support tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_no text not null unique,
  subject text not null,
  category text,
  priority text not null default 'Medium',
  status text not null default 'Open',
  channel text,
  client_name text,
  client_email text,
  assigned_agent_id uuid references public.profiles (id),
  owner_id uuid references auth.users (id),
  sla_due timestamptz,
  sla_breached boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tickets_status on public.tickets (status);
create index if not exists idx_tickets_owner on public.tickets (owner_id);

alter table public.tickets enable row level security;

create policy "tickets_select"
  on public.tickets for select
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

create policy "tickets_insert"
  on public.tickets for insert
  with check (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

create policy "tickets_update"
  on public.tickets for update
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

-- CRM leads
create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  stage text,
  score int,
  deal_value numeric,
  owner_id uuid references auth.users (id),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_crm_stage on public.crm_leads (stage);

alter table public.crm_leads enable row level security;

create policy "crm_select"
  on public.crm_leads for select
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

create policy "crm_write"
  on public.crm_leads for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

-- Audit logs (append-oriented; agents/admins read)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  actor text,
  module text,
  action text not null,
  severity text default 'Info',
  details text,
  ip_address text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_audit_ts on public.audit_logs (timestamp desc);

alter table public.audit_logs enable row level security;

create policy "audit_select_staff"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

create policy "audit_insert_authenticated"
  on public.audit_logs for insert
  with check (auth.uid() is not null);

-- File metadata (large blobs → MEGA or Storage later; R2 already on Cloudflare)
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  folder text,
  size_bytes bigint,
  content_type text,
  object_key text not null unique,
  storage_backend text not null default 'r2'
    check (storage_backend in ('r2', 'mega', 'supabase')),
  author text,
  version text,
  owner_id uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_files_folder on public.files (folder);

alter table public.files enable row level security;

create policy "files_select"
  on public.files for select
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

create policy "files_write"
  on public.files for all
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

-- Portal JSON document (parity with Cloudflare D1 portal_docs)
create table if not exists public.portal_docs (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portal_docs enable row level security;

create policy "portal_docs_staff"
  on public.portal_docs for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'agent')
    )
  );

-- Realtime (optional): enable replication for tickets in Dashboard → Database → Replication
-- or: alter publication supabase_realtime add table public.tickets;
