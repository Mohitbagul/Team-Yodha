import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface SalesData {
  product_id: string;
  product_name: string;
  category: string;
  brand: string;
  price: string;
  mrp: string;
  date: string;
  actual_discount_price: string;
  margin: string;
  discount_percentage: string;
}

interface InventoryData {
  product_id: string;
  product_name: string;
  category: string;
  brand: string;
  price: string;
  mrp: string;
  expiry_date: string;
  stock_available: string;
}

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [previousMonth, setPreviousMonth] = useState('');
  const [lowStockItems, setLowStockItems] = useState<InventoryData[]>([]);
  const [expiringSoon, setExpiringSoon] = useState<InventoryData[]>([]);
  const [salesTrend, setSalesTrend] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  const [categorySales, setCategorySales] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  const [topSelling, setTopSelling] = useState<[string, number][]>([]);
  const [leastSelling, setLeastSelling] = useState<[string, number][]>([]);

  const parseCsvToJson = async (filePath: string) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
      
      const text = await response.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj: any, header, index) => {
          obj[header] = values[index]?.trim();
          return obj;
        }, {});
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return [];
    }
  };

  const fetchSalesData = async () => {
    try {
      const sales = await parseCsvToJson('/src/data/sales_data.csv');
      console.log('Fetched sales data:', sales);

      // Calculate previous month's date range
      const today = new Date();
      const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      // Set previous month name and year
      setPreviousMonth(previousMonthDate.toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
      }));

      // Filter sales for previous month only
      const previousMonthSales = sales.filter((sale: SalesData) => {
        const saleDate = new Date(sale.date);
        return saleDate >= previousMonthDate && saleDate <= previousMonthEnd;
      });

      // Calculate total revenue for previous month
      const totalRevenue = previousMonthSales.reduce((acc, sale: SalesData) => 
        acc + parseFloat(sale.actual_discount_price), 0);
      setRevenue(totalRevenue);

      // Process category-wise sales for previous month
      const categoryData = previousMonthSales.reduce((acc: {[key: string]: number}, sale: SalesData) => {
        const category = sale.category;
        const price = parseFloat(sale.actual_discount_price);
        acc[category] = (acc[category] || 0) + price;
        return acc;
      }, {});

      setCategorySales({
        labels: Object.keys(categoryData),
        data: Object.values(categoryData),
      });

      // Process daily sales trend for previous month
      const dailySales = previousMonthSales.reduce((acc: {[key: string]: number}, sale: SalesData) => {
        const date = new Date(sale.date).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + parseFloat(sale.actual_discount_price);
        return acc;
      }, {});

      const sortedDates = Object.keys(dailySales).sort();
      setSalesTrend({
        labels: sortedDates,
        data: sortedDates.map(date => dailySales[date]),
      });

      // Process product sales for previous month
      const productSales = previousMonthSales.reduce((acc: {[key: string]: number}, sale: SalesData) => {
        const product = sale.product_name;
        acc[product] = (acc[product] || 0) + parseFloat(sale.actual_discount_price);
        return acc;
      }, {});

      const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1]);
      
      setTopSelling(sortedProducts.slice(0, 5));
      setLeastSelling(sortedProducts.slice(-5).reverse());

    } catch (error) {
      console.error('Error processing sales data:', error);
    }
  };

  const fetchInventoryData = async () => {
    try {
      const inventory = await parseCsvToJson('/src/data/static_data.csv');
      console.log('Fetched inventory data:', inventory);

      // Process current low stock items (less than 100 units)
      const lowStock = inventory
        .filter((item: InventoryData) => parseInt(item.stock_available) < 100)
        .sort((a, b) => parseInt(a.stock_available) - parseInt(b.stock_available));
      setLowStockItems(lowStock);

      // Process items expiring within next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiring = inventory
        .filter((item: InventoryData) => {
          const expiryDate = new Date(item.expiry_date);
          return expiryDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
      setExpiringSoon(expiring);

    } catch (error) {
      console.error('Error processing inventory data:', error);
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchInventoryData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toFixed(2)}`;
          }
        }
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Previous Month Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${revenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">{previousMonth}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Current Low Stock Items</h3>
            <p className="text-3xl font-bold text-orange-600">{lowStockItems.length}</p>
            <div className="mt-2 text-sm text-gray-500">
              {lowStockItems.slice(0, 3).map(item => (
                <div key={item.product_id} className="flex justify-between">
                  <span>{item.product_name}</span>
                  <span className="font-semibold text-orange-600">
                    {item.stock_available} units
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              As of {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Expiring Soon</h3>
            <p className="text-3xl font-bold text-red-600">{expiringSoon.length}</p>
            <div className="mt-2 text-sm text-gray-500">
              {expiringSoon.slice(0, 3).map(item => (
                <div key={item.product_id} className="flex justify-between">
                  <span>{item.product_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Sales Trend ({previousMonth})
            </h3>
            <div className="h-[300px]">
              <Line
                data={{
                  labels: salesTrend.labels,
                  datasets: [{
                    label: 'Daily Sales ($)',
                    data: salesTrend.data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Category-wise Sales ({previousMonth})
            </h3>
            <div className="h-[300px]">
              <Pie
                data={{
                  labels: categorySales.labels,
                  datasets: [{
                    data: categorySales.data,
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF',
                      '#FF9F40'
                    ]
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Charts - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Top 5 Selling Items ({previousMonth})
            </h3>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: topSelling.map(item => item[0]),
                  datasets: [{
                    label: 'Sales Amount ($)',
                    data: topSelling.map(item => item[1]),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Least 5 Selling Items ({previousMonth})
            </h3>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: leastSelling.map(item => item[0]),
                  datasets: [{
                    label: 'Sales Amount ($)',
                    data: leastSelling.map(item => item[1]),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)'
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;