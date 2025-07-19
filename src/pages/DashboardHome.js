import React, { useEffect, useState } from 'react';
import { getCurrentUser, getUsers, getVehicles, getTripRequests } from '../api';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    vehicles: [],
    tripRequests: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentUserResponse = await getCurrentUser();
        const currentUser = currentUserResponse.data;
        setUser(currentUser);

        const [usersRes, vehiclesRes, tripsRes] = await Promise.all([
          getUsers(),
          getVehicles(),
          getTripRequests()
        ]);

        setDashboardData({
          users: usersRes.data,
          vehicles: vehiclesRes.data,
          tripRequests: tripsRes.data,
        });

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-4">Loading dashboard...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (!user) return <div className="text-center py-4">User data not available.</div>;

  // --- Data Aggregation for Visualizations and Cards ---
  const { users, vehicles, tripRequests } = dashboardData;

  const getTripStatusData = (filteredTrips) => {
    const statusCounts = filteredTrips.reduce((acc, trip) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(statusCounts).map(status => ({
      name: status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      value: statusCounts[status],
    }));
  };

  const getVehicleAssignmentData = () => {
    const assigned = vehicles.filter(v => v.assigned_driver !== null).length;
    const unassigned = vehicles.length - assigned;
    return [
      { name: 'Assigned', value: assigned },
      { name: 'Unassigned', value: unassigned },
    ];
  };
  
  const getTripsByDriverData = () => {
    const tripsByDriver = tripRequests.reduce((acc, trip) => {
      const driverName = trip.driver_name || 'Unassigned';
      acc[driverName] = (acc[driverName] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(tripsByDriver).map(driverName => ({
      name: driverName,
      trips: tripsByDriver[driverName],
    }));
  };

  const getTripsByRequesterData = () => {
    const tripsByRequester = tripRequests.reduce((acc, trip) => {
      const requesterName = trip.requester_name || 'Unknown';
      acc[requesterName] = (acc[requesterName] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(tripsByRequester).map(requesterName => ({
      name: requesterName,
      trips: tripsByRequester[requesterName],
    }));
  };

  const getAvailableResources = () => {
    const availableDrivers = users.filter(u => u.role === 'driver' && !vehicles.some(v => v.assigned_driver === u.id));
    const availableVehicles = vehicles.filter(v => !tripRequests.some(req => req.vehicle === v.id && (req.status === 'approved' || req.status === 'in_progress')));
    return { availableDrivers, availableVehicles };
  };

  const getDriverData = () => {
    const assignedVehicle = vehicles.find(v => v.assigned_driver === user.id);
    const activeTrips = tripRequests.filter(req => req.driver === user.id && (req.status === 'approved' || req.status === 'in_progress'));
    const completedTrips = tripRequests.filter(req => req.driver === user.id && req.status === 'completed');
    return { assignedVehicle, activeTrips, completedTrips };
  };

  const getSupervisorSubordinates = () => {
    const directSubordinates = users.filter(u => u.reports_to === user.id);
    let allSubordinates = new Set(directSubordinates.map(u => u.id));
    let queue = [...directSubordinates];
    while (queue.length > 0) {
      const current = queue.shift();
      const indirectReports = users.filter(u => u.reports_to === current.id);
      indirectReports.forEach(u => {
        if (!allSubordinates.has(u.id)) {
          allSubordinates.add(u.id);
          queue.push(u);
        }
      });
    }
    return users.filter(u => allSubordinates.has(u.id));
  };

  const getSupervisorTrips = () => {
    return tripRequests;
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.full_name || user.username}!</h1>
      <p className="text-lg text-gray-700 mb-8">Your Role: <span className="font-semibold capitalize">{user.role}</span></p>

      {/* Manager Dashboard */}
      {user.role === 'manager' && (
        <div className="space-y-6">
          <DashboardCard title="Quick Actions" colSpan="lg:col-span-full">
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard/users" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Manage Users</Link>
              <Link to="/dashboard/vehicles" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Manage Vehicles</Link>
              <Link to="/dashboard/trip-requests" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">View All Trip Requests</Link>
            </div>
          </DashboardCard>

          {/* Row 1: Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <DashboardCard title="Total Users" value={users.length} link="/dashboard/users" />
            <DashboardCard title="Total Vehicles" value={vehicles.length} link="/dashboard/vehicles" />
            <DashboardCard title="Total Trips" value={tripRequests.length} link="/dashboard/trip-requests" />
            <DashboardCard title="Pending Supervisor" value={tripRequests.filter(req => req.status === 'pending_supervisor_approval').length} link="/dashboard/trip-requests" />
            <DashboardCard title="Pending Manager" value={tripRequests.filter(req => req.status === 'pending_manager_approval').length} link="/dashboard/trip-requests" />
          </div>

          {/* Row 2: Bar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Trips by Driver" colSpan="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTripsByDriverData()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="trips" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </DashboardCard>
            <DashboardCard title="Trips by Requester" colSpan="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTripsByRequesterData()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="trips" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </DashboardCard>
          </div>

          {/* Row 3: Pie Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Overall Trip Status" colSpan="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={getTripStatusData(tripRequests)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {getTripStatusData(tripRequests).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
            <DashboardCard title="Vehicle Assignment" colSpan="lg:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={getVehicleAssignmentData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {getVehicleAssignmentData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </DashboardCard>
          </div>
        </div>
      )}

      {/* Supervisor Dashboard */}
      {user.role === 'supervisor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DashboardCard title="Quick Actions" colSpan="xl:col-span-full">
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard/users" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Manage Staff/Drivers</Link>
              <Link to="/dashboard/trip-requests" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Approve Trip Requests</Link>
            </div>
          </DashboardCard>
          <DashboardCard title="My Subordinates" value={getSupervisorSubordinates().length} link="/dashboard/users" />
          <DashboardCard title="Vehicles Under My Care" value={vehicles.filter(v => v.supervisor === user.id || users.some(u => u.id === v.assigned_driver && u.reports_to === user.id)).length} link="/dashboard/vehicles" />
          <DashboardCard title="Pending Supervisor Approvals" value={getSupervisorTrips().filter(req => req.status === 'pending_supervisor_approval').length} link="/dashboard/trip-requests" />
          <DashboardCard title="Pending Manager Approvals" value={getSupervisorTrips().filter(req => req.status === 'pending_manager_approval').length} link="/dashboard/trip-requests" />
          <DashboardCard title="My Pending Requests" value={tripRequests.filter(req => req.requester === user.id && (req.status === 'pending_supervisor_approval' || req.status === 'pending_manager_approval')).length} link="/dashboard/trip-requests" />

          <DashboardCard title="Subordinates' Trip Status" colSpan="lg:col-span-2 xl:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getTripStatusData(getSupervisorTrips())}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {getTripStatusData(getSupervisorTrips()).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="My Direct Subordinates" colSpan="lg:col-span-2 xl:col-span-2">
            <ul className="list-disc list-inside">
              {users.filter(u => u.reports_to === user.id).map(sub => (
                <li key={sub.id} className="mb-1"><Link to={`/dashboard/records/user/${sub.id}`} className="text-blue-600 hover:underline">{sub.full_name || sub.username} ({sub.role})</Link></li>
              ))}
            </ul>
          </DashboardCard>
        </div>
      )}

      {/* Staff Dashboard */}
      {user.role === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Quick Actions" colSpan="lg:col-span-full">
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard/create-trip-request" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create New Trip Request</Link>
              <Link to="/dashboard/trip-requests" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">View My Trip Requests</Link>
            </div>
          </DashboardCard>
          <DashboardCard title="My Pending Requests" value={tripRequests.filter(req => req.requester === user.id && (req.status === 'pending_supervisor_approval' || req.status === 'pending_manager_approval')).length} link="/dashboard/trip-requests" />
          <DashboardCard title="Available Drivers" value={getAvailableResources().availableDrivers.length} link="/dashboard/users" />
          <DashboardCard title="Available Vehicles" value={getAvailableResources().availableVehicles.length} link="/dashboard/vehicles" />

          <DashboardCard title="My Trip Request Status" colSpan="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getTripStatusData(tripRequests.filter(req => req.requester === user.id))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {getTripStatusData(tripRequests.filter(req => req.requester === user.id)).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Available Resources Details" colSpan="lg:col-span-1">
            <p className="text-lg mb-2">Drivers: <span className="font-bold">{getAvailableResources().availableDrivers.length}</span></p>
            <ul className="list-disc list-inside mb-4">
              {getAvailableResources().availableDrivers.map(driver => (
                <li key={driver.id}><Link to={`/dashboard/records/user/${driver.id}`} className="text-blue-600 hover:underline">{driver.username}</Link></li>
              ))}
            </ul>
            <p className="text-lg mb-2">Vehicles: <span className="font-bold">{getAvailableResources().availableVehicles.length}</span></p>
            <ul className="list-disc list-inside">
              {getAvailableResources().availableVehicles.map(vehicle => (
                <li key={vehicle.id}><Link to={`/dashboard/records/vehicle/${vehicle.id}`} className="text-blue-600 hover:underline">{vehicle.vehicle_name} ({vehicle.vehicle_number})</Link></li>
              ))}
            </ul>
          </DashboardCard>
        </div>
      )}

      {/* Driver Dashboard */}
      {user.role === 'driver' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Quick Actions" colSpan="lg:col-span-full">
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard/trip-requests" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">View My Trips</Link>
              {getDriverData().assignedVehicle && (
                <Link to={`/dashboard/vehicles/${getDriverData().assignedVehicle.id}/update-location`} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">Update Vehicle Location</Link>
              )}
            </div>
          </DashboardCard>
          <DashboardCard title="My Active Trips" value={getDriverData().activeTrips.length} link="/dashboard/trip-requests" />
          <DashboardCard title="My Completed Trips" value={getDriverData().completedTrips.length} link="/dashboard/trip-requests" />
          <DashboardCard title="My Assigned Vehicles" value={getDriverData().assignedVehicle ? 1 : 0} link="/dashboard/vehicles" />

          <DashboardCard title="My Assigned Vehicle Details" colSpan="lg:col-span-2">
            {getDriverData().assignedVehicle ? (
              <div>
                <p className="text-lg font-semibold">{getDriverData().assignedVehicle.vehicle_name} ({getDriverData().assignedVehicle.vehicle_number})</p>
                <p className="text-sm text-gray-600">Last Updated: {new Date(getDriverData().assignedVehicle.last_updated).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Location: {getDriverData().assignedVehicle.latitude?.toFixed(4)}, {getDriverData().assignedVehicle.longitude?.toFixed(4)}</p>
              </div>
            ) : (
              <p>No vehicle currently assigned.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Active Trips Details" colSpan="lg:col-span-1">
            {getDriverData().activeTrips.length > 0 ? (
              <ul className="list-disc list-inside">
                {getDriverData().activeTrips.map(trip => (
                  <li key={trip.id} className="mb-1"><Link to={`/dashboard/records/trip/${trip.id}`} className="text-blue-600 hover:underline">{trip.destination} ({trip.status.replace(/_/g, ' ')})</Link></li>
                ))}
              </ul>
            ) : (
              <p>No active trips.</p>
            )}
          </DashboardCard>
        </div>
      )}
    </div>
  );
};

const DashboardCard = ({ title, value, link, children, colSpan }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 flex flex-col justify-between ${colSpan || ''}`}>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      {value !== undefined && <p className="text-4xl font-bold text-blue-600">{value}</p>}
    </div>
    {children && <div className="mt-4">{children}</div>}
    {link && (
      <Link 
        to={link} 
        className="mt-4 inline-block text-blue-500 hover:underline transition duration-200"
      >
        View Details
      </Link>
    )}
  </div>
);

export default DashboardHome;
