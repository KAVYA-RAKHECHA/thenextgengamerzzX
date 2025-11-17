import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed

const AIPoweredInsights = () => {
  const [insights, setInsights] = useState([]);

  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchInsights = async () => {
      const apikey = '05b795b8f37c8d93925b1957f352dd04';
      const url = 'https://gnews.io/api/v4/search?q=gaming&lang=en&country=us&max=20&apikey=' + apikey;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("GNews API Response:", JSON.stringify(data, null, 2));
        const articles = data.articles;
        const mapped = articles.map((article) => ({
          title: article.title,
          description: article.description,
          image: article.image,
          publishedAt: article.publishedAt,
          url: article.url,
        }));
        setInsights(mapped);
      } catch (error) {
        console.error("Failed to fetch GNews insights:", error);
      }
    };

    fetchInsights();
  }, []);

  return (
    <motion.div
      className={`${
        isDark
          ? "bg-gradient-to-r from-indigo-900 via-gray-800 to-indigo-900"
          : "bg-gradient-to-r from-white via-gray-200 to-gray-300"
      } bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 max-w-screen-xl mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <h2 className='text-xl font-semibold text-black-100 mb-4'>Latest Gaming News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {insights.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700"
          >
            <img
              src={item.image || 'https://via.placeholder.com/600x300'}
              alt="News"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-blue-400 hover:underline"
                >
                  {item.title}
                </a>
                <span className="text-sm text-gray-400 ml-4 whitespace-nowrap">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Unknown Date"}
                </span>
              </div>
              <p className="text-gray-300 mt-2 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIPoweredInsights;