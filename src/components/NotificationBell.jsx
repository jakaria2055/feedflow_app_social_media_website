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
      const res = await  axiosInstance.get(`/post/${postId}`);

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
  const getNotification = (type) => {
    switch (type) {
      case "like":
        return <Heart size={16} className="text-pink-500" />;

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
            hover:bg-blue-50
            transition-colors duration-200
            group
          "
        >
          <Bell
            size={20}
            className="text-white group-hover:text-blue-600 transition-colors"
          />

          {notification?.length > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                bg-gradient-to-r from-red-500 to-pink-500
                text-white text-[10px] font-semibold
                rounded-full w-5 h-5
                flex items-center justify-center
                shadow-md animate-pulse
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
              absolute top-10 left-0 sm:left-5 sm:right-0
              w-[92vw] sm:w-80 max-w-[360px]
              bg-white shadow-2xl rounded-xl
              border border-gray-200
              z-50 max-h-[75vh] overflow-y-auto
              animate-[fadeIn_0.25s_ease-out]
            "
          >
            {/* Header */}
            <div
              className="
                p-3 border-b border-gray-200
                flex justify-between items-center
                bg-gray-50 rounded-t-xl
              "
            >
              <h3 className="font-semibold text-gray-800">Notifications</h3>

              <button
                className="
                  text-sm text-blue-600
                  hover:text-blue-800
                  flex items-center gap-1
                  transition-colors
                "
              >
                <Check size={14} />
                Mark all as read
              </button>
            </div>

            {/* Empty */}
            {notification?.length === 0 ? (
              <div className="p-6 text-center text-gray-400 italic">
                🎉 No Notifications Yet
              </div>
            ) : (
              notification?.slice(0, 10).map((notify, index) => (
                <div
                  key={`${notify.userId}-${index}`}
                  className={`
                      p-3 border-b border-gray-100
                      cursor-pointer transition-all duration-200
                      hover:bg-blue-50
                      ${
                        notify.read
                          ? "bg-gray-50 text-gray-700"
                          : "bg-white font-medium text-gray-900"
                      }
                    `}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex shrink-0 mt-1">
                      {getNotification(notify.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Message */}
                      <p className="text-sm text-gray-800">{notify?.message}</p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 mt-1">
                        {/* Profile */}
                        <Link
                          to={`/profile/${notify.userId}`}
                          className="
                              text-xs text-blue-600
                              hover:underline
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
                            className="text-xs text-green-600 hover:underline font-medium"
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
          <div className="flex w-full h-full rounded-xl overflow-hidden">
            {/* LEFT */}
            <div className="relative flex items-center justify-center w-1/2 bg-black">
              {selectedPost?.mediaType === "image" ? (
                <img
                  src={selectedPost?.mediaUrl}
                  alt={selectedPost?.caption}
                  className="w-full h-full object-contain"
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
                    className="w-full h-full object-contain"
                  />

                  {/* Play Pause */}
                  {showIcon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 p-3 rounded-full">
                        {isPlaying ? (
                          <Play size={24} className="text-white" />
                        ) : (
                          <Pause size={24} className="text-white" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mute */}
                  <button
                    onClick={handleModalMuteToggle}
                    className="
                      absolute bottom-4 right-4
                      bg-black/60 hover:bg-black/80
                      p-2 rounded-full
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

            {/* RIGHT */}
            <div className="flex flex-col w-1/2 border-l border-gray-200 bg-black">
              {/* Header */}
              <div
                className="
                  flex items-center gap-3
                  p-3 border-b border-gray-200
                "
              >
                <ProfileImage user={selectedPost?.user} username />

                <FollowButton
                  targetUserId={selectedPost?.user?._id}
                  currentUser={currentUser}
                />
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <CommentSection comments={comments} />
              </div>

              {/* Bottom */}
              <div className="border-t border-gray-200">
                <div className="p-2">
                  <MediaIcon item={selectedPost} type="post" size={24} />
                </div>

                {/* Likes */}
                {selectedPost?.likes?.length > 0 && (
                  <div className="px-3 pb-2">
                    <p className="text-sm font-semibold text-gray-500">
                      {selectedPost?.likes?.length} likes
                    </p>
                  </div>
                )}

                {/* Comment Form */}
                <div className="p-3 border-t border-gray-200">
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
