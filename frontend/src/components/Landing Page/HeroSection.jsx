import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <section className="relative bg-green-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Content */}
          <div className="max-w-lg">
            <h1
              className={`text-4xl md:text-5xl font-bold text-green-800 mb-6 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Farm to Table, Simplified
            </h1>
            <p className="text-xl text-green-700 mb-8">
              AgroCraft connects farmers directly with consumers. Fresh produce,
              fair prices, no middlemen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-green-700 rounded-lg shadow-lg hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-300"
              >
                Sell Your Produce
              </Link>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative h-full w-full overflow-hidden rounded-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-transparent opacity-40"></div>
            <img
              src="https://images.yourstory.com/cs/5/f02aced0d86311e98e0865c1f0fe59a2/indian-farmer-1610471656527.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75"
              alt="Farmers working in a green field with fresh produce"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
