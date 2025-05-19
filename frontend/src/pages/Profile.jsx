import { useEffect, useState } from "react";
import { getUserById, updateProfile } from "../services/api";
import { getSession } from "../utils/cookieUtils";
import { Upload, Edit, User, Mail } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const userId = getSession("userId");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getUserById(userId);
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture || null,
      });
      setPreviewURL(userData.profilePicture);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));

      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => setPreviewURL(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    if (formData.profilePicture instanceof File) {
      updatedData.append("profilePicture", formData.profilePicture);
    }

    try {
      await updateProfile(userId, updatedData);
      await fetchUserProfile(); // Fetch updated data
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error: " + (error.response?.data || "Update failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
        <p className="ml-3 text-lg text-gray-600">Loading profile...</p>
      </div>
    );

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600">
          View and update your personal information
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center">
          <User className="h-5 w-5 text-[#4CAF50] mr-2" />
          <h2 className="font-semibold text-gray-800">Profile Details</h2>
        </div>

        <div className="p-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-[#4CAF50] overflow-hidden bg-gray-100">
                {previewURL ? (
                  <img
                    src={previewURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-all">
                <Upload className="w-4 h-4 text-[#4CAF50]" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
            <h3 className="mt-3 font-semibold text-[#2E7D32] text-lg">
              {user.name}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Your email"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]/50 focus:border-[#4CAF50] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-[#4CAF50] hover:bg-[#2E7D32] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:bg-[#A5D6A7] disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  Update Profile
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
