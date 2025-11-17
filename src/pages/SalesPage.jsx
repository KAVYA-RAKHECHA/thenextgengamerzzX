import { motion } from "framer-motion";
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed
import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";

import { IndianRupee } from "lucide-react";

const SalesPage = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	const [totalRevenue, setTotalRevenue] = useState("₹0");
	const [averageOrderValue, setAverageOrderValue] = useState("₹0");
	const [happyCustomers, setHappyCustomers] = useState("0");
	const [salesGrowth, setSalesGrowth] = useState("0%");

	useEffect(() => {
		axios.get("http://localhost:3000/sales").then(response => {
			const { success, sales } = response.data;
			if (success && Array.isArray(sales)) {
				let totalAmt = 0;
				const amounts = sales.map(s => {
					const amt = parseFloat(s.orderAmt || 0);
					totalAmt += amt;
					return { ...s, orderAmt: amt };
				});

			
				const formatIndianCompact = (amount) => {
				  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
				  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
				  return `₹${amount.toLocaleString()}`;
				};
				const avg = sales.length ? totalAmt / sales.length : 0;
				setTotalRevenue(`${formatIndianCompact(totalAmt)}`);
				setHappyCustomers(sales.length.toString());
				setAverageOrderValue(formatIndianCompact(avg));

				const sorted = amounts.sort((a, b) => new Date(a.orderOn) - new Date(b.orderOn));
				const recent4 = sorted.slice(-4);
				const [first, second, third, fourth] = recent4;
				const last2 = (first?.orderAmt || 0) + (second?.orderAmt || 0);
				const next2 = (third?.orderAmt || 0) + (fourth?.orderAmt || 0);
				const growth = last2 === 0 ? "∞%" : `${((next2 / last2) * 100).toFixed(2)}%`;
				setSalesGrowth(growth);
			}
		});
	}, []);

	return (
		<div className={`flex-1 overflow-auto relative z-10 ${isDark ? "bg-gray-800" : "bg-white-900"}`}>
			<Header title='Sales Dashboard' />

			<main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
				{/* SALES STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard isDark={isDark} name='Total Revenue' icon={IndianRupee} value={totalRevenue} color='#6366F1' />
					<StatCard isDark={isDark} name='Avg. Order Value' icon={ShoppingCart} value={averageOrderValue} color='#10B981' />
					<StatCard isDark={isDark} name='Happy Customers' icon={TrendingUp} value={happyCustomers} color='#F59E0B' />
					<StatCard isDark={isDark} name='Sales Growth' icon={CreditCard} value={salesGrowth} color='#EF4444' />
				</motion.div>

				<SalesOverviewChart isDark={isDark} />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<SalesByCategoryChart isDark={isDark} />
				</div>
			</main>
		</div>
	);
};
export default SalesPage;
