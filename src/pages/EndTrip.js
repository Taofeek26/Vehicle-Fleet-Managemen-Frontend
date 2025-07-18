import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EndTrip = () => {
  const [trip, setTrip] = useState(null); // Ongoing trip
  const [endMileage, setEndMileage] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState(""); // Vehicle status field
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchOngoingTrip = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/driver-trips/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ongoingTrip = response.data.find(
          (trip) => trip.end_time === null
        );
        if (ongoingTrip) {
          setTrip(ongoingTrip);
        }
      } catch (err) {
        console.error("Error fetching ongoing trip:", err);
        setError("Failed to fetch ongoing trip. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingTrip();
  }, [token]);

  const handleEndTrip = async () => {
    if (Number(endMileage) <= Number(trip.start_mileage)) {
      setError("End mileage must be greater than start mileage.");
      return;
    }

    const distanceCovered = Number(endMileage) - Number(trip.start_mileage);

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/driver-trips/${trip.id}/`,
        {
          ...trip,
          end_time: new Date().toISOString(), // Automatically set end time
          end_mileage: Number(endMileage),
          distance_covered: distanceCovered,
          vehicle_status: vehicleStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Trip ended successfully!");
      navigate("/dashboard/driver-trips");
    } catch (err) {
      console.error("Error ending trip:", err.response?.data || err);
      setError("Failed to end the trip. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading ongoing trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">No ongoing trip found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">End Current Trip</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Destination:</span> {trip.destination}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Start Mileage:</span>{" "}
          {trip.start_mileage}
        </p>

        {/* End Mileage Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            End Mileage:
          </label>
          <input
            type="number"
            value={endMileage}
            onChange={(e) => setEndMileage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Vehicle Status Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Vehicle Status:
          </label>
          <textarea
            value={vehicleStatus}
            onChange={(e) => setVehicleStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the final vehicle status (e.g., Good, Needs Maintenance)"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleEndTrip}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            End Trip
          </button>
          <button
            onClick={() => navigate("/dashboard/driver-trips")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndTrip;
