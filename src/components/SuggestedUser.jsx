import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestedUsers } from "../redux/slices/userSlices";

const SuggestedUser = () => {
  const { user: currentUser, suggestedUsers } = useSelector(
    (state) => state.user,
  );
  const [loadingUsers, setLoadingUsers] = useState(true);

  const dispatch = useDispatch();

  const location = useLocation();
  const path = location.pathname.startsWith("/suggested-users");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      await dispatch(fetchSuggestedUsers());
      setLoadingUsers(false);
    };

    fetchUsers();
  }, [dispatch]);

  if (loadingUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E1306C] border-r-2 border-r-transparent"></div>
        <span className="ml-3 text-sm font-medium text-gray-400">
          Loading suggestions...
        </span>
      </div>
    );
  }

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6">
        <svg
          className="w-12 h-12 mb-3 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M17 20h5V4H2v16h5m10 0v-6H7v6h10z" />
          <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M5 20v-2a7 7 0 0114 0v2" />
        </svg>
        <p className="text-sm font-medium text-gray-400">No Suggested Users</p>
        <p className="text-xs text-gray-500 mt-1">
          Follow more people to get better suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="lg:flex flex-col hidden w-full gap-3">
      {!path && (
        <div className="flex justify-between items-center px-1 mb-1">
          <h3 className="text-base font-semibold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Suggested for you
          </h3>
          <Link
            to={"/suggested-users"}
            className="text-xs text-[#E1306C] hover:text-[#F77737] transition-colors duration-200 font-medium"
          >
            See All
          </Link>
        </div>
      )}

      {suggestedUsers?.map((user) => (
        <div
          key={user?._id}
          className="flex items-center justify-between gap-3 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-3 rounded-xl border border-gray-800/30 hover:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5"
        >
          <Link to={`/profile/${user?._id}`} className="flex-1">
            <ProfileImage user={user} username />
          </Link>
          <FollowButton targetUserId={user?._id} currentUser={currentUser} />
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;