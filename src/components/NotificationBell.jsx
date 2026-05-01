import {
  Bell,
  Check,
  Heart,
  MessageCircle,
  UserPlus,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { timeAgo } from "../lib/timeAgo";
import Modal from "./Modal";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import CommentSection from "./CommentSection";
import CommentForm from "./CommentForm";
import MediaIcon from "./MediaIcon";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const NotificationBell = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const dropDownRef = useRef(null);
  const modalVideoRef = useRef(null);

  const { notification } = useSelector((state) => state.user);

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  // Auto play modal video
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      const video = modalVideoRef.current;

      video.muted = isMuted;

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isModalOpen, isMuted]);

  // Fetch post by id
  const handleOpenPost = async (postId) => {
    try {
      const res = await axiosInstance.get(`/post/${postId}`);

      if (res.data.success) {
        const postData = res.data.post;

        setSelectedPost(postData);

        setComments(postData.comments || []);

        // close dropdown first
        setIsOpen(false);

        // then open modal
        setTimeout(() => {
          setIsModalOpen(true);
        }, 100);
      }
    } catch (error) {
      console.log("Error fetching post:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Video Play Pause
  const handleModalVideoClick = () => {
    if (!modalVideoRef.current) return;

    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      setIsPlaying(true);
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }

    setShowIcon(true);

    setTimeout(() => setShowIcon(false), 600);
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsPlaying(true);
    }
  }, [isModalOpen]);

  // Mute Unmute
  const handleModalMuteToggle = () => {
    if (!modalVideoRef.current) return;

    modalVideoRef.current.muted = !modalVideoRef.current.muted;

    setIsMuted(modalVideoRef.current.muted);
  };

  // Notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={16} className="text-pink-500 fill-pink-500" />;

      case "follow":
        return <UserPlus size={16} className="text-blue-500" />;

      case "comment":
        return <MessageCircle size={16} className="text-green-500" />;

      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative flex items-center" ref={dropDownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications"
          className="
            relative flex items-center justify-center
            w-9 h-9 rounded-full
            hover:bg-white/10
            transition-all duration-200
            group
          "
        >
          <Bell
            size={20}
            className="text-gray-300 group-hover:text-[#E1306C] transition-all duration-200 group-hover:scale-110"
          />

          {notification?.length > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                bg-gradient-to-r from-[#E1306C] to-[#F77737]
                text-white text-[10px] font-semibold
                rounded-full min-w-[18px] h-[18px]
                flex items-center justify-center
                shadow-lg shadow-pink-500/30
                animate-pulse
              "
            >
              {notification?.length > 9 ? "9+" : notification?.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="
              absolute top-10 left-0 sm:left-auto sm:-right-80
              w-[92vw] sm:w-80 max-w-[360px]
              bg-gradient-to-b from-gray-800 to-gray-900
              shadow-2xl rounded-xl
              border border-gray-700/50
              z-50 max-h-[75vh] overflow-y-auto
              animate-in fade-in slide-in-from-top-2 duration-200
            "
          >
            {/* Header */}
            <div
              className="
                p-3 border-b border-gray-700/50
                flex justify-between items-center
                bg-gray-800/50 rounded-t-xl sticky top-0 z-10
              "
            >
              <h3 className="font-semibold text-white text-sm">
                Notifications
              </h3>

              <button
                className="
                  text-xs text-[#E1306C]
                  hover:text-[#F77737]
                  flex items-center gap-1
                  transition-all duration-200
                  hover:scale-105
                "
              >
                <Check size={12} />
                Mark all as read
              </button>
            </div>

            {/* Empty */}
            {notification?.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No Notifications Yet</p>
                <p className="text-gray-500 text-xs mt-1">
                  When someone interacts with you, it'll show up here
                </p>
              </div>
            ) : (
              notification?.slice(0, 10).map((notify, index) => (
                <div
                  key={`${notify.userId}-${index}`}
                  className={`
                    p-3 border-b border-gray-700/30
                    cursor-pointer transition-all duration-200
                    hover:bg-gray-800/50
                    ${
                      notify.read
                        ? "bg-gray-800/20 text-gray-400"
                        : "bg-gradient-to-r from-gray-800/40 to-gray-800/20 font-medium text-white"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon Container */}
                    <div className="flex shrink-0 mt-1 p-1.5 rounded-full bg-gray-800/50">
                      {getNotificationIcon(notify.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Message */}
                      <p className={`text-sm ${notify.read ? 'text-gray-400' : 'text-white'} break-words`}>
                        {notify?.message}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 mt-1.5">
                        {/* Profile */}
                        <Link
                          to={`/profile/${notify.userId}`}
                          className="
                              text-xs text-[#E1306C]
                              hover:text-[#F77737]
                              transition-colors duration-200
                            "
                        >
                          View Profile
                        </Link>

                        {/* Open Post */}
                        {notify?.postId && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleOpenPost(notify.postId);
                            }}
                            className="text-xs text-green-500 hover:text-green-400 transition-colors duration-200 font-medium"
                          >
                            See Post
                          </button>
                        )}
                      </div>

                      {/* Time */}
                      <p className="text-xs text-gray-500 mt-1">
                        {timeAgo(notify?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* POST MODAL */}
      <Modal
        showCloseBtn
        openModal={isModalOpen}
        onClose={handleCloseModal}
        initialWidth="max-w-5xl"
        initialHeight="h-[85vh]"
      >
        {selectedPost && (
          <div className="flex w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            {/* LEFT SIDE - Media */}
            <div className="relative flex items-center justify-center w-1/2 bg-black/50">
              {selectedPost?.mediaType === "image" ? (
                <img
                  src={selectedPost?.mediaUrl}
                  alt={selectedPost?.caption}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    src={selectedPost?.mediaUrl}
                    ref={modalVideoRef}
                    loop
                    autoPlay
                    muted={isMuted}
                    playsInline
                    onClick={handleModalVideoClick}
                    className="w-full h-full object-contain rounded-lg"
                  />

                  {/* Play Pause Overlay */}
                  {showIcon && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                      <div className="bg-black/60 backdrop-blur-sm p-3 rounded-full">
                        {isPlaying ? (
                          <Play size={24} className="text-white" />
                        ) : (
                          <Pause size={24} className="text-white" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mute Button */}
                  <button
                    onClick={handleModalMuteToggle}
                    className="
                      absolute bottom-4 right-4
                      bg-black/60 backdrop-blur-sm hover:bg-black/80
                      p-2 rounded-full transition-all duration-200 hover:scale-105
                    "
                  >
                    {isMuted ? (
                      <VolumeX size={18} className="text-white" />
                    ) : (
                      <Volume2 size={18} className="text-white" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE - Comments Section */}
            <div className="flex flex-col w-1/2 bg-gradient-to-b from-gray-900 to-black">
              {/* Header */}
              <div
                className="
                  flex items-center gap-3
                  p-3 border-b border-gray-800/50
                  bg-gradient-to-r from-gray-900 to-gray-900/80
                "
              >
                <ProfileImage user={selectedPost?.user} username />
                <FollowButton
                  targetUserId={selectedPost?.user?._id}
                  currentUser={currentUser}
                />
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <CommentSection comments={comments} />
              </div>

              {/* Bottom Section */}
              <div className="border-t border-gray-800/50 bg-gradient-to-t from-gray-900 to-gray-900/80">
                <div className="p-2">
                  <MediaIcon item={selectedPost} type="post" size={24} />
                </div>

                {/* Likes Count */}
                {selectedPost?.likes?.length > 0 && (
                  <div className="px-3 pb-2">
                    <p className="text-sm font-semibold text-gray-400">
                      {selectedPost?.likes?.length.toLocaleString()} likes
                    </p>
                  </div>
                )}

                {/* Comment Form */}
                <div className="p-3 border-t border-gray-800/50">
                  <CommentForm
                    item={selectedPost}
                    type="post"
                    currentUser={currentUser}
                    setComments={setComments}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NotificationBell;