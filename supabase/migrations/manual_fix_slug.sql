-- Run this in the Supabase SQL Editor to fix the "missing slug column" error

-- 1. Add the column safely
ALTER TABLE IF EXISTS public.styles ADD COLUMN IF NOT EXISTS slug text;

-- 2. Populate existing rows with a basic slug from the title
UPDATE public.styles 
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'))
WHERE slug IS NULL OR slug = '';

UPDATE public.styles 
SET slug = replace(slug, ' ', '-')
WHERE slug LIKE '% %';

-- 3. Ensure uniqueness (Best effort)
-- We won't add the UNIQUE constraint immediately to avoid blocking if there are duplicates,
-- but the code relies on it being present.

-- 4. Notify PostgREST to refresh its cache
NOTIFY pgrst, 'reload config';
