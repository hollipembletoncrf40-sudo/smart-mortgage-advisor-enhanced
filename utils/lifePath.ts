import { InvestmentParams } from '../types';

export interface PropertyStage {
  id: string;
  name: string;
  price: number; // 万元
  area: number; // 平米
  yearStart: number; // 第几年开始持有
  yearEnd: number; // 第几年结束持有 (30表示持有到底)
  comfortLevel: number; // 1-10分
}

export interface ExchangeEvent {
  year: number;
  sellPrice: number; // 卖出价
  buyPrice: number; // 买入价
  transactionCost: number; // 总交易成本
  details: {
    agencyFee: number; // 中介费
    deedTax: number; // 契税
    vat: number; // 增值税
    pit: number; // 个税
    renovation: number; // 装修
    moving: number; // 搬家
  };
  netProceeds: number; // 卖出净得
  newDownPayment: number; // 新房首付
  newLoanAmount: number; // 新房贷款
}

export interface LifePathResult {
  pathName: string;
  totalAssets: number; // 最终总资产
  totalCosts: number; // 总交易摩擦成本
  avgComfort: number; // 平均居住舒适度
  events: ExchangeEvent[];
  assetCurve: { year: number; value: number }[];
  comfortCurve: { year: number; value: number }[];
  finalStatus: {
    houseValue: number;
    cash: number;
    debt: number;
  };
}

export const calculateLifePathMetrics = (
  params: InvestmentParams,
  stages: PropertyStage[]
): LifePathResult => {
  const annualAppreciation = params.appreciationRate / 100;
  const holdingYears = 30; // 模拟30年
  
  let currentCash = params.totalPrice * (params.downPaymentRatio / 100) + (params.renovationCost || 0);
  let currentDebt = params.totalPrice * (1 - params.downPaymentRatio / 100);
  let currentHouseValue = params.totalPrice;
  
  const assetCurve = [];
  const comfortCurve = [];
  const events: ExchangeEvent[] = [];
  
  let totalTransactionCosts = 0;
  let totalComfortScore = 0;
  
  // Initial setup
  const firstStage = stages[0];
  currentHouseValue = firstStage.price;
  currentDebt = firstStage.price * (1 - params.downPaymentRatio / 100);
  // Adjust initial cash based on first stage price difference if any (simplified)
  
  for (let year = 1; year <= holdingYears; year++) {
    // Find if we are in a transition year
    const endingStage = stages.find(s => s.yearEnd === year);
    const startingStage = stages.find(s => s.yearStart === year);
    
    // Calculate appreciation for current year
    currentHouseValue *= (1 + annualAppreciation);
    
    // Handle Exchange
    if (endingStage && startingStage) {
      // Sell old house
      const sellPrice = currentHouseValue;
      
      // Calculate selling costs
      const agencyFeeSell = sellPrice * 0.01; // 1% agency fee
      const vat = year - endingStage.yearStart < 2 ? sellPrice * 0.053 : 0; // VAT if < 2 years
      const pit = year - endingStage.yearStart < 5 ? (sellPrice - endingStage.price) * 0.2 : 0; // PIT simplified
      
      const sellCosts = agencyFeeSell + vat + pit;
      const netProceeds = sellPrice - currentDebt - sellCosts;
      
      // Buy new house
      const buyPrice = startingStage.price * Math.pow(1 + annualAppreciation, year); // Adjust target price for inflation/appreciation
      
      // Calculate buying costs
      const agencyFeeBuy = buyPrice * 0.015; // 1.5% agency fee
      const deedTax = buyPrice * 0.015; // 1.5% deed tax avg
      const renovation = 20 * Math.pow(1.03, year); // Renovation cost increases with inflation
      const moving = 1 * Math.pow(1.03, year); // Moving cost
      
      const buyCosts = agencyFeeBuy + deedTax + renovation + moving;
      const totalExchangeCost = sellCosts + buyCosts;
      
      // New Loan
      const availableCash = netProceeds - buyCosts;
      // Assume we use all available cash for down payment, but keep minimum 30%
      let newDownPayment = availableCash;
      let newLoan = buyPrice - newDownPayment;
      
      // If cash is not enough for 30%, we assume user adds savings (simplified) or it's a blocker
      // For simulation, we allow negative cash (debt) or assume external funding
      
      currentHouseValue = buyPrice;
      currentDebt = newLoan;
      totalTransactionCosts += totalExchangeCost;
      
      events.push({
        year,
        sellPrice,
        buyPrice,
        transactionCost: totalExchangeCost,
        details: {
          agencyFee: agencyFeeSell + agencyFeeBuy,
          deedTax,
          vat,
          pit,
          renovation,
          moving
        },
        netProceeds,
        newDownPayment,
        newLoanAmount: newLoan
      });
    }
    
    // Reduce debt (simplified amortization)
    const annualPayment = (currentDebt * 0.05); // Interest only approx for simplicity in this high level view
    // In reality debt reduces slowly. Let's assume 2% principal reduction per year
    currentDebt = Math.max(0, currentDebt * 0.98);
    
    // Record metrics
    const currentStage = stages.find(s => year >= s.yearStart && year <= s.yearEnd);
    const comfort = currentStage ? currentStage.comfortLevel : 0;
    totalComfortScore += comfort;
    
    assetCurve.push({
      year,
      value: currentHouseValue - currentDebt
    });
    
    comfortCurve.push({
      year,
      value: comfort
    });
  }
  
  return {
    pathName: stages.length === 1 ? '一房到底' : stages.length === 2 ? '一次换房' : '多次折腾',
    totalAssets: currentHouseValue - currentDebt,
    totalCosts: totalTransactionCosts,
    avgComfort: totalComfortScore / holdingYears,
    events,
    assetCurve,
    comfortCurve,
    finalStatus: {
      houseValue: currentHouseValue,
      cash: 0,
      debt: currentDebt
    }
  };
};
