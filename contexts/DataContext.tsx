import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization, ChartDataPoint } from '../types';
import { MOCK_ORGS, KPIS as INITIAL_KPIS, SECTOR_RISK_DATA as INITIAL_SECTOR, STATE_RISK_DATA as INITIAL_STATE, VICTIM_DISTRIBUTION as INITIAL_VICTIM } from '../constants';

interface DataContextType {
  data: Organization[];
  kpis: typeof INITIAL_KPIS;
  sectorData: ChartDataPoint[];
  stateData: ChartDataPoint[];
  victimData: {name: string, value: number}[];
  uploadData: (csvContent: string) => void;
  resetData: () => void;
  isCustomData: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Organization[]>(MOCK_ORGS);
  const [kpis, setKpis] = useState(INITIAL_KPIS);
  const [sectorData, setSectorData] = useState(INITIAL_SECTOR);
  const [stateData, setStateData] = useState(INITIAL_STATE);
  const [victimData, setVictimData] = useState(INITIAL_VICTIM);
  const [isCustomData, setIsCustomData] = useState(false);

  // Recalculate metrics when data changes
  useEffect(() => {
    if (data.length === 0) return;

    // 1. KPIs
    const totalMonitored = data.length;
    const highRisk = data.filter(o => o.riskLevel === 'High' || o.riskLevel === 'Critical').length;
    const attackRate = totalMonitored > 0 ? parseFloat(((highRisk / totalMonitored) * 100).toFixed(1)) : 0;
    const avgExposure = totalMonitored > 0 ? parseFloat((data.reduce((acc, curr) => acc + curr.exposureScore, 0) / totalMonitored).toFixed(1)) : 0;
    const avgSecurityGap = totalMonitored > 0 ? parseFloat((data.reduce((acc, curr) => acc + curr.securityGap, 0) / totalMonitored).toFixed(1)) : 0;

    setKpis({
      totalMonitored,
      highRiskCount: highRisk,
      attackRate,
      avgExposure,
      avgSecurityGap
    });

    // 2. Sector Data
    const sectors: Record<string, number> = {};
    data.filter(o => o.riskLevel === 'High' || o.riskLevel === 'Critical').forEach(org => {
        sectors[org.sector] = (sectors[org.sector] || 0) + 1;
    });
    // Convert to array and take top 7
    const newSectorData = Object.entries(sectors)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value)
        .slice(0, 7);
    setSectorData(newSectorData);

    // 3. State Data
    const states: Record<string, number> = {};
    data.filter(o => o.riskLevel === 'High' || o.riskLevel === 'Critical').forEach(org => {
        states[org.state] = (states[org.state] || 0) + 1;
    });
    const newStateData = Object.entries(states)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value)
        .slice(0, 10);
    setStateData(newStateData);

    // 4. Victim Distribution
    // Simplification: Predicted Victims are those with High/Critical risk
    setVictimData([
      { name: 'Predicted Victims', value: highRisk },
      { name: 'Safe', value: totalMonitored - highRisk }
    ]);

  }, [data]);

  const uploadData = (csvContent: string) => {
    try {
      const lines = csvContent.split('\n');
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const newData: Organization[] = [];

      for(let i=1; i<lines.length; i++) {
        if(!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        
        // Basic mapping helper
        const getVal = (part: string) => {
            const idx = headers.findIndex(h => h.includes(part));
            return idx !== -1 ? values[idx] : undefined;
        };

        // If we can't find 'name', skip
        const name = getVal('name');
        if (!name && values.length < 5) continue; 

        // Probabilistic parsing fallback
        const exposure = parseFloat(getVal('exposure') || values[5] || '50');
        const gap = parseFloat(getVal('gap') || values[6] || '50');
        const prob = parseFloat(getVal('prob') || getVal('risk') || '0.5');

        let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
        if (prob > 0.8 || (prob > 80)) level = 'Critical';
        else if (prob > 0.6 || (prob > 60)) level = 'High';
        else if (prob > 0.4 || (prob > 40)) level = 'Medium';
        
        // Normalize prob to 0-1
        const normalizedProb = prob > 1 ? prob / 100 : prob;

        newData.push({
            id: getVal('id') || `CSV-${i}`,
            name: name || getVal('org') || `Organization ${i}`,
            sector: getVal('sector') || 'Other',
            state: getVal('state') || 'Unknown',
            employees: parseInt(getVal('employee') || '1000'),
            revenue: getVal('revenue') || 'Unknown',
            riskScore: Math.floor(normalizedProb * 100),
            riskLevel: level,
            exposureScore: exposure,
            securityGap: gap,
            predictedAttackProb: normalizedProb
        });
      }

      if(newData.length > 0) {
          setData(newData);
          setIsCustomData(true);
      } else {
          alert("Could not parse valid data from CSV. Please check format.");
      }
    } catch (e) {
      console.error("CSV Parse Error", e);
      alert("Failed to parse CSV file.");
    }
  };

  const resetData = () => {
      setData(MOCK_ORGS);
      setIsCustomData(false);
  };

  return (
    <DataContext.Provider value={{ data, kpis, sectorData, stateData, victimData, uploadData, resetData, isCustomData }}>
      {children}
    </DataContext.Provider>
  );
};