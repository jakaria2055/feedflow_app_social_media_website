import { Bell, Check, Heart, UserPlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { timeAgo } from "../lib/timeAgo";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const { notification } = useSelector((state) => state.user);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const getNotification = (type) => {
    switch (type) {
      case "like":
        return <Heart size={16} className="text-pink-500" />;
      case "follow":
        return <UserPlus size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropDownRef}>
      {/* Bell icon with badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative flex items-center justify-center w-9 h-9 rounded-full 
                   hover:bg-blue-50 transition-colors duration-200 group"
      >
        <Bell size={20} className="text-white group-hover:text-blue-600 transition-colors" />
        {notification?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 
                           text-white text-[10px] font-semibold rounded-full w-5 h-5 
                           flex items-center justify-center shadow-md animate-pulse">
            {notification?.length > 9 ? "9+" : notification?.length}
          </span>
        )}
      </button>

      {/* DropDown */}
      {isOpen && (
        <div className="absolute left-full ml-2 top-0 w-80 bg-white shadow-2xl rounded-xl 
                        border border-gray-200 z-50 max-h-96 overflow-y-auto 
                        transform origin-top-left animate-[fadeIn_0.25s_ease-out]">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <button  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
              <Check size={14} />
              Mark all as read
            </button>
          </div>

          {notification?.length === 0 ? (
            <div className="p-6 text-center text-gray-400 italic">
              🎉 No Notifications Yet
            </div>
          ) : (
            notification.slice(0, 10).map((notify) => (
              <div
                key={notify.userId}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-all duration-200 
                            rounded-md hover:shadow-sm hover:bg-blue-50 ${
                              notify.read
                                ? "bg-gray-50 text-gray-700"
                                : "bg-white font-medium text-gray-900"
                            }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex shrink-0 mt-1">{getNotification(notify.type)}</div>
                  <div className="flex-1">
                    <Link
                      to={`/profile/${notify?.userId}`}
                      className="text-sm hover:underline hover:text-blue-600 transition-colors"
                    >
                      {notify?.message}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(notify?.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
