import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AlertCircle } from 'lucide-react';

interface PredictionInput {
  category: string;
  days_to_expiry: number;
  price: number;
  demand_score: number;
  remaining_stock: number;
}

const PricePredictor = () => {
  const [predictionInput, setPredictionInput] = useState<PredictionInput>({
    category: '',
    days_to_expiry: 0,
    price: 0,
    demand_score: 0.5,
    remaining_stock: 0
  });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPredictionInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!predictionInput.category || !predictionInput.days_to_expiry || !predictionInput.price || 
        !predictionInput.demand_score || !predictionInput.remaining_stock) {
      setError('Please fill in all fields!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/predict_discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(predictionInput)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(`${data.discount_percentage}%`);
    } catch (error) {
      console.error('Error:', error);
      setError('Error in fetching discount. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">Product Discount Predictor</h2>
              <p className="mt-2 text-gray-600">Enter product details to get ML-powered discount predictions</p>
            </div>
            
            <form onSubmit={getDiscount} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={predictionInput.category}
                  onChange={handleInputChange}
                  placeholder="Enter product category"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days to Expiry
                </label>
                <input
                  type="number"
                  name="days_to_expiry"
                  value={predictionInput.days_to_expiry}
                  onChange={handleInputChange}
                  placeholder="Enter days left"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={predictionInput.price}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demand Score
                </label>
                <input
                  type="number"
                  name="demand_score"
                  step="0.01"
                  min="0.5"
                  max="1.5"
                  value={predictionInput.demand_score}
                  onChange={handleInputChange}
                  placeholder="Enter demand score (0.5 - 1.5)"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remaining Stock
                </label>
                <input
                  type="number"
                  name="remaining_stock"
                  value={predictionInput.remaining_stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock available"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:scale-105 font-medium"
              >
                Predict Discount
              </button>

              {result && (
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Predicted Discount:</h3>
                  <p className="text-3xl font-bold text-indigo-600">{result}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricePredictor;