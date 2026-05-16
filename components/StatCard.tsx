import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon: Icon, trend, color = 'text-blue-600' }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-baseline">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          </div>
          {subtext && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 dark:bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      {/* Decorative gradient glow */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 filter blur-xl ${color.replace('text-', 'bg-')}`} />
    </div>
  );
};

export default StatCard;