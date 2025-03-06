import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, RefreshCw, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Inventory Management for Modern Business
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Streamline your inventory operations with our AI-powered system.
              Track stock levels, manage items, and optimize your inventory effortlessly.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <div className="text-indigo-600 mb-4">
                <Package className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Smart Stock Management
              </h3>
              <p className="text-gray-600">
                AI-powered inventory tracking and management for optimal stock levels.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <div className="text-indigo-600 mb-4">
                <RefreshCw className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Bulk Operations
              </h3>
              <p className="text-gray-600">
                Efficiently manage multiple items simultaneously with our intuitive interface.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <div className="text-indigo-600 mb-4">
                <TrendingUp className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ML-Powered Insights
              </h3>
              <p className="text-gray-600">
                Get intelligent discount suggestions based on market trends and inventory data.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;