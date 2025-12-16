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

export interface RiskGradientStart {
  category: string;
  value: number;
  threshold: number;
  status: 'low' | 'medium' | 'high';
  label: string;
  color: string;
}

// Calculate Risk Gradient Data
export const calculateRiskGradient = (params: InvestmentParams): RiskGradientStart[] => {
  const annualIncome = (params.familyMonthlyIncome || 30000) * 12;
  const loanAmount = (params.totalPrice || 200) * 0.7 * 10000;
  const monthlyPayment = loanAmount * 0.035 / 12; // Simplified
  const dti = monthlyPayment / (params.familyMonthlyIncome || 30000);
  
  // Advanced parameters
  const maxDti = (params.maxPaymentRatio || 35) / 100;
  const emergencyMonths = params.emergencyReserves || 6;
  const rateHike = (params.rateHikeAssumption || 1.0) / 100;
  
  // Stress test calculations
  const stressedMonthlyPayment = loanAmount * (0.035 + rateHike) / 12;
  const stressedDti = stressedMonthlyPayment / (params.familyMonthlyIncome || 30000);

  const getStatusColor = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low': return '#10b981'; // Emerald 500
      case 'medium': return '#f59e0b'; // Amber 500
      case 'high': return '#ef4444'; // Red 500
    }
  };

  const dtiStatus = dti > 0.5 ? 'high' : dti > 0.3 ? 'medium' : 'low';
  const stressStatus = stressedDti > 0.6 ? 'high' : stressedDti > 0.45 ? 'medium' : 'low';
  const reserveStatus = emergencyMonths < 3 ? 'high' : emergencyMonths < 6 ? 'medium' : 'low';

  const risks: RiskGradientStart[] = [
    {
      category: 'DTI (月供收入比)',
      value: Math.min(100, dti * 100),
      threshold: maxDti * 100, // User defined threshold
      status: dtiStatus,
      label: `${(dti * 100).toFixed(1)}%`,
      color: getStatusColor(dtiStatus)
    },
    {
      category: 'Stress Test (加息压力)',
      value: Math.min(100, stressedDti * 100),
      threshold: 50,
      status: stressStatus,
      label: `+${(rateHike * 100).toFixed(1)}% -> ${(stressedDti * 100).toFixed(1)}%`,
      color: getStatusColor(stressStatus)
    },
    {
      category: 'Anti-Fragility (反脆弱)',
      value: Math.min(100, (1 - emergencyMonths / 24) * 100), // Lower reserve = higher risk
      threshold: 75, // 6 months reserve corresponds to 25% risk score
      status: reserveStatus,
      label: `${emergencyMonths}个月储备`,
      color: getStatusColor(reserveStatus)
    }
  ];

  return risks;
};

// Cash Flow Breathing Data
export interface CashFlowBreathing {
  monthlyIncome: number;
  monthlyPayment: number;
  discretionary: number;
  breathingRoom: number; // 0-100
  status: 'healthy' | 'tight' | 'critical';
}

export const calculateCashFlowBreathing = (params: InvestmentParams): CashFlowBreathing => {
  const monthlyIncome = params.familyMonthlyIncome || 30000;
  // Calculate monthly payment based on loan details
  const loanAmount = (params.totalPrice || 200) * (1 - (params.downPaymentRatio || 30) / 100) * 10000;
  const rate = (params.interestRate || 3.5) / 100 / 12;
  const terms = (params.loanTerm || 30) * 12;
  
  const monthlyPayment = loanAmount * rate * Math.pow(1 + rate, terms) / (Math.pow(1 + rate, terms) - 1);
  
  // Advanced parameters impact
  const fluctuation = (params.incomeFluctuation || 10) / 100;
  const worstCaseIncome = monthlyIncome * (1 - fluctuation);
  const minExpenses = params.minLivingExpenses || 5000;
  
  const discretionary = monthlyIncome - monthlyPayment;
  // Breathing room calculation: (worstCaseIncome - monthlyPayment - minExpenses) / minExpenses
  // Positive means survival, negative means deficit
  const safetyMargin = worstCaseIncome - monthlyPayment - minExpenses;
  
  // Normalize breathing room to 0-100 score for visualization
  // 0 = Deficit (Suffocating), 100 = Double expenses coverage (Easy breathing)
  const breathingRoom = Math.max(0, Math.min(100, ((safetyMargin + minExpenses) / (minExpenses * 2)) * 100));

  let status: 'healthy' | 'tight' | 'critical';
  if (safetyMargin > 2000) status = 'healthy';
  else if (safetyMargin >= 0) status = 'tight';
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

export const calculateRegretHeatmap = (params: InvestmentParams): RegretHeatmapCell[] => {
  const basePrice = params.totalPrice || 200;
  const baseRate = params.interestRate || 3.5;
  const downPaymentRatio = params.downPaymentRatio || 30;
  const monthlyIncome = params.familyMonthlyIncome || 30000;
  
  // Advanced params
  const maxDtiLimit = (params.maxPaymentRatio || 50) / 100;
  const fluctuation = (params.incomeFluctuation || 0) / 100;
  // Effective income for regret calculation is conservative income
  const effectiveIncome = monthlyIncome * (1 - fluctuation);
  const futureRateRisk = (params.rateHikeAssumption || 0) / 100;

  const heatmap: RegretHeatmapCell[] = [];
  
  // Price range: -20% to +20%
  const priceSteps = [-20, -10, 0, 10, 20];
  // Rate range: -1% to +1%
  const rateSteps = [-1, -0.5, 0, 0.5, 1];
  
  for (const priceOffset of priceSteps) {
    for (const rateOffset of rateSteps) {
      const price = basePrice * (1 + priceOffset / 100);
      const rate = Math.max(0.1, baseRate + rateOffset);
      
      const loanAmount = price * (1 - downPaymentRatio / 100);
      // Monthly pay
      const monthlyPayment = loanAmount * 10000 * (rate / 100 / 12) * 
        Math.pow(1 + rate / 100 / 12, 30 * 12) / 
        (Math.pow(1 + rate / 100 / 12, 30 * 12) - 1);
      
      // Stress test payment (if rate hikes happen)
      const stressedRate = rate + futureRateRisk * 100;
      const stressedPayment = loanAmount * 10000 * (stressedRate / 100 / 12) * 
        Math.pow(1 + stressedRate / 100 / 12, 30 * 12) / 
        (Math.pow(1 + stressedRate / 100 / 12, 30 * 12) - 1);

      const dti = monthlyPayment / effectiveIncome;
      const stressedDti = stressedPayment / effectiveIncome;
      
      // Regret factors:
      // 1. DTI exceeds personal max limit -> HIGH REGRET
      // 2. Stressed DTI exceeds catastrophic limit (e.g. 60%) -> HIGH REGRET
      // 3. Overpaying price/rate -> Moderate regret
      
      let regretScore = 0;
      
      // Base financial pressure
      if (dti > maxDtiLimit) regretScore += 50 + (dti - maxDtiLimit) * 100; // Immediate dealbreaker
      else if (dti > maxDtiLimit * 0.8) regretScore += 20; // High pressure
      
      // Future risk pressure
      if (stressedDti > 0.6) regretScore += 30; // Dangerous if rates rise
      
      // Market regret (buying high / high rate)
      if (priceOffset > 0) regretScore += priceOffset * 0.5; 
      if (rateOffset > 0) regretScore += rateOffset * 5; 
      
      // Bonus: If DTI is very low, reduce regret (safety comfort)
      if (dti < 0.2) regretScore -= 10;
      
      heatmap.push({
        price: Math.round(price),
        rate: Math.round(rate * 100) / 100,
        regretScore: Math.min(100, Math.max(0, Math.round(regretScore)))
      });
    }
  }
  
  return heatmap;
};
