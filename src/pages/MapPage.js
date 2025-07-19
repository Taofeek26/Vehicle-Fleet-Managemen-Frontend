import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getVehicles } from '../api'; // Import from centralized API

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles(); // Use centralized API
      // Filter vehicles that have location data
      const vehiclesWithLocation = response.data.filter(v => v.latitude && v.longitude);
      setVehicles(vehiclesWithLocation);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError('Failed to load vehicle locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(); // Initial fetch

    // Set up interval for periodic updates (e.g., every 10 seconds)
    const intervalId = setInterval(fetchVehicles, 10000); 

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div className="text-center py-4">Loading map data...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Live Vehicle Map</h2>
      <div style={{ height: '600px', width: '100%' }} className="rounded-lg shadow-md overflow-hidden">
        <MapContainer center={[9.0765, 7.3986]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {vehicles.map(vehicle => (
            <Marker key={vehicle.id} position={[vehicle.latitude, vehicle.longitude]}>
              <Popup>
                <strong className="text-lg">{vehicle.vehicle_name}</strong><br />
                <span className="text-sm text-gray-600">{vehicle.vehicle_number}</span><br />
                <span className="text-sm">Driver: {vehicle.assigned_driver_name || 'N/A'}</span><br />
                <span className="text-xs text-gray-500">Last Updated: {new Date(vehicle.last_updated).toLocaleTimeString()}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">Vehicles with Location Data:</h3>
        {vehicles.length > 0 ? (
          <ul className="list-disc list-inside">
            {vehicles.map(vehicle => (
              <li key={vehicle.id} className="mb-1">
                <strong>{vehicle.vehicle_name} ({vehicle.vehicle_number}):</strong> Lat: {vehicle.latitude.toFixed(4)}, Lng: {vehicle.longitude.toFixed(4)} (Driver: {vehicle.assigned_driver_name || 'N/A'})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No vehicles with active location data found.</p>
        )}
      </div>
    </div>
  );
};

export default MapPage;