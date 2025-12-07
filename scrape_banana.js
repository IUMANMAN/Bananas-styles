const fs = require('fs');
const path = require('path');
const https = require('https');

const readmePath = path.join(__dirname, 'downloaded_images/README.md');
const downloadDir = path.join(__dirname, 'downloaded_images');
const outputJsonPath = path.join(downloadDir, 'cards_data.json');
const BASE_URL = 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/';

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(downloadDir, filename);
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else {
                file.close();
                // Ignore 404s gracefully, just log
                console.warn(`Failed to download ${url}: ${response.statusCode}`);
                resolve(null); 
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => {}); // Delete the file async.
            console.error(`Error downloading ${url}: ${err.message}`);
            resolve(null);
        });
    });
}

function parseReadme() {
    const content = fs.readFileSync(readmePath, 'utf-8');
    const lines = content.split('\n');
    const cards = [];

    let currentCard = null;
    let inCodeBlock = false;
    let codeBlockContent = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 1. Detect New Card Title
        // Example: ### 例 1: [Title](Link)（by [@User](Link)）
        const titleMatch = line.match(/^### 例 \d+: \[(.*?)\]/);
        if (titleMatch) {
            // Push previous if exists
            if (currentCard) {
                if (codeBlockContent.length > 0) {
                    currentCard.prompt = codeBlockContent.join('\n').trim();
                }
                cards.push(currentCard);
            }
            
            // Extract "by ..." info
            // The line continues after the title link. 
            // We match everything after the title link closing parenthesis
            // Regex to find title link parenthesis end is tricky, simplified approach:
            // Match the whole line, then just grab what's after the title match?
            // Title match is `### 例 1: [Title]`
            // The format is `### 例 1: [Title](Link)（by ...）`
            
            let author = '';
            // Match the part after the first `](...)` 
            // This regex looks for `](` then non-parenthesis chars then `)`
            const byMatch = line.match(/\]\(.*?\)(.*)$/);
            if (byMatch && byMatch[1]) {
                author = byMatch[1].trim(); 
                // Remove leading/trailing parenthesis symbols if needed
                // But user wanted to keep the markdown link.
            }

            currentCard = {
                title: titleMatch[1],
                author: author,
                prompt: '',
                images: { input: null, output: null } 
            };
            codeBlockContent = [];
            inCodeBlock = false;
            continue;
        }

        if (!currentCard) continue;

        // 2. Detect Images
        // e.g. <img src="images/pro_case1/output.jpg" width="300" alt="输出结果"> or ![]()
        
        // Check <img> tags
        const relativeImgMatches = [...line.matchAll(/src=["'](images\/.*?)["']/g)];
        if (relativeImgMatches.length > 0) {
            relativeImgMatches.forEach(m => {
                 const relPath = m[1];
                 if (relPath.includes('output') || relPath.includes('case')) {
                     currentCard.images.output = relPath;
                 } else if (relPath.includes('input')) {
                     currentCard.images.input = relPath;
                 }
            });
        }
        
        // Check markdown images ![]()
        const mdImgMatches = [...line.matchAll(/!\[.*?\]\((images\/.*?)\)/g)];
        if (mdImgMatches.length > 0) {
             mdImgMatches.forEach(m => {
                 const relPath = m[1];
                 if (relPath.includes('output') || relPath.includes('case')) {
                     currentCard.images.output = relPath;
                 } else if (relPath.includes('input')) {
                     currentCard.images.input = relPath;
                 }
            });
        }


        // 3. Detect Prompt (Code Block)
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
                codeBlockContent = []; 
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent.push(line);
        }
    }

    // Push last card
    if (currentCard) {
        if (codeBlockContent.length > 0) {
            currentCard.prompt = codeBlockContent.join('\n').trim();
        }
        cards.push(currentCard);
    }

    return cards;
}

async function main() {
    const cards = parseReadme();
    console.log(`Found ${cards.length} cards.`);

    const finalData = [];

    for (let c of cards) {
        const item = { ...c };
        delete item.images; 
        
        // Process Output Image
        if (c.images.output) {
            const ext = path.extname(c.images.output);
            const filename = `${c.title.replace(/[\/\\?%*:|"<>]/g, '-')}_output${ext}`;
            const url = BASE_URL + c.images.output;
            
            // Re-download to ensure we have files (overwrite is fine)
            // console.log(`Downloading ${filename}...`);
            await downloadImage(url, filename);

            // Set Public URL
            item.generated_image_url = `https://pumpbanana.com/${filename}`;
        }

        // Process Input Image (if any)
        if (c.images.input) {
            const ext = path.extname(c.images.input);
            const filename = `${c.title.replace(/[\/\\?%*:|"<>]/g, '-')}_input${ext}`;
            const url = BASE_URL + c.images.input;
            
            // console.log(`Downloading ${filename}...`);
            await downloadImage(url, filename);

            item.original_image_url = `https://pumpbanana.com/${filename}`;
        }

        finalData.push(item);
    }

    fs.writeFileSync(outputJsonPath, JSON.stringify(finalData, null, 2));
    console.log(`Saved metadata to ${outputJsonPath}`);
}

main().catch(console.error);
