// Minimal constants and mock data used by the app to avoid missing-import errors
import { Organization } from './types';

export const INDIAN_STATES = [
  'Maharashtra','Karnataka','Tamil Nadu','Delhi','Uttar Pradesh','Gujarat','Rajasthan','Punjab','West Bengal','Kerala'
];

export const THEME_COLORS = {
  primary: '#2563eb',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#ef4444'
};

export const CHART_THEME = {
  light: {
    grid: '#e5e7eb',
    text: '#6b7280',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e5e7eb',
    tooltipColor: '#111827'
  },
  dark: {
    grid: '#374151',
    text: '#9ca3af',
    tooltipBg: '#111827',
    tooltipBorder: '#374151',
    tooltipColor: '#ffffff'
  }
};


export const KPIS = {
  totalMonitored: 12,
  highRiskCount: 3,
  attackRate: 25.0,
  avgExposure: 52.3,
  avgSecurityGap: 40.1
};

export const SECTOR_RISK_DATA = [
  { name: 'Finance', value: 4 },
  { name: 'Healthcare', value: 3 },
  { name: 'Energy', value: 2 }
];

export const STATE_RISK_DATA = [
  { name: 'Maharashtra', value: 3 },
  { name: 'Karnataka', value: 2 },
  { name: 'Tamil Nadu', value: 1 }
];

export const VICTIM_DISTRIBUTION = [
  { name: 'Predicted Victims', value: 3 },
  { name: 'Safe', value: 9 }
];

export const MODEL_METRICS = [
  { name: 'XGBoost', accuracy: 0.92, precision: 0.90, recall: 0.88, f1: 0.89, auc: 0.94 },
  { name: 'Random Forest', accuracy: 0.89, precision: 0.87, recall: 0.85, f1: 0.86, auc: 0.91 },
  { name: 'SVM', accuracy: 0.85, precision: 0.82, recall: 0.80, f1: 0.81, auc: 0.88 },
  { name: 'Logistic Reg.', accuracy: 0.82, precision: 0.79, recall: 0.78, f1: 0.78, auc: 0.84 }
];

export const MODEL_ROC_DATA: Record<string, {fpr: number, tpr: number}[]> = {
  'XGBoost': [
    { fpr: 0.0, tpr: 0.0 }, { fpr: 0.05, tpr: 0.4 }, { fpr: 0.1, tpr: 0.7 }, { fpr: 0.2, tpr: 0.85 }, { fpr: 0.5, tpr: 0.95 }, { fpr: 1.0, tpr: 1.0 }
  ],
  'Random Forest': [
    { fpr: 0.0, tpr: 0.0 }, { fpr: 0.1, tpr: 0.6 }, { fpr: 0.2, tpr: 0.75 }, { fpr: 0.3, tpr: 0.82 }, { fpr: 0.6, tpr: 0.9 }, { fpr: 1.0, tpr: 1.0 }
  ],
  'SVM': [
    { fpr: 0.0, tpr: 0.0 }, { fpr: 0.15, tpr: 0.5 }, { fpr: 0.3, tpr: 0.65 }, { fpr: 0.5, tpr: 0.75 }, { fpr: 0.8, tpr: 0.9 }, { fpr: 1.0, tpr: 1.0 }
  ],
  'Logistic Reg.': [
    { fpr: 0.0, tpr: 0.0 }, { fpr: 0.2, tpr: 0.4 }, { fpr: 0.4, tpr: 0.6 }, { fpr: 0.6, tpr: 0.75 }, { fpr: 0.8, tpr: 0.85 }, { fpr: 1.0, tpr: 1.0 }
  ]
};

export const MODEL_FEATURE_IMPORTANCE: Record<string, {label: string, val: number}[]> = {
  'XGBoost': [
    { label: 'Past Incidents', val: 95 }, { label: 'Exposure Score', val: 82 }, { label: 'Security Gap', val: 75 }, { label: 'Threat Intel', val: 68 }
  ],
  'Random Forest': [
    { label: 'Security Gap', val: 88 }, { label: 'Past Incidents', val: 80 }, { label: 'Exposure Score', val: 72 }, { label: 'Employee Count', val: 55 }
  ],
  'SVM': [
    { label: 'Exposure Score', val: 90 }, { label: 'Threat Intel', val: 78 }, { label: 'Past Incidents', val: 70 }, { label: 'Security Gap', val: 65 }
  ],
  'Logistic Reg.': [
    { label: 'Exposure Score', val: 92 }, { label: 'Security Gap', val: 60 }, { label: 'Threat Intel', val: 55 }, { label: 'Past Incidents', val: 40 }
  ]
};


export const MOCK_ORGS: Organization[] = [
  {
    id: 'org-1',
    name: 'Acme Finance',
    sector: 'Finance',
    state: 'Maharashtra',
    employees: 1200,
    revenue: '1B',
    riskScore: 85,
    riskLevel: 'High',
    exposureScore: 70,
    securityGap: 50,
    predictedAttackProb: 0.85
  },
  {
    id: 'org-2',
    name: 'HealthCorp',
    sector: 'Healthcare',
    state: 'Karnataka',
    employees: 800,
    revenue: '500M',
    riskScore: 65,
    riskLevel: 'Medium',
    exposureScore: 55,
    securityGap: 40,
    predictedAttackProb: 0.65
  }
];

export default {};
