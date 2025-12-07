const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuration
const SOURCE_JSON = 'downloaded_images/image_urls.json';
const TARGET_DIR = path.join(__dirname, 'downloaded_images', 'images');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
    console.log(`Creating directory: ${TARGET_DIR}`);
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Read URLs
try {
    const jsonContent = fs.readFileSync(path.join(__dirname, SOURCE_JSON), 'utf8');
    const urls = JSON.parse(jsonContent);

    if (!Array.isArray(urls)) {
        throw new Error('JSON file must contain an array.');
    }

    console.log(`Found ${urls.length} images to download.`);

    // Download each image
    urls.forEach((item, index) => {
        try {
            // Support both string URLs (legacy) and object format {url, filename}
            const url = typeof item === 'string' ? item : item.url;
            const targetFilename = typeof item === 'string' ? path.basename(new URL(url).pathname) : item.filename;
            
            if (!url) {
                 console.error(`[${index + 1}/${urls.length}] Missing URL for item index ${index}`);
                 return;
            }

            const filepath = path.join(TARGET_DIR, targetFilename);

            const file = fs.createWriteStream(filepath);

            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                     console.error(`[${index + 1}/${urls.length}] Failed to download ${url}: Status Code ${response.statusCode}`);
                     response.resume(); // Consume response to free up memory
                     return;
                }

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    console.log(`[${index + 1}/${urls.length}] Saved: ${targetFilename}`);
                });
            }).on('error', (err) => {
                fs.unlink(filepath, () => {}); // Delete the partial file
                console.error(`[${index + 1}/${urls.length}] Error downloading ${url}: ${err.message}`);
            });

        } catch (err) {
            console.error(`[${index + 1}/${urls.length}] Invalid item or Error:`, err.message);
        }
    });

} catch (err) {
    console.error(`Error reading ${SOURCE_JSON}:`, err.message);
}
