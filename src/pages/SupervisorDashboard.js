import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

// Helper component to adjust map bounds
const FitBounds = ({ vehicles }) => {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = vehicles.map((vehicle) => [
        vehicle.latitude || 0,
        vehicle.longitude || 0,
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, map]);

  return null;
};

const SupervisorDashboard = () => {
  const [supervisorDetails, setSupervisorDetails] = useState({});
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalVehicles: 0,
    ongoingTrips: 0,
    completedTrips: 0,
  });
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token");

      try {
        // Fetch supervisor details
        const supervisorResponse = await axios.get(
          "http://127.0.0.1:8000/api/user-details/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSupervisorDetails(supervisorResponse.data);

        // Fetch vehicles
        const vehicleResponse = await axios.get(
          "http://127.0.0.1:8000/api/vehicles/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const totalVehicles = vehicleResponse.data.length;
        setVehicles(vehicleResponse.data);

        // Fetch drivers
        const driverResponse = await axios.get(
          "http://127.0.0.1:8000/api/drivers/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const totalDrivers = driverResponse.data.length;

        // Fetch trips
        const tripResponse = await axios.get(
          "http://127.0.0.1:8000/api/driver-trips/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const trips = tripResponse.data;
        const ongoingTrips = trips.filter((trip) => !trip.end_time).length;
        const completedTrips = trips.filter((trip) => trip.end_time).length;

        // Update stats
        setStats({
          totalDrivers,
          totalVehicles,
          ongoingTrips,
          completedTrips,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Message */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {supervisorDetails.username || "Supervisor"}!
        </h1>
        <p className="text-gray-600">
          Manage drivers, vehicles, and monitor trips efficiently.
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {stats.totalDrivers}
          </h2>
          <p className="text-gray-600">Total Drivers</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {stats.totalVehicles}
          </h2>
          <p className="text-gray-600">Total Vehicles</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {stats.ongoingTrips}
          </h2>
          <p className="text-gray-600">Ongoing Trips</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {stats.completedTrips}
          </h2>
          <p className="text-gray-600">Completed Trips</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link to="/dashboard/drivers">
          <button className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-600 transition">
            Manage Drivers
          </button>
        </Link>

        <Link to="/dashboard/vehicles">
          <button className="bg-green-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-green-600 transition">
            Manage Vehicles
          </button>
        </Link>

        <Link to="/dashboard/driver-trips">
          <button className="bg-yellow-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition">
            View Trips
          </button>
        </Link>

        <Link to="/driver-register">
          <button className="bg-gray-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-gray-600 transition">
            Create Driver
          </button>
        </Link>
      </div>


      {/* Map Summary Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Vehicle Location Summary
        </h2>
        <div className="relative h-80">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={10}
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Adjust map bounds */}
            <FitBounds vehicles={vehicles} />
            {vehicles.map((vehicle) => (
              <Marker
                key={vehicle.id}
                position={[vehicle.latitude || 0, vehicle.longitude || 0]}
              />
            ))}
          </MapContainer>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => (window.location.href = "/dashboard/map")}
        >
          View Full Map
        </button>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
