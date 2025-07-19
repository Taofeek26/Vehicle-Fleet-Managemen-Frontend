import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Optionally, clear any user-specific state in your application

    // Redirect to home page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg text-gray-700">Logging out...</p>
    </div>
  );
};

export default Logout;