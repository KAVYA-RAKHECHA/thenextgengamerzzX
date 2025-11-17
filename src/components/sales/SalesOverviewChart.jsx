import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

const SalesOverviewChart = () => {
  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
	axios.get("http://localhost:3000/sales")
	  .then(response => {
		const { success, sales } = response.data;
  
		if (success && Array.isArray(sales)) {
		  const monthMap = Array(12).fill(0);
  
		  sales.forEach(entry => {
			const date = new Date(entry.createdAt || entry.orderOn); // ✅ use orderOn fallback
const currentYear = new Date().getFullYear();

if (!isNaN(date) && date.getFullYear() === currentYear) {
  const monthIndex = date.getMonth();
  if (monthIndex >= 0 && monthIndex < 12) {
    monthMap[monthIndex] += parseFloat(entry.orderAmt || 0); // ✅ safely parse
  }

			}
		  });
  
		  const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		  const formattedData = monthsOrder.map((month, i) => ({
			month,
			revenue: monthMap[i],
		  }));
  
		  setRevenueData(formattedData);
		  console.log("Processed Revenue Data:", formattedData);
		} else {
		  console.log("Revenue format incorrect or empty");
		}
	  })
	  .catch(error => {
		console.error("Failed to fetch revenue growth data:", error);
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
      <h2 className='text-xl font-semibold mb-4'>Revenue Overview (Current Year)</h2>
      <div className='h-[320px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={revenueData}>
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
              dataKey='revenue'
              stroke='#8B5CF6'
              fill='#8B5CF6'
              fillOpacity={0.3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;
