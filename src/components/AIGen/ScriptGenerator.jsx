import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useGlobalState } from "../common/GlobalStateContext"; // Import GlobalStateContext

function ScriptGeneration() {
  const [inputValue, setInputValue] = useState("");
  const [contentType, setContentType] = useState("Gaming Video");
  const [theme1, setTheme1] = useState("Action-packed");
  const [emotion, setEmotion] = useState("Exciting");
  const [responseData, setResponseData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useGlobalState(); // Get theme from GlobalStateContext

  const genAI = new GoogleGenerativeAI(
    "AIzaSyB8oIsrc13ghyNU14QNX_xfdcS0eERQVME"
  ); // Replace with your actual API key

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };

  const cleanResponse = (response) => {
    // Remove unwanted characters
    return response.replace(/[`*#_]/g, "").trim();
  };

  const getResponseForGivenPrompt = async () => {
    if (!inputValue.trim()) {
      setError("⚠ Please enter a valid prompt.");
      return;
    }

    setLoading(true);
    setResponseData("");
    setError("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(`
        Generate a complete script for a ${contentType.toLowerCase()} with the theme "${theme}" and emotion "${emotion}".
        The prompt or idea is: "${inputValue}"
        Only answer if it's gaming related. Else respond: Prompt not related.
      `);

      const response = await result.response.text();
      const cleanedResponse = cleanResponse(response); // Clean unwanted characters
      setResponseData(cleanedResponse);
    } catch (err) {
      console.error("Error generating content:", err);
      setError("❌ Something went wrong while generating the script.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") getResponseForGivenPrompt();
  };
  const isDark = theme === "dark"; // Check if the theme is dark

  return (
    <div className={`container box-center py-10 px-3 ${isDark ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"}`}>
      <div className="text-center mb-5">
       
        <p
          className="mt-2 text-gray-500 text-lg mx-auto"
          style={{ fontSize: "1.1rem" }}
        >
          Turn your ideas into epic content! Whether it's a tutorial, stream
          highlight, or esports moment — we’ve got your back.
        </p>
      </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="mb-4">
        <label className="block text-lg font-semibold text-blue-500">
           Content Type
        </label>
        <select
            className={`w-full border-2  border-gray-300 rounded-lg p-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
                : "bg-white text-black"
            }`}
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="Gaming Video">Gaming Video</option>
          <option value="Podcast">Podcast</option>
          <option value="Esports Clip">Esports Clip</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Livestream Highlight">Livestream Highlight</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold text-blue-500">
           Theme
        </label>
        <select
           className={`w-full border-2  border-gray-300 rounded-lg p-2 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
              : "bg-white text-black"
          }`}
          value={theme1}
          onChange={(e) => setTheme1(e.target.value)}
        >
          <option value="Action-packed">Action-packed</option>
          <option value="Comedic">Comedic</option>
          <option value="Intense">Intense</option>
          <option value="Chill">Chill</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold text-blue-500">
           Emotion
        </label>
        <select
            className={`w-full border-2  border-gray-300 rounded-lg p-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
                : "bg-white text-black"
            }`}
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
        >
          <option value="Exciting">Exciting</option>
          <option value="Serene">Serene</option>
          <option value="Nostalgic">Nostalgic</option>
          <option value="Adventurous">Adventurous</option>
        </select>
      </div>
      </div>
      <div className="mb-4 shadow-sm flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className={`w-full border-2 border-gray-300  rounded-lg p-2 mb-4 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
              : "bg-white text-black"
          }`}
          placeholder={`💡 Enter your ${contentType.toLowerCase()} idea or prompt...`}
          style={{ fontSize: "1.05rem" }}
        />
        <button
          onClick={getResponseForGivenPrompt}
          className="btn btn-success rounded-r-lg px-6 py-2 bg-blue-500 text-white font-semibold hover:bg-green-600 disabled:bg-gray-400 transition-all duration-200 ease-in-out"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-warning text-center rounded-3">{error}</div>
      )}

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-success" role="status" />
        </div>
      )}

      {responseData && (
        <div className="mb-5 bg-white border-2 border-gray-200 rounded-lg shadow-md">
          <div className="p-5">
            <h5 className="text-2xl font-semibold text-blue-700 mb-3">
              🧠 Generated Script
            </h5>
            <pre
              className="text-gray-800 bg-gray-100 p-4 rounded-lg"
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {responseData}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScriptGeneration;