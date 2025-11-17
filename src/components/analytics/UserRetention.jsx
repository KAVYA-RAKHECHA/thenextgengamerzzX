import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useGlobalState } from "../common/GlobalStateContext"; // Assuming you're using a global state for theme

const userRetentionData = [
	{ name: "Week 1", retention: 100 },
	{ name: "Week 2", retention: 75 },
	{ name: "Week 3", retention: 60 },
	{ name: "Week 4", retention: 50 },
	{ name: "Week 5", retention: 45 },
	{ name: "Week 6", retention: 40 },
	{ name: "Week 7", retention: 38 },
	{ name: "Week 8", retention: 35 },
];

const UserRetention = () => {
	const { theme } = useGlobalState(); // Access the theme from global state

	// Set dynamic classes based on the theme
	const backgroundClass = theme === "dark" ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80";
	const textColorClass = theme === "dark" ? "text-gray-100" : "text-gray-800";
	const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
	const gridStrokeColor = theme === "dark" ? "#374151" : "#E5E7EB";
	const axisStrokeColor = theme === "dark" ? "#9CA3AF" : "#4B5563";
	const tooltipBackgroundColor = theme === "dark" ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)";
	const tooltipBorderColor = theme === "dark" ? "#4B5563" : "#E5E7EB";
	const lineStrokeColor = "#8B5CF6"; // Retaining the same color for line, but can adjust based on theme if needed

	return (
		<motion.div
			className={`rounded-xl p-6 shadow-lg border ${backgroundClass} ${borderColorClass} mb-8`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<h2 className={`text-xl font-semibold ${textColorClass} mb-4`}>User Retention</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={userRetentionData}>
						<CartesianGrid strokeDasharray='3 3' stroke={gridStrokeColor} />
						<XAxis dataKey='name' stroke={axisStrokeColor} />
						<YAxis stroke={axisStrokeColor} />
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBackgroundColor,
								borderColor: tooltipBorderColor,
							}}
							itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#4B5563" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='retention' stroke={lineStrokeColor} strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default UserRetention;
