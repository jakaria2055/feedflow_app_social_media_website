import React from "react";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";

const PostCard = ({ post, currentUser }) => {
  console.log("Post: ", post);
  return (
    <div className="bg-opacity-0 my-5 rounded-xl shadow-md shadow-white max-w-[300px] w-full mx-auto">
      {/* Header */}
      <div className="flex items-center px-3 py-2 gap-2">
        <ProfileImage user={post?.user} username />
        <div>
          <FollowButton targetId={post?.user?._id} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
