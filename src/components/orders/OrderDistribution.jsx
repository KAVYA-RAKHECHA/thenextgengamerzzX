import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useGlobalState } from "../common/GlobalStateContext"; // Importing the GlobalStateContext to access the theme

const orderStatusData = [
	{ name: "Pending", value: 30 },
	{ name: "Processing", value: 45 },
	{ name: "Shipped", value: 60 },
	{ name: "Delivered", value: 120 },
];
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

const OrderDistribution = () => {
	const { theme } = useGlobalState(); // Access the theme from global state

	// Set dynamic classes based on the theme
	const backgroundClass = theme === "dark" ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80";
	const textColorClass = theme === "dark" ? "text-gray-100" : "text-gray-800";
	const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
	const tooltipBackgroundColor = theme === "dark" ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)";
	const tooltipBorderColor = theme === "dark" ? "#4B5563" : "#E5E7EB";

	return (
		<motion.div
			className={`rounded-xl p-6 shadow-lg border ${backgroundClass} ${borderColorClass} mb-8`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className={`text-xl font-semibold ${textColorClass} mb-4`}>Order Status Distribution</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={orderStatusData}
							cx="50%"
							cy="50%"
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{orderStatusData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBackgroundColor,
								borderColor: tooltipBorderColor,
							}}
							itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#4B5563" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default OrderDistribution;
