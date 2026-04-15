import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestedUsers } from "../redux/slices/userSlices";

const SuggestedUser = () => {
  const {
    user: currentUser,
    suggestedUsers,
    loading,
    error,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const location = useLocation();
  const path = location.pathname.startsWith("/suggested-users");

  // const fetchSuggestedUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await axiosInstance.get(`/user/suggested/users`);
  //     if (data?.success) {
  //       setSuggestedUsers(data?.users);
  //     } else {
  //       setError(data.message || "Failed to fetch suggested USers");
  //     }
  //   } catch (error) {
  //     console.log("Error: ", error);
  //     setError(error.message || "Failed to fetch suggested USers");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <span className="ml-3 text-lg font-medium text-gray-700">
          Loading...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-600 font-semibold bg-red-100 px-4 py-2 rounded-md shadow">
          {error}
        </p>
      </div>
    );
  }

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <svg
          className="w-12 h-12 mb-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M17 20h5V4H2v16h5m10 0v-6H7v6h10z" />
        </svg>
        <p className="text-lg font-medium">No Suggested Users Found</p>
        <p className="text-sm text-gray-400">
          Try following more people to get better suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:flex flex-col hidden w-full gap-4">
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
