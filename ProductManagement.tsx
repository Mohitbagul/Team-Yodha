import React, { useState } from 'react';
import { Store, Plus, Trash2, ChevronDown, ChevronUp, X, PlusCircle, MinusCircle, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  discount: number;
}

export interface ItemInput {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
}

interface RemoveItemInput {
  id: string;
  quantity: number;
}

const ProductManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { 
      id: '1', 
      name: 'Sample Product', 
      quantity: 10, 
      expiryDate: '2024-12-31',
      discount: 5 
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddFormMinimized, setIsAddFormMinimized] = useState(false);
  const [isRemoveFormMinimized, setIsRemoveFormMinimized] = useState(false);
  const [newItems, setNewItems] = useState<ItemInput[]>([
    { id: '', name: '', quantity: 0, expiryDate: '' }
  ]);
  const [removeItems, setRemoveItems] = useState<RemoveItemInput[]>([
    { id: '', quantity: 0 }
  ]);

    // Add this after state declarations
    const filteredInventory = inventory.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Update the handleAddItem function to include expiryDate
    const handleAddItem = (e: React.FormEvent) => {
      e.preventDefault();
      const updatedInventory = [...inventory];
  
      newItems.forEach(newItem => {
        const existingItemIndex = updatedInventory.findIndex(item => item.id === newItem.id);
  
        if (existingItemIndex !== -1) {
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + newItem.quantity,
          };
        } else {
          const predictedDiscount = Math.floor(Math.random() * 20);
          updatedInventory.push({
            ...newItem,
            discount: predictedDiscount,
          });
        }
      });
  
      setInventory(updatedInventory);
      setIsAddModalOpen(false);
      setNewItems([{ id: '', name: '', quantity: 0, expiryDate: '' }]);
    };

  const handleRemoveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedInventory = [...inventory];

    removeItems.forEach(removeItem => {
      const existingItemIndex = updatedInventory.findIndex(item => item.id === removeItem.id);

      if (existingItemIndex !== -1) {
        const newQuantity = updatedInventory[existingItemIndex].quantity - removeItem.quantity;
        if (newQuantity <= 0) {
          updatedInventory.splice(existingItemIndex, 1);
        } else {
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: newQuantity,
          };
        }
      }
    });

    setInventory(updatedInventory);
    setIsRemoveModalOpen(false);
    setRemoveItems([{ id: '', quantity: 0 }]);
  };

  const addNewItemField = () => {
    setNewItems([...newItems, { id: '', name: '', quantity: 0 }]);
  };

  const removeNewItemField = (index: number) => {
    if (newItems.length > 1) {
      const updatedItems = newItems.filter((_, i) => i !== index);
      setNewItems(updatedItems);
    }
  };

  const addRemoveItemField = () => {
    setRemoveItems([...removeItems, { id: '', quantity: 0 }]);
  };

  const removeRemoveItemField = (index: number) => {
    if (removeItems.length > 1) {
      const updatedItems = removeItems.filter((_, i) => i !== index);
      setRemoveItems(updatedItems);
    }
  };

  const updateNewItem = (index: number, field: keyof ItemInput, value: string | number) => {
    const updatedItems = newItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setNewItems(updatedItems);
  };

  const updateRemoveItem = (index: number, field: keyof RemoveItemInput, value: string | number) => {
    const updatedItems = removeItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setRemoveItems(updatedItems);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

     
  <main className="flex-grow container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-8">
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search by product ID or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Items
        </button>
        <button
          onClick={() => setIsRemoveModalOpen(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <Trash2 className="h-5 w-5 mr-1" />
          Remove Items
        </button>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Current Inventory</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI-Suggested Discount (%)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.expiryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.discount}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </main>

      <Footer />

      {/* Add Items Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 transition-all duration-300 transform ${
            isAddFormMinimized ? 'translate-y-[calc(100vh-80px)]' : ''
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Multiple Items</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAddFormMinimized(!isAddFormMinimized)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {isAddFormMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className={`transition-all duration-300 ${isAddFormMinimized ? 'hidden' : ''}`}>
              <form onSubmit={handleAddItem} className="p-6">
                <div className="space-y-6">
                {newItems.map((item, index) => (
  <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Item ID</label>
        <input
          type="text"
          value={item.id}
          onChange={(e) => updateNewItem(index, 'id', e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => updateNewItem(index, 'name', e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateNewItem(index, 'quantity', parseInt(e.target.value))}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          min="1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
        <input
          type="date"
          value={item.expiryDate}
          onChange={(e) => updateNewItem(index, 'expiryDate', e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
    </div>
    {newItems.length > 1 && (
      <button
        type="button"
        onClick={() => removeNewItemField(index)}
        className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 transition"
      >
        <MinusCircle className="h-6 w-6" />
      </button>
    )}
  </div>
))}
                </div>
                <div className="mt-6 space-y-4">
                  <button
                    type="button"
                    onClick={addNewItemField}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Another Item
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
                  >
                    Add All Items
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Remove Items Modal */}
      {isRemoveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 transition-all duration-300 transform ${
            isRemoveFormMinimized ? 'translate-y-[calc(100vh-80px)]' : ''
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Remove Multiple Items</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRemoveFormMinimized(!isRemoveFormMinimized)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {isRemoveFormMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className={`transition-all duration-300 ${isRemoveFormMinimized ? 'hidden' : ''}`}>
              <form onSubmit={handleRemoveItem} className="p-6">
                <div className="space-y-6">
                  {removeItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Item ID</label>
                          <input
                            type="text"
                            value={item.id}
                            onChange={(e) => updateRemoveItem(index, 'id', e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Remove</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateRemoveItem(index, 'quantity', parseInt(e.target.value))}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            min="1"
                          />
                        </div>
                      </div>
                      {removeItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRemoveItemField(index)}
                          className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 transition"
                        >
                          <MinusCircle className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <button
                    type="button"
                    onClick={addRemoveItemField}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Another Item
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform hover:scale-105"
                  >
                    Remove All Items
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;