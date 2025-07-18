import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the access token and other stored user data
    localStorage.removeItem("access_token");

    // Redirect to the Home page
    navigate("/");
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging out...</h2>
      <p>You are being redirected to the Home page.</p>
    </div>
  );
};

export default Logout;
