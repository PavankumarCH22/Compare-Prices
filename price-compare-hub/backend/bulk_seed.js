import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/price-compare-hub')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const brands = [
  // Tech & Electricals
  'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'LG', 'Whirlpool', 'Philips', 'Bosch', 'Panasonic', 'Havells', 'Bajaj', 'Voltas', 'Dyson',
  // Fashion & Clothes
  'Nike', 'Adidas', 'Puma', 'Allen Solly', 'Raymond', 'Peter England', 'Louis Philippe', 'Van Heusen', 'Zara', 'H&M', 'Biba', 'W for Woman',
  // Kids & Toys
  'Mothercare', 'Zara Kids', 'H&M Kids', 'Max Fashion', 'LEGO', 'Fisher-Price', 'Hot Wheels', 'Barbie', 'Hasbro', 'Nerf',
  // Beauty
  'L\'Oreal', 'Lakme', 'Maybelline', 'MAC',
  // Jewelry & Accessories
  'Tanishq', 'Kalyan Jewellers', 'Malabar', 'CaratLane', 'Swarovski', 'Fossil',
  // Home Decor
  'Home Centre', 'IKEA', 'Chumbak'
];
const categories = ['Electronics', 'Fashion', 'Home Appliances', 'Beauty', 'Sports', 'Kids Wear', 'Toys', 'Electricals', 'Formal Wear', 'Jewelry', 'Home Decor'];
const platforms = ['Amazon', 'Flipkart', 'Croma', 'Myntra', 'Ajio', 'Reliance Digital', 'Tata Cliq', 'Snapdeal', 'Nykaa', 'Meesho', 'FirstCry'];

const adjectives = ['Pro', 'Max', 'Ultra', 'Lite', 'Plus', 'Essential', 'Premium', 'Elite', 'Basic', 'Advanced', 'Stylish', 'Comfortable', 'Trendy', 'Casual', 'Party', 'Smart', 'Energy Efficient', 'Heavy Duty', 'Luxury'];
const items = [
  // Electronics
  'Smartphone', 'Mobile Phone', 'Laptop', 'Headphones', 'Earphones', 'TV', 'Watch',
  // Home Appliances & Electricals
  'Vacuum Cleaner', 'Airfryer', 'Refrigerator', 'Washing Machine', 'Microwave', 'Ceiling Fan', 'Air Conditioner', 'Mixer Grinder', 'Water Heater',
  // Fashion & Dress Clothes
  'Shoes', 'Jacket', 'Men\'s Suit', 'Formal Shirt', 'Trousers', 'Blazer', 'Women\'s Dress', 'Saree', 'Kurta Set', 'Shirt', 'Jeans', 'Pants',
  // Kids & Toys
  'Boys T-Shirt', 'Girls Frock', 'Boys Jeans', 'Girls Party Dress', 'Kids Ethnic Wear', 'Building Blocks', 'Action Figure', 'Remote Control Car', 'Dollhouse', 'Board Game', 'Plush Toy',
  // Beauty
  'Serum', 'Lipstick', 'Face Wash',
  // Jewelry
  'Earrings', 'Gold Ring', 'Diamond Ring', 'Gold Chain', 'Silver Chain', 'Necklace',
  // Home Decor
  'Photo Frame', 'Wall Clock', 'Vase', 'Table Lamp'
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateProducts = (count) => {
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const brand = getRandomItem(brands);
    const item = getRandomItem(items);
    const adjective = getRandomItem(adjectives);
    const category = getRandomItem(categories);
    const name = `${brand} ${item} ${adjective} - Model ${getRandomInt(100, 9999)}`;
    
    // Generate 2 to 5 random prices for this product
    const numPrices = getRandomInt(2, 5);
    const prices = [];
    const usedPlatforms = new Set();
    
    const basePrice = getRandomInt(1000, 150000); // 1k to 1.5L
    
    for (let j = 0; j < numPrices; j++) {
      let platform;
      do {
        platform = getRandomItem(platforms);
      } while (usedPlatforms.has(platform));
      usedPlatforms.add(platform);
      
      const discount = getRandomInt(0, Math.floor(basePrice * 0.3)); // up to 30% discount
      const deliveryCharge = getRandomItem([0, 0, 40, 50, 100]); // often free
      const finalPrice = basePrice - discount + deliveryCharge;
      
      prices.push({
        platformName: platform,
        price: basePrice,
        discount,
        deliveryCharge,
        finalPrice,
        productUrl: `https://${platform.toLowerCase().replace(' ', '')}.com/product/${getRandomInt(1000, 9999)}`,
        rating: (Math.random() * (5 - 3) + 3).toFixed(1), // 3.0 to 5.0
      });
    }
    
    // Sort to find lowest
    const sortedPrices = [...prices].sort((a, b) => a.finalPrice - b.finalPrice);
    
    products.push({
      name,
      brand,
      category,
      image: `https://picsum.photos/seed/${getRandomInt(1, 1000)}/400/400`,
      description: `This is a randomly generated high-quality ${item} by ${brand}. Featuring the latest ${adjective} technology.`,
      prices,
      lowestPrice: sortedPrices[0].finalPrice,
      bestPlatform: sortedPrices[0].platformName
    });
  }
  
  return products;
};

const runBulkSeed = async () => {
  const TOTAL_PRODUCTS = 40000;
  const CHUNK_SIZE = 5000;
  const chunks = TOTAL_PRODUCTS / CHUNK_SIZE;

  try {
    console.log('Clearing existing products...');
    await Product.deleteMany();
    
    console.log(`Starting to generate and insert ${TOTAL_PRODUCTS} products...`);
    
    for (let i = 0; i < chunks; i++) {
      const productsChunk = generateProducts(CHUNK_SIZE);
      await Product.insertMany(productsChunk);
      console.log(`Inserted chunk ${i + 1}/${chunks} (${(i + 1) * CHUNK_SIZE} products)`);
    }
    
    console.log('✅ Successfully inserted 40,000 products!');
    process.exit();
  } catch (error) {
    console.error('❌ Error during bulk seed:', error);
    process.exit(1);
  }
};

runBulkSeed();
