import { motion } from "framer-motion";
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { IndianRupee } from "lucide-react";

const ProductsPage = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<div className={`flex-1 overflow-auto relative z-10 ${isDark ? "bg-gray-800" : "bg-white-900"}`}>
			<Header title='Products' />

			<main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard isDark={isDark} name='Total Products' icon={Package} value={1234} color='#6366F1' />
					<StatCard isDark={isDark} name='Top Selling' icon={TrendingUp} value={89} color='#10B981' />
					<StatCard isDark={isDark} name='Low Stock' icon={AlertTriangle} value={23} color='#F59E0B' />
					<StatCard isDark={isDark} name='Total Revenue' icon={IndianRupee} value={"₹543,210"} color='#EF4444' />
				</motion.div>

				<ProductsTable isDark={isDark} />

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<SalesTrendChart isDark={isDark} />
					<CategoryDistributionChart isDark={isDark} />
				</div>
			</main>
		</div>
	);
};
export default ProductsPage;
