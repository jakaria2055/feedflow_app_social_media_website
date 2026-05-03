import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  ArrowLeftFromLine,
  Camera,
  User,
  Globe,
  FileText,
  Mail,
  Phone,
  Heart,
  GraduationCap,
  Briefcase,
  Users,
} from "lucide-react";
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
  const [imageUploading, setImageUploading] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

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
      setImageUploading(true);

      const formData = new FormData();
      formData.append("profileImage", file);

      const { data } = await axiosInstance.post(
        "/user/upload-profile",
        formData,
      );

      if (data.success) {
        toast.success(data.message || "Profile image updated");
        dispatch(setUser(data.user));
      }
    } catch (error) {
      console.log("Image Upload Error: ", error);
      toast.error("Failed to upload image");
      // Revert preview on error
      setProfileImage(user?.profileImage || null);
    } finally {
      setImageUploading(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex text-white min-h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-3 border-[#E1306C] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 font-medium">
            Loading Profile data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex text-white min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`transition-all duration-300 p-3 overflow-y-scroll snap-mandatory no-scrollbar flex-1 flex flex-col gap-2 ${
          collapsed ? "ml-2" : "ml-14 md:ml-64"
        }`}
      >
        {/* <main className="flex-1 max-w-3xl w-full mx-auto py-8 px-4"> */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 border border-gray-700/50 p-6 md:p-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700/50">
            <Link
              to={`/profile/${user?._id}`}
              className="p-2 rounded-full hover:bg-gray-800/50 transition-all duration-200 hover:scale-110 group"
            >
              <ArrowLeftFromLine
                size={22}
                className="text-gray-400 group-hover:text-[#E1306C] transition-colors"
              />
            </Link>

            <h1 className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Edit Profile
            </h1>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                isSaving
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
              }`}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </header>

          {/* Profile Image Section */}
          <section className="flex flex-col items-center mb-8 pb-6 border-b border-gray-700/50">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] p-[2px] shadow-xl shadow-pink-500/20">
                <img
                  src={
                    profileImage ||
                    `https://placehold.co/150x150/1a1a2e/FFFFFF?text=${user?.username?.charAt(0)?.toUpperCase()}`
                  }
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
                <Camera size={14} className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageUploading}
                />
              </label>
            </div>
            <label className="mt-3 text-sm text-[#E1306C] font-medium cursor-pointer hover:text-[#F77737] transition-colors duration-200">
              {imageUploading ? "Uploading..." : "Change Profile Photo"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageUploading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or GIF. Max 5MB
            </p>
          </section>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Fullname & Username Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={profileData.fullname}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <User size={14} /> Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
                  placeholder="Username"
                />
              </div>
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Phone size={14} /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
                  placeholder="Phone number"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <FileText size={14} /> Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Globe size={14} /> Website
              </label>
              <input
                type="text"
                name="website"
                value={profileData.website}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
                placeholder="https://your-website.com"
              />
            </div>

            {/* Gender & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Users size={14} /> Gender
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200 cursor-pointer"
                >
                  <option className="bg-gray-900" value="">
                    Select Gender
                  </option>
                  <option className="bg-gray-900" value="male">
                    Male
                  </option>
                  <option className="bg-gray-900" value="female">
                    Female
                  </option>
                  <option className="bg-gray-900" value="others">
                    Others
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Heart size={14} /> Relationship Status
                </label>
                <select
                  name="status"
                  value={profileData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200 cursor-pointer"
                >
                  <option className="bg-gray-900" value="">
                    Select Status
                  </option>
                  <option className="bg-gray-900" value="single">
                    Single
                  </option>
                  <option className="bg-gray-900" value="married">
                    Married
                  </option>
                  <option className="bg-gray-900" value="divorce">
                    Divorced
                  </option>
                  <option className="bg-gray-900" value="widow">
                    Widow
                  </option>
                </select>
              </div>
            </div>

            {/* Education & Job Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <GraduationCap size={14} /> Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={profileData.education}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
                  placeholder="Your education"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Briefcase size={14} /> Job / Profession
                </label>
                <input
                  type="text"
                  name="job"
                  value={profileData.job}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
                  placeholder="Your profession"
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AccountEdit;
