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
} from "lucide-react";
import ProfileImage from "../components/ProfileImage";
import FollowButton from "../components/FollowButton";
import LikeButton from "../components/LikeButton";
import Modal from "../components/Modal";
import CommentSection from "../components/CommentSection";

const Reels = () => {
  const { reels } = useSelector((state) => state.reels);
  const { user: currentUser } = useSelector((state) => state.user);

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

  return (
    <div className=" backdrop-blur-xl bg-black  flex text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 w-full min-h-screen p-5 overflow-y-scroll snap-mandatory no-scrollbar">
        {reels?.map((reel, index) => (
          <div
            key={reel?._id || index}
            className="relative w-full px-8 pt-5 max-w-sm mx-auto h-[90vh] snap-start flex justify-center items-center bg-black rounded-md my-5"
          >
            {/* Left Sight Content */}
            <div className="relative m-3 w-full h-full">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                data-id={reel?._id}
                loop
                muted={allMuted}
                playsInline
                className="relative w-full h-full object-cover rounded-md shadow-sm"
                onClick={() => handleVideoClick(reel?._id)}
              >
                <source src={reel?.mediaUrl} type="video/mp4" />
              </video>

              {showIconStates[reel?._id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                  <button className="bg-gray-500/50 p-4 rounded-full text-white text-6xl opacity-80">
                    {playingStates[reel?._id] ? (
                      <Pause size={30} />
                    ) : (
                      <Play size={30} />
                    )}
                  </button>
                </div>
              )}

              {/* Global Mute Toggle */}
              <button
                onClick={handleMuteToggle}
                className="absolute top-6 right-6 bg-gray-500/50 p-2 rounded-full"
              >
                {allMuted ? <VolumeX /> : <Volume2 />}
              </button>

              {/* Caption + User */}
              <div className="absolute bottom-0 left-4 max-w-sm text-white text-sm">
                <div className="flex items-center gap-2">
                  <ProfileImage user={reel?.user} username />
                  <FollowButton
                    targetUserId={reel?.user?._id}
                    currentUser={currentUser}
                    type="reel"
                  />
                </div>
                {reel?.caption && (
                  <p className="mt-3">
                    <span className="font-bold">{reel?.user?.username}</span>
                    <span className="ml-2">{reel?.caption}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Side Like Button */}
            <div className="absolute -right-2 bottom-0 flex flex-col space-y-4 text-white">
              <div className="relative">
                <LikeButton type="reel" item={reel} />
                {reel?.likes.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-sm bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {reel?.likes.length || 0}
                  </span>
                )}
              </div>
              <button className="relative">
                <MessageCircleHeart
                  size={26}
                  onClick={() => handleOpenComments(reel)}
                  className="hover:text-gray-300 relative"
                />
                {reel?.comments.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-sm bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {reel?.comments.length || 0}
                  </span>
                )}
              </button>
              <button className="hover:text-gray-300">
                <Share2 size={26} />
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
        >
          <div className="flex flex-col w-full h-[500px] bg-black/50 rounded-lg">
            <div className="flex shrink-0 p-3 border-b border-gray-700">
              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <ProfileImage user={selectedReel?.user} />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedReel?.user?.username}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Comments ({selectedReelComments?.length || 0})
                  </p>
                </div>
              </div>
            </div>

            {/* Comment List Section */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              <CommentSection comments={selectedReelComments} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reels;
