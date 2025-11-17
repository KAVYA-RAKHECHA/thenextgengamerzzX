import { motion } from "framer-motion";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed

const SettingSection = ({ icon: Icon, title, children }) => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<motion.div
			className={`${
				isDark
					? "bg-gray-800 text-white border-gray-700"
					: "bg-white text-black border-gray-200"
			} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border mb-8`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex items-center mb-4'>
				<Icon className='text-indigo-400 mr-4' size='24' />
				<h2 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{title}</h2>
			</div>
			{children}
		</motion.div>
	);
};
export default SettingSection;
