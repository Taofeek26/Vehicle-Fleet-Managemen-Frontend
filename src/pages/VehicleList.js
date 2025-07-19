import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVehicles, deleteVehicle, getCurrentUser } from "../api";
import { CSVLink } from "react-csv";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// A simple card component for displaying stats
const StatCard = ({ title, value, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    {value && <p className="text-3xl font-semibold text-gray-900">{value}</p>}
    {children}
  </div>
);

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailsResponse = await getCurrentUser();
        setUserRole(userDetailsResponse.data.role);

        const vehicleResponse = await getVehicles();
        setVehicles(vehicleResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(id);
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
        alert("Vehicle deleted successfully!");
      } catch (err) {
        console.error("Error deleting vehicle:", err);
        setError("Failed to delete vehicle. Please try again.");
      }
    }
  };

  const assignedVehiclesCount = vehicles.filter((v) => v.assigned_driver !== null).length;
  const unassignedVehiclesCount = vehicles.length - assignedVehiclesCount;
  
  const pieData = [
    { name: "Assigned", value: assignedVehiclesCount },
    { name: "Available", value: unassignedVehiclesCount },
  ];
  const COLORS = ["#0088FE", "#00C49F"];

  const headers = [
    { label: "ID", key: "id" },
    { label: "Vehicle Name", key: "vehicle_name" },
    { label: "Vehicle Number", key: "vehicle_number" },
    { label: "Assigned Driver", key: "assigned_driver_name" },
    { label: "Supervisor", key: "supervisor_name" },
    { label: "Last Maintenance", key: "last_maintenance_date" },
    { label: "Next Maintenance", key: "next_maintenance_date" },
    { label: "Latitude", key: "latitude" },
    { label: "Longitude", key: "longitude" },
    { label: "Last Updated", key: "last_updated" },
  ];

  if (loading) return <div className="text-center py-4">Loading vehicles...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Vehicle Management</h2>
        <div className="flex gap-4">
          {["manager", "supervisor"].includes(userRole) && (
            <Link
              to="/dashboard/add-vehicle"
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Add New Vehicle
            </Link>
          )}
          <CSVLink
            data={vehicles}
            headers={headers}
            filename={"vehicles.csv"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Export to CSV
          </CSVLink>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Stats and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Vehicles" value={vehicles.length} />
        <StatCard title="Assigned Vehicles" value={assignedVehiclesCount} />
        <StatCard title="Available Vehicles" value={unassignedVehiclesCount} />
        
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-center mb-4">Vehicle Assignment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold">All Vehicles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Number</th>
                <th className="py-3 px-6 text-left">Assigned Driver</th>
                <th className="py-3 px-6 text-left">Last Maint.</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{vehicle.vehicle_name}</td>
                    <td className="py-3 px-6 text-left">{vehicle.vehicle_number}</td>
                    <td className="py-3 px-6 text-left">{vehicle.assigned_driver_name || "N/A"}</td>
                    <td className="py-3 px-6 text-left">{vehicle.last_maintenance_date || "N/A"}</td>
                    <td className="py-3 px-6 text-left">
                      {vehicle.latitude && vehicle.longitude
                        ? `${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center gap-2">
                        <Link
                          to={`/dashboard/vehicles/${vehicle.id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          View/Edit
                        </Link>
                        {["manager", "supervisor"].includes(userRole) && (
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    No vehicles available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
