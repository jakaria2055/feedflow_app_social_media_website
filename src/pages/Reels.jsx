import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReels } from "../redux/slices/reelSlice";
import Sidebar from "../components/Sidebar";
import { Pause, Play } from "lucide-react";

const Reels = () => {
  const { reels } = useSelector((state) => state.reels);
  console.log("Reels: ", reels);

  const dispatch = useDispatch();

  const videoRefs = useRef([]);
  const [playingStates, setPlayingStates] = useState({});
  const [showIconStates, setShowIconStates] = useState({});
  const [allMuted, setAllMuted] = useState(true);
  const [selectedReel, setSelectedReel] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReelComments, setSelectedReelComments] = useState([]);

  useEffect(() => {
    if (selectedReel) {
      setSelectedReelComments(selectedReel?.comments || []);
    }
  }, [selectedReel]);

  const handleVideoClick = () => {};

  useEffect(() => {
    dispatch(getAllReels());
  }, [dispatch]);

  return (
    <div className=" backdrop-blur-xl bg-black  flex text-white min-h-screen">
      <Sidebar />

      <main className="flex-1 w-full min-h-screen p-5 overflow-y-scroll snap-mandatory no-scrollbar">
        {reels?.map((reel, index) => (
          <div
            key={reel?._id || index}
            className="relative w-full px-8 pt-5 max-w-sm mx-auto h-[90vh] snap-start flex justify-center items-center bg-black rounded-md my-5"
          >
            <div className="relative m-3 w-full h-full">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                data-id={reel?._id}
                loop
                muted={allMuted}
                playsInline
                className="relative w-full h-full object-cover rounded-md shadow-sm"
                onClick={() => handleVideoClick(reel?._id)}
              >
                <source src={reel?.mediaUrl} type="video/mp4" />
              </video>

              {showIconStates[reel?._id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                  <button className="bg-gray-500/50 p-4 rounded-full text-white text-6xl opacity-80">
                    {playingStates[reel?._id] ? (
                      <Pause size={30} />
                    ) : (
                      <Play size={30} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Reels;
