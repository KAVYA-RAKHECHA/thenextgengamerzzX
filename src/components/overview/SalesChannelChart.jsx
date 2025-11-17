import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useGlobalState } from "../common/GlobalStateContext"; // ✅ access global state for theme

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const SALES_CHANNEL_DATA = [
	{ name: "Website", value: 45600 },
	{ name: "Mobile App", value: 38200 },
	{ name: "Marketplace", value: 29800 },
	{ name: "Social Media", value: 18700 },
];

const SalesChannelChart = () => {
	const { theme } = useGlobalState(); // ✅ access theme

	return (
		<motion.div
			className={`${
				theme === "dark" ? "bg-gray-800 bg-opacity-50 text-gray-100" : "bg-white bg-opacity-70 text-gray-800"
			} backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border ${
				theme === "dark" ? "border-gray-700" : "border-gray-300"
			}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-lg font-medium mb-4'>
				Sales by Channel
			</h2>

			<div className='h-80'>
				<ResponsiveContainer>
					<BarChart data={SALES_CHANNEL_DATA}>
						<CartesianGrid strokeDasharray='3 3' stroke={theme === "dark" ? "#4B5563" : "#D1D5DB"} />
						<XAxis dataKey='name' stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} />
						<YAxis stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} />
						<Tooltip
							contentStyle={{
								backgroundColor: theme === "dark" ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.9)",
								borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
							}}
							itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#1F2937" }}
						/>
						<Legend />
						<Bar dataKey={"value"} fill='#8884d8'>
							{SALES_CHANNEL_DATA.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesChannelChart;
