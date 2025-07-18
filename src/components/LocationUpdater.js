// LocationUpdater.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const LocationUpdater = ({ vehicleId }) => {
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    let interval;

    const updateLocation = async (latitude, longitude) => {
      try {
        console.log(`Sending update for Vehicle ID ${vehicleId}:`, {
          latitude,
          longitude,
        });
        await axios.post(
          `http://127.0.0.1:8000/api/vehicles/${vehicleId}/update-location/`,
          { latitude, longitude },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error updating location:", err);
        setError("Failed to update location.");
      }
    };

    const trackLocation = () => {
      if ("geolocation" in navigator) {
        interval = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log(
                `Current Position: Latitude=${latitude}, Longitude=${longitude}`
              );
              updateLocation(latitude, longitude);
            },
            (err) => {
              console.error("Geolocation error:", err);
              setError("Unable to retrieve location.");
            }
          );
        }, 10000); // Update every 10 seconds
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    trackLocation();

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [vehicleId, token]);

  return <div>{error && <p className="text-red-500">{error}</p>}</div>;
};

export default LocationUpdater;
