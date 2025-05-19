"use client";

import { useEffect, useState } from "react";
import { getAllProducts, getAllCategories, WishlistAPI } from "../services/api";
import { Filter, Search, Heart, ArrowUp, ArrowDown } from "lucide-react";
import { getSession } from "../utils/cookieUtils";

const UserViewAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { lower: "", upper: "" },
  });
  const [sortOrder, setSortOrder] = useState("");
  const [wishlist, setWishlist] = useState(new Set());

  const userId = getSession("userId");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]); // Runs only when userId is available

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
      console.log(setSortOrder);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const wishlistData = await WishlistAPI.getWishlist(userId);
      setWishlist(new Set(wishlistData.map((item) => item.productId)));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.has(productId)) {
        await WishlistAPI.removeFromWishlist(userId, productId);
        setWishlist((prev) => {
          const newWishlist = new Set(prev);
          newWishlist.delete(productId);
          return new Set(newWishlist);
        });
      } else {
        await WishlistAPI.addToWishlist(userId, productId);
        setWishlist((prev) => {
          const newWishlist = new Set(prev);
          newWishlist.add(productId);
          return new Set(newWishlist);
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "categories") {
      setFilters((prev) => ({
        ...prev,
        categories: checked
          ? [...prev.categories, value]
          : prev.categories.filter((cat) => cat !== value),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        priceRange: { ...prev.priceRange, [name]: value },
      }));
    }
  };

  const applyFilters = () => {
    const { lower, upper } = filters.priceRange;
    const lowerLimit = Number(lower) || 0;
    const upperLimit = Number(upper) || Number.POSITIVE_INFINITY;

    const filtered = products.filter((product) => {
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);
      const matchesPrice =
        product.price >= lowerLimit && product.price <= upperLimit;
      const matchesSearch = Object.values(product).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesCategory && matchesPrice && matchesSearch;
    });

    if (sortOrder === "priceAsc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "priceDesc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sorted = [...filteredProducts];
    if (order === "priceAsc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (order === "priceDesc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sorted);
  };

  return (
    <div className="container py-4 px-4">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
        <p className="text-gray-600">Browse our product collection</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <button
            onClick={applyFilters}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4CAF50] hover:text-[#2E7D32]"
          >
            <Filter size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => handleSort("priceAsc")}
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              sortOrder === "priceAsc"
                ? "bg-[#4CAF50]/10 text-[#2E7D32]"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ArrowUp size={16} className="mr-1" /> Price
          </button>
          <button
            onClick={() => handleSort("priceDesc")}
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              sortOrder === "priceDesc"
                ? "bg-[#4CAF50]/10 text-[#2E7D32]"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ArrowDown size={16} className="mr-1" /> Price
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-gray-800 flex items-center">
              <Filter size={18} className="mr-2 text-[#4CAF50]" />
              Filters
            </h2>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#4CAF50] bg-gray-100 border-gray-300 rounded focus:ring-[#4CAF50]"
                      checked={filters.categories.includes(category)}
                      onChange={handleFilterChange}
                      name="categories"
                      value={category}
                    />
                    <span className="ml-2 text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min Price"
                  name="lower"
                  value={filters.priceRange.lower}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-[#4CAF50]"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  name="upper"
                  value={filters.priceRange.upper}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="w-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:8080${product.pictureUrl1}`}
                    alt={product.productTitle}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart
                      size={18}
                      fill={wishlist.has(product.id) ? "#e53e3e" : "none"}
                      color={wishlist.has(product.id) ? "#e53e3e" : "#718096"}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">
                    {product.productTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mb-3">
                    <span className="text-lg font-bold text-gray-800">
                      $
                      {(
                        (product.price * (100 - product.discount)) /
                        100
                      ).toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="ml-2 text-xs font-medium text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserViewAllProduct;
