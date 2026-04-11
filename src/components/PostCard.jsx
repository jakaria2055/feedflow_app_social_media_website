import React, { useEffect, useRef, useState } from "react";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import MediaIcon from "./MediaIcon";
import CommentForm from "./CommentForm";
import Media from "./Media";

const PostCard = ({ post, currentUser }) => {
  console.log("Post: ", post);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [comments, setComments] = useState(post?.comments);

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

  const handleOpenModal = () => {};


  return (
    <div className="bg-opacity-0 my-5 rounded-xl shadow-md shadow-white max-w-[300px] w-full mx-auto">
      {/* Header */}
      <div className="flex items-center px-3 py-2 gap-2">
        <ProfileImage user={post?.user} username />
        <div>
          {/* <FollowButton targetId={post?.user?._id} currentUser={currentUser} /> */}
          <button className="py-2 px-3 text-blue-500">Follow</button>
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
        type="posts"
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
  );
};

export default PostCard;
