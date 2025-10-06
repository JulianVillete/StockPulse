import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';
import StockChart from '../components/StockChart';
import Watchlist from '../components/Watchlist';
import API_BASE_URL from '../config/api';

const Dashboard = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStockSearch = async (symbol) => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stock quote
      const quoteResponse = await fetch(`${API_BASE_URL}/api/stocks/quote/${symbol}`);
      if (!quoteResponse.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const quoteData = await quoteResponse.json();
      
      // Fetch daily chart data
      const chartResponse = await fetch(`${API_BASE_URL}/api/stocks/daily/${symbol}`);
      if (!chartResponse.ok) {
        throw new Error('Failed to fetch chart data');
      }
      const chartData = await chartResponse.json();
      
      setStockData(quoteData);
      setChartData(chartData);
      setSelectedStock(symbol.toUpperCase());
    } catch (err) {
      setError(err.message);
      setStockData(null);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar - Watchlist */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <Watchlist onStockSelect={handleStockSearch} />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search Bar */}
        <div className="card">
          <SearchBar onSearch={handleStockSearch} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert-danger">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Stock Information */}
        {stockData && (
          <StockCard 
            stockData={stockData} 
            onAddToWatchlist={() => window.location.reload()} 
          />
        )}

        {/* Stock Chart */}
        {chartData && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {selectedStock} - Price Chart (Last 30 Days)
            </h2>
            <StockChart data={chartData} />
          </div>
        )}

        {/* Welcome Message */}
        {!stockData && !loading && !error && (
          <div className="card text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to StockPulse
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Search for any stock symbol to get started. Track your favorite stocks and set price alerts.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Real-time Prices</div>
                  <div className="text-gray-600 dark:text-gray-400">Live stock quotes</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Price Charts</div>
                  <div className="text-gray-600 dark:text-gray-400">Historical data</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Price Alerts</div>
                  <div className="text-gray-600 dark:text-gray-400">Never miss a move</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
