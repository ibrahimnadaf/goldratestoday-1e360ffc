
-- Roles enum + user_roles table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_city text default 'mumbai',
  email_alerts boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Price alerts
create table public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metal text not null check (metal in ('XAU','XAG','XPT','XPD')),
  purity text not null default '24K' check (purity in ('24K','22K','18K','14K')),
  direction text not null check (direction in ('above','below')),
  threshold_inr_per_gram numeric not null check (threshold_inr_per_gram > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  triggered_at timestamptz
);
grant select, insert, update, delete on public.price_alerts to authenticated;
grant all on public.price_alerts to service_role;
alter table public.price_alerts enable row level security;

create policy "Users manage own alerts" on public.price_alerts
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public price cache (readable by anyone; only service_role writes)
create table public.gold_rates_cache (
  id uuid primary key default gen_random_uuid(),
  symbol text not null check (symbol in ('XAU','XAG','XPT','XPD')),
  usd_per_oz numeric not null,
  inr_per_gram_24k numeric not null,
  usd_to_inr numeric not null,
  fetched_at timestamptz not null default now()
);
grant select on public.gold_rates_cache to anon, authenticated;
grant all on public.gold_rates_cache to service_role;
alter table public.gold_rates_cache enable row level security;

create policy "Anyone can read price cache" on public.gold_rates_cache
  for select to anon, authenticated using (true);

create index gold_rates_cache_symbol_fetched_idx
  on public.gold_rates_cache (symbol, fetched_at desc);
