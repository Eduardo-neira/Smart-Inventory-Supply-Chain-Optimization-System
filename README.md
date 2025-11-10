
# Diageo Smart Inventory & Supply Chain Optimization System

This is an intelligent dashboard for Diageo to monitor inventory, forecast demand, and receive AI-powered supply chain optimization suggestions using Google's Gemini API. The interface provides a clear, at-a-glance overview of key inventory metrics and actionable insights to prevent stockouts and optimize stock levels.

---

## Features

-   **Executive Dashboard:** Displays key performance indicators (KPIs) like total inventory value, SKU counts, and stock level warnings.
-   **AI-Powered Reorder Suggestions:** Analyzes low-stock and out-of-stock items to provide intelligent reorder quantity recommendations with data-driven justifications.
-   **AI Demand Forecasting:** Generates a 6-month sales forecast for any individual product, visualized in an interactive chart.
-   **Detailed Inventory View:** A comprehensive, sortable, and filterable table of all products in the inventory.
-   **Responsive Design:** Fully responsive layout for seamless use on both desktop and mobile devices.

## Tech Stack

-   **Frontend:** React, TypeScript
-   **Styling:** Tailwind CSS (via CDN)
-   **AI/ML:** Google Gemini API (`gemini-2.5-pro` & `gemini-2.5-flash`)
-   **Charts:** Recharts

---

## Setup and Local Development

This project is designed to run in a modern web development environment that can handle TypeScript and JSX. The following instructions use [Vite](https://vitejs.dev/) as the recommended development server.

### Prerequisites

-   Node.js (version 18.x or higher)
-   `npm` or a compatible package manager (`yarn`, `pnpm`)
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step-by-Step Instructions

1.  **Scaffold a new Vite Project**

    Open your terminal and run the following command to create a new React project with TypeScript support:

    ```bash
    npm create vite@latest diageo-smart-inventory -- --template react-ts
    ```

2.  **Navigate into the Project Directory**

    ```bash
    cd diageo-smart-inventory
    ```

3.  **Install Dependencies**

    This project requires the Google GenAI SDK and Recharts for charting.

    ```bash
    npm install @google/genai recharts
    ```

4.  **Replace Placeholder Files**

    Replace the contents of the generated files with the source code provided below.
    -   Move `index.html` from the project root to `public/index.html` if it's not already there, then replace its content. Or better, just replace the root `index.html`.
    -   Delete all files from the `src/` directory and create the new files as specified in the **Source Code** section.

5.  **Configure Environment Variable (API Key)**

    The application needs your Gemini API key to function.

    -   Create a new file named `.env` in the root of your project directory (`diageo-smart-inventory/.env`).
    -   Add your API key to this file in the following format:
        ```
        VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```

    -   **Important:** You must update one line in `src/services/geminiService.ts` to work with Vite's environment variables. Change this line:

        ```typescript
        // From:
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // To:
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
        ```
        And the check at the top of the file to:
        ```typescript
        if (!import.meta.env.VITE_API_KEY) {
            //...
        }
        ```


6.  **Run the Development Server**

    You're all set! Start the local server by running:

    ```bash
    npm run dev
    ```

    Vite will start the server and provide you with a local URL, typically `http://localhost:5173`. Open this URL in your web browser to see the application running.

---

## Source Code

Here is the full source code for the application.

### `index.html`
<details>
<summary>Click to view code</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Diageo | Smart Inventory System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      /* Custom scrollbar for a more modern look */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #1f2937; /* bg-gray-800 */
      }
      ::-webkit-scrollbar-thumb {
        background: #4b5563; /* bg-gray-600 */
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #6b7280; /* bg-gray-500 */
      }
    </style>
  </head>
  <body class="bg-gray-900 text-gray-100 font-sans">
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```
</details>

### `src/index.tsx`
<details>
<summary>Click to view code</summary>

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // You may need to create a simple index.css file for base styles if Vite requires it.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
</details>

### `src/App.tsx`
<details>
<summary>Click to view code</summary>

```typescript
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { InventoryView } from './components/views/InventoryView';
import { View } from './types';
import { INITIAL_INVENTORY } from './constants';
import type { Product } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [inventory, setInventory] = useState<Product[]>(INITIAL_INVENTORY);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Memoize KPI calculations to prevent re-computing on every render unless inventory changes.
  const lowStockCount = useMemo(() => {
    return inventory.filter(p => p.status === 'Low Stock').length;
  }, [inventory]);

  const stockoutCount = useMemo(() => {
    return inventory.filter(p => p.status === 'Out of Stock').length;
  }, [inventory]);

  const totalInventoryValue = useMemo(() => {
    return inventory.reduce((acc, p) => acc + p.quantity * p.price, 0);
  }, [inventory]);

  const kpis = {
    totalValue: totalInventoryValue,
    lowStock: lowStockCount,
    outOfStock: stockoutCount,
    totalSKUs: inventory.length
  };

  // Renders the component corresponding to the active view.
  const renderView = () => {
    switch (activeView) {
      case View.DASHBOARD:
        return <DashboardView kpis={kpis} inventory={inventory} />;
      case View.INVENTORY:
        return <InventoryView inventory={inventory} setInventory={setInventory} />;
      default:
        return <DashboardView kpis={kpis} inventory={inventory}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-900">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
```
</details>

### `src/types.ts`
<details>
<summary>Click to view code</summary>

```typescript
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
```
</details>

### `src/constants.ts`
<details>
<summary>Click to view code</summary>

```typescript
import type { Product } from './types';
import { StockStatus } from './types';

export const INITIAL_INVENTORY: Product[] = [
  { sku: 'JW-BLACK-750', name: 'Johnnie Walker Black Label', category: 'Whisky', quantity: 150, location: 'Warehouse A', status: StockStatus.IN_STOCK, price: 35.99 },
  { sku: 'SMIRNOFF-RED-1L', name: 'Smirnoff No. 21 Vodka', category: 'Vodka', quantity: 200, location: 'Warehouse B', status: StockStatus.IN_STOCK, price: 18.50 },
  { sku: 'BAILEYS-ORIG-750', name: 'Baileys Original Irish Cream', category: 'Liqueur', quantity: 80, location: 'Warehouse A', status: StockStatus.IN_STOCK, price: 24.00 },
  { sku: 'CM-SPICED-1L', name: 'Captain Morgan Spiced Gold', category: 'Rum', quantity: 45, location: 'Warehouse C', status: StockStatus.LOW_STOCK, price: 21.99 },
  { sku: 'TANQUERAY-LON-750', name: 'Tanqueray London Dry Gin', category: 'Gin', quantity: 60, location: 'Warehouse B', status: StockStatus.IN_STOCK, price: 28.75 },
  { sku: 'GUINNESS-DRAFT-6PK', name: 'Guinness Draught Stout', category: 'Beer', quantity: 300, location: 'Cold Storage A', status: StockStatus.IN_STOCK, price: 9.99 },
  { sku: 'KETEL-ONE-750', name: 'Ketel One Vodka', category: 'Vodka', quantity: 0, location: 'Warehouse C', status: StockStatus.OUT_OF_STOCK, price: 32.50 },
  { sku: 'BULLEIT-BOURBON-750', name: 'Bulleit Bourbon', category: 'Whisky', quantity: 35, location: 'Warehouse A', status: StockStatus.LOW_STOCK, price: 45.00 },
  { sku: 'DON-JULIO-BL-750', name: 'Don Julio Blanco Tequila', category: 'Tequila', quantity: 70, location: 'Warehouse B', status: StockStatus.IN_STOCK, price: 55.20 },
  { sku: 'CROWN-ROYAL-DLX-750', name: 'Crown Royal Deluxe', category: 'Whisky', quantity: 120, location: 'Warehouse C', status: StockStatus.IN_STOCK, price: 30.00 },
];
```
</details>

### `src/services/geminiService.ts`
<details>
<summary>Click to view code</summary>

```typescript
import { GoogleGenAI, Type } from "@google/genai";
import type { Product, ForecastPoint, ReorderSuggestion } from '../types';

// **IMPORTANT**: Update this file as per Step 5 of the setup instructions.
if (!import.meta.env.VITE_API_KEY) {
  console.error("VITE_API_KEY is not set. Please ensure the .env file is configured correctly.");
  throw new Error("VITE_API_KEY environment variable not set. The application cannot connect to Google Gemini.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

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
```
</details>

### `src/components/Sidebar.tsx`
<details>
<summary>Click to view code</summary>

```typescript
import React from 'react';
import { View } from '../types';
import { DiageoLogo, DashboardIcon, InventoryIcon, ReportsIcon, SettingsIcon, CloseIcon } from './icons/Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, label, isActive, onClick, disabled = false }) => {
  const baseClasses = 'flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200';
  const activeClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveClasses = 'text-gray-400 hover:bg-gray-700 hover:text-white';
  const disabledClasses = 'text-gray-600 cursor-not-allowed';

  return (
    <li
      className={`${baseClasses} ${
        disabled ? disabledClasses : isActive ? activeClasses : inactiveClasses
      }`}
      onClick={!disabled ? onClick : undefined}
      aria-disabled={disabled}
      title={disabled ? 'Feature coming soon' : ''}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setSidebarOpen }) => {
    
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`absolute md:relative z-40 md:z-auto flex flex-col w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 h-full`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700 h-16">
          <div className="flex items-center">
             <DiageoLogo className="h-8 w-auto text-white"/>
             <span className="ml-3 text-xl font-bold">DIAGEO</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <NavItem
              icon={<DashboardIcon className="w-6 h-6" />}
              label="Dashboard"
              isActive={activeView === View.DASHBOARD}
              onClick={() => { setActiveView(View.DASHBOARD); setSidebarOpen(false); }}
            />
            <NavItem
              icon={<InventoryIcon className="w-6 h-6" />}
              label="Inventory"
              isActive={activeView === View.INVENTORY}
              onClick={() => { setActiveView(View.INVENTORY); setSidebarOpen(false); }}
            />
            {/* TODO: Implement Reports view */}
            <NavItem
              icon={<ReportsIcon className="w-6 h-6" />}
              label="Reports"
              isActive={activeView === View.REPORTS}
              onClick={() => {}}
              disabled={true}
            />
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
           {/* TODO: Implement Settings view */}
           <NavItem
              icon={<SettingsIcon className="w-6 h-6" />}
              label="Settings"
              isActive={activeView === View.SETTINGS}
              onClick={() => {}}
              disabled={true}
            />
        </div>
      </aside>
    </>
  );
};
```
</details>

### `src/components/Header.tsx`
<details>
<summary>Click to view code</summary>

```typescript
import React from 'react';
import { MenuIcon, NotificationIcon, UserIcon } from './icons/Icons';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between h-16 px-4 md:px-6 bg-gray-800 border-b border-gray-700 shadow-sm">
        <div className="flex items-center">
            <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-400 hover:text-white mr-4"
                aria-label="Open sidebar"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">Smart Inventory System</h1>
        </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
          <NotificationIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-300" />
            </div>
            <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Jane Doe</p>
                <p className="text-xs text-gray-400">Supply Chain Manager</p>
            </div>
        </div>
      </div>
    </header>
  );
};
```
</details>

### `src/components/views/DashboardView.tsx`
<details>
<summary>Click to view code</summary>

```typescript
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
```
</details>

### `src/components/views/InventoryView.tsx`
<details>
<summary>Click to view code</summary>

```typescript
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
```
</details>

### `src/components/icons/Icons.tsx`
<details>
<summary>Click to view code</summary>

```typescript
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const DiageoLogo: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
    <path d="M50,5c24.8,0,45,20.2,45,45s-20.2,45-45,45S5,74.8,5,50S25.2,5,50,5 M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50 s50-22.4,50-50S77.6,0,50,0L50,0z"/>
    <path d="M50,25c-13.8,0-25,11.2-25,25s11.2,25,25,25V25z"/>
  </svg>
);

export const DashboardIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const InventoryIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

export const ReportsIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const NotificationIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const CashIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const CubeIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

export const ExclamationIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const ArchiveIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);
```
</details>

### `metadata.json`
<details>
<summary>Click to view code</summary>

```json
{
  "name": "Diageo Smart Inventory & Supply Chain Optimization",
  "description": "An intelligent dashboard for Diageo to monitor inventory, forecast demand, and receive AI-powered supply chain optimization suggestions using Google's Gemini API.",
  "requestFramePermissions": []
}
```
</details>
