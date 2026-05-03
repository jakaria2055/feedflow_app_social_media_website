import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReels } from "../redux/slices/reelSlice";
import Sidebar from "../components/Sidebar";
import {
  MessageCircle,
  MessageCircleHeart,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
import ProfileImage from "../components/ProfileImage";
import FollowButton from "../components/FollowButton";
import LikeButton from "../components/LikeButton";
import Modal from "../components/Modal";
import CommentSection from "../components/CommentSection";
import CommentForm from "../components/CommentForm";

const Reels = () => {
  const { reels } = useSelector((state) => state.reels);
  const { user: currentUser } = useSelector((state) => state.user);
  const [copiedReelId, setCopiedReelId] = useState(null);

  console.log("Reels: ", reels);

  const dispatch = useDispatch();

  const videoRefs = useRef([]);
  const [playingStates, setPlayingStates] = useState({});
  const [showIconStates, setShowIconStates] = useState({});
  const [allMuted, setAllMuted] = useState(true);

  // Modal State
  const [selectedReel, setSelectedReel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReelComments, setSelectedReelComments] = useState([]);

  // Share function
  const handleShare = async (reelId) => {
    try {
      const shareableLink = `${window.location.origin}/reels/${reelId}`;
      await navigator.clipboard.writeText(shareableLink);

      // Show copied feedback
      setCopiedReelId(reelId);
      setTimeout(() => setCopiedReelId(null), 2000);

      // Optional: Show toast notification
      showToast("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link: ", error);
      alert("Failed to copy link. Please try again.");
    }
  };

  // Toast notification function
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up text-sm";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  useEffect(() => {
    if (selectedReel) {
      setSelectedReelComments(selectedReel?.comments || []);
    }
  }, [selectedReel]);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, reels.length);
  }, [reels]);

  //Intersection on Observer for autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const id = video.dataset.id;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setPlayingStates((prev) => ({ ...prev, [id]: true }));
          } else {
            video.pause();
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
          }
        });
      },
      { threshold: 0.8 },
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));

    return () => {
      videoRefs.current.forEach((v) => v && observer.unobserve(v));
    };
  }, [reels]);

  const handleVideoClick = (id) => {
    const video = videoRefs.current.find((v) => v.dataset.id === id);
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    setPlayingStates((prev) => ({ ...prev, [id]: !prev[id] }));
    setShowIconStates((prev) => ({ ...prev, [id]: !prev[id] }));
    setTimeout(
      () => setShowIconStates((prev) => ({ ...prev, [id]: false })),
      600,
    );
  };

  const handleMuteToggle = () => {
    const newMutedState = !allMuted;
    videoRefs.current.forEach((video) => {
      if (video) video.muted = newMutedState;
    });
    setAllMuted(newMutedState);
  };

  const handleOpenComments = (reel) => {
    setSelectedReel(reel);
    setSelectedReelComments(reel.comments || []);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReel(null);
    setSelectedReelComments([]);
  };

  useEffect(() => {
    dispatch(getAllReels());
  }, [dispatch]);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex text-white min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`transition-all duration-300 p-3 overflow-y-scroll snap-mandatory no-scrollbar flex-1 flex flex-col gap-2 ${
          collapsed ? "ml-2" : "ml-14 md:ml-64"
        }`}
      >
        {/* <main className="flex-1 w-full min-h-screen p-5 overflow-y-scroll snap-mandatory no-scrollbar"> */}
        {reels?.map((reel, index) => (
          <div
            key={reel?._id || index}
            className="relative w-full px-4 pt-5 max-w-2xl mx-auto h-[90vh] snap-start flex justify-center items-center bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl my-5 shadow-2xl shadow-black/30 border border-gray-800/30"
          >
            {/* Left Sight Content */}
            <div className="relative m-3 w-full h-full">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                data-id={reel?._id}
                loop
                muted={allMuted}
                playsInline
                className="relative w-full h-full object-cover rounded-xl shadow-lg"
                onClick={() => handleVideoClick(reel?._id)}
              >
                <source src={reel?.mediaUrl} type="video/mp4" />
              </video>

              {showIconStates[reel?._id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                  <button className="bg-black/60 backdrop-blur-sm p-4 rounded-full text-white text-6xl opacity-90 transition-all">
                    {playingStates[reel?._id] ? (
                      <Pause size={30} className="text-white" />
                    ) : (
                      <Play size={30} className="text-white" />
                    )}
                  </button>
                </div>
              )}

              {/* Global Mute Toggle */}
              <button
                onClick={handleMuteToggle}
                className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-2.5 rounded-full transition-all duration-200 hover:scale-105"
              >
                {allMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              {/* Caption + User */}
              <div className="absolute bottom-0 left-4 right-4 text-white text-sm bg-gradient-to-t from-black/80 to-transparent p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <ProfileImage user={reel?.user} username />
                  <FollowButton
                    targetUserId={reel?.user?._id}
                    currentUser={currentUser}
                    type="reel"
                  />
                </div>
                {reel?.caption && (
                  <p className="mt-2 text-sm leading-relaxed">
                    <span className="font-bold text-white">
                      {reel?.user?.username}
                    </span>
                    <span className="ml-2 text-gray-200">{reel?.caption}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Side Like Button */}
            <div className="absolute right-0 bottom-20 flex flex-col space-y-5 text-white">
              <div className="relative group">
                <LikeButton type="reel" item={reel} />
                {reel?.likes.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs font-medium bg-gradient-to-r from-[#E1306C] to-[#F77737] text-white rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                    {reel?.likes.length || 0}
                  </span>
                )}
              </div>
              <button className="relative group">
                <MessageCircleHeart
                  size={26}
                  onClick={() => handleOpenComments(reel)}
                  className="hover:text-[#E1306C] transition-colors duration-200"
                />
                {reel?.comments.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs font-medium bg-gradient-to-r from-[#E1306C] to-[#F77737] text-white rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                    {reel?.comments.length || 0}
                  </span>
                )}
              </button>
              {/* Share Button with Copy Functionality */}
              <button
                onClick={() => handleShare(reel?._id)}
                className="relative group hover:text-[#E1306C] transition-colors duration-200"
              >
                {copiedReelId === reel?._id ? (
                  <Check size={26} className="text-green-500" />
                ) : (
                  <Share2 size={26} />
                )}
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Comments Modal */}
      {isModalOpen && selectedReel && (
        <Modal
          openModal={() => setIsModalOpen(true)}
          onClose={handleCloseModal}
          initialWidth="max-w-2xl"
          initialHeight="h-auto"
          showCloseBtn
        >
          <div className="flex flex-col w-full h-[550px] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800/50">
            <div className="flex shrink-0 p-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-900/80">
              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <ProfileImage user={selectedReel?.user} />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {selectedReel?.user?.username}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {selectedReelComments?.length || 0} comments
                  </p>
                </div>
              </div>
            </div>

            {/* Comment List Section */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
              <CommentSection comments={selectedReelComments} />
            </div>

            {/* Comment Form */}
            <div className="flex shrink-0 p-3 border-t border-gray-800/50 bg-gradient-to-t from-gray-900 to-gray-900/80">
              <CommentForm
                item={selectedReel}
                type="reel"
                currentUser={currentUser}
                setComments={setSelectedReelComments}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reels;
