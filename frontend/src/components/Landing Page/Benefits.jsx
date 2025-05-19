import React from "react";
import { Clock, Earth, IndianRupee, ShieldCheck } from "lucide-react";

const Benefits = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Why Choose AgroCraft?
          </h2>
          <p className="text-green-600 max-w-2xl mx-auto">
            We're transforming agriculture commerce with technology that
            benefits both farmers and consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <IndianRupee
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Better Prices for Everyone
              </h3>
              <p className="text-green-700">
                Farmers earn 20-30% more than traditional channels, while
                consumers pay less than retail prices.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheck
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Quality Assurance
              </h3>
              <p className="text-green-700">
                All farmers undergo verification. Products are inspected for
                quality and proper growing practices.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Ultra-Fresh Produce
              </h3>
              <p className="text-green-700">
                Most produce reaches you within 24 hours of harvest, maintaining
                peak nutrition and flavor.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Earth
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Support Local Economy
              </h3>
              <p className="text-green-700">
                Every purchase supports small and medium farms in your region,
                strengthening local food systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
