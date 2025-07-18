import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Authentication APIs
export const login = (data) => API.post("login/", data);

// Supervisor APIs
export const createDriver = (data, token) =>
  API.post("drivers/", data, { headers: { Authorization: `Bearer ${token}` } });

export const listDrivers = (token) =>
  API.get("drivers/", { headers: { Authorization: `Bearer ${token}` } });

// Driver APIs
export const logTrip = (data, token) =>
  API.post("driver-trips/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
