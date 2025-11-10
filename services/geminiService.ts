
import { GoogleGenAI, Type } from "@google/genai";
import type { Product, ForecastPoint, ReorderSuggestion } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY is not set. Please ensure the API_KEY environment variable is configured.");
  throw new Error("API_KEY environment variable not set. The application cannot connect to Google Gemini.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a 6-month demand forecast for a specific product.
 * @param productName The name of the product to forecast.
 * @returns A promise that resolves to an array of forecast data points.
 */
export const getDemandForecast = async (productName: string): Promise<ForecastPoint[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using Flash for speed on this focused task.
      contents: `As a supply chain expert for Diageo, create a pragmatic 6-month sales forecast for "${productName}".
      The current month is ${new Date().toLocaleString('default', { month: 'long' })}.
      Factor in typical seasonal demand shifts (e.g., holidays, summer trends) and recent market performance.
      The output must be a clean JSON array of objects, each with an abbreviated "month" (e.g., 'Jul') and a numerical "forecast".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING, description: "Abbreviated month name (e.g., 'Jan', 'Feb')." },
              forecast: { type: Type.INTEGER, description: "Forecasted sales units for the month." },
            },
            required: ["month", "forecast"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ForecastPoint[];
  } catch (error) {
    console.error(`Error fetching demand forecast for ${productName}:`, error);
    // Provide a more user-friendly error message.
    throw new Error(`Failed to generate demand forecast for ${productName}. The AI service may be unavailable or experiencing issues.`);
  }
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

  try {
    const response = await ai.models.generateContent({
      // Using Pro for its stronger reasoning capabilities needed for optimization tasks.
      model: "gemini-2.5-pro",
      contents: `Act as an inventory optimization model for Diageo. For the following low-stock items, calculate the optimal reorder quantity to achieve a 45-day supply buffer, assuming a 14-day replenishment lead time.
      For each item, provide a concise, data-driven justification for the suggested quantity.
      Inventory data: ${JSON.stringify(lowStockItems, null, 2)}
      The response must be a JSON array of objects, each with "sku", "productName", "suggestedQuantity", and "reason".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sku: { type: Type.STRING },
              productName: { type: Type.STRING },
              suggestedQuantity: { type: Type.INTEGER },
              reason: { type: Type.STRING },
            },
            required: ["sku", "productName", "suggestedQuantity", "reason"],
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ReorderSuggestion[];
  } catch (error) {
    console.error("Error fetching reorder suggestions:", error);
    throw new Error("Failed to generate reorder suggestions. The AI service may be unavailable or there might be an issue with the provided inventory data.");
  }
};
