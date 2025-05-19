import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyOtp from "./pages/Verify";
import AddProduct from "./pages/AddProduct";
import ViewAllProducts from "./pages/ViewAllProducts";
import UpdateProduct from "./pages/UpdateProduct";
import FarmerDashboard from "./dashboards/FarmerDashboard";
import UserViewAllProducts from "./pages/UserViewAllProducts";
import CustomerDashboard from "./dashboards/CustomerDashboard";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import DairyAdd from "./pages/DairyAdd";
import DairyProductList from "./pages/DairyProductList";
import BookingDairy from "./pages/BookingDairy";
import CustomerOrders from "./pages/CustomerOrders";
import SellerOrders from "./pages/SellerOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyOtp />} />

        {/* Farmer Dashboard Routes */}
        <Route path="/farmerdashboard" element={<FarmerDashboard />} />
        <Route path="/farmerdashboard/:page" element={<FarmerDashboard />} />
        <Route
          path="/farmerdashboard/update-product/:id"
          element={<UpdateProduct />}
        />

        {/* Customer Dashboard Routes */}
        <Route path="/customerdashboard" element={<CustomerDashboard />} />
        <Route
          path="/customerdashboard/:page"
          element={<CustomerDashboard />}
        />

        {/* Standalone routes for backward compatibility or direct access */}
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/viewallproducts" element={<ViewAllProducts />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/addDairy" element={<DairyAdd />} />
        <Route path="/viewallDairy" element={<DairyProductList />} />
        <Route path="/sellerorders" element={<SellerOrders />} />

        {/* Customer standalone routes */}
        <Route path="/userviewallproducts" element={<UserViewAllProducts />} />
        <Route path="/booking" element={<BookingDairy />} />
        <Route path="/customerorders" element={<CustomerOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
