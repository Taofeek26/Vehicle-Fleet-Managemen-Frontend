import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripRequestDetail, approveTripRequestSupervisor, approveTripRequestManager, rejectTripRequest, getCurrentUser } from '../api';

const TripRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tripRequest, setTripRequest] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTripRequestAndUser = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tripResponse, userResponse] = await Promise.all([
        getTripRequestDetail(id),
        getCurrentUser()
      ]);
      setTripRequest(tripResponse.data);
      setUser(userResponse.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load trip request details or user data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTripRequestAndUser();
  }, [fetchTripRequestAndUser]);

  const handleSupervisorApproval = async () => {
    if (window.confirm('Are you sure you want to approve this trip request as a Supervisor?')) {
      try {
        await approveTripRequestSupervisor(id);
        alert('Trip request approved by supervisor!');
        fetchTripRequestAndUser(); // Re-fetch to update status
      } catch (err) {
        console.error('Error approving trip request (supervisor):', err.response?.data);
        setError(err.response?.data?.error || 'Failed to approve trip request as supervisor.');
      }
    }
  };

  

  const handleManagerApproval = async () => {
    if (window.confirm('Are you sure you want to grant final approval for this trip request?')) {
      try {
        await approveTripRequestManager(id);
        alert('Trip request approved by manager!');
        fetchTripRequestAndUser(); // Re-fetch to update status
      } catch (err) {
        console.error('Error approving trip request (manager):', err.response?.data);
        setError(err.response?.data?.error || 'Failed to approve trip request as manager.');
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this trip request?')) {
      try {
        await rejectTripRequest(id);
        alert('Trip request rejected!');
        fetchTripRequestAndUser(); // Re-fetch to update status
      } catch (err) {
        console.error('Error rejecting trip request:', err.response?.data);
        setError(err.response?.data?.error || 'Failed to reject trip request.');
      }
    }
  };

  const handleEndTrip = () => {
    navigate(`/dashboard/end-trip/${id}`); // Navigate to the new EndTripForm
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending_manager_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_supervisor_approval':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading trip request details...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!tripRequest || !user) {
    return <div className="text-center py-4">Trip request or user data not found.</div>;
  }

  const isDriverAssigned = tripRequest.driver === user.id; // Check if current user is the assigned driver
  const isTripActive = tripRequest.status === 'approved' || tripRequest.status === 'in_progress';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trip Request Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p className="mb-2"><span className="font-semibold">Requester:</span> {tripRequest.requester_name}</p>
          <p className="mb-2"><span className="font-semibold">Vehicle:</span> {tripRequest.vehicle_name}</p>
          <p className="mb-2"><span className="font-semibold">Driver:</span> {tripRequest.driver_name || 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Destination:</span> {tripRequest.destination}</p>
          <p className="mb-2"><span className="font-semibold">Start Time:</span> {new Date(tripRequest.start_time).toLocaleString()}</p>
          <p className="mb-2"><span className="font-semibold">End Time:</span> {tripRequest.end_time ? new Date(tripRequest.end_time).toLocaleString() : 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Status:</span> 
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(tripRequest.status)}`}>
              {tripRequest.status.replace(/_/g, " ")}
            </span>
          </p>
          <p className="mb-2"><span className="font-semibold">Supervisor Approver:</span> {tripRequest.supervisor_approver_name || 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Supervisor Approved At:</span> {tripRequest.supervisor_approved_at ? new Date(tripRequest.supervisor_approved_at).toLocaleString() : 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Manager Approver:</span> {tripRequest.manager_approver_name || 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Manager Approved At:</span> {tripRequest.manager_approved_at ? new Date(tripRequest.manager_approved_at).toLocaleString() : 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Start Mileage:</span> {tripRequest.start_mileage || 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">End Mileage:</span> {tripRequest.end_mileage || 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Distance Covered:</span> {tripRequest.distance_covered || 'N/A'}</p>
          <p className="mb-2"><span className="font-semibold">Vehicle Status Report:</span> {tripRequest.vehicle_status_report || 'N/A'}</p>
        </div>

        <div className="flex space-x-4">
          {(user.role === 'supervisor' || user.role === 'manager') &&
            tripRequest.status === 'pending_supervisor_approval' && (
              <button
                onClick={handleSupervisorApproval}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Approve (Supervisor)
              </button>
            )}

          {user.role === 'manager' &&
            tripRequest.status === 'pending_manager_approval' && (
              <button
                onClick={handleManagerApproval}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Approve (Manager)
              </button>
            )}

          {(user.role === 'supervisor' || user.role === 'manager') &&
            (tripRequest.status === 'pending_supervisor_approval' || tripRequest.status === 'pending_manager_approval') && (
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Reject
              </button>
            )}

          {(user.role === 'manager' || user.role === 'supervisor' || (user.role === 'driver' && isDriverAssigned)) && isTripActive && (
            <button
              onClick={handleEndTrip}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              End Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripRequestDetail;
