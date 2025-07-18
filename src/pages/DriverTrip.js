import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DriverTrips = () => {
  const [trips, setTrips] = useState([]); // State to store trips
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token"); // Retrieve access token

  // Fetch trips when the component loads
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/driver-trips/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched Trips:", response.data); // Debug log for API response
        setTrips(response.data); // Set fetched trips to state
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load trips. Please try again.");
      }
    };

    fetchTrips();
  }, [token]);

  // Prepare data for the chart
  const chartData = trips.map((trip) => ({
    date: new Date(trip.start_time).toLocaleDateString(),
    distance: trip.distance_covered,
  }));

  // CSV Headers
  const headers = [
    { label: "Vehicle", key: "vehicle" },
    { label: "Driver", key: "driver" },
    { label: "Supervisor", key: "supervisor" },
    { label: "Start Time", key: "start_time" },
    { label: "End Time", key: "end_time" },
    { label: "Vehicle Status", key: "vehicle_status" },
    { label: "Destination", key: "destination" },
    { label: "Start Mileage", key: "start_mileage" },
    { label: "End Mileage", key: "end_mileage" },
    { label: "Distance Covered", key: "distance_covered" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Driver Trips</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => navigate("/dashboard/start-trip")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Start New Trip
        </button>
        <CSVLink
          data={trips}
          headers={headers}
          filename={"trips.csv"}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Export to CSV
        </CSVLink>
      </div>
      {/* Visualization */}
      <div className="w-full max-w-7xl mx-auto mt-8">
        <h3 className="text-xl font-bold text-center mb-4">
          Distance Covered Over Time
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full max-w-7xl mx-auto bg-white shadow-md rounded-lg table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Vehicle</th>
              <th className="px-4 py-2 text-left">Driver</th>
              <th className="px-4 py-2 text-left">Supervisor</th>
              <th className="px-4 py-2 text-left">Start Time</th>
              <th className="px-4 py-2 text-left">End Time</th>
              <th className="px-4 py-2 text-left">Vehicle Status</th>
              <th className="px-4 py-2 text-left">Destination</th>
              <th className="px-4 py-2 text-left">Start Mileage</th>
              <th className="px-4 py-2 text-left">End Mileage</th>
              <th className="px-4 py-2 text-left">Distance Covered</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.length > 0 ? (
              trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-2">{trip.vehicle || "N/A"}</td>
                  <td className="px-4 py-2">{trip.driver || "N/A"}</td>
                  <td className="px-4 py-2">
                    {trip.supervisor || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {trip.start_time
                      ? new Date(trip.start_time).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {trip.end_time
                      ? new Date(trip.end_time).toLocaleString()
                      : "Ongoing"}
                  </td>
                  <td className="px-4 py-2">{trip.vehicle_status || "N/A"}</td>
                  <td className="px-4 py-2">{trip.destination || "N/A"}</td>
                  <td className="px-4 py-2">{trip.start_mileage || "N/A"}</td>
                  <td className="px-4 py-2">{trip.end_mileage || "N/A"}</td>
                  <td className="px-4 py-2">
                    {trip.distance_covered || "N/A"}
                  </td>
                  <td className="px-4 py-2 space-y-2">
                    {!trip.end_time && (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/end-trip/${trip.id}`)
                          }
                          className="w-full px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          End Trip
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/map?latitude=${trip.latitude}&longitude=${trip.longitude}`
                            )
                          }
                          className="w-full px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                        >
                          View Map
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No trips available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default DriverTrips;
