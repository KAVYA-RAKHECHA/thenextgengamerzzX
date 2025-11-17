import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed

const Security = () => {
	const [twoFactor, setTwoFactor] = useState(false);
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<SettingSection
			icon={Lock}
			title={"Security"}
			className={`${
				isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"
			} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border`}
		>
			<ToggleSwitch
				label={"Two-Factor Authentication"}
				isOn={twoFactor}
				onToggle={() => setTwoFactor(!twoFactor)}
				className={isDark ? "bg-gray-600" : "bg-gray-200"}
			/>
			<div className='mt-4'>
				<button
					className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto`}
				>
					Change Password
				</button>
			</div>
		</SettingSection>
	);
};
export default Security;
