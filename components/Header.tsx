
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
