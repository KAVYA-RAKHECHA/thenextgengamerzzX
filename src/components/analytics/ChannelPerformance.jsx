import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGlobalState } from "../common/GlobalStateContext"; // Import global state

const channelData = [
	{ name: "Organic Search", value: 4000 },
	{ name: "Paid Search", value: 3000 },
	{ name: "Direct", value: 2000 },
	{ name: "Social Media", value: 2780 },
	{ name: "Referral", value: 1890 },
	{ name: "Email", value: 2390 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const ChannelPerformance = () => {
	const { theme } = useGlobalState(); // Access theme from global state

	// Set background and text colors based on the current theme
	const backgroundClass = theme === "dark" ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80";
	const textColorClass = theme === "dark" ? "text-gray-100" : "text-gray-800";
	const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
	const tooltipBackground = theme === "dark" ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.9)";
	const tooltipBorder = theme === "dark" ? "#4B5563" : "#D1D5DB";
	const tooltipTextColor = theme === "dark" ? "#E5E7EB" : "#1F2937";

	return (
		<motion.div
			className={`rounded-xl p-6 shadow-lg border ${backgroundClass} ${borderColorClass}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className={`text-xl font-semibold ${textColorClass} mb-4`}>Channel Performance</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={channelData}
							cx="50%"
							cy="50%"
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{channelData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBackground,
								borderColor: tooltipBorder,
							}}
							itemStyle={{ color: tooltipTextColor }}
						/>
						<Legend wrapperStyle={{ color: textColorClass }} />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ChannelPerformance;
