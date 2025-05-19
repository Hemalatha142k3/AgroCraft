import { useState, useEffect } from "react";
import { PaymentAPI } from "../services/api";
import { getSession } from "../utils/cookieUtils";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Banknote,
  CreditCard as CardIcon,
  User,
  Info,
} from "lucide-react";

const Payment = () => {
  const userId = getSession("userId"); // Get userId from session
  const [paymentData, setPaymentData] = useState({
    ifscCode: "",
    upiId: "",
    accountNumber: "",
    panCardNumber: "",
    status: "ACTIVE", // Default status
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const data = await PaymentAPI.getPaymentAccountByUserId(userId);
      setPaymentInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await PaymentAPI.registerPaymentAccount(
        userId,
        paymentData
      );
      alert("Payment account registered successfully!");
      fetchPaymentInfo();
      console.log(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Payment Account Details
        </h1>
        <p className="text-gray-600">
          Manage your payment information for receiving payments from customers.
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center">
          <CreditCard className="h-5 w-5 text-[#4CAF50] mr-2" />
          <h2 className="font-semibold text-gray-800">
            {paymentInfo ? "Your Payment Details" : "Register Payment Account"}
          </h2>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {paymentInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg flex">
                  <Banknote className="h-5 w-5 text-[#4CAF50] mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      IFSC Code
                    </p>
                    <p className="font-medium text-gray-800">
                      {paymentInfo.ifscCode}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex">
                  <CardIcon className="h-5 w-5 text-[#4CAF50] mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Account Number
                    </p>
                    <p className="font-medium text-gray-800">
                      **** **** {paymentInfo.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex">
                  <CreditCard className="h-5 w-5 text-[#4CAF50] mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">UPI ID</p>
                    <p className="font-medium text-gray-800">
                      {paymentInfo.upiId}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex">
                  <User className="h-5 w-5 text-[#4CAF50] mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      PAN Card Number
                    </p>
                    <p className="font-medium text-gray-800">
                      {paymentInfo.panCardNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-4 bg-[#4CAF50]/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#4CAF50] mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">
                    Account Status: {paymentInfo.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your payment account is active and ready to receive
                    payments.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg mb-2">
                <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Please provide your payment details for receiving payments
                  from customers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Banknote className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="ifscCode"
                    placeholder="IFSC Code"
                    value={paymentData.ifscCode}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50] outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="upiId"
                    placeholder="UPI ID"
                    value={paymentData.upiId}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50] outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CardIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    value={paymentData.accountNumber}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50] outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="panCardNumber"
                    placeholder="PAN Card Number"
                    value={paymentData.panCardNumber}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4CAF50] text-white py-3 px-4 rounded-lg hover:bg-[#2E7D32] transition-colors font-medium flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Register Payment Account
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
