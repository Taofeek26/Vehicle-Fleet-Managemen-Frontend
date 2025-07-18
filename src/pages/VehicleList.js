import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]); // State to store vehicle list
  const [error, setError] = useState("");
  const [userType, setUserType] = useState(""); // State to store user type
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token"); // Retrieve access token

  // Fetch user details and vehicles when the component loads
  useEffect(() => {
    const fetchVehiclesAndUserDetails = async () => {
      try {
        // Fetch user details to determine user type
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/user-details/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserType(userResponse.data.user_type); // Set user type (supervisor/driver)

        // Fetch vehicles
        const vehicleResponse = await axios.get(
          "http://127.0.0.1:8000/api/vehicles/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVehicles(vehicleResponse.data); // Set fetched vehicles to state
        console.log("Fetched Vehicles:", vehicleResponse.data); // Debug log for API response
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    fetchVehiclesAndUserDetails();
  }, [token]);

  // Handle deleting a vehicle
  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/vehicles/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id)); // Remove from list
      alert("Vehicle deleted successfully!");
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError("Failed to delete vehicle. Please try again.");
    }
  };

  // Data for Pie Chart
  const assignedVehicles = vehicles.filter(
    (v) => v.assigned_driver !== null
  ).length;
  const unassignedVehicles = vehicles.length - assignedVehicles;
  const pieData = [
    { name: "Assigned", value: assignedVehicles },
    { name: "Unassigned", value: unassignedVehicles },
  ];
  const COLORS = ["#0088FE", "#FF8042"];

  // CSV Headers
  const headers = [
    { label: "ID", key: "id" },
    { label: "Vehicle Name", key: "vehicle_name" },
    { label: "Vehicle Number", key: "vehicle_number" },
    { label: "Assigned Driver", key: "assigned_driver" },
    { label: "Last Maintenance Date", key: "last_maintenance_date" },
    { label: "Next Maintenance Date", key: "next_maintenance_date" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Vehicles Management
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Add Vehicle and Export Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        {userType === "supervisor" && (
          <button
            onClick={() => navigate("/dashboard/add-vehicle")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add New Vehicle
          </button>
        )}
        <CSVLink
          data={vehicles}
          headers={headers}
          filename={"vehicles.csv"}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Export to CSV
        </CSVLink>
      </div>
      
      {/* Visualization */}
      <div className="w-full max-w-lg mx-auto mt-8">
        <h3 className="text-xl font-bold text-center mb-4">
          Vehicle Assignment Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Vehicles Table */}
      <div className="overflow-x-auto">
        <table className="w-full max-w-7xl mx-auto bg-white shadow-md rounded-lg table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Vehicle Name</th>
              <th className="px-4 py-2 text-left">Vehicle Number</th>
              <th className="px-4 py-2 text-left">Assigned Driver</th>
              <th className="px-4 py-2 text-left">Last Maintenance Date</th>
              <th className="px-4 py-2 text-left">Next Maintenance Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-2">{vehicle.id}</td>
                  <td className="px-4 py-2">{vehicle.vehicle_name}</td>
                  <td className="px-4 py-2">{vehicle.vehicle_number}</td>
                  <td className="px-4 py-2">
                    {vehicle.assigned_driver || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {vehicle.last_maintenance_date || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {vehicle.next_maintenance_date || "N/A"}
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    {/* Edit and Delete actions only for supervisors */}
                    {userType === "supervisor" && (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/edit-vehicle/${vehicle.id}`)
                          }
                          className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                  No vehicles available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      

      {/* Back Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Vehicles;
