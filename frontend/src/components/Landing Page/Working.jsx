import React from "react";
import { CirclePlus, ShoppingCart, TruckIcon } from "lucide-react";
import { useState, useEffect } from "react";

const Working = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            How AgroCraft Works
          </h2>
          <p className="text-green-600 max-w-2xl mx-auto">
            Our platform bridges the gap between farmers and consumers, creating
            a sustainable marketplace for fresh produce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Farmers List Products",
              description:
                "Local farmers add their fresh produce, set their prices, and manage their inventory.",
              icon: (
                <CirclePlus
                  className="w-16 h-16 text-green-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              ),
            },
            {
              title: "Customers Shop Local",
              description:
                "Browse products by category, farm location, or growing practices. Know exactly where your food comes from.",
              icon: (
                <ShoppingCart
                  className="w-16 h-16 text-green-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              ),
            },
            {
              title: "Direct Delivery",
              description:
                "Choose pickup options or have fresh produce delivered directly to your door within 24 hours of harvest.",
              icon: (
                <TruckIcon
                  className="w-16 h-16 text-green-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              ),
            },
          ].map((step, index) => (
            <div
              key={index}
              className={`bg-green-50 rounded-xl p-8 text-center shadow-md transform hover:-translate-y-2 transition-all duration-500 delay-${
                index * 100
              } ${isLoaded ? "opacity-100" : "opacity-0"}`}
            >
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-bold text-green-800 mb-3">
                {step.title}
              </h3>
              <p className="text-green-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Working;
