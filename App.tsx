import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PricePredictor from './pages/PricePredictor';
import ProductManagement from './pages/ProductManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/price-predictor" element={<PricePredictor />} />
        <Route path="/productmanagement" element={<ProductManagement />} />
      </Routes>
    </Router>
  );
}

export default App;