import { SellParams, SellResult, MultiversePoint } from '../types';

export const calculateSellScenario = (params: SellParams): SellResult => {
  // 1. Dilemma Scan (Enhanced)
  // ------------------------------------------------------------------
  const monthlyInterest = (params.remainingMortgage * 10000 * (params.interestRate / 100 / 12));
  const dtiRatio = monthlyInterest / params.monthlyIncome; /* Focusing on Interest-Only DTI for "Sunk Cost" view, 
                                                              or standard DTI if Principal included. Let's use standard monthly payment approx */
  
  // Standard monthly payment calculation for DTI
  // Assume remaining years is 25 if not specified (we don't have remaining term in SellParams, so estimate)
  const estimatedRemainingYears = 25; 
  const r = params.interestRate / 100 / 12;
  const n = estimatedRemainingYears * 12;
  const standardMonthlyPayment = (params.remainingMortgage * 10000 * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
  
  const realDti = standardMonthlyPayment / params.monthlyIncome;

  // Cash Flow Pressure
  const monthlyHoldingCost = (params.holdingCostPerYear * 10000) / 12;
  const totalMonthlyOutflow = standardMonthlyPayment + monthlyHoldingCost;
  const cashFlowPressure = Math.min(100, (totalMonthlyOutflow / params.monthlyIncome) * 100);
  
  // Freedom Score
  const freedomScore = Math.max(0, 100 - (params.cityLockScore * 0.5 + (100 - params.careerStability) * 0.3 + cashFlowPressure * 0.2));


  // 2. Multiverse Simulation (30 Years)
  // ------------------------------------------------------------------
  const multiversePath: MultiversePoint[] = [];
  
  let currentHoldValue = params.currentPrice;
  let currentLoan = params.remainingMortgage;
  // Sell Now: Initial Cash = Price * (1 - cost) - Mortgage
  const sellingCostRatio = 0.04; // 1% tax + 2% agent + 1% misc
  let currentSellNowCash = params.currentPrice * (1 - sellingCostRatio) - params.remainingMortgage;
  
  // Sell Later (3 years default)
  const sellLaterYear = 3;

  for (let year = 0; year <= 30; year++) {
    // --- Path A: HOLD ---
    const holdNetWorth = currentHoldValue - currentLoan;
    
    // Cash Flow: Rent - Mortgage - Holding
    // Rent grows with inflation/appreciation (simplified to appreciation rate * 0.5)
    const annualRent = currentHoldValue * (params.rentalYield / 100);
    const annualMortgage = standardMonthlyPayment * 12 / 10000; 
    const annualHolding = params.holdingCostPerYear * Math.pow(1.02, year); // 2% inflation on costs
    const holdCashFlow = (annualRent - annualMortgage * 10000 / 10000 - annualHolding) / 12 * 10000;

    // --- Path B: SELL NOW ---
    // Cash grows at investmentReturnRate
    const sellNowNetWorth = currentSellNowCash * Math.pow(1 + params.investmentReturnRate / 100, year);
    const sellNowCashFlow = (sellNowNetWorth * 10000 * (params.investmentReturnRate / 100)) / 12;

    // --- Path C: SELL LATER ---
    let sellLaterNetWorth = 0;
    if (year < sellLaterYear) {
        sellLaterNetWorth = holdNetWorth; // Simplified, ignores transaction friction until sale
    } else if (year === sellLaterYear) {
         // Execute Sale
         sellLaterNetWorth = currentHoldValue * (1 - sellingCostRatio) - currentLoan;
    } else {
         // Grow Cash
         // Value at year 3 * growth^(year-3)
         const cashAtSale = (params.currentPrice * Math.pow(1 + params.appreciationRate/100, sellLaterYear)) * (1 - sellingCostRatio) 
                            - (currentLoan * 1.05); // Rough guess loan principal hasn't dropped much? Let's use loop variable
         // Actually we should use the state variable at year 3. 
         // For simplicity in this non-state loop, we approximate:
         const valAtSale = params.currentPrice * Math.pow(1 + params.appreciationRate/100, sellLaterYear);
         // Recursion is tricky here without strict state tracking for Path C. 
         // Let's use a simpler proxy: It tracks Hold until year 3, then behaves like Sell Now.
         const prevObj = multiversePath[sellLaterYear];
         if (prevObj) {
            sellLaterNetWorth = prevObj.sellLaterNetWorth * (1 + params.investmentReturnRate/100);
         } else {
             // Fallback for logic check
             sellLaterNetWorth = holdNetWorth; 
         }
    }

    // Fix Sell Later Logic properly for loop
    if (year > sellLaterYear) {
        // Look back at year 3 value
        const saleYearVal = multiversePath[sellLaterYear].sellLaterNetWorth;
        sellLaterNetWorth = saleYearVal * Math.pow(1 + params.investmentReturnRate/100, year - sellLaterYear);
    } 

    multiversePath.push({
      year,
      holdNetWorth,
      sellNowNetWorth,
      sellLaterNetWorth,
      holdCashFlow,
      sellNowCashFlow
    });

    // Evolve Hold State
    currentHoldValue = currentHoldValue * (1 + params.appreciationRate / 100);
    
    // Amortization (Principal reduction)
    const interestPart = currentLoan * 10000 * r;
    const principalPart = standardMonthlyPayment - interestPart;
    currentLoan = Math.max(0, currentLoan - principalPart / 10000);
  }

  // Calculate Optimal
  const horizon = 10; // Check 10 year horizon for decision
  const optimalPath = 
    multiversePath[horizon].sellNowNetWorth > multiversePath[horizon].holdNetWorth 
      ? 'SELL_NOW' 
      : 'HOLD';

  // 3. Price Illusion (Detailed Breakdown)
  // ------------------------------------------------------------------
  // Assuming 5 years ownership for "Past" calculation
  const pastYears = 5;
  const originalLoan = params.originalPrice * 0.7; // 30% down
  const interestPaid = (originalLoan * (params.interestRate / 100)) * pastYears; // Simple interest approx
  const holdingCosts = params.holdingCostPerYear * pastYears;
  const inflationLoss = (params.originalPrice * 0.3) * (Math.pow(1.025, pastYears) - 1); // 2.5% inflation on downpayment
  
  const totalCost = params.originalPrice + interestPaid + holdingCosts + inflationLoss;
  const sellPrice = params.currentPrice;
  const realProfit = sellPrice - totalCost;

  // 4. Time Evasion (Wait 1 Year Detailed)
  // ------------------------------------------------------------------
  const oneYearAppreciation = params.currentPrice * (params.appreciationRate / 100);
  const oneYearInterest = params.remainingMortgage * (params.interestRate / 100);
  const oneYearHolding = params.holdingCostPerYear;
  const opportunityCost = (params.currentPrice - params.remainingMortgage) * (params.investmentReturnRate / 100);
  
  const gainOrLoss = oneYearAppreciation - (oneYearInterest + oneYearHolding + opportunityCost);


  // 5. Dynamic Regret Prob (Base calculation)
  // ------------------------------------------------------------------
  // Re-calculated in component usually for dynamic sliders, but provide base here
  const baseRegret = calculateRegret(params.appreciationRate, params.regretFearScore);

  return {
    dtiRatio: realDti,
    cashFlowPressure,
    freedomScore,
    multiversePath,
    optimalPath,
    illusionBreakdown: {
      buyPrice: params.originalPrice,
      interestPaid,
      holdingCosts,
      inflationLoss,
      totalCost,
      sellPrice,
      realProfit
    },
    cashAfterSale: currentSellNowCash,
    nextStepPotential: calculateNextStepPotential(currentSellNowCash),
    waitOneYearOutcome: {
      gainOrLoss,
      riskExposure: cashFlowPressure, 
      recommendation: gainOrLoss > 0 ? 'WAIT' : 'SELL_NOW'
    },
    regretProb: baseRegret
  };
};

export const calculateRegret = (marketChange: number, fearScore: number) => {
    let regretSell = 20; 
    let regretHold = 20;

    // If market goes UP, you regret SELLING
    if (marketChange > 0) {
        regretSell += marketChange * 3; // +10% -> +30 regret
    } else {
        // If market goes DOWN, you regret HOLDING
        regretHold += Math.abs(marketChange) * 4; // -10% -> +40 regret (Loss aversion is stronger)
    }

    // Fear Score Personality (0-100)
    // High fear score amplifies the negative outcome
    regretSell += (fearScore / 100) * 10;
    regretHold += (fearScore / 100) * 10;
    
    // Normalize to 100 max for each
    return {
        regretSell: Math.min(95, Math.max(5, regretSell)),
        regretHold: Math.min(95, Math.max(5, regretHold))
    };
}


function calculateNextStepPotential(cash: number): { zh: string; en: string } {
    if (cash < 50) return {
        zh: "现金流紧张：建议优先偿还高息债务，构建6个月紧急备用金。暂不建议大额投资。",
        en: "Tight Cash Flow: Prioritize paying off high-interest debt and building a 6-month emergency fund. Large investments not recommended."
    };
    if (cash < 200) return {
        zh: "刚需置换：可作为首付置换总价约 300-500万 的更优质潜力房产，或配置稳健理财。",
        en: "Replacement Needs: Can serve as down payment for a better property (300-500w range) or stable financial investments."
    };
    if (cash < 500) return {
        zh: "改善/投资：资金较为充裕，建议分散配置：40%稳健理财 + 30%核心城市房产 + 30%股票/基金。",
        en: "Improvement/Invest: Well-funded. Suggested allocation: 40% stable wealth pot, 30% core city property, 30% stocks/funds."
    };
    if (cash < 1000) return {
        zh: "财富自由起步：可考虑全球资产配置（美股/通过REITs持有海外房产）以及家族信托架构。",
        en: "Wealth Freedom Start: Consider global asset allocation (US stocks/Global REITs) and family trust architecture."
    };
    return {
        zh: "高净值阶段：建议咨询专业税务与法务顾问，进行家族财富传承与全球税务筹划。",
        en: "High Net Worth: Consult professional tax and legal advisors for family wealth inheritance and global tax planning."
    };
}
