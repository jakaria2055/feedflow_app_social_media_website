import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/slices/postSlice";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user: currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    dispatch(getAllPosts({ page }));
  }, [dispatch, page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      if (!loading && hasMore) {
        setPage(prev => prev + 1);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#E1306C] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-red-500 mb-2">Failed to load posts</p>
        <button 
          onClick={() => dispatch(getAllPosts({ page: 1 }))}
          className="px-4 py-2 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-lg text-white text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-400 mb-2">No posts yet</p>
        <p className="text-gray-500 text-sm">Follow some users to see their posts</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      {posts?.map((post) => (
        <PostCard key={post?._id} post={post} currentUser={currentUser} />
      ))}
      {loading && page > 1 && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-[#E1306C] animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Feed;