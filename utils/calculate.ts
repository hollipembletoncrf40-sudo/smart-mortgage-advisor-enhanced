

import { InvestmentParams, RepaymentMethod, MonthlyPayment, CalculationResult, PrepaymentStrategy, StrategyResult, PrepaymentComparisonResult, StressTestResult, LoanType, AssetComparison, PurchaseScenario, LocationFactors, LocationScore, AssetComparisonItem, KnowledgeCardData, TaxParams, TaxResult, AppreciationPredictorParams, AppreciationPrediction, MonthlyCashFlow } from '../types';

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
  const alternativeRateMonthly = Math.pow(1 + (params.alternativeReturnRate || 4.0) / 100, 1/12) - 1;
  const inflationRate = (params.inflationRate || 0) / 100;
  
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
    const propertyValueStart = params.totalPrice * appreciationFactorStart; 
    const annualRentEffective = params.monthlyRent * 12 * appreciationFactorStart * (1 - (params.vacancyRate || 0)/100);
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
  const monthlyRentIncome = params.monthlyRent * (1 - params.vacancyRate / 100); // 考虑空置率
  const monthlyHoldingCost = (params.totalPrice * params.holdingCostRatio / 100 / 12) + params.propertyMaintenanceCost;
  
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

export const calculateStressTest = (params: InvestmentParams, t: any): StressTestResult[] => {
  const base = calculateInvestment(params, t);
  
  const scenarios = [
    { name: t.scenPriceDrop, transform: (p: InvestmentParams) => ({ ...p, totalPrice: p.totalPrice * 0.9 }) },
    { name: t.scenRentDrop, transform: (p: InvestmentParams) => ({ ...p, monthlyRent: p.monthlyRent * 0.8 }) },
    { name: t.scenRateUp, transform: (p: InvestmentParams) => ({ ...p, interestRate: p.interestRate + 1, providentInterestRate: p.providentInterestRate + 1 }) },
    { name: t.scenVacancy, transform: (p: InvestmentParams) => ({ ...p, vacancyRate: 20 }) }, 
  ];

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
    return {
      scenarioName: sc.name,
      totalReturnChange: res.totalRevenue - base.totalRevenue,
      returnRate: res.comprehensiveReturn,
      monthlyPayment: res.monthlyPayment,
      monthlyCoverage: res.monthlyCoverageRatio,
      diffRevenue: res.totalRevenue - base.totalRevenue,
      isNegative: res.totalRevenue < 0,
      description: '',
      totalRevenue: res.totalRevenue
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