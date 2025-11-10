
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
