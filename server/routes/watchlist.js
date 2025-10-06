const express = require('express');
const Watchlist = require('../models/Watchlist');
const axios = require('axios');
const mongoose = require('mongoose');
const inMemoryStorage = require('../utils/inMemoryStorage');
const router = express.Router();

const ALPHA_VANTAGE_API_KEY = 'F83JJ8M93FB6GF22';

// Get all watchlist items
router.get('/', async (req, res) => {
  try {
    let watchlistItems;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use in-memory storage
      watchlistItems = inMemoryStorage.getWatchlist();
    } else {
      // Use MongoDB
      watchlistItems = await Watchlist.find({})
        .sort({ addedDate: -1 })
        .lean();
    }

    // Fetch current prices for all watchlist items
    const watchlistWithPrices = await Promise.all(
      watchlistItems.map(async (item) => {
        try {
          const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
              function: 'GLOBAL_QUOTE',
              symbol: item.symbol,
              apikey: ALPHA_VANTAGE_API_KEY
            }
          });

          const quote = response.data['Global Quote'];
          if (quote) {
            const currentPrice = parseFloat(quote['05. price']);
            const isAlertTriggered = currentPrice >= item.targetPrice;
            
            // Update alert status if triggered
            if (isAlertTriggered && !item.isAlertTriggered) {
              if (mongoose.connection.readyState === 1) {
                await Watchlist.findByIdAndUpdate(item._id, {
                  isAlertTriggered: true,
                  lastChecked: new Date()
                });
              } else {
                inMemoryStorage.updateWatchlistItem(item._id, {
                  isAlertTriggered: true,
                  lastChecked: new Date()
                });
              }
            }

            return {
              ...item,
              currentPrice,
              isAlertTriggered: isAlertTriggered || item.isAlertTriggered,
              priceChange: currentPrice - item.targetPrice,
              priceChangePercent: ((currentPrice - item.targetPrice) / item.targetPrice * 100).toFixed(2)
            };
          }
        } catch (error) {
          console.error(`Error fetching price for ${item.symbol}:`, error.message);
        }

        return {
          ...item,
          currentPrice: null,
          priceChange: null,
          priceChangePercent: null
        };
      })
    );

    res.json(watchlistWithPrices);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add stock to watchlist
router.post('/', async (req, res) => {
  try {
    const { symbol, targetPrice } = req.body;

    if (!symbol || !targetPrice) {
      return res.status(400).json({ error: 'Symbol and target price are required' });
    }

    // Verify stock exists by fetching current price
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol.toUpperCase(),
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });

      const quote = response.data['Global Quote'];
      if (!quote) {
        return res.status(400).json({ error: 'Invalid stock symbol' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Failed to verify stock symbol' });
    }

    let watchlistItem;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      // Check if stock already exists in watchlist
      const existingItem = await Watchlist.findOne({ symbol: symbol.toUpperCase() });
      if (existingItem) {
        return res.status(400).json({ error: 'Stock already in watchlist' });
      }

      watchlistItem = new Watchlist({
        symbol: symbol.toUpperCase(),
        targetPrice: parseFloat(targetPrice)
      });

      await watchlistItem.save();
    } else {
      // Use in-memory storage
      try {
        watchlistItem = inMemoryStorage.addToWatchlist({
          symbol: symbol.toUpperCase(),
          targetPrice: parseFloat(targetPrice)
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    res.status(201).json(watchlistItem);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Failed to add stock to watchlist' });
  }
});

// Update target price
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { targetPrice } = req.body;

    if (!targetPrice) {
      return res.status(400).json({ error: 'Target price is required' });
    }

    let updatedItem;
    
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      updatedItem = await Watchlist.findByIdAndUpdate(
        id,
        { 
          targetPrice: parseFloat(targetPrice),
          isAlertTriggered: false // Reset alert status
        },
        { new: true }
      );
    } else {
      // Use in-memory storage
      try {
        updatedItem = inMemoryStorage.updateWatchlistItem(id, {
          targetPrice: parseFloat(targetPrice),
          isAlertTriggered: false
        });
      } catch (error) {
        return res.status(404).json({ error: error.message });
      }
    }

    if (!updatedItem) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating watchlist item:', error);
    res.status(500).json({ error: 'Failed to update watchlist item' });
  }
});

// Remove stock from watchlist
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let deletedItem;
    
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      deletedItem = await Watchlist.findByIdAndDelete(id);
    } else {
      // Use in-memory storage
      try {
        inMemoryStorage.deleteFromWatchlist(id);
        deletedItem = { _id: id }; // Mock deleted item
      } catch (error) {
        return res.status(404).json({ error: error.message });
      }
    }

    if (!deletedItem) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }

    res.json({ message: 'Stock removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove stock from watchlist' });
  }
});

// Reset alert status
router.patch('/:id/reset-alert', async (req, res) => {
  try {
    const { id } = req.params;

    let updatedItem;
    
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      updatedItem = await Watchlist.findByIdAndUpdate(
        id,
        { isAlertTriggered: false },
        { new: true }
      );
    } else {
      // Use in-memory storage
      try {
        updatedItem = inMemoryStorage.updateWatchlistItem(id, {
          isAlertTriggered: false
        });
      } catch (error) {
        return res.status(404).json({ error: error.message });
      }
    }

    if (!updatedItem) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error resetting alert:', error);
    res.status(500).json({ error: 'Failed to reset alert' });
  }
});

module.exports = router;
