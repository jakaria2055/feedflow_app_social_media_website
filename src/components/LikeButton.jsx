import { HeartHandshake } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import { setPosts } from "../redux/slices/postSlice";

const LikeButton = ({ type = "post", item, size = 24 }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);

  console.log("Post From Like Page: ", posts);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!item || !currentUser) return;

    const liked =
      item?.likes?.some((item) =>
        typeof item === "object"
          ? item?._id === currentUser?._id
          : item === currentUser?._id,
      ) || false;
    setIsLiked(liked);
  }, [currentUser, item]);

  //Toggle Like / Unlike
  const handleLikeToggle = async (e) => {
    e.stopPropagation();

    if (!item || !currentUser) return;
    const optimisticsLiked = !isLiked;
    setIsLiked(optimisticsLiked); //Optimistic UI

    try {
      const { data } = await axiosInstance.put(`/${type}/${item?._id}/like`);

      console.log("Like Post Data: ", data);

      if (data?.success) {
        const updatedItem = data.post || data.reel || data.story || item;

        //Update Local Like State
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
          default:
            break;
        }
      }
    } catch (error) {
      console.log("Failed to Like post: ", error);
      alert("Failed to Like post: Try again!");
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className="transition-transform hover:scale-110 active:scale-95"
    >
      {isLiked ? (
        <HeartHandshake size={size} className="text-pink-700" />
      ) : (
        <HeartHandshake size={size} className="text-white" />
      )}
    </button>
  );
};

export default LikeButton;
