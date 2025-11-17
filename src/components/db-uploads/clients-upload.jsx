import React, { useState } from "react";
import axios from "axios";

const ClientsUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentWalletBalance: "",
    country: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/clients", formData);
      if (res.data.success) {
        alert("✅ Client Added Successfully!");
        setFormData({
          name: "",
          email: "",
          currentWalletBalance: "",
          country: "",
          city: "",
        });
      } else {
        alert("⚠️ Failed to add client.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error while adding client.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Client</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="number"
          name="currentWalletBalance"
          placeholder="Wallet Balance"
          value={formData.currentWalletBalance}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ClientsUpload;