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
      className="flex items-center gap-3 w-full   px-4 py-1  focus-within:border-[#E1306C]/50 focus-within:shadow-lg focus-within:shadow-pink-500/10 transition-all duration-300"
    >
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500 py-1 focus:placeholder-gray-400 transition-colors duration-200"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={`text-sm font-semibold transition-all duration-200 px-3 py-1 rounded-full ${
          !newComment.trim() || isSubmitting
            ? "text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white shadow-md hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105"
        }`}
        disabled={!newComment.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin h-2 w-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Posting
          </span>
        ) : (
          "Post"
        )}
      </button>
    </form>
  );
};

export default CommentForm;