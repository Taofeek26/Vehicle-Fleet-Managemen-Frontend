import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverRegister = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/drivers/",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include supervisor's token for authentication
          },
        }
      );

      alert("Driver created successfully!");
      navigate("/dashboard/drivers"); // Navigate back to the drivers list
    } catch (err) {
      console.error("Error creating driver:", err);
      setError("Failed to create driver. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Register New Driver</h2>

      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Username:
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password:
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Register Driver
        </button>
      </form>

      {/* Display Errors */}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default DriverRegister;
