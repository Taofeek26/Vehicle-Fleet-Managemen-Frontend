import React from "react";
import { Link, useNavigate } from "react-router-dom";

const DriverSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="w-64 bg-gray-900 text-gray-200 min-h-screen flex flex-col">
      <h2 className="text-white text-center text-lg font-bold py-4 border-b border-gray-700">
        Driver Dashboard
      </h2>
      <ul className="flex flex-col space-y-2 px-4 py-6">
        <li>
          <Link
            to="/dashboard/driver-dasboard"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/driver-trips"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            My Trips
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/start-trip"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            Start Trips
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/end-trip"
            className="block py-2 px-3 rounded-md hover:bg-gray-700"
          >
            End Trips
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

export default DriverSidebar;
