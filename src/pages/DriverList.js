import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DriverList = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]); // State to store driver list
  const [trips, setTrips] = useState([]); // State to store trip list
  const [error, setError] = useState("");

  // Fetch drivers when the component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      const token = localStorage.getItem("access_token"); // Retrieve access token
      if (!token) {
        navigate("/"); // Redirect to home if not logged in
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/drivers/", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the access token
          },
        });
        setDrivers(response.data); // Set fetched drivers to state
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError("Failed to load drivers. Please try again.");
      }
    };

    fetchDrivers();
  }, [navigate]);

  // Fetch trips for visualization
  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/driver-trips/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched trips:", response.data);
        setTrips(response.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, []);

  // Process data for the chart
  const chartData = drivers.map((driver) => ({
    name: driver.username,
    trips: trips.filter((trip) => trip.driver.split(" (")[0] === driver.username).length,
  }));
  console.log("Drivers:", drivers);
  console.log("Trips:", trips);
  console.log("Chart data:", chartData);

  // CSV headers
  const headers = [
    { label: "ID", key: "id" },
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Driver List</h2>

      {/* Display Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Export Button */}
      <div className="w-full max-w-5xl flex justify-end mb-4">
        <CSVLink
          data={drivers}
          headers={headers}
          filename={"drivers.csv"}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Export to CSV
        </CSVLink>
      </div>
      {/* Visualization */}
      <div className="w-full max-w-5xl mt-8">
        <h3 className="text-xl font-bold mb-4">Trips per Driver</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="trips" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Driver Table */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <tr key={driver.id} className="border-b">
                  <td className="px-4 py-2">{driver.id}</td>
                  <td className="px-4 py-2">{driver.username}</td>
                  <td className="px-4 py-2">{driver.email || "N/A"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => navigate(`/edit-driver/${driver.id}`)}
                      className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                  No drivers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default DriverList;
