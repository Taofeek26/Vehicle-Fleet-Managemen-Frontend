import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserDetail, getVehicleDetail } from '../api';
import TripRequestDetail from './TripRequestDetail'; // Import the main component

const RecordDetailsPage = () => {
  const { type, id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No need to fetch trip details here, as TripRequestDetail will do it.
    if (type === 'trip') {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (type === 'user') {
          response = await getUserDetail(id);
        } else if (type === 'vehicle') {
          response = await getVehicleDetail(id);
        } else {
          setError('Invalid record type.');
          setLoading(false);
          return;
        }
        setRecord(response.data);
      } catch (err) {
        setError(`Failed to fetch ${type} details.`);
        console.error(`Error fetching ${type} details:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [type, id]);

  if (loading) return <div className="text-center py-4">Loading {type} details...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  // If the type is 'trip', render the dedicated TripRequestDetail component
  if (type === 'trip') {
    return <TripRequestDetail />;
  }
  
  if (!record) return <div className="text-center py-4">{type} not found.</div>;

  const renderRecordDetails = () => {
    switch (type) {
      case 'user':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User: {record.username}</h2>
            <p className="mb-2"><span className="font-semibold">Full Name:</span> {record.full_name || 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Email:</span> {record.email}</p>
            <p className="mb-2"><span className="font-semibold">Role:</span> {record.role}</p>
            <p className="mb-2"><span className="font-semibold">Year Joined:</span> {record.year_joined || 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Type of Appointment:</span> {record.type_of_appointment || 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Reports To:</span> {record.reports_to_name || 'N/A'}</p>
          </div>
        );
      case 'vehicle':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle: {record.vehicle_name}</h2>
            <p className="mb-2"><span className="font-semibold">Vehicle Number:</span> {record.vehicle_number}</p>
            <p className="mb-2"><span className="font-semibold">Assigned Driver:</span> {record.assigned_driver_name || 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Supervisor:</span> {record.supervisor_name || 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Last Maintenance:</span> {record.last_maintenance_date || 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Next Maintenance:</span> {record.next_maintenance_date || 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Current Location:</span> {record.latitude && record.longitude ? `${record.latitude}, ${record.longitude}` : 'N/A'}</p>
            <p className="mb-2"><span className="font-semibold">Last Updated:</span> {record.last_updated ? new Date(record.last_updated).toLocaleString() : 'N/A'}</p>
          </div>
        );
      default:
        return <div className="text-center py-4 text-red-500">Unknown record type.</div>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Record Details</h1>
      {renderRecordDetails()}
    </div>
  );
};

export default RecordDetailsPage;