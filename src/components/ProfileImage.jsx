import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileImage = ({ user, collapsed, username = false, showUserNameOnly=false, className }) => {
  const { user: currentUser, onlineUsers } = useSelector((state) => state.user);

  const isOnline = onlineUsers?.includes(user?._id);

  return (
    <div className="flex items-center gap-1 group">
      <div className="relative">
        <div
          className={`${className ? className : "w-10 h-10"} relative rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-[1.5px] shadow-md group-hover:shadow-lg transition-all duration-300`}
        >
          <img
            src={
              user?.profileImage ||
              `https://placehold.co/150x150/1a1a2e/FFFFFF?text=${user?.username?.charAt(0).toUpperCase()}`
            }
            alt="profile"
            className="w-full h-full rounded-full object-cover border-2 border-gray-900"
          />
        </div>
        {isOnline && user?._id !== currentUser?._id && (
          <span
            className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-gray-900 bg-gradient-to-r from-green-400 to-green-500 shadow-sm`}
          ></span>
        )}
      </div>

      {username && (
        <Link 
          to={`/profile/${user?._id}`} 
          className="font-semibold text-sm text-gray-200 hover:text-[#E1306C] transition-colors duration-200"
        >
          {user?.username}
        </Link>
      )}
      {!collapsed && showUserNameOnly && (
        <p className="font-semibold text-sm text-gray-300">
          {user?.username}
        </p>
      )}
    </div>
  );
};

export default ProfileImage;