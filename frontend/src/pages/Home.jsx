import { useState, useEffect } from "react";

import TestimonialsSection from "@/components/Landing Page/Testimonial";
import CTA from "@/components/Landing Page/CTA";
import Benefits from "@/components/Landing Page/Benefits";
import Footer from "@/components/Landing Page/Footer";
import Header from "@/components/Landing Page/Header";
import HeroSection from "@/components/Landing Page/HeroSection";
import Working from "@/components/Landing Page/Working";
import Products from "@/components/Landing Page/Products";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Header />
      <main>
        <HeroSection />
        <Working />
        <Products />
        <Benefits />
        <TestimonialsSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
