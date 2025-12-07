-- Run this in the Supabase SQL Editor to fix BOTH missing column errors

-- 1. Add 'slug' column if missing
ALTER TABLE IF EXISTS public.styles ADD COLUMN IF NOT EXISTS slug text;

-- 2. Add 'source_url' column if missing (User requested optional)
ALTER TABLE IF EXISTS public.styles ADD COLUMN IF NOT EXISTS source_url text;

-- 3. Populate empty slugs just in case
UPDATE public.styles 
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'))
WHERE slug IS NULL OR slug = '';

UPDATE public.styles 
SET slug = replace(slug, ' ', '-')
WHERE slug LIKE '% %';

-- 4. Force Cache Reload (CRITICAL STEP)
NOTIFY pgrst, 'reload config';
