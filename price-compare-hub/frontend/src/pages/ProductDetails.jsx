import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, Star, Truck, ExternalLink, Heart, Bell, 
  TrendingDown, X, Lock, CreditCard, CheckCircle2, 
  MapPin, Loader2, Plus, AlertCircle, ShoppingCart, Zap, Info 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

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

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);

  // Flipkart style delivery states
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  // Live scraper simulator state
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedIndex, setScrapedIndex] = useState(-1);
  const [scrapeDirection, setScrapeDirection] = useState('none'); // 'up' or 'down'

  // Modal and custom notification states
  const [toast, setToast] = useState(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('');

  // Add Deal Modal States
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    platformName: 'Amazon',
    price: '',
    discount: '0',
    deliveryCharge: '0',
    productUrl: '',
    rating: '4.5'
  });
  const [addDealLoading, setAddDealLoading] = useState(false);
  const [addDealError, setAddDealError] = useState(null);
  const [addDealSuccess, setAddDealSuccess] = useState(null);

  // In-App Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlatform, setCheckoutPlatform] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Shipping, 2: Payment, 3: Processing, 4: Success
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processingMessage, setProcessingMessage] = useState('');
  
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Live scraping simulator hook
  useEffect(() => {
    if (loading || !product || product.prices.length === 0) return;

    const interval = setInterval(() => {
      simulateLiveScrape();
    }, 15000); // Scrape every 15 seconds

    return () => clearInterval(interval);
  }, [product, loading]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      if (data.prices) {
        data.prices.sort((a, b) => a.finalPrice - b.finalPrice);
      }
      setProduct(data);
      // Setup default alert price
      if (data.lowestPrice) {
        setAlertTargetPrice(Math.round(data.lowestPrice * 0.9));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product', error);
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Live scraping animation and calculation logic
  const simulateLiveScrape = () => {
    setIsScraping(true);
    
    setTimeout(() => {
      setProduct(prevProduct => {
        if (!prevProduct || !prevProduct.prices || prevProduct.prices.length === 0) return prevProduct;
        
        // Pick a random deal
        const randIdx = Math.floor(Math.random() * prevProduct.prices.length);
        const targetDeal = prevProduct.prices[randIdx];
        
        // Price fluctuations
        const changeAmount = Math.random() > 0.5 ? 80 : -80;
        setScrapedIndex(randIdx);
        setScrapeDirection(changeAmount > 0 ? 'up' : 'down');
        
        const updatedPrices = prevProduct.prices.map((p, idx) => {
          if (idx === randIdx) {
            const newPrice = Math.max(100, p.price + changeAmount);
            const newFinal = Math.max(100, newPrice - p.discount + p.deliveryCharge);
            return {
              ...p,
              price: newPrice,
              finalPrice: newFinal
            };
          }
          return p;
        });

        // Re-sort and find lowest price
        const sortedPrices = [...updatedPrices].sort((a, b) => a.finalPrice - b.finalPrice);
        const lowestPrice = sortedPrices[0].finalPrice;
        const bestPlatform = sortedPrices[0].platformName;

        showToast(`Scanned ${targetDeal.platformName}: Price updated by ₹${Math.abs(changeAmount)}!`, 'info');

        return {
          ...prevProduct,
          prices: sortedPrices,
          lowestPrice,
          bestPlatform
        };
      });

      setIsScraping(false);
      setTimeout(() => {
        setScrapedIndex(-1);
        setScrapeDirection('none');
      }, 3000);
    }, 2000);
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(pincode)) {
      setDeliveryInfo({ valid: false, message: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    setCheckingPincode(true);
    setDeliveryInfo(null);

    setTimeout(() => {
      setCheckingPincode(false);
      setDeliveryInfo({
        valid: true,
        days: pincode[0] % 2 === 0 ? 'Tomorrow, Thursday' : 'In 2-3 Days',
        charge: pincode[0] % 3 === 0 ? 40 : 0
      });
    }, 800);
  };

  const handleOpenAddDeal = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    setIsAddDealOpen(true);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    setWishlistAdded(!wishlistAdded);
    showToast(wishlistAdded ? "Removed from Wishlist" : "Saved to Wishlist!");
  };

  const handleAddAlertSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    try {
      await axios.post('/api/alerts', {
        productId: product._id,
        targetPrice: Number(alertTargetPrice),
        email: user.email
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setIsPriceAlertOpen(false);
      showToast('Price Drop alert set successfully! We will email you.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create alert', 'error');
    }
  };

  const handleAddDealSubmit = async (e) => {
    e.preventDefault();
    if (!newDeal.price || !newDeal.productUrl) {
      showToast('Price and URL are required', 'error');
      return;
    }
    setAddDealLoading(true);
    setAddDealError(null);
    setAddDealSuccess(null);

    try {
      const { data } = await axios.post(`/api/products/${id}/deals`, {
        ...newDeal,
        price: Number(newDeal.price),
        discount: Number(newDeal.discount) || 0,
        deliveryCharge: Number(newDeal.deliveryCharge) || 0,
        rating: Number(newDeal.rating) || 4.5
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setAddDealSuccess("Deal link added successfully!");
      if (data.prices) {
        data.prices.sort((a, b) => a.finalPrice - b.finalPrice);
      }
      setProduct(data);
      showToast("Store deal contributed successfully!");
      
      setTimeout(() => {
        setIsAddDealOpen(false);
        setNewDeal({
          platformName: "Amazon",
          price: "",
          discount: "0",
          deliveryCharge: "0",
          productUrl: "",
          rating: "4.5"
        });
        setAddDealSuccess(null);
      }, 1500);

    } catch (err) {
      setAddDealError(err.response?.data?.message || err.message || "Failed to add deal link.");
    } finally {
      setAddDealLoading(false);
    }
  };

  // Checkout operations
  const handleBuyNow = () => {
    if (!product || !product.prices || product.prices.length === 0) return;
    const bestDeal = product.prices[0];
    const url = bestDeal.productUrl || getStoreSearchUrl(bestDeal.platformName, product.name);
    window.location.href = url;
  };

  const handleStartCheckout = (platform, price) => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    setShippingInfo({
      name: user ? user.name : '',
      phone: '',
      address: ''
    });
    setCheckoutPlatform(platform);
    setCheckoutPrice(price);
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.name.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim()) {
      return alert('Please fill in all shipping details.');
    }
    setCheckoutStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep(3);
    runSimulatedCheckout();
  };

  const runSimulatedCheckout = () => {
    const messages = [
      `Establishing secure SSL connection to ${checkoutPlatform} API...`,
      `Locking price of ₹${checkoutPrice.toLocaleString()} on ${checkoutPlatform} servers...`,
      `Processing secure payment gateway details...`,
      `Applying PriceCompare Hub exclusive store coupon...`,
      `Confirming package shipping options...`,
      `Finalizing order verification...`
    ];

    let currentMsgIdx = 0;
    setProcessingMessage(messages[0]);

    const interval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < messages.length) {
        setProcessingMessage(messages[currentMsgIdx]);
      } else {
        clearInterval(interval);
        setCheckoutStep(4);
      }
    }, 1200);
  };

  const getSavingsStats = () => {
    if (!product || !product.prices || product.prices.length === 0) return null;
    const finalPrices = product.prices.map(p => p.finalPrice);
    const maxPrice = Math.max(...finalPrices);
    const minPrice = product.lowestPrice;
    const savings = maxPrice - minPrice;
    const pct = maxPrice > 0 ? Math.round((savings / maxPrice) * 100) : 0;
    const originalPrice = product.prices[0].price;
    const totalOffPct = originalPrice > 0 ? Math.round(((originalPrice - minPrice) / originalPrice) * 100) : 0;
    
    return { maxPrice, savings, pct, originalPrice, totalOffPct };
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in bg-white rounded-3xl p-10 shadow-sm border border-gray-100 max-w-7xl mx-auto my-6">
      <Loader2 className="w-14 h-14 text-[#2874f0] animate-spin mb-4" />
      <p className="text-gray-500 font-bold tracking-wide animate-pulse">Scanning live store rates & pricing grids...</p>
    </div>
  );

  const savingsStats = getSavingsStats();
  const historyData = product ? [
    { name: 'Jan', price: Math.round(product.lowestPrice * 1.08) },
    { name: 'Feb', price: Math.round(product.lowestPrice * 1.05) },
    { name: 'Mar', price: Math.round(product.lowestPrice * 1.06) },
    { name: 'Apr', price: Math.round(product.lowestPrice * 1.02) },
    { name: 'May', price: Math.round(product.lowestPrice * 1.01) },
    { name: 'Live', price: product.lowestPrice }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in relative z-10 px-2 my-2 space-y-6">
      
      {/* Toast Alert System */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white py-3 px-6 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 transition-all animate-bounce">
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-450" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {product ? (
        <div className="flex flex-col lg:flex-row gap-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
          
          {/* LEFT COLUMN: Gallery & Main Actions (Flipkart Style) */}
          <div className="lg:w-[40%] flex flex-col gap-6">
            <div className="border border-gray-100 rounded-2xl p-6 flex items-center justify-center bg-white min-h-[350px] md:min-h-[420px] relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-[360px] object-contain transition-transform duration-300 hover:scale-105" 
              />
              <button 
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 p-2.5 bg-white border border-gray-100 shadow-md rounded-full hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-red-500"
              >
                <Heart className={`w-5.5 h-5.5 ${wishlistAdded ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Flipkart CTA Buttons (Add to Cart / Buy Now) */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleWishlistToggle}
                className="flex items-center justify-center gap-2.5 py-4 px-6 bg-[#ff9f00] text-white font-extrabold uppercase rounded-lg shadow-md hover:bg-[#f29400] transition-colors text-base"
              >
                <ShoppingCart className="w-5 h-5" /> Wishlist Card
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2.5 py-4 px-6 bg-[#fb641b] text-white font-extrabold uppercase rounded-lg shadow-md hover:bg-[#e25310] transition-colors text-base animate-pulse-slow"
              >
                <Zap className="w-5 h-5" /> Buy Now
              </button>
            </div>

            {/* Price Trend Chart Box */}
            <div className="border border-gray-150 rounded-2xl p-5 bg-slate-50/50">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#2874f0]" /> 6-Month Price Insights
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFlipkart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2874f0" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2874f0" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                    <RechartsTooltip 
                      contentStyle={{borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#fff', fontSize: '12px'}}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#2874f0" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFlipkart)" dot={{r: 3, fill: '#2874f0'}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN: Details & Sellers Lists (Flipkart Style) */}
          <div className="lg:w-[60%] flex flex-col gap-5">
            <div>
              <nav className="text-[10px] uppercase tracking-wider text-brand-purple font-black mb-2 hover:underline">
                <Link to="/">Home</Link> &gt; <span className="text-brand-pink">{product.category}</span>
              </nav>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Ratings & Assured Badges */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 bg-[#388e3c] text-white px-2 py-0.5 rounded text-xs font-bold">
                4.5 <Star className="w-3 h-3 fill-current" />
              </span>
              <span className="text-gray-400 font-bold">
                12,050 Ratings & 8,000 Reviews
              </span>
              {/* Flipkart Assured style badge */}
              <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-blue-50 rounded text-[10px] font-black text-blue-700 border border-blue-100 uppercase tracking-wider">
                Assured Quality
              </span>
            </div>

            {/* Flipkart Price Display */}
            <div className="space-y-1 py-2.5 px-4.5 bg-gradient-to-br from-violet-50 to-pink-50 border border-pink-100 rounded-2xl w-fit shadow-3d-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">₹{product.lowestPrice?.toLocaleString()}</span>
                {savingsStats && savingsStats.originalPrice > product.lowestPrice && (
                  <>
                    <span className="text-sm font-bold text-gray-400 line-through">₹{savingsStats.originalPrice.toLocaleString()}</span>
                    <span className="text-sm font-black text-[#388e3c]">{savingsStats.totalOffPct}% off</span>
                  </>
                )}
              </div>
              <p className="text-[11px] font-black text-brand-purple">Includes comparison coupons & platform cashbacks</p>
            </div>

            {/* Available Offers (Flipkart Style) */}
            <div className="space-y-2 border-t border-b border-gray-100 py-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Available Offers</h3>
              <div className="space-y-2 text-xs text-gray-700 font-medium">
                <div className="flex items-start gap-2">
                  <span className="text-[#388e3c] mt-0.5 font-bold">🏷️ Bank Offer</span>
                  <p>5% Cashback on zizo Axis Bank Card. <span className="text-blue-600 font-bold hover:underline cursor-pointer">T&C</span></p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#388e3c] mt-0.5 font-bold">🏷️ Partner Offer</span>
                  <p>Submit store deals link and secure up to ₹1,000 PCH wallet vouchers. <span className="text-blue-600 font-bold hover:underline cursor-pointer">Apply Link</span></p>
                </div>
                {savingsStats && savingsStats.savings > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5 font-bold">🔥 Massive Savings</span>
                    <p>You save up to <span className="font-extrabold text-[#388e3c]">₹{savingsStats.savings.toLocaleString()}</span> by choosing our best partner platform offer!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-gray-150">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-600" /> Check Estimated Delivery Timeline
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-Digit Pincode (e.g. 110001)"
                  className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="px-4 py-2 bg-[#2874f0] text-white font-bold text-xs rounded-lg hover:bg-blue-600 active:scale-95 transition-all flex-shrink-0"
                >
                  {checkingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>
              {deliveryInfo && (
                <div className={`text-xs font-bold mt-1 ${deliveryInfo.valid ? 'text-[#388e3c]' : 'text-rose-500'}`}>
                  {deliveryInfo.valid ? (
                    <span>🚚 Delivery by {deliveryInfo.days} | {deliveryInfo.charge === 0 ? 'Free Shipping' : `Delivery Fee ₹${deliveryInfo.charge}`}</span>
                  ) : (
                    <span>⚠️ {deliveryInfo.message}</span>
                  )}
                </div>
              )}
            </div>

            {/* Price Comparison / Store Deals Section (Flipkart Sellers UI) */}
            <div className="border border-gray-150 rounded-xl overflow-hidden bg-white mt-2">
              <div className="bg-gradient-to-r from-violet-50/50 to-pink-50/50 px-4 py-3.5 border-b border-gray-150 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-gray-900">Platform Deals & Seller Comparisons</h3>
                  {isScraping && (
                    <span className="flex items-center gap-1.5 text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full font-black border border-emerald-450 animate-pulse shadow-[0_2px_8px_rgba(16,185,129,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Live Scanning...
                    </span>
                  )}
                </div>
                <button
                  onClick={handleOpenAddDeal}
                  className="inline-flex items-center gap-1 py-1.5 px-3.5 rounded-xl text-xs font-black bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Submit Deal Link
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-gray-100 uppercase text-gray-400 font-extrabold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Store</th>
                      <th className="p-3">Delivery Estimates</th>
                      <th className="p-3">Ratings</th>
                      <th className="p-3">Offer Price</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(showAllPrices ? product.prices : product.prices.slice(0, 3)).map((p, idx) => {
                      const isTargetOfScrape = idx === scrapedIndex;
                      const animationClass = isTargetOfScrape 
                        ? (scrapeDirection === 'up' ? 'bg-red-50 transition-all duration-300 font-bold border-l-4 border-red-500' : 'bg-emerald-50 transition-all duration-300 font-bold border-l-4 border-emerald-500') 
                        : '';
                      
                      return (
                        <tr key={p._id || idx} className={`hover:bg-slate-50/50 transition-colors ${idx === 0 && !isTargetOfScrape ? 'bg-emerald-50/15' : ''} ${animationClass}`}>
                          <td className="p-3 align-middle font-bold text-gray-900 text-sm">
                            <span className="flex items-center gap-1.5">
                              {p.platformName}
                              {idx === 0 && (
                                <span className="bg-[#388e3c] text-white text-[8px] uppercase tracking-wider px-1 py-0.5 rounded font-black">
                                  Lowest
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="p-3 align-middle text-gray-600 font-semibold">
                            <span>{p.deliveryCharge === 0 ? 'Free Express Delivery' : `Delivery: ₹${p.deliveryCharge}`}</span>
                          </td>
                          <td className="p-3 align-middle">
                            <span className="inline-flex items-center bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                              {p.rating} ★
                            </span>
                          </td>
                          <td className="p-3 align-middle">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-sm text-gray-900">₹{p.finalPrice?.toLocaleString()}</span>
                              {p.discount > 0 && (
                                <span className="text-[9px] text-[#388e3c] font-bold">Save ₹{p.discount}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 align-middle text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => window.location.href = p.productUrl || getStoreSearchUrl(p.platformName, product.name)}
                                className={`px-3 py-1.5 rounded font-extrabold text-xs transition-all ${
                                  idx === 0 
                                    ? 'bg-[#fb641b] text-white hover:bg-orange-600' 
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Go to Store
                              </button>
                              <a 
                                href={p.productUrl || getStoreSearchUrl(p.platformName, product.name)} 
                                className="p-1.5 text-gray-400 hover:text-[#2874f0] hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200"
                                title={`Buy on ${p.platformName} website`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {product.prices.length > 3 && (
                <div className="bg-slate-50 p-2.5 text-center border-t border-gray-100">
                  <button 
                    onClick={() => setShowAllPrices(!showAllPrices)}
                    className="text-[#2874f0] font-extrabold hover:underline text-xs flex items-center justify-center gap-1 mx-auto"
                  >
                    {showAllPrices ? 'Collapse Store Offers' : `View ${product.prices.length - 3} More Offers`}
                  </button>
                </div>
              )}
            </div>

            {/* Description Spec Box */}
            <div className="border border-gray-150 rounded-xl p-5 bg-white space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">Product Specifications</h3>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold py-1">
                <span className="text-gray-400">Brand</span>
                <span className="col-span-2 text-gray-800">{product.brand}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold py-1">
                <span className="text-gray-400">Category</span>
                <span className="col-span-2 text-gray-800">{product.category}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold py-1 border-b border-gray-100 pb-2">
                <span className="text-gray-400">Subcategory</span>
                <span className="col-span-2 text-gray-800">{product.subCategory || 'N/A'}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Overview Description</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{product.description}</p>
              </div>
            </div>

            {/* Set Price Drop Alert Actions */}
            <div className="bg-blue-50 border border-blue-150 rounded-xl p-4.5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-[#2874f0] mb-0.5">Want it for cheaper?</h4>
                <p className="text-xs text-slate-500 font-semibold">Set an alert and we will email you when the price hits your target.</p>
              </div>
              <button 
                onClick={() => {
                  if(!user) {
                    setIsLoginPromptOpen(true);
                    return;
                  }
                  setIsPriceAlertOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2874f0] hover:bg-blue-600 text-white rounded-lg font-black text-xs transition-all shadow-md flex-shrink-0"
              >
                <Bell className="w-3.5 h-3.5" /> Price Alert
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-gray-500 border border-gray-150">
          Product details could not be found.
        </div>
      )}

      {/* LOGIN REQUIRED DIALOG MODAL */}
      {isLoginPromptOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl border border-gray-100 animate-fade-in">
            <Lock className="w-14 h-14 mx-auto text-[#fb641b] bg-orange-50 p-3 rounded-full" />
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">Sign In Required</h3>
              <p className="text-sm text-gray-500">You need to sign in to access personalized comparison alerts, save wishlists, or submit deal links.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLoginPromptOpen(false)}
                className="w-1/2 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <Link
                to="/login"
                onClick={() => setIsLoginPromptOpen(false)}
                className="w-1/2 py-2.5 bg-[#2874f0] text-white rounded-xl text-xs font-bold hover:bg-blue-600 active:scale-95 transition-all block text-center"
              >
                Login Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SET PRICE DROP ALERT MODAL */}
      {isPriceAlertOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-2 text-base"><Bell className="w-5 h-5 text-yellow-400" /> Create Price Drop Alert</span>
              <button onClick={() => setIsPriceAlertOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddAlertSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Target Notification Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    className="input-field text-sm"
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Current lowest price is ₹{product?.lowestPrice?.toLocaleString()}. Set alert below it.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Notification Dispatch Email</label>
                  <input 
                    type="email" 
                    readOnly
                    className="input-field text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    value={user?.email || ''}
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-4 text-xs font-bold uppercase tracking-wider">
                  Activate Price Watcher
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ADD DEAL LINK MODAL */}
      {isAddDealOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-fade-in">
            {/* Header */}
            <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-[#ff9f00]" />
                <span className="font-bold text-lg">Contribute Shopping Link & Deal</span>
              </div>
              {!addDealLoading && (
                <button 
                  onClick={() => setIsAddDealOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {addDealError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{addDealError}</span>
                </div>
              )}
              {addDealSuccess && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{addDealSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddDealSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Platform Store *</label>
                    <select
                      value={newDeal.platformName}
                      onChange={(e) => setNewDeal({...newDeal, platformName: e.target.value})}
                      className="input-field text-sm cursor-pointer"
                      required
                    >
                      {['Amazon', 'Flipkart', 'Croma', 'Myntra', 'Ajio', 'Reliance Digital', 'Tata Cliq', 'Nykaa', 'Meesho'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Rating (1.0 - 5.0)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="e.g. 4.5"
                      className="input-field text-sm"
                      value={newDeal.rating}
                      onChange={(e) => setNewDeal({...newDeal, rating: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Original Price *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="Price"
                      className="input-field text-sm"
                      value={newDeal.price}
                      onChange={(e) => setNewDeal({...newDeal, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Discount (₹)</label>
                    <input 
                      type="number" 
                      placeholder="Discount"
                      className="input-field text-sm"
                      value={newDeal.discount}
                      onChange={(e) => setNewDeal({...newDeal, discount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Delivery Fee (₹)</label>
                    <input 
                      type="number" 
                      placeholder="Delivery"
                      className="input-field text-sm"
                      value={newDeal.deliveryCharge}
                      onChange={(e) => setNewDeal({...newDeal, deliveryCharge: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Product Link / URL *</label>
                  <input 
                    type="url" 
                    required
                    placeholder="https://store.com/product-url"
                    className="input-field text-sm"
                    value={newDeal.productUrl}
                    onChange={(e) => setNewDeal({...newDeal, productUrl: e.target.value})}
                  />
                </div>

                <div className="bg-emerald-50 p-4.5 rounded-2xl border border-emerald-150 flex items-center justify-between text-sm mt-6">
                  <span className="text-gray-500 font-bold">Computed Consumer Price:</span>
                  <span className="font-black text-[#388e3c] text-lg">
                    ₹{((Number(newDeal.price) || 0) - (Number(newDeal.discount) || 0) + (Number(newDeal.deliveryCharge) || 0)).toLocaleString()}
                  </span>
                </div>

                <button 
                  type="submit" 
                  disabled={addDealLoading}
                  className="w-full py-3.5 bg-[#fb641b] text-white hover:bg-orange-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  {addDealLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Publishing Shopping Link...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add Store Shopping Link</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SECURE CHECKOUT WIZARD MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-fade-in">
            {/* Header */}
            <div className="bg-[#2874f0] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-yellow-350" />
                <span className="font-bold text-lg">Secure In-App Checkout</span>
              </div>
              {checkoutStep !== 3 && (
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Steps Indicator */}
            {checkoutStep < 4 && (
              <div className="bg-gray-50 border-b border-gray-150 px-6 py-3 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className={checkoutStep === 1 ? 'text-[#2874f0]' : ''}>1. Shipping</span>
                <span>➔</span>
                <span className={checkoutStep === 2 ? 'text-[#2874f0]' : ''}>2. Payment</span>
                <span>➔</span>
                <span className={checkoutStep === 3 ? 'text-[#2874f0]' : ''}>3. Processing</span>
              </div>
            )}

            {/* Body */}
            <div className="p-6">
              {/* Step 1: Shipping */}
              {checkoutStep === 1 && (
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
                    <MapPin className="w-5 h-5 text-[#2874f0]" />
                    <h3 className="font-extrabold text-gray-800 text-base">Shipping Details</h3>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Recipient Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      className="input-field text-sm"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Contact Phone</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +91 98765 43210"
                      className="input-field text-sm"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Delivery Address</label>
                    <textarea 
                      required
                      rows="3"
                      placeholder="123 Main St, New Delhi, 110001"
                      className="input-field text-sm resize-none"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-3 mt-4 text-sm font-bold bg-[#fb641b] hover:bg-orange-600 text-white rounded-xl uppercase tracking-wider">
                    Proceed to Payment Options
                  </button>
                </form>
              )}

              {/* Step 2: Payment */}
              {checkoutStep === 2 && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
                    <CreditCard className="w-5 h-5 text-[#2874f0]" />
                    <h3 className="font-extrabold text-gray-800 text-base">Choose Method</h3>
                  </div>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#2874f0] bg-blue-50/15' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">UPI (GPay / PhonePe / Paytm)</p>
                        <p className="text-xs text-gray-500">Instant, 100% secure direct bank transfer</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#2874f0] bg-blue-50/15' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Credit or Debit Card</p>
                        <p className="text-xs text-gray-500">Supports Visa, Mastercard, RuPay, and Amex</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#2874f0] bg-blue-50/15' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Cash on Delivery (COD)</p>
                        <p className="text-xs text-gray-500">Pay cash/card when the package arrives at doorstep</p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-gray-50 p-4.5 rounded-2xl border border-gray-150 flex items-center justify-between text-sm mt-6">
                    <span className="text-gray-500 font-bold">Amount to Pay:</span>
                    <span className="font-black text-gray-900 text-lg">₹{checkoutPrice.toLocaleString()}</span>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-[#fb641b] hover:bg-orange-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider">
                    Confirm & Place Secure Order
                  </button>
                </form>
              )}

              {/* Step 3: Processing */}
              {checkoutStep === 3 && (
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-[#2874f0] animate-spin" />
                  <h3 className="font-black text-gray-900 text-lg">PriceCompare Secure Bridge</h3>
                  <p className="text-sm text-gray-500 max-w-xs animate-pulse font-bold">{processingMessage}</p>
                </div>
              )}

              {/* Step 4: Success */}
              {checkoutStep === 4 && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl">Order Booked In-App!</h3>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">Transaction ID: PCH-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>
                  
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl w-full text-sm text-left space-y-2.5">
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Product:</span>
                      <span className="text-gray-900 text-right max-w-[200px] line-clamp-1">{product.name}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Fulfillment Store:</span>
                      <span className="text-gray-900 font-extrabold">{checkoutPlatform}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Rate Secured:</span>
                      <span className="text-emerald-700 font-black">₹{checkoutPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-700 border-t border-emerald-200/50 pt-2.5 text-xs">
                      <span>Recipient Address:</span>
                      <span className="text-gray-500 font-medium text-right max-w-[220px] line-clamp-1">{shippingInfo.address}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    We have securely placed this order on {checkoutPlatform} at the guaranteed rate of ₹{checkoutPrice.toLocaleString()}. A secure confirmation receipt and tracking code has been dispatched to {user ? user.email : 'your email'}.
                  </p>

                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-97"
                  >
                    Return to Product Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
