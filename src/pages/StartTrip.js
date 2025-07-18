import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationUpdater from "../components/LocationUpdater"; // Import LocationUpdater

const StartTrip = () => {
  const [tripData, setTripData] = useState({
    vehicle_id: "",
    destination: "",
    start_mileage: "",
    vehicle_status: "",
    driver: "",
    start_time: new Date().toISOString(), // Automatically set to current time
    end_time: null,
    end_mileage: null,
    distance_covered: null,
  });
  const [vehicles, setVehicles] = useState([]); // Vehicle list
  const [drivers, setDrivers] = useState([]); // Driver list
  const [userType, setUserType] = useState(""); // User type
  const [error, setError] = useState("");
  const [tripStarted, setTripStarted] = useState(false); // Track trip state
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  console.log("Access Token:", token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/user-details/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserType(userResponse.data.user_type);

        // Fetch vehicles
        const vehicleResponse = await axios.get(
          "http://127.0.0.1:8000/api/vehicles/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVehicles(vehicleResponse.data);

        // Fetch drivers (for supervisors only)
        if (userResponse.data.user_type === "supervisor") {
          const driversResponse = await axios.get(
            "http://127.0.0.1:8000/api/drivers/",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDrivers(driversResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, [token]);

  const handleStartTrip = async () => {
    try {
      const tripPayload = {
        ...tripData,
        start_time: new Date().toISOString(),
        driver: userType === "driver" ? null : tripData.driver,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/driver-trips/",
        tripPayload,
        { headers: { Authorization: `Bearer ${token}` } },
        console.log("payload:", tripPayload)
      );

      alert("Trip started successfully!");
      setTripStarted(true);
      setTripData((prevData) => ({ ...prevData, id: response.data.id })); // Save trip ID
    } catch (err) {
      console.error("Error starting trip:", err);
      setError("Failed to start trip. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Start New Trip</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {!tripStarted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStartTrip();
          }}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
        >
          {/* Vehicle Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Select Vehicle:
            </label>
            <select
              value={tripData.vehicle}
              onChange={(e) =>
                setTripData({ ...tripData, vehicle_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicle_name}
                </option>
              ))}
            </select>
          </div>

          {/* Driver Selection (Only for Supervisor) */}
          {userType === "supervisor" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Assign Driver:
              </label>
              <select
                value={tripData.driver}
                onChange={(e) =>
                  setTripData({ ...tripData, driver: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Destination */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Destination:
            </label>
            <input
              type="text"
              value={tripData.destination}
              onChange={(e) =>
                setTripData({ ...tripData, destination: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Start Mileage */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Start Mileage:
            </label>
            <input
              type="number"
              value={tripData.start_mileage}
              onChange={(e) =>
                setTripData({ ...tripData, start_mileage: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Vehicle Status */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Vehicle Status:
            </label>
            <textarea
              value={tripData.vehicle_status}
              onChange={(e) =>
                setTripData({ ...tripData, vehicle_status: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Start Trip
            </button>
            <button
              onClick={() => navigate("/dashboard/driver-trips")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center mt-6">
          <h3 className="text-xl font-bold text-green-600">
            Trip in Progress!
          </h3>
          <p className="text-gray-700">Location updates are active.</p>
          <LocationUpdater vehicleId={tripData.vehicle} />
        </div>
      )}
    </div>
  );
};

export default StartTrip;
