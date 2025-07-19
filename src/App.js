import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail"; // New import
import VehicleList from "./pages/VehicleList";
import VehicleDetail from "./pages/VehicleDetail"; // New import
import AddVehicle from "./pages/AddVehicle";
import TripRequestList from "./pages/TripRequestList";
import CreateTripRequest from "./pages/CreateTripRequest";
import TripRequestDetail from "./pages/TripRequestDetail"; // New import
import ManagerApprovalPage from "./pages/ManagerApprovalPage";
import MapPage from "./pages/MapPage";
import NotificationList from "./pages/NotificationList"; // New import
import RecordDetailsPage from "./pages/RecordDetailsPage"; // New import
import DashboardHome from "./pages/DashboardHome"; // New import
import EndTripForm from "./pages/EndTripForm"; // New import
import { ThemeProvider } from "./components/ThemeContext";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              {/* User Management */}
              <Route path="users" element={<UserList />} />
              <Route path="users/:id" element={<UserDetail />} />

              {/* Vehicle Management */}
              <Route path="vehicles" element={<VehicleList />} />
              <Route path="add-vehicle" element={<AddVehicle />} />
              <Route path="vehicles/:id" element={<VehicleDetail />} />

              {/* Trip Requests */}
              <Route path="trip-requests" element={<TripRequestList />} />
              <Route path="create-trip-request" element={<CreateTripRequest />} />
              <Route path="trip-requests/:id" element={<TripRequestDetail />} />
              <Route path="approve-request/:id" element={<ManagerApprovalPage />} />
              <Route path="end-trip/:id" element={<EndTripForm />} />
              
              {/* Notifications */}
              <Route path="notifications" element={<NotificationList />} />

              {/* Map */}
              <Route path="map" element={<MapPage />} />

              {/* Single Record Details Page */}
              <Route path="records/:type/:id" element={<RecordDetailsPage />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;