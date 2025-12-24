import { BuyTargetParams } from '../types';

export interface FreedomParams {
    careerMobility: number; // 0-100: How easy is it to find a job elsewhere?
    familyDependency: number; // 0-100: Burden of family (kids/elderly)
    cityTierDiff: 'SAME' | 'DOWN' | 'UP'; // Moving to same/lower/higher tier city
    riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
    opportunityCostRate: number; // Investment yield % (e.g. 5%)
    expectedSalaryGrowth: number; // Annual %
    industryVolatility: number; // 0-100: How stable is the income?
    healthScore: number; // 0-100: Physical resilience
}

export interface DetailedFreedomMetrics {
    friction: {
        score: number;
        details: {
            transactionCost: number; // Selling cost
            timeCost: number; // Months to sell
            relocationCost: number; // Moving/settling
            networkLoss: number; // Intangible loss score
        };
        interpretation: string;
    };
    defaultImpact: {
        score: number;
        netWorthChart: { year: number; netWorth: number; scenario: 'NORMAL' | 'DEFAULT' }[];
        creditRepairYears: number;
        socialStigmaScore: number; // 0-100
        careerDamageScore: number; // 0-100
    };
    reboot: {
        score: number;
        radarData: { subject: string; A: number; fullMark: number }[]; // For Radar Chart
        liquidRunway: number; // Months
        skillTransferability: number; // 0-100
    };
    lockIn: {
        score: number;
        lostPaths: { name: string; probability: number; status: 'LOCKED' | 'RISKY' | 'OPEN' }[];
        opportunityCostAccumulated: number; // 30 years
    };
    illusion: {
        realScore: number;
        illusionScore: number;
        bubbleRisk: number; // 0-100
        cashFlowStability: number;
    };
    opportunity: {
        score: number;
        absorptionCapacity: number; // max income drop % allowed
        actionWindow: number; // Months to execute a pivot
        maxStartupCapital: number;
    };
    mental: {
        score: number;
        stressLevel: number;
        sleepQuality: number;
    };
    antiFragility: {
        score: number;
        resilienceScore: number;
        stressExposure: number;
    };
    trajectory: {
        year: number;
        freedomScoreBuy: number; // Composite freedom score if buying
        freedomScoreRent: number; // Composite freedom score if renting & investing
    }[];
}

export const calculateDetailedFreedomMetrics = (
    baseParams: BuyTargetParams, 
    freedomParams: FreedomParams,
    language: 'ZH' | 'EN'
): DetailedFreedomMetrics => {
    // Basics
    const houseValue = baseParams.totalPrice * 10000;
    const loanAmount = houseValue * (1 - baseParams.downPaymentRatio / 100);
    // Safe access with defaults for properties not in strict type
    const loanTerm = (baseParams as any).loanTerm || 30;
    const rentalYield = (baseParams as any).rentalYield || 1.5;

    // Monthly payment approximation
    const annualRate = 0.045; // 4.5%
    const monthlyRate = annualRate / 12;
    const n = loanTerm * 12;
    const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
    
    const totalMonthlyExpense = baseParams.monthlyExpense + monthlyPayment;
    const liquidAssets = baseParams.currentSavings * 10000 - (houseValue * baseParams.downPaymentRatio / 100);
    const dti = monthlyPayment / baseParams.monthlyIncome;

    // --- 1. Friction Details ---
    const mobilityFactor = (100 - freedomParams.careerMobility) / 100;
    const dependencyFactor = freedomParams.familyDependency / 100;
    const healthFactor = (100 - freedomParams.healthScore) / 100;
    
    // Increased weight for Health (from 10 to 20) and Dependency
    const frictionScore = Math.min(100, 
        (dti * 35) + 
        (mobilityFactor * 20) + 
        (dependencyFactor * 20) + 
        (healthFactor * 20) +
        (baseParams.marketHeat * 0.05)
    );
    
    // Details
    const transactionCost = houseValue * 0.06;
    const timeCost = baseParams.marketHeat > 80 ? 3 : baseParams.marketHeat < 40 ? 18 : 6;
    // Health impacts relocation cost (effort)
    const relocationCost = 50000 + (freedomParams.familyDependency * 2000) + (healthFactor * 30000); 
    const networkLoss = (100 - freedomParams.careerMobility) * 0.6;

    // --- 2. Default Impact ---
    const volScore = freedomParams.industryVolatility;
    // Make Default Impact sensitive to Industry Volatility directly
    // Base score from DTI + Volatility.
    // If Volatility is high (high risk), Default Impact is higher.
    const defaultRiskScore = (dti * 50) + (volScore * 0.5); 
    
    const fireSalePrice = houseValue * 0.7;
    const netAfterDefault = fireSalePrice - loanAmount - (houseValue * 0.05); 
    const isCatastrophic = netAfterDefault < -500000;
    
    const finalDefaultImpactScore = Math.min(100, defaultRiskScore + (isCatastrophic ? 20 : 0));
    
    const years = [0, 1, 3, 5, 10];
    const netWorthChart = years.map(y => ({
        year: y,
        netWorth: liquidAssets + (houseValue - loanAmount) * Math.pow(1.02, y) - (y === 0 ? 0 : 0), 
        scenario: 'NORMAL' as const
    }));
    
    // --- 3. Reboot Radar ---
    const capitalScore = Math.min(100, (liquidAssets / (totalMonthlyExpense * 12)) * 25);
    const skillScore = freedomParams.careerMobility;
    const networkScore = freedomParams.cityTierDiff === 'UP' ? 85 : freedomParams.cityTierDiff === 'SAME' ? 65 : 45;
    const healthScore = freedomParams.healthScore; 
    const debtBurdenScore = Math.max(0, 100 - (dti * 120));
    
    // Risk Tolerance affects Mindset Score directly
    const mindScore = freedomParams.riskTolerance === 'AGGRESSIVE' ? 90 : freedomParams.riskTolerance === 'MODERATE' ? 60 : 30;
    
    // Re-added mindScore to the weighted average so the total score changes
    const rebootScore = (capitalScore * 0.15 + skillScore * 0.15 + networkScore * 0.1 + healthScore * 0.2 + debtBurdenScore * 0.2 + mindScore * 0.2);

    // --- 4. Lock In ---
    const fixedCostRatio = totalMonthlyExpense / baseParams.monthlyIncome;
    const paths = [
        { name: language === 'ZH' ? '创业 (Startup)' : 'Startup', threshold: 0.3, risk: 'HIGH' },
        { name: language === 'ZH' ? '全职进修 (Study)' : 'Full-time Study', threshold: 0.2, risk: 'MEDIUM' },
        { name: language === 'ZH' ? '降薪转行 (Career Pivot)' : 'Career Pivot', threshold: 0.5, risk: 'LOW' },
        { name: language === 'ZH' ? '环球旅行 (Gap Year)' : 'Gap Year', threshold: 0.4, risk: 'MEDIUM' }
    ];
    const lostPaths = paths.map(p => ({
        name: p.name,
        probability: Math.max(0, 100 - (fixedCostRatio * 100 / p.threshold)), 
        status: fixedCostRatio > p.threshold * 1.5 ? 'LOCKED' : fixedCostRatio > p.threshold ? 'RISKY' : 'OPEN'
    } as const));

    const investmentYield = freedomParams.opportunityCostRate / 100;

    const appreciationRate = 0.02;
    const futureHouseValue = houseValue * Math.pow(1 + appreciationRate, 30);
    
    const alternativeFutureValue = (houseValue * baseParams.downPaymentRatio/100) * Math.pow(1 + investmentYield, 30) + 
                                   (monthlyPayment * 12 * ((Math.pow(1 + investmentYield, 30) - 1) / investmentYield)); 
    
    const opportunityCostAccumulated = Math.max(0, alternativeFutureValue - (futureHouseValue - 0)); 
    
    // Lock-in Score now considers Opportunity Cost (Yield)
    // If you could make 10% elsewhere, buying this house "locks" you in much harder financially.
    const oppCostPenalty = Math.min(30, (freedomParams.opportunityCostRate - 3) * 5); // Base 3%, every 1% more adds 5 penalty
    const lockInScore = Math.min(100, (fixedCostRatio * 100) + Math.max(0, oppCostPenalty));

    // --- 5. Illusion vs Real ---
    const realScore = Math.min(100, (baseParams.monthlyIncome - totalMonthlyExpense) / baseParams.monthlyIncome * 200);
    const illusionScore = Math.min(100, baseParams.marketHeat * 0.5 + (volScore) * 0.5); 
    const bubbleRisk = rentalYield < 1.5 ? 90 : rentalYield < 2.5 ? 60 : 30;

    // --- 6. Opportunity ---
    const maxDrop = Math.max(0, (baseParams.monthlyIncome - totalMonthlyExpense) / baseParams.monthlyIncome);
    
    // --- 7. Trajectory (New) ---
    const trajectory = [];
    for (let y = 0; y <= 30; y += 5) {
        const loanBal = loanAmount * (Math.pow(1 + monthlyRate, n) - Math.pow(1 + monthlyRate, y * 12)) / (Math.pow(1 + monthlyRate, n) - 1);
        const equity = (houseValue * Math.pow(1.02, y)) - loanBal; // House assumes 2% growth
        const buyFreedom = Math.min(100, (equity / houseValue * 50) + (y * 1.5)); 

        const rentAssets = (houseValue * baseParams.downPaymentRatio/100) * Math.pow(1 + investmentYield, y); // Rent assumes user yield
        const rentFreedom = Math.min(100, 50 + (rentAssets / houseValue * 40));

        trajectory.push({
            year: y,
            freedomScoreBuy: Math.round(buyFreedom),
            freedomScoreRent: Math.round(rentFreedom)
        });
    }

    // --- 8. Mental Bandwidth (New) ---
    // Health (40%) + Low Debt (30%) + Low Volatility (30%)
    const mentalScore = (freedomParams.healthScore * 0.4) + (Math.max(0, 100 - dti * 200) * 0.3) + ((100 - volScore) * 0.3);

    // --- 9. Anti-Fragility (New) ---
    // Ability to gain from disorder. 
    // Positives: High Liquidity, High Mobility, High Yield (Diversified income).
    // Negatives: High Fixed Debt, Single Income Source (Volatility).
    const liquidityRatio = liquidAssets / totalMonthlyExpense; // Months of runway
    const liquidityScore = Math.min(100, liquidityRatio * 5); // 20 months = 100
    
    // If industry is volatile, you need more mobility and liquidity to be anti-fragile.
    const resilience = (liquidityScore * 0.4) + (freedomParams.careerMobility * 0.3) + (healthFactor * 100 * 0.3);
    const stress = (dti * 100 * 0.5) + (freedomParams.industryVolatility * 0.5);
    
    // Bonus for high investment yield (income diversity)
    const diversityBonus = (freedomParams.opportunityCostRate - 3) * 5; 
    
    const antiFragilityScore = Math.max(0, Math.min(100, resilience - stress + diversityBonus + 20)); // Base +20
    
    return {
        friction: {
            score: Math.round(frictionScore),
            details: {
                transactionCost,
                timeCost,
                relocationCost,
                networkLoss
            },
            interpretation: frictionScore > 70 ? (language === 'ZH' ? '⚠️ 高度固化：像老树一样难以移植' : 'High Friction: Hard to transplant') : '✅ Flexible'
        },
        defaultImpact: {
            score: Math.round(finalDefaultImpactScore),
            netWorthChart,
            creditRepairYears: 5,
            socialStigmaScore: 80,
            careerDamageScore: 60 + Math.round(volScore * 0.4)
        },
        reboot: {
            score: Math.round(rebootScore),
            radarData: [
                { subject: language === 'ZH' ? '资本储备' : 'Capital', A: capitalScore, fullMark: 100 },
                { subject: language === 'ZH' ? '技能迁移' : 'Skills', A: skillScore, fullMark: 100 },
                { subject: language === 'ZH' ? '心态韧性' : 'Mindset', A: mindScore, fullMark: 100 },
                { subject: language === 'ZH' ? '债务包袱' : 'Debt Load', A: 100 - (dti*100), fullMark: 100 },
                { subject: language === 'ZH' ? '人脉网络' : 'Network', A: networkScore, fullMark: 100 },
            ],
            liquidRunway: parseFloat((liquidAssets / totalMonthlyExpense).toFixed(1)),
            skillTransferability: freedomParams.careerMobility
        },
        lockIn: {
            score: Math.round(lockInScore), // Updated to use new logic
            lostPaths,
            opportunityCostAccumulated: houseValue * Math.pow(1 + freedomParams.opportunityCostRate/100, 30) - houseValue // Roughly
        },
        illusion: {
            realScore: Math.round(realScore),
            illusionScore: Math.round(illusionScore),
            bubbleRisk,
            cashFlowStability: 100 - (dti * 100)
        },
        opportunity: {
            score: Math.round(maxDrop * 100 * 2),
            absorptionCapacity: parseFloat((maxDrop * 100).toFixed(1)),
            actionWindow: liquidAssets > 0 ? parseFloat((liquidAssets / totalMonthlyExpense).toFixed(1)) : 0,
            maxStartupCapital: liquidAssets
        },
        mental: {
            score: Math.round(mentalScore),
            stressLevel: Math.round(100 - mentalScore),
            sleepQuality: Math.round(Math.max(0, mentalScore * 0.8 + 20)) // Mock correlation
        },
        antiFragility: {
            score: Math.round(antiFragilityScore),
            resilienceScore: Math.round(resilience),
            stressExposure: Math.round(stress)
        },
        trajectory
    };
};
