export type Replicability = 'low' | 'medium' | 'high';
export type AssetType = 'cash' | 'stock' | 'fund' | 'property' | 'bond' | 'business' | 'crypto' | 'gold' | 'other';
export type LiquidityLevel = 'T0' | 'T7' | 'T30' | 'T365' | 'Locked';

// Common Interfaces
export interface HealthMetric {
  score: number; // 0-100
  label: string;
  status: 'healthy' | 'warning' | 'critical';
  value?: string | number;
}

export interface EngineHealth {
  totalScore: number;
  label?: string;
  metrics: HealthMetric[];
  status: 'healthy' | 'warning' | 'critical';
  advice: string[];
}

// 1. Income Engine
export interface IncomeSource {
  id: string;
  name: string;
  type: 'salary' | 'contract' | 'investment' | 'business' | 'royalty';
  amount: number; // Before Tax if taxable
  taxable: boolean;
  taxRate: number; // %
  stabilityScore: number; // 0-100 (Variance)
  growthRate: number; // % per year projected
  replicability: Replicability;
}

export interface IncomeParams {
  monthlyIncome: number; // Calculated total net
  sources: IncomeSource[];
  liquidSavings: number; // Months
  industryRiskScore: number; // 0-100 (AI/Unemployment risk)
  projectedIncome3Yr: number; // Calculated
}

// 2. Asset Engine
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number; // Current Market Value
  cost: number; // Cost basis
  liability: number; // Debt against this asset
  interestRate: number; // Interest rate of debt
  liquidity: LiquidityLevel;
  expectedReturn: number; // %
  volatility: number; // %
  lockedUntil?: string; // Date or description
}

export interface AssetParams {
  assets: Asset[];
  totalValue: number;
  netWorth: number;
  monthlyExpense: number;
  debtToAssetRatio: number;
}

// 3. Freedom Engine
export interface FreedomParams {
  locationLockScore: number; // 0-100
  dependents: number;
  survivalMonthlyCost: number; // Bare minimum
  comfortMonthlyCost: number; // Current lifestyle
  skillTransferability: number; // 0-100
  passiveIncome: number;
  liquidAssets: number;
  fireYearProjection: number; // Years to FI
}

// 4. Risk Engine
export interface Insurance {
  id: string;
  type: 'medical' | 'unemployment' | 'life' | 'property' | 'disability';
  coverage: number;
  premium: number; // Yearly cost
  valid: boolean;
}

export interface RiskParams {
  incomeVolatility: number; // 0-100
  marketCorrelation: number; // 0-100
  insurance: Insurance[];
  emergencyFund: number; // amount
  monthlyBurn: number;
  totalAssets: number;
  downsideProtectionScore: number; // Calculated
}

// 5. Learning Engine
export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0-100
  marketDemand: number; // 0-100
  aiReplacability: number; // 0-100
  decayHalfLife: number; // Years until skill is obsolete
  investmentHoursPerMonth: number;
}

export interface LearningParams {
  skills: Skill[];
  monthlyLearningBudget: number;
  learningRoi: number; // %
  humanCapitalValuation: number; // NPV of future earnings
}

// Simulator & History
export interface SimulatorParams {
  incomeChange: number; // %
  expenseInflation: number; // %
  marketReturn: number; // %
  interestRateChange: number; // %
  blackSwan: 'none' | 'unemployment' | 'market_crash' | 'health_issue';
}

export interface HistoryData {
  date: string;
  scores: {
    income: number;
    asset: number;
    freedom: number;
    risk: number;
    learning: number;
    total: number;
  };
}

// Root State
export interface LifeOSState {
  income: IncomeParams;
  assets: AssetParams;
  freedom: FreedomParams;
  risk: RiskParams;
  learning: LearningParams;
  simulator?: SimulatorParams;
  history: HistoryData[];
}
