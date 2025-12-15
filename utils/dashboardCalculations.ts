import { InvestmentParams, RepaymentMethod } from '../types';

// Timeline Data for 30-year visualization
export interface TimelinePoint {
  year: number;
  remainingPrincipal: number;
  cumulativeInterest: number;
  cumulativePayment: number;
  riskLevel: number; // 0-100
  milestone?: string;
}

export const calculateTimelineData = (
  totalPrice: number,
  downPaymentRatio: number,
  interestRate: number,
  loanTerm: number,
  monthlyIncome: number
): TimelinePoint[] => {
  const loanAmount = totalPrice * (1 - downPaymentRatio / 100);
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTerm * 12;
  
  const monthlyPayment = loanAmount * 10000 * monthlyRate * 
    Math.pow(1 + monthlyRate, totalMonths) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  const timeline: TimelinePoint[] = [];
  let remaining = loanAmount * 10000;
  let cumulativeInterest = 0;
  let cumulativePayment = 0;
  
  for (let year = 0; year <= loanTerm; year++) {
    const monthsElapsed = year * 12;
    
    // Calculate remaining principal at this year
    if (year > 0) {
      for (let m = (year - 1) * 12; m < monthsElapsed; m++) {
        const interestPortion = remaining * monthlyRate;
        const principalPortion = monthlyPayment - interestPortion;
        remaining -= principalPortion;
        cumulativeInterest += interestPortion;
        cumulativePayment += monthlyPayment;
      }
    }
    
    // Risk level decreases as loan is paid off
    const dti = monthlyPayment / monthlyIncome;
    const leverageRisk = (remaining / (totalPrice * 10000)) * 100;
    const riskLevel = Math.min(100, dti * 100 + leverageRisk * 0.5);
    
    // Milestones
    let milestone: string | undefined;
    if (year === 0) milestone = '购房';
    else if (year === 5) milestone = '5年';
    else if (year === 10) milestone = '10年';
    else if (year === 15) milestone = '中点';
    else if (year === loanTerm) milestone = '还清';
    
    timeline.push({
      year,
      remainingPrincipal: remaining / 10000,
      cumulativeInterest: cumulativeInterest / 10000,
      cumulativePayment: cumulativePayment / 10000,
      riskLevel: Math.round(riskLevel),
      milestone
    });
  }
  
  return timeline;
};

// Risk Gradient Data
export interface RiskGradientPoint {
  label: string;
  value: number;
  color: string;
}

export const calculateRiskGradient = (
  totalPrice: number,
  downPaymentRatio: number,
  interestRate: number,
  monthlyIncome: number
): RiskGradientPoint[] => {
  const loanAmount = totalPrice * (1 - downPaymentRatio / 100);
  const monthlyPayment = loanAmount * 10000 * (interestRate / 100 / 12) * 
    Math.pow(1 + interestRate / 100 / 12, 30 * 12) / 
    (Math.pow(1 + interestRate / 100 / 12, 30 * 12) - 1);
  
  const dti = monthlyPayment / monthlyIncome;
  const ltv = (loanAmount / totalPrice) * 100;
  
  return [
    { label: 'DTI', value: Math.round(dti * 100), color: dti < 0.35 ? '#10b981' : dti < 0.5 ? '#f59e0b' : '#ef4444' },
    { label: 'LTV', value: Math.round(ltv), color: ltv < 70 ? '#10b981' : ltv < 80 ? '#f59e0b' : '#ef4444' },
    { label: '综合风险', value: Math.round((dti * 100 + ltv) / 2), color: '#6366f1' }
  ];
};

// Cash Flow Breathing Data
export interface CashFlowBreathing {
  monthlyIncome: number;
  monthlyPayment: number;
  discretionary: number;
  breathingRoom: number; // 0-100
  status: 'healthy' | 'tight' | 'critical';
}

export const calculateCashFlowBreathing = (
  totalPrice: number,
  downPaymentRatio: number,
  interestRate: number,
  loanTerm: number,
  monthlyIncome: number
): CashFlowBreathing => {
  const loanAmount = totalPrice * (1 - downPaymentRatio / 100);
  const monthlyPayment = loanAmount * 10000 * (interestRate / 100 / 12) * 
    Math.pow(1 + interestRate / 100 / 12, loanTerm * 12) / 
    (Math.pow(1 + interestRate / 100 / 12, loanTerm * 12) - 1);
  
  const discretionary = monthlyIncome - monthlyPayment;
  const breathingRoom = Math.max(0, Math.min(100, (discretionary / monthlyIncome) * 100));
  
  let status: 'healthy' | 'tight' | 'critical';
  if (breathingRoom > 50) status = 'healthy';
  else if (breathingRoom > 30) status = 'tight';
  else status = 'critical';
  
  return {
    monthlyIncome,
    monthlyPayment,
    discretionary,
    breathingRoom: Math.round(breathingRoom),
    status
  };
};

// Regret Heatmap Data
export interface RegretHeatmapCell {
  price: number;
  rate: number;
  regretScore: number; // 0-100, higher = more regret
}

export const calculateRegretHeatmap = (
  basePrice: number,
  baseRate: number,
  downPaymentRatio: number,
  monthlyIncome: number
): RegretHeatmapCell[] => {
  const heatmap: RegretHeatmapCell[] = [];
  
  // Price range: -20% to +20%
  const priceSteps = [-20, -10, 0, 10, 20];
  // Rate range: -1% to +1%
  const rateSteps = [-1, -0.5, 0, 0.5, 1];
  
  for (const priceOffset of priceSteps) {
    for (const rateOffset of rateSteps) {
      const price = basePrice * (1 + priceOffset / 100);
      const rate = baseRate + rateOffset;
      
      const loanAmount = price * (1 - downPaymentRatio / 100);
      const monthlyPayment = loanAmount * 10000 * (rate / 100 / 12) * 
        Math.pow(1 + rate / 100 / 12, 30 * 12) / 
        (Math.pow(1 + rate / 100 / 12, 30 * 12) - 1);
      
      const dti = monthlyPayment / monthlyIncome;
      
      // Regret factors:
      // 1. High DTI = regret
      // 2. Buying at high price when could be lower = regret
      // 3. High rate when could be lower = regret
      let regretScore = 0;
      
      if (dti > 0.5) regretScore += 40;
      else if (dti > 0.35) regretScore += 20;
      
      if (priceOffset > 0) regretScore += priceOffset; // Overpaying
      if (rateOffset > 0) regretScore += rateOffset * 10; // High rate
      
      heatmap.push({
        price: Math.round(price),
        rate: Math.round(rate * 100) / 100,
        regretScore: Math.min(100, Math.max(0, Math.round(regretScore)))
      });
    }
  }
  
  return heatmap;
};
