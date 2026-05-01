import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  followUserAction,
  unfollowUserAction,
} from "../redux/slices/userSlices";

const FollowButton = ({ targetUserId, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovering, setHovering] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?._id && currentUser?.following) {
      setIsFollowing(currentUser?.following.includes(targetUserId));
    }
  }, [currentUser, targetUserId]);

  const handleFollowToggle = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      if (isFollowing) {
        dispatch(unfollowUserAction(targetUserId));
      } else {
        dispatch(followUserAction(targetUserId));
      }

      //Update Local State
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.log("Error while follow unfollow: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`py-1 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        isFollowing
          ? "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
          : "bg-gradient-to-r from-[#634e72] to-[#E1306C] text-white shadow-md hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} transition-all duration-200`}
    >
      {loading ? (
        <span className="flex items-center gap-1">
          <svg className="animate-spin h-3 w-3 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{isFollowing ? "..." : "..."}</span>
        </span>
      ) : isFollowing && hovering ? (
        "Unfollow"
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowButton;