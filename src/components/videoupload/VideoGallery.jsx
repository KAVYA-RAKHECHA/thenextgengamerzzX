import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, UploadCloud } from "lucide-react";
import { useGlobalState } from "../common/GlobalStateContext";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [videoTypes, setVideoTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingIndex, setPlayingIndex] = useState(null);
  const { theme } = useGlobalState();
  const isDark = theme === "dark";

// Move fetchVideos out of useEffect for reuse
const fetchVideos = async () => {
  try {
    const res = await fetch("http://localhost:3000/videos");
    const data = await res.json();
    setVideos(data);
    setFilteredVideos(data);
    const types = ["All", ...new Set(data.map((v) => v.type || "Uncategorized"))];
    setVideoTypes(types);
  } catch (err) {
    console.error("Failed to fetch videos:", err);
  }
};

useEffect(() => {
  fetchVideos();
}, []);

  const applyFilters = (query, type) => {
    let filtered = [...videos];

    if (type !== "All") {
      filtered = filtered.filter((v) => v.type === type);
    }

    if (query.trim() !== "") {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }

    setFilteredVideos(filtered);
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    applyFilters(q, selectedType);
  };

  const handleFilterChange = (type) => {
    setSelectedType(type);
    applyFilters(searchQuery, type);
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this video?")) return;
  try {
    const res = await fetch(`http://localhost:3000/videos/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      await fetchVideos(); // Re-fetch to ensure full sync
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  const handleEdit = async (video) => {
    const newTitle = prompt("Edit title:", video.title);
    const newDescription = prompt("Edit description:", video.description);
    const newType = prompt("Edit type:", video.type || "Uncategorized");
    if (!newTitle || !newDescription || !newType) return;

    try {
      const res = await fetch(`http://localhost:3000/videos/${video._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription, type: newType }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = videos.map((v) =>
          v._id === video._id ? { ...v, title: newTitle, description: newDescription, type: newType } : v
        );
        setVideos(updated);
        applyFilters(searchQuery, selectedType);
      await fetchVideos(); // Re-fetch to ensure full sync

      }
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  return (
    <motion.div
      className={`${
        isDark
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-white via-gray-100 to-gray-200"
      } p-6 rounded-xl border border-gray-700 max-w-screen-xl mx-auto shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-cyan-500">View All Videos</h2>

      {/* Filter & Search */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="text-sm font-medium mr-2">Filter by Type:</label>
          <select
            value={selectedType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className={`px-4 py-2 rounded-md border ${isDark ? "bg-gray-900 text-white border-gray-600" : "bg-white border-gray-300 text-black"}`}
          >
            {videoTypes.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title or description..."
            className={`w-full px-4 py-2 rounded-md border ${isDark ? "bg-gray-900 text-white border-gray-600" : "bg-white border-gray-300 text-black"}`}
          />
        </div>
      </div>

      {/* Video Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video._id}
            className="relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative w-full pb-[56.25%] max-w-xl mx-auto mb-4 rounded-lg overflow-hidden">
              {/* Thumbnail Overlay */}
              {video.thumbnailUrl && playingIndex !== video._id && (
                <img
                  src={video.thumbnailUrl}
                  alt="Thumbnail Overlay"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 z-20 pointer-events-none"
                />
              )}
              <video
                src={video.cloudinaryUrl}
                controls
                className="absolute inset-0 w-full h-full object-cover rounded-lg border border-gray-500 shadow-inner z-10"
                onPlay={() => setPlayingIndex(video._id)}
                onPause={() => setPlayingIndex(null)}
              />
            </div>

            <div className="p-4 text-gray-300">
              <h3 className="text-lg font-semibold text-white truncate">{video.title}</h3>
              <p className="text-sm text-gray-400 mt-1 truncate">{video.description}</p>
              <p className="text-xs text-cyan-400 italic mt-1">Type: {video.type || "Uncategorized"}</p>
              <p className="text-xs text-gray-500 mt-1">Uploaded by: <span className="font-medium">{video.uploadedBy || "Unknown"}</span></p>
              <p className="text-xs text-gray-500">At: {new Date(video.uploadedAt).toLocaleString()}</p>

              <div className="flex gap-4 mt-3 text-sm text-white">
                <button onClick={() => handleEdit(video)} className="flex items-center gap-1 hover:text-blue-400">
                  <Pencil size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(video._id)} className="flex items-center gap-1 hover:text-red-400">
                  <Trash2 size={16} /> Delete
                </button>
                {/* <button className="flex items-center gap-1 hover:text-green-400">
                  <UploadCloud size={16} /> Upload
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default VideoGallery;