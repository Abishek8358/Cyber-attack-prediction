import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Zap, Database, ShieldAlert, Moon, Sun } from 'lucide-react';
import { useTheme } from '../App';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Overview' },
    { to: '/models', icon: Activity, label: 'Model Performance' },
    { to: '/predict', icon: Zap, label: 'Risk Prediction' },
    { to: '/explore', icon: Database, label: 'Data Exploration' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <ShieldAlert className="w-8 h-8 text-blue-600 mr-3" />
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Cyber Attack Prediction</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
        {/* Theme Toggler */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm font-medium">Theme</span>
          {theme === 'light' ? (
            <div className="flex items-center text-xs">
              <Sun className="w-4 h-4 mr-2 text-orange-500" /> Light
            </div>
          ) : (
            <div className="flex items-center text-xs">
              <Moon className="w-4 h-4 mr-2 text-blue-400" /> Dark
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;