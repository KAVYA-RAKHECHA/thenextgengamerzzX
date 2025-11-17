import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed

const Profile = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<SettingSection
			icon={User}
			title={"Profile"}
			className={`${
				isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"
			} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border`}
		>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src='../public/user-img.jpeg'
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div>
					<h3 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Kavya Rakhecha</h3>
					<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>kavyarakhecha@gmail.com</p>
				</div>
			</div>


		</SettingSection>
	);
};
export default Profile;
