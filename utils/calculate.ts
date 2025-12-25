

import { InvestmentParams, RepaymentMethod, MonthlyPayment, CalculationResult, PrepaymentStrategy, StrategyResult, PrepaymentComparisonResult, StressTestResult, LoanType, AssetComparison, PurchaseScenario, LocationFactors, LocationScore, AssetComparisonItem, KnowledgeCardData, TaxParams, TaxResult, AppreciationPredictorParams, AppreciationPrediction, MonthlyCashFlow, CustomStressTestParams, BuyerType, BuyerProfile, LiquidityParams, LiquidityAnalysis, MarketRadarData, LifeDragMetrics } from '../types';

// Core Amortization Calculator
// Returns the full schedule and summary stats
const calculateAmortization = (
  loanAmountWan: number, // 万元
  monthsTotal: number,
  ratePercent: number,
  method: RepaymentMethod,
  prepayParams?: { month: number; amountWan: number; strategy: PrepaymentStrategy }
): { 
  schedule: MonthlyPayment[]; 
  totalInterest: number; 
  totalPayment: number; 
  payoffMonth: number;
  firstPaymentAfterPrepay: number;
} => {
  // Safety checks
  if (monthsTotal <= 0 || loanAmountWan < 0) {
     return { schedule: [], totalInterest: 0, totalPayment: 0, payoffMonth: 0, firstPaymentAfterPrepay: 0 };
  }
  
  // Max term cap to prevent browser hang
  if (monthsTotal > 1200) monthsTotal = 1200; // 100 years max

  const principal = loanAmountWan * 10000;
  const monthlyRate = ratePercent > 0 ? ratePercent / 100 / 12 : 0;
  const schedule: MonthlyPayment[] = [];
  
  let remaining = principal;
  let totalInterest = 0;
  let totalPayment = 0;
  let payoffMonth = monthsTotal;
  
  // Initial Payment Calculation
  let currentMonthlyPayment = 0;
  let fixedMonthlyPrincipal = 0;

  if (method === RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST) {
    if (monthlyRate > 0) {
      currentMonthlyPayment = (remaining * monthlyRate * Math.pow(1 + monthlyRate, monthsTotal)) / (Math.pow(1 + monthlyRate, monthsTotal) - 1);
    } else {
      currentMonthlyPayment = remaining / monthsTotal;
    }
  } else {
    fixedMonthlyPrincipal = remaining / monthsTotal;
  }

  // Loop through max possible months (add buffer for float issues)
  for (let i = 1; i <= monthsTotal + 360; i++) {
    if (remaining <= 1) {
      payoffMonth = i - 1;
      break;
    }

    // --- Prepayment Logic Trigger ---
    let extraPrincipal = 0;
    let isPrepaymentMonth = false;
    
    if (prepayParams && i === prepayParams.month) {
      extraPrincipal = prepayParams.amountWan * 10000;
      isPrepaymentMonth = true;
    }

    // --- Standard Payment Calc ---
    const interest = remaining * monthlyRate;
    let principalPay = 0;
    let payment = 0;

    if (method === RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST) {
      payment = currentMonthlyPayment;
      // Last month adjustment
      if (remaining * (1 + monthlyRate) < payment) {
          payment = remaining * (1 + monthlyRate);
      }
      principalPay = payment - interest;
    } else {
      principalPay = fixedMonthlyPrincipal;
      payment = principalPay + interest;
    }

    // Cap principal pay if it exceeds remaining
    if (principalPay > remaining) {
      principalPay = remaining;
      payment = principalPay + interest;
    }

    // --- Apply Prepayment ---
    // If we prepay, we add it to this month's principal reduction
    let effectivePrincipalReduction = principalPay + extraPrincipal;
    
    // Check if prepay exceeds loan
    if (effectivePrincipalReduction >= remaining) {
       effectivePrincipalReduction = remaining;
       extraPrincipal = remaining - principalPay; // Adjust extra to fit
       if (extraPrincipal < 0) extraPrincipal = 0;
       payment = principalPay + interest + extraPrincipal; 
       remaining = 0;
    } else {
       remaining -= effectivePrincipalReduction;
    }

    schedule.push({
      monthIndex: i,
      payment: payment,
      principal: principalPay + extraPrincipal,
      interest: interest,
      remainingPrincipal: remaining / 10000,
      isPrepaymentMonth
    });

    totalInterest += interest;
    totalPayment += payment;

    // --- Re-Amortization Logic after Prepayment ---
    if (isPrepaymentMonth && remaining > 0) {
      const remainingMonths = monthsTotal - i;
      
      if (prepayParams.strategy === PrepaymentStrategy.REDUCE_PAYMENT && remainingMonths > 0) {
        // Strategy: Reduce Monthly Payment, Keep Term
        if (method === RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST) {
           if (monthlyRate > 0) {
             currentMonthlyPayment = (remaining * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
           } else {
             currentMonthlyPayment = remaining / remainingMonths;
           }
        } else {
           fixedMonthlyPrincipal = remaining / remainingMonths;
        }
      } else if (prepayParams.strategy === PrepaymentStrategy.REDUCE_TERM) {
         // Strategy: Reduce Term. Logic handles itself by keeping payment same and paying off faster.
      }
    }
  }

  return {
    schedule,
    totalInterest,
    totalPayment,
    payoffMonth,
    firstPaymentAfterPrepay: prepayParams && schedule.length >= prepayParams.month + 1 ? schedule[prepayParams.month].payment : (schedule.length > 0 ? schedule[schedule.length-1].payment : 0)
  };
};

const mergeSchedules = (s1: MonthlyPayment[], s2: MonthlyPayment[]): MonthlyPayment[] => {
  const length = Math.max(s1.length, s2.length);
  const merged: MonthlyPayment[] = [];
  for (let i = 0; i < length; i++) {
     const m1 = s1[i] || { payment: 0, principal: 0, interest: 0, remainingPrincipal: 0 };
     const m2 = s2[i] || { payment: 0, principal: 0, interest: 0, remainingPrincipal: 0 };
     merged.push({
        monthIndex: i + 1,
        payment: m1.payment + m2.payment,
        principal: m1.principal + m2.principal,
        interest: m1.interest + m2.interest,
        remainingPrincipal: m1.remainingPrincipal + m2.remainingPrincipal,
        isPrepaymentMonth: s1[i]?.isPrepaymentMonth || s2[i]?.isPrepaymentMonth
     });
  }
  return merged;
};

// Helper to aggregate monthly data into years
export const aggregateYearlyPaymentData = (monthlyData: MonthlyPayment[], t?: any) => {
    if (!monthlyData || monthlyData.length === 0) return [];
    
    const yearly = [];
    let currentYear = 1;
    let yearPrincipal = 0;
    let yearInterest = 0;
    
    for (let i = 0; i < monthlyData.length; i++) {
        yearPrincipal += monthlyData[i].principal;
        yearInterest += monthlyData[i].interest;
        
        // Push if it's the last month of a year OR the last available data point
        if ((i + 1) % 12 === 0 || i === monthlyData.length - 1) {
            const label = t ? t.axisYear.replace('{v}', currentYear.toString()) : `第${currentYear}年`;
            yearly.push({
                year: currentYear,
                label: label,
                payment: yearPrincipal + yearInterest,
                principal: yearPrincipal,
                interest: yearInterest,
                remainingPrincipal: monthlyData[i].remainingPrincipal
            });
            yearPrincipal = 0;
            yearInterest = 0;
            currentYear++;
        }
    }
    return yearly;
};

// Helper for Location Scoring
export const calculateLocationScore = (factors: LocationFactors, t: any): LocationScore => {
  // Weights: Transport 30%, Education 25%, Commercial 20%, Environment 15%, Potential 10%
  // Score range: 0-100
  const score = 
    factors.transport * 3.0 + 
    factors.education * 2.5 + 
    factors.commercial * 2.0 + 
    factors.environment * 1.5 + 
    factors.potential * 1.0;
  
  let level = 'C';
  let advice = '';

  if (score >= 85) {
    level = 'S';
    advice = t.adviceS;
  } else if (score >= 70) {
    level = 'A';
    advice = t.adviceA;
  } else if (score >= 50) {
    level = 'B';
    advice = t.adviceB;
  } else {
    level = 'C';
    advice = t.adviceC;
  }

  return { total: score, level, advice, factors };
};


export const calculateInvestment = (params: InvestmentParams, t: any): CalculationResult => {
  const loanAmount = params.totalPrice * (100 - params.downPaymentRatio) / 100;
  const downPayment = params.totalPrice * params.downPaymentRatio / 100;
  const totalMonths = params.loanTerm * 12;

  // --- Initial Costs Calculation (Hidden Costs) ---
  const deedTax = params.totalPrice * (params.deedTaxRate || 0) / 100;
  const agencyFee = params.totalPrice * (params.agencyFeeRatio || 0) / 100;
  const renovation = params.renovationCost || 0;
  const initialTotalCash = downPayment + deedTax + agencyFee + renovation;

  // --- Loan Splitting Logic for Combination Loans ---
  let commLoan = 0;
  let provLoan = 0;
  let commRate = params.interestRate;
  let provRate = params.providentInterestRate || 0;

  if (params.loanType === LoanType.COMMERCIAL) {
    commLoan = loanAmount;
    provLoan = 0;
  } else if (params.loanType === LoanType.PROVIDENT) {
    commLoan = 0;
    provLoan = loanAmount;
  } else {
    // Combination
    provLoan = Math.min(loanAmount, params.providentQuota);
    commLoan = Math.max(0, loanAmount - provLoan);
  }

  // --- Prepayment Params Setup ---
  const basePrepayParams = params.enablePrepayment ? {
    month: params.prepaymentYear * 12,
    amountWan: params.prepaymentAmount,
    strategy: params.prepaymentStrategy
  } : undefined;

  let commPrepay = undefined;
  let provPrepay = undefined;

  if (basePrepayParams) {
    if (commLoan > 0) {
      commPrepay = basePrepayParams;
    } else {
      provPrepay = basePrepayParams;
    }
  }

  // --- Run Amortization Calculations ---
  const commRes = calculateAmortization(commLoan, totalMonths, commRate, params.method, commPrepay);
  const provRes = calculateAmortization(provLoan, totalMonths, provRate, params.method, provPrepay);

  const mergedSchedule = mergeSchedules(commRes.schedule, provRes.schedule);
  const totalInterest = commRes.totalInterest + provRes.totalInterest;
  const totalRepayment = commRes.totalPayment + provRes.totalPayment;
  const firstMonthPayment = mergedSchedule.length > 0 ? mergedSchedule[0].payment : 0;
  
  const mainResult = {
    schedule: mergedSchedule,
    totalInterest,
    totalRepayment,
    payoffMonth: Math.max(commRes.payoffMonth, provRes.payoffMonth),
  };
  
  const initialCosts = {
    downPayment,
    deedTax,
    agencyFee,
    renovation,
    total: initialTotalCash
  };

  if (mainResult.schedule.length === 0 && loanAmount > 0) {
      // Empty Fallback
      return {
        loanAmount, downPayment, monthlyPayment: 0, monthlyPaymentText: '0', totalInterest: 0, totalRepayment: 0, monthlyData: [], 
        initialCosts,
        cashOnCashReturn: 0, comprehensiveReturn: 0, annualizedReturn: 0, monthlyCoverageRatio: 0, netAnnualRent: 0, 
        projectedAppreciation: 0, totalRevenue: 0, totalInterestPaidInHolding: 0, riskScore: 0, riskLevel: 'Low', 
        cashFlowRisk: 0, leverageRisk: 0, breakEvenYear: null, yearlyData: [],
        assetComparison: { houseNetWorth: 0, stockNetWorth: 0, difference: 0, winner: 'Stock', housePros: [], stockPros: [], qualitative: [], knowledgeCards: [] },
        monthlyCashFlow: [],
        totalMonthlyDebt: 0, dtiRatio: 0
      };
  }

  // --- Prepayment Comparison Simulation ---
  let comparisonResult: PrepaymentComparisonResult | undefined = undefined;
  
  if (params.enablePrepayment) {
    const runSim = (strategy?: PrepaymentStrategy, amount?: number) => {
        const simPrepay = amount !== undefined && strategy ? { month: params.prepaymentYear * 12, amountWan: amount, strategy } : undefined;
        let cP = undefined; 
        let pP = undefined;
        if (simPrepay) {
           if (commLoan > 0) cP = simPrepay;
           else pP = simPrepay;
        }
        const cR = calculateAmortization(commLoan, totalMonths, commRate, params.method, cP);
        const pR = calculateAmortization(provLoan, totalMonths, provRate, params.method, pP);
        const sched = mergeSchedules(cR.schedule, pR.schedule);
        return {
           totalInterest: cR.totalInterest + pR.totalInterest,
           payoffMonth: Math.max(cR.payoffMonth, pR.payoffMonth),
           newPayment: sched.length > params.prepaymentYear*12 ? sched[params.prepaymentYear*12].payment : 0
        };
    };

    const base = runSim(undefined, undefined);
    const reducePay = runSim(PrepaymentStrategy.REDUCE_PAYMENT, params.prepaymentAmount);
    const reduceTerm = runSim(PrepaymentStrategy.REDUCE_TERM, params.prepaymentAmount);

    const formatStrat = (res: typeof base, name: string, desc: string): StrategyResult => ({
      strategyName: name,
      totalInterest: res.totalInterest,
      interestSaved: base.totalInterest - res.totalInterest,
      payoffMonths: res.payoffMonth,
      newMonthlyPayment: res.newPayment,
      description: desc
    });

    comparisonResult = {
      noPrepayment: formatStrat(base, t.stratNoPrepay, t.stratBase),
      reducePayment: formatStrat(reducePay, t.stratReducePay, t.stratReducePayDesc),
      reduceTerm: formatStrat(reduceTerm, t.stratReduceTerm, t.stratReduceTermDesc),
      recommendation: base.totalInterest - reduceTerm.totalInterest > base.totalInterest - reducePay.totalInterest 
        ? t.recReduceTerm 
        : t.recCashFlow
    };
  }

  // --- Opportunity Cost Logic (Financial Investment Simulation) ---
  // Use investment type to adjust return rate if custom not specified
  let effectiveReturnRate = params.alternativeReturnRate || 4.0;
  if (params.investmentType && params.investmentType !== 'custom') {
    switch (params.investmentType) {
      case 'conservative': effectiveReturnRate = Math.min(effectiveReturnRate, 4); break;
      case 'balanced': effectiveReturnRate = Math.max(5, Math.min(effectiveReturnRate, 8)); break;
      case 'growth': effectiveReturnRate = Math.max(8, Math.min(effectiveReturnRate, 12)); break;
      case 'aggressive': effectiveReturnRate = Math.max(12, Math.min(effectiveReturnRate, 20)); break;
    }
  }
  
  // Apply investment tax if specified
  const investmentTaxRate = (params.investmentTaxRate || 0) / 100;
  const afterTaxReturnRate = effectiveReturnRate * (1 - investmentTaxRate);
  
  const alternativeRateMonthly = Math.pow(1 + afterTaxReturnRate / 100, 1/12) - 1;
  const inflationRate = (params.inflationRate || 0) / 100;
  const riskFreeRate = (params.riskFreeRate || 2.5) / 100; // For Sharpe-like calculations
  
  // Option B starts with Total Initial Cash invested (Down + Tax + Fees + Reno)
  let stockPortfolio = initialTotalCash * 10000; 
  
  const yearlyData = [];
  let cumulativeRent = 0;
  let totalInterestPaidInHolding = 0;
  let totalPrincipalPaidInHolding = 0;
  
  let currentStockValue = stockPortfolio;
  const annualHoldingCostRatio = params.holdingCostRatio || 0;
  const annualMaintenanceCost = (params.propertyMaintenanceCost || 0) * 10000;
  
  for (let year = 1; year <= params.holdingYears; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = year * 12;
    
    // Yearly Params
    const appreciationFactorStart = Math.pow(1 + params.appreciationRate / 100, year - 1);
    const rentAppreciationFactor = Math.pow(1 + (params.rentAppreciationRate || 0) / 100, year - 1);
    const propertyValueStart = params.totalPrice * appreciationFactorStart; 
    const annualRentEffective = params.monthlyRent * 12 * rentAppreciationFactor * (1 - (params.vacancyRate || 0)/100);
    const annualHoldingCost = propertyValueStart * 10000 * (annualHoldingCostRatio / 100);
    const netAnnualRent = annualRentEffective - annualHoldingCost - annualMaintenanceCost; 
    
    cumulativeRent += netAnnualRent;

    const propertyValueEnd = params.totalPrice * Math.pow(1 + params.appreciationRate / 100, year);
    
    let remainingLoan = 0;
    let interestThisYear = 0;
    let principalThisYear = 0;

    const monthlyHoldingCost = annualHoldingCost / 12;
    const monthlyMaintenanceCost = annualMaintenanceCost / 12;
    const monthlyRentIncome = annualRentEffective / 12;

    for (let m = startMonth; m < endMonth; m++) {
      let payment = 0;
      if (m < mainResult.schedule.length) {
        payment = mainResult.schedule[m].payment;
        interestThisYear += mainResult.schedule[m].interest;
        principalThisYear += mainResult.schedule[m].principal;
        remainingLoan = mainResult.schedule[m].remainingPrincipal * 10000;
      }

      // Cash Outflow for House = Payment + Holding + Maintenance - Rent
      // If result > 0, you pay money. Stock scenario also invests this money.
      // If result < 0, you gain money. Stock scenario withdraws or we treat as opportunity cost gained in house.
      // We add (Payment + Holding + Maintenance + Prepay - Rent) to Stock Portfolio to equalize out-of-pocket cash.
      
      let extraPrepay = 0;
      if (params.enablePrepayment && params.prepaymentYear * 12 === m) {
         extraPrepay = params.prepaymentAmount * 10000;
      }

      currentStockValue = currentStockValue * (1 + alternativeRateMonthly);
      const cashOutflowForHouse = payment + monthlyHoldingCost + monthlyMaintenanceCost + extraPrepay - monthlyRentIncome;
      currentStockValue += cashOutflowForHouse; 
    }

    totalInterestPaidInHolding += interestThisYear;
    totalPrincipalPaidInHolding += principalThisYear;

    const totalReturnHouse = (cumulativeRent + (propertyValueEnd * 10000 - params.totalPrice * 10000) - totalInterestPaidInHolding) / 10000;

    // Real Value Calculation (Discounting for Inflation)
    const discountFactor = 1 / Math.pow(1 + inflationRate, year);
    const realPropertyValue = propertyValueEnd * discountFactor;
    const realStockNetWorth = (currentStockValue / 10000) * discountFactor;

    yearlyData.push({
      year,
      cumulativeRent: cumulativeRent / 10000,
      propertyValue: propertyValueEnd,
      realPropertyValue, 
      totalReturn: totalReturnHouse,
      remainingLoan: remainingLoan / 10000,
      interestPaidYearly: interestThisYear / 10000,
      principalPaidYearly: principalThisYear / 10000,
      stockNetWorth: currentStockValue / 10000,
      realStockNetWorth,
    });
  }

  // --- Summary Metrics ---
  const finalYearData = yearlyData[yearlyData.length - 1];
  const propertyValueEnd = finalYearData ? finalYearData.propertyValue : params.totalPrice;
  // Total Cash Investment uses initialTotalCash (Down + Hidden Costs) + Prepayment
  const totalInvestment = initialTotalCash + (params.enablePrepayment ? params.prepaymentAmount : 0);
  
  const totalRevenue = (propertyValueEnd - params.totalPrice) + (cumulativeRent / 10000) - (totalInterestPaidInHolding / 10000) - (initialTotalCash - downPayment); 
  // Note: We subtract (Tax + Fees + Reno) from Revenue because they are sunk costs not included in Property Price appreciation.
  
  const cashOnCashReturn = totalInvestment > 0 ? ((yearlyData[0]?.cumulativeRent || 0) * 10000 - (firstMonthPayment * 12)) / (totalInvestment * 10000) * 100 : 0;
  
  const comprehensiveReturn = totalInvestment > 0 ? (totalRevenue / totalInvestment) * 100 : 0;
  const annualizedReturn = params.holdingYears > 0 ? (Math.pow(1 + comprehensiveReturn / 100, 1 / params.holdingYears) - 1) * 100 : 0;
  const monthlyCoverageRatio = firstMonthPayment > 0 ? (params.monthlyRent) / firstMonthPayment : 0;

  // Risk Calc
  const monthlyIncome = params.familyMonthlyIncome;
  const totalMonthlyDebt = firstMonthPayment + (params.existingMonthlyDebt || 0); // Include existing debt
  const dti = monthlyIncome > 0 ? totalMonthlyDebt / monthlyIncome : 0; 
  
  let riskScore = 30; 
  // DTI impact
  if (dti > 0.6) riskScore += 50;
  else if (dti > 0.5) riskScore += 40;
  else if (dti > 0.4) riskScore += 20;

  // Coverage Impact
  if (monthlyCoverageRatio < 0.8) riskScore += 20;
  else if (monthlyCoverageRatio < 1.0) riskScore += 10;
  
  // LTV Impact
  const ltv = params.totalPrice > 0 ? loanAmount / params.totalPrice : 0;
  if (ltv > 0.7) riskScore += 10;

  // Multiple Property Penalty
  if (params.existingPropertyCount > 0 || params.purchaseScenario === PurchaseScenario.INVESTMENT) {
      riskScore += 10; // Extra risk for leverage on multiple properties
  }

  let riskLevel: 'Low'|'Medium'|'High' = 'Low';
  if (riskScore > 70) riskLevel = 'High';
  else if (riskScore > 40) riskLevel = 'Medium';

  const houseEquity = propertyValueEnd - (finalYearData?.remainingLoan || 0);
  const stockEquity = finalYearData?.stockNetWorth || initialTotalCash;

  const housePros = [t.housePro1, t.housePro2, t.housePro3];
  const stockPros = [t.stockPro1, t.stockPro2, t.stockPro3];
  if (houseEquity > stockEquity) {
     housePros.unshift(t.netWorthMore.replace('{amount}', (houseEquity - stockEquity).toFixed(1)));
  } else {
     stockPros.unshift(t.netWorthMore.replace('{amount}', (stockEquity - houseEquity).toFixed(1)));
  }

  // Qualitative Analysis Data
  const qualitativeData: AssetComparisonItem[] = [
    { dimension: t.dimLiquidity, houseValue: t.valLowMonths, houseScore: 1, stockValue: t.valHighT1, stockScore: 5 },
    { dimension: t.dimBarrier, houseValue: t.valHighDown, houseScore: 2, stockValue: t.valLow100, stockScore: 5 },
    { dimension: t.dimLeverage, houseValue: t.valStrongLev, houseScore: 5, stockValue: t.valWeakLev, stockScore: 2 },
    { dimension: t.dimEffort, houseValue: t.valHighEffort, houseScore: 2, stockValue: t.valLowEffort, stockScore: 5 },
    { dimension: t.dimInflation, houseValue: t.valStrongInf, houseScore: 5, stockValue: t.valMedInf, stockScore: 3 },
    { dimension: t.dimVolatility || '波动性 (Volatility)', houseValue: t.valLowVol || '低 (年波动5-10%)', houseScore: 4, stockValue: t.valHighVol || '高 (年波动15-30%)', stockScore: 2 },
    { dimension: t.dimTax || '税务优势 (Tax)', houseValue: t.valTaxHouse || '契税+持有成本', houseScore: 3, stockValue: t.valTaxStock || '资本利得税', stockScore: 3 },
    { dimension: t.dimPsychology || '心理安全 (Psychology)', houseValue: t.valPsychHouse || '强 (实物资产)', houseScore: 5, stockValue: t.valPsychStock || '弱 (账面数字)', stockScore: 2 },
    { dimension: t.dimDiversify || '分散能力 (Diversify)', houseValue: t.valDivHouse || '弱 (单一资产)', houseScore: 2, stockValue: t.valDivStock || '强 (可分散)', stockScore: 5 },
    { dimension: t.dimPassive || '被动收入 (Passive)', houseValue: t.valPassHouse || '租金收入', houseScore: 4, stockValue: t.valPassStock || '股息分红', stockScore: 3 },
    { dimension: t.dimInherit || '传承价值 (Inherit)', houseValue: t.valInhHouse || '强 (实物遗产)', houseScore: 5, stockValue: t.valInhStock || '中 (账户继承)', stockScore: 3 },
    { dimension: t.dimExit || '退出难度 (Exit)', houseValue: t.valExitHouse || '高 (交易周期长)', houseScore: 2, stockValue: t.valExitStock || '低 (随时卖出)', stockScore: 5 },
    { dimension: t.dimGrowth || '增长潜力 (Growth)', houseValue: t.valGrowthHouse || '中 (跟随GDP)', houseScore: 3, stockValue: t.valGrowthStock || '高 (可选成长股)', stockScore: 4 },
    { dimension: t.dimManage || '管理复杂度 (Manage)', houseValue: t.valManageHouse || '高 (租客/维修)', houseScore: 2, stockValue: t.valManageStock || '低 (被动持有)', stockScore: 5 },
  ];

  const knowledgeCards: KnowledgeCardData[] = [
    { title: t.cardOpportunity, content: t.cardOpportunityDesc, icon: 'ArrowRightLeft' },
    { title: t.cardCompound, content: t.cardCompoundDesc, icon: 'TrendingUp' },
    { title: t.cardLiquidity, content: t.cardLiquidityDesc, icon: 'AlertTriangle' },
    { title: t.cardREITs, content: t.cardREITsDesc, icon: 'Building2' },
    { title: t.cardDCA, content: t.cardDCADesc, icon: 'BarChart3' },
  ];

  // 计算月度现金流（12个月）
  const monthlyCashFlow: MonthlyCashFlow[] = [];
  const monthlyRentIncome = params.monthlyRent * (1 - params.vacancyRate / 100); // 考虑空置率，单位：元
  // totalPrice 是万元，holdingCostRatio 是百分比，propertyMaintenanceCost 也是万元，需要乘以10000转换为元
  const monthlyHoldingCost = (params.totalPrice * 10000 * params.holdingCostRatio / 100 / 12) + (params.propertyMaintenanceCost * 10000 / 12);
  
  for (let month = 1; month <= 12; month++) {
    const rentalIncome = monthlyRentIncome;
    const mortgagePayment = firstMonthPayment;
    const holdingCost = monthlyHoldingCost;
    const netCashFlow = rentalIncome - mortgagePayment - holdingCost;
    
    monthlyCashFlow.push({
      month,
      rentalIncome,
      mortgagePayment,
      holdingCost,
      netCashFlow
    });
  }

  return {
    loanAmount,
    downPayment,
    monthlyPayment: firstMonthPayment,
    monthlyPaymentText: firstMonthPayment.toFixed(2),
    totalInterest,
    totalRepayment,
    monthlyData: mergedSchedule,
    initialCosts,
    prepaymentComparison: comparisonResult,
    cashOnCashReturn,
    comprehensiveReturn,
    annualizedReturn,
    monthlyCoverageRatio,
    netAnnualRent: cumulativeRent / params.holdingYears / 10000,
    projectedAppreciation: propertyValueEnd - params.totalPrice,
    totalRevenue,
    totalInterestPaidInHolding: totalInterestPaidInHolding / 10000,
    riskScore: Math.min(100, riskScore),
    riskLevel,
    cashFlowRisk: monthlyCoverageRatio > 0 ? Math.min(100, (1/monthlyCoverageRatio) * 50) : 100,
    leverageRisk: Math.min(100, ltv * 100),
    breakEvenYear: yearlyData.find(y => y.totalReturn > 0)?.year || null,
    assetComparison: {
       houseNetWorth: houseEquity,
       stockNetWorth: stockEquity,
       difference: houseEquity - stockEquity,
       winner: houseEquity > stockEquity ? 'House' : 'Stock',
       housePros,
       stockPros,
       qualitative: qualitativeData,
       knowledgeCards: knowledgeCards
    },
    yearlyData,
    monthlyCashFlow,
    totalMonthlyDebt,
    dtiRatio: dti
  };
};

export const calculateStressTest = (params: InvestmentParams, t: any, customScenarios: CustomStressTestParams[] = []): StressTestResult[] => {
  const base = calculateInvestment(params, t);
  
  const scenarios = [
    // 房价场景
    { name: t.scenPriceDrop, transform: (p: InvestmentParams) => ({ ...p, totalPrice: p.totalPrice * 0.9 }) },
    { name: t.scenPriceDrop20, transform: (p: InvestmentParams) => ({ ...p, totalPrice: p.totalPrice * 0.8 }) },
    { name: t.scenPriceUp, transform: (p: InvestmentParams) => ({ ...p, appreciationRate: p.appreciationRate + 10 }) },
    
    // 租金场景
    { name: t.scenRentDrop, transform: (p: InvestmentParams) => ({ ...p, monthlyRent: p.monthlyRent * 0.8 }) },
    { name: t.scenRentDrop30, transform: (p: InvestmentParams) => ({ ...p, monthlyRent: p.monthlyRent * 0.7 }) },
    { name: t.scenRentUp, transform: (p: InvestmentParams) => ({ ...p, monthlyRent: p.monthlyRent * 1.3 }) },
    
    // 利率场景
    { name: t.scenRateUp, transform: (p: InvestmentParams) => ({ ...p, interestRate: p.interestRate + 1, providentInterestRate: p.providentInterestRate + 1 }) },
    { name: t.scenRateUp2, transform: (p: InvestmentParams) => ({ ...p, interestRate: p.interestRate + 2, providentInterestRate: p.providentInterestRate + 2 }) },
    
    // 其他场景
    { name: t.scenVacancy, transform: (p: InvestmentParams) => ({ ...p, vacancyRate: 20 }) },
    { name: t.scenHoldingCostUp, transform: (p: InvestmentParams) => ({ ...p, holdingCostRatio: p.holdingCostRatio * 1.5, propertyMaintenanceCost: p.propertyMaintenanceCost * 1.5 }) },
    
    // 组合场景
    { name: t.scenCombo1, transform: (p: InvestmentParams) => ({ ...p, totalPrice: p.totalPrice * 0.9, monthlyRent: p.monthlyRent * 0.8 }) },
    { name: t.scenCombo2, transform: (p: InvestmentParams) => ({ ...p, interestRate: p.interestRate + 1, providentInterestRate: p.providentInterestRate + 1, vacancyRate: 20 }) },
  ];

  // 添加自定义场景
  customScenarios.forEach(custom => {
    scenarios.push({
      name: custom.name,
      transform: (p: InvestmentParams) => ({
        ...p,
        totalPrice: p.totalPrice * (1 + custom.priceChange / 100),
        monthlyRent: p.monthlyRent * (1 + custom.rentChange / 100),
        interestRate: p.interestRate + custom.rateChange,
        providentInterestRate: p.providentInterestRate + custom.rateChange,
        vacancyRate: custom.vacancyRate,
        holdingCostRatio: p.holdingCostRatio * (1 + custom.holdingCostChange / 100),
        propertyMaintenanceCost: p.propertyMaintenanceCost * (1 + custom.holdingCostChange / 100),
        holdingYears: custom.sellYear || p.holdingYears
      })
    });
  });

  if (params.holdingYears > 5) {
    scenarios.push({ 
      name: t.scenSellYear.replace('{year}', '5'), 
      transform: (p: InvestmentParams) => ({ ...p, holdingYears: 5 }) 
    });
  } else if (params.holdingYears > 3) {
    scenarios.push({ 
      name: t.scenSellYear.replace('{year}', '3'), 
      transform: (p: InvestmentParams) => ({ ...p, holdingYears: 3 }) 
    });
  } else if (params.holdingYears > 1) {
     scenarios.push({ 
      name: t.scenSellYear.replace('{year}', '1'), 
      transform: (p: InvestmentParams) => ({ ...p, holdingYears: 1 }) 
    });
  }

  return scenarios.map(sc => {
    const newParams = sc.transform(params);
    const res = calculateInvestment(newParams, t);
    
    // 生成解释说明
    let changes: string[] = [];
    if (newParams.totalPrice !== params.totalPrice) {
      const diff = ((newParams.totalPrice - params.totalPrice) / params.totalPrice) * 100;
      changes.push(`${t.priceChange}: ${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`);
    }
    if (newParams.monthlyRent !== params.monthlyRent) {
      const diff = ((newParams.monthlyRent - params.monthlyRent) / params.monthlyRent) * 100;
      changes.push(`${t.rentChange}: ${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`);
    }
    if (newParams.interestRate !== params.interestRate) {
      const diff = newParams.interestRate - params.interestRate;
      changes.push(`${t.rateChange}: ${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`);
    }
    if (newParams.vacancyRate !== params.vacancyRate) {
      changes.push(`${t.vacancyChange}: ${newParams.vacancyRate}%`);
    }
    if (newParams.holdingCostRatio !== params.holdingCostRatio) {
       const diff = ((newParams.holdingCostRatio - params.holdingCostRatio) / params.holdingCostRatio) * 100;
       changes.push(`${t.holdingCostChange}: ${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`);
    }
    if (newParams.holdingYears !== params.holdingYears) {
      changes.push(`${t.sellYearCustom}: ${newParams.holdingYears}`);
    }

    return {
      scenarioName: sc.name,
      totalReturnChange: res.totalRevenue - base.totalRevenue,
      returnRate: res.comprehensiveReturn,
      monthlyPayment: res.monthlyPayment,
      monthlyCoverage: res.monthlyCoverageRatio,
      diffRevenue: res.totalRevenue - base.totalRevenue,
      isNegative: res.totalRevenue < 0,
      description: '',
      totalRevenue: res.totalRevenue,
      explanation: changes.join(', '),
      changes: changes
    };
  });
};

export const calculateTaxes = (params: TaxParams): TaxResult => {
  const { cityTier, isSecondHand, area, buyerStatus, yearsHeld, isSellerOnlyHome, price, originalPrice } = params;
  const priceWan = price; // Input is in Wan
  const priceYuan = price * 10000;
  
  // 1. Deed Tax (契税)
  // First Home: <=90sqm 1%, >90sqm 1.5%
  // Second Home: <=90sqm 1%, >90sqm 2% (Tier 1 is 3% for second home usually, but recent policies might vary. We stick to standard rule: Tier 1 3% for 2nd)
  // Third+: 3%
  let deedRate = 0.03;
  if (buyerStatus === 'first') {
    deedRate = area <= 90 ? 0.01 : 0.015;
  } else if (buyerStatus === 'second') {
    if (cityTier === 'tier1') {
      deedRate = 0.03; // Beijing/Shanghai/Shenzhen/Guangzhou usually 3% for 2nd
    } else {
      deedRate = area <= 90 ? 0.01 : 0.02;
    }
  } else {
    deedRate = 0.03;
  }
  const deedTax = priceWan * deedRate;

  // 2. VAT (增值税)
  // New home: Included in price usually, but for calculator we assume 0 extra or user inputs total price. 
  // Second hand:
  // < 2 years: 5% (approx 5.3% or 5.6% with surcharge). Let's use 5.3%.
  // >= 2 years: Exempt (Ordinary). Tier 1 Non-ordinary pays on difference. 
  // For simplicity: <2y = 5.3%, >=2y = 0.
  let vatRate = 0;
  let vat = 0;
  if (isSecondHand) {
    if (yearsHeld === '<2') {
      vatRate = 0.053;
      vat = priceWan * vatRate; // Simplified base
    } else {
      // Exempt for >=2y generally
      vatRate = 0;
      vat = 0;
    }
  }

  // 3. PIT (个人所得税)
  // New home: 0
  // Second hand: 
  // >5 years & Only home: Exempt
  // Others: 1% of Total Price (or 20% of profit). We use 1% estimate.
  let pitRate = 0;
  if (isSecondHand) {
    if (yearsHeld === '>5' && isSellerOnlyHome) {
      pitRate = 0;
    } else {
      pitRate = 0.01;
    }
  }
  const pit = priceWan * pitRate;

  return {
    deedTax,
    vat,
    pit,
    total: deedTax + vat + pit,
    breakdown: {
      deedRate,
      vatRate,
      pitRate
    }
  };
};

export const predictAppreciation = (params: AppreciationPredictorParams): AppreciationPrediction => {
  // 1. 城市等级评分 (30%)
  let cityTierScore = 0;
  switch (params.cityTier) {
    case '一线': cityTierScore = 35; break;
    case '新一线': cityTierScore = 30; break;
    case '二线': cityTierScore = 20; break;
    case '三线及以下': cityTierScore = 10; break;
  }

  // 2. 区域位置评分 (20%)
  let districtScore = 0;
  switch (params.district) {
    case '核心区': districtScore = 20; break;
    case '近郊': districtScore = 15; break;
    case '远郊': districtScore = 8; break;
  }

  // 3. 政策环境评分 (15%)
  let policyScore = 0;
  switch (params.policyEnvironment) {
    case '宽松': policyScore = 15; break;
    case '中性': policyScore = 10; break;
    case '严格': policyScore = 5; break;
  }

  // 4. 基建规划评分 (15%)
  let infrastructureScore = 0;
  switch (params.infrastructurePlan) {
    case '重大规划': infrastructureScore = 15; break;
    case '一般规划': infrastructureScore = 10; break;
    case '无规划': infrastructureScore = 5; break;
  }

  // 5. 人口趋势评分 (10%)
  let populationScore = 0;
  switch (params.populationTrend) {
    case '持续流入': populationScore = 10; break;
    case '稳定': populationScore = 7; break;
    case '流出': populationScore = 3; break;
  }

  // 6. 产业发展评分 (10%)
  let industryScore = 0;
  switch (params.industryDevelopment) {
    case '强劲': industryScore = 10; break;
    case '中等': industryScore = 7; break;
    case '疲软': industryScore = 3; break;
  }

  // 总分计算
  const score = cityTierScore + districtScore + policyScore + infrastructureScore + populationScore + industryScore;

  // 等级判定和增长率预测
  let level: 'S' | 'A' | 'B' | 'C' | 'D';
  let baseRate: number;
  let recommendation: string;
  let risks: string[];
  let opportunities: string[];

  if (score >= 85) {
    level = 'S';
    baseRate = 6.5;
    recommendation = '该区域具有极高的增值潜力，建议优先考虑投资。未来5年预计年均增长5-8%，适合长期持有。';
    risks = ['市场过热风险', '政策调控可能收紧', '高位接盘风险'];
    opportunities = ['核心地段稀缺性', '人口持续流入', '产业升级带动', '基建完善提升价值'];
  } else if (score >= 70) {
    level = 'A';
    baseRate = 4;
    recommendation = '该区域具有较高的增值潜力，投资价值良好。未来5年预计年均增长3-5%，适合中长期持有。';
    risks = ['区域竞争加剧', '供应量增加压力', '政策不确定性'];
    opportunities = ['城市发展红利', '配套逐步完善', '新兴产业聚集'];
  } else if (score >= 50) {
    level = 'B';
    baseRate = 2;
    recommendation = '该区域具有中等增值潜力，建议谨慎投资。未来5年预计年均增长1-3%，需关注市场变化。';
    risks = ['增长动力不足', '人口流入放缓', '竞争激烈'];
    opportunities = ['政策支持可能性', '基建改善空间', '价格相对合理'];
  } else if (score >= 30) {
    level = 'C';
    baseRate = 0.5;
    recommendation = '该区域增值潜力较低，不建议作为投资首选。未来5年预计年均增长0-1%，更适合自住。';
    risks = ['市场需求疲软', '人口流出压力', '产业空心化', '政策限制'];
    opportunities = ['价格低位', '政策转向可能', '长期自住价值'];
  } else {
    level = 'D';
    baseRate = -0.5;
    recommendation = '该区域存在较高投资风险，强烈不建议投资。未来5年可能面临价格下跌，建议避开。';
    risks = ['市场严重过剩', '人口大量流出', '产业衰退', '政策严格限制', '流动性风险'];
    opportunities = ['极低价抄底机会（高风险）', '政策大幅转向可能性（低概率）'];
  }

  // 生成未来5年增长率（带随机波动）
  const yearlyRate: number[] = [];
  for (let i = 0; i < 5; i++) {
    // 基础增长率 + 年份衰减 + 随机波动
    const yearDecay = i * 0.1; // 逐年递减
    const randomFactor = (Math.random() - 0.5) * 0.5; // ±0.25%随机波动
    const rate = Math.max(-2, Math.min(10, baseRate - yearDecay + randomFactor));
    yearlyRate.push(Number(rate.toFixed(2)));
  }

  return {
    score,
    level,
    yearlyRate,
    recommendation,
    risks,
    opportunities,
    breakdown: {
      cityTierScore,
      districtScore,
      policyScore,
      infrastructureScore,
      populationScore,
      industryScore
    }
  };
};
// Comprehensive Risk Assessment
export interface RiskDimension {
  name: string;
  score: number; // 0-100, higher is riskier
  level: 'low' | 'medium' | 'high';
  explanation: string;
  suggestions: string[];
}

export interface ComprehensiveRiskResult {
  overallScore: number;
  overallLevel: 'low' | 'medium' | 'high';
  dimensions: {
    cashFlow: RiskDimension;
    leverage: RiskDimension;
    liquidity: RiskDimension;
    market: RiskDimension;
    policy: RiskDimension;
    holdingCost: RiskDimension;
  };
}

export const calculateComprehensiveRisk = (params: InvestmentParams, result: CalculationResult, t: any): ComprehensiveRiskResult => {
  // Get monthly income from params (use familyMonthlyIncome)
  const monthlyIncome = params.familyMonthlyIncome || 30000;
  
  // 1. Cash Flow Risk - 现金流压力
  const dtiRatio = (result.monthlyPayment / monthlyIncome) * 100;
  const cashFlowScore = Math.min(100, dtiRatio * 2); // DTI > 50% = 100 score
  const cashFlowLevel = cashFlowScore < 40 ? 'low' : cashFlowScore < 70 ? 'medium' : 'high';
  const cashFlowExplanation = dtiRatio < 30 
    ? `月供占收入${dtiRatio.toFixed(1)}%，压力较小，财务状况健康。`
    : dtiRatio < 50
    ? `月供占收入${dtiRatio.toFixed(1)}%，压力适中，需保持稳定收入。`
    : `月供占收入${dtiRatio.toFixed(1)}%，压力较大，可能影响生活质量。`;
  const cashFlowSuggestions = dtiRatio > 50 
    ? ['考虑延长贷款期限降低月供', '增加首付比例减少贷款额', '寻找收入更高的工作机会', '考虑出租部分房间增加收入']
    : dtiRatio > 30
    ? ['建立应急储备金（至少6个月月供）', '避免其他大额消费贷款', '保持收入稳定增长']
    : ['当前现金流健康，可考虑提前还款', '可适当投资理财增加收入'];

  // 2. Leverage Risk - 杠杆风险
  const loanAmount = params.totalPrice * (1 - params.downPaymentRatio / 100);
  const ltvRatio = (loanAmount / params.totalPrice) * 100;
  const leverageScore = ltvRatio; // LTV itself is a good risk indicator
  const leverageLevel = leverageScore < 60 ? 'low' : leverageScore < 80 ? 'medium' : 'high';
  const leverageExplanation = ltvRatio < 60
    ? `贷款比例${ltvRatio.toFixed(1)}%，杠杆适中，抗风险能力强。`
    : ltvRatio < 80
    ? `贷款比例${ltvRatio.toFixed(1)}%，杠杆较高，需关注房价波动。`
    : `贷款比例${ltvRatio.toFixed(1)}%，高杠杆，房价下跌风险较大。`;
  const leverageSuggestions = ltvRatio > 80
    ? ['尽快积累资金降低贷款比例', '密切关注市场动态', '考虑购买房贷保险', '避免房价高位接盘']
    : ltvRatio > 60
    ? ['保持合理杠杆，不建议继续加杠杆', '关注房价走势，适时调整策略']
    : ['杠杆健康，可考虑适当投资其他资产'];

  // 3. Liquidity Risk - 流动性风险
  const emergencyReserve = monthlyIncome * 6; // 6 months reserve needed
  const downPayment = params.totalPrice * (params.downPaymentRatio / 100); // Actual down payment
  const availableCash = Math.max(downPayment, 1); // Prevent division by zero
  const liquidityRatio = (emergencyReserve / availableCash) * 100;
  const liquidityScore = Math.min(100, liquidityRatio);
  const liquidityLevel = liquidityScore < 40 ? 'low' : liquidityScore < 70 ? 'medium' : 'high';
  const liquidityExplanation = liquidityScore < 40
    ? `应急储备充足，流动性风险低。`
    : liquidityScore < 70
    ? `应急储备一般，建议增加现金储备。`
    : `应急储备不足，流动性风险较高，紧急情况下可能需要变卖资产。`;
  const liquiditySuggestions = liquidityScore > 70
    ? ['优先建立6个月以上的应急储备金', '减少非必要支出', '考虑降低首付比例保留现金', '购买短期理财保持流动性']
    : liquidityScore > 40
    ? ['继续积累应急储备', '保持部分资金流动性']
    : ['流动性良好，可适当配置长期投资'];

  // 4. Market Risk - 市场风险
  const appreciationRate = params.appreciationRate || 3;
  const marketScore = appreciationRate < 0 ? 80 : appreciationRate < 3 ? 60 : appreciationRate < 5 ? 40 : 20;
  const marketLevel = marketScore < 40 ? 'low' : marketScore < 70 ? 'medium' : 'high';
  const marketExplanation = appreciationRate < 0
    ? `预期房价下跌${Math.abs(appreciationRate)}%/年，市场风险极高。`
    : appreciationRate < 3
    ? `预期房价涨幅${appreciationRate}%/年，低于通胀，市场风险较高。`
    : appreciationRate < 5
    ? `预期房价涨幅${appreciationRate}%/年，市场表现平稳。`
    : `预期房价涨幅${appreciationRate}%/年，市场前景较好。`;
  const marketSuggestions = appreciationRate < 3
    ? ['重新评估购房时机', '考虑其他投资机会', '选择核心地段降低风险', '关注政策利好']
    : appreciationRate < 5
    ? ['保持观望，适时调整', '关注区域发展规划']
    : ['当前市场环境良好', '可考虑长期持有'];

  // 5. Policy Risk - 政策风险
  const interestRate = params.interestRate;
  const policyScore = interestRate > 5 ? 70 : interestRate > 4 ? 50 : 30;
  const policyLevel = policyScore < 40 ? 'low' : policyScore < 70 ? 'medium' : 'high';
  const policyExplanation = interestRate > 5
    ? `当前利率${interestRate}%，处于高位，存在政策调整风险。`
    : interestRate > 4
    ? `当前利率${interestRate}%，处于中等水平，需关注政策变化。`
    : `当前利率${interestRate}%，处于低位，政策环境友好。`;
  const policySuggestions = interestRate > 5
    ? ['关注央行降息信号', '考虑固定利率贷款', '等待更优惠的贷款政策']
    : interestRate > 4
    ? ['密切关注利率走势', '保持灵活调整能力']
    : ['当前利率环境良好', '可考虑锁定低利率'];

  // 6. Holding Cost Risk - 持有成本风险
  const holdingCostRatio = params.holdingCostRatio || 0.5;
  const vacancyRate = params.vacancyRate || 5;
  const holdingCostScore = (holdingCostRatio * 50) + (vacancyRate * 5);
  const holdingCostLevel = holdingCostScore < 40 ? 'low' : holdingCostScore < 70 ? 'medium' : 'high';
  const holdingCostExplanation = holdingCostScore < 40
    ? `持有成本${holdingCostRatio}%，空置率${vacancyRate}%，成本控制良好。`
    : holdingCostScore < 70
    ? `持有成本${holdingCostRatio}%，空置率${vacancyRate}%，需注意成本控制。`
    : `持有成本${holdingCostRatio}%，空置率${vacancyRate}%，成本压力较大。`;
  const holdingCostSuggestions = holdingCostScore > 70
    ? ['降低空置率，提高出租率', '优化物业管理降低成本', '考虑短租提高收益', '评估是否继续持有']
    : holdingCostScore > 40
    ? ['保持合理出租率', '定期维护降低维修成本']
    : ['持有成本控制良好', '可考虑长期持有'];

  // Calculate Overall Score (weighted average)
  const overallScore = (
    cashFlowScore * 0.25 +
    leverageScore * 0.20 +
    liquidityScore * 0.20 +
    marketScore * 0.15 +
    policyScore * 0.10 +
    holdingCostScore * 0.10
  );
  const overallLevel = overallScore < 40 ? 'low' : overallScore < 65 ? 'medium' : 'high';

  return {
    overallScore: Number(overallScore.toFixed(1)),
    overallLevel,
    dimensions: {
      cashFlow: {
        name: '现金流压力',
        score: Number(cashFlowScore.toFixed(1)),
        level: cashFlowLevel,
        explanation: cashFlowExplanation,
        suggestions: cashFlowSuggestions
      },
      leverage: {
        name: '杠杆风险',
        score: Number(leverageScore.toFixed(1)),
        level: leverageLevel,
        explanation: leverageExplanation,
        suggestions: leverageSuggestions
      },
      liquidity: {
        name: '流动性风险',
        score: Number(liquidityScore.toFixed(1)),
        level: liquidityLevel,
        explanation: liquidityExplanation,
        suggestions: liquiditySuggestions
      },
      market: {
        name: '市场风险',
        score: Number(marketScore.toFixed(1)),
        level: marketLevel,
        explanation: marketExplanation,
        suggestions: marketSuggestions
      },
      policy: {
        name: '政策风险',
        score: Number(policyScore.toFixed(1)),
        level: policyLevel,
        explanation: policyExplanation,
        suggestions: policySuggestions
      },
      holdingCost: {
        name: '持有成本风险',
        score: Number(holdingCostScore.toFixed(1)),
        level: holdingCostLevel,
        explanation: holdingCostExplanation,
        suggestions: holdingCostSuggestions
      }
    }
  };
};

// Budget and Affordability Analysis
export interface AffordabilityMetrics {
  downPaymentCapacity: number; // 万元
  maxAffordableMonthlyPayment: number; // 元
  maxAffordablePrice: number; // 万元
  currentDTI: number; // %
  safetyMargin: number; // %
  stressTests: {
    incomeDown20: {
      newIncome: number;
      newDTI: number;
      canAfford: boolean;
      shortfall: number;
    };
    rateUp1: {
      newRate: number;
      newPayment: number;
      newDTI: number;
      canAfford: boolean;
      extraCost: number;
    };
    combined: {
      newIncome: number;
      newRate: number;
      newPayment: number;
      newDTI: number;
      canAfford: boolean;
      shortfall: number;
    };
  };
  incomeStressPoints: Array<{
    incomeReduction: number; // %
    income: number;
    dti: number;
    status: 'safe' | 'warning' | 'danger';
  }>;
}

export const calculateAffordability = (params: InvestmentParams, result: CalculationResult): AffordabilityMetrics => {
  const monthlyIncome = params.familyMonthlyIncome || 30000;
  const currentMonthlyPayment = result.monthlyPayment;
  const currentDTI = (currentMonthlyPayment / monthlyIncome) * 100;
  
  // 1. Down Payment Capacity
  // Assume user has emergency fund + savings for down payment
  const emergencyFund = params.emergencyFund || 0; // 万元
  const totalSavings = emergencyFund + (monthlyIncome * 12 / 10000); // Emergency fund + 1 year savings
  const downPaymentCapacity = Math.max(0, totalSavings * 0.7); // Use 70% of savings for down payment
  
  // 2. Maximum Affordable Monthly Payment (using 30% DTI as safe threshold)
  const safeDTI = 30; // %
  const maxAffordableMonthlyPayment = monthlyIncome * (safeDTI / 100);
  
  // 3. Maximum Affordable House Price
  // Reverse calculate from max monthly payment
  const loanTerm = params.loanTerm;
  const interestRate = params.interestRate;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTerm * 12;
  
  let maxLoanAmount = 0;
  if (monthlyRate > 0) {
    maxLoanAmount = (maxAffordableMonthlyPayment * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / 
                    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
  } else {
    maxLoanAmount = maxAffordableMonthlyPayment * totalMonths;
  }
  
  const maxLoanAmountWan = maxLoanAmount / 10000;
  const downPaymentRatio = params.downPaymentRatio;
  const maxAffordablePrice = maxLoanAmountWan / (1 - downPaymentRatio / 100);
  
  // 4. Safety Margin
  const safetyMargin = ((maxAffordableMonthlyPayment - currentMonthlyPayment) / currentMonthlyPayment) * 100;
  
  // 5. Stress Tests
  
  // 5a. Income drops 20%
  const incomeDown20 = monthlyIncome * 0.8;
  const dtiIncomeDown20 = (currentMonthlyPayment / incomeDown20) * 100;
  const canAffordIncomeDown = dtiIncomeDown20 <= 50; // 50% is danger threshold
  const shortfallIncomeDown = canAffordIncomeDown ? 0 : currentMonthlyPayment - (incomeDown20 * 0.5);
  
  // 5b. Interest rate increases 1%
  const newRate = interestRate + 1;
  const newMonthlyRate = newRate / 100 / 12;
  const loanAmount = params.totalPrice * (1 - downPaymentRatio / 100);
  const loanAmountYuan = loanAmount * 10000;
  
  let newPayment = 0;
  if (newMonthlyRate > 0) {
    newPayment = (loanAmountYuan * newMonthlyRate * Math.pow(1 + newMonthlyRate, totalMonths)) / 
                 (Math.pow(1 + newMonthlyRate, totalMonths) - 1);
  } else {
    newPayment = loanAmountYuan / totalMonths;
  }
  
  const dtiRateUp = (newPayment / monthlyIncome) * 100;
  const canAffordRateUp = dtiRateUp <= 50;
  const extraCost = newPayment - currentMonthlyPayment;
  
  // 5c. Combined: Income down 20% AND rate up 1%
  const dtiCombined = (newPayment / incomeDown20) * 100;
  const canAffordCombined = dtiCombined <= 50;
  const shortfallCombined = canAffordCombined ? 0 : newPayment - (incomeDown20 * 0.5);
  
  // 6. Income Stress Points (calculate DTI at various income reduction levels)
  const incomeStressPoints = [];
  for (let reduction = 0; reduction <= 50; reduction += 5) {
    const reducedIncome = monthlyIncome * (1 - reduction / 100);
    const dti = (currentMonthlyPayment / reducedIncome) * 100;
    const status = dti < 30 ? 'safe' : dti < 50 ? 'warning' : 'danger';
    
    incomeStressPoints.push({
      incomeReduction: reduction,
      income: reducedIncome,
      dti: Number(dti.toFixed(1)),
      status
    });
  }
  
  return {
    downPaymentCapacity: Number(downPaymentCapacity.toFixed(2)),
    maxAffordableMonthlyPayment: Number(maxAffordableMonthlyPayment.toFixed(0)),
    maxAffordablePrice: Number(maxAffordablePrice.toFixed(2)),
    currentDTI: Number(currentDTI.toFixed(1)),
    safetyMargin: Number(safetyMargin.toFixed(1)),
    stressTests: {
      incomeDown20: {
        newIncome: Number(incomeDown20.toFixed(0)),
        newDTI: Number(dtiIncomeDown20.toFixed(1)),
        canAfford: canAffordIncomeDown,
        shortfall: Number(shortfallIncomeDown.toFixed(0))
      },
      rateUp1: {
        newRate: Number(newRate.toFixed(2)),
        newPayment: Number(newPayment.toFixed(0)),
        newDTI: Number(dtiRateUp.toFixed(1)),
        canAfford: canAffordRateUp,
        extraCost: Number(extraCost.toFixed(0))
      },
      combined: {
        newIncome: Number(incomeDown20.toFixed(0)),
        newRate: Number(newRate.toFixed(2)),
        newPayment: Number(newPayment.toFixed(0)),
        newDTI: Number(dtiCombined.toFixed(1)),
        canAfford: canAffordCombined,
        shortfall: Number(shortfallCombined.toFixed(0))
      }
    },
    incomeStressPoints
  };
};

export const calculateComparison = (baseParams: InvestmentParams, scenarios: import('../types').ComparisonScenario[]): import('../types').ComparisonResult[] => {
  // We need translations for calculateInvestment, importing here to avoid circular dep issues if any, or just use default.
  // Actually we can pass a dummy T since strictly calculating numbers.
  const dummyT: any = new Proxy({}, { get: () => 'text' });
  const baseResult = calculateInvestment(baseParams, dummyT);

  return scenarios.map(sc => {
    const p = { 
      ...baseParams, 
      enablePrepayment: true, 
      prepaymentYear: sc.prepaymentYear, 
      prepaymentAmount: sc.prepaymentAmount 
    };
    const res = calculateInvestment(p, dummyT);
    
    return {
      scenarioId: sc.id,
      scenarioName: sc.name,
      totalInterest: res.totalInterest,
      totalRepayment: res.totalRepayment,
      totalRevenue: res.totalRevenue,
      returnRate: res.comprehensiveReturn,
      savedInterest: baseResult.totalInterest - res.totalInterest,
      reducedMonths: 0
    };
  });
};

// Liquidity Reality Check Calculation
export const calculateLiquidityAnalysis = (params: LiquidityParams, t?: any): LiquidityAnalysis => {
  // Mock t if not provided (fallback to hardcoded Chinese for safety, but UI passes t)
  // Actually, for better typing, we assume t is passed or we default to returning keys/Chinese
  const tr = (key: string, fallback: string) => t && t[key] ? t[key] : fallback;

  let score = 50;
  const riskFactors: string[] = [];
  const strengths: string[] = [];
  
  if (params.area >= 70 && params.area <= 120) {
    score += 15;
    strengths.push(tr('liqStrAreaOk', '面积适中，受众广泛'));
  } else if (params.area > 150) {
    score -= 15;
    riskFactors.push(tr('liqRiskAreaBig', '大户型流动性较差'));
  } else if (params.area < 60) {
    score -= 5;
    riskFactors.push(tr('liqRiskAreaSmall', '面积偏小，限制家庭类型'));
  }
  
  if (params.hasSchool) {
    score += 10;
    strengths.push(tr('liqStrSchool', '学区房，刚需强劲'));
  }
  
  if (params.transitScore >= 8) {
    score += 10;
    strengths.push(tr('liqStrTransit', '交通便利，通勤友好'));
  } else if (params.transitScore <= 4) {
    score -= 8;
    riskFactors.push(tr('liqRiskTransit', '交通不便，影响出售'));
  }
  
  if (params.priceLevel === 'low') {
    score += 10;
    strengths.push(tr('liqStrPriceLow', '价格亲民，购买力强'));
  } else if (params.priceLevel === 'luxury') {
    score -= 20;
    riskFactors.push(tr('liqRiskPriceLux', '豪宅市场窄，接盘人少'));
  }
  
  if (params.propertyAge < 5) {
    score += 10;
    strengths.push(tr('liqStrNew', '次新房，品质保证'));
  } else if (params.propertyAge > 20) {
    score -= 10;
    riskFactors.push(tr('liqRiskOld', '房龄较老，维护成本高'));
  }
  
  if (params.competitionLevel === 'high') {
    score -= 15;
    riskFactors.push(tr('liqRiskComp', '新房竞争激烈'));
  }
  
  if (params.populationTrend === 'growing') {
    score += 15;
    strengths.push(tr('liqStrPop', '人口流入，需求增长'));
  } else if (params.populationTrend === 'declining') {
    score -= 20;
    riskFactors.push(tr('liqRiskPop', '人口流出，需求萎缩'));
  }
  
  if (params.policyEnvironment === 'favorable') {
    score += 10;
    strengths.push(tr('liqStrPol', '政策利好，市场活跃'));
  } else if (params.policyEnvironment === 'restrictive') {
    score -= 15;
    riskFactors.push(tr('liqRiskPol', '政策限制，交易受阻'));
  }
  
  score = Math.max(0, Math.min(100, score));
  
  let expectedMonths = 6;
  if (score > 80) expectedMonths = 3;
  else if (score > 60) expectedMonths = 4;
  else if (score > 40) expectedMonths = 6;
  else if (score > 20) expectedMonths = 9;
  else expectedMonths = 15;
  
  const discountProbability = Math.max(0, Math.min(100, 100 - score));
  
  const buyerProfiles: BuyerProfile[] = [];
  
  if (params.area >= 60 && params.area <= 90 && params.priceLevel !== 'luxury' && params.transitScore >= 6) {
    buyerProfiles.push({
      type: BuyerType.FIRST_TIME_YOUNG,
      label: tr('liqBuyerYoung', '首次置业年轻家庭'),
      percentage: params.hasSchool ? 45 : 35,
      trend: params.populationTrend === 'growing' ? 'increasing' : params.populationTrend === 'declining' ? 'decreasing' : 'stable',
      characteristics: tr('liqTraitYoung', '25-35岁, 小家庭, 注重性价比').split(', '),
      concerns: ['总价', '交通', '学区', '月供压力']
    });
  }
  
  if (params.area >= 90 && params.area <= 130 && params.bedrooms >= 3) {
    buyerProfiles.push({
      type: BuyerType.UPGRADING_FAMILY,
      label: tr('liqBuyerUpgrade', '改善型家庭'),
      percentage: params.hasSchool ? 40 : 30,
      trend: params.policyEnvironment === 'restrictive' ? 'decreasing' : 'stable',
      characteristics: tr('liqTraitUpgrade', '35-45岁, 二孩家庭, 追求品质').split(', '),
      concerns: ['学区', '户型', '小区环境', '配套设施']
    });
  }
  
  if (params.transitScore >= 7 && params.location === 'cbd' && params.populationTrend !== 'declining') {
    buyerProfiles.push({
      type: BuyerType.INVESTOR,
      label: tr('liqBuyerInvest', '投资型买家'),
      percentage: params.policyEnvironment === 'favorable' ? 25 : 15,
      trend: params.policyEnvironment === 'favorable' ? 'increasing' : params.policyEnvironment === 'restrictive' ? 'decreasing' : 'stable',
      characteristics: tr('liqTraitInvest', '资金充裕, 看重增值, 长期持有').split(', '),
      concerns: ['地段', '租金回报', '增值潜力', '政策风险']
    });
  }
  
  if (params.area < 80 && params.location !== 'remote' && params.propertyAge < 15) {
    buyerProfiles.push({
      type: BuyerType.DOWNSIZING,
      label: tr('liqBuyerDown', '换小型买家'),
      percentage: 20,
      trend: 'stable',
      characteristics: tr('liqTraitDown', '50岁以上, 子女独立, 简化生活').split(', '),
      concerns: ['地段', '物业', '医疗配套', '生活便利']
    });
  }
  
  if (buyerProfiles.length === 0 || score < 30) {
    buyerProfiles.push({
      type: BuyerType.RARE,
      label: tr('liqBuyerRare', '接盘人稀少'),
      percentage: 10,
      trend: 'decreasing',
      characteristics: tr('liqTraitRare', '特殊需求, 非主流选择').split(', '),
      concerns: ['大幅折价', '长期持有风险']
    });
  }
  
  buyerProfiles.sort((a, b) => b.percentage - a.percentage);
  const topBuyers = buyerProfiles.slice(0, 3);
  
  let trendIndicator: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (params.populationTrend === 'growing' && params.policyEnvironment === 'favorable') {
    trendIndicator = 'increasing';
  } else if (params.populationTrend === 'declining' || params.policyEnvironment === 'restrictive') {
    trendIndicator = 'decreasing';
  }

  return {
    liquidityScore: Math.round(score),
    expectedSaleMonths: expectedMonths,
    discountProbability: Math.round(discountProbability),
    buyerProfiles: topBuyers,
    trendIndicator,
    riskFactors,
    strengths
  };
};


// Market Position Radar Chart Calculation
export const calculateMarketRadarData = (
  params: InvestmentParams,
  liquidityParams?: LiquidityParams,
  monthlyIncome: number = 30000 // Fallback if not in params
): MarketRadarData => {
  // 1. Leverage (High leverage = High Risk = Low Score)
  // LTV = Loan / Price
  // Calculate loan amount if not provided implies deriving from price * (1 - downPayment)
  // InvestmentParams has totalPrice (Wan) and downPaymentRatio (%)
  const loanAmountWan = params.totalPrice * (1 - params.downPaymentRatio / 100);
  const ltv = params.totalPrice > 0 ? (loanAmountWan / params.totalPrice) * 100 : 0;
  
  // Score: 100 - LTV. 30% LTV -> 70 Score. 70% LTV -> 30 Score.
  const leverageScore = Math.max(0, Math.min(100, 100 - ltv));

  // Amortization for payment calc
  const termMonths = params.loanTerm * 12;
  const amortization = calculateAmortization(
    loanAmountWan,
    termMonths,
    params.interestRate,
    RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST
  );
  const monthlyPayment = amortization.schedule.length > 0 ? amortization.schedule[0].payment : 0;

  // 2. Risk Tolerance
  // Link to Emergency Fund. 
  // If Emergency Fund covers 6 months of payment => Score 60 (Baseline).
  // 12 months => Score 80. 
  // 3 months => Score 40.
  let riskTolerance = 60; // Base
  if (monthlyPayment > 0 && params.emergencyFund > 0) {
    const monthsCovered = (params.emergencyFund * 10000) / monthlyPayment;
    riskTolerance = Math.min(100, Math.max(20, 30 + monthsCovered * 5)); 
    // e.g. 6 months * 5 = 30 + 30 = 60. 12 months * 5 = 60 + 30 = 90.
  }

  // 3. Liquidity
  let liquidityScore = 50;
  if (liquidityParams) {
    const analysis = calculateLiquidityAnalysis(liquidityParams);
    liquidityScore = analysis.liquidityScore;
  }

  // 4. Career Stability
  // Defaulting to 75 as we lack explicit input.
  const careerStability = 75;

  // 5. Family Burden
  // DTI Based.
  // Use params.familyMonthlyIncome if available, else fallback
  const incomeToUse = params.familyMonthlyIncome > 0 ? params.familyMonthlyIncome : monthlyIncome;
  
  // DTI ratio (0-1)
  const dti = incomeToUse > 0 ? monthlyPayment / incomeToUse : 0.5;
  
  // Score: Low DTI = High Score.
  // DTI 30% -> Score 70. DTI 50% -> Score 50. DTI 70% -> Score 30.
  const familyBurdenScore = Math.max(0, Math.min(100, 100 - (dti * 100)));

  // 6. Market Valuation
  // Combine Rental Yield Score + Appreciation Potential
  // Rental Yield: 1.5% is baseline neutral (score 50)? 
  // Global standards say 4-5%, but Chinese tiers often 1.5-2%.
  // Let's set 2% as Score 60. 
  // Yield % * 30.
  const annualRent = params.monthlyRent * 12;
  const propertyValue = params.totalPrice * 10000;
  const rentalYieldPct = propertyValue > 0 ? (annualRent / propertyValue) * 100 : 1.5;
  const yieldScore = rentalYieldPct * 25; // 2% -> 50. 3% -> 75.
  
  // Appreciation: params.appreciationRate usually 3-5%.
  // 3% -> Score 60. 5% -> Score 80.
  const appreciationScore = (params.appreciationRate || 3) * 15; // 3 * 15 = 45.
  
  const marketValuation = Math.min(100, (yieldScore * 0.4 + appreciationScore * 0.6));

  return {
    leverage: Math.round(leverageScore),
    riskTolerance: Math.round(riskTolerance),
    liquidity: Math.round(liquidityScore),
    careerStability: Math.round(careerStability),
    familyBurden: Math.round(familyBurdenScore),
    marketValuation: Math.round(marketValuation)
  };
};

// Core Life Drag Index Logic
export const calculateLifeDragIndex = (
  params: InvestmentParams,
  liquidityParams?: LiquidityParams,
  monthlyIncome: number = 30000,
  t?: any
): LifeDragMetrics => {
  // 1. Calculate Monthly Payment and DTI
  const loanAmountWan = params.totalPrice * (1 - params.downPaymentRatio / 100);
  const termMonths = params.loanTerm * 12;
  const amortization = calculateAmortization(
    loanAmountWan,
    termMonths,
    params.interestRate,
    RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST
  );
  const monthlyPayment = amortization.schedule.length > 0 ? amortization.schedule[0].payment : 0;
  
  const incomeToUse = params.familyMonthlyIncome > 0 ? params.familyMonthlyIncome : monthlyIncome;
  const dti = incomeToUse > 0 ? monthlyPayment / incomeToUse : 0.5;

  // 2. Career Lock Score (Risk of not being able to switch jobs)
  // Factors: High DTI + Low Emergency Fund = Trapped in current job.
  // 30% DTI is safe. 50% is locked. 70% is slavery.
  // Emergency Fund: 6 months buffer reduces lock.
  let careerLock = 0;
  if (dti < 0.3) careerLock = 20;
  else if (dti < 0.5) careerLock = 50;
  else careerLock = 90;

  // Mitigation by Emergency Fund
  const monthsBuffer = params.emergencyFund > 0 && monthlyPayment > 0 
    ? (params.emergencyFund * 10000) / monthlyPayment 
    : 0;
  if (monthsBuffer > 12) careerLock -= 30;
  else if (monthsBuffer > 6) careerLock -= 15;
  
  careerLock = Math.max(0, Math.min(100, careerLock));

  // 3. Geo Lock Score (Difficulty moving/selling)
  // Linked to Liquidity. If hard to sell (Low Liquidity score), you are geo-locked.
  // Also Investment vs Self-occupy. Self-occupy usually locks you more psychologically.
  let liquidityScore = 50;
  if (liquidityParams) {
    liquidityScore = calculateLiquidityAnalysis(liquidityParams).liquidityScore;
  }
  // Low Liquidity (Score 20) -> High GeoLock (Score 80).
  let geoLock = 100 - liquidityScore;
  if (params.purchaseScenario === PurchaseScenario.FIRST_HOME) geoLock += 10;
  geoLock = Math.max(0, Math.min(100, geoLock));

  // 4. Lifestyle Compression (Impact on discretionary spending)
  // Residual Income Method.
  // Assume basic living cost (excl mortgage) is 30% of income or fixed amount (e.g. 5000 + 2000 per person).
  // Simplified: (Income - Mortgage) / Income.
  // If remaining is < 40% of income, lifestyle is heavily compressed.
  const residualRatio = 1 - dti;
  let lifestyleCompression = 0;
  if (residualRatio > 0.6) lifestyleCompression = 20; // Plenty left
  else if (residualRatio > 0.4) lifestyleCompression = 50; // Moderate
  else if (residualRatio > 0.2) lifestyleCompression = 80; // Tight
  else lifestyleCompression = 100; // Survival mode

  // 5. Future Delay (Postponing life plans)
  // Impacted by Loan Term and existing Family Burden.
  // If Loan Term > 25 years and Age (proxied by lack of huge downpayment?) -> Delay.
  // Actually, DTI is the main factor here too.
  // Let's optimize: High Career Lock + High Lifestyle Compression = High Future Delay.
  let futureDelay = (careerLock * 0.4 + lifestyleCompression * 0.6);
  futureDelay = Math.max(0, Math.min(100, futureDelay));

  // Total Score
  const totalDragScore = Math.round((careerLock + geoLock + lifestyleCompression + futureDelay) / 4);

  let advice = "";
  if (t) {
    if (totalDragScore < 30) advice = t.adviceDragLow;
    else if (totalDragScore < 60) advice = t.adviceDragMed;
    else if (totalDragScore < 80) advice = t.adviceDragHigh;
    else advice = t.adviceDragExtreme;
  } else {
    if (totalDragScore < 30) advice = "这套房子是你的助力，不是负担。";
    else if (totalDragScore < 60) advice = "有一定的束缚，特别是职业选择上需要更谨慎。";
    else if (totalDragScore < 80) advice = "警惕！这套房子正在显著挤压你的生活空间和未来选择。";
    else advice = "极高风险！你可能正在为了房子牺牲整个人生的可能性。";
  }

  return {
    totalDragScore,
    careerLockScore: Math.round(careerLock),
    geoLockScore: Math.round(geoLock),
    lifestyleCompressionScore: Math.round(lifestyleCompression),
    futureDelayScore: Math.round(futureDelay),
    advice
  };
};
