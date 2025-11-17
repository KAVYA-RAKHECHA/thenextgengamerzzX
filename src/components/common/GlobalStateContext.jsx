import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
	const [theme, setTheme] = useState("dark");

	return (
		<GlobalStateContext.Provider value={{ theme, setTheme }}>
			{children}
		</GlobalStateContext.Provider>
	);
};

export const useGlobalState = () => useContext(GlobalStateContext);
