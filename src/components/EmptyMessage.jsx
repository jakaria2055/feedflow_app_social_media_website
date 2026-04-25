import React from "react";
import { MessageSquareHeart } from "lucide-react"; 

const EmptyMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      {/* Icon */}
      <MessageSquareHeart className="w-16 h-16 text-gray-400 mb-4" />

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-700">
        No messages yet
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 mt-2 max-w-xs">
        Start a conversation by sending a message. Your chat history will appear here.
      </p>
    </div>
  );
};

export default EmptyMessage;
