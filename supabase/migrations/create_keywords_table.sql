-- Create keywords table
create table public.keywords (
  id uuid not null default gen_random_uuid (),
  keyword text not null,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  constraint keywords_pkey primary key (id),
  constraint keywords_keyword_key unique (keyword)
);

-- RLS Policies (Optional but recommended)
alter table public.keywords enable row level security;

-- Allow read access to everyone (public)
create policy "Allow public read access"
on public.keywords for select
to public
using (true);

-- Allow admins/authenticated users to insert/delete (simplified here to authenticated)
create policy "Allow authenticated insert"
on public.keywords for insert
to authenticated
with check (true);

create policy "Allow authenticated delete"
on public.keywords for delete
to authenticated
using (true);
