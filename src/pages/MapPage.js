import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

// Fix Leaflet marker icon issue
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to adjust map bounds
const FitBounds = ({ vehicles }) => {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((vehicle) => [
          vehicle.latitude || 51.505,
          vehicle.longitude || -0.09,
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, map]);

  return null;
};

const MapPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const token = localStorage.getItem("access_token");
  const [searchParams] = useSearchParams();

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      return response.data.display_name || "Unknown Location";
    } catch (err) {
      console.error("Error fetching place name:", err);
      return "Unknown Location";
    }
  };

  useEffect(() => {
    const fetchVehicleLocations = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/vehicles/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch place names for each vehicle
        const updatedVehicles = await Promise.all(
          response.data.map(async (vehicle) => {
            const placeName = await fetchPlaceName(
              vehicle.latitude || 51.505,
              vehicle.longitude || -0.09
            );
            return { ...vehicle, placeName };
          })
        );

        setVehicles(updatedVehicles);

        // If search params exist, center map on specific coordinates
        const latitude = parseFloat(searchParams.get("latitude"));
        const longitude = parseFloat(searchParams.get("longitude"));
        console.log("Error fetching vehicle locations::", latitude, longitude);
        if (!isNaN(latitude) && !isNaN(longitude)) {
          setMapCenter([latitude, longitude]);
        } else if (updatedVehicles.length > 0) {
          // Default to the first vehicle's location if no search params
          setMapCenter([
            updatedVehicles[0].latitude || 51.505,
            updatedVehicles[0].longitude || -0.09,
          ]);
        }
      } catch (err) {
        console.error("Error fetching vehicle locations:", err);
        setError("Failed to load vehicle locations. Please try again.");
      }
    };

    fetchVehicleLocations();
  }, [token, searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6 mb-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Vehicle Tracking Map
        </h2>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      <div className="w-full max-w-7xl">
        <MapContainer
          center={mapCenter} // Dynamic center based on search params or vehicles
          zoom={10}
          className="rounded-lg shadow-lg"
          style={{ height: "80vh", width: "100%" }}
        >
          {/* Adjust map bounds to fit all vehicles */}
          <FitBounds vehicles={vehicles} />

          {/* Map Tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Vehicle Markers */}
          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[
                vehicle.latitude || 51.505,
                vehicle.longitude || -0.09,
              ]}
            >
              <Popup>
                <div className="text-sm text-gray-700">
                  <p>
                    <strong>Vehicle:</strong> {vehicle.vehicle_name}
                  </p>
                  <p>
                    <strong>Driver:</strong> {vehicle.assigned_driver || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {vehicle.placeName}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {vehicle.last_updated || "N/A"}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
