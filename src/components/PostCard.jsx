import React, { useEffect, useRef, useState } from "react";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import MediaIcon from "./MediaIcon";
import CommentForm from "./CommentForm";
import Media from "./Media";
import Modal from "./Modal";
import CommentSection from "./CommentSection";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { timeAgo } from "../lib/timeAgo";

const PostCard = ({ post, currentUser }) => {
  console.log("Post: ", post);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [comments, setComments] = useState(post?.comments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);

  // Check if post has media
  const hasMedia = post?.mediaUrl;

  // Optional
  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = isMuted;
    }

    localStorage.setItem("isMuted", isMuted);
  }, [isMuted]);

  // Auto play only for video posts
  useEffect(() => {
    if (!hasMedia || post?.mediaType !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(video);

    return () => observer.unobserve(video);
  }, [hasMedia, post?.mediaType]);

  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
    setShowIcon(true);

    setTimeout(() => setShowIcon(false), 600);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);

    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    if (videoRef.current && post?.mediaType === "video") {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleModalVideoClick = () => {
    if (!modalVideoRef.current) return;

    if (isPlaying) {
      modalVideoRef.current.pause();
    } else {
      modalVideoRef.current.play();
    }

    setIsPlaying(!isPlaying);
    setShowIcon(true);

    setTimeout(() => setShowIcon(false), 600);
  };

  const handleModalMuteToggle = () => {
    if (!modalVideoRef.current) return;

    modalVideoRef.current.muted = !modalVideoRef.current.muted;
    setIsMuted(modalVideoRef.current.muted);
  };

  useEffect(() => {
    if (isModalOpen && modalVideoRef.current && post?.mediaType === "video") {
      const video = modalVideoRef.current;

      video.muted = isMuted;

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isModalOpen, isMuted, post?.mediaType]);

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm my-5 rounded-2xl shadow-2xl shadow-black/30 border border-gray-800/50 hover:shadow-pink-500/10 hover:border-gray-700 transition-all duration-300 max-w-[500px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <ProfileImage user={post?.user} username />

            <p className="text-xs text-gray-500 whitespace-nowrap">
              {timeAgo(post?.createdAt)}
            </p>
          </div>

          <FollowButton
            targetUserId={post?.user?._id}
            currentUser={currentUser}
          />
        </div>

        {/* Media */}
        {hasMedia && (
          <Media
            media={post}
            showIcon={showIcon}
            isPlaying={isPlaying}
            isMuted={isMuted}
            videoRef={videoRef}
            handleVideoClick={handleVideoClick}
            handleMuteToggle={handleMuteToggle}
          />
        )}

        {/* Text Post */}
        {!hasMedia && (
          <div className="px-6 py-10">
            <div className=" rounded-2xl overflow-y-auto mr-2 max-h-[50vh] custom-scrollbar">
              <p className="text-gray-100 text-md leading-relaxed whitespace-pre-wrap break-words text-center">
                {post?.caption}
              </p>
            </div>
          </div>
        )}

        {/* Like Comment Share */}
        <MediaIcon
          type="post"
          item={post}
          size={24}
          handleOpenModal={handleOpenModal}
        />

        {/* Caption for media post */}
        {hasMedia && post?.caption && (
          <div className="px-4 pb-3 space-y-1">
            {post?.likes?.length > 0 && (
              <button className="font-semibold text-sm text-gray-400 hover:text-gray-300 transition-colors mr-1">
                {post?.likes?.length} Likes
              </button>
            )}

            <div className="text-sm">
              <span className="font-semibold text-gray-100 mr-2">
                {post?.user?.username}
              </span>

              <span className="text-gray-400">{post?.caption}</span>
            </div>
          </div>
        )}

        {/* Likes for text post */}
        {!hasMedia && post?.likes?.length > 0 && (
          <div className="px-4 pb-3">
            <button className="font-semibold text-sm text-gray-400 hover:text-gray-300 transition-colors mr-1">
              {post?.likes?.length} Likes
            </button>
          </div>
        )}

        {/* View Comments */}
        {comments?.length > 0 && (
          <div className="px-4 pb-2">
            <button
              onClick={handleOpenModal}
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              View all {comments?.length} comments
            </button>
          </div>
        )}

        {/* Comment Input */}
        <div className="p-3 border-t border-gray-800/50">
          <CommentForm
            item={post}
            type="post"
            currentUser={currentUser}
            setComments={setComments}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        showCloseBtn
        openModal={isModalOpen}
        onClose={handleCloseModal}
        initialWidth="max-w-6xl"
        initialHeight="h-[90vh]"
      >
        <div className="flex w-full h-full  bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800/50 shadow-2xl">
          {/* LEFT SIDE */}
          <div className="relative flex items-center justify-center shrink-0 w-1/2 h-full bg-black/50 p-2 sm:p-6">
            {/* IMAGE */}
            {post?.mediaType === "image" && (
              <img
                src={post?.mediaUrl}
                alt={post?.caption}
                className="max-w-full max-h-full w-full h-full object-contain rounded-xl"
              />
            )}

            {/* VIDEO */}
            {post?.mediaType === "video" && (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  src={post?.mediaUrl}
                  loop
                  playsInline
                  muted={isMuted}
                  autoPlay
                  ref={modalVideoRef}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={handleModalVideoClick}
                />

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
                  className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-2 rounded-full transition-all duration-200"
                >
                  {isMuted ? (
                    <VolumeX size={18} className="text-white" />
                  ) : (
                    <Volume2 size={18} className="text-white" />
                  )}
                </button>
              </div>
            )}

            {/* TEXT POST */}
            {!hasMedia && (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <div className="max-w-xl w-full max-h-full bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700/40 rounded-3xl p-2 shadow-2xl flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-5">
                    <ProfileImage user={post?.user} username />

                    <div>
                      <p className="text-xs text-gray-500">
                        {timeAgo(post?.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Scrollable Text */}
                  <div className="overflow-y-auto pr-2 max-h-[70vh] custom-scrollbar">
                    <p className="text-md  leading-relaxed text-gray-100 whitespace-pre-wrap break-words">
                      {post?.caption}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col w-1/2 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm">
            {/* Header */}
            <div className="flex px-4 py-3 gap-3 sticky top-0 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-900/90 backdrop-blur-sm z-10">
              {post?.user && <ProfileImage user={post?.user} username />}

              <FollowButton
                targetId={post?.user?._id}
                currentUser={currentUser}
                type="post"
              />
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <CommentSection comments={comments} />
            </div>

            {/* Bottom */}
            <div className="w-full border-t border-gray-800/50 sticky bottom-0 right-0 bg-gradient-to-t from-gray-900 to-gray-900/95 backdrop-blur-sm">
              <div className="py-2">
                <MediaIcon item={post} type="post" size={24} />
              </div>

              {post?.likes?.length > 0 && (
                <div className="px-4">
                  <button className="font-semibold text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200">
                    {post?.likes?.length}{" "}
                    {post?.likes?.length === 1 ? "like" : "likes"}
                  </button>
                </div>
              )}

              <div className="p-3 border-t border-gray-800/50">
                <CommentForm
                  item={post}
                  type="post"
                  currentUser={currentUser}
                  setComments={setComments}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PostCard;
