import React from "react";
import { testimonials } from "@/data/testimonial";

const TestimonialCard = ({ quote, image, name, position }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-green-800 mb-4">"{quote}"</p>
      <div className="flex items-center">
        <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h4 className="font-medium text-green-800">{name}</h4>
          <p className="text-sm text-green-600">{position}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <div className="py-16 bg-green-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-12">
          What Our Community Says
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Map through testimonial categories */}
          {Object.entries(testimonials).map(([key, category]) => (
            <div key={key}>
              <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center">
                <category.icon
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                />
                {category.title}
              </h3>

              <div className="space-y-6">
                {/* Map through testimonial items */}
                {category.items.map((item, index) => (
                  <TestimonialCard
                    key={index}
                    quote={item.quote}
                    image={item.image}
                    name={item.name}
                    position={item.position}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
