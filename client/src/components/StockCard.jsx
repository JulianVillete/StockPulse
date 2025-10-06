import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Minus, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import API_BASE_URL from '../config/api';

const StockCard = ({ stockData, onAddToWatchlist }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;

  const handleAddToWatchlist = async (e) => {
    e.preventDefault();
    if (!targetPrice || addingToWatchlist) return;

    setAddingToWatchlist(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: stockData.symbol,
          targetPrice: parseFloat(targetPrice)
        })
      });

      if (response.ok) {
        setShowAddForm(false);
        setTargetPrice('');
        onAddToWatchlist();
        // Show success message (you could add a toast notification here)
        alert('Stock added to watchlist successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add stock to watchlist');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      alert('Failed to add stock to watchlist');
    } finally {
      setAddingToWatchlist(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Stock Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stockData.symbol}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stockData.latestTradingDay}
            </span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${stockData.price.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {React.createElement(changeIcon, { className: `h-5 w-5 ${changeColor}` })}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Change</p>
                <p className={`text-lg font-semibold ${changeColor}`}>
                  {isPositive ? '+' : ''}{stockData.change.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Change %</p>
                <p className={`text-lg font-semibold ${changeColor}`}>
                  {stockData.changePercent}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stockData.volume.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Watchlist Button */}
        <div className="flex flex-col gap-2">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add to Watchlist
            </button>
          ) : (
            <form onSubmit={handleAddToWatchlist} className="flex flex-col gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Target price"
                className="input-field"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addingToWatchlist}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {addingToWatchlist ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setTargetPrice('');
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Additional Stock Details */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Open</p>
            <p className="font-medium text-gray-900 dark:text-white">
              ${stockData.open.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">High</p>
            <p className="font-medium text-gray-900 dark:text-white">
              ${stockData.high.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Low</p>
            <p className="font-medium text-gray-900 dark:text-white">
              ${stockData.low.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Previous Close</p>
            <p className="font-medium text-gray-900 dark:text-white">
              ${stockData.previousClose.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
