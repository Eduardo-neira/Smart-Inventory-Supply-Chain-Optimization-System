
import React, { useState, useCallback } from 'react';
import type { ReorderSuggestion, Product } from '../../types';
import { getReorderSuggestions } from '../../services/geminiService';
import { CashIcon, CubeIcon, ExclamationIcon, ArchiveIcon } from '../icons/Icons';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, colorClass }) => (
  <div className="bg-gray-800 rounded-lg p-5 shadow-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);


interface SuggestionCardProps {
    suggestion: ReorderSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-white">{suggestion.productName}</p>
                <p className="text-xs text-gray-400">SKU: {suggestion.sku}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-blue-400">{suggestion.suggestedQuantity}</p>
                <p className="text-xs text-gray-400">Units to Reorder</p>
            </div>
        </div>
        <p className="mt-3 text-sm text-gray-300">{suggestion.reason}</p>
    </div>
);


interface DashboardViewProps {
  kpis: {
    totalValue: number;
    lowStock: number;
    outOfStock: number;
    totalSKUs: number;
  };
  inventory: Product[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ kpis, inventory }) => {
  const [suggestions, setSuggestions] = useState<ReorderSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getReorderSuggestions(inventory);
      setSuggestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inventory]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Inventory Value" 
          value={`$${kpis.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<CashIcon className="w-6 h-6 text-white"/>}
          colorClass="bg-green-500"
        />
        <DashboardCard 
          title="Total SKUs" 
          value={kpis.totalSKUs}
          icon={<CubeIcon className="w-6 h-6 text-white"/>}
          colorClass="bg-blue-500"
        />
        <DashboardCard 
          title="SKUs Low on Stock" 
          value={kpis.lowStock}
          icon={<ExclamationIcon className="w-6 h-6 text-white"/>}
          colorClass="bg-yellow-500"
        />
        <DashboardCard 
          title="SKUs Out of Stock" 
          value={kpis.outOfStock}
          icon={<ArchiveIcon className="w-6 h-6 text-white"/>}
          colorClass="bg-red-500"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <h3 className="text-xl font-bold text-white mb-2 md:mb-0">AI-Powered Reorder Suggestions</h3>
          <button
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Analyzing...' : 'Analyze & Suggest Reorders'}
          </button>
        </div>

        {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
        
        {isLoading && (
            <div className="text-center p-8 text-gray-400">
                Our AI is analyzing your inventory levels to find optimization opportunities. Please wait...
            </div>
        )}

        {!isLoading && suggestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {suggestions.map(s => <SuggestionCard key={s.sku} suggestion={s}/>)}
          </div>
        )}

        {!isLoading && suggestions.length === 0 && !error && (
          <div className="text-center p-8 text-gray-400">
            Click "Analyze &amp; Suggest Reorders" to get AI-powered insights for items that are low on stock or out of stock.
          </div>
        )}

      </div>
    </div>
  );
};
