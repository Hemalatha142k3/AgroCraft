import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-green-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">AgroCraft</h3>
            <p className="mb-4 text-green-200">
              Connecting farmers and consumers for a sustainable food future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 hover:text-white">
                <Twitter
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                />
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                <Instagram
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                />
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                <Facebook
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/marketplace"
                  className="text-green-200 hover:text-white"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-green-200 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-green-200 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-200 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">For Farmers</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/seller-signup"
                  className="text-green-200 hover:text-white"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link
                  to="/farmer-resources"
                  className="text-green-200 hover:text-white"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/success-stories"
                  className="text-green-200 hover:text-white"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-green-200 hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Newsletter</h4>
            <p className="text-green-200 mb-4">
              Get updates on fresh harvests and seasonal specials.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-700 mt-12 pt-8 text-center text-green-300">
          <p>
            &copy; {new Date().getFullYear()} AgroCraft. All rights reserved.
          </p>
          <div className="mt-4 space-x-6">
            <Link
              to="/privacy-policy"
              className="text-green-200 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-green-200 hover:text-white">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-green-200 hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
