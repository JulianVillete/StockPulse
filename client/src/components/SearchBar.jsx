import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const SearchBar = ({ onSearch, loading }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim() && !loading) {
      onSearch(symbol.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter stock symbol (e.g., AAPL, GOOGL, MSFT)"
            className="input-field pl-10"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={!symbol.trim() || loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search
            </>
          )}
        </button>
      </form>
      
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <p>Try popular symbols: AAPL, GOOGL, MSFT, TSLA, AMZN, META</p>
      </div>
    </div>
  );
};

export default SearchBar;
