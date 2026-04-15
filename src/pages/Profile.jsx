import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
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
} from "lucide-react";
import Modal from "../components/Modal";
import ProfileViewer from "../components/ProfileViewer";

const Profile = () => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    dispatch(getUserById(id));
  }, [dispatch, id]);

  const renderGridContent = () => {
    if (!profileUser) return null;

    const keyMap = { posts: "posts", reels: "reels", saved: "savedPosts" };

    const content = profileUser[keyMap[activeTab]] || [];

    if (!content.length)
      return (
        <p className="text-center text-gray-500 col-span-full mt-6">
          No {activeTab}
        </p>
      );

    return content?.map((item, i) => (
      <div
        key={item?._id}
        onClick={() => openModal(i, content)}
        className="relative h-72 w-full aspect-square overflow-hidden group cursor-pointer"
      >
        {item?.mediaType === "image" ? (
          <img
            src={item?.mediaUrl}
            alt={item?.caption || "image"}
            className="w-full h-full object-contain"
          />
        ) : (
          <video loop playsInline muted className="w-full h-full object-cover">
            <source src={item?.mediaUrl} type="video/mp4" />
          </video>
        )}

        {/* OverLay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-6 text-white font-semibold text-lg">
            <div className="flex items-center gap-2">
              <LikeButton
                type={getContentType(activeTab)}
                size={24}
                item={item}
                onToggle={handleLikeUpdate}
              />
              <span>{item?.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={24} strokeWidth={2} />
              <span>{item?.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-black flex bg-opacity-95 text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex md:max-w-2xl m-auto flex-col md:flex-row items-center md:justify-around md:space-x-10 mb-8 text-center md:text-left">
          <ProfileImage user={profileUser} className="w-24 h-24" />

          <div className="">
            <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-between items-center gap-4 mb-4 text-center md:text-left">
              <h1 className="text-lg md:text-xl font-semibold">
                {profileUser?.username}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
                {profileUser?._id === currentUser?._id ? (
                  <button className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 rounded-md font-semibold text-sm md:text-base">
                    <Link to={`/account/edit`}>Edit Profile</Link>
                  </button>
                ) : (
                  <FollowButton
                    targetUserId={profileUser?._id}
                    currentUser={currentUser}
                  />
                )}

                {profileUser?._id === currentUser?._id ? (
                  <button
                    onClick={() => dispatch(logoutUser())}
                    className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 rounded-md font-semibold text-sm md:text-base"
                  >
                    Logout
                  </button>
                ) : (
                  <button className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 rounded-md font-semibold text-sm md:text-base">
                    Message
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-around gap-8">
              <div className="text-center">
                <span className="font-bold text-lg block">
                  {profileUser?.posts?.length || 0}
                </span>
                <span className="text-sm text-gray-400">Posts</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-lg block">
                  {profileUser?.followers?.length || 0}
                </span>
                <span className="text-sm text-gray-400">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-lg block">
                  {profileUser?.following?.length || 0}
                </span>
                <span className="text-sm text-gray-400">Following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5 space-y-4 text-center md:text-left">
              {/* Username */}
              <h2 className="font-semibold text-lg flex items-center justify-center md:justify-start gap-2">
                <User size={18} className="text-gray-400" />
                {profileUser?.fullname || profileUser?.username}
              </h2>

              {/* Bio */}
              <p className="text-sm text-gray-400 max-w-md mx-auto md:mx-0">
                {profileUser?.bio ||
                  `Hi guys, this is ${profileUser?.username}`}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-gray-300">
                {profileUser?.gender && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                    <User size={16} className="text-gray-400" />
                    <span>{profileUser.gender}</span>
                  </div>
                )}

                {profileUser?.phone && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                    <Phone size={16} className="text-gray-400" />
                    <span>{profileUser.phone}</span>
                  </div>
                )}

                {profileUser?.status && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                    <Heart size={16} className="text-gray-400" />
                    <span className="capitalize">{profileUser.status}</span>
                  </div>
                )}

                {profileUser?.education && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                    <GraduationCap size={16} className="text-gray-400" />
                    <span>{profileUser.education}</span>
                  </div>
                )}

                {profileUser?.job && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                    <Briefcase size={16} className="text-gray-400" />
                    <span>{profileUser.job}</span>
                  </div>
                )}

                {profileUser?.website && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg col-span-full">
                    <Globe size={16} className="text-gray-400" />
                    <a
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-400 truncate"
                    >
                      {profileUser.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="grid grid-cols-3 text-center border-t border-b border-gray-800 mb-6">
          {["posts", "reels", "saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 font-semibold transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-white text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
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
