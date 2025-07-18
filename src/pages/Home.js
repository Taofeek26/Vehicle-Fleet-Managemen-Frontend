import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Car } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-4xl p-4">
        <div className="text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Welcome to Vehicle Fleet Manager
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your vehicle fleet operations with our comprehensive
              management system
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Select Your Role
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Supervisor Card */}
              <button
                onClick={() => navigate("/supervisor")}
                className="group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
              >
                <div className="h-full p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500 flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                    <Shield className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Supervisor
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Manage fleet and oversee operations
                  </p>
                </div>
              </button>

              {/* Driver Card */}
              <button
                onClick={() => navigate("/driver-login")}
                className="group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
              >
                <div className="h-full p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500 flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                    <Car className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Driver
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Access your driving assignments
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-600">
            Choose your role to get started with our advanced fleet management
            system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
