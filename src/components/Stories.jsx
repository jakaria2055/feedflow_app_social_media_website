import {
  ArrowLeft,
  ArrowRight,
  Eye,
  HandHeart,
  MessageCircleHeart,
  Pause,
  Play,
  Plus,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateMedia from "./CreateMedia.jsx";
import Modal from "./Modal.jsx";
import { getAllStories } from "../redux/slices/storiesSlice.js";
import { axiosInstance } from "../lib/axios.js";
import ProfileImage from "./ProfileImage.jsx";
import CommentSection from "./CommentSection.jsx";
import { timeAgo } from "../lib/timeAgo.js";
import LikeButton from "./LikeButton.jsx";

const Stories = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const { stories } = useSelector((state) => state.stories);
  console.log("currentUser: ", currentUser);
  console.log("Stories: ", stories);

  const dispatch = useDispatch();

  const storiesModalRef = useRef(null);
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const commentsModalRef = useRef(null);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [newComment, setNewComment] = useState("");

  //MODAL
  const [isCreateStoryModal, setIsCreateStoryModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showCommentsModal, setShowCommentModal] = useState(false);
  const [showViewStoryModal, setShowViewStoryModal] = useState(false);

  const currentUserStories = stories[currentUserIndex]?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];
  const currentStoryUser = stories[currentUserIndex]?.user;

  const isLastStoryOfLastUser =
    currentUserIndex === stories.length - 1 &&
    currentStoryIndex === currentUserStories.length - 1;

  const handlePlayPause = () => {
    if (currentStory?.mediaType === "video") {
      const video = videoRef.current;
      if (video) {
        if (video.paused) {
          video.play().catch((error) => {
            console.log("Video play failed: ", error);
            setIsPlaying(false);
          });
        } else {
          video.pause();
        }
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleMediaVolume = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (currentStory?.mediaType === "video") {
      const video = videoRef.current;
      if (video) {
        video.muted = newMutedState;
      }
    }
  };

  const getCurrentPlayState = () => {
    if (currentStory?.mediaType === "video") {
      const video = videoRef.current;
      return video ? !video.paused : isPlaying;
    }
    return isPlaying;
  };

  const currentPlayState = getCurrentPlayState();

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
      setIsPlaying(true);
    } else if (currentUserIndex > 0) {
      const previousUserStories = stories[currentUserIndex - 1]?.stories || [];
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(previousUserStories.length - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleNextStory = useCallback(() => {
    const activeUserStories = stories[currentUserIndex]?.stories || [];

    if (isLastStoryOfLastUser) {
      setTimeout(() => {
        setShowStoryModal(false);
      }, 300);
      return;
    }

    if (currentStoryIndex < activeUserStories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
      setIsPlaying(true);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [currentStoryIndex, currentUserIndex, stories, isLastStoryOfLastUser]);

  const handleUserClick = (index) => {
    setCurrentUserIndex(index);
    setShowStoryModal(true);
    setCurrentStoryIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleCreateStoryModal = () => {
    setIsCreateStoryModal(true);
  };

  const canGoPrevious = currentUserIndex > 0 || currentStoryIndex > 0;
  const canGoNext = !isLastStoryOfLastUser;

  //Main progress, Play/Pause
  useEffect(() => {
    if (!showStoryModal || !currentStory) return;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    if (currentStory.mediaType === "video") {
      const video = videoRef.current;
      if (!video) return;
      video.muted = isMuted;
      if (isPlaying) {
        video.play().catch((error) => {
          console.log("Video play error: ", error);
          setIsPlaying(false);
        });
      } else {
        video.pause();
      }
    } else if (currentStory.mediaType === "image" && isPlaying) {
      const imageDuration = 5000;
      const startTime = Date.now() - (progress / 100) * imageDuration;
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, (elapsed / imageDuration) * 100);
        setProgress(newProgress);
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
          handleNextStory();
        }
      }, 100);
    }
  }, [
    showStoryModal,
    currentStory,
    isPlaying,
    isMuted,
    handleNextStory,
    progress,
  ]);

  //VIDEO TIME UPDATE
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentStory?.mediaType !== "video") return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        const newProgress = (video.currentTime / video.duration) * 100;
        setProgress(newProgress);
      }
    };

    const handleEnded = () => {
      setProgress(100);
      setTimeout(() => {
        handleNextStory();
      }, 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentStory, handleNextStory]);

  //Reset ProgressBar of story
  useEffect(() => {
    if (!showStoryModal || !currentStory) return;
    setProgress(0);

    if (currentStory.mediaType === "video") {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
      }
    }
  }, [currentStory, showStoryModal]);

  //Auto close all stories after finished
  useEffect(() => {
    if (showStoryModal && isLastStoryOfLastUser && progress >= 100) {
      const timer = setTimeout(() => {
        setShowStoryModal(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLastStoryOfLastUser, showStoryModal, progress]);

  //Reset states when Model Close
  useEffect(() => {
    if (!showStoryModal) {
      setIsPlaying(false);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [showStoryModal]);

  const commentModal = () => {
    setShowCommentModal(true);
    setIsPlaying(false);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const addCommentToStory = async (storyId) => {
    try {
      if (!newComment.trim()) return;

      const { data } = await axiosInstance.post(`/story/${storyId}/comment`, {
        text: newComment,
      });
      if (data?.success) {
        setNewComment("");
        dispatch(getAllStories());
      }
    } catch (error) {
      console.log("Error on Add comment to story: ", error);
    }
  };

  //Whenever user click outside the box modal will be closed
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (
        storiesModalRef.current &&
        !storiesModalRef.current.contains(e.target)
      ) {
        setIsCreateStoryModal(false);
        setShowViewStoryModal(false);
        setShowCommentModal(false);
      }
    };
    if (showStoryModal) {
      document.addEventListener("mousedown", handleClickOutSide);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [showStoryModal]);

  useEffect(() => {
    if (showCommentsModal || showViewStoryModal) {
      if (currentStory?.mediaType === "video") {
        const video = videoRef.current;
        if (video) {
          video?.pause();
        }
      }
    } else {
      if (isPlaying) {
        if (currentStory?.mediaType === "video") {
          const video = videoRef.current;
          if (video) {
            video?.play().catch((error) => {
              console.log("Video Resume Failed: ", error);
            });
          }
        }
      }
    }
  }, [
    showCommentsModal,
    currentStory?.mediaType,
    isPlaying,
    showViewStoryModal,
  ]);

  useEffect(() => {
    dispatch(getAllStories());
  }, [dispatch]);

  const handleStoreView = async (storyId) => {
    try {
      await axiosInstance.get(`/story/${storyId}/view`);
    } catch (error) {
      console.log("Story Viewing Error: ", error);
    }
  };

  return (
    <div className="flex items-center overflow-x-auto p-3 space-x-4 no-scrollbar bg-gradient-to-r from-gray-900/40 to-black/40 rounded-xl">
      {/* Create Story Button  */}
      <div
        onClick={handleCreateStoryModal}
        className="shrink-0 flex flex-col items-center cursor-pointer group"
      >
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#833AB4] to-[#E1306C] p-[2px] shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-all duration-300">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
            {currentUser?.profileImage ? (
              <img
                src={
                  currentUser?.profileImage ||
                  `https://placehold.co/150x150/000000/FFFFFF?text=${currentUser?.username?.charAt(0).toUpperCase()}`
                }
                alt="profile"
                className="w-full rounded-full h-full object-cover"
              />
            ) : (
              <img
                src={`https://placehold.co/150x150/000000/FFFFFF?text=${currentUser?.username?.charAt(0).toUpperCase()}`}
                alt="profile"
                className="w-full rounded-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-[#833AB4] to-[#E1306C] p-1 shadow-lg">
            <Plus size={14} className="w-4 h-4 text-white" />
          </div>
        </div>
        <span className="mt-2 text-xs text-gray-300 truncate w-20 text-center font-medium">
          Create Story
        </span>
      </div>

      {/* Stories List */}
      <div className="flex space-x-4 py-1 overflow-x-auto no-scrollbar">
        {stories?.map((userStories, index) => (
          <div
            key={userStories?.user?._id}
            onClick={() => handleUserClick(index)}
            className="flex flex-col items-center cursor-pointer shrink-0 group"
          >
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] group-hover:scale-105 transition-all duration-300">
              <img
                src={
                  userStories?.user?.profileImage ||
                  `https://placehold.co/150x150/000000/FFFFFF?text=${userStories?.user?.username?.charAt(0).toUpperCase()}`
                }
                alt={userStories?.user?.username}
                className="w-14 h-14 rounded-full border-2 border-gray-900 object-cover"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <span className="mt-2 text-xs text-gray-300 truncate w-20 text-center font-medium">
              {userStories?.user?._id === currentUser?._id
                ? "Your Story"
                : userStories?.user?.username}
            </span>
          </div>
        ))}
      </div>

      {/* Create Story Modal */}
      <Modal
        openModal={isCreateStoryModal}
        onClose={() => setIsCreateStoryModal(false)}
        initialWidth="max-w-2xl"
        initialHeight="h-auto"
      >
        <div ref={storiesModalRef} className="w-full max-w-2xl">
          <CreateMedia
            type="story"
            onClose={() => setIsCreateStoryModal(false)}
          />
        </div>
      </Modal>

      {/* View Story Modal */}
      <Modal
        openModal={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        showCloseBtn={false}
      >
        <div
          ref={storiesModalRef}
          className="w-full h-full relative flex items-center justify-center bg-black"
        >
          {/* Progress Bars - Enhanced */}
          <div className="absolute top-0 left-0 right-0 z-20 flex space-x-1 p-3">
            {currentUserStories?.map((story, index) => (
              <div
                key={story?._id}
                className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] transition-all duration-300 ease-out rounded-full"
                  style={{
                    width:
                      index === currentStoryIndex
                        ? `${progress}%`
                        : index < currentStoryIndex
                          ? "100%"
                          : "0%",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* HEADER */}
          <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4">
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
              <ProfileImage user={currentStoryUser} className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">
                  {currentStoryUser?.username}
                </span>
                <span className="text-gray-300 text-xs">
                  {timeAgo(currentStory?.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="text-white hover:opacity-80 transition-all duration-200 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70"
              >
                {currentPlayState ? <Pause size={18} /> : <Play size={18} />}
              </button>
              {currentStory?.mediaType === "video" && (
                <button
                  onClick={handleMediaVolume}
                  className="text-white hover:opacity-80 transition-all duration-200 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              )}

              {currentStoryUser?._id === currentUser?._id && (
                <button
                  onClick={() => setShowViewStoryModal(true)}
                  className="text-white hover:opacity-80 transition-all duration-200 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70"
                >
                  <Eye size={18} />
                </button>
              )}
              <button
                onClick={() => setShowStoryModal(false)}
                className="text-white hover:opacity-80 transition-all duration-200 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* STORY CONTENT */}
          <div className="flex items-center justify-center h-full w-full pt-16 pb-24">
            {currentStory?.mediaType === "image" ? (
              <img
                src={currentStory?.mediaUrl}
                alt="story"
                onLoad={() => handleStoreView(currentStory?._id)}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={currentStory?.mediaUrl}
                ref={videoRef}
                muted={isMuted}
                onLoadedData={() => handleStoreView(currentStory?._id)}
                playsInline
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="max-w-full max-h-full object-contain rounded-lg"
              ></video>
            )}
          </div>

          {/* Caption  */}
          {currentStory?.caption && (
            <div className="absolute bottom-24 left-0 right-0 px-4">
              <p className="text-white text-center text-sm bg-black/60 backdrop-blur-md rounded-xl p-3 mx-auto max-w-md border border-white/10">
                {currentStory?.caption}
              </p>
            </div>
          )}

          {/* NAVIGATOR  */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
            <button
              onClick={handlePreviousStory}
              disabled={!canGoPrevious}
              className={`w-1/4 h-full flex items-center justify-start pointer-events-auto transition-all duration-300 ${
                canGoPrevious
                  ? "opacity-0 hover:opacity-100"
                  : "opacity-0 cursor-default"
              }`}
            >
              <div className="bg-black/50 backdrop-blur-md rounded-full p-3 ml-2 hover:bg-black/70 transition-all duration-200">
                <ArrowLeft className="text-white" size={20} />
              </div>
            </button>
            <button
              onClick={handleNextStory}
              disabled={!canGoNext}
              className={`w-3/4 h-full flex items-center justify-end pointer-events-auto transition-all duration-300 ${
                canGoNext
                  ? "opacity-0 hover:opacity-100"
                  : "opacity-0 cursor-default"
              }`}
            >
              <div className="bg-black/50 backdrop-blur-md rounded-full p-3 mr-2 hover:bg-black/70 transition-all duration-200">
                <ArrowRight className="text-white" size={20} />
              </div>
            </button>
          </div>

          {/* Button Control */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4 px-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center space-x-6">
                <div className="relative flex flex-col items-center">
                  <LikeButton type="story" item={currentStory} />
                  {currentStory?.likes.length > 0 && (
                    <span className="absolute -top-3 -right-3 text-xs text-white font-medium bg-gradient-to-r from-[#E1306C] to-[#F77737] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                      {currentStory.likes.length || 0}
                    </span>
                  )}
                </div>

                <button
                  onClick={commentModal}
                  className="relative flex flex-col items-center group"
                >
                  <MessageCircleHeart
                    size={22}
                    className="text-white hover:scale-110 transition-transform duration-200"
                  />
                  {currentStory?.comments.length > 0 && (
                    <span className="absolute -top-3 -right-3 text-xs text-white font-medium bg-gradient-to-r from-[#E1306C] to-[#F77737] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                      {currentStory.comments.length || 0}
                    </span>
                  )}
                </button>
              </div>

              {/* Reply Section */}
              <div className="flex-1 max-w-xs ml-4">
                <div className="relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addCommentToStory(currentStory?._id);
                      }
                    }}
                    placeholder="Send message..."
                    className="w-full px-4 py-2 pr-10 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E1306C] backdrop-blur-sm text-sm border border-white/20 transition-all duration-200"
                  />
                  <button
                    onClick={() => addCommentToStory(currentStory?._id)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Modal */}
          {showCommentsModal && (
            <div
              className="fixed inset-0 w-full z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => {
                setShowCommentModal(false);
              }}
            >
              <div
                ref={commentsModalRef}
                className="bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-2xl w-full max-w-lg max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    Comments ({currentStory?.comments?.length || 0})
                  </h3>
                  <button
                    onClick={() => setShowCommentModal(false)}
                    className="p-1 text-gray-400 hover:text-white rounded-full transition-all duration-200 hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Comment List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                  <CommentSection comments={currentStory?.comments} />
                </div>

                {/* Reply Section */}
                <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                  <div className="relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addCommentToStory(currentStory?._id);
                        }
                      }}
                      placeholder="Write a comment..."
                      className="w-full px-4 py-2 pr-10 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E1306C] text-sm transition-all duration-200"
                    />
                    <button
                      onClick={() => addCommentToStory(currentStory?._id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#E1306C] hover:text-[#F77737] transition-all duration-200 hover:scale-110"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Story Modal */}
          {showViewStoryModal && currentStory && (
            <div
              className="fixed inset-0 w-full z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => {
                setShowViewStoryModal(false);
              }}
            >
              <div
                className="bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-2xl w-full max-w-lg max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    Viewers ({currentStory?.viewers?.length || 0})
                  </h3>
                  <button
                    onClick={() => setShowViewStoryModal(false)}
                    className="p-1 text-gray-400 hover:text-white rounded-full transition-all duration-200 hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Viewers List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {currentStory?.viewers?.map((u) => (
                    <div
                      key={u?._id}
                      className="hover:bg-white/5 rounded-lg transition-all duration-200 p-2"
                    >
                      <ProfileImage user={u} username />
                    </div>
                  ))}
                  {(!currentStory?.viewers ||
                    currentStory.viewers.length === 0) && (
                    <div className="text-center text-gray-400 py-8">
                      No viewers yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Stories;
