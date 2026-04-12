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
      className="py-2 px-3 text-blue-500"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};
export default FollowButton;
