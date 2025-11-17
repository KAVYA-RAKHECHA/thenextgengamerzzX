import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGlobalState } from "../common/GlobalStateContext"; // Assuming you're using a global state for theme

const revenueData = [
	{ month: "Jan", revenue: 4000, target: 3800 },
	{ month: "Feb", revenue: 3000, target: 3200 },
	{ month: "Mar", revenue: 5000, target: 4500 },
	{ month: "Apr", revenue: 4500, target: 4200 },
	{ month: "May", revenue: 6000, target: 5500 },
	{ month: "Jun", revenue: 5500, target: 5800 },
	{ month: "Jul", revenue: 7000, target: 6500 },
];

const RevenueChart = () => {
	const { theme } = useGlobalState(); // Access the theme from global state
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

	// Set dynamic classes based on the theme
	const backgroundClass = theme === "dark" ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80";
	const textColorClass = theme === "dark" ? "text-gray-100" : "text-gray-800";
	const subTextColorClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
	const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
	const gridStrokeColor = theme === "dark" ? "#374151" : "#E5E7EB";
	const axisStrokeColor = theme === "dark" ? "#9CA3AF" : "#4B5563";
	const tooltipBackgroundColor = theme === "dark" ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)";
	const tooltipBorderColor = theme === "dark" ? "#4B5563" : "#E5E7EB";

	return (
		<motion.div
			className={`rounded-xl p-6 shadow-lg border ${backgroundClass} ${borderColorClass} mb-8`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className={`text-xl font-semibold ${textColorClass}`}>Revenue vs Target</h2>
				<select
					className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.value)}
				>
					<option>This Week</option>
					<option>This Month</option>
					<option>This Quarter</option>
					<option>This Year</option>
				</select>
			</div>

			<div style={{ width: "100%", height: 400 }}>
				<ResponsiveContainer>
					<AreaChart data={revenueData}>
						<CartesianGrid strokeDasharray='3 3' stroke={gridStrokeColor} />
						<XAxis dataKey='month' stroke={axisStrokeColor} />
						<YAxis stroke={axisStrokeColor} />
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBackgroundColor,
								borderColor: tooltipBorderColor,
							}}
							itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#4B5563" }}
						/>
						<Legend />
						<Area type='monotone' dataKey='revenue' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
						<Area type='monotone' dataKey='target' stroke='#10B981' fill='#10B981' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default RevenueChart;
