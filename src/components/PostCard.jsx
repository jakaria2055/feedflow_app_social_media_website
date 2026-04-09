import React, { useRef, useState } from "react";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import MediaIcon from "./MediaIcon";

const PostCard = ({ post, currentUser }) => {
  console.log("Post: ", post);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const comments = post?.comments

  const videoRef = useRef();

  const handleVideoClick = () => {};
  const handleMuteToggle = () => {};
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
      <div className="w-full h-[400px] sm:h-[300px] md:h-[400px] overflow-hidden">
        {post?.mediaType === "image" ? (
          <img
            src={post?.mediaUrl}
            alt={post?.caption}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              src={post?.mediaUrl}
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
              onClick={handleVideoClick}
            ></video>
            {showIcon && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                <button className="bg-black/50 p-2 rounded-full text-center text-6xl opacity-80">
                  {isPlaying ? (
                    <Play size={24} className="text-white" />
                  ) : (
                    <Pause size={24} />
                  )}
                </button>
              </div>
            )}
            <button className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-center text-6xl opacity-80">
              {isMuted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
          </div>
        )}
      </div>
      {/* <Media
        media={post}
        showIcon={showIcon}
        isPlaying={isPlaying}
        isMuted={isMuted}
        videoRef={videoRef}
        handleVideoClick={handleVideoClick}
        handleMuteToggle = {handleMuteToggle}
      /> */}

      <MediaIcon type="posts" item={post} size={24} handleOpenModal={handleOpenModal}/>

      {/* Caption */}
      <div className="px-3 pb-2">
        {post?.likes?.length > 0 && <button className="font-semibold text-sm text-gray-400 mr-1">{post?.likes?.length} Likes</button>}
        {post?.caption && <div>
            <span className="font-semibold text-sm text-gray-100 mr-1">{post?.user?.username}</span>
            <span className="text-sm text-gray-400">{post?.caption}</span>    
        </div>}
      </div>

      {comments?.length > 0 && <div className="px-3 pb-2 cursor-pointer">
        <button className="text-gray-500">
            View all {comments?.length} comments
        </button>
      </div>}
    </div>
  );
};

export default PostCard;
