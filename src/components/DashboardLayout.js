import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { getCurrentUser, getNotifications, markNotificationAsRead } from "../api";
import { Bell, Car, Users, LogOut, FilePlus, List, Map, Home as HomeIcon, Menu } from 'lucide-react';

const Sidebar = ({ role, fullName, isSidebarOpen }) => {
  const commonLinks = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/dashboard/vehicles", label: "Vehicles", icon: Car },
    { path: "/dashboard/map", label: "Live Map", icon: Map },
    { path: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { path: "/logout", label: "Logout", icon: LogOut },
  ];

  const roleLinks = {
    manager: [
      { path: "/dashboard/users", label: "Manage Users", icon: Users },
      { path: "/dashboard/trip-requests", label: "All Trip Requests", icon: List },
    ],
    supervisor: [
      { path: "/dashboard/trip-requests", label: "Approve Requests", icon: List },
    ],
    staff: [
      { path: "/dashboard/create-trip-request", label: "Create Request", icon: FilePlus },
      { path: "/dashboard/trip-requests", label: "My Requests", icon: List },
    ],
    driver: [{ path: "/dashboard/trip-requests", label: "My Trips", icon: List }],
  };

  const links = [...(roleLinks[role] || []), ...commonLinks];

  return (
    <div className={`h-screen bg-gray-800 text-white flex flex-col shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-center">
        {isSidebarOpen ? (
          <h2 className="text-2xl font-bold">FleetFlow</h2>
        ) : (
          <HomeIcon className="h-8 w-8" />
        )}
      </div>
      {isSidebarOpen && fullName && <p className="text-sm text-gray-400 text-center mt-2">Welcome, {fullName} ({role})</p>}
      <nav className="flex-1 p-4">
        <ul>
          {links.map((link) => (
            <li key={link.path} className="mb-2">
              <Link
                to={link.path}
                className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-200"
              >
                <link.icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {isSidebarOpen && link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const Header = ({ notifications, onMarkNotificationAsRead, toggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Bell className="h-6 w-6 text-gray-600" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {unreadNotifications.length}
            </span>
          )}
        </button>
        
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4 z-10 border border-gray-200">
            <h3 className="font-bold mb-2 text-gray-800">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No notifications.</p>
            ) : (
              <ul>
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`border-b border-gray-200 py-2 last:border-b-0 ${notification.is_read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}
                  >
                    {notification.message}
                    {!notification.is_read && (
                      <button 
                        onClick={() => onMarkNotificationAsRead(notification.id)}
                        className="ml-2 text-blue-500 hover:text-blue-700 text-xs"
                      >
                        Mark as Read
                      </button>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // New state for sidebar
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchUserDataAndNotifications = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const userResponse = await getCurrentUser();
      setUser(userResponse.data);

      const notificationsResponse = await getNotifications();
      setNotifications(notificationsResponse.data);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/login");
      } else {
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserDataAndNotifications();
    const notificationInterval = setInterval(fetchUserDataAndNotifications, 30000); 
    return () => clearInterval(notificationInterval);
  }, [fetchUserDataAndNotifications]);

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden"> {/* Add overflow-x-hidden here */}
      <Sidebar role={user.role} fullName={user.full_name} isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header 
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;