import { InvestmentParams, AlternativePath, IrreversibleFactor } from '../types';

export const generateAlternativePaths = (params: InvestmentParams): AlternativePath[] => {
  const paths: AlternativePath[] = [];
  const totalPrice = params.totalPrice || 0;
  const downPayment = (params.totalPrice * (params.downPaymentRatio || 30) / 100);

  // 1. Rent + Invest Strategy
  if (totalPrice > 200) {
    paths.push({
      id: 'rent_invest',
      title: '租房 + 投资组合',
      description: '继续租住同品质房屋，将首付用于低风险稳健投资。',
      pros: ['现金流充裕', '随时可更换居住地', '无房贷精神压力', '职业选择自由'],
      cons: ['无资产增值红利', '房东收房风险', '无归属感'],
      financialOutcome: `预计5年累积理财收益 ${(downPayment * 0.04 * 5).toFixed(1)}万`,
      matchScore: 85
    });
  }

  // 2. Wait & Save or Buy Smaller
  if (params.downPaymentRatio < 40) {
    paths.push({
      id: 'wait_save',
      title: '延迟满足 (存钱+理财)',
      description: '暂缓3年购房，专注职业发展与资本积累。',
      pros: ['职业选择更自由', '首付比例更高利率更低', '等待市场回调机会'],
      cons: ['房价可能上涨', '首付购买力缩水风险'],
      financialOutcome: '职业年薪平均涨幅可能高于房价涨幅',
      matchScore: 70
    });
  } else {
     paths.push({
      id: 'buy_smaller',
      title: '降维打击 (先上车小户型)',
      description: '购买核心地段小户型或非热门区域，降低杠杆。',
      pros: ['低压力上车', '享受资产增值', '核心地段流动性好'],
      cons: ['居住体验打折', '未来置换成本(税费)'],
      financialOutcome: '月供压力减少 40%',
      matchScore: 90
    });
  }
  
  // 3. Career Focus
  paths.push({
    id: 'career_first',
    title: '职业跃升优先',
    description: '将首付资金投入自我提升(留学/创业)或作为风险储备金。',
    pros: ['人力资本增值', '人生可能性最大化', '不被不动产绑定'],
    cons: ['错过房产周期', '同龄人压力'],
    financialOutcome: '长期收入潜力提升 50%+',
    matchScore: 60
  });

  return paths;
};

export const calculateIrreversibility = (params: InvestmentParams): IrreversibleFactor[] => {
  return [
    {
      name: '地段选择 (Location)',
      level: 'irreversible',
      impact: '决定了生活圈层、通勤时间和未来流动性。',
      advice: '宁选核心区老破小，不选远郊CEO盘。此项决策几乎无法低成本更改。'
    },
    {
      name: '户型结构 (Layout)',
      level: 'semi-irreversible',
      impact: '承重墙无法拆改，采光通风是硬伤。',
      advice: '装修可以重来，但暗厨暗卫是一辈子的痛。优先关注采光和通透性。'
    },
    {
      name: '买入时机 (Timing)',
      level: 'semi-irreversible',
      impact: '高点站岗可能需要5-10年消化。',
      advice: '不要试图精准抄底，但要避开明显的泡沫狂热期。目前市场偏向买方。'
    },
    {
      name: '装修风格 (Decor)',
      level: 'reversible',
      impact: '仅影响短期居住体验和少许现金流。',
      advice: '这是最无关紧要的决策。不喜欢可以砸了重装，千万别为了精装溢价买单。'
    },
    {
      name: '贷款方式 (Loan)',
      level: 'reversible',
      impact: '影响月供和利息支出。',
      advice: '商贷转公积金虽有门槛但可行，提前还款也是选项。不要为了省一点利息而过度从紧。'
    }
  ];
};

// AI Perspective: "If I Were You" Mode
export type DecisionGrade = 'ready' | 'caution' | 'stop' | 'insufficient';

export interface AIPerspective {
  shouldBuy: boolean;
  confidence: number; // 0-100
  grade: DecisionGrade;
  gradeLabel: string;
  gradeIcon: string;
  gradeReason: string;
  oneSentence: string;
  keyFactors: string[];
}

export const generateAIPerspective = (params: InvestmentParams): AIPerspective => {
  const totalPrice = params.totalPrice || 0;
  const downPaymentRatio = params.downPaymentRatio || 30;
  const monthlyIncome = params.familyMonthlyIncome || 30000;
  
  // Calculate key metrics
  const loanAmount = totalPrice * (1 - downPaymentRatio / 100);
  const monthlyPayment = loanAmount * 10000 * (params.interestRate / 100 / 12) * 
    Math.pow(1 + params.interestRate / 100 / 12, params.loanTerm * 12) / 
    (Math.pow(1 + params.interestRate / 100 / 12, params.loanTerm * 12) - 1);
  
  const dti = monthlyPayment / monthlyIncome;
  const emergencyMonths = params.emergencyFund > 0 ? (params.emergencyFund * 10000) / monthlyPayment : 0;
  const ltv = (loanAmount / totalPrice) * 100;
  
  // Decision factors
  const factors: string[] = [];
  let score = 50; // Neutral start
  
  // DTI Analysis (Most Critical)
  if (dti > 0.5) {
    score -= 30;
    factors.push('月供占收入比过高(>50%)');
  } else if (dti > 0.35) {
    score -= 15;
    factors.push('月供压力偏大');
  } else {
    score += 15;
    factors.push('月供压力可控');
  }
  
  // Emergency Fund
  if (emergencyMonths < 3) {
    score -= 20;
    factors.push('应急储备不足');
  } else if (emergencyMonths > 12) {
    score += 15;
    factors.push('现金储备充足');
  }
  
  // Leverage
  if (ltv > 80) {
    score -= 10;
    factors.push('杠杆率偏高');
  } else if (ltv < 50) {
    score += 10;
    factors.push('杠杆率健康');
  }
  
  // Price Level (Opportunity Cost)
  if (totalPrice > 500) {
    score -= 10;
    factors.push('总价较高，机会成本大');
  }
  
  // Loan Term
  if (params.loanTerm > 25) {
    score -= 5;
    factors.push('贷款年限长');
  }
  
  const shouldBuy = score > 50;
  const confidence = Math.abs(score - 50) * 2; // 0-100
  
  // Determine Decision Grade
  let grade: DecisionGrade;
  let gradeLabel: string;
  let gradeIcon: string;
  let gradeReason: string;
  
  // Check for insufficient data
  const hasBasicData = totalPrice > 0 && monthlyIncome > 0 && params.emergencyFund >= 0;
  
  if (!hasBasicData) {
    grade = 'insufficient';
    gradeLabel = '信息不足，禁止决策';
    gradeIcon = '💤';
    gradeReason = '缺少关键财务数据（收入、总价或应急金），无法做出负责任的建议。';
  } else if (shouldBuy && confidence > 70 && dti < 0.35 && emergencyMonths > 6) {
    grade = 'ready';
    gradeLabel = '可立即执行';
    gradeIcon = '✅';
    gradeReason = '财务指标全面健康，风险可控，可以放心推进。';
  } else if (shouldBuy && (dti > 0.35 || emergencyMonths < 6)) {
    grade = 'caution';
    gradeLabel = '可执行但需调整';
    gradeIcon = '⚠️';
    const reasons = [];
    if (dti > 0.35) reasons.push('现金流弹性不足(DTI>35%)');
    if (emergencyMonths < 6) reasons.push('应急储备偏低(<6个月)');
    if (ltv > 70) reasons.push('杠杆率偏高');
    gradeReason = `你现在停在 ⚠️ 的原因是：${reasons.join(' + ')}。`;
  } else if (!shouldBuy && dti < 0.6) {
    grade = 'caution';
    gradeLabel = '可执行但需调整';
    gradeIcon = '⚠️';
    gradeReason = `你现在停在 ⚠️ 的原因是：${factors.slice(0, 2).join(' + ')}。建议优化后再决策。`;
  } else {
    grade = 'stop';
    gradeLabel = '暂不建议';
    gradeIcon = '⛔';
    gradeReason = `财务压力过大，${factors[0]}，强行购买会严重影响生活质量。`;
  }
  
  // Generate one-sentence recommendation
  let oneSentence = '';
  
  if (shouldBuy) {
    if (confidence > 70) {
      oneSentence = `如果我拥有你的收入(${(monthlyIncome/10000).toFixed(1)}万/月)、${emergencyMonths.toFixed(0)}个月应急金、${downPaymentRatio}%首付，在当前市场，我会买这套房，因为财务指标健康，月供压力可控，这是稳健的资产配置。`;
    } else {
      oneSentence = `如果我拥有你的收入和家庭结构，在当前市场，我会谨慎买入这套房，因为虽然整体可行，但${factors[0]}，建议再优化一下财务结构或谈判空间。`;
    }
  } else {
    if (confidence > 70) {
      oneSentence = `如果我拥有你的收入(${(monthlyIncome/10000).toFixed(1)}万/月)、风险偏好和家庭结构，在当前市场，我不会买这套房，因为${factors[0]}，这会严重压缩生活质量和职业选择自由度。建议${dti > 0.5 ? '降低总价或增加首付' : '等待更好时机'}。`;
    } else {
      oneSentence = `如果我是你，我会暂缓购买这套房，因为${factors.slice(0, 2).join('且')}，虽然不是完全不可行，但风险收益比不够理想。不如再看看其他选择。`;
    }
  }
  
  return {
    shouldBuy,
    confidence: Math.round(confidence),
    grade,
    gradeLabel,
    gradeIcon,
    gradeReason,
    oneSentence,
    keyFactors: factors.slice(0, 3)
  };
};
