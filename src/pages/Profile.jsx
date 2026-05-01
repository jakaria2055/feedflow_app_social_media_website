import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getUserById,
  logoutUser,
  setProfileUser,
} from "../redux/slices/userSlices";
import Sidebar from "../components/Sidebar";
import ProfileImage from "../components/ProfileImage";
import FollowButton from "../components/FollowButton";
import LikeButton from "../components/LikeButton";
import {
  MessageCircle,
  User,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Heart,
  Recycle,
  Trash2,
} from "lucide-react";
import Modal from "../components/Modal";
import ProfileViewer from "../components/ProfileViewer";
import { setSelectedUser } from "../redux/slices/messageSlice";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("posts");

  const { profileUser, user: currentUser } = useSelector((state) => state.user);
  console.log("Profile of User: ", profileUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const modalVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleMessageUser = () => {
    if (!profileUser) return;
    // set selected user in redux
    dispatch(setSelectedUser(profileUser));
    // redirect to message page
    navigate("/chats");
  };

  const handleLikeUpdate = (updateItem) => {
    const keyMap = { post: "post", reel: "reel", saved: "savedPosts" };
    const key = keyMap[activeTab];

    if (profileUser && profileUser[key]) {
      const updateProfileUser = { ...profileUser };
      updateProfileUser[key] = updateProfileUser[key].map((item) =>
        item?._id === updateItem?._id ? updateItem : item,
      );

      dispatch(setProfileUser(updateProfileUser));
    }

    setModalContent((prev) =>
      prev.map((item) => (item?._id === updateItem?._id ? updateItem : item)),
    );
  };

  const getContentType = (tab) => {
    switch (tab) {
      case "reel":
        return "reel";
      case "saved":
        return "post";
      default:
        return "post";
    }
  };

  const openModal = (index, contentArray) => {
    setIsModalOpen(true);
    setModalIndex(index);
    setModalContent(contentArray);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalVideoClick = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 600);
  };

  const handleModalMuteToggle = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  //Delete Post Function
  const handleDeletePost = async (id, e) => {
    e.stopPropagation();

    try {
      let endpoint = "";

      if (activeTab === "posts" || activeTab === "saved") {
        endpoint = `post/${id}`;
      } else if (activeTab === "reels") {
        endpoint = `reel/${id}`;
      }

      const { data } = await axiosInstance.delete(endpoint);

      if (data?.success) {
        toast.success(`${activeTab.slice(0, -1)} deleted successfully`);

        // remove deleted item instantly from UI
        const keyMap = {
          posts: "posts",
          reels: "reels",
          saved: "savedPosts",
        };

        const key = keyMap[activeTab];

        const updatedProfileUser = {
          ...profileUser,
          [key]: profileUser[key].filter((item) => item._id !== id),
        };

        dispatch(setProfileUser(updatedProfileUser));

        // also remove from modal content
        setModalContent((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    dispatch(getUserById(id));
  }, [dispatch, id]);

  const renderGridContent = () => {
    if (!profileUser) return null;

    const keyMap = { posts: "posts", reels: "reels", saved: "savedPosts" };

    const content = profileUser[keyMap[activeTab]] || [];

    if (!content.length)
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-3">
            <MessageCircle size={32} className="text-gray-600" />
          </div>
          <p className="text-gray-500 font-medium">No {activeTab} yet</p>
          <p className="text-gray-600 text-sm mt-1">
            {activeTab === "posts"
              ? "Share your first post to get started"
              : activeTab === "reels"
                ? "Create your first reel"
                : "Save posts to see them here"}
          </p>
        </div>
      );

    return content?.map((item, i) => (
      <div
        key={item?._id}
        onClick={() => openModal(i, content)}
        className="relative aspect-square overflow-hidden group cursor-pointer rounded-xl bg-gray-900/30 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
      >
        {item?.mediaType === "image" ? (
          <img
            src={item?.mediaUrl}
            alt={item?.caption || "image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : item?.mediaType === "video" ? (
          <video
            loop
            playsInline
            muted
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
            <source src={item?.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900">
            <p className="text-white text-center text-xs break-words whitespace-pre-wrap">
              {item?.caption}
            </p>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <div className="relative flex gap-6 text-white font-semibold text-sm">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <LikeButton
                type={getContentType(activeTab)}
                size={18}
                item={item}
                onToggle={handleLikeUpdate}
              />
              <span>{item?.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MessageCircle size={18} strokeWidth={2} />
              <span>{item?.comments?.length || 0}</span>
            </div>
            {profileUser?._id === currentUser?._id && (
              <button
                onClick={(e) => handleDeletePost(item._id, e)}
                className="absolute -top-57 -right-15 flex items-center gap-1.5 hover:scale-105 hover:bg-red-500/50 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full z-20 transition-all duration-200"
              >
                <Trash2 size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto mb-10">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] p-[2px] shadow-xl shadow-pink-500/20">
              <ProfileImage
                user={profileUser}
                className="w-full h-full rounded-full"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            {/* Username & Actions */}
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 mb-4">
              <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {profileUser?.username}
              </h1>
              <div className="flex flex-wrap justify-center gap-2">
                {profileUser?._id === currentUser?._id ? (
                  <>
                    <Link
                      to={`/account/edit`}
                      className="bg-gradient-to-r from-[#833AB4] to-[#E1306C] px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => dispatch(logoutUser())}
                      className="bg-gray-800 hover:bg-gray-700 px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <FollowButton
                      targetUserId={profileUser?._id}
                      currentUser={currentUser}
                    />
                    <button
                      onClick={handleMessageUser}
                      className="bg-gradient-to-r from-[#833AB4] to-[#E1306C] px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20"
                    >
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 mb-5">
              <div className="text-center">
                <span className="font-bold text-xl block text-white">
                  {profileUser?.posts?.length || 0}
                </span>
                <span className="text-xs text-gray-400">Posts</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-xl block text-white">
                  {profileUser?.followers?.length || 0}
                </span>
                <span className="text-xs text-gray-400">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-xl block text-white">
                  {profileUser?.following?.length || 0}
                </span>
                <span className="text-xs text-gray-400">Following</span>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-2">
              <h2 className="font-semibold text-white flex items-center justify-center md:justify-start gap-2">
                <User size={16} className="text-gray-400" />
                {profileUser?.fullname || profileUser?.username}
              </h2>
            </div>

            {/* Bio */}
            {profileUser?.bio && (
              <p className="text-sm text-gray-300 max-w-md mx-auto md:mx-0 mb-3">
                {profileUser?.bio}
              </p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
              {profileUser?.gender && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <User size={14} className="text-gray-400" />
                  <span className="text-gray-300">{profileUser.gender}</span>
                </div>
              )}

              {profileUser?.phone && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-300">{profileUser.phone}</span>
                </div>
              )}

              {profileUser?.status && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <Heart size={14} className="text-gray-400" />
                  <span className="text-gray-300 capitalize">
                    {profileUser.status}
                  </span>
                </div>
              )}

              {profileUser?.education && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <GraduationCap size={14} className="text-gray-400" />
                  <span className="text-gray-300">{profileUser.education}</span>
                </div>
              )}

              {profileUser?.job && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <Briefcase size={14} className="text-gray-400" />
                  <span className="text-gray-300">{profileUser.job}</span>
                </div>
              )}

              {profileUser?.website && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg col-span-full">
                  <Globe size={14} className="text-gray-400" />
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-[#E1306C] truncate"
                  >
                    {profileUser.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex justify-center gap-8 border-b border-gray-800/50 mb-6">
          {["posts", "reels", "saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-semibold text-sm transition-all duration-200 relative ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {renderGridContent()}
        </div>
      </main>

      {/* Modal Viewer */}
      <Modal
        openModal={isModalOpen}
        onClose={handleCloseModal}
        initialWidth="max-w-5xl"
        showCloseBtn
      >
        <ProfileViewer
          handleModalVideoClick={handleModalVideoClick}
          handleModalMuteToggle={handleModalMuteToggle}
          modalVideoRef={modalVideoRef}
          showIcon={showIcon}
          isMuted={isMuted}
          isPlaying={isPlaying}
          startIndex={modalIndex}
          content={modalContent}
          activeTab={activeTab}
          currentUser={profileUser}
          type={getContentType(activeTab)}
        />
      </Modal>
    </div>
  );
};

export default Profile;
