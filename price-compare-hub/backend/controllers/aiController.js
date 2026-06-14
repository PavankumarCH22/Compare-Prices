import Product from '../models/Product.js';
import Alert from '../models/Alert.js';

// Helper to extract budget
const extractBudget = (msg) => {
  const match = msg.match(/under\s*(?:rs\.?|₹|inr)?\s*(\d+,?\d*)/i);
  if (match) return parseInt(match[1].replace(/,/g, ''));
  return null;
};

// Helper to extract category or keyword
const extractCategoryOrKeyword = (msg) => {
  const words = msg.toLowerCase().replace(/best|under|cheapest|where|is|the/g, '').trim().split(' ');
  return words[0] || '';
};

// @desc    Process AI Chat message
// @route   POST /api/ai/chat
// @access  Public
export const processChat = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const lowerMsg = message.toLowerCase();

    // 1. Budget Search & Recommendation ("Best phone under 20000")
    if (lowerMsg.includes('best') && lowerMsg.includes('under')) {
      const budget = extractBudget(lowerMsg);
      const keyword = extractCategoryOrKeyword(lowerMsg);
      
      if (!budget) return res.json({ reply: "I couldn't detect a valid budget. Please ask like 'Best phone under ₹20000'." });

      const products = await Product.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } }
        ],
        lowestPrice: { $lte: budget, $gt: 0 }
      }).sort({ lowestPrice: -1, 'prices.rating': -1 }).limit(3);

      if (products.length === 0) {
        return res.json({ reply: `I couldn't find any good deals for '${keyword}' under ₹${budget} right now.` });
      }

      const topProduct = products[0];
      const reply = `The best deal is **${topProduct.name}** from **${topProduct.bestPlatform}** at **₹${topProduct.lowestPrice.toLocaleString()}**. Would you like to view this product?`;
      
      return res.json({ 
        reply, 
        suggestedProducts: products.map(p => ({ id: p._id, name: p.name, price: p.lowestPrice, image: p.image }))
      });
    }

    // 2. Price Comparison ("Where is iPhone 15 cheapest?")
    if (lowerMsg.includes('cheapest') || lowerMsg.includes('lowest price')) {
      const keyword = lowerMsg.replace(/where is|cheapest|lowest price|the|\?/g, '').trim();
      
      const products = await Product.find({ name: { $regex: keyword, $options: 'i' } }).sort({ lowestPrice: 1 }).limit(1);
      
      if (products.length === 0) {
        return res.json({ reply: `I couldn't find pricing information for '${keyword}'.` });
      }

      const product = products[0];
      return res.json({ 
        reply: `The cheapest place to buy **${product.name}** is on **${product.bestPlatform}** for **₹${product.lowestPrice.toLocaleString()}**.`,
        suggestedProducts: [{ id: product._id, name: product.name, price: product.lowestPrice, image: product.image }]
      });
    }

    // 3. Price Drop Alert Help ("Alert me when laptop is below 45000")
    if (lowerMsg.includes('alert') || lowerMsg.includes('notify')) {
      const budget = extractBudget(lowerMsg);
      const keyword = lowerMsg.replace(/alert me when|notify me when|is below|under/g, '').replace(/\d+/g, '').trim();

      if (!userId) {
        return res.json({ reply: "Please login to set up a price drop alert!" });
      }

      if (!budget) {
        return res.json({ reply: "Please specify a target price. For example: 'Alert me when iPhone is below ₹50000'." });
      }

      const products = await Product.find({ name: { $regex: keyword, $options: 'i' } }).limit(1);
      if (products.length > 0) {
        const product = products[0];
        // Create alert (Assuming email comes from user context in frontend)
        return res.json({ 
          reply: `I can set up an alert for **${product.name}** at ₹${budget}. Should I create this alert now?`,
          action: 'CREATE_ALERT',
          payload: { productId: product._id, targetPrice: budget, productName: product.name }
        });
      }
      return res.json({ reply: `I couldn't find exactly which product you meant by '${keyword}'. Please try searching first!` });
    }

    // 4. Smart Buying Advice ("Is iPhone 15 worth buying?")
    if (lowerMsg.includes('worth buying') || lowerMsg.includes('advice')) {
      const keyword = lowerMsg.replace(/is|worth buying|advice|on|\?/g, '').trim();
      const products = await Product.find({ name: { $regex: keyword, $options: 'i' } }).limit(1);
      
      if (products.length > 0) {
        const product = products[0];
        const avgRating = product.prices[0]?.rating || 4;
        
        return res.json({ 
          reply: `**${product.name}** is currently priced at ₹${product.lowestPrice.toLocaleString()} on ${product.bestPlatform}. With a rating of ${avgRating} stars, it is a great choice in the ${product.category} category. Pros: Excellent brand value, top features. Cons: Might be pricey depending on your budget.`,
          suggestedProducts: [{ id: product._id, name: product.name, price: product.lowestPrice, image: product.image }]
        });
      }
    }

    // Default Fallback
    return res.json({ 
      reply: "Hi! I am DealBot AI. You can ask me things like:\n- Best phone under ₹20000\n- Where is iPhone 15 cheapest?\n- Alert me when Sony headphones drop below ₹25000." 
    });

  } catch (error) {
    res.status(500).json({ reply: "Sorry, I am having trouble connecting to my servers right now." });
  }
};
