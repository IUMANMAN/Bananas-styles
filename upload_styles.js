const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to load env file simply
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const content = fs.readFileSync(envPath, 'utf-8');
        const env = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Remove quotes if any
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error('Could not load .env.local', e);
        return {};
    }
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const dataPath = path.join(__dirname, 'downloaded_images/cards_data.json');

function generateSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // Support Chinese chars
        .replace(/^-|-$/g, '')
        + '-' + Math.random().toString(36).substring(2, 8); // Add suffix to ensure unique
}

async function upload() {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const cards = JSON.parse(rawData);

    console.log(`Starting upload of ${cards.length} styles...`);
    
    let successCount = 0;
    
    for (const card of cards) {
        const slug = generateSlug(card.title);
        
        const payload = {
            title: card.title,
            prompt: card.prompt,
            generated_image_url: card.generated_image_url,
            original_image_url: card.original_image_url || null, // Ensure valid null
            source_url: card.author, // Mapping Author -> source_url
            slug: slug,
            // user_id left as null (no owner)
        };

        const { data, error } = await supabase
            .from('styles')
            .insert([payload])
            .select();

        if (error) {
            console.error(`Failed to insert "${card.title}":`, error.message);
        } else {
            console.log(`Inserted: ${card.title} (${slug})`);
            successCount++;
        }
    }

    console.log(`Upload Complete. Success: ${successCount}/${cards.length}`);
}

upload().catch(console.error);
