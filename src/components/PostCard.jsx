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

  // const comments = post?.comments

  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);

  //Optional
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
    localStorage.setItem("isMuted", isMuted);
  }, [isMuted]);

  //Intersection on Observer for autoplay
  useEffect(() => {
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
  }, []);

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
    if (videoRef.current) {
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
    if (isModalOpen && modalVideoRef.current) {
      const video = modalVideoRef.current;
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isModalOpen, isMuted]);

  return (
    <>
      <div className="bg-opacity-0 my-5 rounded-xl shadow-md shadow-white max-w-[300px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center px-3 py-2 gap-2">
          <div className="relative">
            <ProfileImage user={post?.user} username />
            <p className="text-xs text-gray-600 absolute left-11 top-6">{timeAgo(post?.createdAt)}</p>
          </div>

          <div>
            <FollowButton
              targetUserId={post?.user?._id}
              currentUser={currentUser}
            />
          </div>
        </div>

        {/* Media */}
        <Media
          media={post}
          showIcon={showIcon}
          isPlaying={isPlaying}
          isMuted={isMuted}
          videoRef={videoRef}
          handleVideoClick={handleVideoClick}
          handleMuteToggle={handleMuteToggle}
        />

        <MediaIcon
          type="post"
          item={post}
          size={24}
          handleOpenModal={handleOpenModal}
        />

        {/* Caption */}
        <div className="px-3 pb-2">
          {post?.likes?.length > 0 && (
            <button className="font-semibold text-sm text-gray-400 mr-1">
              {post?.likes?.length} Likes
            </button>
          )}
          {post?.caption && (
            <div>
              <span className="font-semibold text-sm text-gray-100 mr-1">
                {post?.user?.username}
              </span>
              <span className="text-sm text-gray-400">{post?.caption}</span>
            </div>
          )}
        </div>

        {comments?.length > 0 && (
          <div className="px-3 pb-2 cursor-pointer">
            <button onClick={handleOpenModal} className="text-gray-500">
              View all {comments?.length} comments
            </button>
          </div>
        )}

        {/* Comment Input */}
        <div className="p-3 border-t border-gray-800">
          <CommentForm
            item={post}
            type="post"
            currentUser={currentUser}
            setComments={setComments}
          />
        </div>
      </div>

      <Modal
        showCloseBtn
        openModal={isModalOpen}
        onClose={handleCloseModal}
        initialWidth="max-w-5xl"
        initialHeight="h-[85vh]"
      >
        <div className="flex w-full h-full border-gray-800 rounded-xl">
          {/* Left SIde Media */}
          <div className="relative flex items-center justify-center shrink-0 w-1/2 h-auto bg-black">
            {post?.mediaType === "image" ? (
              <img
                src={post?.mediaUrl}
                alt={post?.caption}
                className="max-w-full max-h-full w-full h-full object-contain"
              />
            ) : (
              <div className="">
                <video
                  src={post?.mediaUrl}
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
              {post?.user && <ProfileImage user={post?.user} username />}
              <FollowButton
                targetId={post?.user?._id}
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
                <MediaIcon item={post} type="post" size={24} />
              </div>

              {/* Likes Count */}
              {post?.likes?.length > 0 && (
                <div className="px-3">
                  <button className="font-semibold text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                    {post?.likes?.length}{" "}
                    {post?.likes?.length === 1 ? "like" : "likes"}
                  </button>
                </div>
              )}

              {/* Comment Input Form */}
              <div className="p-3 border-t border-gray-800">
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
