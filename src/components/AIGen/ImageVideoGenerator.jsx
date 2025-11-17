import React, { useState } from "react";
import { useGlobalState } from "../common/GlobalStateContext"; // Import GlobalStateContext

function ImagePromptUploader() {
  const [theme1, setTheme1] = useState("Fantasy");
  const [style, setStyle] = useState("Cinematic");
  const [emotion, setEmotion] = useState("Epic");
  const [promptText, setPromptText] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { theme } = useGlobalState(); // Get theme from GlobalStateContext

  const themes = ["Fantasy", "Sci-fi", "Cyberpunk"];
  const styles = ["Cinematic", "Anime", "Photorealistic"];
  const emotions = ["Epic", "Peaceful", "Exciting"];

  const generateImages = async () => {
    if (!promptText.trim()) return;
    setLoading(true);
    setGeneratedImages([]);

    const prompt = `An ${emotion.toLowerCase()} ${theme.toLowerCase()} scene in ${style.toLowerCase()} style: ${promptText}`;

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const responses = await Promise.all([
        fetch("https://clipdrop-api.co/text-to-image/v1", {
          method: "POST",
          headers: {
            "x-api-key": "a2573ac09f4bae311bbdddbf6f1289452f1e545895c06cd61e3eac9b6366db9f3795fda509ab20acc7383c514a020d47"
          },
          body: formData
        }),
        fetch("https://clipdrop-api.co/text-to-image/v1", {
          method: "POST",
          headers: {
            "x-api-key": "a2573ac09f4bae311bbdddbf6f1289452f1e545895c06cd61e3eac9b6366db9f3795fda509ab20acc7383c514a020d47"
          },
          body: formData
        }),
        fetch("https://clipdrop-api.co/text-to-image/v1", {
          method: "POST",
          headers: {
            "x-api-key": "a2573ac09f4bae311bbdddbf6f1289452f1e545895c06cd61e3eac9b6366db9f3795fda509ab20acc7383c514a020d47"
          },
          body: formData
        })
      ]);

      const blobs = await Promise.all(responses.map(r => r.blob()));
      const urls = blobs.map(blob => URL.createObjectURL(blob));
      setGeneratedImages(urls);
    } catch (err) {
      console.error("Error generating images:", err);
    } finally {
      setLoading(false);
    }
  };
  const isDark = theme === "dark"; // Check if the theme is dark

  return (
    <div className={`p-6 max-w-4xl mx-auto ${isDark ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"}`}>
      <h1 className="text-2xl font-bold mb-4"> AI Image Prompt Generator</h1>
  

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1 text-blue-500"> Theme</label>
          <select
            value={theme1}
            onChange={(e) => setTheme1(e.target.value)}
            className={`w-full border-2  border-gray-300 rounded-lg p-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
                : "bg-white text-black"
            }`}
          >
            {themes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-blue-500"> Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className={`w-full border-2  border-gray-300 rounded-lg p-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
                : "bg-white text-black"
            }`}
          >
            {styles.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block  font-semibold mb-1 text-blue-500">Emotion</label>
          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className={`w-full border-2  border-gray-300 rounded-lg p-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
                : "bg-white text-black"
            }`}
          >
            {emotions.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="block font-semibold mb-1">📝 Enter your image idea</label>
      <textarea
        rows="3"
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        className={`w-full border-2 border-gray-300  rounded-lg p-2 mb-4 ${
          isDark
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-white text-black"
        }`}
        placeholder="E.g. A mystical dragon soaring above icy mountains during sunset"
      />

      <button
        onClick={generateImages}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "✨ Generate Images"}
      </button>

      {generatedImages.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedImages.map((img, index) => (
            <div key={index} className="rounded overflow-hidden border">
              <img src={img} alt={`Generated ${index}`} className="w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImagePromptUploader;