import axios from "axios";

//const API = axios.create({
  //baseURL: "http://127.0.0.1:8000/api/",
//});
const API = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/",
    });
// Interceptor to include token from localStorage on every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const login = (data) => API.post("login/", data);
export const register = (data) => API.post("users/register/", data);
export const getCurrentUser = () => API.get("user-details/");

// User Management APIs
export const getUsers = () => API.get("users/");
export const getUserDetail = (id) => API.get(`users/${id}/`);
export const updateUser = (id, data) => {
  const isFormData = data instanceof FormData;
  return API.post(`users/${id}/update/`, data, {
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
    },
  });
};
export const deleteUser = (id) => API.delete(`users/${id}/`);

// Vehicle Management APIs
export const getVehicles = () => API.get("vehicles/");
export const createVehicle = (data) => API.post("vehicles/", data);
export const getVehicleDetail = (id) => API.get(`vehicles/${id}/`);
export const updateVehicle = (id, data) => API.put(`vehicles/${id}/`, data);
export const deleteVehicle = (id) => API.delete(`vehicles/${id}/`);
export const getAvailableVehicles = () => API.get("vehicles/available/");
export const updateVehicleLocation = (id, data) =>
  API.post(`vehicles/${id}/update-location/`, data);

// Trip Request Management APIs
export const getTripRequests = () => API.get("trip-requests/");
export const createTripRequest = (data) => API.post("trip-requests/", data);
export const getTripRequestDetail = (id) => API.get(`trip-requests/${id}/`);
export const updateTripRequest = (id, data) =>
  API.put(`trip-requests/${id}/`, data);
export const deleteTripRequest = (id) =>
  API.delete(`trip-requests/${id}/`);
export const approveTripRequestSupervisor = (id) =>
  API.post(`trip-requests/${id}/approve/supervisor/`);
export const approveTripRequestManager = (id) =>
  API.post(`trip-requests/${id}/approve/manager/`);
export const rejectTripRequest = (id) =>
  API.post(`trip-requests/${id}/reject/`);
export const endTrip = (id, data) => API.post(`trip-requests/${id}/end-trip/`, data); // New API call

// Notification APIs
export const getNotifications = () => API.get("notifications/");
export const markNotificationAsRead = (id) =>
  API.patch(`notifications/${id}/read/`, { is_read: true });

export default API;
