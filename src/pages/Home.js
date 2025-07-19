import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Users, Bell, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">FleetFlow: Smart Fleet Management</h1>
          <p className="text-xl mb-8">Streamline your vehicle and driver management with real-time tracking, automated approvals, and insightful analytics.</p>
          <Link to="/register" className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Map size={48} className="text-blue-600" />}
              title="Live Vehicle Tracking"
              description="Monitor your fleet in real-time with an interactive map, ensuring visibility and security."
            />
            <FeatureCard
              icon={<Users size={48} className="text-blue-600" />}
              title="User & Vehicle Management"
              description="Easily manage drivers, staff, and vehicles with detailed profiles and assignments."
            />
            <FeatureCard
              icon={<ShieldCheck size={48} className="text-blue-600" />}
              title="Automated Approvals"
              description="A streamlined, multi-level approval workflow for trip requests, from staff to management."
            />
            <FeatureCard
              icon={<Bell size={48} className="text-blue-600" />}
              title="Instant Notifications"
              description="Keep everyone in the loop with real-time notifications for trip status changes and approvals."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Fleet?</h2>
          <p className="text-lg text-gray-700 mb-8">Join us to enhance efficiency, improve safety, and gain full control over your operations.</p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition">
              Login
            </Link>
            <Link to="/register" className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-800 transition">
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
