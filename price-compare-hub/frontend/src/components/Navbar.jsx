import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] py-3.5 shadow-md border-b border-[#2566d2] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          
          {/* Logo & Brand (zizo Style) */}
          <Link to="/" className="flex flex-col select-none justify-center shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold italic tracking-wide text-white leading-none">zizo</span>
              <span className="text-xs font-black italic bg-gradient-to-tr from-yellow-300 to-yellow-200 text-[#2874f0] px-1.5 py-0.5 rounded shadow-sm border border-yellow-300">Compare</span>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] italic font-bold text-gray-100 leading-none hover:underline mt-0.5">
              <span>Explore</span>
              <span className="text-[#ffe500] font-black">Plus</span>
              <span className="text-[#ffe500] font-black text-xs -mt-1">+</span>
            </div>
          </Link>

          {/* Desktop Search Bar (Flipkart Style) */}
          <div className="hidden md:block flex-grow max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full pl-4 pr-12 py-2 bg-white border border-transparent rounded focus:outline-none focus:ring-0 text-sm font-semibold text-gray-800 shadow-inner placeholder-gray-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-4 text-[#2874f0] hover:text-blue-700 transition-colors flex items-center justify-center">
                <Search className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

          {/* Desktop Nav (Flipkart Style) */}
          <nav className="hidden md:flex items-center gap-8 shrink-0">
            <Link to="/search" className={`font-bold text-sm tracking-wide transition-colors hover:text-yellow-300 ${location.pathname === '/search' ? 'text-yellow-300' : 'text-white'}`}>
              Compare Catalog
            </Link>
            
            {user ? (
              <div className="flex items-center gap-6">
                {user.role === 'admin' && (
                  <Link to="/dashboard" className={`font-bold text-sm tracking-wide transition-colors hover:text-yellow-300 ${location.pathname === '/dashboard' ? 'text-yellow-300' : 'text-white'}`}>
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-[#2566d2] py-1 px-3 rounded-full border border-blue-400">
                  <div className="w-6 h-6 bg-yellow-350 text-[#2874f0] bg-[#ffe500] rounded-full flex items-center justify-center font-black text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-white text-xs">{user.name}</span>
                </div>
                <button onClick={logout} className="p-1.5 text-blue-200 hover:text-yellow-300 transition-colors" title="Logout">
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="bg-white text-[#2874f0] hover:bg-[#f0f5ff] font-extrabold text-sm px-7 py-1.5 rounded-sm transition-colors shadow-sm">
                  Login
                </Link>
                <Link to="/register" className="font-bold text-sm text-white hover:text-yellow-300 transition-colors">
                  Become a Seller
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-white hover:bg-blue-600 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>

        {/* Mobile Search & Nav */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#2566d2] animate-fade-in space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-4 pr-10 py-2 bg-white border border-transparent rounded focus:outline-none focus:ring-0 text-sm font-semibold text-gray-800"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 text-[#2874f0] flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-col gap-3.5 pb-2">
              <Link to="/search" className="font-bold text-white text-sm hover:text-yellow-300">Compare Catalog</Link>
              {user ? (
                <>
                  {user.role === 'admin' && <Link to="/dashboard" className="font-bold text-white text-sm hover:text-yellow-300">Admin Dashboard</Link>}
                  <button onClick={logout} className="font-bold text-red-300 text-sm hover:text-red-400 text-left">Log Out</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link to="/login" className="bg-white text-center text-[#2874f0] font-bold text-sm py-2 rounded-sm">Login</Link>
                  <Link to="/register" className="border border-white text-center text-white font-bold text-sm py-2 rounded-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
