import React, { useEffect, useState, useMemo } from "react";
import { getTripRequests, getCurrentUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { CSVLink } from "react-csv";

const TRIPS_PER_PAGE = 10;

const TripRequestList = () => {
  const [tripRequests, setTripRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailsResponse = await getCurrentUser();
        setCurrentUser(userDetailsResponse.data);

        const tripRequestsResponse = await getTripRequests();
        // Sort trips by start_time in descending order (newest first)
        const sortedTrips = tripRequestsResponse.data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        setTripRequests(sortedTrips);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load trip requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const paginatedTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * TRIPS_PER_PAGE;
    return tripRequests.slice(startIndex, startIndex + TRIPS_PER_PAGE);
  }, [currentPage, tripRequests]);

  const totalPages = Math.ceil(tripRequests.length / TRIPS_PER_PAGE);

  const handleEndTrip = (id) => {
    navigate(`/dashboard/end-trip/${id}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-200 text-green-800';
      case 'in_progress':
        return 'bg-blue-200 text-blue-800';
      case 'pending_manager_approval':
        return 'bg-yellow-200 text-yellow-800';
      case 'pending_supervisor_approval':
        return 'bg-orange-200 text-orange-800';
      case 'rejected':
        return 'bg-red-200 text-red-800';
      case 'completed':
        return 'bg-gray-300 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const headers = [
    // ... (headers are unchanged)
  ];

  if (loading) return <div className="text-center py-4">Loading trip requests...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Trip Requests</h2>
        <div className="flex gap-4">
          <Link to="/dashboard/create-trip-request" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            Create New Trip
          </Link>
          <CSVLink data={tripRequests} headers={headers} filename={"trip_requests.csv"} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Export to CSV
          </CSVLink>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-800 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Requester</th>
                <th className="py-3 px-6 text-left">Vehicle</th>
                <th className="py-3 px-6 text-left">Driver</th>
                <th className="py-3 px-6 text-left">Destination</th>
                <th className="py-3 px-6 text-left">Start Time</th>
                <th className="py-3 px-6 text-left">End Time</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {paginatedTrips.map((request) => {
                const isTripActive = request.status === 'approved' || request.status === 'in_progress';
                const canEndTrip = currentUser && (
                  currentUser.role === 'manager' ||
                  currentUser.role === 'supervisor' ||
                  (currentUser.role === 'driver' && request.driver === currentUser.id)
                );

                return (
                  <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{request.requester_name}</td>
                    <td className="py-3 px-6 text-left">{request.vehicle_name}</td>
                    <td className="py-3 px-6 text-left">{request.driver_name || "N/A"}</td>
                    <td className="py-3 px-6 text-left">{request.destination}</td>
                    <td className="py-3 px-6 text-left">{new Date(request.start_time).toLocaleString()}</td>
                    <td className="py-3 px-6 text-left">{request.end_time ? new Date(request.end_time).toLocaleString() : "N/A"}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                        {request.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {currentUser && (currentUser.role === 'supervisor' || currentUser.role === 'manager') && (request.status === 'pending_supervisor_approval' || request.status === 'pending_manager_approval') && (
                          <Link
                            to={`/dashboard/trip-requests/${request.id}`}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                          >
                            Review
                          </Link>
                        )}
                        {canEndTrip && isTripActive && (
                          <button
                            onClick={() => handleEndTrip(request.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                          >
                            End Trip
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripRequestList;