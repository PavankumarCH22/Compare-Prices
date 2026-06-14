import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, TrendingDown, ShieldCheck, Star } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const getStoreSearchUrl = (platformName, productName) => {
  const query = encodeURIComponent(productName);
  switch (platformName.toLowerCase().trim()) {
    case 'amazon':
      return `https://www.amazon.in/s?k=${query}`;
    case 'flipkart':
      return `https://www.flipkart.com/search?q=${query}`;
    case 'croma':
      return `https://www.croma.com/searchB?q=${query}`;
    case 'reliance digital':
      return `https://www.reliancedigital.in/search?q=${query}`;
    case 'myntra':
      return `https://www.myntra.com/search?q=${query}`;
    case 'ajio':
      return `https://www.ajio.com/search/?text=${query}`;
    case 'nykaa':
      return `https://www.nykaa.com/search/result/?q=${query}`;
    case 'tata cliq':
      return `https://www.tatacliq.com/search/?searchCategory=all&text=${query}`;
    case 'meesho':
      return `https://www.meesho.com/search?q=${query}`;
    default:
      return `https://google.com/search?q=${query}+buy+online`;
  }
};

const getPlatformPillClass = (platformName) => {
  if (!platformName) return 'bg-purple-50 text-purple-700 border-purple-200';
  switch (platformName.toLowerCase().trim()) {
    case 'amazon':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'flipkart':
      return 'bg-blue-50 text-[#2874f0] border-blue-200';
    case 'meesho':
      return 'bg-pink-50 text-pink-600 border-pink-200';
    case 'croma':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'reliance digital':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'myntra':
      return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
    case 'ajio':
      return 'bg-slate-100 text-slate-800 border-slate-350';
    default:
      return 'bg-purple-50 text-purple-700 border-purple-200';
  }
};

const ProductCard = ({ product }) => {
  // Calculate discount percentage and savings
  const getDiscountStats = () => {
    if (!product.prices || product.prices.length === 0) return null;
    
    // Find price at best platform or max discount
    const bestDeal = product.prices.find(p => p.finalPrice === product.lowestPrice) || product.prices[0];
    const originalPrice = bestDeal.price;
    const finalPrice = bestDeal.finalPrice;
    
    if (originalPrice > finalPrice) {
      const pct = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
      return { pct, savings: originalPrice - finalPrice };
    }
    return null;
  };
  
  // Calculate average rating across all sellers
  const getAverageRating = () => {
    if (!product.prices || product.prices.length === 0) return 0;
    const validRatings = product.prices.filter(p => p.rating > 0);
    if (validRatings.length === 0) return 0;
    const totalRating = validRatings.reduce((sum, p) => sum + (Number(p.rating) || 0), 0);
    return (totalRating / validRatings.length).toFixed(1);
  };

  const discountStats = getDiscountStats();
  const averageRating = getAverageRating();

  // Find lowest price store URL
  const bestDeal = product.prices?.find(p => p.finalPrice === product.lowestPrice) || product.prices?.[0];
  const targetUrl = bestDeal?.productUrl || getStoreSearchUrl(product.bestPlatform || bestDeal?.platformName || '', product.name);

  const handleCardClick = () => {
    window.location.href = targetUrl;
  };

  return (
    <Tilt
      className="h-full card-3d animate-fade-in"
      perspective={1200}
      glareEnable={true}
      glareMaxOpacity={0.08}
      glareColor="#ffffff"
      glarePosition="all"
      glareBorderRadius="16px"
      scale={1.02}
      transitionSpeed={800}
    >
      <div 
        onClick={handleCardClick}
        className="flex flex-col h-full bg-white relative border border-gray-150 colorful-card shadow-md rounded-2xl overflow-hidden p-5 group inner-3d cursor-pointer"
      >
        {/* Image Area */}
        <div className="relative w-full pt-[75%] bg-white overflow-hidden flex items-center justify-center mb-3 rounded-xl border border-slate-50">
          <img 
            src={product.image} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {discountStats && discountStats.pct > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-[#fb641b] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-[0_2px_6px_rgba(239,68,68,0.3)] uppercase tracking-wide">
              {discountStats.pct}% OFF
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className="flex flex-col flex-grow">
          {/* Brand */}
          <span className="text-[10px] text-brand-purple font-black uppercase tracking-widest mb-0.5">{product.brand}</span>
          
          {/* Title */}
          <h3 className="font-semibold text-gray-800 text-sm mb-1.5 line-clamp-2 leading-tight group-hover:text-brand-purple transition-colors">
            {product.name}
          </h3>

          {/* Rating & Assured Tag */}
          <div className="flex items-center gap-2 mb-2.5">
            {averageRating > 0 && (
              <span className="bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                {averageRating} <span className="text-[9px]">★</span>
              </span>
            )}
            <span className="text-xs font-bold text-gray-400">
              ({(product.reviewsCount || Math.floor(Math.random() * 2000) + 100).toLocaleString()})
            </span>
          </div>
          
          {/* Price Area (Flipkart Style) */}
          <div className="mt-auto pt-2 border-t border-slate-50">
            {product.lowestPrice ? (
              <div>
                <div className="flex items-baseline flex-wrap gap-1.5 mb-1.5">
                  {/* Selling Price */}
                  <span className="text-lg font-black text-gray-900">
                    ₹{product.lowestPrice.toLocaleString()}
                  </span>
                  
                  {/* MRP (Original Price) */}
                  {product.prices && product.prices.length > 0 && product.prices[0].price > product.lowestPrice && (
                    <span className="text-xs text-gray-400 line-through font-semibold">
                      ₹{product.prices[0].price.toLocaleString()}
                    </span>
                  )}

                  {/* Off Percentage */}
                  {discountStats && discountStats.pct > 0 && (
                    <span className="text-xs font-extrabold text-[#388e3c]">
                      {discountStats.pct}% off
                    </span>
                  )}
                </div>
                
                {/* Delivery & Platform Tag */}
                <div className="text-[11px] text-gray-500 font-medium flex items-center justify-between mt-1 mb-3">
                  <span className="text-[#388e3c] font-bold">Free delivery</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getPlatformPillClass(product.bestPlatform)}`}>
                    via {product.bestPlatform}
                  </span>
                </div>

                {/* Compare Prices Button */}
                <Link
                  to={`/product/${product._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="compare-btn mt-2 w-full py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-black text-xs text-center rounded-xl hover:shadow-[0_4px_15px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 block border-b-2 border-pink-700 active:border-b-0"
                >
                  Compare Prices
                </Link>
              </div>
            ) : (
              <span className="text-xs text-gray-500 font-medium">Price unavailable</span>
            )}
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default ProductCard;
