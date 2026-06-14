import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';
import { demoProducts } from './data/demoProducts.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/price-compare-hub')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: hashedAdminPassword, role: 'admin' },
      { name: 'Test User', email: 'user@example.com', password: hashedUserPassword, role: 'user' }
    ]);

    // Strip out the custom string _id so MongoDB generates its own native ObjectIds,
    // which is more professional for database storage.
    const productsData = demoProducts.map(p => {
      const { _id, ...rest } = p;
      return rest;
    });

    await Product.insertMany(productsData);

    console.log(`✅ ${demoProducts.length} Premium products and user credentials seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
