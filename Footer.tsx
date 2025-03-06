import React from 'react';
import { Store, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-semibold">ShopManager</span>
            </div>
            <p className="text-gray-400">
              Streamline your inventory management with our powerful and intuitive system.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>support@shopmanager.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-indigo-400 transition">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-indigo-400 transition">Dashboard</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopManager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;