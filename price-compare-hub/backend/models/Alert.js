import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  targetPrice: { type: Number, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'active' } // active, triggered, cancelled
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
