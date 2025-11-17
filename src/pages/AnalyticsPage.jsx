import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed
import Header from "../components/common/Header";

import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";
import ProductPerformance from "../components/analytics/ProductPerformance";
import UserRetention from "../components/analytics/UserRetention";
import CustomerSegmentation from "../components/analytics/CustomerSegmentation";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";

const AnalyticsPage = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<div className={`flex-1 overflow-auto relative z-10 ${isDark ? "bg-gray-800" : "bg-white-900"}`}>
			<Header title={"Analytics Dashboard"} />

			<main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
				<OverviewCards isDark={isDark} />
				<RevenueChart isDark={isDark} />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ChannelPerformance isDark={isDark} />
					<ProductPerformance isDark={isDark} />
					<UserRetention isDark={isDark} />
					<CustomerSegmentation isDark={isDark} />
				</div>

				<AIPoweredInsights isDark={isDark} />
			</main>
		</div>
	);
};
export default AnalyticsPage;
