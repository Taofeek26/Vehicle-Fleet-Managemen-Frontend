import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripRequestDetail, endTrip } from '../api';

const EndTripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tripRequest, setTripRequest] = useState(null);
  const [formData, setFormData] = useState({
    end_mileage: '',
    vehicle_status_report: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await getTripRequestDetail(id);
        setTripRequest(response.data);
        // Pre-fill latitude and longitude if available from the vehicle
        if (response.data.vehicle && response.data.vehicle.latitude && response.data.vehicle.longitude) {
          setFormData(prev => ({
            ...prev,
            latitude: response.data.vehicle.latitude,
            longitude: response.data.vehicle.longitude,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch trip details:', err);
        setError('Failed to load trip details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const dataToSend = { ...formData };
      dataToSend.end_mileage = dataToSend.end_mileage === '' ? null : parseFloat(dataToSend.end_mileage);
      dataToSend.vehicle_status_report = dataToSend.vehicle_status_report === '' ? null : dataToSend.vehicle_status_report;
      dataToSend.latitude = dataToSend.latitude === '' ? null : parseFloat(dataToSend.latitude);
      dataToSend.longitude = dataToSend.longitude === '' ? null : parseFloat(dataToSend.longitude);

      await endTrip(id, dataToSend);
      alert('Trip ended successfully!');
      navigate(`/dashboard/records/trip/${id}`);
    } catch (err) {
      console.error('Failed to end trip:', err.response?.data);
      setError(
        err.response?.data?.error || 
        Object.values(err.response?.data || {}).flat().join(' ') ||
        'Failed to end trip. Please check the details.'
      );
    }
  };

  if (loading) return <div className="text-center py-4">Loading trip details...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (!tripRequest) return <div className="text-center py-4">Trip request not found.</div>;

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md mx-auto"> {/* Added mx-auto here */}
        <h2 className="text-2xl font-bold text-center mb-6">End Trip for: {tripRequest.destination}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">End Mileage <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="end_mileage"
              value={formData.end_mileage}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Status Report</label>
            <textarea
              name="vehicle_status_report"
              value={formData.vehicle_status_report}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Latitude (Optional)</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Longitude (Optional)</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            End Trip
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)} // Go back to previous page
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EndTripForm;