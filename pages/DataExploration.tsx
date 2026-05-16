
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Upload, RotateCcw, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { INDIAN_STATES } from '../constants';

const DataExploration: React.FC = () => {
  const { data, uploadData, resetData, isCustomData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const itemsPerPage = 20;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLevel, data]);

  const filteredOrgs = data.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          org.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'All' || org.riskLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredOrgs.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          uploadData(content);
        }
      };
      reader.readAsText(file);
    }
  };

  // Generate Sample CSV Logic
  const generateSampleCSV = (count: number) => {
    const sectors = ['Finance', 'Healthcare', 'Technology', 'Manufacturing', 'Retail', 'Government', 'Energy'];
    // Use the central constant for states to maintain consistency across the app
    const states = INDIAN_STATES; 
    const prefixes = ['Royal', 'Apex', 'Zenith', 'Bharat', 'Indian', 'Global', 'Prime', 'Rapid', 'Tech', 'Smart'];
    const suffixes = ['Systems', 'Solutions', 'Holdings', 'Bank', 'Hospitals', 'Infotech', 'Motors', 'Logistics'];
    
    let csvContent = "id,name,sector,state,employees,revenue,exposure,gap,prob\n";

    for (let i = 1; i <= count; i++) {
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        const state = states[Math.floor(Math.random() * states.length)];
        const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]} ${Math.floor(Math.random()*100)}`;
        
        // Realistic Risk Logic
        const exposure = Math.floor(Math.random() * 90) + 10;
        const gap = Math.floor(Math.random() * 90) + 10;
        // Calc probability somewhat correlated to inputs
        let prob = ((exposure * 0.5) + (gap * 0.4) + (Math.random() * 10)) / 100;
        prob = Math.min(Math.max(prob, 0.01), 0.99);

        const id = `TEST-ORG-${1000 + i}`;
        const employees = Math.floor(Math.random() * 10000) + 100;
        const revenue = `₹${Math.floor(Math.random() * 1000)} Cr`;

        csvContent += `${id},${name},${sector},${state},${employees},${revenue},${exposure},${gap},${prob.toFixed(2)}\n`;
    }

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sample_cyber_risk_data_${count}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    setShowDownloadMenu(false);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
        {/* Header Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
            
            {/* Search & Filter */}
            <div className="flex flex-1 w-full xl:w-auto gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search organizations or IDs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
                    />
                </div>
                
                <div className="relative">
                     <select 
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                     >
                        <option value="All">All Risks</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                     </select>
                     <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                {isCustomData && (
                     <button 
                        onClick={resetData}
                        className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset Data
                    </button>
                )}

                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv"
                    className="hidden"
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors text-sm font-medium border border-blue-200 dark:border-blue-800"
                >
                    <Upload className="w-4 h-4 mr-2" /> Upload CSV
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className="flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" /> Get Sample Data
                    </button>
                    {showDownloadMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                            <div className="py-1">
                                <button onClick={() => generateSampleCSV(100)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-gray-400" /> 100 Records
                                </button>
                                <button onClick={() => generateSampleCSV(500)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-gray-400" /> 500 Records
                                </button>
                                <button onClick={() => generateSampleCSV(1000)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-gray-400" /> 1,000 Records
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-800">Org Name / ID</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-800">Sector</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-800">Location</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-800 text-center">Exposure</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-800 text-center">Sec. Gap</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-800 text-center">Attack Prob.</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-800">Risk Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                        {currentData.length > 0 ? (
                            currentData.map((org) => (
                                <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{org.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-500">{org.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{org.sector}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{org.state}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium 
                                            ${org.exposureScore > 70 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                                              org.exposureScore > 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                            {org.exposureScore}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium 
                                            ${org.securityGap > 70 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' : 
                                              org.securityGap > 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                            {org.securityGap}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-gray-600 dark:text-gray-400">
                                        {(org.predictedAttackProb * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${org.riskLevel === 'Critical' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : 
                                              org.riskLevel === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' : 
                                              org.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' : 
                                              'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'}`}>
                                            {org.riskLevel}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    No organizations found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium">{filteredOrgs.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium">{Math.min(endIndex, filteredOrgs.length)}</span> of <span className="font-medium">{filteredOrgs.length}</span> results
                </span>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DataExploration;
