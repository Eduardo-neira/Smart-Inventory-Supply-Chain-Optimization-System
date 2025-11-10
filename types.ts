
export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: StockStatus;
  price: number;
}

export interface ForecastPoint {
  month: string;
  forecast: number;
}

export interface ReorderSuggestion {
  sku: string;
  productName: string;
  suggestedQuantity: number;
  reason: string;
}

export enum View {
    DASHBOARD = 'dashboard',
    INVENTORY = 'inventory',
    REPORTS = 'reports',
    SETTINGS = 'settings'
}
