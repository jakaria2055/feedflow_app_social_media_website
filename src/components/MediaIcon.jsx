import React, { useState } from "react";
import LikeButton from "./LikeButton";
import { BookMarked, Check, MessageCircleHeart, Send, Share2 } from "lucide-react";
import SaveButton from "./SaveButton";

const MediaIcon = ({
  type,
  item,
  size = 24,
  shareIcon,
  handleOpenModal,
  onToggle,
}) => {
  const [copiedPostId, setCopiedPostId] = useState(null);
  // Share function
  const handleShare = async (postId) => {
    try {
      const shareableLink = `${window.location.origin}/${type}/${postId}`;
      await navigator.clipboard.writeText(shareableLink);

      // Show copied feedback
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);

      // Optional: Show toast notification
      showToast("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link: ", error);
      alert("Failed to copy link. Please try again.");
    }
  };

  // Toast notification function
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up text-sm";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  return (
    <div className="flex justify-between items-center p-3 border-t border-gray-800/50 bg-gradient-to-r from-transparent to-transparent hover:from-gray-800/20 hover:to-gray-900/20 transition-all duration-300">
      <div className="flex items-center space-x-5">
        <LikeButton type={type} item={item} size={size} onToggle={onToggle} />

        <button
          onClick={() => handleOpenModal()}
          className="text-gray-300 hover:text-[#E1306C] transition-all duration-200 hover:scale-110"
        >
          <MessageCircleHeart size={size} strokeWidth={2} />
        </button>

        {!shareIcon && (
          <button
            onClick={() => handleShare(item?._id)}
            className="text-gray-300 hover:text-[#E1306C] transition-all duration-200 hover:scale-110"
          >
            {copiedPostId === item?._id ? (
              <Check size={size} strokeWidth={2} className="text-green-500" />
            ) : (
              <Share2 size={size} />
            )}
          </button>
        )}
      </div>

      <SaveButton post={item} size={size} type={type} />
    </div>
  );
};

export default MediaIcon;
