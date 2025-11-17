import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useGlobalState } from "../common/GlobalStateContext";
import axios from "axios";  // Add axios to handle API requests

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  useEffect(() => {
    // Fetch users from the backend
    axios.get("http://localhost:3000/users")
      .then(response => {
        setAllUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleBlockUser = (userId) => {
	axios.put(`http://localhost:3000/users/${userId}/block`)
	  .then(response => {
		const updatedUser = response.data.user;
  
		// Update filtered users list
		setFilteredUsers(prevUsers =>
		  prevUsers.map(user =>
			user._id === updatedUser._id ? updatedUser : user
		  )
		);
  
		// Update all users list
		setAllUsers(prevUsers =>
		  prevUsers.map(user =>
			user._id === updatedUser._id ? updatedUser : user
		  )
		);
  
		// Trigger stats update only in UsersPage
		if (onRefresh) onRefresh(); // Trigger stats update in UsersPage
	  })
	  .catch(error => {
		console.error("Error blocking/unblocking user:", error);
	  });
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
        <h2 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Employees</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search employees...'
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
          <div className="text-center py-4">Loading employees...</div>
        ) : (
          <div style={{ maxHeight: "calc(10 * 3.5rem)", overflowY: "auto" }}>
            <table className='min-w-full divide-y divide-gray-700'>
              <thead>
                <tr>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Name
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Email
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Country
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Wallet Balance
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Skill Sets
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-2 py-2 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-700'>
                {(searchTerm.trim() === "" ? allUsers : filteredUsers).map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className='px-6 py-2 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{user.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className='px-2 py-2 whitespace-nowrap'>
                      <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{user.email}</div>
                    </td>

                    <td className='px-2 py-2 whitespace-nowrap'>
                      <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{user.country}</div>
                    </td>
                    <td className='px-2 py-2 whitespace-nowrap'>
                      <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{user.currentWalletBalance}</div>
                    </td>
                    <td className='px-2 py-2 whitespace-nowrap'>
                      <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{Array.isArray(user.skillSets) ? user.skillSets.join(", ") : ""}</div>
                    </td>

                    <td className='px-2 py-2 whitespace-nowrap'>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                          user.isBlocked
                            ? "bg-red-800 text-red-100"
                            : "bg-green-800 text-green-100"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className='px-2 py-2 whitespace-nowrap text-sm'>
                      <button
                        className='text-indigo-400 hover:text-indigo-300 mr-2'
                        onClick={() => handleBlockUser(user._id)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
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
export default UsersTable;
