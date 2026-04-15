import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestedUsers } from "../redux/slices/userSlices";
import Sidebar from "../components/Sidebar";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProfileImage from "../components/ProfileImage";
import { getAllPosts } from "../redux/slices/postSlice";
import LikeButton from "../components/LikeButton";

const Explore = () => {
  const {
    user: currentUser,
    suggestedUsers,
    loading,
    error,
  } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef(null);

  const scroll = () => {};
  const openModal = () => {};

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <div className="bg-black flex bg-opacity-95 text-white w-full min-h-screen">
      <Sidebar />

      <main className="flex-1 p-5 w-full flex flex-col overflow-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="max-w-full">
            {/* SUggested Users */}
            <div className="relative mb-6">
              {/* Left Scroll Button */}
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-700 text-white p-2 rounded-full z-10 md:p-3 transition-opacity ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <ArrowLeftFromLine size={20} />
              </button>

              {/* Right Scroll Button */}
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-700 text-white p-2 rounded-full z-10 md:p-3 transition-opacity ${!canScrollRight ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <ArrowRightFromLine size={20} />
              </button>

              {/* Scrollbar User List */}
              <div
                ref={scrollRef}
                className="flex gap-4 px-4 md:px-8 py-2 overflow-x-auto no-scrollbar cursor-grab"
              >
                {suggestedUsers.length === 0 ? (
                  <p className="text-gray-800">No users Found!</p>
                ) : (
                  suggestedUsers.map((user) => (
                    <Link
                      key={user?._id}
                      to={`/profile/${user?._id}`}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition min-w-20 md:min-w-25"
                    >
                      <ProfileImage
                        user={user}
                        className={
                          "h-12 w-12 md:w-14 md:h-14 bg-linear-to-r from-pink-500/50 to-purple-500/50 shadow-pink-500/30"
                        }
                      />
                      <span className="text-sm md:text-base text-white text-center truncate">
                        {user?.username}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Suggested Post Grid */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-5">
                Trending Posts...
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts?.map((post, i) => (
                  <div
                    key={post?._id}
                    onClick={() => openModal(i, post)}
                    className="relative h-56 rounded-lg overflow-hidden group cursor-pointer w-full"
                  >
                    {post?.mediaType === "image" ? (
                      <img
                        src={post?.mediaUrl}
                        alt={post?.caption || "image"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        loop
                        playsInline
                        muted
                        className="w-full h-full object-cover  rounded-lg group-hover:scale-105 transition-transform"
                      >
                        <source src={post?.mediaUrl} type="video/mp4" />
                      </video>
                    )}

                    {/* OverLay */}
                    <div className="absolute px-4 bottom-0 left-0 right-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 py-2 flex items-center justify-between">
                    
                        <div className="flex items-center gap-1 text-white">
                          <LikeButton
                            type={"post"}
                            size={24}
                            item={post}
                          />
                          <span className="text-sm">{post?.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white">
                          <MessageCircle size={18} strokeWidth={2} />
                          <span>{post?.comments?.length || 0}</span>
                        </div>
                    
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
