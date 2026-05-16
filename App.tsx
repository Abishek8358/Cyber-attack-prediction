import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ModelPerformance from './pages/ModelPerformance';
import PredictionTool from './pages/PredictionTool';
import DataExploration from './pages/DataExploration';
import { ThemeContextType, Theme } from './types';
import { DataProvider } from './contexts/DataContext';

// Create Context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <DataProvider>
        <Router>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Sidebar />
            
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen scroll-smooth">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/models" element={<ModelPerformance />} />
                  <Route path="/predict" element={<PredictionTool />} />
                  <Route path="/explore" element={<DataExploration />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              
              <footer className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400 pb-4">
                 Cyber Attack Prediction &copy; 2025 | Production Grade Risk Prediction System
              </footer>
            </main>
          </div>
        </Router>
      </DataProvider>
    </ThemeContext.Provider>
  );
};

export default App;