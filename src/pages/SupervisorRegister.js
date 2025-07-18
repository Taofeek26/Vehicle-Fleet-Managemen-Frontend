import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SupervisorRegister = () => {
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

    try {
      // Send a POST request to the backend to create a supervisor
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register-supervisor/",
        {
          username,
          email,
          password,
          user_type: "supervisor",
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Supervisor account created successfully!");
        // Navigate to the dashboard page
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to create supervisor. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-2">Register as Supervisor</h2>
      <p className="text-gray-600 mb-6">
        Create a new supervisor account to access the dashboard.
      </p>

      {/* Registration Form */}
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>

      {/* Display Errors */}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SupervisorRegister;
