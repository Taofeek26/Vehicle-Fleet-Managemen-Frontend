import React, { useState, useEffect } from "react";
import { createDriver, listDrivers } from "../api";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchDrivers = async () => {
    const token = localStorage.getItem("access_token");
    const response = await listDrivers(token);
    setDrivers(response.data);
  };

  const handleCreateDriver = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await createDriver({ username, password }, token);
      fetchDrivers();
      alert("Driver created successfully");
    } catch (error) {
      alert("Failed to create driver");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div>
      <h2>Driver Management</h2>
      <input
        placeholder="Driver Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleCreateDriver}>Create Driver</button>

      <ul>
        {drivers.map((driver) => (
          <li key={driver.id}>{driver.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default DriverManagement;
