// components/common/ThemeToggle.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const themeStyles = {
    light: {
      backgroundColor: "#ffffff",
      color: "#000000",
    },
    dark: {
      backgroundColor: "#202434",
      color: "#ffffff",
    },
  };

const ThemeToggle = () => {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") || "light";
		setTheme(savedTheme);
		document.documentElement.setAttribute("data-theme", savedTheme);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
	};



	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			onClick={toggleTheme}
			className="absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
		>
			{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
		</motion.button>
	);
};

export default ThemeToggle;
