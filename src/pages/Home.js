import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Users, Bell, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center flex-1">
    <div className="flex justify-center mb-3">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">FleetFlow: Smart Fleet Management</h1>
          <p className="text-md mb-4">Streamline your vehicle and driver management with real-time tracking and automated approvals.</p>
          <Link to="/register" className="bg-white text-blue-600 font-semibold py-2 px-5 rounded-lg shadow-lg hover:bg-gray-100 transition">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex-1 flex items-center py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Key Features</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <FeatureCard
              icon={<Map size={40} className="text-blue-600" />}
              title="Live Vehicle Tracking"
              description="Monitor your fleet in real-time with an interactive map."
            />
            <FeatureCard
              icon={<Users size={40} className="text-blue-600" />}
              title="User & Vehicle Management"
              description="Easily manage drivers, staff, and vehicles with detailed profiles."
            />
            <FeatureCard
              icon={<ShieldCheck size={40} className="text-blue-600" />}
              title="Automated Approvals"
              description="A streamlined, multi-level approval workflow for trip requests."
            />
            <FeatureCard
              icon={<Bell size={40} className="text-blue-600" />}
              title="Instant Notifications"
              description="Keep everyone in the loop with real-time notifications."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Ready to Optimize Your Fleet?</h2>
          <p className="text-md text-gray-700 dark:text-gray-300 mb-6">Join us to enhance efficiency and gain full control over your operations.</p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:bg-blue-700 transition">
              Login
            </Link>
            <Link to="/register" className="bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:bg-gray-800 transition">
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
