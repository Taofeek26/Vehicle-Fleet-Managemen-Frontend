import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditVehicle = () => {
  const { id } = useParams(); // Get vehicle ID from the URL
  const [vehicle, setVehicle] = useState({
    vehicle_name: "",
    vehicle_number: "",
    assigned_driver: "",
    last_maintenance_date: "",
    next_maintenance_date: "",
  }); // State for the vehicle being edited
  const [drivers, setDrivers] = useState([]); // State for available drivers
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token"); // Retrieve access token

  // Fetch the vehicle details
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/vehicles/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVehicle(response.data); // Set fetched vehicle to state
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details.");
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/drivers/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrivers(response.data); // Set fetched drivers to state
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError("Failed to load drivers.");
      }
    };

    fetchVehicleDetails();
    fetchDrivers();
  }, [id, token]);

  // Handle editing the vehicle
  const handleEditVehicle = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/vehicles/${id}/`, vehicle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Vehicle updated successfully!");
      navigate("/dashboard/vehicles"); // Navigate back to the vehicle list
    } catch (err) {
      console.error("Error updating vehicle:", err.response?.data || err);
      setError("Failed to update vehicle. Please check the details.");
    }
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Vehicle</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditVehicle();
          }}
          className="space-y-6"
        >
          {/* Vehicle Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Vehicle Name:
            </label>
            <input
              type="text"
              value={vehicle.vehicle_name}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Vehicle Number:
            </label>
            <input
              type="text"
              value={vehicle.vehicle_number}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_number: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Assigned Driver */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Assigned Driver:
            </label>
            <select
              value={vehicle.assigned_driver}
              onChange={(e) =>
                setVehicle({ ...vehicle, assigned_driver: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Last Maintenance Date:
            </label>
            <input
              type="date"
              value={vehicle.last_maintenance_date}
              onChange={(e) =>
                setVehicle({
                  ...vehicle,
                  last_maintenance_date: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Next Maintenance Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Next Maintenance Date:
            </label>
            <input
              type="date"
              value={vehicle.next_maintenance_date}
              onChange={(e) =>
                setVehicle({
                  ...vehicle,
                  next_maintenance_date: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Save Changes
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
    </div>
  );
};

export default EditVehicle;
