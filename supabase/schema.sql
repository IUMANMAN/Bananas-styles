-- Create styles table
create table public.styles (
  id uuid not null default gen_random_uuid (),
  title text not null,
  introduction text null,
  prompt text not null,
  original_image_url text null,
  generated_image_url text not null,
  created_at timestamp with time zone not null default now(),
  constraint styles_pkey primary key (id)
);

-- Create user_likes table
create table public.user_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  style_id uuid not null references public.styles (id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  constraint user_likes_pkey primary key (user_id, style_id)
);

-- Enable RLS
alter table public.styles enable row level security;
alter table public.user_likes enable row level security;

-- Policies for styles
create policy "Styles are viewable by everyone" on public.styles
  for select using (true);

create policy "Styles are insertable by authenticated users" on public.styles
  for insert with check (auth.role() = 'authenticated');

-- Policies for user_likes
create policy "Users can view their own likes" on public.user_likes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own likes" on public.user_likes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes" on public.user_likes
  for delete using (auth.uid() = user_id);

-- Create keywords table
create table public.keywords (
  id uuid not null default gen_random_uuid (),
  keyword text not null unique,
  created_by uuid null references auth.users (id) on delete set null,
  created_at timestamp with time zone not null default now(),
  constraint keywords_pkey primary key (id)
);

-- Enable RLS for keywords
alter table public.keywords enable row level security;

-- Policies for keywords
create policy "Keywords are viewable by everyone" on public.keywords
  for select using (true);

create policy "Keywords are insertable by authenticated users" on public.keywords
  for insert with check (auth.role() = 'authenticated');

create policy "Keywords are deletable by authenticated users" on public.keywords
  for delete using (auth.role() = 'authenticated');
