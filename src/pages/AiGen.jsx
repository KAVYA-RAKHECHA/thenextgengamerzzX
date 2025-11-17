import { useState } from "react";
import { useGlobalState } from "../components/common/GlobalStateContext";
import Header from "../components/common/Header";

import ThumbnailGenerator from "../components/AIGen/ThumbnailGenerator";
import TitleDescriptionGenerator from "../components/AIGen/TitleDescriptionGenerator";
import ImageVideoGenerator from "../components/AIGen/ImageVideoGenerator";
import ScriptGenerator from "../components/AIGen/ScriptGenerator";

import { motion, AnimatePresence } from "framer-motion";

const tabs = [
    { id: "thumbnail", label: "Thumbnail Generator" },
    { id: "title", label: "Title & Hashtag Generator" },
    { id: "media", label: "AI Image Generator" },
    { id: "script", label: "Script Generator" },
];

const AiGen = () => {
    const { theme } = useGlobalState();
    const isDark = theme === "dark";
    const [activeTab, setActiveTab] = useState("thumbnail");

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "thumbnail":
                return <ThumbnailGenerator />;
            case "title":
                return <TitleDescriptionGenerator />;
            case "media":
                return <ImageVideoGenerator />;
            case "script":
                return <ScriptGenerator />;
            default:
                return null;
        }
    };

    return (
        <div className={`flex-1 relative z-10 overflow-auto ${isDark ? "bg-gray-800" : "bg-white-900"}`}>
            <Header title={"Inspiration Hub"} />

            {/* Tabs */}
            <div className={`flex px-6 pt-0 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative py-3 px-6 text-sm font-medium transition-colors duration-300
                            ${activeTab === tab.id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 hover:text-blue-500"}
                        `}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="underline"
                                className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-400"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Switcher with Slide Animation */}
            <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -30, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderActiveComponent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AiGen;
