import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  platformName: { type: String, required: true },
  price: { type: Number, required: true }, // originalPrice
  discount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  productUrl: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  stockStatus: { type: String, default: 'In Stock' }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  subCategory: { type: String, index: true },
  image: { type: String, required: true },
  description: { type: String },
  prices: [priceSchema],
  lowestPrice: { type: Number, index: true },
  bestPlatform: { type: String }
}, { timestamps: true });

// Indexes for fast searching across 20 lakh products
productSchema.index({ name: 'text', brand: 'text', category: 'text', subCategory: 'text' });
productSchema.index({ lowestPrice: 1 });
productSchema.index({ category: 1, lowestPrice: 1 });

export default mongoose.model('Product', productSchema);
