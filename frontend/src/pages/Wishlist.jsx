import { useEffect, useState } from "react";
import { WishlistAPI, CartAPI } from "../services/api";
import { getSession } from "../utils/cookieUtils";
import { motion } from "framer-motion";
import { Heart, Trash2, ShoppingCart } from "lucide-react";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const userId = getSession("userId");

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const data = await WishlistAPI.getWishlist(userId);
      setWishlistItems(data);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await WishlistAPI.removeFromWishlist(userId, productId);
      fetchWishlistItems();
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await CartAPI.addToCart(userId, productId, 1);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Heart className="h-6 w-6 text-[#4CAF50]" />
          <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
        </div>
        <p className="text-gray-600">Products you've saved for later</p>
      </div>

      {/* Content */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="bg-[#4CAF50]/10 p-4 rounded-full mb-4">
              <Heart size={48} className="text-[#4CAF50]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 max-w-md">
              Browse our products and add items to your wishlist to save them
              for later.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src={`http://localhost:8080${item.product.pictureUrl1}`}
                    alt={item.product.productTitle}
                  />
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:bg-red-50 text-red-500 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-1 text-lg truncate">
                    {item.product.productTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                    {item.product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-800">
                        $
                        {(
                          (item.product.price * (100 - item.product.discount)) /
                          100
                        ).toFixed(2)}
                      </span>
                      {item.product.discount > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400 line-through">
                            ${item.product.price.toFixed(2)}
                          </span>
                          <span className="text-xs font-medium px-1.5 py-0.5 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full">
                            {item.product.discount}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item.product.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-[#4CAF50] hover:bg-[#3e8e41] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <ShoppingCart size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
