import React from "react";
import { Link } from "react-router-dom";
import IconSVG from "@/assets/icon1.svg";
const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center">
            <img src={IconSVG} alt="Logo" className="w-8 h-8 text-[#2E7D32]" />
            <span className="text-2xl font-bold text-green-800">AgroCraft</span>
          </div>
        </Link>

        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-green-700 hover:text-green-800 font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-300"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
