import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../redux/slices/userSlices";
import {
  Plus,
  Home,
  Compass,
  Clapperboard,
  MessageCircle,
  Store,
  User,
  LogOut,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Modal from "./Modal";
import CreateMedia from "./CreateMedia";
import NotificationBell from "./NotificationBell";

const Sidebar = ({ collapsed, setCollapsed }) => {
  // ← props, not local state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalType, setModalType] = useState(null);
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
    {
      name: "Profile",
      icon: User,
      id: "profile",
      link: `/profile/${currentUser?._id}`,
    },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col backdrop-blur-xl bg-black/80 border-r border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${
          collapsed
            ? "w-8 items-center justify-center p-1" // ← tiny sliver
            : "w-14 md:w-64 p-2 md:p-4 gap-3 md:gap-6" // ← normal width
        }`}
      >
        {collapsed ? (
          /* Only show expand button when collapsed */
          <button
            className="absolute top-4 1-right-1 bg-gradient-to-r from-[#5c3279] to-[#88163c] text-white p-1 rounded-full hover:scale-110 transition-all duration-300"
            onClick={() => setCollapsed(false)}
          >
            <img
              src="/Favicon.png"
              alt="ConnectSphere"
              className="w-5 h-5 object-cover "
            />
            {/* <ArrowRight size={13} /> */}
          </button>
        ) : (
          /* Full sidebar content */
          <>
            {/* Collapse Button */}
            <button
              className="absolute top-10 right-5 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white p-1 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-10"
              onClick={() => setCollapsed(true)}
            >
              <ArrowLeft size={10} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex justify-center md:justify-start mt-1 mb-5">
              <img
                src="/image/login_page_logo.png"
                alt="ConnectSphere"
                className="hidden md:block h-10 object-contain"
              />
              <img
                src="/Favicon.png"
                alt="ConnectSphere"
                className="md:hidden block w-6 h-6 object-contain"
              />
            </Link>

            {/* Nav Items */}
            <nav className="flex flex-col gap-1 md:gap-2 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  onClick={() => setActive(item.id)}
                  className={`flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2.5 md:py-3 rounded-xl transition-all duration-300 group ${
                    active === item.id
                      ? "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white shadow-lg"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  <item.icon
                    size={18}
                    className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 text-white"
                  />
                  <span className="hidden md:inline font-medium text-sm text-white">
                    {item.name}
                  </span>
                </Link>
              ))}

              {/* Notification */}
              <button className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-1 py-2.5 md:py-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-white group w-full">
                <NotificationBell
                  size={18}
                  className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 text-white"
                />
                <span className="hidden md:inline font-medium text-sm text-white">
                  Notifications
                </span>
              </button>
            </nav>

            {/* Create Post */}
            <button
              onClick={() => setModalType("post")}
              className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg mb-1 md:mb-2"
            >
              <Plus size={18} className="flex-shrink-0 text-white" />
              <span className="hidden md:inline text-white">Create Post</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2.5 md:py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 text-white hover:text-red-500 group"
            >
              <LogOut
                size={18}
                className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 text-white group-hover:text-red-500"
              />
              <span className="hidden md:inline font-medium text-sm">
                Logout
              </span>
            </button>
          </>
        )}
      </aside>

      <Modal
        openModal={!!modalType}
        onClose={() => setModalType(null)}
        showCloseBtn
        initialWidth="max-w-2xl"
        initialHeight="h-auto"
      >
        <CreateMedia type={modalType} onClose={() => setModalType(null)} />
      </Modal>
    </>
  );
};

export default Sidebar;
