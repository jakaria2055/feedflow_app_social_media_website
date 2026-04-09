import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/slices/postSlice";
import PostCard from "./PostCard";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
   const { user: currentUser } = useSelector((state) => state.user);


  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center w-full">
      {posts?.map((post) => (
        <PostCard key={post?._id} post={post} currentUser={currentUser}/>
      ))}
    </div>
  );
};

export default Feed;
