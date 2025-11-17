import axios from "axios";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { Users, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/clients/UsersTable";
import UserGrowthChart from "../components/clients/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import UserCard from "../components/users/UserCard";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



const ClientsPage = () => {
  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Use state for clientLocations, initialize as empty array
  const [clientLocations, setClientLocations] = useState([]);
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);  // Trigger stats refresh
  };
  const [totalClients, setTotalClients] = useState(0);
  const [newClientsToday, setNewClientsToday] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [joinedThisYear, setJoinedThisYear] = useState(0);
  // New state for "Joined This Month"
  const [joinedThisMonth, setJoinedThisMonth] = useState(0);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/clients");
        console.log("Fetched clients:", response.data.clients);
  
        if (response.data.success) {
          const clientsWithCoords = response.data.clients.filter(
            (client) =>
              client.location &&
              Number.isFinite(client.location.lat) &&
              Number.isFinite(client.location.long)
          );
  
          const formatted = clientsWithCoords.map((client) => ({
            id: client._id,
            name: client.name,
            email: client.email,
            lat: client.location.lat,
            lng: client.location.long,
            country: client.country || "Unknown",
          }));
  
          setClientLocations(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch client location data:", err);
      }
    };
  
    fetchLocations();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchClientStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/clients");
        const clients = response.data.clients;

        setTotalClients(clients.length);

        const today = new Date();
        setNewClientsToday(
          clients.filter(client => {
            const date = new Date(client.joinedAt);
            return !isNaN(date) && date.toDateString() === today.toDateString();
          }).length
        );

        setActiveClients(clients.length); // All clients are considered active now

        setJoinedThisYear(
          clients.filter(client => {
            const date = new Date(client.joinedAt);
            return !isNaN(date) && date.getFullYear() === today.getFullYear();
          }).length
        );

        // Calculate "Joined This Month"
        setJoinedThisMonth(
          clients.filter(client => {
            const date = new Date(client.joinedAt);
            return (
              !isNaN(date) &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );
          }).length
        );
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchClientStats();
  }, [refreshTrigger]);

  return (
    <div
      className={`flex-1 overflow-auto relative z-10 ${
        isDark ? "bg-gray-800" : "bg-white-900"
      }`}
    >
      <Header title="Clients" />

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
            name="Total Clients"
            icon={Users}
            value={totalClients.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            isDark={isDark}
            name="New Today"
            icon={PlusCircle}
            value={newClientsToday.toLocaleString()}
            color="#10B981"
          />
            <StatCard
            isDark={isDark}
            name="Joined This Month"
            icon={UsersIcon}
            value={joinedThisMonth.toLocaleString()}
            color="#EF4444"
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
        {/* CLIENT CHARTS */}
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
          Client Location
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
            <TileLayer url="https://{s}.ti le.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Markers for client locations */}
            {clientLocations.map((client) => (
              <Marker
              key={client.id}
              position={[client.lat, client.lng]}
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
                    <strong>{client.name}</strong>
                    <br />
                    Email: {client.email}
                    <br />
                    Country: {client.country}
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
export default ClientsPage;
