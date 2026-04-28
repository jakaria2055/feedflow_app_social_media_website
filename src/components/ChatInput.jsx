import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { Paperclip, SendHorizontal } from "lucide-react";

const ChatInput = ({ handleSend }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const pickerRef = useRef();

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const handleChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessage = () => {
    if (!message.trim() && !file) return;
    handleSend(message, file);
    setMessage("");
    setFile(null);
  };

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  return (
    <div className="sticky border-t border-white/10 bottom-0 left-0 right-0 bg-black/50 p-2 sm:p-4 flex flex-col gap-2">
      {/* File Preview */}
      {file && (
        <div className="relative w-32 h-32 mb-2">
          {file?.type?.startsWith("image") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <video
              controls
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-full h-full rounded"
            />
          )}

          <button
            onClick={() => setFile(null)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
          >
            x
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="flex items-center gap-2 w-full">
        {/* Emoji File */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-gray-400 hover:text-yellow-400 text-xl"
            >
              😊
            </button>
            {showEmoji && (
              <div className="absolute bottom-12 left-0 z-50">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          <label className="cursor-pointer">
            <Paperclip
              className="h-6 w-6 text-gray-400 hover:text-indigo-500 cursor-pointer"
              strokeWidth={2}
            />
            <input type="file" onChange={handleChangeFile} className="hidden" />
          </label>
        </div>

        {/* Text Input */}
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type Message" className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 outline-none placeholder-gray-500 focus:ring-indigo-500 transition-all"/>
        <button onClick={sendMessage} className="bg-linear-to-r from-indigo-500 to-pink-500 px-3 sm:px-5 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition transform text-white flex items-center gap-1">
            <SendHorizontal /> <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
