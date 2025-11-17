import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust the path if needed
const salesByCategory = [
	{ name: "Youtube", value: 400 },
	{ name: "Clients", value: 300 },
	{ name: "Reviews", value: 200 },
	{ name: "Commissions", value: 100 },
	{ name: "Others", value: 150 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

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
			<h2 className='text-xl font-semibold text-black-100 mb-4'>Sales by Category</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={salesByCategory}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{salesByCategory.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: isDark ? "rgba(31, 41, 55, 0.8)" : "#ffffff",
								borderColor: isDark ? "#4B5563" : "#d1d5db",
							}}
							itemStyle={{ color: isDark ? "#E5E7EB" : "#111827" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesByCategoryChart;
