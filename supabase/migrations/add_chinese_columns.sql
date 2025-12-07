-- Add Chinese language columns to styles table
ALTER TABLE public.styles 
ADD COLUMN IF NOT EXISTS ch_title TEXT,
ADD COLUMN IF NOT EXISTS ch_prompt TEXT,
ADD COLUMN IF NOT EXISTS ch_introduction TEXT;

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
