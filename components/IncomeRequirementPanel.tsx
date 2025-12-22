import React, { useMemo, useState } from 'react';
import { Wallet, AlertTriangle, CheckCircle, TrendingUp, Shield, Clock, DollarSign, Target, AlertCircle, Home, Building2, Percent, Calendar } from 'lucide-react';
import { InvestmentParams, CalculationResult, Language } from '../types';

interface IncomeRequirementPanelProps {
  params: InvestmentParams;
  result: CalculationResult;
  t: any;
  language: Language;
}

type RiskLevel = 'SAFE' | 'MODERATE' | 'HIGH' | 'DANGEROUS';
type PropertyPurpose = 'self_living' | 'investment';

interface IncomeAnalysis {
  monthlyPayment: number;
  requiredMonthlyIncome: number;
  requiredDailyIncome: number;
  currentMonthlyIncome: number;
  currentDti: number;
  safeDti: number;
  incomeGap: number;
  riskLevel: RiskLevel;
  downPaymentAmount: number;
  totalInterest: number;
  totalPayment: number;
  emergencyFundNeeded: number;
  yearsToSaveDownPayment: number;
  // 投资相关
  monthlyRent: number;
  vacancyLoss: number;
  netRentalIncome: number;
  netMonthlyPayment: number;
  rentalYield: number;
  paybackYears: number;
}

const IncomeRequirementPanel: React.FC<IncomeRequirementPanelProps> = ({ params, result, t, language }) => {
  const isEn = language === 'EN';
  
  // 自住/投资切换
  const [purpose, setPurpose] = useState<PropertyPurpose>('self_living');
  
  // 投资参数
  const [monthlyRentInput, setMonthlyRentInput] = useState<number>(
    Math.round(params.totalPrice * 10000 * 0.002) // 默认租金回报率0.2%/月
  );
  const [vacancyRate, setVacancyRate] = useState<number>(10); // 空置率10%
  const [maintenanceCost, setMaintenanceCost] = useState<number>(500); // 月维护费用
  const [propertyTax, setPropertyTax] = useState<number>(0); // 房产税（暂无）
  
  const analysis: IncomeAnalysis = useMemo(() => {
    const loanAmount = params.totalPrice * (1 - params.downPaymentRatio / 100) * 10000;
    const downPaymentAmount = params.totalPrice * (params.downPaymentRatio / 100) * 10000;
    const interestRate = params.interestRate || 3.5;
    const loanTerm = params.loanTerm || 30;
    
    // 计算月供（等额本息）
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTerm * 12;
    const monthlyPayment = monthlyRate > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : loanAmount / months;
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;
    
    // 投资计算
    const monthlyRent = monthlyRentInput;
    const vacancyLoss = monthlyRent * (vacancyRate / 100);
    const netRentalIncome = monthlyRent - vacancyLoss - maintenanceCost - propertyTax;
    const netMonthlyPayment = purpose === 'investment' 
      ? Math.max(0, monthlyPayment - netRentalIncome) 
      : monthlyPayment;
    
    // 租金收益率 = 年净租金 / 房价
    const rentalYield = (netRentalIncome * 12) / (params.totalPrice * 10000) * 100;
    
    // 回本年限
    const paybackYears = netRentalIncome > 0 
      ? downPaymentAmount / (netRentalIncome * 12) 
      : 999;
    
    // 根据用途计算安全收入要求
    const safeDti = 0.35;
    const requiredMonthlyIncome = netMonthlyPayment / safeDti;
    const requiredDailyIncome = requiredMonthlyIncome / 30;
    
    const currentMonthlyIncome = params.familyMonthlyIncome || 30000;
    const currentDti = netMonthlyPayment / currentMonthlyIncome;
    const incomeGap = requiredMonthlyIncome - currentMonthlyIncome;
    
    // 建议应急基金
    const emergencyFundNeeded = monthlyPayment * 6 + (currentMonthlyIncome * 0.5) * 6;
    
    // 计算攒首付需要多少年
    const monthlySaving = currentMonthlyIncome * 0.3;
    const yearsToSaveDownPayment = monthlySaving > 0 ? (downPaymentAmount / monthlySaving) / 12 : 999;
    
    // 风险评估
    let riskLevel: RiskLevel;
    if (currentDti <= 0.30) {
      riskLevel = 'SAFE';
    } else if (currentDti <= 0.40) {
      riskLevel = 'MODERATE';
    } else if (currentDti <= 0.50) {
      riskLevel = 'HIGH';
    } else {
      riskLevel = 'DANGEROUS';
    }
    
    return {
      monthlyPayment,
      requiredMonthlyIncome,
      requiredDailyIncome,
      currentMonthlyIncome,
      currentDti,
      safeDti,
      incomeGap,
      riskLevel,
      downPaymentAmount,
      totalInterest,
      totalPayment,
      emergencyFundNeeded,
      yearsToSaveDownPayment,
      monthlyRent,
      vacancyLoss,
      netRentalIncome,
      netMonthlyPayment,
      rentalYield,
      paybackYears
    };
  }, [params, result, purpose, monthlyRentInput, vacancyRate, maintenanceCost, propertyTax]);

  const getRiskConfig = (level: RiskLevel) => {
    switch (level) {
      case 'SAFE':
        return {
          icon: CheckCircle,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          title: isEn ? '🎉 Congratulations! Low Risk' : '🎉 恭喜！低风险',
          message: purpose === 'investment'
            ? (isEn ? 'Rental income covers most of the mortgage. Great investment!' : '租金收入覆盖大部分月供，投资回报可观！')
            : (isEn ? 'Your income comfortably covers this property.' : '您的收入完全可以覆盖这套房产，财务状况健康。')
        };
      case 'MODERATE':
        return {
          icon: Shield,
          color: 'text-amber-500',
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          title: isEn ? '⚠️ Moderate Risk' : '⚠️ 中等风险',
          message: purpose === 'investment'
            ? (isEn ? 'Rental income helps but you still need significant personal income.' : '租金收入有帮助，但仍需较多个人收入补贴。')
            : (isEn ? 'Manageable but tight. Build emergency fund before buying.' : '可承受但较紧张，建议先建立应急基金。')
        };
      case 'HIGH':
        return {
          icon: AlertTriangle,
          color: 'text-orange-500',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          title: isEn ? '🚨 High Risk - Consider Waiting' : '🚨 高风险 - 建议观望',
          message: purpose === 'investment'
            ? (isEn ? 'Rental yield too low. Consider higher-yield properties or wait for price drop.' : '租金回报率过低，建议寻找更高收益的房源或等待房价回调。')
            : (isEn ? 'Monthly payment exceeds safe limit. Increase down payment or find cheaper option.' : '月供超过安全线，建议提高首付或寻找更低价位房源。')
        };
      case 'DANGEROUS':
        return {
          icon: AlertCircle,
          color: 'text-rose-500',
          bg: 'bg-rose-50 dark:bg-rose-900/20',
          border: 'border-rose-200 dark:border-rose-800',
          title: isEn ? '🛑 Dangerous - Do Not Buy Now' : '🛑 危险 - 暂不建议购买',
          message: purpose === 'investment'
            ? (isEn ? 'Negative cash flow! This investment will drain your finances.' : '现金流为负！此投资将持续消耗您的积蓄，不建议购买。')
            : (isEn ? 'Monthly payment exceeds 50% of income! Severely impacts life quality.' : '月供超过收入50%！将严重影响生活质量。')
        };
    }
  };

  const config = getRiskConfig(analysis.riskLevel);
  const RiskIcon = config.icon;

  const formatMoney = (amount: number) => {
    if (Math.abs(amount) >= 10000) {
      return `${(amount / 10000).toFixed(2)}万`;
    }
    return `${amount.toFixed(0)}元`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {isEn ? 'Income Requirement Analysis' : '收入门槛分析'}
          </h2>
        </div>
        
        {/* 自住/投资切换 */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => setPurpose('self_living')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              purpose === 'self_living'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Home className="h-4 w-4" />
            {isEn ? 'Self-Living' : '自住'}
          </button>
          <button
            onClick={() => setPurpose('investment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              purpose === 'investment'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="h-4 w-4" />
            {isEn ? 'Investment' : '投资'}
          </button>
        </div>
      </div>

      {/* 投资参数输入 */}
      {purpose === 'investment' && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6 border border-indigo-100 dark:border-indigo-900/30">
          <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {isEn ? 'Investment Parameters' : '投资参数设置'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                {isEn ? 'Monthly Rent (¥)' : '月租金(元)'}
              </label>
              <input
                type="number"
                value={monthlyRentInput}
                onChange={(e) => setMonthlyRentInput(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                {isEn ? 'Vacancy Rate (%)' : '空置率(%)'}
              </label>
              <input
                type="number"
                value={vacancyRate}
                onChange={(e) => setVacancyRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                {isEn ? 'Maintenance (¥/mo)' : '维护费用(元/月)'}
              </label>
              <input
                type="number"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                {isEn ? 'Property Tax (¥/mo)' : '房产税(元/月)'}
              </label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>
          
          {/* 投资数据概览 */}
          <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-indigo-200 dark:border-indigo-800">
            <div className="text-center">
              <div className="text-xs text-slate-500">{isEn ? 'Gross Rent' : '毛租金'}</div>
              <div className="font-bold text-emerald-600">{formatMoney(analysis.monthlyRent)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500">{isEn ? 'Net Rent' : '净租金'}</div>
              <div className={`font-bold ${analysis.netRentalIncome > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatMoney(analysis.netRentalIncome)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500">{isEn ? 'Rental Yield' : '租金回报率'}</div>
              <div className={`font-bold ${analysis.rentalYield >= 4 ? 'text-emerald-600' : analysis.rentalYield >= 2 ? 'text-amber-600' : 'text-rose-600'}`}>
                {analysis.rentalYield.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500">{isEn ? 'Payback (Down)' : '首付回本'}</div>
              <div className={`font-bold ${analysis.paybackYears <= 10 ? 'text-emerald-600' : analysis.paybackYears <= 20 ? 'text-amber-600' : 'text-rose-600'}`}>
                {analysis.paybackYears < 100 ? `${analysis.paybackYears.toFixed(1)}年` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 风险评估卡片 */}
      <div className={`rounded-2xl p-5 mb-6 border-2 ${config.bg} ${config.border}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 ${config.color}`}>
            <RiskIcon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${config.color}`}>{config.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">{config.message}</p>
          </div>
        </div>
      </div>

      {/* 核心数据 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {isEn ? 'Monthly Payment' : '月供金额'}
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatMoney(analysis.monthlyPayment)}
          </div>
        </div>
        
        {purpose === 'investment' && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {isEn ? 'Net Payment (After Rent)' : '净月供(扣租金后)'}
            </div>
            <div className={`text-2xl font-bold ${analysis.netMonthlyPayment <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {analysis.netMonthlyPayment <= 0 
                ? (isEn ? 'Cash Positive!' : '正现金流!')
                : formatMoney(analysis.netMonthlyPayment)
              }
            </div>
          </div>
        )}
        
        <div className={`bg-gradient-to-br rounded-xl p-4 text-center ${
          purpose === 'investment' 
            ? 'from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20' 
            : 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
        }`}>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {isEn ? 'Safe Monthly Income' : '安全月收入门槛'}
          </div>
          <div className={`text-2xl font-bold ${purpose === 'investment' ? 'text-violet-600 dark:text-violet-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {formatMoney(analysis.requiredMonthlyIncome)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{isEn ? '(DTI ≤ 35%)' : '(月供≤收入35%)'}</div>
        </div>
        
        <div className={`rounded-xl p-4 text-center ${
          analysis.currentDti <= 0.35 
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20' 
            : analysis.currentDti <= 0.5 
              ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20'
              : 'bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20'
        }`}>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {isEn ? 'Your Current DTI' : '您当前月供比'}
          </div>
          <div className={`text-2xl font-bold ${
            analysis.currentDti <= 0.35 ? 'text-emerald-600 dark:text-emerald-400' 
            : analysis.currentDti <= 0.5 ? 'text-amber-600 dark:text-amber-400' 
            : 'text-rose-600 dark:text-rose-400'
          }`}>
            {(analysis.currentDti * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {purpose === 'investment' 
              ? (isEn ? 'after rental income' : '扣除租金后')
              : (isEn ? 'of income' : '收入占比')
            }
          </div>
        </div>
      </div>

      {/* 收入差距提示 */}
      {analysis.incomeGap > 0 && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
            <Target className="h-5 w-5" />
            {isEn ? 'Income Gap' : '收入缺口'}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            {purpose === 'investment'
              ? (isEn 
                ? `Even with rental income, you need ¥${analysis.incomeGap.toFixed(0)}/month more. Consider: higher rent property, reduce vacancy, or increase personal income.`
                : `即使有租金收入，您还需额外 ${formatMoney(analysis.incomeGap)}/月。可考虑：高租金房源、降低空置率、或增加个人收入。`)
              : (isEn 
                ? `You need ¥${analysis.incomeGap.toFixed(0)}/month more to reach safe affordability.`
                : `您需要额外 ${formatMoney(analysis.incomeGap)}/月 才能达到安全负担水平。`)
            }
          </p>
        </div>
      )}

      {/* 详细参数参考 */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-indigo-500" />
          {isEn ? 'Financial Details' : '财务明细参考'}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">{isEn ? 'Down Payment' : '首付金额'}:</span>
            <span className="font-medium text-slate-800 dark:text-white">{formatMoney(analysis.downPaymentAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{isEn ? 'Total Interest' : '利息总额'}:</span>
            <span className="font-medium text-rose-600">{formatMoney(analysis.totalInterest)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{isEn ? 'Total Payment' : '还款总额'}:</span>
            <span className="font-medium text-slate-800 dark:text-white">{formatMoney(analysis.totalPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{isEn ? 'Emergency Fund' : '建议应急金'}:</span>
            <span className="font-medium text-amber-600">{formatMoney(analysis.emergencyFundNeeded)}</span>
          </div>
        </div>
      </div>

      {/* 建议 */}
      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
        <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {purpose === 'investment' 
            ? (isEn ? 'Investment Tips' : '投资购房建议')
            : (isEn ? 'Smart Buying Tips' : '聪明购房建议')
          }
        </h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          {purpose === 'investment' ? (
            <>
              <li>• {isEn ? 'Target rental yield ≥ 4% for good investment' : '目标租金回报率 ≥ 4% 才是好投资'}</li>
              <li>• {isEn ? 'Consider vacancy: budget 10-20% loss' : '考虑空置损失：预留10-20%'}</li>
              <li>• {isEn ? 'Cash flow positive is ideal, negative means you subsidize' : '正现金流最佳，负现金流意味着贴钱'}</li>
              <li>• {isEn ? 'Factor in maintenance, repairs, and management costs' : '计入维修、管理和意外支出'}</li>
            </>
          ) : (
            <>
              <li>• {isEn ? 'Keep monthly payment ≤ 35% of income' : '月供控制在收入35%以内'}</li>
              <li>• {isEn ? 'Have 6+ months emergency fund before buying' : '购房前准备6个月以上应急资金'}</li>
              <li>• {isEn ? 'Consider all costs: property tax, maintenance' : '考虑所有成本：物业费、维修费'}</li>
              <li>• {isEn ? "Don't let house rich = cash poor" : '不要"房子富人、现金穷人"'}</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default IncomeRequirementPanel;
