import { InvestmentParams, Language } from '../types';

export type EndingType = 'WEALTHY' | 'DEBT' | 'ZEN' | 'NORMAL' | 'STRUGGLE';

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
  let wealth = params.totalPrice * (params.downPaymentRatio / 100) - (params.totalPrice * (1 - params.downPaymentRatio / 100)); // Initial Net Worth (Equity - Debt)
  let happiness = 70;
  let stress = 30;
  
  // Initial impact of mortgage
  const monthlyPayment = params.totalPrice * (1 - params.downPaymentRatio / 100) * 0.005; // Approx
  const income = params.familyMonthlyIncome || 30000;
  const dti = monthlyPayment / income;
  
  if (dti > 0.5) {
    stress += 20;
    happiness -= 10;
  } else if (dti < 0.3) {
    stress -= 10;
    happiness += 5;
  }
  
  const history = [];
  
  for (let year = 1; year <= 20; year++) {
    // Base changes
    wealth += (income * 12 * 0.3) / 10000; // Save 30% of income
    wealth += params.totalPrice * (params.appreciationRate / 100); // Property appreciation
    
    // Random Event (30% chance)
    let event: GameEvent | undefined;
    if (Math.random() < 0.3) {
      const EVENTS = language === 'EN' ? EVENTS_EN : EVENTS_ZH;
      const baseEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      event = { ...baseEvent, year };
      
      wealth += event.impact.wealth;
      happiness += event.impact.happiness;
      stress += event.impact.stress;
    }
    
    // Limits
    happiness = Math.max(0, Math.min(100, happiness));
    stress = Math.max(0, Math.min(100, stress));
    
    history.push({ year, wealth, happiness, stress, event });
  }
  
  // Determine Ending
  let ending: EndingType = 'NORMAL';
  let summary = language === 'EN' ? 'You lived a peaceful and fulfilling life.' : '你度过了平凡而充实的一生。';
  
  if (wealth < 0 || stress > 90) {
    ending = 'DEBT';
    summary = language === 'EN' 
      ? 'High mortgage and stress crushed you, leading to financial crisis.' 
      : '高额的房贷和生活压力让你喘不过气，最终陷入了财务危机。';
  } else if (wealth > params.totalPrice * 3) {
    ending = 'WEALTHY';
    summary = language === 'EN'
      ? 'Your assets multiplied over 20 years. Financial Freedom achieved!'
      : '你的资产在20年间翻了几番，实现了财务自由！';
  } else if (happiness > 85 && stress < 40) {
    ending = 'ZEN';
    summary = language === 'EN'
      ? 'You are not super rich, but very happy and peaceful.'
      : '虽然不是大富大贵，但你心态平和，生活幸福指数极高。';
  } else if (stress > 70 && wealth > params.totalPrice) {
    ending = 'STRUGGLE';
    summary = language === 'EN'
      ? 'You have assets, but you sacrificed too much quality of life for the mortgage.'
      : '虽然积累了不错的资产，但为了还房贷，你牺牲了太多的生活质量。';
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
