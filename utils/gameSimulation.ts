import { InvestmentParams, Language } from '../types';

export type EndingType = 'WEALTHY' | 'DEBT' | 'ZEN' | 'NORMAL' | 'STRUGGLE' | 'EARLY_FREE' | 'INVESTOR' | 'REGRET' | 'BALANCE';

export interface GameEvent {
  year: number;
  title: string;
  description: string;
  impact: {
    wealth: number; // 万元
    happiness: number; // -10 to 10
    stress: number; // -10 to 10
  };
  type: 'CAREER' | 'FAMILY' | 'MARKET' | 'HEALTH';
}

export interface GameResult {
  ending: EndingType;
  finalWealth: number; // 万元
  finalHappiness: number; // 0-100
  finalStress: number; // 0-100
  history: {
    year: number;
    wealth: number;
    happiness: number;
    stress: number;
    event?: GameEvent;
  }[];
  summary: string;
}

const EVENTS_ZH: Omit<GameEvent, 'year'>[] = [
  { title: '升职加薪', description: '工作表现优异，获得晋升！', impact: { wealth: 20, happiness: 5, stress: 2 }, type: 'CAREER' },
  { title: '遭遇裁员', description: '公司业务调整，不幸被裁。', impact: { wealth: -10, happiness: -10, stress: 8 }, type: 'CAREER' },
  { title: '喜结良缘', description: '遇到了对的人，步入婚姻殿堂。', impact: { wealth: 10, happiness: 15, stress: -5 }, type: 'FAMILY' },
  { title: '添丁进口', description: '迎来了可爱的宝宝，开销增加。', impact: { wealth: -30, happiness: 10, stress: 5 }, type: 'FAMILY' },
  { title: '房价暴涨', description: '所在区域房价大涨，资产增值！', impact: { wealth: 50, happiness: 5, stress: 0 }, type: 'MARKET' },
  { title: '市场回调', description: '房地产市场低迷，资产缩水。', impact: { wealth: -20, happiness: -2, stress: 3 }, type: 'MARKET' },
  { title: '生病住院', description: '身体抱恙，需要支付医疗费。', impact: { wealth: -5, happiness: -5, stress: 3 }, type: 'HEALTH' },
  { title: '意外之财', description: '投资理财获得意外收益。', impact: { wealth: 15, happiness: 5, stress: 0 }, type: 'MARKET' },
];

const EVENTS_EN: Omit<GameEvent, 'year'>[] = [
  { title: 'Promotion', description: 'Excellent performance, you got promoted!', impact: { wealth: 20, happiness: 5, stress: 2 }, type: 'CAREER' },
  { title: 'Layoff', description: 'Company restructuring, you lost your job.', impact: { wealth: -10, happiness: -10, stress: 8 }, type: 'CAREER' },
  { title: 'Marriage', description: 'Met the right one and got married.', impact: { wealth: 10, happiness: 15, stress: -5 }, type: 'FAMILY' },
  { title: 'New Baby', description: 'Welcomed a baby, expenses increased.', impact: { wealth: -30, happiness: 10, stress: 5 }, type: 'FAMILY' },
  { title: 'Price Surge', description: 'Property value skyrocketed!', impact: { wealth: 50, happiness: 5, stress: 0 }, type: 'MARKET' },
  { title: 'Market Correction', description: 'Real estate market is down, assets shrunk.', impact: { wealth: -20, happiness: -2, stress: 3 }, type: 'MARKET' },
  { title: 'Medical Bill', description: 'Health issues, paid medical bills.', impact: { wealth: -5, happiness: -5, stress: 3 }, type: 'HEALTH' },
  { title: 'Windfall', description: 'Unexpected investment gain.', impact: { wealth: 15, happiness: 5, stress: 0 }, type: 'MARKET' },
];

export const simulateLife = (params: InvestmentParams, language: Language = 'ZH'): GameResult => {
  // 基于用户参数计算初始状态
  const loanAmount = params.totalPrice * (1 - params.downPaymentRatio / 100);
  const downPayment = params.totalPrice * (params.downPaymentRatio / 100);
  const income = params.familyMonthlyIncome || 30000;
  const loanTerm = params.loanTerm || 30;
  const interestRate = params.interestRate || 3.5;
  const appreciationRate = params.appreciationRate || 3;
  
  // 计算月供（等额本息公式）
  const monthlyRate = interestRate / 100 / 12;
  const months = loanTerm * 12;
  const monthlyPayment = monthlyRate > 0 
    ? (loanAmount * 10000 * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : (loanAmount * 10000) / months;
  
  // 月供收入比 (DTI) - 核心指标
  const dti = monthlyPayment / income;
  
  // 初始财富 = 首付 - 贷款（净资产为负是正常的）
  let wealth = downPayment - loanAmount;
  
  // 基于DTI设置初始幸福和压力
  let happiness: number;
  let stress: number;
  
  if (dti > 0.6) {
    // 月供超过收入60%：高压力
    happiness = 45;
    stress = 70;
  } else if (dti > 0.5) {
    happiness = 55;
    stress = 55;
  } else if (dti > 0.4) {
    happiness = 65;
    stress = 40;
  } else if (dti > 0.3) {
    happiness = 75;
    stress = 30;
  } else {
    // 月供低于30%：轻松
    happiness = 85;
    stress = 20;
  }
  
  // 首付比例影响初始心态
  if (params.downPaymentRatio >= 50) {
    happiness += 5;
    stress -= 5;
  } else if (params.downPaymentRatio <= 20) {
    happiness -= 5;
    stress += 10;
  }
  
  const history = [];
  
  for (let year = 1; year <= 20; year++) {
    // 年度储蓄：(收入 - 月供) * 12 * 储蓄率
    const yearlyDisposable = (income - monthlyPayment) * 12;
    const savingRate = dti > 0.5 ? 0.1 : dti > 0.3 ? 0.25 : 0.4;
    wealth += yearlyDisposable * savingRate / 10000;
    
    // 房产升值
    wealth += params.totalPrice * (appreciationRate / 100);
    
    // 贷款本金减少（简化计算）
    if (year <= loanTerm) {
      const principalPaidThisYear = loanAmount / loanTerm;
      wealth += principalPaidThisYear; // 资产净值增加
    }
    
    // 随机事件 - 概率基于参数
    let event: GameEvent | undefined;
    const eventChance = dti > 0.5 ? 0.4 : 0.25; // 高压力时更容易发生事件
    
    if (Math.random() < eventChance) {
      const EVENTS = language === 'EN' ? EVENTS_EN : EVENTS_ZH;
      // 高升值率更容易遇到好事
      const goodEventBias = appreciationRate > 5 ? 0.3 : appreciationRate > 3 ? 0.1 : 0;
      const eventIndex = Math.random() < (0.5 + goodEventBias) 
        ? Math.floor(Math.random() * 5) // 好事（前5个）
        : 5 + Math.floor(Math.random() * 3); // 坏事（后3个）
      const baseEvent = EVENTS[Math.min(eventIndex, EVENTS.length - 1)];
      event = { ...baseEvent, year };
      
      wealth += event.impact.wealth;
      happiness += event.impact.happiness;
      stress += event.impact.stress;
    }
    
    // 随时间推移的自然变化
    if (dti > 0.5) {
      // 高月供持续增加压力
      stress += 1;
      happiness -= 0.5;
    } else if (dti < 0.3) {
      // 低月供逐渐降低压力
      stress -= 0.5;
      happiness += 0.3;
    }
    
    // 还款年限过了一半后压力降低
    if (year > loanTerm / 2) {
      stress -= 1;
      happiness += 0.5;
    }
    
    // 限制范围
    happiness = Math.max(0, Math.min(100, happiness));
    stress = Math.max(0, Math.min(100, stress));
    
    history.push({ year, wealth, happiness, stress, event });
  }
  
  // Determine Ending - 9 possible endings
  let ending: EndingType = 'NORMAL';
  let summary = language === 'EN' ? 'You lived a peaceful and fulfilling life.' : '你度过了平凡而充实的一生。';
  
  // 使用已定义的变量
  const paidOffEarly = wealth > loanAmount * 2 && loanTerm > 15;
  const investmentGains = wealth - downPayment;
  
  // Priority order for endings - conditions relaxed for variety
  if (wealth < 0 || stress > 85) {
    ending = 'DEBT';
    summary = language === 'EN' 
      ? '💔 High mortgage and stress crushed you, leading to financial crisis.' 
      : '💔 高额的房贷和生活压力让你喘不过气，最终陷入了财务危机。';
  } else if (happiness < 50 && stress > 50) {
    ending = 'REGRET';
    summary = language === 'EN'
      ? '😔 You often wonder if buying this house was worth it. Life passed by in anxiety.'
      : '😔 你常常怀疑当初买房是否值得，生活在焦虑中匆匆度过。';
  } else if (wealth > params.totalPrice * 2) {
    ending = 'WEALTHY';
    summary = language === 'EN'
      ? '💰 Your assets multiplied over 20 years. Financial Freedom achieved!'
      : '💰 你的资产在20年间翻了几番，实现了财务自由！';
  } else if (paidOffEarly && happiness > 60) {
    ending = 'EARLY_FREE';
    summary = language === 'EN'
      ? '🎉 You paid off the mortgage early! No more debt pressure, enjoying carefree life.'
      : '🎉 你提前还清了房贷！没有债务压力，享受无忧无虑的生活。';
  } else if (investmentGains > params.totalPrice * 0.8 && stress < 55) {
    ending = 'INVESTOR';
    summary = language === 'EN'
      ? '📈 Smart investments and property appreciation made you a real estate pro!'
      : '📈 精明的投资加上房产增值，你成为了房产达人！';
  } else if (stress > 55 && wealth > params.totalPrice * 0.5) {
    ending = 'STRUGGLE';
    summary = language === 'EN'
      ? '😰 You have assets, but you sacrificed too much quality of life for the mortgage.'
      : '😰 虽然积累了不错的资产，但为了还房贷，你牺牲了太多的生活质量。';
  } else if (happiness > 75 && stress < 50) {
    ending = 'ZEN';
    summary = language === 'EN'
      ? '😌 You are not super rich, but very happy and peaceful.'
      : '😌 虽然不是大富大贵，但你心态平和，生活幸福指数极高。';
  } else if (happiness > 65 && stress < 45) {
    ending = 'BALANCE';
    summary = language === 'EN'
      ? '⚖️ Perfect work-life balance! Not the richest, but definitely the happiest.'
      : '⚖️ 完美的工作与生活平衡！不是最富有的，但绝对是最幸福的。';
  }
  
  return {
    ending,
    finalWealth: wealth,
    finalHappiness: happiness,
    finalStress: stress,
    history,
    summary
  };
};
