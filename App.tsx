
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
