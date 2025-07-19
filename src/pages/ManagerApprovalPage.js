import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripRequestDetail, approveTripRequestManager, getCurrentUser } from '../api';

const ManagerApprovalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tripRequest, setTripRequest] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [tripResponse, userResponse] = await Promise.all([
          getTripRequestDetail(id),
          getCurrentUser(),
        ]);
        setTripRequest(tripResponse.data);
        setUser(userResponse.data);

        if (userResponse.data.role !== 'manager') {
          setError('You are not authorized to view this page.');
        }
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleManagerApproval = async () => {
    if (window.confirm('Are you sure you want to give final approval?')) {
      try {
        await approveTripRequestManager(id);
        alert('Trip request approved!');
        navigate('/dashboard/trip-requests');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to approve trip request.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tripRequest || !user) return <p>No data found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Approval for Trip Request</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="mb-2"><span className="font-semibold">Requester:</span> {tripRequest.requester_name}</p>
        <p className="mb-2"><span className="font-semibold">Destination:</span> {tripRequest.destination}</p>
        <p className="mb-4"><span className="font-semibold">Status:</span> {tripRequest.status.replace(/_/g, ' ')}</p>
        
        {tripRequest.status === 'pending_manager_approval' ? (
          <button
            onClick={handleManagerApproval}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Grant Final Approval
          </button>
        ) : (
          <p className="text-gray-600">This request is not awaiting manager approval.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerApprovalPage;
