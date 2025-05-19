import { Link } from "react-router-dom";
import React from "react";

const CTA = () => {
  return (
    <div className="py-16 bg-white text-green-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to experience farm-fresh goodness?
        </h2>
        <p className="text-lg mb-8 text-green-700">
          Join thousands of farmers and customers already transforming how we
          buy and sell food.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-green-700 rounded-lg shadow-lg hover:bg-green-50 transform hover:-translate-y-1 transition-all duration-300 font-medium"
          >
            Shop Now
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-green-800 text-white rounded-lg shadow-lg hover:bg-green-900 transform hover:-translate-y-1 transition-all duration-300 font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
