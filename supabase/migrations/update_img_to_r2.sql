-- 1. Replace local '/img/' paths with the Custom Domain
UPDATE public.styles 
SET generated_image_url = REPLACE(generated_image_url, '/img/', 'https://pumpbanana.com/')
WHERE generated_image_url LIKE '/img/%';

UPDATE public.styles 
SET original_image_url = REPLACE(original_image_url, '/img/', 'https://pumpbanana.com/')
WHERE original_image_url LIKE '/img/%';

-- 2. Replace incorrect PRIVATE R2 paths (which cause 403 errors) with the Custom Domain
UPDATE public.styles 
SET generated_image_url = REPLACE(generated_image_url, 'https://da706efc88c11c0f5ec999dde8d3fc37.r2.cloudflarestorage.com/', 'https://pumpbanana.com/')
WHERE generated_image_url LIKE 'https://da706efc88c11c0f5ec999dde8d3fc37.r2.cloudflarestorage.com/%';

UPDATE public.styles 
SET original_image_url = REPLACE(original_image_url, 'https://da706efc88c11c0f5ec999dde8d3fc37.r2.cloudflarestorage.com/', 'https://pumpbanana.com/')
WHERE original_image_url LIKE 'https://da706efc88c11c0f5ec999dde8d3fc37.r2.cloudflarestorage.com/%';
