import { useState } from "react";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed

const Notifications = () => {
	const [notifications, setNotifications] = useState({
		push: true,
		email: false,
		sms: true,
	});

	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<SettingSection
			icon={Bell}
			className={`${
				isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"
			} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border`}
			title={<h2 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Notifications</h2>}
		>
			<ToggleSwitch
				label={"Push Notifications"}
				isOn={notifications.push}
				onToggle={() => setNotifications({ ...notifications, push: !notifications.push })}
				className={isDark ? "bg-gray-600" : "bg-gray-200"}
			/>
			<ToggleSwitch
				label={"Email Notifications"}
				isOn={notifications.email}
				onToggle={() => setNotifications({ ...notifications, email: !notifications.email })}
				className={isDark ? "bg-gray-600" : "bg-gray-200"}
			/>
			<ToggleSwitch
				label={"SMS Notifications"}
				isOn={notifications.sms}
				onToggle={() => setNotifications({ ...notifications, sms: !notifications.sms })}
				className={isDark ? "bg-gray-600" : "bg-gray-200"}
			/>
		</SettingSection>
	);
};
export default Notifications;
