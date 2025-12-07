const https = require('https');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CHINESE_README_URL = 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/README.md';
const ENGLISH_README_URL = 'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/README_en.md';

function fetchContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseReadme(content, isEnglish) {
  const lines = content.split('\n');
  const cards = [];
  let currentCard = null;
  let inCodeBlock = false;
  let codeBlockContent = [];

  // Regex to extract Case ID (e.g., "18" from "### 例 18" or "### Case 18")
  // Chinese: ### 例 18: [Title](Link)...
  // English: ### Case 18: [Title](Link)...
  const headerRegex = isEnglish 
    ? /^### Case (\d+):\s*\[(.*?)\]/ 
    : /^### 例 (\d+):\s*\[(.*?)\]/;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const headerMatch = trimmedLine.match(headerRegex);

    if (headerMatch) {
      if (currentCard) {
        if (codeBlockContent.length > 0) {
          currentCard.prompt = codeBlockContent.join('\n').trim();
        }
        cards.push(currentCard);
      }

      currentCard = {
        id: parseInt(headerMatch[1]),
        title: headerMatch[2],
        prompt: ''
      };
      
      // Parse Introduction from the line? Usually it's just Title and prompt block.
      // We will stick to title and prompt for now.
      
      codeBlockContent = [];
      inCodeBlock = false;
      continue;
    }

    if (!currentCard) continue;

    if (trimmedLine.startsWith('```')) {
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

  if (currentCard) {
    if (codeBlockContent.length > 0) {
      currentCard.prompt = codeBlockContent.join('\n').trim();
    }
    cards.push(currentCard);
  }

  return cards;
}

async function main() {
  console.log('Fetching Chinese README...');
  const chContent = await fetchContent(CHINESE_README_URL);
  console.log('Fetching English README...');
  const enContent = await fetchContent(ENGLISH_README_URL);

  const chCards = parseReadme(chContent, false);
  const enCards = parseReadme(enContent, true);

  console.log(`Parsed ${chCards.length} Chinese cards and ${enCards.length} English cards.`);

  // Create a map of Case ID -> English Data
  const enMap = new Map();
  enCards.forEach(c => enMap.set(c.id, c));

  // Iterate over Chinese cards (which should match our DB records roughly by ID/Content)
  // To avoid ambiguous matching, we will fetch ALL styles from DB first.
  
  // Strategy:
  // 1. Fetch all styles from DB.
  // 2. We need to link DB style -> Case ID.
  //    The DB `title` currently holds the Chinese title.
  //    We can try to match DB `title` == `chCards.title`.
  
  const { data: styles, error } = await supabase.from('styles').select('id, title, prompt');
  if (error) {
    console.error('Error fetching styles:', error);
    return;
  }

  console.log(`Fetched ${styles.length} styles from DB.`);
  
  let updatedCount = 0;

  for (const style of styles) {
    // Find matching Chinese Card
    // Note: titles might match exactly or be close.
    // Let's try exact match on Title first.
    const chCard = chCards.find(c => c.title.trim() === style.title.trim());

    if (chCard) {
      const enCard = enMap.get(chCard.id);
      
      if (enCard) {
        // We have a match!
        // Update DB:
        // ch_title = chCard.title
        // ch_prompt = chCard.prompt (or style.prompt which is current Chinese prompt)
        // title = enCard.title
        // prompt = enCard.prompt

        const updates = {
          ch_title: chCard.title,
          ch_prompt: chCard.prompt, // Use the one from README to be sure, or can use existing style.prompt
          title: enCard.title,
          prompt: enCard.prompt
        };

        const { error: updateError } = await supabase
          .from('styles')
          .update(updates)
          .eq('id', style.id);

        if (updateError) {
          console.error(`Failed to update style ${style.id}:`, updateError);
        } else {
          console.log(`Updated Style ID ${style.id} (Case ${chCard.id})`);
          updatedCount++;
        }
      } else {
        console.warn(`No English data found for Case ${chCard.id} ("${style.title}")`);
      }
    } else {
      console.warn(`Could not match DB style "${style.title}" to any Chinese Case ID.`);
    }
  }

  console.log(`Completed. Updated ${updatedCount} styles.`);
}

main().catch(console.error);
