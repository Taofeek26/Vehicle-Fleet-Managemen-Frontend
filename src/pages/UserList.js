import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getCurrentUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getCurrentUser();
        const role = userResponse.data.role;
        setCurrentUserRole(role);

        if (role !== 'manager') {
          navigate('/dashboard');
          return;
        }

        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users or user role:", err);
        setError("Failed to load users or check permissions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error("Failed to delete user:", err);
        setError("Failed to delete user.");
      }
    }
  };

  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(roleCounts).map(role => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: roleCounts[role],
  }));
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) return <div className="text-center py-4">Loading users...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (currentUserRole !== 'manager') return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          Add New User
        </Link>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Users" value={users.length} />
          <StatCard title="Managers" value={roleCounts.manager || 0} />
          <StatCard title="Supervisors" value={roleCounts.supervisor || 0} />
          <StatCard title="Staff" value={roleCounts.staff || 0} />
          <StatCard title="Drivers" value={roleCounts.driver || 0} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-center mb-4">User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Full Name</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Reports To</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                    <Link to={`/dashboard/users/${user.id}`} className="text-blue-600 hover:underline">
                      {user.username}
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-left">{user.full_name || "N/A"}</td>
                  <td className="py-3 px-6 text-left">{user.role}</td>
                  <td className="py-3 px-6 text-left">{user.reports_to_name || "N/A"}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center gap-2">
                      <Link to={`/dashboard/users/${user.id}`} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        View/Edit
                      </Link>
                      <button onClick={() => handleDelete(user.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
