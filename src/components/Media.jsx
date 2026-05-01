import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import React from "react";

const Media = ({
  media,
  showIcon,
  isPlaying,
  isMuted,
  videoRef,
  handleVideoClick,
  handleMuteToggle,
}) => {
  const isImage =
    media?.mediaType === "image" ||
    media?.mediaUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    
  return (
    <div className="w-full h-[400px] sm:h-[300px] md:h-[400px] overflow-hidden">
      {isImage ? (
        <img
          src={media?.mediaUrl}
          alt={media?.caption}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="relative w-full h-full">
          <video
            src={media?.mediaUrl}
            loop
            playsInline
            muted={isMuted}
            autoPlay
            ref={videoRef}
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
          <button
            onClick={handleMuteToggle}
            className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-center text-6xl opacity-80"
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
  );
};

export default Media;
