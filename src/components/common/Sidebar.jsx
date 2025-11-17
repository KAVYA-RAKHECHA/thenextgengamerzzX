import { BarChart2, DollarSign, Menu, Settings, Calendar, ShoppingBag, ShoppingCart, TrendingUp, Users, Newspaper, Video, Lightbulb, Gamepad, IndianRupee } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom"; // Import useLocation to track current route
import { useGlobalState } from "../common/GlobalStateContext"; // ✅ access global state for theme

const SIDEBAR_ITEMS = [
	{ name: "Overview", icon: BarChart2, color: "#FF6B6B", href: "/" },
	{ name: "Revenue", icon: IndianRupee, color: "#00CEC9", href: "/revenue" },
	{ name: "Video Upload", icon: Video, color: "#00B894", href: "/video" },
	{ name: "Video Gallery", icon: Video, color: "#0984E3", href: "/video-view" },
	{ name: "Clients", icon: DollarSign, color: "#FAB1A0", href: "/clients" },
	{ name: "Employees", icon: Users, color: "#E17055", href: "/users" },
	{ name: "Project Management", icon: TrendingUp, color: "#55EFC4", href: "/project-manage" },
	{ name: "Calendar", icon: Calendar, color: "#FFEAA7", href: "/calendar" },
	{ name: "Inspiration Hub", icon: Lightbulb, color: "#81ECEC", href: "/ai-gen" },
	{ name: "Elements", icon: Lightbulb, color: "#FD79A8", href: "/elements" },
	{ name: "E-Sports", icon: TrendingUp, color: "#6C5CE7", href: "/esport" }, // Different color for E-Sports
	{ name: "News", icon: Newspaper, color: "#A29BFE", href: "/news" },
	{ name: "Games", icon: Gamepad, color: "#D63031", href: "/games" },
	{ name: "Settings", icon: Settings, color: "#636E72", href: "/settings" },
  ];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useGlobalState(); // ✅ access theme
  const location = useLocation(); // Track current route

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div
        className={`h-full p-4 flex flex-col border-r ${
          theme === "dark" ? "bg-gray-800 bg-opacity-50 border-gray-700" : "bg-white bg-opacity-70 border-gray-300"
        } backdrop-blur-md`}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-4 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div
                className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors mb-2 ${
                  location.pathname === item.href
                    ? "bg-gray-800 text-white" // Apply fixed color for the active page
                    : theme === "dark"
                    ? "text-gray-100 hover:bg-gray-700"
                    : "text-gray-800 hover:bg-gray-300"
                }`}
              >
                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;