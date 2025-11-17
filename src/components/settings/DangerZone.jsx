import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const DangerZone = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";
	return (
		<motion.div
			className={`${
				isDark
					? "bg-gray-800 text-white border-gray-700"
					: "bg-white text-black border-gray-200"
			} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='flex items-center mb-4'>
				<Trash2 className='text-red-400 mr-3' size={24} />
				<h2 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Danger Zone</h2>
			</div>
			<p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} mb-4`}>Permanently delete your account and all of your content.</p>
			<button
				className={`bg-red-600 hover:bg-red-700 ${isDark ? "text-white" : "text-black"} font-bold py-2 px-4 rounded transition duration-200`}
			>
				Delete Account
			</button>
		</motion.div>
	);
};
export default DangerZone;
