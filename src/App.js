import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Drivers from "./pages/Driver";
import AddVehicles from "./pages/AddVehicle";
import Vehicles from "./pages/VehicleList";
import EditVehicle from "./pages/EditVehicle";
import Home from "./pages/Home";
import SupervisorRegister from "./pages/SupervisorRegister";
import Driver from "./pages/Driver";
import Supervisor from "./pages/Supervisor";
import DriverLogin from "./pages/DriverLogin";
import DriverRegister from "./pages/DriverRegister";
import SupervisorLogin from "./pages/SupervisorLogin";
import Logout from "./pages/Logout"; // Import the Logout component
import SupervisorDashboard from "./pages/SupervisorDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import DriverList from "./pages/DriverList";
import EditDriver from "./pages/EditDriver";
import EndTrip from "./pages/EndTrip";
import StartTrip from "./pages/StartTrip";
import DriverTrips from "./pages/DriverTrip";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login/Home Page */}
        <Route path="/" element={<Home />} />

        {/* Supervisor Register/Login Page */}
        <Route path="/supervisor" element={<Supervisor />} />
        <Route path="/register-supervisor" element={<SupervisorRegister />} />
        <Route path="/supervisor-login" element={<SupervisorLogin />} />

        {/* Driver Login/Register Page */}
        <Route path="/driver" element={<Driver />} />
        <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/driver-register" element={<DriverRegister />} />

        {/* Logout Page */}
        <Route path="/logout" element={<Logout />} />

        {/* Edit Driver */}
        <Route path="/edit-driver/:id" element={<EditDriver />} />

        {/* Dashboard Layout with Nested Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="drivers" element={<DriverList />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="add-vehicle" element={<AddVehicles />} />
          <Route path="edit-vehicle/:id" element={<EditVehicle />} />
          <Route path="driver-dasboard" element={<DriverDashboard />} />
          <Route path="driver-trips" element={<DriverTrips />} />
          <Route path="start-trip" element={<StartTrip />} />
          <Route path="end-trip/:id" element={<EndTrip />} />
          <Route path="map" element={<MapPage />} />
        </Route>

        {/* Fallback Route for 404 */}
        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                flexDirection: "column",
              }}
            >
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
