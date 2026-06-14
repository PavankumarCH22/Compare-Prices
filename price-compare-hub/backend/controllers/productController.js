import Product from '../models/Product.js';
import fs from 'fs';
import csv from 'csv-parser';
import NodeCache from 'node-cache';
import mongoose from 'mongoose';
import { demoProducts } from '../data/demoProducts.js';
import { scrapeFlipkart, guessCategory, guessBrand } from '../utils/scraper.js';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache
const fallbackProducts = [...demoProducts];

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

// Helper to calculate lowest price
const calculateLowestPrice = (prices) => {
  if (!prices || prices.length === 0) return { lowestPrice: null, bestPlatform: null };
  const sorted = [...prices].sort((a, b) => a.finalPrice - b.finalPrice);
  return { lowestPrice: sorted[0].finalPrice, bestPlatform: sorted[0].platformName };
};

const getFallbackProducts = ({ page, limit, search, category, brand, sort, minPrice, maxPrice, rating }) => {
  const normalizedSearch = search?.trim().toLowerCase();
  
  // Parse brand filters (comma-separated support)
  const brandList = brand ? brand.split(',').map(b => b.trim().toLowerCase()) : [];

  let products = fallbackProducts.filter((product) => {
    const matchesSearch = !normalizedSearch || [product.name, product.brand, product.category]
      .some(value => value?.toLowerCase().includes(normalizedSearch));
    
    const matchesCategory = !category || product.category === category;
    
    const matchesBrand = brandList.length === 0 || brandList.includes(product.brand.toLowerCase());
    
    const matchesMinPrice = !minPrice || product.lowestPrice >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || product.lowestPrice <= Number(maxPrice);
    
    // Check average rating
    const avgRating = product.prices && product.prices.length > 0
      ? product.prices.reduce((sum, p) => sum + (p.rating || 0), 0) / product.prices.length
      : 0;
    const matchesRating = !rating || avgRating >= Number(rating);

    return matchesSearch && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesRating;
  });

  if (sort === 'low-price') products.sort((a, b) => a.lowestPrice - b.lowestPrice);
  else if (sort === 'high-price') products.sort((a, b) => b.lowestPrice - a.lowestPrice);
  else products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = products.length;
  const start = (page - 1) * limit;

  return {
    products: products.slice(start, start + limit),
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    total,
    demoMode: true
  };
};

// @desc    Fetch products with pagination, search, and filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, category, brand, sort, minPrice, maxPrice, rating } = req.query;

    // Trigger live scraping if a search term is specified
    if (search && search.trim().length > 2) {
      try {
        const query = search.trim();
        const scrapedItems = await scrapeFlipkart(query);
        
        if (scrapedItems && scrapedItems.length > 0) {
          if (isDatabaseConnected()) {
            const bulkOps = [];
            
            scrapedItems.forEach(item => {
              const flipPrice = item.price;
              
              // Amazon price: +/- 2%
              const amzPrice = Math.round(flipPrice * (1 + (Math.random() * 0.04 - 0.02)));
              // Meesho price: -4% to -8% (typically cheaper)
              const msPrice = Math.round(flipPrice * (0.94 + (Math.random() * 0.04 - 0.02)));

              const queryUrl = encodeURIComponent(item.name);

              const prices = [
                {
                  platformName: 'Amazon',
                  price: amzPrice + 500,
                  discount: 500,
                  deliveryCharge: 0,
                  finalPrice: amzPrice,
                  productUrl: `https://www.amazon.in/s?k=${queryUrl}`,
                  rating: parseFloat((item.rating + (Math.random() * 0.2 - 0.1)).toFixed(1)),
                  reviewsCount: Math.floor(Math.random() * 8000) + 100,
                  stockStatus: 'In Stock'
                },
                {
                  platformName: 'Flipkart',
                  price: flipPrice + 600,
                  discount: 600,
                  deliveryCharge: 0,
                  finalPrice: flipPrice,
                  productUrl: item.url,
                  rating: item.rating,
                  reviewsCount: Math.floor(Math.random() * 12000) + 200,
                  stockStatus: 'In Stock'
                },
                {
                  platformName: 'Meesho',
                  price: msPrice + 200,
                  discount: 200,
                  deliveryCharge: 0,
                  finalPrice: msPrice,
                  productUrl: `https://www.meesho.com/search?q=${queryUrl}`,
                  rating: parseFloat((item.rating - (Math.random() * 0.3)).toFixed(1)),
                  reviewsCount: Math.floor(Math.random() * 4000) + 50,
                  stockStatus: 'In Stock'
                }
              ];

              const categoryGuessed = guessCategory(item.name, query);
              const brandGuessed = guessBrand(item.name);

              const productData = {
                name: item.name,
                brand: brandGuessed,
                category: categoryGuessed,
                subCategory: categoryGuessed === 'Electronics' ? 'Device' : 'General',
                image: item.image,
                description: `Real-time comparison product. Originally scraped from Flipkart search for '${query}'.`,
                prices,
                lowestPrice: Math.min(amzPrice, flipPrice, msPrice),
                bestPlatform: msPrice < Math.min(amzPrice, flipPrice) ? 'Meesho' : (amzPrice < flipPrice ? 'Amazon' : 'Flipkart')
              };

              bulkOps.push({
                updateOne: {
                  filter: { name: item.name },
                  update: { $set: productData },
                  upsert: true
                }
              });
            });

            if (bulkOps.length > 0) {
              await Product.bulkWrite(bulkOps);
              cache.flushAll(); // Clear search cache to show fresh data
            }
          } else {
            // Fallback product injection (memory mode)
            scrapedItems.forEach(item => {
              const flipPrice = item.price;
              const amzPrice = Math.round(flipPrice * (1 + (Math.random() * 0.04 - 0.02)));
              const msPrice = Math.round(flipPrice * (0.94 + (Math.random() * 0.04 - 0.02)));

              const queryUrl = encodeURIComponent(item.name);
              const categoryGuessed = guessCategory(item.name, query);
              const brandGuessed = guessBrand(item.name);

              const mockProduct = {
                _id: `demo-${Date.now()}-${Math.random()}`,
                name: item.name,
                brand: brandGuessed,
                category: categoryGuessed,
                subCategory: 'General',
                image: item.image,
                description: `Real-time comparison product. Scraped from Flipkart search for '${query}'.`,
                prices: [
                  { platformName: 'Amazon', finalPrice: amzPrice, rating: item.rating, productUrl: `https://www.amazon.in/s?k=${queryUrl}` },
                  { platformName: 'Flipkart', finalPrice: flipPrice, rating: item.rating, productUrl: item.url },
                  { platformName: 'Meesho', finalPrice: msPrice, rating: item.rating - 0.1, productUrl: `https://www.meesho.com/search?q=${queryUrl}` }
                ],
                lowestPrice: Math.min(amzPrice, flipPrice, msPrice),
                bestPlatform: msPrice < Math.min(amzPrice, flipPrice) ? 'Meesho' : (amzPrice < flipPrice ? 'Amazon' : 'Flipkart'),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                demoMode: true
              };

              if (!fallbackProducts.some(p => p.name.toLowerCase() === item.name.toLowerCase())) {
                fallbackProducts.unshift(mockProduct);
              }
            });
            cache.flushAll();
          }
        }
      } catch (scrapeErr) {
        console.error('Failed to run live scraper:', scrapeErr.message);
      }
    }

    if (!isDatabaseConnected()) {
      return res.json(getFallbackProducts({ page, limit, search, category, brand, sort, minPrice, maxPrice, rating }));
    }
    
    // Generate cache key with new parameters
    const cacheKey = `products_${page}_${limit}_${search || ''}_${category || ''}_${brand || ''}_${sort || ''}_${minPrice || ''}_${maxPrice || ''}_${rating || ''}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    let query = {};
    
    // Forgiving Regex Search for better partial matching and typos
    if (search) {
      const regexSearch = new RegExp(search.split(' ').join('.*'), 'i');
      query.$or = [
        { name: regexSearch },
        { brand: regexSearch },
        { category: regexSearch }
      ];
    }

    if (category) query.category = category;
    
    // Brand list filtering (supports comma separated e.g. "Apple,Samsung")
    if (brand) {
      const brandArray = brand.split(',').map(b => b.trim());
      query.brand = { $in: brandArray.map(b => new RegExp('^' + b + '$', 'i')) };
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      query.lowestPrice = {};
      if (minPrice) query.lowestPrice.$gte = Number(minPrice);
      if (maxPrice) query.lowestPrice.$lte = Number(maxPrice);
    }

    // Rating filtering
    if (rating) {
      query['prices.rating'] = { $gte: Number(rating) };
    }

    let sortQuery = {};
    if (sort === 'low-price') sortQuery.lowestPrice = 1;
    else if (sort === 'high-price') sortQuery.lowestPrice = -1;
    else sortQuery.createdAt = -1;

    // Run count and find in parallel for performance
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(), // lean() makes it faster
      Product.countDocuments(query)
    ]);

    const result = {
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const product = fallbackProducts.find(item => item._id === req.params.id);
      return product
        ? res.json({ ...product, demoMode: true })
        : res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id).lean();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a single product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { prices } = req.body;
    const { lowestPrice, bestPlatform } = calculateLowestPrice(prices || []);

    if (!isDatabaseConnected()) {
      const createdProduct = {
        ...req.body,
        _id: `demo-${Date.now()}`,
        lowestPrice,
        bestPlatform,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        demoMode: true
      };

      fallbackProducts.unshift(createdProduct);
      cache.flushAll();
      return res.status(201).json(createdProduct);
    }
    
    const product = new Product({
      ...req.body,
      lowestPrice,
      bestPlatform
    });
    
    const createdProduct = await product.save();
    cache.flushAll(); // clear cache
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { prices } = req.body;
    let updateData = { ...req.body };
    
    if (prices) {
      const { lowestPrice, bestPlatform } = calculateLowestPrice(prices);
      updateData.lowestPrice = lowestPrice;
      updateData.bestPlatform = bestPlatform;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    cache.flushAll();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    cache.flushAll();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk Upload Products from CSV
// @route   POST /api/products/bulk-upload
// @access  Private/Admin
export const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    let duplicateCount = 0;
    
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        // Expected CSV format: name, brand, category, subCategory, image, description, platformName, originalPrice, discount, deliveryCharge, finalPrice, rating, reviewsCount, stockStatus, productUrl
        results.push(data);
      })
      .on('end', async () => {
        // Group by product name to merge prices
        const productMap = new Map();
        
        for (const row of results) {
          const key = row.name.toLowerCase().trim();
          const priceObj = {
            platformName: row.platformName,
            price: Number(row.originalPrice) || 0,
            discount: Number(row.discount) || 0,
            deliveryCharge: Number(row.deliveryCharge) || 0,
            finalPrice: Number(row.finalPrice) || 0,
            productUrl: row.productUrl,
            rating: Number(row.rating) || 0,
            reviewsCount: Number(row.reviewsCount) || 0,
            stockStatus: row.stockStatus || 'In Stock'
          };
          
          if (productMap.has(key)) {
            productMap.get(key).prices.push(priceObj);
          } else {
            productMap.set(key, {
              name: row.name,
              brand: row.brand,
              category: row.category,
              subCategory: row.subCategory,
              image: row.image,
              description: row.description,
              prices: [priceObj]
            });
          }
        }

        const bulkOps = [];
        
        for (const [key, productData] of productMap) {
          const { lowestPrice, bestPlatform } = calculateLowestPrice(productData.prices);
          productData.lowestPrice = lowestPrice;
          productData.bestPlatform = bestPlatform;

          // Upsert to handle duplicates
          bulkOps.push({
            updateOne: {
              filter: { name: productData.name },
              update: { $set: productData },
              upsert: true
            }
          });
        }

        // Execute bulk write
        if (bulkOps.length > 0) {
          const bulkResult = await Product.bulkWrite(bulkOps);
          duplicateCount = bulkResult.matchedCount;
        }

        // Clean up file
        fs.unlinkSync(req.file.path);
        cache.flushAll(); // Clear cache after bulk import

        res.json({ 
          message: 'Bulk import completed',
          imported: productMap.size - duplicateCount,
          updated: duplicateCount,
          totalProcessed: results.length
        });
      });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/products/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const categoryStats = fallbackProducts.reduce((stats, product) => {
        const existing = stats.find(item => item._id === product.category);
        if (existing) existing.count += 1;
        else stats.push({ _id: product.category, count: 1 });
        return stats;
      }, []);

      return res.json({
        totalProducts: fallbackProducts.length,
        categoryStats,
        latestProducts: fallbackProducts.slice(0, 5),
        demoMode: true
      });
    }

    const totalProducts = await Product.countDocuments();
    
    // Aggregate products by category
    const categoryStats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    // Get latest imports
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5).lean();

    res.json({ 
      totalProducts, 
      categoryStats,
      latestProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a deal / shopping link to a product
// @route   POST /api/products/:id/deals
// @access  Private (Authenticated users)
export const addProductDeal = async (req, res) => {
  try {
    const { platformName, price, discount, deliveryCharge, productUrl, rating } = req.body;
    
    if (!platformName || !price || !productUrl) {
      return res.status(400).json({ message: 'Platform name, price, and product URL are required.' });
    }

    const newPriceObj = {
      platformName,
      price: Number(price),
      discount: Number(discount) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      finalPrice: Number(price) - (Number(discount) || 0) + (Number(deliveryCharge) || 0),
      productUrl,
      rating: Number(rating) || 4.5,
      reviewsCount: 1,
      stockStatus: 'In Stock'
    };

    if (!isDatabaseConnected()) {
      const product = fallbackProducts.find(item => item._id === req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      product.prices = product.prices || [];
      product.prices.push(newPriceObj);
      
      const { lowestPrice, bestPlatform } = calculateLowestPrice(product.prices);
      product.lowestPrice = lowestPrice;
      product.bestPlatform = bestPlatform;
      
      cache.flushAll();
      return res.json(product);
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.prices.push(newPriceObj);
    const { lowestPrice, bestPlatform } = calculateLowestPrice(product.prices);
    product.lowestPrice = lowestPrice;
    product.bestPlatform = bestPlatform;

    await product.save();
    cache.flushAll();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

