import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useGlobalState } from "../common/GlobalStateContext"; // Import GlobalStateContext

function GeminiInReact() {
  const [inputValue, setInputValue] = useState("");    const { theme } = useGlobalState(); // Get theme from GlobalStateContext
  
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const genAI = new GoogleGenerativeAI(
    "AIzaSyB8oIsrc13ghyNU14QNX_xfdcS0eERQVME"
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };

  const getResponseForGivenPrompt = async () => {
    if (!inputValue.trim()) {
      setError("⚠️ Please enter a valid prompt.");
      return;
    }

    setLoading(true);
    setResponseData(null);
    setError("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(`
        Generate a title, description, and hashtags based on this prompt:
        "${inputValue}"

        Format the response like this:
        Title: ...
        Description: 
        Hashtags: 
      `);

      const response = await result.response.text();

      // Optional: Parse response
      const title = response.match(/Title:(.*)/)?.[1]?.trim() || "N/A";
      const description =
        response.match(/Description:(.*)/)?.[1]?.trim() || "N/A";
      const hashtags = response.match(/Hashtags:(.*)/)?.[1]?.trim() || "N/A";

      setResponseData({ title, description, hashtags });
    } catch (err) {
      console.error("Error generating content:", err);
      setError("❌ Something went wrong while generating the response.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") getResponseForGivenPrompt();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };
  const isDark = theme === "dark"; // Check if the theme is dark

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-center text-2xl font-bold text-blue-600 dark:text-[#ffc986] mb-6">
         Title & Hashtag Generator
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className={`w-full sm:flex-1 rounded-full border-2 border-gray-300 dark:border-[#ffc986] px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
              : "bg-white text-black"
          }`}
          placeholder="Enter your content idea or prompt..."
        />
        <button
          onClick={getResponseForGivenPrompt}
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Generate"
          )}
        </button>
      </div>

      {error && (
        <div className="text-center text-yellow-700 bg-yellow-100 dark:bg-[#332f24] dark:text-[#ffc986] px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center my-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {responseData && (
        <div className="bg-white dark:bg-[#14151b] border border-blue-500 dark:border-[#927552] rounded-2xl shadow-xl p-6 md:p-8 space-y-6 transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-[#ffc986] text-xl"></div>
            <div>
              <h5 className="text-lg font-semibold text-blue-700 dark:text-[#ffc986]">
                Title
              </h5>
              <p className="mt-1 text-gray-800 dark:text-gray-200 text-base">
                {responseData.title}
              </p>
              <button
                onClick={() => copyToClipboard(responseData.title)}
                className="text-blue-500 text-sm mt-2"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-blue-500 dark:text-[#ffc986] text-xl"></div>
            <div>
              <h6 className="text-blue-700 text-lg font-semibold dark:text-gray-300">
                Description
              </h6>
              <p className="mt-1 text-gray-700 dark:text-gray-200 text-base">
                {responseData.description}
              </p>
              <button
                onClick={() => copyToClipboard(responseData.description)}
                className="text-blue-500 text-sm mt-2"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-pink-500 dark:text-[#ffc986] text-xl"></div>
            <div>
              <h6 className="text-blue-700 text-lg font-semibold dark:text-gray-300">
                Hashtags
              </h6>
              <p className="mt-1 text-gray-700 dark:text-gray-200 text-base">
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => alert("Hashtags clicked!")}
                >
                  {responseData.hashtags}
                </span>
              </p>
              <button
                onClick={() => copyToClipboard(responseData.hashtags)}
                className="text-blue-500 text-sm mt-2"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeminiInReact;