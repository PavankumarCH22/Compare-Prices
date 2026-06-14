import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/price-compare-hub')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const specificProducts = [
  { name: 'Sony Wireless Ear Phones', category: 'Electronics', item: 'ear phones' },
  { name: 'Samsung Galaxy Mobiles', category: 'Electronics', item: 'mobiles' },
  { name: 'Allen Solly Cotton Shirts', category: 'Fashion', item: 'shirts' },
  { name: 'Levi\'s Denim Jeans', category: 'Fashion', item: 'jeans' },
  { name: 'Raymond Formal Pants', category: 'Fashion', item: 'pants' },
  { name: 'Zara Premium Dress Clothes', category: 'Fashion', item: 'dress clothes' },
  { name: 'Tanishq Gold Ear Rings', category: 'Jewelry', item: 'ear rings' },
  { name: 'Kalyan Diamond Rings', category: 'Jewelry', item: 'rings' },
  { name: 'Malabar Gold Chine (Chain)', category: 'Jewelry', item: 'chine' },
  { name: 'IKEA Wooden Photo Fremes', category: 'Home Decor', item: 'photo fremes' }
];

const platforms = ['Amazon', 'Flipkart', 'Meesho', 'Myntra'];

const generatePrices = (basePrice) => {
  return platforms.map(platform => {
    const finalPrice = basePrice + Math.floor(Math.random() * 500) - 200;
    return {
      platformName: platform,
      price: finalPrice + 500,
      discount: 500,
      deliveryCharge: 0,
      finalPrice: finalPrice,
      productUrl: `https://${platform.toLowerCase()}.com`,
      rating: 4.5
    };
  });
};

const runSeed = async () => {
  try {
    const productsData = specificProducts.map((p, index) => {
      const basePrice = (index + 1) * 1000;
      const prices = generatePrices(basePrice);
      const sortedPrices = [...prices].sort((a, b) => a.finalPrice - b.finalPrice);
      
      return {
        name: p.name,
        brand: p.name.split(' ')[0],
        category: p.category,
        image: `https://picsum.photos/seed/${index + 100}/400/400`,
        description: `This is the best ${p.item} you can find.`,
        prices,
        lowestPrice: sortedPrices[0].finalPrice,
        bestPlatform: sortedPrices[0].platformName
      };
    });

    await Product.insertMany(productsData);
    console.log('✅ Specific requested products inserted successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error during specific seed:', error);
    process.exit(1);
  }
};

runSeed();
