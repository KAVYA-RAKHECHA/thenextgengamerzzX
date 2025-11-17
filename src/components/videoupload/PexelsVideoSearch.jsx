import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { useGlobalState } from "../common/GlobalStateContext"; // Import GlobalStateContext

const PEXELS_API_KEY = "0uxAPyRJNN3Y6hmti0YtR4ZBYcqjmfgsvw2Gq7oPdpKbRpJAWc5qOyq8";
const API_URL = "https://api.pexels.com/videos/search";

const VideoSearch = () => {
    const { theme } = useGlobalState(); // Get theme from GlobalStateContext
  
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (reset = true, searchTerm = query || "trending") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}?query=${encodeURIComponent(searchTerm)}&per_page=9&page=${reset ? 1 : page}`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch from API");
      const data = await res.json();
      setVideos((prev) => (reset ? data.videos : [...prev, ...data.videos]));
      if (reset) setPage(2);
      else setPage((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(true, "trending"); // default load trending
  }, []);
  const isDark = theme === "dark"; // Check if the theme is dark

  return (
    <>
            <Header title={"Stock Video Elements"} />
    
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-cyan-600 text-center"></h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center">
       
        <input
          type="text"
          placeholder="Search by category (e.g. nature, technology...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-black"}`}
        />
       
        <button
          onClick={() => handleSearch(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          🔍 Search
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className={`bg-gray-900 border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${isDark ? "bg-gray-700 text-white" : "bg-gray-900 text-black"}`}
          >
            <div className="relative h-52 overflow-hidden">
              <video
                src={video.video_files[0]?.link}
                controls
                className="w-full h-full object-cover"
              ></video>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold text-blue-600 truncate mb-1">{video.user?.name || "Unknown Creator"}</h2>
              <p className="text-sm text-gray-600 mb-2">Duration: <span className="text-blue-500 font-medium">{video.duration}s</span></p>
              <div className="flex flex-col gap-2 mt-3">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  🔗 View Source
                </a>
                <a
                  href={video.video_files[0]?.link}
                  download={`thenextgengamerzzX_${video.user?.name?.replace(/\s+/g, "_") || "video"}`}
                  className="text-green-600 text-sm font-medium hover:underline"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length > 0 && !loading && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => handleSearch(false)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg rounded-full shadow-md hover:shadow-xl transition hover:scale-105"
          >
            ⬇️ Load More
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default VideoSearch;