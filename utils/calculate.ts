
import { InvestmentParams, RepaymentMethod, MonthlyPayment, CalculationResult, PrepaymentStrategy, StrategyResult, PrepaymentComparisonResult, StressTestResult, LoanType, AssetComparison, PurchaseScenario, LocationFactors, LocationScore, AssetComparisonItem, KnowledgeCardData } from '../types';

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