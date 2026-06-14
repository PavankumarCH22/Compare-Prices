import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, ShoppingCart, TrendingUp, ShieldCheck, Percent, Zap, Bot, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products?limit=8&sort=low-price';
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }
        const { data } = await axios.get(url);
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    }
  };

  const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Croma', 'Reliance Digital', 'Tata Cliq', 'Nykaa'];

  const platformStyles = {
    Amazon: 'border border-orange-200 text-orange-700 bg-orange-50/50 hover:bg-orange-100 hover:border-orange-400',
    Flipkart: 'border border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-400',
    Myntra: 'border border-pink-200 text-pink-700 bg-pink-50/50 hover:bg-pink-100 hover:border-pink-400',
    Ajio: 'border border-slate-300 text-slate-700 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-400',
    Croma: 'border border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-100 hover:border-teal-400',
    'Reliance Digital': 'border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 hover:border-red-400',
    'Tata Cliq': 'border border-rose-300 text-rose-800 bg-rose-50/30 hover:bg-rose-100 hover:border-rose-400',
    Nykaa: 'border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-400'
  };

  const categories = [
    { name: 'All', value: '', emoji: '🏬' },
    { name: 'Electronics', value: 'Electronics', emoji: '💻' },
    { name: 'Fashion', value: 'Fashion', emoji: '👕' },
    { name: 'Home Appliances', value: 'Home Appliances', emoji: '🍳' },
    { name: 'Beauty', value: 'Beauty', emoji: '🧴' },
    { name: 'Sports', value: 'Sports', emoji: '⚽' },
    { name: 'Home Decor', value: 'Home Decor', emoji: '💡' }
  ];

  return (
    <div className="animate-fade-in space-y-12 relative max-w-7xl mx-auto">
      {/* Flipkart Category Bar Strip */}
      <section className="bg-white border border-gray-200 rounded-sm p-4 flex justify-around items-center overflow-x-auto shadow-sm gap-4 hide-scrollbar select-none relative z-10">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.value)}
            className={`flex flex-col items-center gap-1.5 focus:outline-none shrink-0 group transition-all ${
              selectedCategory === cat.value ? 'scale-105' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
              selectedCategory === cat.value 
                ? 'bg-[#2874f0] text-white shadow-sm' 
                : 'bg-gray-50 text-gray-750 group-hover:bg-gray-100'
            }`}>
              {cat.emoji}
            </div>
            <span className={`text-xs font-bold transition-colors ${
              selectedCategory === cat.value ? 'text-[#2874f0]' : 'text-gray-600 group-hover:text-[#2874f0]'
            }`}>
              {cat.name}
            </span>
          </button>
        ))}
      </section>

      {/* 3D Perspective Background Grid */}
      <div className="absolute top-[80px] inset-x-0 h-[650px] bg-grid-3d z-0"></div>

      {/* Hero Section */}
      <section className="relative z-10 bg-hero-pattern rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-3d-lg overflow-hidden border border-white/20">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 md:w-3/5 mb-10 md:mb-0 text-white">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold mb-6 border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} /> 
            Live Smart Shopping Comparison Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 drop-shadow-sm">
            Compare Prices. <br/>Save Instantly.
          </h1>
          
          <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-xl font-medium leading-relaxed drop-shadow-sm opacity-90">
            Stop switching tabs. We monitor prices across India's top retail platforms in real time to secure the absolute best deal for you.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-xl group">
            <input
              type="text"
              placeholder="What are you looking for today? (e.g. iPhone 15)"
              className="w-full pl-6 pr-16 py-5 bg-white/95 backdrop-blur-xl border border-white/50 rounded-full focus:outline-none focus:ring-4 focus:ring-primary-500/30 text-gray-900 text-lg shadow-2xl transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-3 bg-gradient-to-r from-primary-600 to-brand-purple text-white p-3 rounded-full hover:scale-105 transition-transform shadow-lg">
              <Search className="w-6 h-6" />
            </button>
          </form>
        </div>
        
        <div className="relative z-10 md:w-2/5 flex justify-center">
          <Tilt
            perspective={1200}
            glareEnable={true}
            glareMaxOpacity={0.15}
            scale={1.05}
            transitionSpeed={1000}
            className="relative w-64 h-64 md:w-80 md:h-80 card-3d"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink to-brand-purple rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
            <div className="glass-panel p-6 absolute top-0 right-0 transform rotate-12 animate-float border border-white/40 inner-3d">
              <ShoppingCart className="w-12 h-12 text-primary-500 mb-2" />
              <div className="h-2 w-16 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 w-10 bg-green-400 rounded"></div>
            </div>
            <div className="glass-panel p-6 absolute bottom-10 left-0 transform -rotate-6 animate-float border border-white/40 inner-3d" style={{ animationDelay: '1.5s' }}>
              <TrendingUp className="w-10 h-10 text-brand-purple mb-2" />
              <div className="text-lg font-bold text-gray-900">-30% Price Drop</div>
            </div>
          </Tilt>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="relative z-10 text-center bg-gray-50/50 py-10 px-6 rounded-[2rem] border border-gray-100 shadow-3d-sm">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Instantly compare stores like</p>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {platforms.map(platform => (
            <div 
              key={platform} 
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm transition-all duration-300 shadow-sm cursor-default hover:scale-105 ${
                platformStyles[platform] || 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {platform}
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="glass-card p-6 border border-gray-100 hover:border-primary-100 shadow-3d-sm hover:shadow-3d-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4 shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Real-time Search</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Instantly compares prices across top Indian retailers to find you the absolute lowest price.</p>
        </div>
        <div className="glass-card p-6 border border-gray-100 hover:border-primary-100 shadow-3d-sm hover:shadow-3d-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
            <Percent className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Biggest Discounts</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Calculate exact savings, including platform discounts, coupons, and delivery charges.</p>
        </div>
        <div className="glass-card p-6 border border-gray-100 hover:border-primary-100 shadow-3d-sm hover:shadow-3d-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple mb-4 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Sellers</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Only fetch data from verified, official stores to ensure authentic products and secure checkouts.</p>
        </div>
        <div className="glass-card p-6 border border-gray-100 hover:border-primary-100 shadow-3d-sm hover:shadow-3d-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-brand-pink mb-4 shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">DealBot AI Assistant</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Voice-enabled shopping helper to recommend the best products for your budget instantly.</p>
        </div>
      </section>

      {/* Trending Deals */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
              🔥 Trending Offers
            </h2>
            <p className="text-gray-500 font-medium">Products with the highest discounts and lowest online prices.</p>
          </div>
          <Link to="/search" className="btn-secondary self-start md:self-auto inline-flex items-center gap-2">
            View All Offers
          </Link>
        </div>

        <div className="border-b border-gray-100 pb-2"></div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="card p-5 h-96 flex flex-col">
                <div className="bg-gray-200 h-56 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/4 mb-3"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4 mb-4"></div>
                <div className="bg-gray-200 h-8 rounded w-1/2 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 font-bold text-lg mb-2">No trending deals found in this category.</p>
            <button onClick={() => setSelectedCategory('')} className="text-primary-600 font-bold hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
