import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, ShoppingCart, AlertCircle } from "lucide-react";

const DairyProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all dairy products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/dairy/list"
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dairy products");
        setLoading(false);
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle order booking
  const handleOrderBooking = (product) => {
    navigate(`/booking`, { state: { product } });
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dairy Products</h1>
        <p className="text-gray-600">
          Browse and order from our selection of fresh dairy products.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
          <p className="ml-2 text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* Products Stats Card */}
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Available Products
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {products.length}
                </p>
              </div>
              <div className="flex items-start">
                <Package className="h-8 w-8 text-[#4CAF50]" />
              </div>
            </div>
          </div>

          {/* Products Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b px-4 py-3">
              <h2 className="font-semibold text-gray-800">
                All Dairy Products
              </h2>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slots
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {product.id}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                            {product.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {product.quantity}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            ₹ {product.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {product.slots}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleOrderBooking(product)}
                              className="flex items-center bg-[#4CAF50] hover:bg-[#2E7D32] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1.5" />
                              Order Now
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-10 w-10 text-gray-400 mb-2" />
                            <p>No dairy products available</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Check back later or contact the admin
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DairyProductList;
