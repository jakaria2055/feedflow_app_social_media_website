import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getUserById, logoutUser } from "../redux/slices/userSlices";
import Sidebar from "../components/Sidebar";
import ProfileImage from "../components/ProfileImage";
import FollowButton from "../components/FollowButton";

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("posts");

  const { profileUser, user: currentUser } = useSelector((state) => state.user);
  console.log("Profile of User: ", profileUser);

  const openModal = () => {};

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
        <img
          src={item?.mediaUrl}
          alt={item?.caption || "image"}
          className="w-full h-full object-contain"
        />
      </div>
    ));
  };

  return (
    <div className="bg-black flex bg-opacity-95 text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex md:max-w-2xl m-auto flex-col md:flex-row items-center md:justify-around md:space-x-10 mb-8 text-center md:text-left">
          <ProfileImage user={profileUser} className="w-24 h-24" />

          <div>
            <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-between items-center gap-4 mb-4 text-center md:text-left">
              <h1 className="text-lg md:text-xl font-semibold">
                {profileUser?.username}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
                {profileUser?._id === currentUser?._id ? (
                  <button className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 rounded-b-md font-semibold text-sm md:text-base">
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
                    className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 rounded-b-md font-semibold text-sm md:text-base"
                  >
                    Logout
                  </button>
                ) : (
                  <button className="bg-linear-to-r from-indigo-500 to-pink-500 py-1 px-4 rounded-b-md font-semibold text-sm md:text-base">
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
            <div className="mt-5">
              <h2 className="font-semibold">{profileUser?.username}</h2>
              <p className="text-sm text-gray-400">
                {profileUser?.bio ||
                  `Hii guys this is ${profileUser?.username}`}
              </p>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-4">
          {renderGridContent()}
        </div>
      </main>
    </div>
  );
};

export default Profile;
