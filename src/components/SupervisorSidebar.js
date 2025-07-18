import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SupervisorSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="w-64 bg-gray-900 text-gray-200 min-h-screen flex flex-col">
      <h2 className="text-white text-center text-lg font-bold py-4 border-b border-gray-700">
        Supervisor Dashboard
      </h2>
      <ul className="flex flex-col space-y-2 px-4 py-6">
        <li>
          <Link
            to="/dashboard"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/drivers"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            Manage Drivers
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/vehicles"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            Manage Vehicles
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/driver-trips"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            View Trips
          </Link>
        </li>
        <li>
          <Link
            to="/driver-register"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            Create Driver
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/map"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            Vehicle Map
          </Link>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-3 rounded-md text-red-500 hover:bg-gray-700 hover:text-red-400"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SupervisorSidebar;
