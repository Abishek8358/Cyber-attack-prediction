
import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Save, RotateCcw, Activity } from 'lucide-react';
import { INDIAN_STATES } from '../constants'; // Importing the new state list if exported, or defining locally

const PredictionTool: React.FC = () => {
  // --- STATE: RISK PREDICTION ---
  // Initialized to 0/empty to ensure "fresh start" look
  const [formData, setFormData] = useState({
    sector: 'Finance',
    state: 'Maharashtra',
    employees: 5000,
    exposureScore: 0,
    securityGap: 0,
    pastIncidents: 0,
    threatIntel: 0,
  });

  const [prediction, setPrediction] = useState({
    prob: 0,
    riskLevel: 'Low', 
    loading: false,
  });

  // New state to track if simulation has been executed
  const [hasRun, setHasRun] = useState(false);

  // Local definition if constants import fails (Safe fallback)
  const statesList = [
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi NCR', 'Telangana', 
    'Gujarat', 'West Bengal', 'Uttar Pradesh', 'Rajasthan', 'Kerala', 
    'Madhya Pradesh', 'Andhra Pradesh'
  ];

  // --- LOGIC: RISK PREDICTION ---
  const calculateRisk = () => {
    setPrediction(prev => ({ ...prev, loading: true }));
    setHasRun(true); // Mark as run
    
    setTimeout(() => {
      let score = 0;
      score += (formData.exposureScore * 0.4);
      score += (formData.securityGap * 0.3);
      score += (formData.pastIncidents * 10);
      score += (formData.threatIntel * 20);
      
      if (formData.sector === 'Finance' || formData.sector === 'Healthcare') score += 10;
      if (formData.state === 'Maharashtra' || formData.state === 'Karnataka' || formData.state === 'Delhi NCR') score += 5;
      
      // Ensure result isn't negative if inputs are 0, but allow 0 if really 0
      let finalScore = Math.min(Math.max(score, 0), 99);
      if (score > 0 && finalScore < 5) finalScore = 5; // Minimum floor only if some input exists

      let level = 'Low';
      if (finalScore > 80) level = 'Critical';
      else if (finalScore > 60) level = 'High';
      else if (finalScore > 40) level = 'Medium';

      setPrediction({
        prob: finalScore,
        riskLevel: level,
        loading: false,
      });
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'range' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  // Helper for gauge stroke color
  const getRiskColor = (prob: number) => {
    if (prob === 0) return '#e5e7eb'; // Gray for 0
    if (prob > 80) return '#ef4444'; // Red-500
    if (prob > 60) return '#f97316'; // Orange-500
    if (prob > 40) return '#eab308'; // Yellow-500
    return '#22c55e'; // Green-500
  };

  // Helper for text color (ensures visibility when score is 0)
  const getTextColor = (prob: number) => {
    if (prob === 0) return '#9ca3af'; // Gray-400 for text
    return getRiskColor(prob);
  };

  // SVG Gauge Math
  const radius = 120;
  const stroke = 20;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * Math.PI; // Semi-circle circumference
  const strokeDashoffset = circumference - (prediction.prob / 100) * circumference;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      
      <div className="flex items-center space-x-4 mb-2">
         <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-600/20">
            <ShieldAlert className="w-8 h-8" />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Prediction Simulator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Simulate organization risk factors to estimate attack probability using our ML logic.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Input Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col transition-colors duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configuration Parameters
              </h2>
              <button 
                onClick={() => {
                  setFormData({
                    sector: 'Finance', state: 'Maharashtra', employees: 5000, exposureScore: 0, securityGap: 0, pastIncidents: 0, threatIntel: 0
                  });
                  setPrediction({ prob: 0, riskLevel: 'Low', loading: false });
                  setHasRun(false); // Reset run state
                }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md"
              >
                <RotateCcw className="w-3 h-3 mr-1.5" /> Reset Default
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Sector</label>
                    <select 
                      name="sector" 
                      value={formData.sector} 
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-colors"
                    >
                      {['Finance', 'Healthcare', 'Government', 'Energy', 'Retail', 'Technology'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State Location</label>
                    <select 
                      name="state" 
                      value={formData.state} 
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-colors"
                    >
                      {statesList.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exposure Score (0-100)
                      <span className="float-right text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 rounded">{formData.exposureScore}</span>
                    </label>
                    <input 
                      type="range" 
                      name="exposureScore" 
                      min="0" max="100" 
                      value={formData.exposureScore} 
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on open ports, cloud usage, and public services.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Security Gap Score (0-100)
                      <span className="float-right text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-900/30 px-2 rounded">{formData.securityGap}</span>
                    </label>
                    <input 
                      type="range" 
                      name="securityGap" 
                      min="0" max="100" 
                      value={formData.securityGap} 
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Inverse of maturity (Higher = Worse posture).</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Past Incidents (Last 12m)</label>
                    <input 
                      type="number" 
                      name="pastIncidents" 
                      min="0" 
                      value={formData.pastIncidents} 
                      onChange={(e) => setFormData({...formData, pastIncidents: parseInt(e.target.value) || 0})}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Threat Intel Score (0.0 - 1.0)
                      <span className="float-right text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/30 px-2 rounded">{formData.threatIntel.toFixed(2)}</span>
                    </label>
                    <input 
                      type="range" 
                      name="threatIntel" 
                      min="0" max="1" step="0.05"
                      value={formData.threatIntel} 
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">External dark web noise and targeted chatter.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end">
              <button 
                onClick={calculateRisk}
                disabled={prediction.loading}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
              >
                {prediction.loading ? 'Calculating...' : (
                  <>
                    Run Simulation <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Risk Result Panel */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 flex flex-col items-center justify-start relative overflow-hidden transition-colors duration-300">
            
            <div className="relative flex flex-col items-center justify-center mt-4">
              <svg
                  height={radius}
                  width={radius * 2}
                  className="overflow-visible"
              >
                  {/* Background Arc */}
                  <path
                      d={`M ${stroke} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke} ${radius}`}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth={stroke}
                      strokeLinecap="round"
                      className="dark:stroke-gray-700"
                  />
                  {/* Foreground Arc */}
                  <path
                      d={`M ${stroke} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke} ${radius}`}
                      fill="none"
                      stroke={getRiskColor(prediction.prob)}
                      strokeWidth={stroke}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out drop-shadow-md"
                  />
              </svg>
              
              {/* Center Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2 text-center w-full">
                <h3 className="text-5xl font-bold mb-1" style={{ color: getTextColor(prediction.prob) }}>
                    {prediction.prob.toFixed(1)}%
                </h3>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Attack Probability
                </span>
              </div>
            </div>
            
            <div className="mt-8 text-center space-y-6 w-full">
              {hasRun ? (
                <>
                  <div className={`inline-flex items-center px-6 py-2.5 rounded-full text-base font-bold tracking-wide uppercase shadow-sm
                    ${prediction.riskLevel === 'Critical' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 
                      prediction.riskLevel === 'High' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800' : 
                      prediction.riskLevel === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800' : 
                      'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'}`}>
                    <ShieldAlert className="w-5 h-5 mr-2" />
                    {prediction.riskLevel} Risk
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl text-left text-sm border border-gray-200 dark:border-gray-700 mt-6 transition-colors duration-300">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                        <Save className="w-4 h-4 mr-2 text-blue-600" /> Recommended Actions
                      </h4>
                      <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                        {prediction.prob > 60 ? (
                          <>
                            <li className="flex items-start"><span className="mr-2 text-red-500">•</span> Immediate patching of external services required.</li>
                            <li className="flex items-start"><span className="mr-2 text-red-500">•</span> Enforce MFA on all privileged accounts.</li>
                            <li className="flex items-start"><span className="mr-2 text-red-500">•</span> Isolate critical assets from public internet.</li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start"><span className="mr-2 text-green-500">•</span> Continue monitoring threat intelligence feeds.</li>
                            <li className="flex items-start"><span className="mr-2 text-green-500">•</span> Conduct routine phishing simulations.</li>
                            <li className="flex items-start"><span className="mr-2 text-green-500">•</span> Review backup integrity.</li>
                          </>
                        )}
                      </ul>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center py-6">
                   <Activity className="w-12 h-12 mb-3 opacity-20" />
                   <p className="text-sm">Configure parameters and click "Run Simulation" to see results.</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default PredictionTool;
