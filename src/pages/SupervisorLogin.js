import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupervisorLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authenticate the user and get the token
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      const token = response.data.access;
      console.log(token);
      localStorage.setItem("access_token", token);

      // Get user details to determine user type
      const userDetails = await axios.get(
        "http://127.0.0.1:8000/api/user-details/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(userDetails);
      const userType = userDetails.data.user_type;
      console.log(userType);
      // Navigate based on user type
      if (userType === "supervisor") {
        navigate("/dashboard");
      } else if (userType === "driver") {
        navigate("/dashboard");
      } else {
        alert("Unknown user type");
      }
    } catch (error) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Supervisor Login</h2>
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <label className="block text-gray-700 font-medium mb-2">
          Username:
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-gray-700 font-medium mb-2">
          Password:
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mb-4"
        >
          Login
        </button>
      </form>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SupervisorLogin;
