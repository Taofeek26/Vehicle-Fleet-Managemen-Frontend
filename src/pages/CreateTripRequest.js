import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTripRequest, getAvailableVehicles, getUsers } from "../api"; // Import from centralized API

const CreateTripRequest = () => {
  const [formData, setFormData] = useState({
    vehicle: "",
    driver: "", // Add driver field
    destination: "",
    start_mileage: "", // New field
  });
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiclesResponse = await getAvailableVehicles(); // Use centralized API
        setAvailableVehicles(vehiclesResponse.data);

        const usersResponse = await getUsers(); // Use centralized API
        const driverUsers = usersResponse.data.filter(user => user.role === 'driver');
        setDrivers(driverUsers);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load vehicles or drivers.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const dataToSend = { ...formData };
      // Convert empty strings to null for foreign key fields
      if (dataToSend.vehicle === "") {
        dataToSend.vehicle = null;
      } else {
        dataToSend.vehicle = parseInt(dataToSend.vehicle); // Ensure it's an integer ID
      }
      if (dataToSend.driver === "") {
        dataToSend.driver = null;
      } else {
        dataToSend.driver = parseInt(dataToSend.driver); // Ensure it's an integer ID
      }
      // Convert empty strings to null for optional number fields
      dataToSend.start_mileage = dataToSend.start_mileage === "" ? null : parseFloat(dataToSend.start_mileage);

      const response = await createTripRequest(dataToSend); // Capture the response
      alert("Trip request created successfully!");
      console.log("New trip request created:", response.data); // Log the response for debugging
      navigate(`/dashboard/records/trip/${response.data.id}`); // Navigate to the detail page
    } catch (err) {
      console.error("Failed to create trip request:", err.response?.data);
      setError(
        err.response?.data?.detail || 
        Object.values(err.response?.data || {}).flat().join(' ') || // Display specific backend errors
        "Failed to create trip request. Please check the details."
      );
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Create Trip Request</h2>
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto"> {/* Added mx-auto here */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Vehicle</option>
              {availableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicle_name} ({vehicle.vehicle_number})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver</label>
            <select
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Driver (Optional)</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Mileage (Optional)</label>
            <input
              type="number"
              name="start_mileage"
              value={formData.start_mileage}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTripRequest;