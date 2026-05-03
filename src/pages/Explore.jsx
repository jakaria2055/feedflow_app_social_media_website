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
import ProfileViewer from "../components/ProfileViewer";
import Modal from "../components/Modal";

const Explore = () => {
  const {
    user: currentUser,
    suggestedUsers,
    loading,
  } = useSelector((state) => state.user);

  const { posts } = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  // Scroll states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Drag refs
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Scroll buttons
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth / 2;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;

    scrollRef.current.classList.add("cursor-grabbing");
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    checkScroll();
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;

    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    checkScroll();
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Init
  useEffect(() => {
    dispatch(fetchSuggestedUsers());
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    checkScroll();

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (container) container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  const modalVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const openModal = (index, contentArray) => {
    setModalContent(contentArray);
    setModalIndex(index);
    setIsModalOpen(true);
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
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex text-white  min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`transition-all duration-300 p-2 overflow-auto flex flex-col gap-2 ${
          collapsed ? "ml-8" : "ml-14 md:ml-64"
        }`}
      >
        {/* <main className=" p-6 flex flex-col overflow-auto ml-5"> */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#E1306C] border-r-2 border-r-transparent"></div>
          </div>
        ) : (
          <div className="max-w-full">
            {/* Suggested Users Section */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Suggested for you
                </h2>
              </div>

              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 p-2.5 rounded-full z-10 transition-all duration-200 ${
                  !canScrollLeft
                    ? "opacity-30 cursor-not-allowed"
                    : "opacity-100"
                }`}
              >
                <ArrowLeftFromLine size={18} />
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 p-2.5 rounded-full z-10 transition-all duration-200 ${
                  !canScrollRight
                    ? "opacity-30 cursor-not-allowed"
                    : "opacity-100"
                }`}
              >
                <ArrowRightFromLine size={18} />
              </button>

              <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="flex gap-4 px-10 py-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
              >
                {suggestedUsers?.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gradient-to-br hover:from-gray-800/50 hover:to-gray-900/50 transition-all duration-300 min-w-20 group"
                  >
                    <div className="transform transition-transform duration-300 group-hover:scale-105">
                      <ProfileImage user={user} />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {user.username}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Posts Section */}
            <div>
              <h2 className="text-lg font-semibold mb-5 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Trending Posts
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {posts?.map((post, i) => (
                  <div
                    key={post._id}
                    onClick={() => openModal(i, posts)}
                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer bg-gray-800/30 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
                  >
                    {post.mediaType === "image" ? (
                      <img
                        src={post.mediaUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="post"
                      />
                    ) : post.mediaType === "video" ? (
                      <video
                        loop
                        muted
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      >
                        <source src={post.mediaUrl} />
                      </video>
                    ) : (
                      // Text Post
                      <div className="px-6 py-10">
                        <div className="rounded-2xl overflow-y-auto mr-2 max-h-[50vh] custom-scrollbar">
                          <p className="text-gray-100 text-xs leading-relaxed whitespace-pre-wrap break-words text-center">
                            {post?.caption}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between">
                        <div className="flex items-center gap-2">
                          <LikeButton item={post} />
                          <span className="text-white text-sm font-medium">
                            {post.likes.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle size={18} className="text-white" />
                          <span className="text-white text-sm font-medium">
                            {post.comments.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal
        openModal={isModalOpen}
        onClose={handleCloseModal}
        initialWidth="max-w-6xl"
      >
        <ProfileViewer
          handleModalVideoClick={handleModalVideoClick}
          handleModalMuteToggle={handleModalMuteToggle}
          modalVideoRef={modalVideoRef}
          showIcon={showIcon}
          isMuted={isMuted}
          isPlaying={isPlaying}
          content={modalContent}
          startIndex={modalIndex}
          currentUser={currentUser}
          type="post"
        />
      </Modal>
    </div>
  );
};

export default Explore;
