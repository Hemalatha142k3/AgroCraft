import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { setSession } from "../utils/cookieUtils";
import { LockKeyhole, Mail } from "lucide-react";
import IconSVG from "@/assets/icon1.svg";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "Farmer",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await login(credentials);
      const responseData = response.data || response;

      if (responseData?.status === "success") {
        const { userId, role } = responseData;

        if (!userId) {
          alert("Error: User ID not received. Please contact support.");
          return;
        }

        setSession("userId", userId, 30);
        setSession("role", role, 30);

        const dashboardPath =
          role === "Farmer"
            ? "/farmerDashboard"
            : role === "Staff"
            ? "/staffDashboard"
            : "/customerDashboard";

        navigate(dashboardPath);
        alert(`${role} Login successful!`);
      } else {
        alert(responseData.message || "Invalid email or password.");
      }
    } catch (error) {
      alert("Login failed. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-[#4CAF50]/10 -skew-y-2"></div>
      <div className="absolute bottom-0 right-0 w-full h-20 bg-[#4CAF50]/10 skew-y-2"></div>

      {/* Pattern overlay - using a background color instead of image for Vite compatibility */}
      <div
        className="absolute inset-0 opacity-10 bg-[#4CAF50]"
        style={{
          backgroundImage: "radial-gradient(#388E3C 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md px-4 py-6">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <img src={IconSVG} alt="Logo" className="w-8 h-8 text-[#2E7D32]" />
            <span className="text-2xl font-bold text-[#2E7D32]">AgroCraft</span>
          </div>
        </div>

        <div className="w-full border-none shadow-xl rounded-2xl overflow-hidden bg-white">
          <div className="h-2 bg-gradient-to-r from-[#4CAF50] to-[#81C784]"></div>

          <div className="p-6 pb-4">
            <h2 className="text-2xl font-bold text-[#1B5E20]">Welcome Back</h2>
            <p className="text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>

          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
                  />
                  <LockKeyhole
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  />
                </div>
                <div className="flex justify-end">
                  <a
                    href="#"
                    className="text-xs text-[#4CAF50] hover:text-[#2E7D32] transition"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white py-3 rounded-lg font-medium transition-all duration-200 text-base disabled:bg-[#A5D6A7] disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    {/* Using inline SVG for loading icon */}
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-[#4CAF50] font-medium hover:text-[#2E7D32] hover:underline transition"
                >
                  Create an account
                </a>
              </p>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing in, you agree to AgroCraft's Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}

export default Login;
