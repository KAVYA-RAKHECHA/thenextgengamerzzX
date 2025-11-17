import { useGlobalState } from "./GlobalStateContext"; // ✅ access global state for theme

const Header = ({ title, logo }) => {
	const { theme } = useGlobalState(); // ✅ access theme

	return (
		<header
			className={`${
				theme === "dark"
					? "bg-gray-800 bg-opacity-50 border-b border-gray-700"
					: "bg-white bg-opacity-70 border-b border-gray-300"
			} backdrop-blur-md shadow-lg`}
		>
			<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
				{/* Logo on the left */}
				<div className="flex items-center space-x-4">
					<img src={"/logonobg.png"} alt="Logo" className="h-12 w-auto" />
				</div>

				{/* Title in the center */}
				<h1 className={`text-2xl px-4 font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
					{title}
				</h1>

				{/* This empty div ensures the title stays centered by pushing the logo to the left */}
				<div className="flex-grow"></div>
			</div>
		</header>
	);
};

export default Header;