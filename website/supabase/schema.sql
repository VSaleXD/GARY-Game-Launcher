create extension if not exists "pgcrypto";

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text not null,
  description text not null,
  color text not null default '#3a4700',
  image_url text not null,
  game_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  file_url text not null,
  kind text not null check (kind in ('material', 'documentation')),
  created_at timestamptz not null default now()
);

alter table public.games enable row level security;
alter table public.resources enable row level security;
create policy "Public can read games" on public.games for select using (true);
create policy "Public can read resources" on public.resources for select using (true);
create policy "Anyone can create resources" on public.resources for insert with check (true);

insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do update set public = true;

create policy "Public can read resource files"
on storage.objects for select
using (bucket_id = 'resources');

create policy "Anyone can upload resource files"
on storage.objects for insert
with check (bucket_id = 'resources');
