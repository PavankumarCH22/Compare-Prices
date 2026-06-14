import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, Search, ChevronDown, RotateCcw, Star, DollarSign, Tag, CheckSquare, Square } from 'lucide-react';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  // Filter States
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Popular Brands List
  const popularBrands = [
    'Apple', 'Samsung', 'Sony', 'Bose', 'OnePlus', 'Google',
    'Nike', 'Adidas', 'Dyson', 'Philips', 'CeraVe', 'IKEA'
  ];

  useEffect(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(1, true);
  }, [keyword, category, sort, rating, selectedBrands]);

  const fetchProducts = async (pageNum, isNewSearch = false) => {
    if (isNewSearch) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `/api/products?page=${pageNum}&limit=12`;
      if (keyword) url += `&search=${encodeURIComponent(keyword)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (sort) url += `&sort=${sort}`;
      if (rating) url += `&rating=${rating}`;
      if (selectedBrands.length > 0) url += `&brand=${encodeURIComponent(selectedBrands.join(','))}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      
      const { data } = await axios.get(url);
      
      if (isNewSearch) {
        setProducts(data.products || []);
      } else {
        setProducts(prev => [...prev, ...(data.products || [])]);
      }
      
      setTotalPages(data.pages || 1);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    setProducts([]);
    setPage(1);
    fetchProducts(1, true);
  };

  const toggleBrand = (brandName) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(prev => prev.filter(b => b !== brandName));
    } else {
      setSelectedBrands(prev => [...prev, brandName]);
    }
  };

  const resetAllFilters = () => {
    setCategory('');
    setSort('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSelectedBrands([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Filters Sidebar */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-black text-lg text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary-600" /> Filters
            </h2>
            <button 
              onClick={resetAllFilters}
              className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors flex items-center gap-1"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          
          {/* Sorting */}
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3">Sort Results</h3>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-gray-700 font-medium"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Relevance</option>
              <option value="low-price">Price: Low to High</option>
              <option value="high-price">Price: High to Low</option>
            </select>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1">
              <Tag className="w-4 h-4 text-gray-400" /> Category
            </h3>
            <div className="space-y-2">
              {['', 'Electronics', 'Fashion', 'Home Appliances', 'Beauty', 'Home Decor'].map((cat) => (
                <label key={cat || 'all'} className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="text-primary-600 focus:ring-primary-500 w-4 h-4 border-gray-300"
                  />
                  <span className="text-gray-600 text-sm font-semibold group-hover:text-primary-600 transition-colors">
                    {cat || 'All Categories'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-gray-400" /> Price Budget (₹)
            </h3>
            <form onSubmit={handlePriceApply} className="space-y-2">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-semibold"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-semibold"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-xs rounded-lg transition-colors"
              >
                Apply Range
              </button>
            </form>
          </div>

          {/* Brands Checklist */}
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3">Popular Brands</h3>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2.5 scrollbar-thin">
              {popularBrands.map((bName) => {
                const isChecked = selectedBrands.includes(bName);
                return (
                  <button
                    key={bName}
                    onClick={() => toggleBrand(bName)}
                    className="flex items-center gap-2 w-full text-left cursor-pointer group"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-primary-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-300 group-hover:text-primary-400" />
                    )}
                    <span className={`text-sm font-semibold transition-colors ${isChecked ? 'text-primary-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {bName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2].map((num) => (
                <button
                  key={num}
                  onClick={() => setRating(rating == num ? '' : num)}
                  className={`flex items-center gap-2 text-sm font-semibold w-full px-2 py-1.5 rounded-lg border transition-all ${
                    rating == num 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < num ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
              <Search className="w-5.5 h-5.5 text-primary-600 animate-pulse" />
              {keyword ? `Results for "${keyword}"` : 'Explore Catalogue'}
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">
              Found {totalProducts} matched products
            </p>
          </div>
          
          {/* Active Filter Chips */}
          <div className="flex flex-wrap gap-1.5 max-w-md">
            {category && (
              <span className="bg-purple-50 text-brand-purple text-[10px] font-black px-2.5 py-1 rounded-md border border-purple-100 uppercase">
                {category}
              </span>
            )}
            {rating && (
              <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-md border border-amber-100 uppercase">
                ★ {rating}+ Rating
              </span>
            )}
            {selectedBrands.map(b => (
              <span key={b} className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md border border-blue-100 uppercase">
                {b}
              </span>
            ))}
            {(minPrice || maxPrice) && (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md border border-emerald-100 uppercase">
                ₹{minPrice || 0} - ₹{maxPrice || '∞'}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="card p-4 h-80 animate-pulse flex flex-col">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900">No matching products</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">We couldn't find any products matching your current filters. Try resetting the filters or tweaking your keywords.</p>
            <button 
              onClick={resetAllFilters} 
              className="btn-primary py-2.5 px-6 rounded-xl text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {page < totalPages && (
              <div className="flex justify-center pt-8">
                <button 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="btn-secondary flex items-center gap-2"
                >
                  {loadingMore ? 'Loading More...' : 'Load More Products'}
                  {!loadingMore && <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
