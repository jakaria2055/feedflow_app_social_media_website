import React, { useEffect, useRef, useState } from "react";
import MessageSidebar from "../components/MessageSidebar";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "../components/ProfileImage";
import {
  getAllMessages,
  sendMessage,
  subscribeMessages,
  unSubscribeMessages,
} from "../redux/slices/messageSlice";
import EmptyMessage from "../components/EmptyMessage";
import ChatInput from "../components/ChatInput";
import Modal from "../components/Modal";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const Message = () => {
  const dispatch = useDispatch();
  const { users, selectedUser, messages } = useSelector(
    (state) => state.messages,
  );
  const { user: currentUser } = useSelector((state) => state.user);

  const [chatMedia, setChatMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaIndex, setMediaIndex] = useState(0);

  const messageEndRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const mediaArr = messages
      .filter((m) => m.mediaUrl)
      .map((m) => ({ mediaUrl: m.mediaUrl, mediaType: m.mediaType }));
    setChatMedia(mediaArr);
  }, [messages]);

  const handleSend = (text, file) => {
    console.log("Text and file: ", text, file);
    if (!text.trim() && !file) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text);
    if (file) formData.append("media", file);
    dispatch(sendMessage(formData));
  };

  const openMediaModal = (msg) => {
    const index = chatMedia.findIndex((m) => m.mediaUrl === msg.mediaUrl);
    setMediaIndex(index >= 0 ? index : 0);
    setSelectedMedia(msg);
    setIsModalOpen(true);
    setIsPlaying(msg.mediaType === "video");
    setIsMuted(true);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
    setIsPlaying(false);
    setIsMuted(true);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const showPrev = mediaIndex > 0;
  const showNext = mediaIndex < chatMedia.length - 1;

  const handlePrev = () => {
    if (showPrev) {
      const prevIndex = mediaIndex - 1;
      setMediaIndex(prevIndex);
      setSelectedMedia(chatMedia[prevIndex]);
      setIsPlaying(chatMedia[prevIndex].mediaType === "video");
      setIsMuted(true);
    }
  };

  const handleNext = () => {
    if (showNext) {
      const nextIndex = mediaIndex + 1;
      setMediaIndex(nextIndex);
      setSelectedMedia(chatMedia[nextIndex]);
      setIsPlaying(chatMedia[nextIndex].mediaType === "video");
      setIsMuted(true);
    }
  };

  useEffect(() => {
    if (videoRef.current && selectedMedia?.mediaType === "video") {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [selectedMedia]);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getAllMessages(selectedUser?._id));
      dispatch(subscribeMessages());
    }
    return () => dispatch(unSubscribeMessages());
  }, [dispatch, selectedUser?._id]);

  return (
    <div className="flex min-h-screen bg-black">
      <MessageSidebar />

      <main className="rounded-xl text-white flex-1 w-full mx-auto flx flex-col gap-6 overflow-auto">
        <div className={`flex flex-col pl-20 md:pl-0 h-screen text-white`}>
          {selectedUser && (
            <div className="text-white sticky top-0 left-0 right-0 z-20 border-b border-white/10 py-5 flex justify-end px-5 md:px-8 items-center">
              <ProfileImage user={selectedUser} username />
            </div>
          )}

          {messages.length === 0 ? (
            <EmptyMessage selectedUser={selectedUser} />
          ) : (
            <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
              {messages?.map((msg, idx) => {
                const isSender = msg.senderId === currentUser?._id;
                return (
                  <div
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[60%] w-auto p-2 mt-2 rounded-xl ${isSender ? "bg-indigo-600 text-white" : "bg-gray-300 text-black"} space-y-2 cursor-pointer`}
                      onClick={() => msg?.mediaUrl && openMediaModal(msg)}
                    >
                      {msg.text && (
                        <p className="wrap-break-word">{msg.text}</p>
                      )}
                      {msg.mediaUrl && msg?.mediaType === "image" && (
                        <img
                          src={msg.mediaUrl}
                          alt="image"
                          className="w-full max-h-72 object-contain rounded-lg"
                        />
                      )}
                      {msg.mediaUrl && msg?.mediaType === "video" && (
                        <video
                          src={msg.mediaUrl}
                          alt="video"
                          className="w-full max-h-72 rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={messageEndRef} />
            </div>
          )}
          <ChatInput handleSend={handleSend} />
        </div>

        <Modal
          openModal={isModalOpen}
          onClose={closeMediaModal}
          showCloseBtn
          handlePrev={handlePrev}
          handleNext={handleNext}
          showBtn
        >
          <div className="flex items-center justify-center w-full h-full p-4">
            {selectedMedia?.mediaType === "image" && (
              <img
                src={selectedMedia.mediaUrl}
                alt="image"
                className="max-w-[90vh] max-h-[80vh] object-contain rounded-lg"
              />
            )}
            {selectedMedia?.mediaType === "video" && (
              <div className="relative">
                <video
                  src={selectedMedia?.mediaUrl}
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  onClick={togglePlayPause}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
                />

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                  {/* Play / Pause */}
                  <button onClick={togglePlayPause} className="text-white">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>

                  {/* Mute / Unmute */}
                  <button onClick={toggleMute} className="text-white">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Message;
