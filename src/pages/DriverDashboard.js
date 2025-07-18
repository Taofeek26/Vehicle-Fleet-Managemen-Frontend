import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationUpdater from "../components/LocationUpdater";

const DriverDashboard = () => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [ongoingTrip, setOngoingTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch driver details
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/user-details/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDriverDetails(userResponse.data);

        // Fetch assigned vehicles
        const vehiclesResponse = await axios.get(
          "http://127.0.0.1:8000/api/vehicles/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignedVehicles(vehiclesResponse.data);

        // Fetch ongoing trip
        const tripsResponse = await axios.get(
          "http://127.0.0.1:8000/api/driver-trips/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const activeTrip = tripsResponse.data.find(
          (trip) => trip.end_time === null
        );
        setOngoingTrip(activeTrip);
        console.log(ongoingTrip);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Welcome Section */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          Welcome, {driverDetails?.username || "Driver"}!
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Log your trips, view assigned vehicles, and manage your work schedule
          efficiently.
        </p>

        {/* Include LocationUpdater for ongoing trips */}
        {ongoingTrip && ongoingTrip.vehicle_id && (
          <LocationUpdater vehicleId={ongoingTrip.vehicle_id} />
        )}

        {/* Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start a Trip */}
          {!ongoingTrip && (
            <div
              className="bg-blue-500 text-white rounded-lg shadow-md p-4 hover:bg-blue-600 transition cursor-pointer"
              onClick={() => navigate("/dashboard/start-trip")}
            >
              <h3 className="text-lg font-semibold mb-2">Start a Trip</h3>
              <p>
                Log the start of a new trip, including mileage and destination.
              </p>
            </div>
          )}

          {/* End a Trip */}
          {ongoingTrip && (
            <div
              className="bg-green-500 text-white rounded-lg shadow-md p-4 hover:bg-green-600 transition cursor-pointer"
              onClick={() => navigate(`/dashboard/end-trip/${ongoingTrip.id}`)}
            >
              <h3 className="text-lg font-semibold mb-2">End a Trip</h3>
              <p>Complete your ongoing trip and log the ending mileage.</p>
            </div>
          )}

          {/* View Trips */}
          <div
            className="bg-yellow-500 text-white rounded-lg shadow-md p-4 hover:bg-yellow-600 transition cursor-pointer"
            onClick={() => navigate("/dashboard/driver-trips")}
          >
            <h3 className="text-lg font-semibold mb-2">View Trips</h3>
            <p>Access your trip history, including mileage and destinations.</p>
          </div>

          {/* Assigned Vehicles */}
          <div
            className="bg-purple-500 text-white rounded-lg shadow-md p-4 hover:bg-purple-600 transition cursor-pointer"
            onClick={() => navigate("/dashboard/vehicles")}
          >
            <h3 className="text-lg font-semibold mb-2">Assigned Vehicles</h3>
            <p>
              View the vehicles assigned to you and their maintenance status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
