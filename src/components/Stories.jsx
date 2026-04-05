import { Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios.js";
import CreateMedia from "./CreateMedia.jsx";

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

  const currentUserStories = stories[currentStoryIndex]?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];
  const currentStoryUser = stories[currentStoryIndex]?.user;

  const isLastStoryOfLastUser =
    currentStoryIndex === stories.length - 1 &&
    currentStoryIndex === currentUserStories.length - 1;

  const handleUserClick = (index) => {
    setCurrentUserIndex(index);
    setShowStoryModal(true);
    setCurrentStoryIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

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

  const handleCreateStoryModal = () => {};

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

      <div className="flex space-x-4 overflow-x-auto no-scrollbar">
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

      <div className="w-full max-w-2xl">
        <CreateMedia />
      </div>
    </div>
  );
};

export default Stories;
