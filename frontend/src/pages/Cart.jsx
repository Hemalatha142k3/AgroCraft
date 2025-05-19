import { useEffect, useState } from "react";
import { CartAPI } from "../services/api";
import { getSession } from "../utils/cookieUtils";
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  AlertCircle,
  Loader,
  Save,
  XCircle,
} from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getSession("userId");

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your cart.");
      window.location.href = "/login";
      return;
    }
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await CartAPI.getCart(userId);
      setCartItems(data);
      const initialQuantities = {};
      data.forEach((item) => {
        initialQuantities[item.product.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      setError("Failed to fetch cart items. Please try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await CartAPI.removeFromCart(userId, productId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product.id !== productId)
      );
    } catch (error) {
      alert("Error removing item");
      console.log(error);
    }
  };

  const handleClearCart = async () => {
    try {
      await CartAPI.clearCart(userId);
      setCartItems([]);
      alert("Cart cleared successfully!");
    } catch (error) {
      alert("Error clearing cart. Try again.");
      console.error(error);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleSaveQuantity = async (productId) => {
    try {
      const newQuantity = quantities[productId];
      await CartAPI.updateCart(userId, productId, newQuantity);
      alert("Quantity updated successfully!");
    } catch (error) {
      alert("Failed to update quantity. Try again.");
      console.error(error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice =
        (item.product.price * (100 - item.product.discount)) / 100;
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay SDK. Check your network.");
      return;
    }

    try {
      const amount = calculateTotal(); // Get total amount
      const userId = getSession("userId"); // Retrieve customer ID from session

      const response = await fetch("http://localhost:8080/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: cartItems[0]?.product.id,
          amount,
          customerId: userId, // Send customer ID from session
        }),
      });

      const data = await response.json();

      if (!data) {
        alert("Payment creation failed. Try again.");
        return;
      }

      const options = {
        key: "rzp_test_rp407NtQ2MXyDZ",
        amount: data.amount,
        currency: "INR",
        name: "Agro Bazaar",
        description: "Purchase Description",
        order_id: data.orderId,
        handler: function (response) {
          alert(
            "Payment Successful! Payment ID: " + response.razorpay_payment_id
          );
          // Redirect to order confirmation page or update UI
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4CAF50",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in payment: ", error);
      alert("Payment Failed. Try Again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center text-gray-600">
          <Loader className="w-8 h-8 animate-spin mb-2" />
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center text-red-500">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <ShoppingCart className="mr-2 h-6 w-6 text-[#4CAF50]" />
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        </div>
        <p className="text-gray-600">Manage your shopping cart items</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <button
              onClick={() =>
                (window.location.href = "/farmerdashboard/viewallproducts")
              }
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cart Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={`http://localhost:8080${item.product.pictureUrl1}`}
                        alt={item.product.productTitle}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.product.productTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      ₹
                      {(
                        (item.product.price * (100 - item.product.discount)) /
                        100
                      ).toFixed(2)}
                      {item.product.discount > 0 && (
                        <span className="ml-2 text-xs line-through text-gray-400">
                          ₹{item.product.price.toFixed(2)}
                        </span>
                      )}
                      {item.product.discount > 0 && (
                        <span className="ml-2 text-xs font-medium text-green-600">
                          {item.product.discount}% off
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={quantities[item.product.id]}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product.id,
                              e.target.value
                            )
                          }
                          min="1"
                          className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                        />
                        <button
                          onClick={() => handleSaveQuantity(item.product.id)}
                          className="ml-2 p-1.5 bg-[#4CAF50]/10 hover:bg-[#4CAF50]/20 text-[#4CAF50] rounded-md transition-colors"
                          title="Save quantity"
                        >
                          <Save size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Subtotal ({cartItems.length} items)
                </div>
                <div className="text-xl font-bold text-gray-800">
                  ₹{calculateTotal().toFixed(2)}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 flex items-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <XCircle size={18} className="mr-2" />
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-4 py-2 flex items-center bg-[#4CAF50] hover:bg-[#2E7D32] text-white rounded-lg transition-colors"
                >
                  <CreditCard size={18} className="mr-2" />
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
