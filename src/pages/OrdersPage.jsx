import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { IndianRupee } from "lucide-react";

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "₹98,765",
};

const OrdersPage = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<div className={`flex-1 relative z-10 overflow-auto ${isDark ? "bg-gray-800" : "bg-white-900"}`}>
			<Header title={"Projects"} />

			<main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard isDark={isDark} name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard isDark={isDark} name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
					<StatCard
						isDark={isDark}
						name='Completed Orders'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
					<StatCard isDark={isDark} name='Total Revenue' icon={IndianRupee} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<DailyOrders />
					<OrderDistribution />
				</div>

				<OrdersTable />
			</main>
		</div>
	);
};
export default OrdersPage;
