import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useGlobalState } from "../common/GlobalStateContext"; // Import GlobalStateContext
import Header from "../common/Header";

function EsportsEvents() {
  const { theme } = useGlobalState(); // Get theme from GlobalStateContext
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const genAI = new GoogleGenerativeAI("AIzaSyB8oIsrc13ghyNU14QNX_xfdcS0eERQVME");

  // Fetch esports events
  useEffect(() => {
    const fetchEsportsData = async () => {
      setLoading(true);
      setError("");
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(`
          Generate a list of upcoming esports tournaments, their prize pools, and key details in the format:
          "Title: [Title], Date: [Date], Prize Pool: [Amount], Description: [Description]"
        `);

        const response = await result.response.text();
        
        // Example parsing for event details
        const eventDetails = response.split("\n").map((event) => {
          const match = event.match(/Title:(.*?), Date:(.*?), Prize Pool:(.*?), Description:(.*)/);
          if (match) {
            return {
              title: match[1]?.trim(),
              date: match[2]?.trim(),
              prizePool: match[3]?.trim(),
              description: match[4]?.trim(),
            };
          }
          return null;
        }).filter(Boolean); // Remove nulls
        
        setEvents(eventDetails);
      } catch (err) {
        console.error("Error fetching esports data:", err);
        setError("❌ Something went wrong while fetching the esports data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEsportsData();
  }, []);

  const isDark = theme === "dark"; // Check if the theme is dark

  return (
    <div className="container mx-auto px-4 py-6">
      <Header title={"Recent E-Sport Tournaments "} />
   

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white mt-5 dark:bg-[#14151b] border border-blue-500 dark:border-[#927552] rounded-2xl shadow-xl p-6 space-y-4 transition-all duration-300"
          >
            <h4 className="text-xl font-semibold text-blue-700 dark:text-[#ffc986]">{event.title}</h4>
            <p className="text-gray-800 font-bold dark:text-gray-200">{event.date}</p>
            <p className="text-gray-700 font-bold dark:text-gray-300">Prize Pool: {event.prizePool}</p>
            <p className="text-gray-600 font-bold dark:text-gray-400">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EsportsEvents;