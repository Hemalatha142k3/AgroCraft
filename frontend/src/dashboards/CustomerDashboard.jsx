import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSession, clearSession } from "../utils/cookieUtils";
import { getUserById } from "../services/api";
import {
  User,
  ShoppingBag,
  Heart,
  ShoppingCart,
  ClipboardList,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Home,
  Milk,
} from "lucide-react";
import IconSVG from "@/assets/icon1.svg";

// Import customer pages
import Profile from "../pages/Profile";
import UserViewAllProducts from "../pages/UserViewAllProducts";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import CustomerOrders from "../pages/CustomerOrders";
import DairyProductList from "../pages/DairyProductList";

import { recentActivities } from "@/data/recentActivities.js";

// Dashboard Home Content Component
const DashboardHome = () => {
  const quickStats = [
    {
      title: "Orders Placed",
      value: "8",
      icon: <ClipboardList className="h-8 w-8 text-[#4CAF50]" />,
      change: "+2 from last month",
      positive: true,
    },
    {
      title: "Wishlist Items",
      value: "12",
      icon: <Heart className="h-8 w-8 text-[#4CAF50]" />,
      change: "+5 new items",
      positive: true,
    },
    {
      title: "Cart Value",
      value: "$85.50",
      icon: <ShoppingCart className="h-8 w-8 text-[#4CAF50]" />,
      change: "3 items in cart",
      positive: true,
    },
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to your Customer Dashboard
        </h1>
        <p className="text-gray-600">
          Discover fresh produce directly from local farms.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="flex items-start">{stat.icon}</div>
            </div>
            <div
              className={`mt-2 text-xs font-medium ${
                stat.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-gray-800">Recent Activities</h2>
          </div>
          <div className="p-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`py-3 ${
                  index !== recentActivities.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    {activity.activity}
                  </span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t">
            <Link
              to="/activities"
              className="text-[#4CAF50] hover:text-[#2E7D32] text-sm font-medium"
            >
              View all activities
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              to="/customerdashboard/userviewallproducts"
              className="flex items-center p-3 bg-[#4CAF50]/5 hover:bg-[#4CAF50]/10 rounded-lg transition-colors"
            >
              <ShoppingBag size={18} className="text-[#4CAF50] mr-3" />
              <span className="font-medium text-gray-800">Browse Products</span>
            </Link>
            <Link
              to="/customerdashboard/cart"
              className="flex items-center p-3 bg-[#4CAF50]/5 hover:bg-[#4CAF50]/10 rounded-lg transition-colors"
            >
              <ShoppingCart size={18} className="text-[#4CAF50] mr-3" />
              <span className="font-medium text-gray-800">View Cart</span>
            </Link>
            <Link
              to="/customerdashboard/myorders"
              className="flex items-center p-3 bg-[#4CAF50]/5 hover:bg-[#4CAF50]/10 rounded-lg transition-colors"
            >
              <ClipboardList size={18} className="text-[#4CAF50] mr-3" />
              <span className="font-medium text-gray-800">Track Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const CustomerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the active section from the path
  // Default to dashboard if at the root customer dashboard
  const currentPath = location.pathname.split("/");
  const activePage = currentPath.length > 2 ? currentPath[2] : "dashboard";

  useEffect(() => {
    const storedUserId = getSession("userId");
    const storedRole = getSession("role");

    if (!storedUserId || storedRole !== "Customer") {
      alert("Unauthorized Access! Please log in again.");
      navigate("/"); // Redirect to login if not logged in as a Customer
    } else {
      setUserId(storedUserId);
      setRole(storedRole);
      fetchUserData(storedUserId);
    }
  }, [navigate]);

  const fetchUserData = async (id) => {
    try {
      // Import the getUserById function if it's not already imported
      // const { getUserById } = await import("../services/userService");
      const data = await getUserById(id);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Set fallback data
      setUserData({ name: "Customer" });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    clearSession("userId");
    clearSession("role");
    alert("Logged out successfully!");
    navigate("/");
  };

  // Define the menu items with paths
  const menuItems = [
    {
      name: "Dashboard",
      path: "/customerdashboard",
      icon: <Home size={20} />,
      id: "dashboard",
    },
    {
      name: "Browse Products",
      path: "/customerdashboard/userviewallproducts",
      icon: <ShoppingBag size={20} />,
      id: "userviewallproducts",
    },
    {
      name: "Wishlist",
      path: "/customerdashboard/wishlist",
      icon: <Heart size={20} />,
      id: "wishlist",
    },
    {
      name: "Shopping Cart",
      path: "/customerdashboard/cart",
      icon: <ShoppingCart size={20} />,
      id: "cart",
    },
    {
      name: "My Orders",
      path: "/customerdashboard/myorders",
      icon: <ClipboardList size={20} />,
      id: "myorders",
    },
    {
      name: "Dairy Products",
      path: "/customerdashboard/viewalldairy",
      icon: <Milk size={20} />,
      id: "viewalldairy",
    },
    {
      name: "Profile",
      path: "/customerdashboard/profile",
      icon: <User size={20} />,
      id: "profile",
    },
  ];

  // Function to render the appropriate content based on the active page
  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return <Profile />;
      case "userviewallproducts":
        return <UserViewAllProducts />;
      case "wishlist":
        return <Wishlist />;
      case "cart":
        return <Cart />;
      case "myorders":
        return <CustomerOrders />;
      case "viewalldairy":
        return <DairyProductList />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed h-full z-20 lg:relative transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "left-0" : "-left-64 lg:left-0"
        }`}
      >
        <div className="h-full w-64 bg-white shadow-md overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center px-4 h-16 border-b">
            <div className="flex items-center space-x-2">
              <img
                src={IconSVG}
                alt="Logo"
                className="w-8 h-8 text-[#2E7D32]"
              />

              <span className="text-xl font-bold text-[#2E7D32]">
                AgroCraft
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Sidebar Menu */}
          <div className="px-2 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                  activePage === item.id
                    ? "bg-[#4CAF50]/10 text-[#2E7D32]"
                    : "hover:bg-[#4CAF50]/5 text-gray-700 hover:text-[#2E7D32]"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {activePage === item.id && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            ))}

            <div className="border-t border-gray-200 my-4"></div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Top Header with user profile and name */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          {/* User name on the left */}
          <div className="flex-1 ml-4">
            <div className="font-bold text-xl text-gray-800">
              Hi,{" "}
              <span className="capitalize">
                {userData ? userData.name : "Customer"}
              </span>
            </div>
          </div>

          {/* Profile pic on the right */}
          <Link to="/customerdashboard/profile">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#4CAF50] overflow-hidden bg-gray-100">
                {userData && userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>
            </div>
          </Link>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-4 lg:p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
