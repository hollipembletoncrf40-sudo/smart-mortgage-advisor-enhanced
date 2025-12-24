import { BuyTargetParams, BuyResult, BuyCountdownItem, DelayCostAnalysis, ImpulseRadarData, AntiRegretRisk } from '../types';

export const calculateBuyDeduction = (params: BuyTargetParams, language: 'ZH' | 'EN' = 'ZH'): BuyResult => {
    // 1. Goal Deduction (Saving for Down Payment)
    const downPaymentNeeded = params.totalPrice * (params.downPaymentRatio / 100);
    const gap = Math.max(0, downPaymentNeeded - params.currentSavings);
    
    // Simple FV calc: FutureValue = PV * (1+r)^n + PMT * [((1+r)^n - 1) / r]
    // Here we solve for PMT (Monthly Savings) given r=3% (assume safe return) 
    // OR solve for r given PMT. 
    // Let's assume user saves (Income - Expense) monthly.
    const monthlySavingsAvailable = Math.max(0, params.monthlyIncome - params.monthlyExpense);
    const annualSavings = monthlySavingsAvailable * 12 / 10000; // in Wan
    
    // Check if achievable safely
    const years = params.planYears;
    const parentalSupport = params.parentalSupport || 0;
    const projectedSavings = params.currentSavings + parentalSupport + (annualSavings * years);
    
    const isAchievable = projectedSavings >= downPaymentNeeded;
    
    // Calculate Required Annual Return to bridge gap if not achievable
    // Simplified: (Gap / Years) / Principal approx?
    // Let's iterate or use simple approximation.
    // If savings are enough, required return is 0.
    let requiredReturn = 0;
    if (!isAchievable) {
        // Gap needs to be filled by investment return on Current Savings + Monthly Contributions
        // This is complex iteratively, let's simplify: 
        // needed - projected = shortage. 
        // return needed on (current + annual*years/2) base.
        const shortage = downPaymentNeeded - projectedSavings;
        const averageCapital = params.currentSavings + (annualSavings * years) / 2;
        if (averageCapital > 0) {
             requiredReturn = (shortage / years / averageCapital) * 100;
        } else {
             requiredReturn = 999; // Impossible
        }
    }

    // 2. Delay Cost Analysis (7 Days)
    const delayAnalysis: DelayCostAnalysis = {
        waitDays: 7,
        probPriceRise: 45, // Arbitrary market heat - related to params.marketHeat?
        probPriceDrop: 20,
        paymentImpact: (params.totalPrice * (1 - params.downPaymentRatio/100) * 10000) * (0.0005 / 12), // approx impact of 0.05% rate rise
        clarityValue: 85 // High value of waiting
    };

    // 3. Impulse Radar
    // Map 0-100 scores to Radar Data
    const impulseRadar: ImpulseRadarData[] = language === 'ZH' ? [
        { subject: '焦虑 (Anxiety)', A: params.anxietyScore, fullMark: 100 },
        { subject: '踏空恐惧 (FOMO)', A: params.fomoScore, fullMark: 100 },
        { subject: '市场热度 (Heat)', A: params.marketHeat, fullMark: 100 },
        { subject: '资金紧绷 (Stretch)', A: params.financialStretch, fullMark: 100 },
        { subject: '决策速度 (Speed)', A: params.decisionSpeed, fullMark: 100 },
    ] : [
        { subject: 'Anxiety', A: params.anxietyScore, fullMark: 100 },
        { subject: 'FOMO', A: params.fomoScore, fullMark: 100 },
        { subject: 'Market Heat', A: params.marketHeat, fullMark: 100 },
        { subject: 'Fin. Stretch', A: params.financialStretch, fullMark: 100 },
        { subject: 'Speed', A: params.decisionSpeed, fullMark: 100 },
    ];
    
    // Calculate Area or Average to determine "Impulsiveness"
    const avgScore = (params.anxietyScore + params.fomoScore + params.marketHeat + params.financialStretch + params.decisionSpeed) / 5;
    const isImpulsive = avgScore > 60;

    // 4. Anti-Regret Risks
    const risks: AntiRegretRisk[] = language === 'ZH' ? [
        {
            id: '1',
            riskTitle: '现金流断裂风险 (Cash Flow Break)',
            probability: '15%',
            severity: 'high',
            description: '如果第3年利率上涨1%，月供将超过收入的55%，导致生活质量骤降。'
        },
        {
            id: '2',
            riskTitle: '资产滞销风险 (Illiquidity)',
            probability: '30%',
            severity: 'medium',
            description: '该区域挂牌量处于历史高位，若急需用钱，平均成交周期可能超过10个月。'
        },
        {
            id: '3',
            riskTitle: '职业波动冲击 (Career Shock)',
            probability: 'Low',
            severity: 'high',
            description: '房贷基于当前高薪设定，若行业下行收入减少30%，将产生负向现金流。'
        }
    ] : [
        {
            id: '1',
            riskTitle: 'Cash Flow Break Risk',
            probability: '15%',
            severity: 'high',
            description: 'If rates rise 1% in Year 3, monthly payment > 55% income, drastically lowering quality of life.'
        },
        {
            id: '2',
            riskTitle: 'Illiquidity Risk',
            probability: '30%',
            severity: 'medium',
            description: 'Listings are at historic highs. If you need urgent cash, selling might take > 10 months.'
        },
        {
            id: '3',
            riskTitle: 'Career Shock Risk',
            probability: 'Low',
            severity: 'high',
            description: 'Mortgage is based on current high salary. If industry downturn drops income by 30%, cash flow turns negative.'
        }
    ];

    return {
        requiredReturn,
        monthlySavingsNeeded: (downPaymentNeeded - params.currentSavings) / (years * 12) * 10000,
        isAchievable,
        gap,
        delayAnalysis,
        impulseRadar,
        isImpulsive,
        risks
    };
};
