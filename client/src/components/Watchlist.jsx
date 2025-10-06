import React, { useState, useEffect } from 'react';
import { Star, Trash2, Bell, BellOff, TrendingUp, TrendingDown, Edit3 } from 'lucide-react';

const Watchlist = ({ onStockSelect }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist');
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this stock from your watchlist?')) {
      return;
    }

    try {
      const response = await fetch(`/api/watchlist/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWatchlist(watchlist.filter(item => item._id !== id));
      } else {
        alert('Failed to remove stock from watchlist');
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove stock from watchlist');
    }
  };

  const handleEdit = async (id) => {
    if (!editPrice) return;

    try {
      const response = await fetch(`/api/watchlist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetPrice: parseFloat(editPrice)
        })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setWatchlist(watchlist.map(item => 
          item._id === id ? updatedItem : item
        ));
        setEditingId(null);
        setEditPrice('');
      } else {
        alert('Failed to update target price');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert('Failed to update target price');
    }
  };

  const handleResetAlert = async (id) => {
    try {
      const response = await fetch(`/api/watchlist/${id}/reset-alert`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setWatchlist(watchlist.map(item => 
          item._id === id ? updatedItem : item
        ));
      }
    } catch (error) {
      console.error('Error resetting alert:', error);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditPrice(item.targetPrice.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Watchlist
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        Watchlist ({watchlist.length})
      </h3>

      {watchlist.length === 0 ? (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No stocks in watchlist</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Search for stocks and add them to your watchlist to track price alerts
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {watchlist.map((item) => (
            <div
              key={item._id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                item.isAlertTriggered
                  ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => onStockSelect(item.symbol)}
                  className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {item.symbol}
                </button>
                
                <div className="flex items-center gap-1">
                  {item.isAlertTriggered && (
                    <button
                      onClick={() => handleResetAlert(item._id)}
                      className="p-1 text-success-600 hover:text-success-700 dark:text-success-400 dark:hover:text-success-300"
                      title="Reset alert"
                    >
                      <BellOff className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    title="Edit target price"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1 text-gray-400 hover:text-danger-600 dark:text-gray-500 dark:hover:text-danger-400"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {editingId === item._id ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Target price"
                  />
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="px-2 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-2 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Target:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${item.targetPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  {item.currentPrice && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Current:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${item.currentPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Difference:</span>
                        <div className="flex items-center gap-1">
                          {item.priceChange >= 0 ? (
                            <TrendingUp className="h-3 w-3 text-success-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-danger-600" />
                          )}
                          <span className={`font-medium ${
                            item.priceChange >= 0 ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {item.priceChange >= 0 ? '+' : ''}${item.priceChange.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {item.isAlertTriggered && (
                    <div className="flex items-center gap-1 mt-2 p-2 bg-success-100 dark:bg-success-800/30 rounded text-success-800 dark:text-success-200 text-sm">
                      <Bell className="h-4 w-4" />
                      <span>Target price reached!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
