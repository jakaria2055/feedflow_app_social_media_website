import { Bookmark, BookmarkCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { setSavedPosts } from "../redux/slices/userSlices";

const SaveButton = ({ post, size = 24, type = "post" }) => {
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
      const { data } = await axiosInstance.put(`/${type}/${post?._id}/save`);
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
      alert("Failed to save post. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSavePost}
      disabled={isLoading}
      className={`transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none group ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label={isSaved ? "Unsave" : "Save"}
    >
      {isSaved ? (
        <BookmarkCheck 
          size={size} 
          className=" text-[#E1306C] drop-shadow-sm transition-all duration-200" 
        />
      ) : (
        <Bookmark 
          size={size} 
          className="text-gray-400 group-hover:text-[#E1306C] transition-all duration-200" 
        />
      )}
    </button>
  );
};

export default SaveButton;