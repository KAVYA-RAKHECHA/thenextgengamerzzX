import { Route, Routes } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useGlobalState } from "./components/common/GlobalStateContext";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import Clients from "./pages/Clients.jsx";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NewsPage from "./pages/NewsPage";  
import SettingsPage from "./pages/SettingsPage";
import VideoUpload from "./pages/VideoAdd";
import ThumbnailGenerator from "./components/AIGen/ThumbnailGenerator.jsx";
import VideoGalleryPage from "./pages/VideoGallery.jsx"; 
import ProjectBoard from "./pages/ProjectBoard.jsx";
import AiGen from "./pages/AiGen.jsx";
import PexelsVideoSearch from "./components/videoupload/PexelsVideoSearch.jsx";
import List from './components/games/List.jsx'
import Esport from './components/games/E-Sports.jsx'
import ClientsUpload from "./components/db-uploads/clients-upload.jsx";
import FullCalendarComponent from "./pages/FullCalendarComponent";
function App() {
  const { theme, setTheme } = useGlobalState();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={`flex h-screen overflow-hidden relative ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-[#cce6ff] text-black"}`}>
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" : "bg-[#d6d6d6] opacity-100"}`} />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`absolute bottom-10 left-5 z-50 p-2 rounded-full ${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-200"}`}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <Sidebar theme={theme} />

      <div className={`flex-1 overflow-y-auto z-10 p-6 ${theme === "light" ? "bg-[#d6d6d6] text-black" : "bg-gray-900 text-gray-100"}`}>

        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/video" element={<VideoUpload />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/revenue" element={<SalesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path='/news' element={<NewsPage />} />
          <Route path="/settings" element={<SettingsPage />} />   
          <Route path="/project-manage" element={<ProjectBoard />} />   
          <Route path="/video-view" element={<VideoGalleryPage />} />
          <Route path="/games" element={<List />} />
          <Route path="/elements" element={<PexelsVideoSearch />} />
          <Route path="/calendar" element={<FullCalendarComponent />} />
          <Route path="/clients-upload" element={<ClientsUpload />} />
          <Route path="/esport" element={<Esport/>} />
		  <Route path="/ai-gen" element={<AiGen />} />       </Routes>
      </div>
    </div>
  );
}

export default App;