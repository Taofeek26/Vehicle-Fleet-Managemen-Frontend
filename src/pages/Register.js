import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, getUsers } from "../api";
import { Button } from "../components/ui/Button";

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div
        className={`h-2.5 rounded-full ${strengthColors[strength - 1] || ''}`}
        style={{ width: `${(strength / 5) * 100}%` }}
      ></div>
      <p className="text-xs text-right mt-1">{strengthLabels[strength - 1] || ''}</p>
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    role: "driver",
    year_joined: "",
    type_of_appointment: "",
    reports_to: "",
    manager_passcode: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword; // Don't send this to the backend

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
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create an Account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Join FleetFlow to streamline your fleet management</p>
        </div>
        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900 dark:text-red-200 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username <span className="text-red-500">*</span></label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password <span className="text-red-500">*</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            <PasswordStrengthMeter password={formData.password} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password <span className="text-red-500">*</span></label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role <span className="text-red-500">*</span></label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
              <option value="driver">Driver</option>
              <option value="staff">Staff</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          {formData.role === 'manager' && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Manager Passcode <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="manager_passcode"
                value={formData.manager_passcode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year Joined <span className="text-red-500">*</span></label>
              <input type="number" name="year_joined" value={formData.year_joined} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type of Appointment</label>
              <input type="text" name="type_of_appointment" value={formData.type_of_appointment} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
          </div>
          {formData.role !== 'manager' && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reports To</label>
              <select name="reports_to" value={formData.reports_to} onChange={handleChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="">None</option>
                {users.filter(u => u.role === 'supervisor' || u.role === 'manager').map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            Register
          </Button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-300">
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
