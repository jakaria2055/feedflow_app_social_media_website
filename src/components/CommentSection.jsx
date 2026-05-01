import React from "react";
import ProfileImage from "./ProfileImage";
import { Link } from "react-router-dom";
import { MessageCircleWarning } from "lucide-react";
import { timeAgo } from "../lib/timeAgo";

const CommentSection = ({ comments }) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-full">
        {comments?.length > 0 ? (
          <div className="space-y-5 px-4 py-4">
            {comments?.map((c) => (
              <div key={c?._id} className="flex gap-3 items-start group bg-gradient-to-r from-transparent to-transparent hover:from-gray-800/30 hover:to-gray-900/30 rounded-lg p-2 -mx-2 transition-all duration-200">
                <div className="flex shrink-0">
                  <ProfileImage user={c?.user} />
                </div>
                <div className="flex-1 min-h-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Link to={`/profile/${c?.user?._id}`} className="hover:underline flex items-center gap-2 group/link">
                      <span className="font-semibold text-white text-sm hover:text-[#E1306C] transition-colors duration-200">
                        {c?.user?.username}
                      </span>
                    </Link>
                    <span className="text-gray-500 text-xs">{timeAgo(c?.createdAt)}</span>
                  </div>

                  <p className="text-gray-300 text-sm break-words leading-relaxed">
                    {c?.text}
                  </p>

                  <div className="flex items-center gap-5 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button className="text-gray-500 hover:text-[#E1306C] text-xs font-medium transition-colors duration-200">
                      Like
                    </button>
                    <button className="text-gray-500 hover:text-[#E1306C] text-xs font-medium transition-colors duration-200">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 min-h-[300px]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-full p-4 mb-4">
                <MessageCircleWarning size={60} className="text-gray-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm font-semibold mt-2">No Comments Yet</p>
            <p className="text-gray-500 text-xs mt-1.5">Be the first to start the conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;