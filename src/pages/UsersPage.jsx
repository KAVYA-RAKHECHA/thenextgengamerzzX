import axios from "axios";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { Users, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import UserCard from "../components/users/UserCard";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



const UsersPage = () => {
  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Use state for userLocations, initialize as empty array
  const [userLocations, setUserLocations] = useState([]);
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);  // Trigger stats refresh
  };
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersToday, setNewUsersToday] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [joinedThisYear, setJoinedThisYear] = useState(0);
  const [joinedToday, setJoinedToday] = useState(0);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        console.log("Fetched users:", response.data.users);
  
        if (response.data.success) {
          const usersWithCoords = response.data.users.filter(
            (user) =>
              user.location &&
              Number.isFinite(user.location.lat) &&
              Number.isFinite(user.location.long)
          );
  
          const formatted = usersWithCoords.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            lat: user.location.lat,
            lng: user.location.long,
            country: user.country || "Unknown",
          }));
  
          setUserLocations(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch user location data:", err);
      }
    };
  
    fetchLocations();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        const users = response.data.users;
  
        setTotalUsers(users.length);
  
        const today = new Date();
        setNewUsersToday(
          users.filter(user => {
            const date = new Date(user.joinedAt);
            return !isNaN(date) && date.toDateString() === today.toDateString();
          }).length
        );
  
        setActiveUsers(users.filter(user => !user.isBlocked).length);
  
        setJoinedThisYear(
          users.filter(user => {
            const date = new Date(user.joinedAt);
            return !isNaN(date) && date.getFullYear() === today.getFullYear();
          }).length
        );
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
  
    fetchUserStats();
  }, [refreshTrigger]);

  return (
    <div
      className={`flex-1 overflow-auto relative z-10 ${
        isDark ? "bg-gray-800" : "bg-white-900"
      }`}
    >
      <Header title="Employees" />

      <main
        className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            isDark={isDark}
            name="Total Employee"
            icon={Users}
            value={totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            isDark={isDark}
            name="New Today"
            icon={PlusCircle}
            value={newUsersToday.toLocaleString()}
            color="#10B981"
          />
          <StatCard
            isDark={isDark}
            name="Active Employee"
            icon={CheckCircle}
            value={activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            isDark={isDark}
            name="Joined This Year"
            icon={UsersIcon}
            value={joinedThisYear.toLocaleString()}
            color="#EF4444"
          />
   
        </motion.div>

        <UsersTable isDark={isDark} onRefresh={() => { handleRefresh(); window.location.reload(); }} />
        {/* USER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-8">
          <UserGrowthChart isDark={isDark} />
  
        </div>

        <div className={`${
				isDark
					? "bg-gray-800 text-white border-gray-700"
					: "bg-white border-gray-200"
			} shadow-lg rounded-2xl p-6 mt-6 w-full max-w-7xl mx-auto border  border-gray-200`}>
          <h2 className={`text-2xl font-bold ${
				isDark
					? " text-white "
					: " text-black"
			} mb-4 border-b pb-2`}>
          Employee Location
          </h2>

          <MapContainer
            center={[20.5937, 78.9629]} // Center of the map (India)
            zoom={5}
            style={{
              width: "100%",
              height: "450px",
              borderRadius: "12px",
              zIndex: 1,
            }}
          >
            {/* TileLayer for map background */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Markers for user locations */}
            {userLocations.map((user) => (
              <Marker
              key={user.id}
              position={[user.lat, user.lng]}
              icon={
                new L.Icon({
                  iconUrl:
                  "https://unpkg.com/leaflet/dist/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  tooltipAnchor: [16, -28],
                })
              }
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{user.name}</strong>
                    <br />
                    Email: {user.email}
                    <br />
                    Country: {user.country}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </main>
    </div>
  );
};
export default UsersPage;
