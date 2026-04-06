import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Pause,
  Play,
  Plus,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios.js";
import CreateMedia from "./CreateMedia.jsx";
import Modal from "./Modal.jsx";

const Stories = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  console.log("currentUser: ", currentUser);
  const [stories, setStories] = useState([]);

  const createModalRef = useRef(null);
  const storiesModalRef = useRef(null);
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  //MODAL
  const [isCreateStoryModal, setIsCreateStoryModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showCommentsModal, setShowCommentModal] = useState(false);
  const [showViewStoryModal, setShowViewStoryModal] = useState(false);

  const currentUserStories = stories[currentUserIndex]?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];
  const currentStoryUser = stories[currentUserIndex]?.user;

  const isLastStoryOfLastUser =
    currentStoryIndex === stories.length - 1 &&
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
      const previousUserStories = stories[currentStoryIndex - 1]?.stories || [];
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(previousUserStories.length - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleNextStory = useCallback(() => {
    const currentUserStories = stories[currentStoryIndex - 1]?.stories || [];
    if (isLastStoryOfLastUser) {
      setTimeout(() => {
        setShowStoryModal(false);
      }, 300);
      return;
    }
    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      setIsPlaying(true);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [
    currentStoryIndex,
    stories,
    isLastStoryOfLastUser,
    setShowStoryModal,
    setCurrentStoryIndex,
    setProgress,
    setIsPlaying,
  ]);

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

  const handleStoreView = () => {};

  const canGoPrevious = currentUserIndex > 0 || currentStoryIndex > 0;
  const canGoNext = !isLastStoryOfLastUser;

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

  const getAllStories = async () => {
    try {
      const { data } = await axiosInstance.get("/story/all");
      setStories(data.stories);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    getAllStories();
  }, []);

  return (
    <div className="flex items-center overflow-x-auto p-2 space-x-4 no-scrollbar">
      <div
        onClick={handleCreateStoryModal}
        className="shrink-0 flex flex-col items-center cursor-pointer"
      >
        <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-linear-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/30">
          {currentUser?.profileImage ? (
            <img
              src={currentUser?.profileImage}
              alt="profile"
              className="w-full rounded-full h-full object-cover z-0"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-800 z-0">
              <Plus size={18} className="text-center text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 rounded-full  bg-white shadow-lg p-1">
            <Plus size={18} className="w-5 h-5 text-center text-gray-800" />
          </div>
        </div>
        <span className="mt-2 text-xs text-gray-400 truncate w-20 text-center">
          Create Story
        </span>
      </div>

      <div className="flex space-x-4 py-1.5 overflow-x-auto no-scrollbar">
        {stories?.map((userStories, index) => (
          <div
            key={userStories?.user?._id}
            onClick={() => handleUserClick(index)}
            className="flex flex-col items-center cursor-pointer shrink-0"
          >
            <div
              className={`p-0.5 rounded-full mb-2 transition-all duration-200 ${index === currentUserIndex ? "ring-2 ring-blue-500 ring-offset-2 scale-105" : "hover:scale-105"}`}
            >
              <img
                src={userStories?.user?.profileImage || "/default-avatar-png"}
                alt={userStories?.user?.username}
                className="w-14 h-14 rounded-full border-2 border-white object-cover"
              />
            </div>
            <span className="mt-2 text-xs text-gray-400 truncate w-20 text-center">
              {userStories?.user?._id === currentUser?._id
                ? "Your Story"
                : userStories?.user?.username}
            </span>
          </div>
        ))}
      </div>

      <Modal open={isCreateStoryModal} onOpenChange={setIsCreateStoryModal}>
        <div className="w-full max-w-2xl">
          <CreateMedia />
        </div>
      </Modal>

      <Modal open={showStoryModal} onOpenChange={setShowStoryModal}>
        <div className="w-full h-full relative flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 z-10 flex space-x-1 p-3">
            {currentUserStories?.map((story, index) => (
              <div
                key={story?._id}
                className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-300 ease-out"
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
          <div className="absolute top-8 left-0 right-0 z-10 flex justify-between items-center px-4">
            <div className="flex items-center space-x-3">
              <img
                src={currentStoryUser?.profileImage || ""}
                alt=""
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              {/* <ProfileImage user={currentStoryUser} /> */}
              <div className="flex flex-col">
                <span className="text-gray-200 font-semibold text-sm">
                  {currentStoryUser?.username}
                </span>
                <span className="text-gray-300 text-xs">
                  12hrs ago
                  {/* {timeAgo(currentStory?.createdAt)} */}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayPause}
                className="text-white hover:opacity-80 transition-opacity p-2 bg-black/50 rounded-full"
              >
                {currentPlayState ? <Pause size={20} /> : <Play size={20} />}
              </button>
              {currentStory?.mediaType === "video" && (
                <button
                  onClick={handleMediaVolume}
                  className="text-white hover:opacity-80 transition-opacity p-2 bg-black/50 rounded-full"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              )}

              {currentStoryUser?._id === currentUser?._id && (
                <button
                  onClick={handleMediaVolume}
                  className="text-white hover:opacity-80 transition-opacity p-2 bg-black/50 rounded-full"
                >
                  <Eye size={20} />
                </button>
              )}
              <button
                onClick={() => setShowStoryModal(false)}
                className="text-white hover:opacity-80 transition-opacity p-2 bg-black/50 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* STORY CONTENT */}
          <div className="flex items-center justify-center h-full pt-12 pb-20">
            {currentStory?.mediaType === "image" ? (
              <img
                src={currentStory?.mediaUrl}
                alt="story"
                onLoad={() => handleStoreView(currentStory?._id)}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={currentStory?.mediaUrl}
                ref={videoRef}
                muted={isMuted}
                onLoadedData={() => handleStoreView(currentStory?._id)}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="max-w-full max-h-full object-contain"
              ></video>
            )}
          </div>

          {currentStory?.caption && (
            <div className="absolute bottom-20 left-0 right-0 px-4">
              <p className="text-white text-center text-sm bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                {currentStory?.caption}
              </p>
            </div>
          )}

          {/* NAVIGATOR */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
            <button
              onClick={handlePreviousStory}
              disabled={!canGoPrevious}
              className={`w-1/3 h-full flex items-center justify-start pointer-events-auto transition-opacity ${canGoPrevious ? "opacity-0 hover:opacity-100" : "opacity-0 cursor-default"}`}
            >
              <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                <ArrowLeft className="text-white text-xl" />
              </div>
            </button>
            <button
              onClick={handleNextStory}
              disabled={!canGoNext}
              className={`w-1/3 h-full flex items-center justify-end pointer-events-auto transition-opacity ${canGoNext ? "opacity-0 hover:opacity-100" : "opacity-0 cursor-default"}`}
            >
              <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                <ArrowRight className="text-white text-xl" />
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Stories;
