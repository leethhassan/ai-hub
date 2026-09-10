-- ============================================================
-- AI Hub — Initial schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`)
-- ============================================================

-- Required extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', new.email));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------
-- conversations / messages (AI Chat)
-- ---------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'محادثة جديدة',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists conversations_user_id_idx on public.conversations(user_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);

-- ---------------------------------------------------------------
-- usage tracking (server-side enforced daily limits)
-- ---------------------------------------------------------------
create table if not exists public.usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tool text not null check (tool in ('chat','writer','summarizer','translator','image','speech','files','code')),
  day date not null default current_date,
  count integer not null default 0,
  unique (user_id, tool, day)
);
create index if not exists usage_user_day_idx on public.usage(user_id, day);

-- ---------------------------------------------------------------
-- generated_images
-- ---------------------------------------------------------------
create table if not exists public.generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt text not null,
  image_url text not null,
  style text,
  aspect_ratio text,
  created_at timestamptz not null default now()
);
create index if not exists generated_images_user_id_idx on public.generated_images(user_id);

-- ---------------------------------------------------------------
-- uploaded_files (Summarizer / File Analyzer)
-- ---------------------------------------------------------------
create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);
create index if not exists uploaded_files_user_id_idx on public.uploaded_files(user_id);

-- ============================================================
-- Row Level Security — every table restricted to its owner
-- ============================================================
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.usage enable row level security;
alter table public.generated_images enable row level security;
alter table public.uploaded_files enable row level security;

-- profiles: user can read/update only their own row
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- conversations: owner only
create policy "conversations_select_own" on public.conversations for select using (auth.uid() = user_id);
create policy "conversations_insert_own" on public.conversations for insert with check (auth.uid() = user_id);
create policy "conversations_update_own" on public.conversations for update using (auth.uid() = user_id);
create policy "conversations_delete_own" on public.conversations for delete using (auth.uid() = user_id);

-- messages: owner only, via parent conversation
create policy "messages_select_own" on public.messages for select
  using (exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()));
create policy "messages_insert_own" on public.messages for insert
  with check (exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()));
create policy "messages_delete_own" on public.messages for delete
  using (exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()));

-- usage: owner only (server also uses service-role for enforcement)
create policy "usage_select_own" on public.usage for select using (auth.uid() = user_id);
create policy "usage_insert_own" on public.usage for insert with check (auth.uid() = user_id);
create policy "usage_update_own" on public.usage for update using (auth.uid() = user_id);

-- generated_images: owner only
create policy "images_select_own" on public.generated_images for select using (auth.uid() = user_id);
create policy "images_insert_own" on public.generated_images for insert with check (auth.uid() = user_id);

-- uploaded_files: owner only
create policy "files_select_own" on public.uploaded_files for select using (auth.uid() = user_id);
create policy "files_insert_own" on public.uploaded_files for insert with check (auth.uid() = user_id);
create policy "files_delete_own" on public.uploaded_files for delete using (auth.uid() = user_id);

-- ============================================================
-- Storage bucket for uploaded files (private)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do nothing;

create policy "storage_select_own"
  on storage.objects for select
  using (bucket_id = 'user-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'user-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage_delete_own"
  on storage.objects for delete
  using (bucket_id = 'user-files' and auth.uid()::text = (storage.foldername(name))[1]);
