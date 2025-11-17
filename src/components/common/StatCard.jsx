import { motion } from "framer-motion";
import { useGlobalState } from "../common/GlobalStateContext"; // ✅ access global state for theme

const StatCard = ({ name, icon: Icon, value, color }) => {
	const { theme } = useGlobalState(); // ✅ access theme
	const isDark = theme === "dark";

	return (
		<motion.div
			className={`overflow-hidden shadow-lg rounded-xl border ${
				isDark ? "bg-gray-800 bg-opacity-50 border-gray-700" : "bg-white bg-opacity-70 border-gray-300"
			} backdrop-blur-md`}
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span
					className={`flex items-center text-sm font-medium ${
						isDark ? "text-gray-400" : "text-gray-800"
					}`}
				>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
				<p
					className={`mt-1 text-3xl font-semibold ${
						isDark ? "text-gray-100" : "text-gray-800"
					}`}
				>
					{value}
				</p>
			</div>
		</motion.div>
	);
};

export default StatCard;
