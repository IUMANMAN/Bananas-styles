-- Create junction table style_keywords
create table public.style_keywords (
  style_id uuid not null references public.styles (id) on delete cascade,
  keyword_id uuid not null references public.keywords (id) on delete cascade,
  primary key (style_id, keyword_id)
);

-- RLS
alter table public.style_keywords enable row level security;

create policy "Public Read Style Keywords"
on public.style_keywords for select
to public
using (true);

create policy "Auth Insert Style Keywords"
on public.style_keywords for insert
to authenticated
with check (true);

create policy "Auth Delete Style Keywords"
on public.style_keywords for delete
to authenticated
using (true);
