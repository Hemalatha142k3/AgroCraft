import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { bookDairyProduct } from "../services/api";
import { getSession } from "../utils/cookieUtils";
import { Milk, MapPin, Phone, Clock, CheckCircle } from "lucide-react";

const BookingDairy = () => {
  const location = useLocation();
  const product = location.state?.product;

  // Fetch userId directly
  const userId = getSession("userId");

  const [formData, setFormData] = useState({
    userId: userId || "",
    mobileNumber: "",
    address: "Fetching location...",
    timings: "Morning",
  });

  // Fetch user's current geolocation and convert to address
  useEffect(() => {
    if (!navigator.geolocation) {
      setFormData((prevData) => ({
        ...prevData,
        address: "Geolocation is not supported by your browser",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geolocation API to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          setFormData((prevData) => ({
            ...prevData,
            address: data.display_name
              ? `${data.display_name} (Lat: ${latitude}, Lon: ${longitude})`
              : `Lat: ${latitude}, Lon: ${longitude}`,
          }));
        } catch (error) {
          console.error("Error fetching address:", error);
          setFormData((prevData) => ({
            ...prevData,
            address: `Lat: ${latitude}, Lon: ${longitude}`,
          }));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setFormData((prevData) => ({
          ...prevData,
          address: "Location access denied. Please enable location.",
        }));
      }
    );
  }, []);

  useEffect(() => {
    if (!userId) {
      alert("User not logged in! Please log in to proceed.");
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) {
      alert("No product selected for booking.");
      return;
    }

    if (!formData.userId) {
      alert("User ID is missing. Please log in.");
      return;
    }

    const bookingData = {
      user: { id: formData.userId },
      dairyProduct: { id: product.id },
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      timings: formData.timings,
    };

    try {
      const response = await bookDairyProduct(bookingData);
      alert("Booking Successful! ID: " + response.data.id);
    } catch (error) {
      console.error("Booking failed", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header section - centered */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Milk className="h-12 w-12 text-[#4CAF50]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Book Your Dairy Product
          </h1>
          <p className="text-gray-600">
            {product
              ? `Booking ${product.name}`
              : "Complete the form below to confirm your booking."}
          </p>
        </div>

        {/* Main content area - centered card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="border-b px-6 py-4 flex items-center">
            <Milk className="h-5 w-5 text-[#4CAF50] mr-2" />
            <h2 className="font-semibold text-gray-800">Booking Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Summary if available */}
            {product && (
              <div className="p-4 bg-[#4CAF50]/5 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Product Summary
                </h3>
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {product.name}
                </p>
                {product.price && (
                  <p className="text-gray-700">
                    <span className="font-medium">Price:</span> ₹{product.price}
                  </p>
                )}
              </div>
            )}

            {/* Mobile Number Field */}
            <div>
              <label className="block font-medium text-gray-700 mb-2 flex items-center">
                <Phone size={18} className="text-[#4CAF50] mr-2" />
                Mobile Number
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50"
                required
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="block font-medium text-gray-700 mb-2 flex items-center">
                <MapPin size={18} className="text-[#4CAF50] mr-2" />
                Address (Location)
              </label>
              <textarea
                name="address"
                value={formData.address}
                readOnly
                className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50"
                rows="3"
              ></textarea>
            </div>

            {/* Timing Selection */}
            <div>
              <label className="block font-medium text-gray-700 mb-2 flex items-center">
                <Clock size={18} className="text-[#4CAF50] mr-2" />
                Preferred Timing
              </label>
              <select
                name="timings"
                value={formData.timings}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Both">Both</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center bg-[#4CAF50] hover:bg-[#2E7D32] text-white px-4 py-3 rounded-lg transition-colors"
            >
              <CheckCircle size={18} className="mr-2" />
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingDairy;
