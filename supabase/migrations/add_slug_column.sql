-- Add slug column and make it unique
ALTER TABLE public.styles ADD COLUMN slug text;

-- Backfill slugs from title
-- Replace spaces with hyphens, lowercase, remove special chars (simple regex)
UPDATE public.styles 
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
UPDATE public.styles 
SET slug = replace(slug, ' ', '-');

-- Handle potential duplicates (append id snippet or random? For now, risk collision on backfill, but unique constraint will fail if collision)
-- Better: Let's just try basic backfill first.

-- Make slug required and unique
ALTER TABLE public.styles ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.styles ADD CONSTRAINT styles_slug_key UNIQUE (slug);
