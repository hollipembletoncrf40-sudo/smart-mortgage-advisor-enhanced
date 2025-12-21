
export enum LoanType {
  COMMERCIAL = 'COMMERCIAL',
  PROVIDENT = 'PROVIDENT',
  COMBINATION = 'COMBINATION',
}

export enum RepaymentMethod {
  EQUAL_PRINCIPAL_AND_INTEREST = 'EQUAL_PRINCIPAL_AND_INTEREST', // 等额本息
  EQUAL_PRINCIPAL = 'EQUAL_PRINCIPAL', // 等额本金
}

export enum PrepaymentStrategy {
  REDUCE_PAYMENT = 'REDUCE_PAYMENT', // 减少月供，年限不变
  REDUCE_TERM = 'REDUCE_TERM',       // 缩短年限，月供不变
}

export enum PurchaseScenario {
  FIRST_HOME = 'FIRST_HOME',
  SECOND_HOME = 'SECOND_HOME',
  INVESTMENT = 'INVESTMENT',
}

export type Language = 'ZH' | 'EN';
export type Currency = 'CNY' | 'USD';
export type ThemeMode = 'light' | 'dark' | 'professional' | 'gaming' | 'deepblack';

// 地段选筹因子 (0-10分)
export interface LocationFactors {
  transport: number;   // 交通通勤
  education: number;   // 教育医疗(学区)
  commercial: number;  // 商业配套
  environment: number; // 环境宜居
  potential: number;   // 未来规划/升值潜力
}

// 评分结果
export interface LocationScore {
  total: number;       // 0-100
  level: string;       // S/A/B/C
  advice: string;      // 简短评价
  factors: LocationFactors; // 保存原始因子
}

// 对应截图中的输入参数
export interface InvestmentParams {
  // 基本房产信息
  totalPrice: number; // 万元
  propertyArea: number; // 平方米 (房屋面积)
  unitPrice: number; // 元/平米 (单价，自动计算)
  communityName: string; // 小区名称
  district: string; // 所在区域
  floorLevel: string; // 楼层 ("低楼层"|"中楼层"|"高楼层")
  propertyType: string; // 房屋类型 ("普通住宅"|"公寓"|"别墅"|"loft"|"其他")
  buildingAge: number; // 房龄(年)
  decorationStatus: string; // 装修状况 ("毛坯"|"简装"|"精装"|"豪装")
  propertyRightYears: number; // 产权年限(年)
  
  downPaymentRatio: number; // % (首付比例)
  holdingYears: number; // 年
  
  // 一次性费用
  deedTaxRate: number; // % (契税)
  agencyFeeRatio: number; // % 中介费
  
  // 隐性成本
  educationBudget: number; // 万元
  renovationCost?: number; // 万元 (装修成本)
  
  // Advanced Financial Parameters (Anti-Fragility)
  incomeFluctuation?: number; // % (0-50, default 10)
  minLivingExpenses?: number; // 元/月 (default 5000)
  emergencyReserves?: number; // 月 (default 6)
  maxPaymentRatio?: number; // % (default 35)
  rateHikeAssumption?: number; // % (default 1.0)
  
  // 贷款信息
  loanType: LoanType; // 贷款类型
  loanTerm: number; // 年
  interestRate: number; // % (商贷利率)
  providentInterestRate: number; // % (公积金利率)
  providentQuota: number; // 万元 (公积金最高额度)
  
  // 提前还款
  enablePrepayment: boolean;
  prepaymentYear: number; // 第几年
  prepaymentAmount: number; // 万元
  prepaymentStrategy: PrepaymentStrategy; // 当前选择的策略
  
  // 租金与收益
  monthlyRent: number; // 元
  holdingCostRatio: number; // % (持有成本占房产总价的比例，如物业、维修、税费)
  propertyMaintenanceCost: number; // 万元/年 (固定维护费)
  appreciationRate: number; // % (年涨幅)
  rentAppreciationRate: number; // % (租金年涨幅)
  vacancyRate: number; // % (空置率)
  
  
  // 现有资产 (新增)
  existingPropertyCount: number; 
  existingMonthlyDebt: number; // 元 (现有负债)
  monthlyIncome: number; // 元 (月收入，用于DTI计算)
  purchaseScenario: PurchaseScenario;


  // 风险评估
  emergencyFund: number; // 万元
  familyMonthlyIncome: number; // 元
  
  // 机会成本与通胀 (新增 inflationRate)
  alternativeReturnRate: number; // % (理财/股票年化收益率)
  inflationRate: number; // % (通货膨胀率)
  
  // 利率调整 (新增)
  rateAdjustmentPeriod: number; // 利率调整周期(年)
  expectedRateChange: number; // 预期利率变化(%)

  method: RepaymentMethod;
}

export interface MonthlyPayment {
  monthIndex: number;
  payment: number;
  principal: number;
  interest: number;
  remainingPrincipal: number;
  isPrepaymentMonth?: boolean; // 标记是否包含提前还款
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ComparisonScenario {
  id: string;
  name: string;
  prepaymentYear: number;
  prepaymentAmount: number;
}

export interface ComparisonResult {
  scenarioId: string;
  scenarioName: string;
  totalInterest: number;
  totalRepayment: number;
  totalRevenue: number;
  returnRate: number;
  savedInterest: number;
  reducedMonths: number;
}

export interface DecisionSnapshot {
  id: string;
  timestamp: number;
  params: InvestmentParams;
  marketSentiment: number; // 0-100
  userNotes: string; // Reasoning
  rejectedOptions: string; // What was renounced
  riskAssessment: string; // AI or Self assessment
  aiFeedback?: string; // AI Review result
  tags?: string[]; // e.g. "Optimistic", "Conservative"
}

// 市场地位雷达图数据
export interface MarketRadarData {
  leverage: number;        // 杠杆率 (0-100, high leverage = low score usually, or high risk)
  riskTolerance: number;   // 风险承受力
  liquidity: number;       // 流动性
  careerStability: number; // 职业稳定性
  familyBurden: number;    // 家庭负担 (Inverse score)
  marketValuation: number; // 市场估值
}

// 房子拖累指数数据
export interface LifeDragMetrics {
  totalDragScore: number; // 0-100 (Higher is worse)
  careerLockScore: number; // 职业锁定
  geoLockScore: number; // 城市流动锁定
  lifestyleCompressionScore: number; // 生活品质压缩
  futureDelayScore: number; // 人生计划推迟
  advice: string;
}

// 替代人生方案
export interface AlternativePath {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  financialOutcome: string; 
  matchScore: number; // 0-100
}

// 决策不可逆程度
export type IrreversibilityLevel = 'reversible' | 'semi-irreversible' | 'irreversible';

export interface IrreversibleFactor {
  name: string;
  level: IrreversibilityLevel;
  impact: string;
  advice: string;
}

export interface NegotiationParams {
  listingPrice: number; // 挂牌价
  recentTransactionPrice: number; // 同小区近期成交均价 * 面积
  marketInventory: number; // 小区当前挂牌套数 (Inventory Level)
  listingDays: number; // 挂牌天数
  priceCuts: number; // 调价次数
  renovationScore: number; // 装修打分 1-10
  floorScore: number; // 楼层打分 1-10
}

export interface NegotiationResult {
  suggestedOfferLow: number;
  suggestedOfferHigh: number;
  sellerUrgencyScore: number; // 0-100
  urgencyFactors: string[];
  bargainSpace: number; // Percentage
}

// Liquidity Reality Check Types
export enum BuyerType {
  FIRST_TIME_YOUNG = 'first_time_young',
  UPGRADING_FAMILY = 'upgrading_family',
  INVESTOR = 'investor',
  DOWNSIZING = 'downsizing',
  RARE = 'rare'
}

export interface BuyerProfile {
  type: BuyerType;
  label: string;
  percentage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  characteristics: string[];
  concerns: string[];
}

export interface LiquidityAnalysis {
  liquidityScore: number;
  expectedSaleMonths: number;
  discountProbability: number;
  buyerProfiles: BuyerProfile[];
  trendIndicator: 'increasing' | 'stable' | 'decreasing';
  riskFactors: string[];
  strengths: string[];
}

export interface LiquidityParams {
  area: number;
  bedrooms: number;
  location: string;
  hasSchool: boolean;
  transitScore: number;
  priceLevel: 'low' | 'medium' | 'high' | 'luxury';
  propertyAge: number;
  competitionLevel: 'low' | 'medium' | 'high';
  populationTrend: 'growing' | 'stable' | 'declining';
  policyEnvironment: 'favorable' | 'neutral' | 'restrictive';
}


// 单个策略的对比结果
export interface StrategyResult {
  strategyName: string;
  totalInterest: number; // 总利息
  interestSaved: number; // 相比不还款节省的利息
  payoffMonths: number;  // 还清所需月数
  newMonthlyPayment: number; // 调整后的首月月供
  description: string;   // 优缺点描述
}

// 提前还款对比总表
export interface PrepaymentComparisonResult {
  noPrepayment: StrategyResult;
  reducePayment: StrategyResult;
  reduceTerm: StrategyResult;
  recommendation: string; // 简单推荐
}

export interface AssetComparisonItem {
  dimension: string;
  houseValue: string;
  houseScore: number; // 1-5, for visual coloring
  stockValue: string;
  stockScore: number;
}

export interface KnowledgeCardData {
  title: string;
  content: string;
  icon: string; 
}

export interface TaxParams {
  cityTier: 'tier1' | 'other';
  isSecondHand: boolean;
  area: number;
  buyerStatus: 'first' | 'second' | 'other';
  yearsHeld: '<2' | '2-5' | '>5';
  isSellerOnlyHome: boolean;
  price: number; // Total Price in Wan
  originalPrice?: number; // For VAT diff in Wan
}

export interface TaxResult {
  deedTax: number;
  vat: number;
  pit: number;
  total: number;
  breakdown: {
    deedRate: number;
    vatRate: number;
    pitRate: number;
  };
}

export interface AssetComparison {
  houseNetWorth: number; // 万元
  stockNetWorth: number; // 万元
  difference: number; // 万元 (House - Stock)
  winner: 'House' | 'Stock';
  housePros: string[];
  stockPros: string[];
  // New: Qualitative comparison data
  qualitative: AssetComparisonItem[];
  knowledgeCards: KnowledgeCardData[];
}

export interface InitialCostBreakdown {
  downPayment: number;
  deedTax: number;
  agencyFee: number;
  renovation: number;
  total: number;
}

// 核心计算结果
export interface CalculationResult {
  // 贷款基础数据
  loanAmount: number; // 万元
  downPayment: number; // 万元
  monthlyPayment: number; // 元 (首月)
  monthlyPaymentText: string;
  totalInterest: number; // 元
  totalRepayment: number; // 元
  monthlyData: MonthlyPayment[];
  
  // 初始成本细分 (新增)
  initialCosts: InitialCostBreakdown;
  
  // 提前还款深度分析
  prepaymentComparison?: PrepaymentComparisonResult;

  // 收益分析
  cashOnCashReturn: number; // % 现金回报率
  comprehensiveReturn: number; // % 综合回报率
  annualizedReturn: number; // % 年化收益率
  monthlyCoverageRatio: number; // 月供覆盖比
  
  netAnnualRent: number; // 万元
  projectedAppreciation: number; // 万元
  totalRevenue: number; // 万元
  totalInterestPaidInHolding: number; // 万元
  
  // 风险评估
  riskScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  cashFlowRisk: number; // 0-100
  leverageRisk: number; // 0-100
  breakEvenYear: number | null; // 盈亏平衡年
  totalMonthlyDebt: number; // 元 (新+旧)
  dtiRatio: number; // 偿债比
  
  // 资产对比
  assetComparison: AssetComparison;

  // 图表数据
  yearlyData: {
    year: number;
    cumulativeRent: number;
    propertyValue: number;
    realPropertyValue: number; // 去除通胀后
    totalReturn: number;
    remainingLoan: number;
    interestPaidYearly: number;
    principalPaidYearly: number;
    stockNetWorth: number; // 对应机会成本的净资产
    realStockNetWorth: number; // 去除通胀后
  }[];
  
  // 月度现金流数据
  monthlyCashFlow: MonthlyCashFlow[];
}

export interface StressTestResult {
  scenarioName: string;
  totalReturnChange: number; // 收益变化值
  returnRate: number; // 新的回报率
  monthlyPayment: number; // 新月供
  monthlyCoverage: number; // 新覆盖比
  diffRevenue: number; // 与基准的差额
  isNegative: boolean;
  description: string;
  totalRevenue: number; // Total revenue for this scenario
  explanation?: string; // 计算说明 (Optional for backward compatibility initially)
  changes?: string[]; // 参数变化列表
}

export interface CustomStressTestParams {
  name: string;
  priceChange: number; // %
  rentChange: number; // %
  rateChange: number; // %
  vacancyRate: number; // %
  holdingCostChange: number; // %
  sellYear?: number;
}

export interface AppreciationPredictorParams {
  cityTier: '一线' | '新一线' | '二线' | '三线及以下';
  district: '核心区' | '近郊' | '远郊';
  propertyType: '住宅' | '公寓' | '别墅';
  policyEnvironment: '宽松' | '中性' | '严格';
  infrastructurePlan: '重大规划' | '一般规划' | '无规划';
  populationTrend: '持续流入' | '稳定' | '流出';
  industryDevelopment: '强劲' | '中等' | '疲软';
}

export interface AppreciationPrediction {
  score: number; // 0-100
  level: 'S' | 'A' | 'B' | 'C' | 'D';
  yearlyRate: number[]; // 未来5年预测增长率
  recommendation: string;
  risks: string[];
  opportunities: string[];
  breakdown: {
    cityTierScore: number;
    districtScore: number;
    policyScore: number;
    infrastructureScore: number;
    populationScore: number;
    industryScore: number;
  };
}

export interface MonthlyCashFlow {
  month: number; // 1-12
  rentalIncome: number; // 租金收入
  mortgagePayment: number; // 贷款还款
  holdingCost: number; // 持有成本
  netCashFlow: number; // 净现金流
}