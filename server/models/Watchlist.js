const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  targetPrice: {
    type: Number,
    required: true,
    min: 0
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  isAlertTriggered: {
    type: Boolean,
    default: false
  },
  lastChecked: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
watchlistSchema.index({ symbol: 1 });
watchlistSchema.index({ addedDate: -1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);
