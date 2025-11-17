import React, { useEffect, useState, useRef } from "react";
import Header from "../common/Header";
import { useGlobalState } from "../common/GlobalStateContext"; // Import GlobalStateContext

const renderStars = (rating) => {
  const totalStars = 5; 
  const filledStars = Math.round(rating); 

  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <span
        key={i}
        className={`${i <= filledStars ? "text-yellow-500" : "text-gray-300"} inline-block text-xl`}
      >
        ★
      </span>
    );
  }
  return stars;
};

const GameSearch = () => {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { theme } = useGlobalState(); 

  const API_KEY = "efedbc1909584cf78c0aeb7460bd9b05";

  const isRequesting = useRef(false);

  const explicitKeywords = [
    "sex", "nudity", "porn", "adult", "explicit", "violence", "abuse", "rape", "fetish", "hentai", "masturbation",
    "pornography", "sexually explicit", "dirty talk", "peep", "nudist", "child pornography", "pedo", "incestuous", "abusive behavior", "porn addict"
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) {
      fetchGames(false); // Load more games if at the bottom
    }
  };

  const fetchGames = async (reset = true, searchTerm = debouncedQuery || "PC games") => {
    if (isRequesting.current) return;
    isRequesting.current = true;

    setLoading(true);
    setError(null);

    const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=9&page=${reset ? 1 : page}&platforms=4&search=${encodeURIComponent(searchTerm)}&ordering=-rating`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const filteredGames = data.results.filter(
        (game) =>
          !explicitKeywords.some((keyword) =>
            (game.name && game.name.toLowerCase().includes(keyword)) ||
            (game.description && game.description.toLowerCase().includes(keyword))
          ) &&
          new Date(game.released) <= new Date()
      );

      setGames((prev) => (reset ? filteredGames : [...prev, ...filteredGames]));
      setPage((prev) => (reset ? 2 : prev + 1));
    } catch (err) {
      setError("Failed to fetch games. Check API key or CORS setup.");
    } finally {
      setLoading(false);
      isRequesting.current = false;
    }
  };

  useEffect(() => {
    fetchGames(true, debouncedQuery);
  }, [debouncedQuery]);

  const isDark = theme === "dark";

  return (
    <>
      <Header title={"Top Rated Games "} />
      <div className={`p-6 max-w-screen-xl mx-auto ${isDark ? "bg-gray-800 text-white" : "bg-gray-300 text-black"}`} onScroll={handleScroll}>
        <div className={`flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
          <input
            type="text"
            placeholder="Search games like GTA 6..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full sm:w-1/2 px-5 py-3 border-2 ${isDark ? "border-gray-700 bg-[#1e1f26] text-white" : "border-gray-300 bg-white text-black"} rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={() => fetchGames(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "🔍 Search"
            )}
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading games...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {games.map((game) => (
    <div
      key={game.id}
      className={`bg-gray-900 border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${isDark ? "bg-gray-700 text-white" : "bg-gray-900 text-black"}`}
    >
      <img
        src={game.background_image}
        alt={game.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-lg font-semibold text-blue-600 truncate mb-2">
          {game.name}
        </h2>

        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {renderStars(game.rating)}
        </div>

        {/* Description */}
        <p className={`mt-2 text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {game.released ? `Released: ${game.released}` : "Release date unknown"}
        </p>

        {/* View Game Link */}
        <a
          href={`https://rawg.io/games/${game.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-all"
        >
          View Game →
        </a>
      </div>
    </div>
  ))}
</div>

        {/* Load More Button */}
        {!loading && !error && games.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={() => fetchGames(false)}
              className="px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-all"
            >
              Load More
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-success" role="status" />
          </div>
        )}
      </div>
    </>
  );
};

export default GameSearch;