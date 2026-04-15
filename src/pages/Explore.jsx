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
    if (!isDragging.current) return; // ✅ FIXED

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

    video.muted = !video.muted; // ✅ FIXED
    setIsMuted(video.muted);
  };

  return (
    <div className="bg-black flex text-white w-full min-h-screen">
      <Sidebar />

      <main className="flex-1 p-5 flex flex-col overflow-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="max-w-full">
            {/* Suggested Users */}
            <div className="relative mb-6">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-700 p-2 rounded-full z-10 ${
                  !canScrollLeft && "opacity-30"
                }`}
              >
                <ArrowLeftFromLine size={20} />
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-700 p-2 rounded-full z-10 ${
                  !canScrollRight && "opacity-30"
                }`}
              >
                <ArrowRightFromLine size={20} />
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
                className="flex gap-4 px-4 py-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
              >
                {suggestedUsers?.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700 min-w-20"
                  >
                    <ProfileImage user={user} />
                    <span className="text-sm">{user.username}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div>
              <h2 className="text-lg font-semibold mb-5">
                Trending Posts...
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts?.map((post, i) => (
                  <div
                    key={post._id}
                    onClick={() => openModal(i, posts)}
                    className="relative h-56 rounded-lg overflow-hidden group cursor-pointer"
                  >
                    {post.mediaType === "image" ? (
                      <img
                        src={post.mediaUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        loop
                        muted
                        className="w-full h-full object-cover"
                      >
                        <source src={post.mediaUrl} />
                      </video>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 opacity-0 group-hover:opacity-100 p-2 flex justify-between">
                      <div className="flex items-center gap-1">
                        <LikeButton item={post} />
                        {post.likes.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        {post.comments.length}
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
      <Modal openModal={isModalOpen} onClose={handleCloseModal}>
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