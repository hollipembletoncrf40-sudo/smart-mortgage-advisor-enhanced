
export interface LifeLeverageInput {
    // A. Income Matrix
    primaryIncome: number;
    sideIncome: number;
    passiveIncome: number;
    incomeGrowthRate: number; // %
    equityValue: number; // Stock options, RSUs etc.
    taxRate: number; // % effective tax rate

    // B. Time Allocation
    workHoursPerDay: number;
    commuteHoursPerDay: number;
    learningHoursPerWeek: number;
    sleepHoursPerDay: number;

    // C. Financial Base
    liquidAssets: number;
    illiquidAssets: number;
    totalDebt: number;
    debtInterestRate: number; // %
    monthlyLivingCost: number;
    expectedReturn: number; // % expected annual investment return
    targetSavingsRate: number; // % of income to save

    // D. Leverage Coefficients
    skillType: 'LABOR' | 'EXPERT' | 'MANAGER' | 'CAPITALIST';
    employeeCount: number;
    digitalTraffic: number;
    reinvestmentRate: number; // %
    aiRisk: 'LOW' | 'MEDIUM' | 'HIGH';

    // E. Personal Context
    age: number;
    industry: 'TECH' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'CREATIVE' | 'OTHER';
    healthScore: number; // 1-100
}

export interface DetailedLeverageMetrics {
    summary: {
        totalScore: number;
        level: string;
        description: string;
    };
    timeMoney: {
        laborRatio: number; // % of income from labor
        passiveRatio: number; // % of income from assets
        realHourlyWage: number;
        passiveHourlyWage: number;
        interpretation: string;
    };
    decay: {
        yearsToObsolescence: number;
        aiProb: number; // %
    };
    replicability: {
        score: number; // 0-100
        leverageFactor: number;
        type: 'Linear' | 'Exponential';
    };
    cashflow: {
        monthlyFree: number;
        reinvestAmount: number;
        freedomVelocity: number; // Years to freedom
        survivalCost: number;
        runway: number; // Months
    };
    personalIPO: {
        valuation: number;
        peRatio: number;
        potential: number; // 0-100
    };
    vector: {
        time: number[];
        netWorth: number[];
        passiveIncome: number[];
    };
}

export const calculateLeverageMetrics = (input: LifeLeverageInput, language: 'ZH' | 'EN'): DetailedLeverageMetrics => {
    
    // 1. Basic Income Calculations
    const monthlyLaborIncome = input.primaryIncome + input.sideIncome;
    const monthlyTotalIncome = monthlyLaborIncome + input.passiveIncome;
    
    // 2. Real Hourly Wage
    const monthlyWorkHours = (input.workHoursPerDay + input.commuteHoursPerDay) * 21.75; // ~21.75 working days/mo
    const realHourlyWage = monthlyWorkHours > 0 ? Math.round(monthlyLaborIncome / monthlyWorkHours) : 0;
    
    const passiveHourlyWage = Math.round(input.passiveIncome / (24 * 30)); // 24/7 income

    const laborRatio = monthlyTotalIncome > 0 ? Math.round((monthlyLaborIncome / monthlyTotalIncome) * 100) : 100;
    const passiveRatio = 100 - laborRatio;

    // 3. Human Capital Decay & AI Risk
    let baseHalfLife = 5; // Years
    if (input.skillType === 'EXPERT') baseHalfLife = 7;
    if (input.skillType === 'MANAGER') baseHalfLife = 10;
    if (input.skillType === 'CAPITALIST') baseHalfLife = 20;

    // Learning extends half-life
    const halfLifeExtension = input.learningHoursPerWeek * 0.5;
    
    // AI Risk reduces half-life
    let aiReduction = 0;
    let aiProb = 10;
    if (input.aiRisk === 'MEDIUM') { aiReduction = 2; aiProb = 45; }
    if (input.aiRisk === 'HIGH') { aiReduction = 4; aiProb = 85; }
    
    const yearsToObsolescence = Math.max(1, Math.round(baseHalfLife + halfLifeExtension - aiReduction));

    // 4. Replicability & Leverage
    let leverageFactor = 1;
    if (input.skillType === 'EXPERT') leverageFactor = 1.5;
    if (input.skillType === 'MANAGER') leverageFactor = 1 + (input.employeeCount * 0.5); // Management leverage
    if (input.skillType === 'CAPITALIST') leverageFactor = 2 + (input.employeeCount * 0.2) + (input.digitalTraffic * 0.001); // Capital leverage
    
    // Digital leverage boost
    if (input.digitalTraffic > 1000) leverageFactor += Math.log(input.digitalTraffic) * 0.5;

    const replicabilityScore = Math.min(100, Math.round(leverageFactor * 10));
    const leverageType = input.skillType === 'CAPITALIST' || input.digitalTraffic > 5000 ? 'Exponential' : 'Linear';

    // 5. Cashflow Power
    const monthlyDebtPayment = (input.totalDebt * (input.debtInterestRate / 100)) / 12;
    const monthlyFree = Math.round(monthlyTotalIncome - input.monthlyLivingCost - monthlyDebtPayment);
    const reinvestAmount = Math.round(monthlyFree * (input.reinvestmentRate / 100));
    
    const passiveGap = Math.max(0, input.monthlyLivingCost - input.passiveIncome);
    // Rough estimate: how many years to cover gap with reinvestment at 8% CAGR
    let freedomVelocity = 99;
    if (reinvestAmount > 0) {
        // Simple FV solve or approximation. 
        // Need to generate X passive income. X = Capital * 0.04 (Safe withdrawal).
        // Target Capital = Gap / 0.04.
        const targetCapital = passiveGap * 12 * 25;
        // Years = log(Target / MonthlyContrib...) - complicated. Use simple line for dashboard.
        // Approx: Years = Target / (Reinvest * 12) (Ignoring compound for simplicity or assume it covers inflation)
        freedomVelocity = Math.round((targetCapital / (reinvestAmount * 12)) * 10) / 10;
    }
    if (passiveGap <= 0) freedomVelocity = 0;

    const runway = input.monthlyLivingCost > 0 
        ? Math.round(input.liquidAssets / (input.monthlyLivingCost - input.passiveIncome)) // Considering passive helps runway
        : 99;
    
    const displayRunway = runway < 0 ? 999 : runway; // If passive > cost, infinite runway

    // 6. Personal IPO Valuation
    // Valuation = (Annual Labor Income * Labor Multiple) + (Annual Passive Income * Passive Multiple)
    const laborMultiple = Math.max(1, (baseHalfLife + halfLifeExtension) * 0.5 * (leverageFactor / 2));
    const passiveMultiple = 25; // 4% rule inverse
    const valuation = Math.round((monthlyLaborIncome * 12 * laborMultiple) + (monthlyLaborIncome * 12 * 0) + (input.liquidAssets)); // Wait, standard valuation model

    // Let's us a simplified model:
    // Value = Net Assets + Discounted Future Free Cashflow (simplified as 10-15x multiple based on leverage)
    const peRatio = Math.round(10 + leverageFactor + (yearsToObsolescence * 0.5));
    const personalValuation = Math.round(input.liquidAssets + (input.illiquidAssets - input.totalDebt) + (monthlyTotalIncome * 12 * peRatio * 0.5));

    // 7. Vector Simulation (10 Years)
    const timeToProject = 10;
    const vectorTime = Array.from({length: timeToProject + 1}, (_, i) => 2024 + i);
    const vectorNW: number[] = [input.liquidAssets + input.illiquidAssets - input.totalDebt];
    const vectorPassive: number[] = [input.passiveIncome];

    let currentNW = vectorNW[0];
    let currentPassive = input.passiveIncome;
    let currentIncome = monthlyTotalIncome;

    for (let i = 1; i <= timeToProject; i++) {
        const yearlyFree = (currentIncome - input.monthlyLivingCost) * 12;
        const investable = yearlyFree * (input.reinvestmentRate / 100);
        
        // Growth (simplified 7% market return)
        const investmentGrowth = (currentNW) * 0.07;
        currentNW += investable + investmentGrowth;
        
        // Passive Income Growth (4% yield on new capital)
        currentPassive += (investable * 0.04) / 12; 
        
        // Active Income Growth
        const laborGrowth = (currentIncome - currentPassive) * (input.incomeGrowthRate / 100);
        currentIncome += laborGrowth;

        vectorNW.push(Math.round(currentNW));
        vectorPassive.push(Math.round(currentPassive));
    }

    // 8. Total Score (0-100)
    let score = 0;
    score += Math.min(30, (input.passiveIncome / input.monthlyLivingCost) * 30); // Financial Freedom (30pts)
    score += Math.min(20, (realHourlyWage / 50) * 20); // High Hourly Wage (20pts) (Assuming $50/hr is good benchmark baseline)
    score += Math.min(20, replicabilityScore / 5); // Leverage (20pts)
    score += Math.min(15, yearsToObsolescence); // Durability (15pts)
    score += Math.min(15, (displayRunway / 24) * 15); // Safety (15pts)
    if (displayRunway > 24) score += 5; // Bonus

    const totalScore = Math.min(100, Math.round(score));
    
    let level = 'Rat Race';
    if (totalScore > 40) level = 'Side Hustler';
    if (totalScore > 60) level = 'Solopreneur';
    if (totalScore > 80) level = 'Capitalist';
    if (totalScore > 95) level = 'Sovereign';

    return {
        summary: {
            totalScore,
            level,
            description: language === 'ZH' ? '继续保持' : 'Keep going'
        },
        timeMoney: {
            laborRatio,
            passiveRatio,
            realHourlyWage,
            passiveHourlyWage,
            interpretation: laborRatio > 80 ? (language === 'ZH' ? '手停口停' : 'Active Dependent') : (language === 'ZH' ? '资产驱动' : 'Asset Driven')
        },
        decay: {
            yearsToObsolescence,
            aiProb
        },
        replicability: {
            score: replicabilityScore,
            leverageFactor: Math.round(leverageFactor * 10) / 10,
            type: leverageType
        },
        cashflow: {
            monthlyFree,
            reinvestAmount,
            freedomVelocity,
            survivalCost: input.monthlyLivingCost,
            runway: displayRunway
        },
        personalIPO: {
            valuation: personalValuation,
            peRatio,
            potential: Math.min(100, Math.round(peRatio * 2))
        },
        vector: {
            time: vectorTime,
            netWorth: vectorNW,
            passiveIncome: vectorPassive
        }
    };
};
