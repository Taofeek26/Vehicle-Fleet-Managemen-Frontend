import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getCurrentUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CSVLink } from "react-csv";

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

  const headers = [
    { label: "Username", key: "username" },
    { label: "Full Name", key: "full_name" },
    { label: "Role", key: "role" },
    { label: "Reports To", key: "reports_to_name" },
  ];

  if (loading) return <div className="text-center py-4">Loading users...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (currentUserRole !== 'manager') return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <div className="flex gap-4">
          <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
            Add New User
          </Link>
          <CSVLink data={users} headers={headers} filename={"users.csv"} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Export to CSV
          </CSVLink>
        </div>
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
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Full Name</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Reports To</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link to={`/dashboard/users/${user.id}`} className="text-blue-600 hover:underline">
                      {user.username}
                    </Link>
                  </th>
                  <td className="px-6 py-4">{user.full_name || "N/A"}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.reports_to_name || "N/A"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link to={`/dashboard/users/${user.id}`} className="font-medium text-blue-600 hover:underline">
                        View/Edit
                      </Link>
                      <button onClick={() => handleDelete(user.id)} className="font-medium text-red-600 hover:underline">
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
