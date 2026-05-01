import React from "react";
import { MessageSquareHeart } from "lucide-react";
import ProfileImage from "./ProfileImage";
import { useNavigate } from "react-router-dom";

const EmptyMessage = ({ selectedUser }) => {
  const navigate = useNavigate();
  const onlineUser = true;
  
  return (
    <>
      {!selectedUser ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in duration-500">
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-full p-6 shadow-2xl">
              <MessageSquareHeart className="w-16 h-16 text-[#E1306C] animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            No messages yet
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Start a conversation by sending a message. Your chat history will appear here.
          </p>
          
          {/* Decorative Line */}
          <div className="mt-6 w-12 h-0.5 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-full"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full my-auto max-w-md mx-auto p-8 animate-in fade-in zoom-in duration-500">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 border border-gray-700/50 p-8 text-center w-full transform transition-all duration-300 hover:scale-[1.02]">
            
            {/* Profile Image with Gradient Ring */}
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] rounded-full blur-md opacity-60 animate-pulse"></div>
              <div className="relative rounded-full bg-gradient-to-r from-[#833AB4] to-[#E1306C] p-[2px] shadow-xl shadow-pink-500/20">
                <ProfileImage 
                  user={selectedUser} 
                  className="w-24 h-24 rounded-full object-cover" 
                />
              </div>
            </div>
            
            {/* Username */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
              {selectedUser?.username}
            </h2>
            
            {/* Active Status */}
            {onlineUser && (
              <div className="flex items-center justify-center gap-1.5 mt-1 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-green-500 font-medium text-xs uppercase tracking-wide">Active Now</p>
              </div>
            )}
            
            {/* Divider */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-full mx-auto my-4"></div>
            
            {/* View Profile Button */}
            <button
              onClick={() => navigate(`/profile/${selectedUser?._id}`)}
              className="mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white font-medium text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
            >
              View Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmptyMessage;