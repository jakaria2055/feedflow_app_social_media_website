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
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          {/* Icon */}
          <MessageSquareHeart className="w-16 h-16 text-gray-400 mb-4 animate-bounce" />

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-700">
            No messages yet
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            Start a conversation by sending a message. Your chat history will
            appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white/70 p-8 rounded-2xl shadow-md flex flex-col items-center justify-center my-auto w-[500px] mx-auto text-center ">
          <ProfileImage user={selectedUser} className={"w-20 h-20 animate-bounce"} />
          <h2 className="tet-2xl font-semibold text-gray-900">
            {selectedUser?.username}
          </h2>

          {onlineUser && <p className="text-green-500 font-semibold text-sm">Active Now</p>}
          <button
            onClick={() => navigate(`/profile/${selectedUser?._id}`)}
            className="mt-3 px-5 py-2 rounded-full bg-gray-100 text-gray-900 font-medium hover:bg-gray-200"
          >
            View Profile
          </button>
        </div>
      )}
    </>
  );
};

export default EmptyMessage;
