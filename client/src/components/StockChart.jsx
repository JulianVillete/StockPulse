import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ data }) => {
  const [showPrediction, setShowPrediction] = React.useState(false);

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No chart data available</p>
      </div>
    );
  }

  // Simple linear regression for price prediction
  const calculatePrediction = (prices) => {
    const n = prices.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = prices;

    // Calculate slope and intercept
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next 5 days
    const predictions = [];
    for (let i = 0; i < 5; i++) {
      const nextDay = n + i;
      const predictedPrice = slope * nextDay + intercept;
      predictions.push(predictedPrice);
    }

    return { slope, intercept, predictions };
  };

  const prices = data.data.map(item => item.close);
  const prediction = calculatePrediction(prices);
  
  // Generate labels including prediction dates
  const historicalLabels = data.data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const predictionLabels = [];
  if (showPrediction) {
    for (let i = 1; i <= 5; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      predictionLabels.push(futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
  }

  const allLabels = showPrediction ? [...historicalLabels, ...predictionLabels] : historicalLabels;
  const historicalData = data.data.map(item => item.close);
  const predictionData = showPrediction ? prediction.predictions : [];
  const allData = showPrediction ? [...historicalData, ...predictionData] : historicalData;

  const chartData = {
    labels: allLabels,
    datasets: [
      {
        label: 'Closing Price',
        data: allData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...(showPrediction ? [{
        label: 'AI Prediction',
        data: [...Array(historicalData.length).fill(null), ...prediction.predictions],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            const originalDate = data.data[dataIndex].date;
            return new Date(originalDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          },
          label: function(context) {
            const dataIndex = context.dataIndex;
            const item = data.data[dataIndex];
            return [
              `Open: $${item.open.toFixed(2)}`,
              `High: $${item.high.toFixed(2)}`,
              `Low: $${item.low.toFixed(2)}`,
              `Close: $${item.close.toFixed(2)}`,
              `Volume: ${item.volume.toLocaleString()}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  // Calculate some basic statistics
  const stockPrices = data.data.map(item => item.close);
  const minPrice = Math.min(...stockPrices);
  const maxPrice = Math.max(...stockPrices);
  const avgPrice = stockPrices.reduce((a, b) => a + b, 0) / stockPrices.length;
  const latestPrice = stockPrices[stockPrices.length - 1];
  const firstPrice = stockPrices[0];
  const totalChange = ((latestPrice - firstPrice) / firstPrice * 100);

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Price Chart
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrediction(!showPrediction)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              showPrediction
                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {showPrediction ? 'Hide AI Prediction' : 'Show AI Prediction'}
          </button>
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Current</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            ${latestPrice.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">30-Day Change</p>
          <p className={`font-semibold ${totalChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">High</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            ${maxPrice.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Low</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            ${minPrice.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Average</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            ${avgPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* AI Prediction Info */}
      {showPrediction && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                AI Price Prediction (Next 5 Days)
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                This prediction is based on simple linear regression analysis of historical data. 
                <strong> This is for educational purposes only and should not be used for actual trading decisions.</strong>
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                {prediction.predictions.map((pred, index) => (
                  <div key={index} className="text-center p-2 bg-red-100 dark:bg-red-800/30 rounded">
                    <p className="text-red-600 dark:text-red-400">Day {index + 1}</p>
                    <p className="font-semibold text-red-800 dark:text-red-200">
                      ${pred.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StockChart;
