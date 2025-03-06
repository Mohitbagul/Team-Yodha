import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store, Home, BarChart2, Calculator } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ShopManager</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition ${
                currentPath === '/' ? 'text-indigo-600' : ''
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition ${
                currentPath === '/dashboard' ? 'text-indigo-600' : ''
              }`}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/price-predictor"
              className={`flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition ${
                currentPath === '/price-predictor' ? 'text-indigo-600' : ''
              }`}
            >
              <Calculator className="h-5 w-5" />
              <span>Price Predictor</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;