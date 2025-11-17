import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { useGlobalState } from "../common/GlobalStateContext"; // Assuming you're using a global state for theme

const productPerformanceData = [
	{ name: "Product A", sales: 4000, revenue: 2400, profit: 2400 },
	{ name: "Product B", sales: 3000, revenue: 1398, profit: 2210 },
	{ name: "Product C", sales: 2000, revenue: 9800, profit: 2290 },
	{ name: "Product D", sales: 2780, revenue: 3908, profit: 2000 },
	{ name: "Product E", sales: 1890, revenue: 4800, profit: 2181 },
];

const ProductPerformance = () => {
	const { theme } = useGlobalState(); // Access the theme from global state

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
			className={`rounded-xl p-6 shadow-lg border ${backgroundClass} ${borderColorClass}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className={`text-xl font-semibold ${textColorClass} mb-4`}>Product Performance</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={productPerformanceData}>
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
						<Bar dataKey='sales' fill='#8B5CF6' />
						<Bar dataKey='revenue' fill='#10B981' />
						<Bar dataKey='profit' fill='#F59E0B' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ProductPerformance;
