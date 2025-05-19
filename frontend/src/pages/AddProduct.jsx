import { useState, useEffect } from "react";
import { addProduct, getAllCategories } from "../services/api";
import { getSession } from "../utils/cookieUtils";
import { PackagePlus, Upload, ChevronRight } from "lucide-react";

const AddProduct = () => {
  const loggedInUserId = getSession("userId");

  const [productData, setProductData] = useState({
    productTitle: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    images: [null],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getAllCategories();
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const updatedImages = [e.target.files[0]];
    setProductData({ ...productData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productTitle", productData.productTitle);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("price", productData.price);
    formData.append("discount", productData.discount);
    formData.append("userId", loggedInUserId); // Ensure userId is included

    if (productData.images[0]) {
      formData.append("file1", productData.images[0]);
    }

    try {
      await addProduct(formData);
      alert("Product added successfully!");
      // Reset form after successful submission
      setProductData({
        productTitle: "",
        description: "",
        category: "",
        price: "",
        discount: "",
        images: [null],
      });
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-600">
          Add your farm products to the marketplace.
        </p>
      </div>

      {/* Product Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-4 py-3 flex items-center">
          <PackagePlus size={20} className="text-[#4CAF50] mr-2" />
          <h2 className="font-semibold text-gray-800">Product Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
          {/* Product Title */}
          <div>
            <label
              htmlFor="productTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Title
            </label>
            <input
              type="text"
              id="productTitle"
              name="productTitle"
              value={productData.productTitle}
              onChange={handleInputChange}
              placeholder="Enter product title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50]"
            />
          </div>

          {/* Two Column Layout for Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                placeholder="Enter product category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50]"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50]"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={productData.discount}
              onChange={handleInputChange}
              placeholder="Enter discount percentage"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#4CAF50] hover:text-[#2E7D32] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#4CAF50]"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                {productData.images[0] && (
                  <p className="text-sm text-[#4CAF50]">
                    {productData.images[0].name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] transition-colors"
            >
              <span>Add Product</span>
              <ChevronRight size={16} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
