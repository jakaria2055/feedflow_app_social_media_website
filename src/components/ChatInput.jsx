import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { Paperclip, SendHorizontal, Image, X } from "lucide-react";

const ChatInput = ({ handleSend }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const pickerRef = useRef();

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const handleChangeFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const sendMessage = () => {
    if (!message.trim() && !file) return;
    handleSend(message, file);
    setMessage("");
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
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

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className="sticky border-t border-gray-800/50 bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-black/90 backdrop-blur-md p-3 sm:p-4 flex flex-col gap-3">
      {/* File Preview */}
      {file && filePreview && (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50 shadow-lg group">
          {file?.type?.startsWith("image") ? (
            <img
              src={filePreview}
              alt="preview"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <video
              src={filePreview}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}

          <button
            onClick={() => {
              setFile(null);
              if (filePreview) {
                URL.revokeObjectURL(filePreview);
                setFilePreview(null);
              }
            }}
            className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md opacity-90 hover:opacity-100"
          >
            <X size={12} />
          </button>
          
          {/* File Type Badge */}
          <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5">
            <span className="text-[10px] text-white">
              {file?.type?.startsWith("image") ? "IMG" : "VID"}
            </span>
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="flex items-center gap-2 w-full">
        {/* Emoji & File Buttons */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-gray-400 hover:text-yellow-400 text-xl transition-all duration-200 hover:scale-110"
              aria-label="Add emoji"
            >
              😊
            </button>
            {showEmoji && (
              <div className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          
          <label className="cursor-pointer group" aria-label="Attach file">
            <Paperclip
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-[#E1306C] transition-all duration-200 group-hover:scale-110 cursor-pointer"
              strokeWidth={2}
            />
            <input type="file" accept="image/*,video/*" onChange={handleChangeFile} className="hidden" />
          </label>
        </div>

        {/* Text Input */}
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message..." 
          className="flex-1 bg-gray-800/50 text-white rounded-full px-4 py-2.5 outline-none placeholder-gray-500 focus:ring-2 focus:ring-[#E1306C] focus:border-transparent transition-all duration-200 border border-gray-700/50 text-sm sm:text-base"
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        
        {/* Send Button */}
        <button 
          onClick={sendMessage} 
          disabled={!message.trim() && !file}
          className="bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-3 sm:px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all duration-200 text-white flex items-center gap-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <SendHorizontal size={18} /> 
          <span className="hidden sm:inline text-sm">Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;