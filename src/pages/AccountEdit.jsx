import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowLeftFromLine } from "lucide-react";
import { setUser } from "../redux/slices/userSlices";

const AccountEdit = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [profileData, setProfileData] = useState({
    username: "",
    fullname: "",
    website: "",
    bio: "",
    email: "",
    phone: "",
    status: "",
    gender: "",
    education: "",
    job: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        fullname: user.fullname || "",
        website: user.website || "",
        bio: user.bio || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "",
        gender: user.gender || "",
        education: user.education || "",
        job: user.job || "",
      });

      setProfileImage(user?.profileImage || null);
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data } = await axiosInstance.put(
        "/user/update-profile",
        profileData,
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");

        // Update Redux (VERY IMPORTANT)
        dispatch(setUser(data.user));
      }
    } catch (error) {
      console.log("Update Profile Error: ", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle profile image upload
  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // preview
      setProfileImage(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("profileImage", file);

      const { data } = await axiosInstance.post(
        "/user/upload-profile",
        formData,
      );

      if (data.success) {
        toast.success(data.message || "Profile image updated");

        // update redux user image
        dispatch(setUser(data.user));
      }
    } catch (error) {
      console.log("Image Upload Error: ", error);
      toast.error("Failed to upload image");
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-600 font-medium">
          Loading Profile data...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black flex text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 max-w-3xl w-full mx-auto py-8 px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-lg shadow-lg p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <Link to={`/profile/${user?._id}`}>
              <ArrowLeftFromLine size={24} className="hover:scale-105" />
            </Link>

            <h1 className="font-bold text-lg">Edit Profile</h1>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`font-semibold text-lg ${
                isSaving
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-400 hover:text-blue-500"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </header>

          {/* Profile Image */}
          <section className="flex flex-col items-center mb-6">
            <img
              src={
                profileImage ||
                `https://placeholder.co/100x100/A855FF7/FFFFFF?text=${user?.username?.charAt(0)?.toUpperCase()}`
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-500 mb-4"
            />

            <label className="text-blue-400 font-semibold text-sm cursor-pointer">
              Change Profile Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </section>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-5">
            {["fullname", "username", "website", "bio", "email", "phone"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-300 capitalize">
                    {field}
                  </label>

                  {field === "bio" ? (
                    <textarea
                      name={field}
                      value={profileData[field]}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-gray-500 p-2 text-sm outline-none"
                      placeholder={`Enter your ${field}`}
                    />
                  ) : (
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                            ? "tel"
                            : "text"
                      }
                      name={field}
                      value={profileData[field]}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-gray-500 p-2 text-sm outline-none"
                      placeholder={`Enter your ${field}`}
                    />
                  )}
                </div>
              ),
            )}

            <div className="flex items-center justify-around">
              {/* Gender */}
              <div>
                <label className="text-sm text-gray-300">Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 p-2"
                >
                  <option className="text-gray-700" value="">
                    Select Gender
                  </option>
                  <option className="text-gray-700" value="male">
                    Male
                  </option>
                  <option className="text-gray-700" value="female">
                    Female
                  </option>
                  <option className="text-gray-700" value="others">
                    Others
                  </option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-gray-300">Status</label>
                <select
                  name="status"
                  value={profileData.status}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 p-2"
                >
                  <option className="text-gray-700" value="">
                    Select Status
                  </option>
                  <option className="text-gray-700" value="single">
                    Single
                  </option>
                  <option className="text-gray-700" value="married">
                    Married
                  </option>
                  <option className="text-gray-700" value="divorce">
                    Divorced
                  </option>
                  <option className="text-gray-700" value="widow">
                    Widow
                  </option>
                </select>
              </div>
            </div>

            {/* Extra fields */}
            {["education", "job"].map((field) => (
              <div key={field}>
                <label className="text-sm text-gray-300 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={profileData[field]}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 p-2 text-sm outline-none"
                  placeholder={`Enter your ${field}`}
                />
              </div>
            ))}
          </form>
        </div>
      </main>
    </div>
  );
};

export default AccountEdit;
