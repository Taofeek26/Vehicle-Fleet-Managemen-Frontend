import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupervisorLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Authenticate the user and get the token
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      const token = response.data.access;
      localStorage.setItem("access_token", token);

      // Get user details to determine user type
      const userDetails = await axios.get(
        "http://127.0.0.1:8000/api/user-details/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userType = userDetails.data.user_type;

      // Navigate based on user type
      if (userType === "supervisor") {
        navigate("/dashboard");
      } else if (userType === "driver") {
        navigate("/dashboard/driver-dasboard");
      } else {
        alert("Unknown user type");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Driver Login</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Username:
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password:
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SupervisorLogin;
