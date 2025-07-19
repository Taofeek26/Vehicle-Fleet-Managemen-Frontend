import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, getUsers } from "../api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    role: "driver",
    year_joined: "",
    type_of_appointment: "",
    reports_to: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const dataToSend = { ...formData };
      if (dataToSend.reports_to === "") {
        dataToSend.reports_to = null;
      } else {
        dataToSend.reports_to = parseInt(dataToSend.reports_to);
      }
      
      await register(dataToSend);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.response?.data);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.username?.[0] ||
          err.response?.data?.email?.[0] ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
          <p className="mt-2 text-gray-600">Join FleetFlow to streamline your fleet management</p>
        </div>
        {error && <p className="text-red-500 text-center bg-red-100 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="w-full px-4 py-2 border rounded-md"/>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-4 py-2 border rounded-md"/>
          </div>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full px-4 py-2 border rounded-md"/>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border rounded-md"/>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
            <option value="driver">Driver</option>
            <option value="staff">Staff</option>
            <option value="supervisor">Supervisor</option>
            <option value="manager">Manager</option>
          </select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="year_joined" value={formData.year_joined} onChange={handleChange} placeholder="Year Joined" className="w-full px-4 py-2 border rounded-md"/>
            <input type="text" name="type_of_appointment" value={formData.type_of_appointment} onChange={handleChange} placeholder="Type of Appointment" className="w-full px-4 py-2 border rounded-md"/>
          </div>
          <select name="reports_to" value={formData.reports_to} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
            <option value="">Reports to (None)</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
