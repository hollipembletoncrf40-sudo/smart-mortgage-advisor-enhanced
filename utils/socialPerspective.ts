import { InvestmentParams } from '../types';

// Peer Group Distribution
export interface PeerChoice {
  choice: string;
  percentage: number;
  count: number;
}

export const calculatePeerDistribution = (
  totalPrice: number,
  monthlyIncome: number,
  age: number = 30
): PeerChoice[] => {
  // Simulate peer group choices based on income and price
  const priceToIncomeRatio = (totalPrice * 10000) / (monthlyIncome * 12);
  
  if (priceToIncomeRatio < 5) {
    return [
      { choice: '全款购买', percentage: 35, count: 1400 },
      { choice: '高首付低月供', percentage: 40, count: 1600 },
      { choice: '低首付高月供', percentage: 15, count: 600 },
      { choice: '继续租房', percentage: 10, count: 400 }
    ];
  } else if (priceToIncomeRatio < 10) {
    return [
      { choice: '全款购买', percentage: 5, count: 200 },
      { choice: '高首付低月供', percentage: 45, count: 1800 },
      { choice: '低首付高月供', percentage: 35, count: 1400 },
      { choice: '继续租房', percentage: 15, count: 600 }
    ];
  } else {
    return [
      { choice: '全款购买', percentage: 2, count: 80 },
      { choice: '高首付低月供', percentage: 25, count: 1000 },
      { choice: '低首付高月供', percentage: 28, count: 1120 },
      { choice: '继续租房', percentage: 45, count: 1800 }
    ];
  }
};

// Minority Indicator
export interface MinorityStatus {
  isMinority: boolean;
  percentile: number; // 0-100, where you stand
  message: string;
  trend: 'mainstream' | 'contrarian' | 'balanced';
}

export const calculateMinorityStatus = (
  downPaymentRatio: number,
  totalPrice: number,
  monthlyIncome: number
): MinorityStatus => {
  const dti = ((totalPrice * (1 - downPaymentRatio / 100) * 10000 * 0.035 / 12) / monthlyIncome);
  
  // High DTI + low down payment = risky minority
  // Low DTI + high down payment = conservative minority
  
  let percentile = 50;
  let isMinority = false;
  let message = '';
  let trend: 'mainstream' | 'contrarian' | 'balanced' = 'balanced';
  
  if (downPaymentRatio > 50 && dti < 0.3) {
    percentile = 15;
    isMinority = true;
    trend = 'contrarian';
    message = '你是保守派少数群体 - 高首付低杠杆，财务极度稳健，但可能错过杠杆红利期。';
  } else if (downPaymentRatio < 30 && dti > 0.4) {
    percentile = 85;
    isMinority = true;
    trend = 'contrarian';
    message = '你是激进派少数群体 - 低首付高月供，享受最大杠杆，但压力极大。';
  } else if (downPaymentRatio >= 30 && downPaymentRatio <= 50 && dti >= 0.3 && dti <= 0.4) {
    percentile = 50;
    isMinority = false;
    trend = 'mainstream';
    message = '你正在随大流 - 这是当前市场最主流的选择，风险收益平衡。';
  } else {
    percentile = 35;
    isMinority = false;
    trend = 'balanced';
    message = '你处于平衡区 - 既不激进也不保守，稍偏向谨慎。';
  }
  
  return { isMinority, percentile, message, trend };
};

// Future Buyer Overlap
export interface FutureBuyerProfile {
  dimension: string;
  yourScore: number;
  futureAvgScore: number;
  overlap: number; // 0-100
}

export const calculateFutureBuyerOverlap = (
  totalPrice: number,
  downPaymentRatio: number,
  monthlyIncome: number
): { profiles: FutureBuyerProfile[], totalOverlap: number } => {
  // Simulate future buyer characteristics
  const profiles: FutureBuyerProfile[] = [
    {
      dimension: '收入水平',
      yourScore: monthlyIncome / 1000,
      futureAvgScore: 35,
      overlap: Math.min(100, (monthlyIncome / 1000 / 35) * 100)
    },
    {
      dimension: '首付能力',
      yourScore: downPaymentRatio,
      futureAvgScore: 35,
      overlap: Math.min(100, Math.abs(100 - Math.abs(downPaymentRatio - 35) * 2))
    },
    {
      dimension: '总价承受',
      yourScore: totalPrice / 10,
      futureAvgScore: 40,
      overlap: Math.min(100, Math.abs(100 - Math.abs(totalPrice / 10 - 40) * 2))
    },
    {
      dimension: '风险偏好',
      yourScore: (100 - downPaymentRatio) * 0.8,
      futureAvgScore: 50,
      overlap: Math.min(100, Math.abs(100 - Math.abs((100 - downPaymentRatio) * 0.8 - 50)))
    }
  ];
  
  const totalOverlap = Math.round(
    profiles.reduce((sum, p) => sum + p.overlap, 0) / profiles.length
  );
  
  return { profiles, totalOverlap };
};

// Family Member Impact
export interface FamilyImpact {
  member: string;
  impactScore: number; // 0-100
  primaryConcern: string;
  icon: string;
}

export const calculateFamilyImpact = (
  totalPrice: number,
  monthlyIncome: number,
  loanTerm: number
): FamilyImpact[] => {
  const monthlyPayment = (totalPrice * 0.7 * 10000 * 0.035 / 12);
  const dti = monthlyPayment / monthlyIncome;
  
  return [
    {
      member: '你（主贷人）',
      impactScore: Math.min(100, dti * 150),
      primaryConcern: '职业稳定性压力 + 月供焦虑',
      icon: '👤'
    },
    {
      member: '配偶',
      impactScore: Math.min(100, dti * 120),
      primaryConcern: '家庭开支压缩 + 生活品质降低',
      icon: '💑'
    },
    {
      member: '父母',
      impactScore: loanTerm > 20 ? 60 : 30,
      primaryConcern: '子女财务负担担忧 + 养老金援助压力',
      icon: '👴'
    },
    {
      member: '未来子女',
      impactScore: Math.min(100, (totalPrice / 500) * 50),
      primaryConcern: '教育投资压缩 + 家庭时间减少',
      icon: '👶'
    }
  ];
};
