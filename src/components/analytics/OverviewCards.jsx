import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useGlobalState } from "../common/GlobalStateContext"; // Import global state
import { IndianRupee } from "lucide-react";

const overviewData = [
	{ name: "Revenue", value: "₹1,234,567", change: 12.5, icon: IndianRupee },
	{ name: "Users", value: "45,678", change: 8.3, icon: Users },
	{ name: "Orders", value: "9,876", change: -3.2, icon: ShoppingBag },
	{ name: "Page Views", value: "1,234,567", change: 15.7, icon: Eye },
];

const OverviewCards = () => {
	const { theme } = useGlobalState(); // Access the theme from global state

	// Set the background, text, and icon styles based on the current theme
	const backgroundClass = theme === "dark" ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80";
	const textColorClass = theme === "dark" ? "text-gray-100" : "text-gray-800";
	const subTextColorClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
	const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
	const iconBackgroundClass = theme === "dark" ? "bg-opacity-20" : "bg-opacity-10";
	const positiveChangeColor = theme === "dark" ? "text-green-500" : "text-green-600";
	const negativeChangeColor = theme === "dark" ? "text-red-500" : "text-red-600";

	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
			{overviewData.map((item, index) => (
				<motion.div
					key={item.name}
					className={`rounded-xl p-6 shadow-lg border ${backgroundClass} ${borderColorClass}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<div className="flex items-center justify-between">
						<div>
							<h3 className={`text-sm font-medium ${subTextColorClass}`}>{item.name}</h3>
							<p className={`mt-1 text-xl font-semibold ${textColorClass}`}>{item.value}</p>
						</div>

						<div
							className={`p-3 rounded-full ${iconBackgroundClass} ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}`}
						>
							<item.icon
								className={`size-6 ${item.change >= 0 ? positiveChangeColor : negativeChangeColor}`}
							/>
						</div>
					</div>
					<div className={`mt-4 flex items-center ${item.change >= 0 ? positiveChangeColor : negativeChangeColor}`}>
						{item.change >= 0 ? <ArrowUpRight size="20" /> : <ArrowDownRight size="20" />}
						<span className="ml-1 text-sm font-medium">{Math.abs(item.change)}%</span>
						<span className={`ml-2 text-sm ${subTextColorClass}`}>vs last period</span>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default OverviewCards;
