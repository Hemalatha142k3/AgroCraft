import { useState } from "react";
import axios from "axios";
import { getSession } from "../utils/cookieUtils"; // Import getSession function
import {
  Milk,
  Plus,
  ShoppingBag,
  DollarSign,
  Layers,
  IndianRupee,
} from "lucide-react";

const DairyAdd = () => {
  const [product, setProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    slots: "",
  });

  const userId = getSession("userId"); // Retrieve userId from session directly

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert quantity, price, and slots to numbers
    const updatedProduct = {
      ...product,
      quantity: parseInt(product.quantity, 10),
      price: parseFloat(product.price),
      slots: parseInt(product.slots, 10),
    };

    try {
      const response = await axios.post(
        `http://localhost:8080/api/dairy/save?userId=${userId}`, // ✅ Directly use userId
        updatedProduct,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Dairy product added successfully!");
      setProduct({ name: "", quantity: "", price: "", slots: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="w-full  mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Dairy Product</h1>
        <p className="text-gray-600">
          Add a new dairy product to your inventory
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center">
          <Milk className="h-6 w-6 text-[#4CAF50] mr-3" />
          <h2 className="font-semibold text-gray-800">Product Information</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={product.quantity}
                    onChange={handleChange}
                    min="1"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={product.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Available Slots */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Slots
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="slots"
                    placeholder="Enter available slots"
                    value={product.slots}
                    onChange={handleChange}
                    min="0"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Dairy Product
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Help Card */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-800">
            Tips for Dairy Products
          </h2>
        </div>
        <div className="p-6">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-[#4CAF50] mr-2">•</span>
              <span>
                Enter precise quantities for accurate inventory tracking
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4CAF50] mr-2">•</span>
              <span>Set competitive prices based on market demand</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4CAF50] mr-2">•</span>
              <span>
                Ensure that available slots reflect your actual capacity
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DairyAdd;
