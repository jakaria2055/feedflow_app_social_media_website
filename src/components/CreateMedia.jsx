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
    setIsDraging(false);
    handleFileSelect(e.dataTransfer.files[0]);
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
    <div className="flex w-full flex-col items-center gap-4 p-5">
      <div className="flex flex-col items-center gap-2 w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {titleMap[currentType]}
        </h2>
        {type !== "story" && (
          <div className="flex gap-4 w-full">
            <button
              type="button"
              className={`px-4 w-full py-2 rounded ${currentType === "post" ? "bg-purple-600 text-white" : "bg-gray-700 to-gray-300"}`}
              onClick={() => setCurrentType("post")}
            >
              Post
            </button>
            <button
              type="button"
              className={`px-4 w-full py-2 rounded ${currentType === "reel" ? "bg--600 text-white" : "bg-gray-700 to-gray-300"}`}
              onClick={() => setCurrentType("reel")}
            >
              Reel
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleUpload} className="space-y-5 w-full">
        {!previewUrl ? (
          <div
            onClick={handleClickDropArea}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full max-h-80 h-44 p-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${isDraging ? "border-purple-500 bg-purple-900/30" : "border-gray-600 hover:border-purple-400"}`}
          >
            <div className="flex flex-col items-center text-gray-400 space-y-2">
              <Upload size={36} className="text-purple-600" />
              <p className="text-center">
                {isDraging ? "Drop Your file here..." : "Click or Drag & Drop"}
              </p>

              <div className="flex items-center gap-6 mt-2">
                <div className="flex flex-col items-center">
                  <ImageIcon size={28} className="text-blue-400" />
                  <span className="text-xs">Image</span>
                </div>
                <div className="flex flex-col items-center">
                  <VideoIcon size={28} className="text-green-400" />
                  <span className="text-xs">Video</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-h-80 h-44 relative flex items-center justify-center rounded-xl overflow-hidden bg-gray-900/30">
            {file.type.startsWith("video/") ? (
              <>
                <video
                  ref={videoRef}
                  src={previewUrl}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />

                <div className=" absolute bottom-2 left-2 flex gap-2 bg-black/50 p-1 rounded">
                  <button
                    type="button"
                    onClick={() => {
                      if (!videoRef.current) return;

                      if (isPlaying) {
                        videoRef.current.pause();
                        setIsPlaying(false); //  important
                      } else {
                        videoRef.current.play();
                        setIsPlaying(true); //  important
                      }
                    }}
                    className="text-white p-1"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      videoRef.current.muted = !videoRef.current.muted;
                      setIsMuted(videoRef.current.muted);
                    }}
                    className="text-white p-1"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume size={20} />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-full object-contain rounded-xl"
                />
              </>
            )}
            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl("");
                (setIsMuted(false), setIsPlaying(false));
                if (fileInputRef.current) fileInputRef.current.value = null;
              }}
              type="button"
              className="absolute right-7 top-0 ring-2 bg-red-500 text-white rounded-full px-2.5 py-1 text-sm"
            >
              X
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
            className="w-full px-3 py-2 rounded-lg bg-gray-800 outline-none text-white"
          />
        )}
        {uploading && (
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-linear-to-r from-purple-500 to-pink-500 h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-2 py-2 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : buttonMap[currentType]}
        </button>
      </form>
    </div>
  );
};

export default CreateMedia;
