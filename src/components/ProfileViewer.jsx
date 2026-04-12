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
    <div className="relative w-full h-full overflow-hidden flex">
      {/* Left SIde Media */}
      <div className="relative flex items-center justify-center shrink-0 w-1/2 h-full bg-black">
        {currentPost?.mediaType === "image" ? (
          <img
            src={currentPost?.mediaUrl}
            alt={currentPost?.caption}
            className="max-w-full max-h-full w-full h-full object-contain"
          />
        ) : (
          <div className="">
            <video
              src={currentPost?.mediaUrl}
              loop
              playsInline
              muted={isMuted}
              autoPlay
              ref={modalVideoRef}
              className="w-[300px] h-auto max-w-full max-h-full object-contain"
              onClick={handleModalVideoClick}
            ></video>
            {showIcon && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                <button className="bg-black/50 hover:bg-black/80 p-2 rounded-full text-center text-6xl opacity-80">
                  {isPlaying ? (
                    <Play size={24} className="text-white" />
                  ) : (
                    <Pause size={24} />
                  )}
                </button>
              </div>
            )}
            <button
              onClick={handleModalMuteToggle}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/80 p-2 rounded-full text-center text-6xl opacity-80"
            >
              {isMuted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right Side: Comment Section */}
      <div className="flex flex-col w-1/2 border-2 border-gray-800">
        {/* User Header */}
        <div className="flex px-3 py-2 gap-3 sticky top-0 border-b border-gray-800 z-10">
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
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <CommentSection comments={comments} />
        </div>

        {/* Fixed Bottom Section */}
        <div className="w-full border-2 border-gray-800 sticky bottom-0 right-0 overflow-y-auto no-scrollbar">
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
            <div className="px-3">
              <button className="font-semibold text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                {currentPost?.likes?.length}{" "}
                {currentPost?.likes?.length === 1 ? "like" : "likes"}
              </button>
            </div>
          )}

          {/* Comment Input Form */}
          <div className="p-3 border-t border-gray-800">
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
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileViewer;
