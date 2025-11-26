// Script to download all images from seed data
const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the seed route file to extract image URLs
const seedFile = fs.readFileSync('./src/app/api/seed/route.ts', 'utf8');

// Extract all image URLs from the scrapedData
const imageUrlRegex = /"https:\/\/imgv3\.fotor\.com\/[^"]+"/g;
const urls = [...new Set(seedFile.match(imageUrlRegex).map(url => url.replace(/"/g, '')))];

console.log(`Found ${urls.length} unique images to download`);

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

async function downloadAll() {
  const publicDir = path.join(__dirname, 'public', 'img');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let count = 0;
  for (const url of urls) {
    const filename = path.basename(url.split('?')[0]);
    const filepath = path.join(publicDir, filename);
    
    try {
      await downloadImage(url, filepath);
      count++;
    } catch (error) {
      console.error(`✗ Failed: ${filename}`, error.message);
    }
  }

  console.log(`\n✓ Successfully downloaded ${count}/${urls.length} images`);
}

downloadAll().catch(console.error);
