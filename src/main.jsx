import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css';

import { GlobalStateProvider } from "./components/common/GlobalStateContext"; // ✅ FIXED PATH

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<GlobalStateProvider>
				<App />
			</GlobalStateProvider>
		</BrowserRouter>
	</React.StrictMode>
);
