create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  points integer default 0,
  posts_count integer default 0,
  confirmations_count integer default 0,
  trust_score integer default 0,
  campus text default 'UNT',
  created_at timestamptz default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  category text not null check (category in ('food', 'pantry', 'supplies', 'event')),
  latitude double precision not null,
  longitude double precision not null,
  building_name text,
  image_url text,
  expires_at timestamptz not null,
  is_active boolean default true,
  still_available_count integer default 0,
  gone_count integer default 0,
  campus text default 'UNT',
  created_at timestamptz default now()
);

create table if not exists confirmations (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status text check (status in ('available', 'gone')),
  created_at timestamptz default now(),
  confirmed_at timestamptz default now(),
  unique(resource_id, user_id)
);

create table if not exists watch_zones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  radius_meters integer default 500,
  categories text[] default '{food,pantry,supplies,event}',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table resources enable row level security;
alter table confirmations enable row level security;
alter table watch_zones enable row level security;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, campus)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    'UNT'
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.sync_resource_confirmation_counts()
returns trigger as $$
declare
  target_resource_id uuid;
  available_total integer;
  gone_total integer;
begin
  target_resource_id := coalesce(new.resource_id, old.resource_id);

  select
    count(*) filter (where status = 'available'),
    count(*) filter (where status = 'gone')
  into available_total, gone_total
  from confirmations
  where resource_id = target_resource_id;

  update resources
  set
    still_available_count = coalesce(available_total, 0),
    gone_count = coalesce(gone_total, 0),
    is_active = case
      when expires_at < now() then false
      when coalesce(gone_total, 0) >= 2 then false
      else true
    end
  where id = target_resource_id;

  return coalesce(new, old);
end;
$$ language plpgsql;

drop trigger if exists sync_confirmation_counts on confirmations;
create trigger sync_confirmation_counts
after insert or update or delete on confirmations
for each row execute function public.sync_resource_confirmation_counts();

create or replace function public.reward_resource_post()
returns trigger as $$
begin
  if new.user_id is not null then
    update profiles
    set
      points = points + 20,
      posts_count = posts_count + 1,
      trust_score = least(100, trust_score + 2)
    where id = new.user_id;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists reward_resource_post_trigger on resources;
create trigger reward_resource_post_trigger
after insert on resources
for each row execute function public.reward_resource_post();

create or replace function public.reward_confirmation()
returns trigger as $$
begin
  if new.user_id is not null then
    update profiles
    set
      points = points + 5,
      confirmations_count = confirmations_count + 1
    where id = new.user_id;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists reward_confirmation_trigger on confirmations;
create trigger reward_confirmation_trigger
after insert on confirmations
for each row execute function public.reward_confirmation();

drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

drop policy if exists "Resources are viewable by everyone" on resources;
create policy "Resources are viewable by everyone"
  on resources for select
  using (true);

drop policy if exists "Authenticated users can post" on resources;
create policy "Authenticated users can post"
  on resources for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own posts" on resources;
create policy "Users can update own posts"
  on resources for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own posts" on resources;
create policy "Users can delete own posts"
  on resources for delete
  using (auth.uid() = user_id);

drop policy if exists "Confirmations are viewable by everyone" on confirmations;
create policy "Confirmations are viewable by everyone"
  on confirmations for select
  using (true);

drop policy if exists "Authenticated users can confirm" on confirmations;
create policy "Authenticated users can confirm"
  on confirmations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own confirmation" on confirmations;
create policy "Users can update own confirmation"
  on confirmations for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own confirmation" on confirmations;
create policy "Users can delete own confirmation"
  on confirmations for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can manage their watch zones" on watch_zones;
create policy "Users can manage their watch zones"
  on watch_zones for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'resources'
  ) then
    execute 'alter publication supabase_realtime add table resources';
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'confirmations'
  ) then
    execute 'alter publication supabase_realtime add table confirmations';
  end if;
end
$$;
