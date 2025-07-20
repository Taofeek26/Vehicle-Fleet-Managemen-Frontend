import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVehicleDetail, updateVehicle, getUsers, getCurrentUser } from '../api';
import { Car } from 'lucide-react';

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [vehicleResponse, currentUserResponse, usersResponse] = await Promise.all([
          getVehicleDetail(id),
          getCurrentUser(),
          getUsers()
        ]);
        
        setVehicle(vehicleResponse.data);
        setFormData(vehicleResponse.data);
        setCurrentUser(currentUserResponse.data);
        setUsers(usersResponse.data);
        
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      // Handle empty strings for foreign keys
      if (dataToSend.assigned_driver === "") dataToSend.assigned_driver = null;
      if (dataToSend.supervisor === "") dataToSend.supervisor = null;
      
      const response = await updateVehicle(id, dataToSend);
      setVehicle(response.data);
      setIsEditMode(false);
      alert('Vehicle updated successfully!');
    } catch (err) {
      setError('Failed to update vehicle.');
      console.error('Error updating vehicle:', err.response?.data);
    }
  };

  const canEdit = currentUser && ['manager', 'supervisor'].includes(currentUser.role);
  const drivers = users.filter(u => u.role === 'driver');
  const supervisors = users.filter(u => u.role === 'supervisor' || u.role === 'manager');

  if (loading) return <div className="text-center py-4">Loading vehicle details...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (!vehicle) return <div className="text-center py-4">Vehicle not found.</div>;

  return (
    <div className="container mx-auto p-4">
      {!isEditMode ? (
        // VIEW MODE
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center">
            <Car className="w-24 h-24 text-blue-600 dark:text-blue-400 mr-8"/>
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{vehicle.vehicle_name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{vehicle.vehicle_number}</p>
              {canEdit && (
                <button onClick={() => setIsEditMode(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Vehicle
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Assigned Driver:</span> {vehicle.assigned_driver_name || 'N/A'}</p>
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Supervisor:</span> {vehicle.supervisor_name || 'N/A'}</p>
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Last Maintenance:</span> {vehicle.last_maintenance_date || 'N/A'}</p>
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Next Maintenance:</span> {vehicle.next_maintenance_date || 'N/A'}</p>
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Current Location:</span> {vehicle.latitude && vehicle.longitude ? `${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}` : 'N/A'}</p>
              <p><span className="font-semibold text-gray-800 dark:text-gray-200">Last Updated:</span> {new Date(vehicle.last_updated).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/dashboard/map" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              View on Map
            </Link>
          </div>
        </div>
      ) : (
        // EDIT MODE
        <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="vehicle_name" value={formData.vehicle_name || ''} onChange={handleChange} placeholder="Vehicle Name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
            <input type="text" name="vehicle_number" value={formData.vehicle_number || ''} onChange={handleChange} placeholder="Vehicle Number" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
            <select name="assigned_driver" value={formData.assigned_driver || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Assign Driver (None)</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.full_name || d.username}</option>)}
            </select>
            <select name="supervisor" value={formData.supervisor || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Assign Supervisor (None)</option>
              {supervisors.map(s => <option key={s.id} value={s.id}>{s.full_name || s.username}</option>)}
            </select>
            <input type="date" name="last_maintenance_date" value={formData.last_maintenance_date || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
            <input type="date" name="next_maintenance_date" value={formData.next_maintenance_date || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save Changes</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VehicleDetail;