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
import { ArrowLeft, ArrowRight } from "lucide-react";

const MessageSidebar = () => {
  const dispatch = useDispatch();
  const { users, selectedUser } = useSelector((state) => state.messages);
  const { user: currentUser } = useSelector((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(getAllUsersForMessage());
  }, [dispatch]);

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 h-screen z-50 p-4 flex flex-col bg-black bg-opacity-95 text-white shadow-2xl transition-[width] duration-500 ease-in-out ${collapsed ? "w-20" : "w-64"} border-r border-white/10`}
    >
      {/* Top Section */}

      {/* Logo */}
      <div>
        <Link
          to={"/"}
          className={`flex justify-center transition-all duration-500 ${collapsed ? "p-1" : "p-2"}`}
        >
          <img
            src={collapsed ? logo_2 : logo_1}
            alt="logo"
            className={`transition-transform duration-500 ease-in-out ${collapsed ? "h-10 w-10" : "h-16 w-auto"}`}
          />
        </Link>
      </div>

      <div className="">
        <h1>Show Active User</h1>
      </div>

      {/* Scrollbar User */}
      <div className="flex-1 border-t border-gray-800/50 overflow-y-auto no-scrollbar mt-6">
        <nav className="flex flex-col gap-3">
          {users?.map((user, i) => {
            const isActive = selectedUser?._id === user?._id;
            return (
              <button
                key={user?._id}
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  if (window.innerWidth < 768) setCollapsed(true);
                }}
                className={`flex items-center rounded-xl transition-all duration-500 ${collapsed ? "justify-center p-1 w-12 h-12" : "gap-3 p-2 w-full h-12"} ${isActive ? "bg-linear-to-r from-purple-500 to-purple-400 text-white font-semibold" : "hover:bg-gray-700 text-white"}`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <ProfileImage
                  user={user}
                  className={collapsed ? "w-8 h-8" : "w-10 h-10"}
                  collapsed={collapsed}
                  showUserNameOnly
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Bottom Section */}
      <div className="mt-4 relative">
        {currentUser && (
          <div
            className={`flex items-center ${collapsed ? "justify-center " : "gap-3"}`}
          >
            <div
              className={`relative flex items-center gap-3 ${collapsed ? "w-12" : "w-full"}`}
            >
              <Link
                to={`/profile/${currentUser?._id}`}
                className={`flex items-center ${collapsed ? "justify-center p-2" : "gap-3 p-2 w-full"} rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-800`}
              >
                <ProfileImage
                  user={currentUser}
                  className={collapsed ? "w-8 h-8" : "w-10 h-10"}
                  collapsed={collapsed}
                />
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {currentUser?.username}
                    </span>
                    <span className="text-xs text-gray-400">View Profile</span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        className="absolute top-4 -right-8 md:-right-4 bg-gray-700/50 hover:bg-gray-700 text-white p-1 rounded-full transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ArrowRight /> : <ArrowLeft />}
      </button>
    </aside>
  );
};

export default MessageSidebar;
