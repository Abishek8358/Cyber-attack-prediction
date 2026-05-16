
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Shield, AlertTriangle, Users, Globe } from 'lucide-react';
import StatCard from '../components/StatCard';
import { THEME_COLORS, CHART_THEME } from '../constants';
import { useTheme } from '../App';
import { useData } from '../contexts/DataContext';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { kpis, sectorData, stateData, victimData, isCustomData } = useData();
  const chartColors = CHART_THEME[theme];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cyber Risk Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          {isCustomData && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded shadow-sm">Custom Dataset</span>}
          <span className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm">India View</span>
          <span className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm">Last 30 Days</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Monitored Orgs"
          value={kpis.totalMonitored.toLocaleString()}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          label="Predicted Victims"
          value={kpis.highRiskCount.toLocaleString()}
          subtext={`Attack Rate: ${kpis.attackRate}%`}
          icon={AlertTriangle}
          color="text-red-600"
        />
        <StatCard
          label="Avg Exposure Score"
          value={kpis.avgExposure}
          subtext="Infrastructure Vulnerability"
          icon={Globe}
          color="text-yellow-600"
        />
        <StatCard
          label="Avg Security Gap"
          value={kpis.avgSecurityGap}
          subtext="Posture Weakness"
          icon={Shield}
          color="text-orange-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Risk */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Predicted High Risk by Sector</h2>
          <div className="h-80 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
                <XAxis type="number" stroke={chartColors.text} />
                <YAxis dataKey="name" type="category" width={100} stroke={chartColors.text} fontSize={12} tick={{fill: chartColors.text}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    borderColor: chartColors.tooltipBorder, 
                    color: chartColors.tooltipColor,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }} 
                  cursor={{fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
                />
                <Bar dataKey="value" fill={THEME_COLORS.primary} radius={[0, 4, 4, 0]} barSize={20} name="High Risk Orgs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Victim Distribution */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Victims vs Safe (Next 30 Days)</h2>
          <div className="h-80 flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={victimData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={THEME_COLORS.danger} />
                  <Cell fill={THEME_COLORS.success} />
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    borderColor: chartColors.tooltipBorder, 
                    color: chartColors.tooltipColor,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute inset-x-0 bottom-4 flex justify-center gap-6">
                <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Predicted Victims</span>
                </div>
                <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Safe</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Risk Map (Converted to Bar Chart for Better Categorical Logic) */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">State-wise Risk Intensity</h2>
        <div className="h-72 min-h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="name" stroke={chartColors.text} tick={{fill: chartColors.text}} fontSize={12} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke={chartColors.text} tick={{fill: chartColors.text}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    borderColor: chartColors.tooltipBorder, 
                    color: chartColors.tooltipColor,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }} 
                  cursor={{fill: 'transparent'}}
                />
                {/* Used Purple color for State differentiation */}
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} name="Risk Count" />
              </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
