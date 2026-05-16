
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { CheckCircle } from 'lucide-react';
import { MODEL_METRICS, MODEL_ROC_DATA, MODEL_FEATURE_IMPORTANCE, THEME_COLORS, CHART_THEME } from '../constants';
import { useTheme } from '../App';

const ModelPerformance: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('XGBoost');
  const { theme } = useTheme();
  const chartColors = CHART_THEME[theme];

  // Get dynamic data based on selection
  const currentROC = MODEL_ROC_DATA[selectedModel] || MODEL_ROC_DATA['XGBoost'];
  const currentFeatures = MODEL_FEATURE_IMPORTANCE[selectedModel] || MODEL_FEATURE_IMPORTANCE['XGBoost'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patterns & Trends</h1>
        <select 
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-colors cursor-pointer"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {MODEL_METRICS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
        </select>
      </div>

      {/* Metrics Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Model Metrics Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4">Model Name</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4">Precision</th>
                <th className="px-6 py-4">Recall</th>
                <th className="px-6 py-4">F1-Score</th>
                <th className="px-6 py-4">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {MODEL_METRICS.map((model) => (
                <tr 
                  key={model.name} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedModel === model.name ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setSelectedModel(model.name)}
                  style={{cursor: 'pointer'}}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{model.name}</td>
                  {/* Reduced decimal points for cleaner look */}
                  <td className="px-6 py-4">{(model.accuracy * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4">{(model.precision * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4">{(model.recall * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4">{(model.f1 * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">{model.auc.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ROC Curve */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">ROC Curve Analysis</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Target: AUC &gt; 0.90</span>
          </div>
          <div className="h-96 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentROC} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="fpr" 
                  stroke={chartColors.text}
                  label={{ value: 'False Positive Rate', position: 'insideBottomRight', offset: -5 }} 
                  type="number" 
                  domain={[0, 1]}
                  tick={{fill: chartColors.text}}
                />
                <YAxis 
                  stroke={chartColors.text}
                  label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', offset: 10 }} 
                  domain={[0, 1]}
                  tick={{fill: chartColors.text}}
                />
                <Tooltip 
                  // Formats the value (Y-axis) to 3 decimal places
                  formatter={(value: number) => [Number(value).toFixed(3)]}
                  // Formats the label (X-axis, the header) to 3 decimal places
                  labelFormatter={(label) => `FPR: ${Number(label).toFixed(3)}`}
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    borderColor: chartColors.tooltipBorder, 
                    color: chartColors.tooltipColor,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '20px', color: chartColors.text }} />
                <Line 
                  type="monotone" 
                  dataKey="tpr" 
                  stroke={THEME_COLORS.primary} 
                  strokeWidth={3} 
                  dot={false} // Always false to remove points/dots
                  name={selectedModel} 
                  animationDuration={800}
                />
                <Line 
                  type="linear" 
                  dataKey="fpr" 
                  stroke="#9ca3af" 
                  strokeDasharray="5 5" 
                  strokeWidth={1} 
                  dot={false} 
                  name="Random Guess" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Risk Drivers ({selectedModel})</h2>
          <div className="space-y-6 flex-1">
            {currentFeatures.map((feat, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feat.label}</span>
                  <span className="text-gray-500 dark:text-gray-400">Imp: {(feat.val / 100).toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-in-out" 
                    style={{ width: `${feat.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg text-sm text-blue-700 dark:text-blue-300 flex items-start">
              <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                {selectedModel === 'XGBoost' 
                  ? "XGBoost identifies historical incident patterns as the #1 predictor, offering the highest AUC."
                  : selectedModel === 'SVM'
                  ? "SVM focuses on finding the optimal hyperplane between secure and exposed infrastructure assets."
                  : selectedModel === 'Random Forest'
                  ? "Random Forest splits heavily on Security Gaps, providing robust classification against noise."
                  : "Logistic Regression provides a simple linear baseline, weighing Exposure Score most heavily."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;
