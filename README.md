# StockPulse MVP

A clean, responsive web application for real-time stock market data, price charts, and price alerts.

## 🎯 Features

- **Real-time Stock Search**: Search and view current stock prices with Alpha Vantage API
- **Interactive Charts**: Historical price charts using Chart.js (last 30 days)
- **Watchlist Management**: Add/remove stocks from your personal watchlist
- **Price Alerts**: Set target prices and get notified when stocks reach them
- **Responsive Design**: Modern UI with dark/light mode toggle
- **MongoDB Storage**: Persistent watchlist and alert data

## 🧱 Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts
- **Lucide React** - Beautiful icons

### Backend
- **Node.js + Express** - Server framework
- **MongoDB Atlas** - Database (free tier)
- **Alpha Vantage API** - Stock market data
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free) or local MongoDB
- Alpha Vantage API key (provided: `F83JJ8M93FB6GF22`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StockPulse
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create `server/.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/stockpulse
   PORT=5000
   ```

   For MongoDB Atlas, use your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockpulse
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
StockPulse/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StockCard.jsx
│   │   │   ├── StockChart.jsx
│   │   │   └── Watchlist.jsx
│   │   ├── pages/          # Page components
│   │   │   └── Dashboard.jsx
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js Backend
│   ├── routes/             # API routes
│   │   ├── stocks.js       # Stock data endpoints
│   │   └── watchlist.js    # Watchlist CRUD operations
│   ├── models/             # Database models
│   │   └── Watchlist.js    # Watchlist schema
│   ├── app.js              # Server entry point
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Stock Data
- `GET /api/stocks/quote/:symbol` - Get real-time stock quote
- `GET /api/stocks/daily/:symbol` - Get daily historical data
- `GET /api/stocks/intraday/:symbol` - Get intraday data

### Watchlist
- `GET /api/watchlist` - Get all watchlist items
- `POST /api/watchlist` - Add stock to watchlist
- `PUT /api/watchlist/:id` - Update target price
- `DELETE /api/watchlist/:id` - Remove from watchlist
- `PATCH /api/watchlist/:id/reset-alert` - Reset alert status

## 🎨 Features in Detail

### Stock Search
- Search by ticker symbol (e.g., AAPL, GOOGL, MSFT)
- Real-time price data with change indicators
- Detailed stock information (open, high, low, volume)

### Interactive Charts
- 30-day historical price charts
- Hover tooltips with detailed information
- Responsive design for all screen sizes

### Watchlist Management
- Add stocks with target prices
- Edit target prices inline
- Remove stocks from watchlist
- Visual indicators for price alerts

### Price Alerts
- Automatic price monitoring (every 30 seconds)
- Browser notifications when targets are reached
- Alert status reset functionality

### Dark/Light Mode
- Toggle between themes
- Persistent theme preference
- Smooth transitions

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

## 🔧 Configuration

### Alpha Vantage API
The app uses the provided API key: `F83JJ8M93FB6GF22`

### MongoDB
- Free tier: 512 MB storage
- Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database`

## 🎯 Future Enhancements

- [ ] User authentication and personal accounts
- [ ] Email/SMS notifications
- [ ] Advanced charting with technical indicators
- [ ] AI-powered price predictions
- [ ] Portfolio tracking
- [ ] News integration
- [ ] Mobile app

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact this github account

---

**Built with ❤️ using React, Node.js, and Alpha Vantage API**
