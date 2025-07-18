import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditDriver = () => {
  const { id } = useParams(); // Get driver ID from URL
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDriverDetails = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/drivers/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError("Failed to load driver details.");
      }
    };

    fetchDriverDetails();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/drivers/${id}/`,
        {
          username,
          email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Driver updated successfully!");
      navigate("/dashboard/drivers");
    } catch (err) {
      console.error("Error updating driver:", err.response?.data || err);
      alert("Failed to update driver. Please check input fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Driver</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="space-y-6"
        >
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => navigate("/dashboard/drivers")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
