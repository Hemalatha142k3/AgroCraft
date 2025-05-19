import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, User, Lock, Upload, Loader } from "lucide-react";
import IconSVG from "@/assets/icon1.svg";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "Customer",
    profilePicture: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("email", formData.email);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (formData.profilePicture) {
      data.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await axios.post("http://localhost:8080/register", data);
      alert(response.data);
      navigate("/verify"); // Redirect to the verification page
    } catch (error) {
      alert("Error: " + (error.response?.data || "Registration failed"));
    } finally {
      setIsSubmitting(false);
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
              Create Account
            </h2>
            <p className="text-sm text-gray-600">
              Join our community and start your journey
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Role
                </label>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between">
                    {[
                      { value: "Farmer", icon: "🌱" },
                      { value: "Staff", icon: "👨‍💼" },
                      { value: "Customer", icon: "🛒" },
                    ].map((role) => (
                      <label
                        key={role.value}
                        className="flex flex-col items-center space-y-2 cursor-pointer group"
                      >
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                            formData.role === role.value
                              ? "bg-[#4CAF50]/20 text-[#1B5E20]"
                              : "bg-white text-gray-500 group-hover:bg-[#4CAF50]/10"
                          }`}
                        >
                          <span className="text-lg">{role.icon}</span>
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            formData.role === role.value
                              ? "text-[#1B5E20]"
                              : "text-gray-600"
                          }`}
                        >
                          {role.value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture (Optional)
                </label>
                <div className="relative">
                  <input
                    id="profilePicture"
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-[#4CAF50]/10 file:text-[#1B5E20]
                      hover:file:bg-[#4CAF50]/20
                      transition-all duration-200"
                  />
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hidden" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white py-3 rounded-lg font-medium transition-all duration-200 text-base disabled:bg-[#A5D6A7] disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#4CAF50] font-medium hover:text-[#2E7D32] hover:underline transition"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing up, you agree to AgroCraft's Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default Register;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import IconSVG from "@/assets/icon1.svg";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     username: "",
//     password: "",
//     role: "Customer",
//     profilePicture: null,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate(); // Hook for navigation

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, profilePicture: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const data = new FormData();
//     data.append("email", formData.email);
//     data.append("username", formData.username);
//     data.append("password", formData.password);
//     data.append("role", formData.role);
//     if (formData.profilePicture) {
//       data.append("profilePicture", formData.profilePicture);
//     }

//     try {
//       const response = await axios.post("http://localhost:8080/register", data);
//       alert(response.data);
//       navigate("/verify"); // Redirect to the verification page
//     } catch (error) {
//       alert("Error: " + (error.response?.data || "Registration failed"));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
//       {/* Background decoration elements */}
//       <div className="absolute top-0 left-0 w-full h-20 bg-[#4CAF50]/10 -skew-y-2"></div>
//       <div className="absolute bottom-0 right-0 w-full h-20 bg-[#4CAF50]/10 skew-y-2"></div>

//       {/* Pattern overlay */}
//       <div
//         className="absolute inset-0 opacity-10 bg-[#4CAF50]"
//         style={{
//           backgroundImage: "radial-gradient(#388E3C 1px, transparent 1px)",
//           backgroundSize: "20px 20px",
//         }}
//       ></div>

//       <div className="relative z-10 w-full max-w-md px-4 py-6">
//         <div className="flex justify-center mb-6">
//           <div className="flex items-center space-x-2">
//             <img src={IconSVG} alt="Logo" className="w-8 h-8 text-[#2E7D32]" />
//             <span className="text-2xl font-bold text-[#2E7D32]">AgroCraft</span>
//           </div>
//         </div>

//         <div className="w-full border-none shadow-xl rounded-2xl overflow-hidden bg-white">
//           <div className="h-2 bg-gradient-to-r from-[#4CAF50] to-[#81C784]"></div>

//           <div className="p-6 pb-4">
//             <h2 className="text-2xl font-bold text-[#1B5E20]">
//               Create Account
//             </h2>
//             <p className="text-sm text-gray-600">
//               Join our community and start your journey
//             </p>
//           </div>

//           <div className="p-6 pt-0">
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="email"
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter your email"
//                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
//                   />
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="username"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Username
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="username"
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                     placeholder="Choose a username"
//                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
//                   />
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     placeholder="Create a password"
//                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all duration-200"
//                   />
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Select Role
//                 </label>
//                 <div className="p-3 bg-green-50 rounded-lg">
//                   <div className="flex justify-between">
//                     {[
//                       { value: "Farmer", icon: "🌱" },
//                       { value: "Staff", icon: "👨‍💼" },
//                       { value: "Customer", icon: "🛒" },
//                     ].map((role) => (
//                       <label
//                         key={role.value}
//                         className="flex flex-col items-center space-y-2 cursor-pointer group"
//                       >
//                         <div
//                           className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
//                             formData.role === role.value
//                               ? "bg-[#4CAF50]/20 text-[#1B5E20]"
//                               : "bg-white text-gray-500 group-hover:bg-[#4CAF50]/10"
//                           }`}
//                         >
//                           <span className="text-lg">{role.icon}</span>
//                           <input
//                             type="radio"
//                             name="role"
//                             value={role.value}
//                             checked={formData.role === role.value}
//                             onChange={handleChange}
//                             className="sr-only"
//                           />
//                         </div>
//                         <span
//                           className={`text-sm font-medium ${
//                             formData.role === role.value
//                               ? "text-[#1B5E20]"
//                               : "text-gray-600"
//                           }`}
//                         >
//                           {role.value}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="profilePicture"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Profile Picture (Optional)
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="profilePicture"
//                     type="file"
//                     onChange={handleFileChange}
//                     className="block w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-lg file:border-0
//                       file:text-sm file:font-medium
//                       file:bg-[#4CAF50]/10 file:text-[#1B5E20]
//                       hover:file:bg-[#4CAF50]/20
//                       transition-all duration-200"
//                   />
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hidden"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white py-3 rounded-lg font-medium transition-all duration-200 text-base disabled:bg-[#A5D6A7] disabled:cursor-not-allowed"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Creating account...
//                   </span>
//                 ) : (
//                   "Sign Up"
//                 )}
//               </button>

//               <p className="text-center text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <a
//                   href="/login"
//                   className="text-[#4CAF50] font-medium hover:text-[#2E7D32] hover:underline transition"
//                 >
//                   Sign in
//                 </a>
//               </p>
//             </form>
//           </div>
//         </div>

//         <p className="mt-6 text-center text-xs text-gray-500">
//           By signing up, you agree to AgroCraft's Terms of Service and Privacy
//           Policy
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
