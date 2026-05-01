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
      className={`fixed md:sticky top-0 left-0 h-screen z-50 p-4 flex flex-col bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm shadow-2xl transition-all duration-500 ease-in-out ${
        collapsed ? "w-20" : "w-72"
      } border-r border-gray-800/50`}
    >
      {/* Top Section - Logo */}
      <div>
        <Link
          to={"/"}
          className={`flex justify-center transition-all duration-500 ${
            collapsed ? "p-1" : "p-2"
          }`}
        >
          <img
            src={collapsed ? logo_2 : logo_1}
            alt="logo"
            className={`transition-all duration-500 ease-in-out ${
              collapsed ? "h-10 w-10 rounded-full" : "h-12 w-auto"
            }`}
          />
        </Link>
      </div>

      {/* Show Online User Filter */}
      <div className="relative mt-4 flex justify-center items-center gap-2 p-2 rounded-xl bg-gray-800/30 backdrop-blur-sm">
        <label className="cursor-pointer flex text-white items-center gap-2 relative group">
          <input
            type="checkbox"
            checked={showOnlineUsers}
            onChange={(e) => setShowOnlineUsers(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#E1306C] focus:ring-[#E1306C] focus:ring-offset-0 focus:ring-1 cursor-pointer"
          />
          {!collapsed && (
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
              Show Online Only
            </span>
          )}
          {collapsed && (
            <span className="absolute -top-2 -right-2 flex justify-center items-center w-5 h-5 rounded-full bg-gradient-to-r from-[#E1306C] to-[#F77737] text-[10px] text-white font-medium shadow-lg">
              {onlineUsers.length - 1}
            </span>
          )}

          {!collapsed && (
            <div className="flex items-center gap-1 ml-auto">
              <UserCheck size={14} className="text-green-500" />
              <span className="text-xs text-gray-500">
                {onlineUsers.length - 1} online
              </span>
            </div>
          )}
        </label>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <Users size={40} className="text-gray-600 mb-3" />
          <p className="text-sm text-gray-500">No online users</p>
          <p className="text-xs text-gray-600 mt-1">Check back later</p>
        </div>
      )}

      {/* Scrollable User List */}
      <div className="flex-1 border-t border-gray-800/30 overflow-y-auto no-scrollbar mt-5 pt-4">
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
                    ? "justify-center p-2 w-12 h-12 mx-auto" 
                    : "gap-3 p-2.5 w-full"
                } ${
                  isActive 
                    ? "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white shadow-lg shadow-pink-500/20" 
                    : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
                }`}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <ProfileImage
                  user={user}
                  className={collapsed ? "w-10 h-10" : "w-10 h-10"}
                  collapsed={collapsed}
                  showUserNameOnly={!collapsed}
                />
                {!collapsed && (
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    {onlineUsers.includes(user?._id) && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
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

      {/* Profile Bottom Section */}
      <div className="mt-4 pt-3 border-t border-gray-800/30">
        {currentUser && (
          <div
            className={`flex items-center ${collapsed ? "justify-center" : ""}`}
          >
            <div
              className={`relative flex items-center ${collapsed ? "w-full justify-center" : "w-full"}`}
            >
              <Link
                to={`/profile/${currentUser?._id}`}
                className={`flex items-center ${
                  collapsed ? "justify-center p-2" : "gap-3 p-2 w-full"
                } rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-800/50 group`}
              >
                <ProfileImage
                  user={currentUser}
                  className={collapsed ? "w-10 h-10" : "w-10 h-10"}
                  collapsed={collapsed}
                />
                {!collapsed && (
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-sm truncate group-hover:text-[#E1306C] transition-colors duration-200">
                      {currentUser?.username}
                    </span>
                    <span className="text-xs text-gray-500">View Profile</span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        className="absolute top-2 -right-3 md:-right-3 bg-gradient-to-r from-[#833AB4] to-[#E1306C] hover:shadow-lg hover:shadow-pink-500/30 text-white p-1.5 rounded-full transition-all duration-300 hover:scale-110"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
      </button>
    </aside>
  );
};

export default MessageSidebar;