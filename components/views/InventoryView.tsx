
import React, { useState, useCallback } from 'react';
import type { Product, ForecastPoint } from '../../types';
import { getDemandForecast } from '../../services/geminiService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const StockStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
  let colorClasses = "";
  switch (status) {
    case 'In Stock':
      colorClasses = 'bg-green-500/20 text-green-300';
      break;
    case 'Low Stock':
      colorClasses = 'bg-yellow-500/20 text-yellow-300';
      break;
    case 'Out of Stock':
      colorClasses = 'bg-red-500/20 text-red-300';
      break;
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


interface InventoryViewProps {
  inventory: Product[];
  setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, setInventory }) => {
  const [forecastData, setForecastData] = useState<ForecastPoint[] | null>(null);
  const [forecastingProduct, setForecastingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForecast = useCallback(async (product: Product) => {
    // If the same product's forecast button is clicked again, hide the chart.
    if (forecastingProduct?.sku === product.sku) {
      setForecastingProduct(null);
      setForecastData(null);
      return;
    }
    setForecastingProduct(product);
    setIsLoading(true);
    setError(null);
    setForecastData(null);

    try {
      const data = await getDemandForecast(product.name);
      setForecastData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setForecastingProduct(null); // Clear forecasting product on error
    } finally {
      setIsLoading(false);
    }
  }, [forecastingProduct]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Inventory Management</h2>

      {forecastingProduct && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-4">
            Demand Forecast: <span className="text-blue-400">{forecastingProduct.name}</span>
          </h3>
          {isLoading && <div className="text-center p-8 text-gray-400">Generating 6-month demand forecast...</div>}
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
          {forecastData && (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                  <XAxis dataKey="month" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }}/>
                  <Legend />
                  <Line type="monotone" dataKey="forecast" name="Forecasted Units" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                {['SKU', 'Product Name', 'Category', 'Quantity', 'Location', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {inventory.map((product) => {
                const isThisProductForecasting = forecastingProduct?.sku === product.sku;
                const isThisProductLoading = isLoading && isThisProductForecasting;
                
                const buttonText = isThisProductLoading ? 'Loading...' : isThisProductForecasting ? 'Hide' : 'Forecast';

                return (
                  <tr key={product.sku} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StockStatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleForecast(product)}
                        disabled={isLoading && !isThisProductForecasting}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          isThisProductForecasting && !isLoading
                            ? 'bg-gray-600 hover:bg-gray-500' 
                            : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600/50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {buttonText}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
