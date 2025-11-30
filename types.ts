
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
  // 房屋信息
  totalPrice: number; // 万元
  downPaymentRatio: number; // %
  holdingYears: number; // 年
  
  // 隐性成本 (新增)
  deedTaxRate: number; // % 契税
  agencyFeeRatio: number; // % 中介费
  renovationCost: number; // 万元 装修
  
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
  vacancyRate: number; // % (空置率)
  
  // 现有资产 (新增)
  existingPropertyCount: number; 
  existingMonthlyDebt: number; // 元 (现有负债)
  purchaseScenario: PurchaseScenario;

  // 风险评估
  emergencyFund: number; // 万元
  familyMonthlyIncome: number; // 元
  
  // 机会成本与通胀 (新增 inflationRate)
  alternativeReturnRate: number; // % (理财/股票年化收益率)
  inflationRate: number; // % (通货膨胀率)

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
  icon?: string; 
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
}