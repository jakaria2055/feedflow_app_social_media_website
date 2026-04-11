import { Bookmark, BookmarkCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { setSavedPosts } from "../redux/slices/userSlices";

const SaveButton = ({ post }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser?._id) {
      setIsSaved(false);
      return;
    }
    const savedCurrentUserPostsChecked =
      currentUser?.savedPosts?.some((item) =>
        typeof item === "object" ? item?._id === post?._id : item === post?._id,
      ) || false;
    setIsSaved(savedCurrentUserPostsChecked);
  }, [currentUser?._id, currentUser?.savedPosts, post?._id]);

  //Fetch save post API
  const handleSavePost = async () => {
    if (!currentUser?._id) return;
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.put(`/post/${post?._id}/save`);
      console.log("Saved Post Data: ", data);

      if (data?.success) {
        //Update Redux
        dispatch(setSavedPosts(data?.savedPosts));
        //Update Local storage
        const isPostSaved = data.savedPosts.some(
          (item) => item.toString() === post?._id.toString(),
        );
        setIsSaved(isPostSaved);
      }
    } catch (error) {
      console.log("Failed to save post: ", error);
      alert("Failed to save post: Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSavePost}
      disabled={isLoading}
      className={`flex items-center ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isSaved ? (
        <BookmarkCheck size={24} className="text-gray-300" />
      ) : (
        <Bookmark size={24} className="text-gray-300" />
      )}
    </button>
  );
};

export default SaveButton;
