import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useDispatch } from "react-redux";
import { getAllStories } from "../redux/slices/storiesSlice";
import {
  ImageIcon,
  Pause,
  Play,
  Upload,
  VideoIcon,
  Volume,
  VolumeX,
} from "lucide-react";
import { getAllReels } from "../redux/slices/reelSlice";

const CreateMedia = ({ type = "post", onClose }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [currentType, setCurrentType] = useState(type);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDraging, setIsDraging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setFile(null);
    setCaption("");
    setPreviewUrl(null);
    setProgress(0);
    setError(null);
    setIsPlaying(false);
    setIsMuted(false);
  }, [type]);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleFileChange = (e) => handleFileSelect(e.target.files[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraging(true);
  };
  const handleDragLeave = () => setIsDraging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };
  const handleClickDropArea = () => fileInputRef.current?.click();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("media", file);

      if (currentType !== "story") formData.append("caption", caption);
      formData.append(
        "mediaType",
        file.type.startsWith("video/") ? "video" : "image",
      );

      const apiEndpoint =
        currentType === "story"
          ? `story/create`
          : currentType === "post"
            ? `post/create`
            : `reel/create`;

      const { data } = await axiosInstance.post(apiEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ProgressEvent) =>
          setProgress(
            Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total,
          ),
      });

      if (data.success) {
        currentType === "story" ? dispatch(getAllStories()) : dispatch(getAllReels());
        onClose();
        setFile(null);
        setCaption("");
        setPreviewUrl(null);
        setProgress(0);
        setError(null);
        setIsPlaying(false);
        setIsMuted(false);
        if (fileInputRef.current) fileInputRef.current.value = null;
      } else {
        setError(data?.message || "Upload Failed");
      }
    } catch (error) {
      console.log("Error: ", error);
      setError(error?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const titleMap = {
    story: "Create a New Story",
    post: "Create a New Post",
    reel: "Create a New Reel",
  };
  const buttonMap = {
    story: "Upload Story",
    post: "Upload Post",
    reel: "Upload Reel",
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl">
      <div className="flex flex-col items-center gap-3 w-full">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent text-center mb-1">
          {titleMap[currentType]}
        </h2>
        {type !== "story" && (
          <div className="flex gap-3 w-full p-1 bg-gray-800/30 rounded-xl">
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentType === "post" 
                  ? "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white shadow-lg shadow-pink-500/20" 
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
              onClick={() => setCurrentType("post")}
            >
              Post
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentType === "reel" 
                  ? "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white shadow-lg shadow-pink-500/20" 
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
              onClick={() => setCurrentType("reel")}
            >
              Reel
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleUpload} className="space-y-6 w-full">
        {!previewUrl ? (
          <div
            onClick={handleClickDropArea}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full max-h-80 h-48 p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-300 ${
              isDraging 
                ? "border-[#E1306C] bg-[#E1306C]/10 shadow-lg shadow-pink-500/20" 
                : "border-gray-600 hover:border-[#833AB4] hover:bg-gray-800/30"
            }`}
          >
            <div className="flex flex-col items-center text-gray-400 space-y-3">
              <div className="p-1 m-2 rounded-full bg-gradient-to-br from-[#833AB4]/20 to-[#E1306C]/20">
                <Upload size={32} className="text-[#E1306C]" />
              </div>
              <p className="text-center text-gray-300 font-medium">
                {isDraging ? "Drop Your file here..." : "Click or Drag & Drop"}
              </p>
              <p className="text-xs text-gray-500">Supports images and videos</p>

              <div className="flex items-center gap-8 mt-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <ImageIcon size={24} className="text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-400">Image</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <VideoIcon size={24} className="text-green-400" />
                  </div>
                  <span className="text-xs text-gray-400">Video</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-h-80 h-48 relative flex items-center justify-center rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
            {file.type.startsWith("video/") ? (
              <>
                <video
                  ref={videoRef}
                  src={previewUrl}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />

                <div className="absolute bottom-3 left-3 flex gap-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      if (!videoRef.current) return;

                      if (isPlaying) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        videoRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="text-white p-1.5 hover:bg-white/20 rounded-md transition-all duration-200"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      videoRef.current.muted = !videoRef.current.muted;
                      setIsMuted(videoRef.current.muted);
                    }}
                    className="text-white p-1.5 hover:bg-white/20 rounded-md transition-all duration-200"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume size={18} />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-full object-contain rounded-lg"
                />
              </>
            )}
            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl("");
                setIsMuted(false);
                setIsPlaying(false);
                if (fileInputRef.current) fileInputRef.current.value = null;
              }}
              type="button"
              className="absolute right-3 top-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-all duration-200 shadow-lg"
            >
              ×
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*, video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        
        {currentType !== "story" && (
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50 outline-none text-white placeholder-gray-500 focus:border-[#E1306C] focus:ring-1 focus:ring-[#E1306C] transition-all duration-200"
          />
        )}
        
        {uploading && (
          <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        {error && (
          <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
            {error}
          </p>
        )}
        
        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full rounded-xl bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] py-2.5 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading...
            </span>
          ) : (
            buttonMap[currentType]
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateMedia;