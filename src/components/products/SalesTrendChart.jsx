import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed

// Example data could be fetched or updated dynamically
const fetchSalesData = () => {
	return [
		{ month: "Jan", sales: 4000 },
		{ month: "Feb", sales: 3000 },
		{ month: "Mar", sales: 5000 },
		{ month: "Apr", sales: 4500 },
		{ month: "May", sales: 6000 },
		{ month: "Jun", sales: 5500 },
	];
};

const SalesTrendChart = () => {
	// State hook to manage sales data
	const [salesData, setSalesData] = useState([]);
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	useEffect(() => {
		// Simulate fetching data (you can replace it with actual API calls)
		const data = fetchSalesData();
		setSalesData(data);
	}, []);

	return (
		<motion.div
			className={`${
				isDark
					? "bg-gray-800 text-white border-gray-700"
					: "bg-white text-black border-gray-200"
			} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold mb-4'>Sales Trend</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={salesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: isDark ? "rgba(31, 41, 55, 0.8)" : "#ffffff",
								borderColor: isDark ? "#4B5563" : "#d1d5db",
							}}
							itemStyle={{ color: isDark ? "#E5E7EB" : "#111827" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='sales' stroke='#8B5CF6' strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesTrendChart;
