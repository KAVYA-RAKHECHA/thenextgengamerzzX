import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGlobalState } from "../common/GlobalStateContext"; // Importing the GlobalStateContext to access the theme

const dailyOrdersData = [
	{ date: "07/01", orders: 45 },
	{ date: "07/02", orders: 52 },
	{ date: "07/03", orders: 49 },
	{ date: "07/04", orders: 60 },
	{ date: "07/05", orders: 55 },
	{ date: "07/06", orders: 58 },
	{ date: "07/07", orders: 62 },
];

const DailyOrders = () => {
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
			transition={{ delay: 0.2 }}
		>
			<h2 className={`text-xl font-semibold ${textColorClass} mb-4`}>Daily Orders</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={dailyOrdersData}>
						<CartesianGrid strokeDasharray='3 3' stroke={gridStrokeColor} />
						<XAxis dataKey='date' stroke={axisStrokeColor} />
						<YAxis stroke={axisStrokeColor} />
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBackgroundColor,
								borderColor: tooltipBorderColor,
							}}
							itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#4B5563" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='orders' stroke={lineStrokeColor} strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default DailyOrders;
