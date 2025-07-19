import React, { useState, useEffect } from "react";
import { createVehicle, getUsers } from "../api"; // Import from centralized API
import { useNavigate } from "react-router-dom";

const AddVehicle = () => {
  const [newVehicle, setNewVehicle] = useState({
    vehicle_name: "",
    vehicle_number: "",
    assigned_driver: "", // Driver ID
    supervisor: "", // Supervisor ID
    last_maintenance_date: "",
    next_maintenance_date: "",
  });
  const [drivers, setDrivers] = useState([]); // List of available drivers
  const [supervisors, setSupervisors] = useState([]); // List of available supervisors
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch available drivers and supervisors
  useEffect(() => {
    const fetchUsersByRole = async () => {
      try {
        const response = await getUsers(); // Use centralized API
        const allUsers = response.data;

        const driverUsers = allUsers.filter((user) => user.role === "driver");
        setDrivers(driverUsers);

        const supervisorUsers = allUsers.filter((user) => user.role === "supervisor");
        setSupervisors(supervisorUsers);

      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load drivers and supervisors. Please try again.");
      }
    };

    fetchUsersByRole();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({ ...newVehicle, [name]: value });
  };

  // Handle adding a new vehicle
  const handleAddVehicle = async () => {
    setError("");
    try {
      const dataToSend = { ...newVehicle };
      // Convert empty strings to null for foreign key fields
      if (dataToSend.assigned_driver === "") {
        dataToSend.assigned_driver = null;
      } else {
        dataToSend.assigned_driver = parseInt(dataToSend.assigned_driver); // Ensure it's an integer ID
      }
      if (dataToSend.supervisor === "") {
        dataToSend.supervisor = null;
      } else {
        dataToSend.supervisor = parseInt(dataToSend.supervisor); // Ensure it's an integer ID
      }

      await createVehicle(dataToSend); // Use centralized API
      alert("Vehicle added successfully!");
      navigate("/dashboard/vehicles"); // Navigate back to the vehicle list
    } catch (err) {
      console.error("Error adding vehicle:", err.response?.data);
      setError(
        err.response?.data?.detail || "Failed to add vehicle. Please check the details."
      );
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
            name="vehicle_name"
            placeholder="Enter vehicle name"
            value={newVehicle.vehicle_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            name="vehicle_number"
            placeholder="Enter vehicle number"
            value={newVehicle.vehicle_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Assigned Driver */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Assigned Driver:
          </label>
          <select
            name="assigned_driver"
            value={newVehicle.assigned_driver}
            onChange={handleChange}
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

        {/* Supervisor */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Supervisor:
          </label>
          <select
            name="supervisor"
            value={newVehicle.supervisor}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a supervisor</option>
            {supervisors.map((supervisor) => (
              <option key={supervisor.id} value={supervisor.id}>
                {supervisor.username}
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
            name="last_maintenance_date"
            value={newVehicle.last_maintenance_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            name="next_maintenance_date"
            value={newVehicle.next_maintenance_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Vehicle
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/vehicles")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Vehicles
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;