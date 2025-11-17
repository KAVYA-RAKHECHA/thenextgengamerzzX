import { BarChart2, ShoppingCart, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed
import { IndianRupee } from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const OverviewPage = () => {
	const [totalClients, setTotalClients] = useState(0);

	 const [totalUsers, setTotalUsers] = useState(0);
	const { theme } = useGlobalState();
	const isDark = theme === "dark";
	useEffect(() => {
		const fetchUserStats = async () => {
		  try {
			const response = await axios.get("http://localhost:3000/users");
			const users = response.data.users;
  console.log('usern', users.length)
			setTotalUsers(users.length);
		}catch (error) {
			console.error("Failed to fetch stats:", error);
		  }
  }
  fetchUserStats()
  console.log('user', totalUsers)
}, );
useEffect(() => {
    const fetchClientStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/clients");
        const clients = response.data.clients;

        setTotalClients(clients.length);
	  }catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchClientStats();
  }, );

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
			<Header title='Overview' />

			<main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
				        <StatCard
            isDark={isDark}
            name="Total Employee"
            icon={Users}
            value={totalUsers.toLocaleString()}
            color="#6366F1"
          />
					    <StatCard
            isDark={isDark}
            name="Total Clients"
            icon={Users}
            value={totalClients.toLocaleString()}
            color="#6366F1"
          />
										<StatCard isDark={isDark} name='Total Revenue' icon={IndianRupee} value={totalRevenue} color='#6366F1' />
										<StatCard isDark={isDark} name='Avg. Order Value' icon={ShoppingCart} value={averageOrderValue} color='#10B981' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart isDark={isDark} />
					<CategoryDistributionChart isDark={isDark} />
					<SalesChannelChart isDark={isDark} />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
