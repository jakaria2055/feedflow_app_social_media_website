import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";

const CommentForm = ({ item, type = "post", currentUser, setComments }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);

    //Optimistic UI: Temporary Comments
    const tempComment = {
      _id: `temp-${Date.now()}`,
      text: newComment,
      content: newComment,
      createdAt: new Date().toISOString(),
      user: {
        _id: currentUser?._id,
        username: currentUser?.username,
        profileImage: currentUser?.profileImage,
      },
    };

    // if(onSubmit) {
    //   onSubmit(tempComment);
    //   setNewComment("");
    //   setIsSubmitting(false);
    //   return
    // }

    //Actual logic for posts/reels
    setComments((prev) => [tempComment, ...prev]);
    setNewComment("");

    try {
      const { data } = await axiosInstance.post(
        `/${type}/${item?._id}/comment`,
        { text: newComment },
      );

      console.log("Comment Data: ", data);

      if (data.success) {
        setComments(data?.comments.slice().reverse());
      } else {
        throw new Error(data?.message || "Failed to add comments");
      }
    } catch (error) {
      console.log("Failed to add comments: ", error);
      setComments((prev) => prev.filter((c) => c?._id !== tempComment?._id));
      alert("Failed to add comments: Try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleCommentSubmit}
      className="flex items-center gap-3 w-full"
    >
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="text-blue-500 font-semibold text-sm hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1"
        disabled={!newComment.trim() || isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CommentForm;
