import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddVehicle = () => {
  const [newVehicle, setNewVehicle] = useState({
    vehicle_name: "",
    vehicle_number: "",
    assigned_driver: "", // Driver ID
    last_maintenance_date: "",
    next_maintenance_date: "",
  });
  const [drivers, setDrivers] = useState([]); // List of available drivers
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token"); // Retrieve access token

  // Fetch available drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/drivers/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrivers(response.data); // Set drivers list
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError("Failed to load drivers. Please try again.");
      }
    };

    fetchDrivers();
  }, [token]);

  // Handle adding a new vehicle
  const handleAddVehicle = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/vehicles/", newVehicle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Vehicle added successfully!");
      navigate("/dashboard/vehicles"); // Navigate back to the vehicle list
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setError("Failed to add vehicle. Please check the details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Vehicle</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddVehicle();
        }}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        {/* Vehicle Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Vehicle Name:
          </label>
          <input
            type="text"
            placeholder="Enter vehicle name"
            value={newVehicle.vehicle_name}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, vehicle_name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Vehicle Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Vehicle Number:
          </label>
          <input
            type="text"
            placeholder="Enter vehicle number"
            value={newVehicle.vehicle_number}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, vehicle_number: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Assigned Driver */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Assigned Driver:
          </label>
          <select
            value={newVehicle.assigned_driver}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, assigned_driver: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.username}
              </option>
            ))}
          </select>
        </div>

        {/* Last Maintenance Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Last Maintenance Date:
          </label>
          <input
            type="date"
            value={newVehicle.last_maintenance_date}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                last_maintenance_date: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Next Maintenance Date */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Next Maintenance Date:
          </label>
          <input
            type="date"
            value={newVehicle.next_maintenance_date}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                next_maintenance_date: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add Vehicle
          </button>
          <button
            onClick={() => navigate("/dashboard/vehicles")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to Vehicles
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;
