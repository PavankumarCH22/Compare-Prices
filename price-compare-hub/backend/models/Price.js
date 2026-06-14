import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  platformName: { type: String, required: true }, // e.g., Amazon, Flipkart, Croma
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  productUrl: { type: String, required: true },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Price', priceSchema);
