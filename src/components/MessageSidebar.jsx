import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersForMessage,
  setSelectedUser,
} from "../redux/slices/messageSlice";
import { Link } from "react-router-dom";
import logo_1 from "/image/login_page_logo.png";
import logo_2 from "/Favicon.png";
import ProfileImage from "./ProfileImage";
import { ArrowLeft, ArrowRight, Users, UserCheck } from "lucide-react";

const MessageSidebar = () => {
  const dispatch = useDispatch();
  const { users, selectedUser } = useSelector((state) => state.messages);
  const { user: currentUser, onlineUsers } = useSelector((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  const filteredUsers = showOnlineUsers
    ? users.filter((user) => onlineUsers.includes(user?._id))
    : users;

  useEffect(() => {
    dispatch(getAllUsersForMessage());
  }, [dispatch]);

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 h-screen z-30 flex flex-col bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm shadow-2xl transition-all duration-500 ease-in-out border-r border-gray-800/50 ${
        collapsed ? "w-14 p-2" : "w-72 p-4"
      }`}
    >
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Link to="/" className="flex justify-center">
          <img
            src={collapsed ? logo_2 : logo_1}
            alt="logo"
            className={`transition-all duration-500 ease-in-out ${
              collapsed ? "h-7 w-7 rounded-full" : "h-12 w-auto"
            }`}
          />
        </Link>
      </div>

      {/* Online Filter */}
      <div className="flex justify-center items-center mb-4 p-2 rounded-xl bg-gray-800/30">
        <label className="cursor-pointer flex items-center gap-2 relative group w-full justify-center">
          <input
            type="checkbox"
            checked={showOnlineUsers}
            onChange={(e) => setShowOnlineUsers(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#E1306C] focus:ring-[#E1306C] focus:ring-offset-0 focus:ring-1 cursor-pointer flex-shrink-0"
          />
          {collapsed && (
            <span className="absolute -top-2 -right-1 flex justify-center items-center w-4 h-4 rounded-full bg-gradient-to-r from-[#E1306C] to-[#F77737] text-[9px] text-white font-medium shadow-lg">
              {onlineUsers.length - 1}
            </span>
          )}
          {!collapsed && (
            <>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                Show Online Only
              </span>
              <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                <UserCheck size={14} className="text-green-500" />
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {onlineUsers.length - 1} online
                </span>
              </div>
            </>
          )}
        </label>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <Users size={collapsed ? 20 : 40} className="text-gray-600 mb-3" />
          {!collapsed && (
            <>
              <p className="text-sm text-gray-500">No online users</p>
              <p className="text-xs text-gray-600 mt-1">Check back later</p>
            </>
          )}
        </div>
      )}

      {/* Scrollable User List */}
      <div className="flex-1 border-t border-gray-800/30 overflow-y-auto no-scrollbar mt-2 pt-4">
        <nav className="flex flex-col gap-2">
          {filteredUsers?.map((user, i) => {
            const isActive = selectedUser?._id === user?._id;
            return (
              <button
                key={user?._id}
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  if (window.innerWidth < 768) setCollapsed(true);
                }}
                className={`flex items-center rounded-xl transition-all duration-300 ${
                  collapsed
                    ? "justify-center w-9 h-9 mx-auto p-0"
                    : "gap-3 p-2.5 w-full"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white shadow-lg shadow-pink-500/20"
                    : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
                }`}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {/* Avatar always shown, name only when expanded */}
                <div className="flex-shrink-0">
                  <ProfileImage
                    user={user}
                    className={collapsed ? "w-8 h-8" : "w-10 h-10"}
                    collapsed={collapsed}
                    showUserNameOnly={false}
                  />
                </div>

                {!collapsed && (
                  <div className="flex flex-col items-start flex-1 min-w-0 overflow-hidden">
                    <span className="text-sm font-medium truncate w-full text-left">
                      {user?.username}
                    </span>
                    {onlineUsers.includes(user?._id) && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                        Online
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Bottom */}
      <div className="mt-4 pt-3 border-t border-gray-800/30">
        {currentUser && (
          <Link
            to={`/profile/${currentUser?._id}`}
            className={`flex items-center ${
              collapsed ? "justify-center p-1" : "gap-3 p-2 w-full"
            } rounded-xl transition-all duration-300 hover:bg-gray-800/50 group`}
          >
            <div className="flex-shrink-0">
              <ProfileImage
                user={currentUser}
                className={collapsed ? "w-8 h-8" : "w-10 h-10"}
                collapsed={collapsed}
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <span className="font-semibold text-sm truncate group-hover:text-[#E1306C] transition-colors duration-200">
                  {currentUser?.username}
                </span>
                <span className="text-xs text-gray-500">View Profile</span>
              </div>
            )}
          </Link>
        )}
      </div>

      {/* Collapse Button */}
      <button
        className="absolute top-2 -right-3 bg-gradient-to-r from-[#833AB4] to-[#E1306C] hover:shadow-lg hover:shadow-pink-500/30 text-white p-1 rounded-full transition-all duration-300 hover:scale-110 z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
      </button>
    </aside>
  );
};

export default MessageSidebar;