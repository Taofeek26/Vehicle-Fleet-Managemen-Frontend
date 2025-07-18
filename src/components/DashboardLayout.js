import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import SupervisorSidebar from "./SupervisorSidebar";
import DriverSidebar from "./DriverSidebar";

const DashboardLayout = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/"); // Redirect to home if not logged in
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user-details/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserType(response.data.user_type); // Set user type (supervisor/driver)
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/"); // Redirect on error
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (!userType)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading...
      </div>
    ); // Show loading state while fetching

  return (
    <div className="flex min-h-screen">
      {/* Conditional Sidebar Rendering */}
      {userType === "supervisor" ? <SupervisorSidebar /> : <DriverSidebar />}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
