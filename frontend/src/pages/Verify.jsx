import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Clock, CheckCircle } from "lucide-react";
import { verifyAccount, regenerateOtp } from "../services/api"; // Import API functions
import IconSVG from "@/assets/icon1.svg";

const Verify = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill("")); // 6-character OTP
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const otpInputs = useRef([]); // UseRef for OTP input fields

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setError(false);

    try {
      const enteredOtp = otp.join("");
      const result = await verifyAccount(email, enteredOtp);

      setIsSuccess(true);
      setMessage(result || "Verification successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (errMessage) {
      setIsSuccess(false);
      setError(true);
      setMessage(errMessage || "Invalid OTP. Please try again.");
      console.error(errMessage);
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    setIsResendDisabled(true);
    setTimer(30);
    setMessage("");
    setError(false);

    try {
      const result = await regenerateOtp(email);
      setMessage(result || "OTP resent successfully. Please check your email.");
    } catch (errMessage) {
      setIsResendDisabled(false);
      setError(true);
      setMessage(errMessage || "Failed to resend OTP. Please try again.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move focus to the next input
    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-[#4CAF50]/10 -skew-y-2"></div>
      <div className="absolute bottom-0 right-0 w-full h-20 bg-[#4CAF50]/10 skew-y-2"></div>

      {/* Pattern overlay */}
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
            <h2 className="text-2xl font-bold text-[#1B5E20]">
              Verify Account
            </h2>
            <p className="text-sm text-gray-600">
              Please enter the OTP sent to your email address
            </p>
          </div>

          <div className="p-6 pt-0">
            {message && (
              <div
                className={`p-3 mb-4 rounded-lg ${
                  isSuccess
                    ? "bg-[#4CAF50]/10 text-[#1B5E20] border border-[#4CAF50]/20"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                <div className="flex items-center">
                  {isSuccess ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <div className="w-5 h-5 mr-2 text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  )}
                  {message}
                </div>
              </div>
            )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="flex justify-between space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || otp.includes("")}
                className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white py-3 rounded-lg font-medium transition-all duration-200 text-base disabled:bg-[#A5D6A7] disabled:cursor-not-allowed"
              >
                Verify
              </button>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600 mb-1">
                  Haven't received OTP?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                  className="flex items-center justify-center mx-auto text-[#4CAF50] font-medium hover:text-[#2E7D32] hover:underline transition disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isResendDisabled && (
                    <Clock className="w-4 h-4 mr-1 inline-block" />
                  )}
                  Resend OTP {isResendDisabled && `in ${timer}s`}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By verifying your account, you agree to AgroCraft's Terms of Service
          and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Verify;
