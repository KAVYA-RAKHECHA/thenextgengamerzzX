import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useGlobalState } from "../common/GlobalStateContext";
import axios from "axios"; // Add axios to handle API requests

const ClientsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  useEffect(() => {
    // Fetch clients from the backend
    axios.get("http://localhost:3000/clients-table")
      .then(response => {
        setAllClients(response.data.clients);
        setFilteredClients(response.data.clients);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching clients:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredClients(allClients);
      return;
    }

    const filtered = allClients.filter(
      (client) =>
        client.name?.toLowerCase().includes(term) || // Defensive for undefined
        client.email?.toLowerCase().includes(term)
    );
    setFilteredClients(filtered);
  };

  return (
    <motion.div
      className={`${
        isDark
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-black border-gray-200"
      } bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Clients</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search clients...'
            className={`${
              isDark ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-black placeholder-gray-500"
            } rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className={`absolute left-3 top-2.5 ${isDark ? "text-gray-400" : "text-gray-600"}`} size={18} />
        </div>
      </div>

      <div>
        {loading ? (
          <div className="text-center py-4">Loading clients...</div>
        ) : (
          <div style={{ maxHeight: "calc(10 * 3.5rem)", overflowY: "auto" }}>
            <table className='min-w-full divide-y divide-gray-700'>
              <thead>
                <tr> 
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Name
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Email
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Wallet Balance
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Country
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-700'>
  {(searchTerm.trim() === "" ? allClients : filteredClients).map((client) => (
    <motion.tr
      key={client._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <td className='px-6 py-2 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='flex-shrink-0 h-10 w-10'>
            <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
              {client.name.charAt(0)} {/* Displaying first letter as icon */}
            </div>
          </div>
        </div>
      </td>
      <td className='px-2 py-2 whitespace-nowrap'>
        <div className='text-sm'>{client.name}</div>
      </td>
      <td className='px-2 py-2 whitespace-nowrap'>
        <div className='text-sm'>{client.email}</div>
      </td>
      <td className='px-2 py-2 whitespace-nowrap'>
        <div className='text-sm'>{client.currentWalletBalance}</div>
      </td>
      <td className='px-2 py-2 whitespace-nowrap'>
        <div className='text-sm'>{client.country}</div>
      </td>
    </motion.tr>
  ))}
</tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClientsTable;
