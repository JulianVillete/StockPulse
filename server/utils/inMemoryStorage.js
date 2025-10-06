// In-memory storage for watchlist when MongoDB is not available
let inMemoryWatchlist = [];

const getWatchlist = () => {
  return inMemoryWatchlist;
};

const addToWatchlist = (item) => {
  // Check if item already exists
  const exists = inMemoryWatchlist.find(w => w.symbol === item.symbol);
  if (exists) {
    throw new Error('Stock already in watchlist');
  }
  
  const newItem = {
    _id: Date.now().toString(), // Simple ID generation
    ...item,
    addedDate: new Date(),
    isAlertTriggered: false,
    lastChecked: new Date()
  };
  
  inMemoryWatchlist.push(newItem);
  return newItem;
};

const updateWatchlistItem = (id, updates) => {
  const index = inMemoryWatchlist.findIndex(item => item._id === id);
  if (index === -1) {
    throw new Error('Watchlist item not found');
  }
  
  inMemoryWatchlist[index] = {
    ...inMemoryWatchlist[index],
    ...updates
  };
  
  return inMemoryWatchlist[index];
};

const deleteFromWatchlist = (id) => {
  const index = inMemoryWatchlist.findIndex(item => item._id === id);
  if (index === -1) {
    throw new Error('Watchlist item not found');
  }
  
  inMemoryWatchlist.splice(index, 1);
  return true;
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  deleteFromWatchlist
};
