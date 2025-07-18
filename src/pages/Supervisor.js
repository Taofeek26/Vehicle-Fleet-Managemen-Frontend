import React from "react";
import { useNavigate } from "react-router-dom";

const Supervisor = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Supervisor Access</h2>
      <p className="text-lg text-gray-600 mb-6">
        Are you an existing user or a new user?
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        {/* Existing User Button */}
        <button
          onClick={() => navigate("/supervisor-login")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Existing User
        </button>

        {/* Non-Existing User Button */}
        <button
          onClick={() => navigate("/register-supervisor")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          New User
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Supervisor;
