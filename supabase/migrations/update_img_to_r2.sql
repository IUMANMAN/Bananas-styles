-- Replaces '/img/' with 'https://pumpbanana.com/'
-- Example: '/img/foo.jpg' -> 'https://pumpbanana.com/foo.jpg'

UPDATE public.styles 
SET generated_image_url = REPLACE(generated_image_url, '/img/', 'https://pumpbanana.com/')
WHERE generated_image_url LIKE '/img/%';

UPDATE public.styles 
SET original_image_url = REPLACE(original_image_url, '/img/', 'https://pumpbanana.com/')
WHERE original_image_url LIKE '/img/%';
