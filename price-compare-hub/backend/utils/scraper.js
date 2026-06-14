import axios from 'axios';
import * as cheerio from 'cheerio';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Host': 'www.flipkart.com',
  'Referer': 'https://www.flipkart.com/'
};

// Guess product category based on product title or search term
export const guessCategory = (title, query = '') => {
  const text = (title + ' ' + query).toLowerCase();
  
  if (/phone|mobile|iphone|samsung|oneplus|pixel|xiaomi|motorola|headphone|earphone|audio|speaker|tv|laptop|tablet|watch|smartwatch|gaming|console|ps5|nintendo|camera|drone|gopro/i.test(text)) {
    return 'Electronics';
  }
  if (/shoe|sneaker|jeans|trouser|pant|shirt|t-shirt|polo|jacket|blazer|dress|saree|kurta|ethnic|clothing|fashion|suit/i.test(text)) {
    return 'Fashion';
  }
  if (/racket|football|soccer|cricket|bat|ball|dumbbell|weights|gym|yoga|sports|nivia|yonex/i.test(text)) {
    return 'Sports';
  }
  if (/vacuum|cleaner|fryer|cooker|ac|fan|refrigerator|fridge|microwave|heater|grinder|kettle|appliance/i.test(text)) {
    return 'Home Appliances';
  }
  if (/serum|cleanser|moisturizer|lipstick|shampoo|cream|facewash|beauty|makeup|hair|face|l\'oreal|cerave|lakme/i.test(text)) {
    return 'Beauty';
  }
  if (/lamp|bulb|decor|vase|frame|mug|table|chair|sofa|curtain|cushion|clock|ikea|chumbak|homecentre/i.test(text)) {
    return 'Home Decor';
  }
  
  return 'Electronics';
};

// Guess product brand from title
export const guessBrand = (title) => {
  const firstWord = title.trim().split(' ')[0];
  const commonBrands = ['Apple', 'Samsung', 'Sony', 'OnePlus', 'Google', 'Xiaomi', 'Motorola', 'Dell', 'HP', 'ASUS', 'Lenovo', 'Bose', 'JBL', 'Marshall', 'Nintendo', 'DJI', 'GoPro', 'Fujifilm', 'Garmin', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Allen Solly', 'Raymond', 'Tommy Hilfiger', 'Biba', 'W for Woman', 'Dyson', 'Philips', 'Instant Pot', 'Hamilton Beach', 'Havells', 'Voltas', 'L\'Oreal', 'CeraVe', 'Lakme', 'MAC', 'Estee Lauder', 'LEGO', 'Chumbak', 'IKEA', 'Home Centre'];
  
  const found = commonBrands.find(brand => brand.toLowerCase() === firstWord.toLowerCase());
  return found || firstWord;
};

// Scrape live items from Flipkart search results
export const scrapeFlipkart = async (query) => {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    const res = await axios.get(searchUrl, { headers, timeout: 5000 });
    const $ = cheerio.load(res.data);
    const products = [];

    const isGrid = $('div.bLCLBY').length > 0;
    const itemSelector = isGrid ? 'div.bLCLBY' : 'div.nZIRY7, div.lvJbLV';

    $(itemSelector).each((i, el) => {
      const container = $(el);
      
      let title = container.find('a.atJtCj, div.RG5Slk, div.KzDlHZ, div._4rR01T, a.wSRGWg').first().text().trim();
      let priceText = container.find('div.hZ3P6w, div.QiMO5r, div._30jeq3, div.Nx9311').first().text().trim();
      let image = container.find('img.MZeksS, img.UCc1lI, img._396cs4, img.DByoEF').first().attr('src');
      let link = container.find('a[href*="/p/"]').first().attr('href');
      let rating = container.find('span.CjyrHS, div._3LWZlK, span.XQD0A-, div.MKiFS6').first().text().trim();

      if (!title) {
        title = container.find('img').first().attr('alt');
      }

      if (title && priceText && priceText !== 'Price: Not Available') {
        const cleanPriceMatch = priceText.match(/₹\s*([0-9,]+)/);
        if (cleanPriceMatch) {
          const priceNum = parseInt(cleanPriceMatch[1].replace(/,/g, ''));
          if (!isNaN(priceNum)) {
            products.push({
              name: title,
              price: priceNum,
              rating: rating ? parseFloat(rating) : 4.5,
              image: image || 'https://m.media-amazon.com/images/I/81sigp+ePRL._SL1500_.jpg',
              url: link ? 'https://www.flipkart.com' + link : 'https://www.flipkart.com'
            });
          }
        }
      }
    });

    return products;
  } catch (err) {
    console.error('Flipkart Scraping Error:', err.message);
    return [];
  }
};
