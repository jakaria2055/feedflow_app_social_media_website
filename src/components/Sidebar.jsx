import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../redux/slices/userSlices";
import { Plus, Bell, Home, Compass, Clapperboard, MessageCircle, Store, User, LogOut } from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(() => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/explore") return "search";
    if (path === "/reels") return "reels";
    if (path === "/chats") return "message";
    if (path === "/market") return "market";
    if (path.startsWith("/profile")) return "profile";
    return "home";
  });
  
  const { user: currentUser } = useSelector((state) => state.user);

  const navItems = [
    { name: "Home", icon: Home, id: "home", link: "/" },
    { name: "Explore", icon: Compass, id: "search", link: "/explore" },
    { name: "Reels", icon: Clapperboard, id: "reels", link: "/reels" },
    { name: "Message", icon: MessageCircle, id: "message", link: "/chats" },
    { name: "Market", icon: Store, id: "market", link: "/market" },
    { name: "Profile", icon: User, id: "profile", link: `/profile/${currentUser?._id}` },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleOpenModal = (type) => {
    console.log(`Open ${type} modal`);
  };

  const handleNotificationClick = () => {
    console.log("Open notifications");
  };

  return (
    <aside className="sticky top-0 left-0 h-screen z-50 w-20 md:w-64 p-4 flex flex-col gap-6 backdrop-blur-xl bg-black/80 border-r border-white/10 shadow-2xl">
      {/* Logo Section */}
      <Link to="/" className="flex justify-center md:justify-start">
        <img
          src="/image/login_page_logo.png"
          alt="ConnectSphere"
          className="hidden md:block h-10 object-contain"
        />
        <img 
          src="/Favicon.png" 
          alt="ConnectSphere" 
          className="md:hidden block w-8 h-8 object-contain" 
        />
      </Link>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
              active === item.id
                ? "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white shadow-lg"
                : "hover:bg-white/10 text-white hover:text-white"
            }`}
          >
            <item.icon 
              size={22} 
              className={`transition-transform duration-300 group-hover:scale-110 ${
                active === item.id ? "text-white" : "text-white"
              }`}
            />
            <span className="hidden md:inline font-medium text-sm text-white">
              {item.name}
            </span>
          </Link>
        ))}

        {/* Notification Button */}
        <button
          onClick={handleNotificationClick}
          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-white hover:text-white group w-full"
        >
          <Bell 
            size={22} 
            className="transition-transform duration-300 group-hover:scale-110 text-white"
          />
          <span className="hidden md:inline font-medium text-sm text-white">
            Notifications
          </span>
        </button>
      </nav>

      {/* Create Post Button */}
      <button
        onClick={() => handleOpenModal("post")}
        className="flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg mb-2"
      >
        <Plus size={20} className="text-white" />
        <span className="hidden md:inline text-white">Create Post</span>
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 text-white hover:text-red-500 group"
      >
        <LogOut 
          size={22} 
          className="transition-transform duration-300 group-hover:scale-110 text-white group-hover:text-red-500"
        />
        <span className="hidden md:inline font-medium text-sm">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;