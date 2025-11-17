import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

const ClientGrowthChart = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	const [clientGrowthData, setClientGrowthData] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:3000/client-growth")
			.then(response => {
				let data = response.data;

				// If it's { success: true, clients: [...] } format
				if (data?.success && Array.isArray(data.clients)) {
					const monthMap = Array(12).fill(0);

					data.clients.forEach(client => {
						if (client.joinedAt) {
							const date = new Date(client.joinedAt);
							const currentYear = new Date().getFullYear();
							if (!isNaN(date) && date.getFullYear() === currentYear) {
								const monthIndex = date.getMonth();
								if (monthIndex >= 0 && monthIndex < 12) {
									monthMap[monthIndex]++;
								}
							}
						}
					});

					const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					data = monthsOrder.map((month, i) => ({
						month,
						clients: monthMap[i]
					}));
				}
				else{
					console.log('Mei jaa hi nhi paya')
				}
				console.log("Processed Client Growth Data:", data);
				setClientGrowthData(data);
			})
			.catch(error => {
				console.error("Failed to fetch client growth data:", error);
			});
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
			<h2 className='text-xl font-semibold mb-4'>Client Growth (Current Year)</h2>
			<div className='h-[320px]'>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart data={clientGrowthData}>
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
						<Line
							type='monotone'
							dataKey='clients' // Data from the backend
							stroke='#8B5CF6'
							strokeWidth={2}
							dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default ClientGrowthChart;
