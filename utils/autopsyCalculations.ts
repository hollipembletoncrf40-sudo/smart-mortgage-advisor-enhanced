import { BuyTargetParams } from '../types';

export interface FailureReason {
    id: string;
    title: string;
    probability: number; // 0-100
    description: string;
    severity: 'fatal' | 'critical' | 'warning';
}

export interface AssumptionScenario {
    id: string;
    name: string;
    active: boolean;
    impact: {
        assets: number; // % change
        cashFlow: number; // % change
        freedom: number; // score change
    };
}

export interface ReplayEvent {
    year: number;
    title: string;
    description: string;
    type: 'normal' | 'warning' | 'fatal';
    isIrreversible: boolean;
}

export interface BiasMetric {
    name: string;
    score: number; // 0-100
    verdict: string;
}

export interface DeathCertificate {
    cause: string;
    timeOfDeath: string;
    trigger: string;
    icon: string; // emoji
}

export const calculateAutopsyReport = (params: BuyTargetParams, language: 'ZH' | 'EN' = 'ZH') => {
    // 1. Failure Reasons
    const incomeToLoanRatio = params.monthlyIncome > 0 ? (params.totalPrice * 0.7 * 10000 * 0.0045) / params.monthlyIncome : 0; // Approx monthly payment / income
    
    const reasons: FailureReason[] = [];
    
    // Check Cash Flow
    if (incomeToLoanRatio > 0.5) {
        reasons.push({
            id: 'cash_flow',
            title: language === 'ZH' ? '现金流窒息 (Cash Flow Suffocation)' : 'Cash Flow Suffocation',
            probability: Math.min(95, incomeToLoanRatio * 100 + 20),
            description: language === 'ZH' 
                ? `月供占收入 ${(incomeToLoanRatio * 100).toFixed(0)}%，一旦收入波动，立即崩盘。`
                : `Monthly payment is ${(incomeToLoanRatio * 100).toFixed(0)}% of income. Any income disruption = immediate collapse.`,
            severity: 'fatal'
        });
    }

    // Check Liquidity
    if (params.marketHeat < 40) {
        reasons.push({
            id: 'liquidity_lock',
            title: language === 'ZH' ? '流动性冻结 (Liquidity Freeze)' : 'Liquidity Freeze',
            probability: 80,
            description: language === 'ZH' 
                ? '市场极冷，想卖卖不掉，急需用钱时资产变废纸。'
                : 'Market is ice cold. Cannot sell when needed. Asset becomes worthless paper.',
            severity: 'critical'
        });
    }

    // Check FOMO
    if (params.fomoScore > 70) {
         reasons.push({
            id: 'emotional_buy',
            title: language === 'ZH' ? '情绪化买入 (Emotional Entry)' : 'Emotional Entry',
            probability: params.fomoScore,
            description: language === 'ZH' 
                ? '被焦虑驱动买入，大概率买在高点或买错板块。'
                : 'Anxiety-driven purchase. High probability of buying at peak or wrong area.',
            severity: 'warning'
        });
    }
    
    // Fill up to 5
    if (reasons.length < 5) {
        reasons.push({
             id: 'rate_risk',
             title: language === 'ZH' ? '利率灰犀牛 (Rate Shock)' : 'Rate Shock',
             probability: 30,
             description: language === 'ZH' 
                 ? '长期利率若反转，月供可能激增。'
                 : 'If long-term rates reverse, monthly payments could surge.',
             severity: 'warning'
        });
        reasons.push({
            id: 'opportunity_cost',
            title: language === 'ZH' ? '机会成本黑洞 (Opportunity Cost)' : 'Opportunity Cost Black Hole',
            probability: 45,
            description: language === 'ZH' 
                ? '首付锁死在房子里，错失其他资产增值机会。'
                : 'Down payment locked in property, missing other asset growth opportunities.',
            severity: 'warning'
        });
    }

    // 2. Regret Curve Data (0-10 years)
    const regretData = Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        // Peak regret usually at year 3-4 when renovation novelty wears off and maintenance/payments bite
        let regretScore = 10; 
        if (year <= 2) regretScore = 20 + year * 5; // Honeymoon phase fading
        if (year === 3 || year === 4) regretScore = 85; // The Peak
        if (year > 5) regretScore = 50; // Acceptance

        // Adjust by params
        if (params.financialStretch > 80) regretScore += 10;

        return { year: `Year ${year}`, score: Math.min(100, regretScore) };
    });

    // 3. Bias Metrics (Bilingual labels for radar chart)
    const biasMetrics: BiasMetric[] = [
        { name: language === 'ZH' ? '锚定偏差' : 'Anchoring', score: params.totalPrice > 500 ? 80 : 40, verdict: language === 'ZH' ? '被高价洗脑' : 'Price-anchored' },
        { name: language === 'ZH' ? '从众效应' : 'Herding', score: params.fomoScore, verdict: language === 'ZH' ? '随波逐流' : 'Following crowd' },
        { name: language === 'ZH' ? '过度乐观' : 'Optimism', score: params.anxietyScore < 30 ? 90 : 40, verdict: language === 'ZH' ? '盲目自信' : 'Overconfident' },
        { name: language === 'ZH' ? '沉没成本' : 'Sunk Cost', score: 60, verdict: language === 'ZH' ? '难以割舍' : 'Cannot let go' },
    ];
    
    const unreliabilityScore = (biasMetrics.reduce((acc, cur) => acc + cur.score, 0) / 4).toFixed(0);

    // 4. Death Certificate (Bilingual)
    const topReason = reasons.sort((a,b) => b.probability - a.probability)[0];
    const deathCert: DeathCertificate = {
        cause: topReason ? topReason.title.split('(')[0].trim() : (language === 'ZH' ? '未知' : 'Unknown'),
        timeOfDeath: language === 'ZH' ? '第 3.5 年' : 'Year 3.5',
        trigger: params.fomoScore > 70 
            ? (language === 'ZH' ? '群体焦虑 (Mass Anxiety)' : 'Mass Anxiety')
            : (language === 'ZH' ? '过度杠杆 (Over Leverage)' : 'Over Leverage'),
        icon: '🪦'
    };

    return {
        reasons: reasons.slice(0, 5),
        regretData,
        biasMetrics,
        unreliabilityScore,
        deathCert
    };
};

export const simulateScenario = (params: BuyTargetParams, activeScenarios: string[]) => {
    let assets = 100;
    let cashFlow = 100;
    let freedom = 100;

    if (activeScenarios.includes('income_drop')) {
        cashFlow -= 30; // Drop big
        freedom -= 40;
    }
    if (activeScenarios.includes('price_flat')) {
        assets -= 20; // Inflation adjusted loss
        freedom -= 10;
    }
    if (activeScenarios.includes('rate_hike')) {
        cashFlow -= 15;
    }
    if (activeScenarios.includes('expense_hike')) {
        cashFlow -= 20;
        freedom -= 10;
    }

    return { assets: Math.max(0, assets), cashFlow: Math.max(0, cashFlow), freedom: Math.max(0, freedom) };
};

export const getFailureTimeline = (language: 'ZH' | 'EN' = 'ZH') => {
    return [
        { 
            year: 0, 
            title: language === 'ZH' ? '签字成交' : 'Signed & Closed', 
            description: language === 'ZH' ? '不仅花光积蓄，还背上30年债务契约。' : 'Savings depleted. 30-year debt contract signed.', 
            type: 'normal', 
            isIrreversible: false 
        },
        { 
            year: 1, 
            title: language === 'ZH' ? '新鲜感消退' : 'Novelty Fades', 
            description: language === 'ZH' ? '发现通勤远、噪音大，装修款超支。' : 'Long commute, noise issues, renovation over budget.', 
            type: 'warning', 
            isIrreversible: false 
        },
        { 
            year: 2, 
            title: language === 'ZH' ? '装修入住' : 'Moving In', 
            description: language === 'ZH' ? '终于入住新家，但甲醛、漏水、邻里问题接踵而至。' : 'Finally moved in. But formaldehyde, leaks, neighbor issues emerge.', 
            type: 'warning', 
            isIrreversible: false 
        },
        { 
            year: 3, 
            title: language === 'ZH' ? '现金流承压' : 'Cash Crunch', 
            description: language === 'ZH' ? '孩子出生/工作变动，支出激增，收入瓶颈。' : 'New baby/job change. Expenses surge, income stagnates.', 
            type: 'critical', 
            isIrreversible: true 
        },
        { 
            year: 5, 
            title: language === 'ZH' ? '资产缩水' : 'Asset Shrinks', 
            description: language === 'ZH' ? '想置换发现挂牌半年无人问津，降价亏本。' : 'Cannot sell. Listed 6 months, no buyers. Must cut price.', 
            type: 'fatal', 
            isIrreversible: true 
        },
        { 
            year: 7, 
            title: language === 'ZH' ? '维修危机' : 'Repair Crisis', 
            description: language === 'ZH' ? '电器老化、漏水、物业纠纷，维修费吞噬积蓄。' : 'Aging appliances, leaks, disputes. Repairs eat savings.', 
            type: 'warning', 
            isIrreversible: false 
        },
        { 
            year: 10, 
            title: language === 'ZH' ? '中年危机' : 'Midlife Crisis', 
            description: language === 'ZH' ? '失业/降薪来袭，还贷压力让人喘不过气。' : 'Job loss/pay cut hits. Mortgage becomes crushing burden.', 
            type: 'critical', 
            isIrreversible: true 
        },
        { 
            year: 12, 
            title: language === 'ZH' ? '教育支出' : 'Education Costs', 
            description: language === 'ZH' ? '孩子上学要学区房/培训班，房贷+教育双重压力。' : 'Kids need school district/tutoring. Mortgage + education double burden.', 
            type: 'critical', 
            isIrreversible: true 
        },
        { 
            year: 15, 
            title: language === 'ZH' ? '机会成本浮现' : 'Opportunity Cost', 
            description: language === 'ZH' ? '同期投资股市/创业的朋友资产翻倍，你还在还贷。' : 'Friends who invested elsewhere doubled wealth. You\'re still paying.', 
            type: 'fatal', 
            isIrreversible: true 
        },
        { 
            year: 20, 
            title: language === 'ZH' ? '回望遗憾' : 'Looking Back', 
            description: language === 'ZH' ? '20年青春换来一套老旧房产，人生最好的年华都在还债。' : '20 years traded for an old property. Best years spent in debt.', 
            type: 'fatal', 
            isIrreversible: true 
        },
        { 
            year: 25, 
            title: language === 'ZH' ? '身心俱疲' : 'Exhausted', 
            description: language === 'ZH' ? '身体开始亮红灯，却不敢生病，因为还有5年房贷。' : 'Health declining, but can\'t afford to be sick. 5 more years to go.', 
            type: 'critical', 
            isIrreversible: true 
        },
        { 
            year: 30, 
            title: language === 'ZH' ? '终于还清？' : 'Finally Free?', 
            description: language === 'ZH' ? '房贷还完那天，你已白发苍苍，房子也老旧不堪，一切值得吗？' : 'Mortgage paid off. You\'re gray, house is old. Was it worth it?', 
            type: 'fatal', 
            isIrreversible: true 
        },
    ] as ReplayEvent[];
}
