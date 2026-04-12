import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import { useSelector } from "react-redux";

const SuggestedUser = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const path = location.pathname.startsWith("/suggested-users");

  const fetchSuggestedUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/user/suggested/users`);
      if (data?.success) {
        setSuggestedUsers(data?.users);
      } else {
        setError(data.message || "Failed to fetch suggested USers");
      }
    } catch (error) {
      console.log("Error: ", error);
      setError(error.message || "Failed to fetch suggested USers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  return (
    <div className="flex flex-col w-full gap-4">
      {!path && (
        <div className="flex justify-between items-center gap-6">
          <h3 className="text-lg font-semibold text-gray-200">
            Suggested Users
          </h3>
          <Link
            to={"/suggested-users"}
            className="text-sm text-indigo-500 hover:underline"
          >
            See All
          </Link>
        </div>
      )}

      {suggestedUsers?.map((user) => (
        <div
          key={user?._id}
          className="flex items-center justify-between gap-3 bg-gray-800/50 p-3 rounded-md"
        >
          <Link to={`/profile/${user?._id}`}>
            <ProfileImage user={user} username />
          </Link>
          <FollowButton targetUserId={user?._id} currentUser={currentUser} />
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;
