import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('test_output.html', 'utf8');
const $ = cheerio.load(html);

console.log('Searching for price elements in grid view...');

// Look for elements starting with ₹ or containing ₹
$('*').each((i, el) => {
  const text = $(el).text().trim();
  const className = $(el).attr('class');
  
  if (text.startsWith('₹') && text.length < 15) {
    console.log(`Tag: ${el.name}, Class: ${className}, Text: ${text}`);
    
    // Print ancestors
    let parent = $(el).parent();
    console.log(`  Parent: Tag = ${parent[0].name}, Class = ${parent.attr('class') || 'None'}`);
  }
});
