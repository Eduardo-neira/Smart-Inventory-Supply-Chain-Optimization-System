
import type { Product, ForecastPoint, ReorderSuggestion } from '../types';

const AI_OPERATIONS_ENDPOINT = import.meta.env.VITE_AI_OPERATIONS_ENDPOINT;

async function requestAiOperation<T>(operation: string, payload: unknown): Promise<T> {
  if (!AI_OPERATIONS_ENDPOINT) {
    throw new Error('La IA no está configurada para este entorno. Primero conecta el endpoint protegido.');
  }

  const response = await fetch(AI_OPERATIONS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation, payload }),
  });
  if (!response.ok) throw new Error(`No se pudo completar el análisis (${response.status}).`);
  return response.json() as Promise<T>;
}

/**
 * Generates a 6-month demand forecast for a specific product.
 * @param productName The name of the product to forecast.
 * @returns A promise that resolves to an array of forecast data points.
 */
export const getDemandForecast = async (productName: string): Promise<ForecastPoint[]> => {
  const response = await requestAiOperation<{ forecast: ForecastPoint[] }>('inventory_forecast', { productName });
  return response.forecast;
};

/**
 * Generates reorder suggestions for low-stock or out-of-stock items.
 * @param inventory The current list of all products.
 * @returns A promise that resolves to an array of reorder suggestions.
 */
export const getReorderSuggestions = async (inventory: Product[]): Promise<ReorderSuggestion[]> => {
  const lowStockItems = inventory.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');
  if (lowStockItems.length === 0) {
    return [];
  }

  const response = await requestAiOperation<{ suggestions: ReorderSuggestion[] }>('inventory_reorder', { inventory: lowStockItems });
  return response.suggestions;
};
