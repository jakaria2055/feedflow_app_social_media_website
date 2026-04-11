import React, { useEffect, useState } from "react";

const FollowButton = ({ targetUserId, currentUser}) => {
  const [isFollowing, setIsFollowing ] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if(currentUser?._id && currentUser?.following){
      setIsFollowing(currentUser?.following.includes(targetUserId))
    }

    const handleFollowToggle = async () => {
      if(!currentUser?._id) return
      setLoading(true)
      try {
        
      } catch (error) {
        
      }
    }

  },[])

  
  return (
    <div>
      <button className="py-2 px-3 text-blue-500">Follow</button>
    </div>
  );


export default FollowButton;
