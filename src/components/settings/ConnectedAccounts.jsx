import { useState } from "react";
import SettingSection from "./SettingSection";
import { HelpCircle, Plus } from "lucide-react";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust the path if needed

const ConnectedAccounts = () => {
	const [connectedAccounts, setConnectedAccounts] = useState([
		{
			id: 1,
			name: "Google",
			connected: true,
			icon: "/google.png",
		},
		{
			id: 2,
			name: "Facebook",
			connected: false,
			icon: "/facebook.svg",
		},
		{
			id: 3,
			name: "Twitter",
			connected: true,
			icon: "/x.png",
		},
	]);

	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	return (
		<SettingSection icon={HelpCircle} title={"Connected Accounts"}>
			{connectedAccounts.map((account) => (
				<div key={account.id} className='flex items-center justify-between py-3'>
					<div className='flex gap-1'>
						<img src={account.icon} alt='Social img' className='size-6 object-cover rounded-full mr-2' />
						<span className={`${isDark ? "text-gray-300" : "text-gray-800"}`}>{account.name}</span>
					</div>
					<button
						className={`px-3 py-1 rounded ${
							account.connected
								? isDark
									? "bg-green-600 hover:bg-green-700"
									: "bg-green-500 hover:bg-green-600"
								: isDark
								? "bg-gray-600 hover:bg-gray-700"
								: "bg-gray-300 hover:bg-gray-400"
						} transition duration-200`}
						onClick={() => {
							setConnectedAccounts(
								connectedAccounts.map((acc) => {
									if (acc.id === account.id) {
										return {
											...acc,
											connected: !acc.connected,
										};
									}
									return acc;
								})
							);
						}}
					>
						{account.connected ? "Connected" : "Connect"}
					</button>
				</div>
			))}
			<button className={`mt-4 flex items-center ${isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"} transition duration-200`}>
				<Plus size={18} className='mr-2' /> Add Account
			</button>
		</SettingSection>
	);
};
export default ConnectedAccounts;
