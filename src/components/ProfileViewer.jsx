import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import CommentSection from "./CommentSection";
import MediaIcon from "./MediaIcon";
import CommentForm from "./CommentForm";
import { timeAgo } from "../lib/timeAgo";

const ProfileViewer = ({
  handleModalVideoClick,
  handleModalMuteToggle,
  modalVideoRef,
  showIcon,
  isMuted,
  isPlaying,
  startIndex = 0,
  content,
  activeTab,
  currentUser,
  type,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [comments, setComments] = useState([]);
  const [currentPost, setCurrentPost] = useState(content?.[startIndex] || null);

  const isVideo = (item) => {
    if (item?.mediaType === "video") return true;
    if (item?.mediaUrl) {
      return (
        /\.(mp4|webm|ogg|mov)$/i.test(item.mediaUrl) ||
        item.mediaUrl.includes("/video/")
      );
    }
    return false;
  };

  useEffect(() => {
    setCurrentPost(content?.[currentIndex] || null);
  }, [content, currentIndex]);

  useEffect(() => {
    setComments(currentPost?.comments || []);
  }, [currentPost]);

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? content.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === content.length - 1 ? 0 : i + 1));

  if (!currentPost) return null;

  return (
    <div className="relative w-full h-full overflow-hidden flex bg-gradient-to-br from-gray-900 to-black">
      {/* Left Side Media */}
      <div className="relative flex items-center justify-center shrink-0 w-1/2 h-full bg-black/50">
        {currentPost?.mediaType === "image" ? (
          <img
            src={currentPost?.mediaUrl}
            alt={currentPost?.caption}
            className="max-w-full max-h-full w-full h-full object-contain rounded-lg"
          />
        ) : isVideo(currentPost) ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              src={currentPost?.mediaUrl}
              loop
              playsInline
              muted={isMuted}
              autoPlay
              ref={modalVideoRef}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={handleModalVideoClick}
            ></video>
            {showIcon && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                <button className="bg-black/60 backdrop-blur-sm hover:bg-black/80 p-3 rounded-full text-center text-6xl opacity-90 transition-all">
                  {isPlaying ? (
                    <Play size={24} className="text-white" />
                  ) : (
                    <Pause size={24} className="text-white" />
                  )}
                </button>
              </div>
            )}
            <button
              onClick={handleModalMuteToggle}
              className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-2.5 rounded-full transition-all duration-200"
            >
              {isMuted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} className="text-white" />
              )}
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <div className="max-w-xl w-full max-h-full bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700/40 rounded-3xl p-2 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 mb-5">
                <ProfileImage user={currentPost?.user} username />

                <div>
                  <p className="text-xs text-gray-500">
                    {timeAgo(currentPost?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Scrollable Text */}
              <div className="overflow-y-auto pr-2 max-h-[70vh] custom-scrollbar">
                <p className="text-md  leading-relaxed text-gray-100 whitespace-pre-wrap break-words">
                  {currentPost?.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Comment Section */}
      <div className="flex flex-col w-1/2 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm">
        {/* User Header */}
        <div className="flex px-4 py-3 gap-3 sticky top-0 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-900/80 backdrop-blur-sm z-10">
          {currentPost?.user && (
            <ProfileImage user={currentPost?.user} username />
          )}
          <FollowButton
            targetUserId={currentPost?.user?._id}
            currentUser={currentUser}
            type="post"
          />
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          <CommentSection comments={comments} />
        </div>

        {/* Fixed Bottom Section */}
        <div className="w-full border-t border-gray-800/50 sticky bottom-0 right-0 bg-gradient-to-t from-gray-900 to-gray-900/95 backdrop-blur-sm">
          <div className="py-2">
            <MediaIcon
              item={{ ...currentPost, currentUser }}
              type={type}
              size={24}
              shareIcon
              onToggle={(updateItem) => setCurrentPost(updateItem)}
            />
          </div>

          {/* Likes Count */}
          {currentPost?.likes?.length > 0 && (
            <div className="px-4">
              <button className="font-semibold text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200">
                {currentPost?.likes?.length}{" "}
                {currentPost?.likes?.length === 1 ? "like" : "likes"}
              </button>
            </div>
          )}

          {/* Comment Input Form */}
          <div className="p-3 border-t border-gray-800/50">
            <CommentForm
              item={currentPost}
              type={type}
              currentUser={currentUser}
              setComments={setComments}
            />
          </div>
        </div>
      </div>

      {content.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileViewer;
