import { InvestmentParams, CalculationResult, Language } from '../types';

export type RoastCategory = 'budget' | 'location' | 'commute' | 'cost' | 'return' | 'lifestyle';
export type RoastSeverity = 'mild' | 'serious' | 'critical';

export interface RoastResult {
  category: RoastCategory;
  severity: RoastSeverity;
  roastMessage: string;
  realityCheck: string;
  suggestion: string;
  emoji: string;
}

// 检测预算漂移
function detectBudgetDrift(params: InvestmentParams, result: CalculationResult, language: Language): RoastResult | null {
  const monthlyIncome = params.monthlyIncome || 0;
  if (monthlyIncome === 0) return null;

  const monthlyPayment = result.monthlyPayment;
  const dti = (monthlyPayment / monthlyIncome) * 100;

  if (dti > 70) {
    return {
      category: 'budget',
      severity: 'critical',
      roastMessage: language === 'EN' 
        ? `Income $${(monthlyIncome/1000).toFixed(1)}k vs Mortgage $${(monthlyPayment/1000).toFixed(1)}k? Are you planning to live on photosynthesis?`
        : `月入${(monthlyIncome/10000).toFixed(1)}万，月供却要${(monthlyPayment/10000).toFixed(1)}万？你是打算靠爱发电吗？还是准备开启"仙人模式"不吃不喝？`,
      realityCheck: language === 'EN'
        ? `DTI is ${dti.toFixed(0)}%, far beyond safety line (30%). You work ${((dti/100)*30).toFixed(0)} days a month just for the bank.`
        : `你的月供收入比高达${dti.toFixed(0)}%，远超安全线（30%）。这意味着你每个月${((dti/100)*30).toFixed(0)}天都在为房子打工。`,
      suggestion: language === 'EN'
        ? `Slash budget to <$${(params.totalPrice * 0.4).toFixed(0)}k or increase down payment.`
        : `降低预算至${(params.totalPrice * 0.4).toFixed(0)}万以内，或者增加首付至${((params.totalPrice * 0.5) / 10000).toFixed(0)}万，让月供降到${(monthlyIncome * 0.3 / 10000).toFixed(1)}万以下。`,
      emoji: '💸'
    };
  } else if (dti > 50) {
    return {
      category: 'budget',
      severity: 'serious',
      roastMessage: language === 'EN'
        ? `${dti.toFixed(0)}% income for mortgage? Is this "Mortgage Slave" cosplay?`
        : `${dti.toFixed(0)}%的收入拿去还房贷？你这是在cosplay"房奴"吗？建议申请非物质文化遗产。`,
      realityCheck: language === 'EN'
        ? `DTI > safe limit (30%). Quality of life will drop significantly.`
        : `月供占收入${dti.toFixed(0)}%，超过健康线（30-40%）。你的生活质量可能会大打折扣。`,
      suggestion: language === 'EN'
        ? `Lower budget or extend loan term to keep DTI < 40%.`
        : `考虑降低预算或延长贷款年限，让DTI控制在40%以内。`,
      emoji: '⚠️'
    };
  } else if (dti > 40) {
    return {
      category: 'budget',
      severity: 'mild',
      roastMessage: language === 'EN'
        ? `DTI ${dti.toFixed(0)}%. No more Starbucks for you.`
        : `月供${dti.toFixed(0)}%的收入，虽然不至于吃土，但奶茶自由可能要说再见了。`,
      realityCheck: language === 'EN'
        ? `DTI is borderline. Keep a large emergency fund.`
        : `DTI在临界值，建议保持应急储备金。`,
      suggestion: language === 'EN'
        ? `Control expenses and keep >6 months reserves.`
        : `尽量控制其他开支，建立6个月以上的应急基金。`,
      emoji: '📊'
    };
  }

  return null;
}

// 检测区域幻想
function detectLocationFantasy(params: InvestmentParams, language: Language): RoastResult | null {
  const budget = params.totalPrice;
  const downPayment = params.totalPrice * (params.downPaymentRatio / 100);

  // 如果首付比例很低但总价很高，说明可能在幻想
  if (params.downPaymentRatio < 30 && budget > 500) {
    return {
      category: 'location',
      severity: 'serious',
      roastMessage: language === 'EN'
        ? `${params.downPaymentRatio}% down for a $${budget}k house? Are you buying a house or an NFT?`
        : `首付${params.downPaymentRatio}%就想买${budget}万的房？你这是在看房还是在看NFT？建议去元宇宙看看，那里不限购。`,
      realityCheck: language === 'EN'
        ? `Low down payment with high price triggers risk alerts.`
        : `你的首付只有${downPayment.toFixed(0)}万，但想买${budget}万的房子。银行可能会怀疑你的还款能力。`,
      suggestion: language === 'EN'
        ? `Increase down payment to 30% ($${(budget * 0.3).toFixed(0)}k).`
        : `增加首付至30%以上（${(budget * 0.3).toFixed(0)}万），或降低预算至${(downPayment / 0.3).toFixed(0)}万以内。`,
      emoji: '🏰'
    };
  }

  return null;
}

// 检测通勤成本
function detectCommuteCost(params: InvestmentParams, language: Language): RoastResult | null {
  // 假设用户在 locationScore 中设置了通勤时间（分钟）
  // 这里我们用一个简化的检测
  const appreciationRate = params.appreciationRate;
  
  // 如果房价增值率设置过高，可能是在幻想
  if (appreciationRate > 8) {
    return {
      category: 'return',
      severity: 'serious',
      roastMessage: language === 'EN'
        ? `${appreciationRate}% annual growth? Is this a crypto token or a house?`
        : `年增值${appreciationRate}%？你是不是把房子当成了比特币？还是觉得自己买的是茅台股票？`,
      realityCheck: language === 'EN'
        ? `Historical avg is 3-5%. Your expectation is unrealistic.`
        : `过去10年全国平均房价增速约5-6%，你的预期明显过高。`,
      suggestion: language === 'EN'
        ? `Adjust expectation to 3-5% to be safe.`
        : `将预期收益率调整至5-6%更为合理，避免过度乐观。`,
      emoji: '📈'
    };
  }

  return null;
}

// 检测生活成本美化
function detectCostBeautification(params: InvestmentParams, language: Language): RoastResult | null {
  const holdingCost = params.holdingCostRatio;
  
  if (holdingCost < 0.5) {
    return {
      category: 'cost',
      severity: 'mild',
      roastMessage: language === 'EN'
        ? `Holding cost ${holdingCost}%? Are you the maintenance guy? Stuff breaks, you know.`
        : `持有成本${holdingCost}%？你是住在毛坯房还是打算自己当物业？别忘了水电费、物业费、维修费都在排队等你。`,
      realityCheck: language === 'EN'
        ? `Real holding cost is ~1-2%. You are underestimating expense.`
        : `实际持有成本通常在1-2%之间，你可能低估了真实开销。`,
      suggestion: language === 'EN'
        ? `Adjust holding cost to ~1.5%.`
        : `将持有成本调整至1.5%左右更接近现实。`,
      emoji: '💰'
    };
  }

  return null;
}

// 检测投资回报幻想
function detectReturnFantasy(params: InvestmentParams, result: CalculationResult, language: Language): RoastResult | null {
  const comprehensiveReturn = result.comprehensiveReturn;
  
  if (comprehensiveReturn > 15) {
    return {
      category: 'return',
      severity: 'critical',
      roastMessage: language === 'EN'
        ? `Total Return ${comprehensiveReturn.toFixed(1)}%? Are you buying a lottery ticket? Even Buffett is speechless.`
        : `综合回报率${comprehensiveReturn.toFixed(1)}%？你确定买的是房子不是彩票？巴菲特看了都要沉默。`,
      realityCheck: language === 'EN'
        ? `Such returns are statistically impossible in the current market.`
        : `如此高的回报率在现实中几乎不可能持续实现。`,
      suggestion: language === 'EN'
        ? `Re-evaluate appreciation rate and rent assumptions.`
        : `重新审视你的参数设置，特别是增值率和租金回报预期。`,
      emoji: '🎰'
    };
  }

  return null;
}

// 检测生活方式不匹配
function detectLifestyleMismatch(params: InvestmentParams, language: Language): RoastResult | null {
  const loanTerm = params.loanTerm;
  const age = 30; // 假设平均年龄，实际可以让用户输入
  
  if (loanTerm >= 30 && age + loanTerm > 60) {
    return {
      category: 'lifestyle',
      severity: 'mild',
      roastMessage: language === 'EN'
        ? `${loanTerm} year loan? Do you plan to pass the debt to your grandkids?`
        : `${loanTerm}年贷款？你是打算还到退休吗？建议提前规划一下养老金怎么分配。`,
      realityCheck: language === 'EN'
        ? `Long debt means less retirement security.`
        : `长期贷款意味着长期负债，可能影响退休生活质量。`,
      suggestion: language === 'EN'
        ? `Shorten loan term or plan early repayment.`
        : `考虑缩短贷款年限或增加提前还款计划。`,
      emoji: '⏰'
    };
  }

  return null;
}

// Detect Property Grade Mismatch / Feedback
function detectPropertyGradeMismatch(params: InvestmentParams, language: Language): RoastResult | null {
  const grade = params.propertyGrade;
  
  if (grade === 'luxury') {
    return {
      category: 'lifestyle',
      severity: 'serious',
      roastMessage: language === 'EN'
        ? "Luxury Villa? Make sure your wallet is ready for the maintenance and liquidity trap."
        : "豪宅别墅？你准备好面对每年几十万的维护费和卖不掉的流动性陷阱了吗？",
      realityCheck: language === 'EN'
        ? "Luxury homes have very low liquidity. Selling can take 1-2 years."
        : "豪宅的流动性通常只有普通住宅的1/5，卖周期可能长达1-2年。",
      suggestion: language === 'EN'
        ? "Consider this a consumption, not an investment. Diversify assets."
        : "把这当成消费而非投资。确保你有足够的现金流养房，不要指望它快速变现。",
      emoji: '🏰'
    };
  }
  
  if (grade === 'resettlement') {
    return {
      category: 'location',
      severity: 'mild',
      roastMessage: language === 'EN'
        ? "Targeting old resettlement housing? Bargain hunting is risky."
        : "看中老破小或者安置房？你这是想赌拆迁还是单纯图便宜？",
      realityCheck: language === 'EN'
        ? "Appreciation potential is limited, and demolition is uncertain."
        : "老破小的居住体验较差，且未来的接盘侠越来越少（年轻人不喜欢）。",
      suggestion: language === 'EN'
        ? "Ensure good location/school district, otherwise avoid."
        : "除非有顶级学区加持或确定性极高的拆迁规划，否则建议谨慎接盘。",
      emoji: '🏚'
    };
  }

  if (grade === 'high_end') {
     // Positive reinforcement or mild check
     return {
      category: 'lifestyle',
      severity: 'mild',
      roastMessage: language === 'EN'
        ? "High-end quality home. Nice taste, but don't overpay for the 'premium'."
        : "中高端品质盘，眼光不错。但要注意别为所谓的'溢价'买单太多。",
      realityCheck: language === 'EN'
        ? "Quality homes hold value, but verify the developer's reputation."
        : "品质楼盘抗跌性较好，但要警惕期房烂尾风险，确认开发商口碑。",
      suggestion: language === 'EN'
        ? "Focus on unit layout and view."
        : "重点关注户型和楼层视野，这是高端盘的核心溢价点。",
      emoji: '✨'
    };
  }

  return null;
}

// 主函数：生成所有吐槽
export function generateHouseRoasts(params: InvestmentParams, result: CalculationResult, language: Language = 'ZH'): RoastResult[] {
  const roasts: RoastResult[] = [];

  const budgetRoast = detectBudgetDrift(params, result, language);
  if (budgetRoast) roasts.push(budgetRoast);

  const locationRoast = detectLocationFantasy(params, language);
  if (locationRoast) roasts.push(locationRoast);

  const commuteRoast = detectCommuteCost(params, language);
  if (commuteRoast) roasts.push(commuteRoast);

  const costRoast = detectCostBeautification(params, language);
  if (costRoast) roasts.push(costRoast);

  const returnRoast = detectReturnFantasy(params, result, language);
  if (returnRoast) roasts.push(returnRoast);

  const lifestyleRoast = detectLifestyleMismatch(params, language);
  if (lifestyleRoast) roasts.push(lifestyleRoast);

  const gradeRoast = detectPropertyGradeMismatch(params, language);
  if (gradeRoast) roasts.push(gradeRoast);

  // 按严重程度排序
  roasts.sort((a, b) => {
    const severityOrder = { critical: 3, serious: 2, mild: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  return roasts;
}

// 生成AI Prompt
export function generateRoastPrompt(params: InvestmentParams, result: CalculationResult): string {
  const monthlyIncome = params.monthlyIncome || 0;
  const dti = monthlyIncome > 0 ? ((result.monthlyPayment / monthlyIncome) * 100).toFixed(0) : 'N/A';

  return `你是一个毒舌但善意的房子，正在评价这位买家。请用幽默讽刺的语气指出他们的认知偏差：

用户情况：
- 月收入：${(monthlyIncome/10000).toFixed(1)}万元
- 想买房价：${params.totalPrice}万
- 月供：${(result.monthlyPayment/10000).toFixed(1)}万元
- DTI（月供收入比）：${dti}%
- 首付比例：${params.downPaymentRatio}%
- 预期年增值率：${params.appreciationRate}%
- 贷款年限：${params.loanTerm}年

请模仿以下风格输出2-3条吐槽（每条包含吐槽、现实检查、建议三部分）：

示例风格：
"你预算不足300万，却喜欢看500万的房？你这是在看NFT吗？"
"你的通勤时长让我怀疑你是不是把公司当Airbnb。"
"月供占收入70%？你这是在cosplay房奴吗？"

要求：
1. 幽默但不伤人，用网络流行语
2. 指出具体的认知偏差问题
3. 每条吐槽后给出现实检查和实际建议
4. 保持善意和建设性
5. 用中文输出

格式：
🏠 [吐槽内容]
📊 现实检查：[具体数据分析]
💡 建议：[实际可行的建议]`;
}
