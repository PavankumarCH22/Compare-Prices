import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { 
  Upload, Plus, Trash2, LayoutDashboard, Database, 
  Package, Sparkles, CheckCircle2, AlertCircle, FileSpreadsheet, Loader2 
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalProducts: 0,
    categoryStats: [],
    latestProducts: [],
    demoMode: false
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("add-product"); // "add-product" or "csv-upload"

  // CSV upload state
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvMessage, setCsvMessage] = useState(null);
  const [csvError, setCsvError] = useState(null);

  // Single Product state
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    category: "Electronics",
    subCategory: "",
    image: "",
    description: ""
  });

  const [prices, setPrices] = useState([
    {
      platformName: "Amazon",
      price: "",
      discount: "0",
      deliveryCharge: "0",
      productUrl: "",
      rating: "4.5",
      reviewsCount: "100",
      stockStatus: "In Stock"
    }
  ]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (user && user.token) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/products/stats/dashboard", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoading(false);
    }
  };

  // CSV Handlers
  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
    setCsvMessage(null);
    setCsvError(null);
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setCsvError("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    setCsvUploading(true);
    setCsvMessage(null);
    setCsvError(null);

    try {
      const { data } = await axios.post("/api/products/bulk-upload", formData, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setCsvMessage(data);
      setCsvFile(null);
      // Reset input element
      document.getElementById("csv-file-input").value = "";
      fetchStats();
    } catch (err) {
      setCsvError(err.response?.data?.message || err.message || "Failed to upload CSV file.");
    } finally {
      setCsvUploading(false);
    }
  };

  // Single Product Handlers
  const handleProductChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (index, e) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = { ...updatedPrices[index], [e.target.name]: e.target.value };
    setPrices(updatedPrices);
  };

  const addPriceField = () => {
    setPrices([
      ...prices,
      {
        platformName: "Amazon",
        price: "",
        discount: "0",
        deliveryCharge: "0",
        productUrl: "",
        rating: "4.5",
        reviewsCount: "100",
        stockStatus: "In Stock"
      }
    ]);
  };

  const removePriceField = (index) => {
    if (prices.length > 1) {
      const updatedPrices = prices.filter((_, i) => i !== index);
      setPrices(updatedPrices);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    // Basic validation
    if (!productData.name || !productData.brand || !productData.category) {
      setSubmitError("Please fill out all required fields (Name, Brand, Category).");
      setSubmitLoading(false);
      return;
    }

    // Default image if empty
    const finalImage = productData.image.trim() || `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/400/400`;

    // Process prices and compute finalPrice
    const processedPrices = prices.map(p => {
      const originalPrice = Number(p.price) || 0;
      const discount = Number(p.discount) || 0;
      const deliveryCharge = Number(p.deliveryCharge) || 0;
      const finalPrice = originalPrice - discount + deliveryCharge;
      
      // Default URL if empty
      const query = encodeURIComponent(`${productData.brand} ${productData.name}`);
      const productUrl = p.productUrl.trim() || `https://google.com/search?q=${query}+buy+on+${encodeURIComponent(p.platformName)}`;

      return {
        platformName: p.platformName,
        price: originalPrice,
        discount,
        deliveryCharge,
        finalPrice,
        productUrl,
        rating: Number(p.rating) || 4.5,
        reviewsCount: Number(p.reviewsCount) || 50,
        stockStatus: p.stockStatus
      };
    });

    const payload = {
      ...productData,
      image: finalImage,
      prices: processedPrices
    };

    try {
      await axios.post("/api/products", payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSubmitSuccess("Product and all associated deals successfully created!");
      
      // Reset form
      setProductData({
        name: "",
        brand: "",
        category: "Electronics",
        subCategory: "",
        image: "",
        description: ""
      });
      setPrices([
        {
          platformName: "Amazon",
          price: "",
          discount: "0",
          deliveryCharge: "0",
          productUrl: "",
          rating: "4.5",
          reviewsCount: "100",
          stockStatus: "In Stock"
        }
      ]);
      fetchStats();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to create product.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const platforms = [
    "Amazon", "Flipkart", "Croma", "Myntra", "Ajio", 
    "Reliance Digital", "Tata Cliq", "Snapdeal", "Nykaa", "Meesho", "FirstCry"
  ];

  const categories = [
    "Electronics", "Fashion", "Home Appliances", "Beauty", "Sports", "Kids Wear", "Toys", "Electricals", "Formal Wear", "Jewelry", "Home Decor"
  ];

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card text-center space-y-6">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
        <h2 className="text-2xl font-black text-gray-900">Access Denied</h2>
        <p className="text-gray-500">You must be logged in as an administrator to view this page.</p>
        <Link to="/login" className="btn-primary inline-block">Go to Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading Dashboard Statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in relative z-10 max-w-7xl mx-auto px-2">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-950">Admin Console</h1>
            <p className="text-gray-500 text-sm font-medium">Manage comparison index, deals, and bulk inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {stats.demoMode ? (
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" /> Demo Sandbox Mode
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-3.5 h-3.5" /> MongoDB Active
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Products Stats */}
        <div className="glass-card p-6 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Index Size</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.totalProducts?.toLocaleString() || 0}</h3>
            <p className="text-xs text-gray-500 mt-1">Active products in catalog</p>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
        </div>

        {/* Categories Count Stats */}
        <div className="glass-card p-6 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Categories</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.categoryStats?.length || 0}</h3>
            <p className="text-xs text-gray-500 mt-1">Unique index categories</p>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Database className="w-7 h-7" />
          </div>
        </div>

        {/* CSV Status Summary */}
        <div className="glass-card p-6 border border-gray-100 col-span-1 md:col-span-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Stats Breakdown</p>
          <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto hide-scrollbar">
            {stats.categoryStats && stats.categoryStats.length > 0 ? (
              stats.categoryStats.map(cat => (
                <span key={cat._id} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 py-1 px-2.5 rounded-lg font-bold">
                  {cat._id || 'Uncategorized'}: <span className="text-primary-600 font-extrabold">{cat.count}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No categories indexed yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="border-b border-gray-100 flex gap-4">
        <button
          onClick={() => setActiveTab("add-product")}
          className={`pb-4 text-base font-black border-b-2 transition-all ${
            activeTab === "add-product"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Add Product & Deals
        </button>
        <button
          onClick={() => setActiveTab("csv-upload")}
          className={`pb-4 text-base font-black border-b-2 transition-all ${
            activeTab === "csv-upload"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Bulk CSV Import
        </button>
      </div>

      {/* Tab Contents */}
      <div className="relative">
        
        {/* CSV Import Tab */}
        {activeTab === "csv-upload" && (
          <div className="glass-card p-8 border border-gray-100 space-y-6 max-w-2xl">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" /> Bulk CSV Upload
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Upload a structured comma-separated spreadsheet to insert or update multiple products and price comparisons in a single batch operation.
              </p>
            </div>

            {/* Template hint */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700 mb-1">Required CSV Columns:</p>
              <p className="font-mono bg-white/80 p-2 rounded border border-slate-200/50 break-all leading-normal">
                name, brand, category, subCategory, image, description, platformName, originalPrice, discount, deliveryCharge, finalPrice, rating, reviewsCount, stockStatus, productUrl
              </p>
            </div>

            {csvError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{csvError}</span>
              </div>
            )}

            {csvMessage && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>CSV File Processed Successfully!</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs text-emerald-800 border-t border-emerald-100/50">
                  <div>
                    <span className="block font-medium">New Products:</span>
                    <span className="text-lg font-black">{csvMessage.imported}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Updated Records:</span>
                    <span className="text-lg font-black">{csvMessage.updated}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Processed Rows:</span>
                    <span className="text-lg font-black">{csvMessage.totalProcessed}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Status:</span>
                    <span className="text-lg font-black">Completed</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleCsvUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-200 hover:border-primary-400 rounded-2xl p-8 text-center transition-all bg-slate-50/50 hover:bg-slate-50 relative group cursor-pointer">
                <input
                  type="file"
                  id="csv-file-input"
                  accept=".csv"
                  onChange={handleCsvChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-12 h-12 mx-auto text-gray-400 group-hover:text-primary-500 mb-3 transition-colors" />
                {csvFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-800">{csvFile.name}</p>
                    <p className="text-xs text-gray-400">{(csvFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">Click to browse or drag your file here</p>
                    <p className="text-xs text-gray-400">CSV spreadsheet format up to 10MB</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={csvUploading || !csvFile}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-50 disabled:pointer-events-none"
              >
                {csvUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing & Seed Inventory...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload & Import Catalog</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Add Product & Deals Tab */}
        {activeTab === "add-product" && (
          <form onSubmit={handleAddProduct} className="space-y-8">
            
            {/* Success and error notifications */}
            {submitError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{submitError}</span>
              </div>
            )}
            {submitSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{submitSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Product Info Section */}
              <div className="lg:col-span-1 space-y-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                <h3 className="text-lg font-black text-gray-900 pb-3 border-b border-gray-100">Product Specifications</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={productData.name}
                      onChange={handleProductChange}
                      placeholder="e.g. Sony WH-1000XM5 Noise Cancelling"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={productData.brand}
                      onChange={handleProductChange}
                      placeholder="e.g. Sony"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category *</label>
                      <select
                        name="category"
                        value={productData.category}
                        onChange={handleProductChange}
                        className="input-field cursor-pointer"
                        required
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subcategory</label>
                      <input
                        type="text"
                        name="subCategory"
                        value={productData.subCategory}
                        onChange={handleProductChange}
                        placeholder="e.g. Headphones"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={productData.image}
                      onChange={handleProductChange}
                      placeholder="https://example.com/image.jpg (or blank for auto)"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      name="description"
                      value={productData.description}
                      onChange={handleProductChange}
                      placeholder="Key specifications, overview, box details..."
                      rows="4"
                      className="input-field resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Dynamic Deals Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <h3 className="text-lg font-black text-gray-900">Compare Deals & Platform Prices</h3>
                    <button
                      type="button"
                      onClick={addPriceField}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Platform Deal
                    </button>
                  </div>

                  <div className="space-y-6 mt-6">
                    {prices.map((priceItem, index) => {
                      const computedFinal = (Number(priceItem.price) || 0) - (Number(priceItem.discount) || 0) + (Number(priceItem.deliveryCharge) || 0);
                      
                      return (
                        <div key={index} className="p-4 rounded-xl border border-gray-100 bg-slate-50/50 hover:bg-slate-50/80 transition-all relative group">
                          {prices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePriceField(index)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Deal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Platform Name</label>
                              <select
                                name="platformName"
                                value={priceItem.platformName}
                                onChange={(e) => handlePriceChange(index, e)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500"
                              >
                                {platforms.map(p => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Original Price (₹)</label>
                              <input
                                type="number"
                                name="price"
                                value={priceItem.price}
                                onChange={(e) => handlePriceChange(index, e)}
                                placeholder="e.g. 29990"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Discount Amount (₹)</label>
                              <input
                                type="number"
                                name="discount"
                                value={priceItem.discount}
                                onChange={(e) => handlePriceChange(index, e)}
                                placeholder="e.g. 3000"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Charge (₹)</label>
                              <input
                                type="number"
                                name="deliveryCharge"
                                value={priceItem.deliveryCharge}
                                onChange={(e) => handlePriceChange(index, e)}
                                placeholder="e.g. 40"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500"
                              />
                            </div>

                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Direct Product Link / URL</label>
                              <input
                                type="url"
                                name="productUrl"
                                value={priceItem.productUrl}
                                onChange={(e) => handlePriceChange(index, e)}
                                placeholder="https://amazon.in/dp/product-key"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rating (1-5)</label>
                              <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="5"
                                name="rating"
                                value={priceItem.rating}
                                onChange={(e) => handlePriceChange(index, e)}
                                placeholder="4.5"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Computed Final Price</label>
                              <div className="w-full px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-black text-emerald-800">
                                ₹{computedFinal.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Main Submit Action */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Product Index and Comparison Pricing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Index New Product & Compare Deals</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        )}
      </div>

      {/* Recently Added Section */}
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-gray-950">Recently Added / Updated Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-400 uppercase bg-slate-50 rounded-lg">
              <tr>
                <th className="px-6 py-3 font-extrabold">Product</th>
                <th className="px-6 py-3 font-extrabold">Brand</th>
                <th className="px-6 py-3 font-extrabold">Category</th>
                <th className="px-6 py-3 font-extrabold">Deals Count</th>
                <th className="px-6 py-3 font-extrabold">Lowest Price</th>
                <th className="px-6 py-3 font-extrabold">Best Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.latestProducts && stats.latestProducts.length > 0 ? (
                stats.latestProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                      <span className="font-bold text-gray-900 max-w-[200px] truncate block">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{p.brand}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs py-1 px-2.5 bg-slate-100 text-slate-600 rounded-md font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{p.prices?.length || 0}</td>
                    <td className="px-6 py-4 font-black text-primary-600">₹{(p.lowestPrice || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">{p.bestPlatform || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 font-medium">No recent products found in index.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;