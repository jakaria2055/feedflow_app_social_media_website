import { HandHeart, HeartHandshake } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import { setPosts } from "../redux/slices/postSlice";
import { updateLikeStory } from "../redux/slices/storiesSlice";
import { setReels } from "../redux/slices/reelSlice";

const LikeButton = ({ type = "post", item, size = 24, onToggle }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const { stories } = useSelector((state) => state.stories);
  const { reels } = useSelector((state) => state.reels);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!item || !currentUser) return;

    const liked =
      item?.likes?.some((likeItem) =>
        typeof likeItem === "object"
          ? likeItem?._id === currentUser?._id
          : likeItem === currentUser?._id,
      ) || false;
    setIsLiked(liked);
  }, [currentUser, item]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();

    if (!item || !currentUser) return;
    const optimisticsLiked = !isLiked;
    setIsLiked(optimisticsLiked);

    try {
      const { data } = await axiosInstance.put(`/${type}/${item?._id}/like`);

      if (data?.success) {
        const updatedItem = data.post || data.reel || data.story || item;

        const likedNow =
          data.likes?.some((like) =>
            typeof like === "object"
              ? like?._id === currentUser?._id
              : like === currentUser?._id,
          ) || false;

        setIsLiked(likedNow);

        switch (type) {
          case "post":
            dispatch(
              setPosts(
                posts.map((p) =>
                  p._id === updatedItem?._id ? updatedItem : p,
                ),
              ),
            );
            break;
          case "story":
            dispatch(
              updateLikeStory({
                storyId: updatedItem?._id,
                userId: currentUser?._id,
              }),
            );
            break;
          case "reel":
            dispatch(
              setReels(
                reels.map((r) =>
                  r._id === updatedItem?._id ? updatedItem : r,
                ),
              ),
            );
            break;
          default:
            break;
        }

        if (onToggle) onToggle(updatedItem);
      } else {
        setIsLiked(!optimisticsLiked);
        alert(data?.message || "Failed to like post");
      }
    } catch (error) {
      console.log("Failed to Like post: ", error);
      setIsLiked(!optimisticsLiked);
      alert("Failed to like post. Please try again!");
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className="transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none group"
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      {isLiked ? (
        <HeartHandshake 
          size={size} 
          className=" text-[#E1306C] drop-shadow-sm" 
        />
      ) : (
        <HandHeart 
          size={size} 
          className="text-gray-300 group-hover:text-[#E1306C] transition-colors duration-200" 
        />
      )}
    </button>
  );
};

export default LikeButton;