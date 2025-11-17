import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useGlobalState } from "../../components/common/GlobalStateContext";

const UploadVideo = () => {
  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);  // Track if video is playing

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 50 * 1024 * 1024) setVideo(file); // Max 50MB
    else alert("Video file size must be under 50MB.");
  };
  const [videoType, setVideoType] = useState("Gaming Review");
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) setThumbnail(file); // Max 5MB
    else alert("Thumbnail must be under 5MB.");
  };

  const handleUpload = async () => {
    if (!video || !title || !description) {
      alert("Please fill in all fields and choose a video.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("description", description);
	formData.append("type", videoType); // 🟢 Add this line
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Upload successful ✔");
        setTitle("");
        setDescription("");
        setVideo(null);
        setThumbnail(null);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // Handle video play and remove thumbnail
  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setVideoPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`${
        isDark
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-black border-gray-200"
      } bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border w-full max-w-3xl mx-auto mt-10`}
    >
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">📤 Upload a New Video</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 text-sm font-medium">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title..."
            className={`w-full px-4 py-2 rounded-md border ${
              isDark ? "bg-gray-900 border-gray-600" : "bg-gray-100 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Write a short description..."
            className={`w-full px-4 py-2 rounded-md border ${
              isDark ? "bg-gray-900 border-gray-600" : "bg-gray-100 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
          />
        </div>
{/* Video Type */}
<div>
  <label className="block mb-1 text-sm font-medium">Video Type <span className="text-red-500">*</span></label>
  <select
    value={videoType}
    onChange={(e) => setVideoType(e.target.value)}
    className={`w-full px-4 py-2 border rounded-md ${
      isDark ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"
    } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
  >
    <option value="Gaming Review">🎮 Gaming Review</option>
    <option value="Trailer Reaction">📽️ Trailer Reaction</option>
    <option value="Podcast">🎧 Podcast</option>
    <option value="Gameplay">🕹️ Gameplay</option>
    <option value="News Update">📰 News Update</option>
    <option value="Esports Analysis">🏆 Esports Analysis</option>
  </select>
</div>
        {/* Video Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium">Upload Video File (max 50MB) <span className="text-red-500">*</span></label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="file:px-4 file:py-2 file:rounded-md file:border-0 file:font-semibold file:text-white file:bg-cyan-600 hover:file:bg-cyan-700"
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium">Thumbnail (jpg/png, max 5MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleThumbnailChange}
            className="file:px-4 file:py-2 file:rounded-md file:border-0 file:font-semibold file:text-white file:bg-emerald-500 hover:file:bg-emerald-600"
          />
        </div>

        {/* Upload Button */}
        {video && thumbnail && (
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md shadow transition-all duration-200 disabled:opacity-50"
            >
              {uploading ? (
                <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <UploadCloud size={18} />
              )}
              <span>{uploading ? "Uploading..." : "Upload"}</span>
            </button>
          </div>
        )}

        {/* Preview Section */}
        {(video && thumbnail && title && description) && (
          <div className="mt-8 p-4 rounded-lg border border-dashed border-cyan-400 ">
            <h3 className="text-lg font-semibold mb-2 text-cyan-500">📺 Preview</h3>

            <div className="mb-4 relative w-full max-w-xl">
              {/* Thumbnail on top of the video */}
              {thumbnail && !videoPlaying && (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail Overlay"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg opacity-70"
                />
              )}

              <video
                src={URL.createObjectURL(video)}
                controls
                className="w-full rounded-lg border border-gray-500 shadow-inner"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
              />
            </div>

            <div>
              <p className="text-sm"><span className="font-semibold text-black-700 dark:text-gray-300">Title:</span> {title || "Not Provided"}</p>
              <p className="text-sm mt-1"><span className="font-semibold text-black-700 dark:text-gray-300">Description:</span> {description || "Not Provided"}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadVideo;