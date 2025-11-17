import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed
import ProjectBoard from "../components/ProjectManagement/ProjectBoard";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";

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
        <div className={`flex-1 relative z-10 overflow-auto ${isDark ? "bg-gray-800 border-gray-50" : "bg-white-900 border-gray-500"}`}>
            <Header title={"Project Management"} />
<ProjectBoard />
            
        </div>
    );
};
export default OrdersPage;
