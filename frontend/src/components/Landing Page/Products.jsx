import React from "react";
import { items } from "@/data/items";
import { Link } from "react-router-dom";

const Products = () => {
  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">
              Fresh From The Farm
            </h2>
            <p className="text-green-600">
              This season's best produce, directly from local farmers
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-green-800">
                  {product.name}
                </h3>
                <p className="text-green-600 text-sm mb-2">
                  By {product.farmer}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-700">
                    {product.price}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
