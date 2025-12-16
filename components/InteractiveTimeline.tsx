import React, { useState, useMemo } from 'react';
import { CalculationResult } from '../types';
import { Info } from 'lucide-react';

interface InteractiveTimelineProps {
  result: CalculationResult;
  language: 'ZH' | 'EN';
  t: any;
}

interface MetricCardProps {
  title: string;
  value: string;
  formula: string;
  bgClass: string;
  textClass: string;
  language: 'ZH' | 'EN';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, formula, bgClass, textClass, language }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className={`${bgClass} rounded-xl p-4 border relative`}>
      <div className="flex justify-between items-start mb-1">
        <div className={`text-xs ${textClass} font-medium flex-1`}>
          {title}
        </div>
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className={`h-3.5 w-3.5 ${textClass} opacity-50 hover:opacity-100 cursor-help`} />
          {showTooltip && (
            <div className="absolute right-0 top-6 w-64 bg-slate-900 dark:bg-slate-700 text-white text-xs p-3 rounded-lg shadow-xl z-50 border border-slate-700">
              <div className="font-semibold mb-1">{language === 'ZH' ? '计算公式' : 'Formula'}</div>
              <div className="text-slate-300">{formula}</div>
              <div className="absolute -top-1 right-2 w-2 h-2 bg-slate-900 dark:bg-slate-700 border-l border-t border-slate-700 transform rotate-45"></div>
            </div>
          )}
        </div>
      </div>
      <div className={`text-2xl font-bold ${textClass.replace('dark:text', 'dark:text')}`}>
        {value}
      </div>
    </div>
  );
};

const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({ result, language, t }) => {
  const [selectedYear, setSelectedYear] = useState(0);
  
  // Calculate cumulative values and additional metrics
  const enrichedData = useMemo(() => {
    if (!result.yearlyData || result.yearlyData.length === 0) return [];
    
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;
    const initialInvestment = result.downPayment + (result.initialCosts?.totalCost || 0);
    
    return result.yearlyData.map((yearData, index) => {
      cumulativeInterest += yearData.interestPaidYearly || 0;
      cumulativePrincipal += yearData.principalPaidYearly || 0;
      
      const netWorth = (yearData.propertyValue || 0) - (yearData.remainingLoan || 0);
      const totalCost = cumulativeInterest + cumulativePrincipal + initialInvestment;
      const equityRatio = yearData.propertyValue ? (netWorth / yearData.propertyValue) * 100 : 0;
      const leverageRatio = yearData.remainingLoan && netWorth ? (yearData.remainingLoan / netWorth) : 0;
      
      return {
        ...yearData,
        cumulativeInterest,
        cumulativePrincipal,
        netWorth,
        totalCost,
        equityRatio,
        leverageRatio,
        assetGap: netWorth - (yearData.stockNetWorth || 0),
        realAssetGap: (yearData.realPropertyValue || 0) - (yearData.remainingLoan || 0) - (yearData.realStockNetWorth || 0),
        roi: initialInvestment ? ((yearData.totalReturn || 0) / initialInvestment) * 100 : 0,
        annualizedRoi: index > 0 ? ((Math.pow(1 + ((yearData.totalReturn || 0) / initialInvestment), 1 / index) - 1) * 100) : 0
      };
    });
  }, [result.yearlyData, result.downPayment, result.initialCosts]);
  
  const maxYear = 70;
  const currentData = enrichedData[selectedYear];
  const hasData = selectedYear < enrichedData.length;
  
  if (!result.yearlyData || result.yearlyData.length === 0) {
    return null;
  }
  
  const totalPrice = result.downPayment && result.loanAmount 
    ? result.downPayment + result.loanAmount 
    : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        {language === 'ZH' ? '📊 交互式时间轴（0-70年）' : '📊 Interactive Timeline (0-70 Years)'}
      </h3>

      {/* Year Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {language === 'ZH' ? '选择年份' : 'Select Year'}
          </span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {language === 'ZH' ? `第 ${selectedYear} 年` : `Year ${selectedYear}`}
          </span>
        </div>
        
        <input
          type="range"
          min="0"
          max={maxYear - 1}
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(selectedYear / (maxYear - 1)) * 100}%, #e2e8f0 ${(selectedYear / (maxYear - 1)) * 100}%, #e2e8f0 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>{language === 'ZH' ? '开始' : 'Start'}</span>
          <span>{language === 'ZH' ? `${maxYear}年后` : `${maxYear} years`}</span>
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-12">
          <div className="text-slate-400 dark:text-slate-500 mb-2">
            {language === 'ZH' ? '📅 超出数据范围' : '📅 Out of Data Range'}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'ZH' 
              ? `当前持有年限设定为 ${enrichedData.length} 年，第 ${selectedYear} 年暂无数据` 
              : `Holding period is ${enrichedData.length} years, no data for year ${selectedYear}`}
          </div>
        </div>
      ) : currentData && (
        <div className="space-y-4">
          {/* Section 1: 核心资产指标 (4 metrics) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title={language === 'ZH' ? '房产价值' : 'Property Value'}
              value={`${currentData.propertyValue?.toFixed(1)} ${t.unitWanSimple}`}
              formula={language === 'ZH' ? '初始房价 × (1 + 年增值率)^年数' : 'Initial Price × (1 + Appreciation Rate)^Years'}
              bgClass="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800"
              textClass="text-blue-600 dark:text-blue-400"
              language={language}
            />
            
            <MetricCard
              title={language === 'ZH' ? '累计租金' : 'Cumulative Rent'}
              value={`${currentData.cumulativeRent?.toFixed(1)} ${t.unitWanSimple}`}
              formula={language === 'ZH' ? '∑(月租金 × 12 × (1 + 租金涨幅)^年数)' : '∑(Monthly Rent × 12 × (1 + Rent Growth)^Years)'}
              bgClass="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-100 dark:border-emerald-800"
              textClass="text-emerald-600 dark:text-emerald-400"
              language={language}
            />
            
            <MetricCard
              title={language === 'ZH' ? '剩余本金' : 'Remaining Principal'}
              value={`${currentData.remainingLoan?.toFixed(1)} ${t.unitWanSimple}`}
              formula={language === 'ZH' ? '初始贷款 - 累计已还本金' : 'Initial Loan - Cumulative Principal Paid'}
              bgClass="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800"
              textClass="text-purple-600 dark:text-purple-400"
              language={language}
            />
            
            <MetricCard
              title={language === 'ZH' ? '净资产' : 'Net Worth'}
              value={`${currentData.netWorth?.toFixed(1)} ${t.unitWanSimple}`}
              formula={language === 'ZH' ? '房产价值 - 剩余本金' : 'Property Value - Remaining Loan'}
              bgClass="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800"
              textClass="text-amber-600 dark:text-amber-400"
              language={language}
            />
          </div>

          {/* Section 2: 现金流指标 (5 metrics) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {language === 'ZH' ? '💰 现金流指标' : '💰 Cash Flow Metrics'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MetricCard
                title={language === 'ZH' ? '累计利息' : 'Total Interest'}
                value={`${currentData.cumulativeInterest?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '∑每年支付的利息' : '∑Yearly Interest Payments'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-red-600 dark:text-red-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '累计还款' : 'Total Repaid'}
                value={`${currentData.cumulativePrincipal?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '∑每年归还的本金' : '∑Yearly Principal Repaid'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-indigo-600 dark:text-indigo-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '本年利息' : 'Yearly Interest'}
                value={`${currentData.interestPaidYearly?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'Z' ? '当年度支付的贷款利息' : 'Interest Paid This Year'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-red-600 dark:text-red-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '本年还款' : 'Yearly Principal'}
                value={`${currentData.principalPaidYearly?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '当年度归还的本金' : 'Principal Repaid This Year'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-indigo-600 dark:text-indigo-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '总投入成本' : 'Total Cost'}
                value={`${currentData.totalCost?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '首付 + 初始费用 + 累计利息 + 累计还款' : 'Down Payment + Initial Costs + Interest + Principal'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-slate-700 dark:text-slate-200"
                language={language}
              />
            </div>
          </div>

          {/* Section 3: 收益分析 (5 metrics) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {language === 'ZH' ? '📈 收益分析' : '📈 Return Analysis'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MetricCard
                title={language === 'ZH' ? '总收益' : 'Total Return'}
                value={`${currentData.totalReturn?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '房产价值 + 累计租金 - 总投入成本' : 'Property Value + Rent - Total Cost'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass={(currentData.totalReturn || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '投资回报率' : 'ROI'}
                value={`${currentData.roi?.toFixed(1)}%`}
                formula={language === 'ZH' ? '(总收益 / 初始投资) × 100%' : '(Total Return / Initial Investment) × 100%'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass={currentData.roi >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '年化回报率' : 'Annualized ROI'}
                value={`${currentData.annualizedRoi?.toFixed(2)}%`}
                formula={language === 'ZH' ? '((1 + ROI)^(1/年数) - 1) × 100%' : '((1 + ROI)^(1/Years) - 1) × 100%'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-purple-600 dark:text-purple-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '租金收益率' : 'Rental Yield'}
                value={`${totalPrice ? ((currentData.cumulativeRent / totalPrice) * 100).toFixed(1) : '0.0'}%`}
                formula={language === 'ZH' ? '(累计租金 / 房屋总价) × 100%' : '(Cumulative Rent / Total Price) × 100%'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-emerald-600 dark:text-emerald-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '资产增值率' : 'Appreciation'}
                value={`${totalPrice ? (((currentData.propertyValue - totalPrice) / totalPrice) * 100).toFixed(1) : '0.0'}%`}
                formula={language === 'ZH' ? '((当前房价 - 初始房价) / 初始房价) × 100%' : '((Current - Initial) / Initial) × 100%'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-indigo-600 dark:text-indigo-400"
                language={language}
              />
            </div>
          </div>

          {/* Section 4: 机会成本对比 (4 metrics) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {language === 'ZH' ? '⚖️ 机会成本对比' : '⚖️ Opportunity Cost'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                title={language === 'ZH' ? '股票净值' : 'Stock Net Worth'}
                value={`${currentData.stockNetWorth?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '如果投资股票的当前资产' : 'If Invested in Stocks'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-purple-600 dark:text-purple-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '资产对比差值' : 'Asset Gap'}
                value={`${currentData.assetGap?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '房产净资产 - 股票净值' : 'Property Net Worth - Stock Worth'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass={currentData.assetGap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '实际房价（去通胀）' : 'Real Property Value'}
                value={`${currentData.realPropertyValue?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '名义房价 / (1 + 通胀率)^年数' : 'Nominal Value / (1 + Inflation)^Years'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-slate-700 dark:text-slate-200"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '实际资产差值' : 'Real Asset Gap'}
                value={`${currentData.realAssetGap?.toFixed(1)} ${t.unitWanSimple}`}
                formula={language === 'ZH' ? '(实际房价 - 剩余贷款) - 实际股票净值' : '(Real Property - Loan) - Real Stock'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass={currentData.realAssetGap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                language={language}
              />
            </div>
          </div>

          {/* Section 5: 杠杆与风险 (4 metrics) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {language === 'ZH' ? '⚠️ 杠杆与风险' : '⚠️ Leverage & Risk'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                title={language === 'ZH' ? '权益比例' : 'Equity Ratio'}
                value={`${currentData.equityRatio?.toFixed(1)}%`}
                formula={language === 'ZH' ? '(净资产 / 房产价值) × 100%' : '(Net Worth / Property Value) × 100%'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-indigo-600 dark:text-indigo-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '杠杆倍数' : 'Leverage Ratio'}
                value={`${currentData.leverageRatio?.toFixed(2)}x`}
                formula={language === 'ZH' ? '剩余贷款 / 净资产' : 'Remaining Loan / Net Worth'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-amber-600 dark:text-amber-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '贷款偿还进度' : 'Loan Progress'}
                value={`${result.loanAmount ? ((currentData.cumulativePrincipal / result.loanAmount) * 100).toFixed(1) : '0.0'}%`}
                formula={language === 'ZH' ? '(累计还款 / 总贷款) × 100%' : '(Cumulative Repaid / Total Loan) × 100%'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-purple-600 dark:text-purple-400"
                language={language}
              />
              
              <MetricCard
                title={language === 'ZH' ? '债务覆盖率' : 'Debt Coverage'}
                value={`${currentData.cumulativeRent && currentData.cumulativeInterest ? ((currentData.cumulativeRent / (currentData.cumulativeInterest + currentData.cumulativePrincipal)) * 100).toFixed(1) : '0.0'}%`}
                formula={language === 'ZH' ? '(累计租金 / 累计还款) × 100%' : '(Total Rent / Total Repayment) × 100%'}
                bgClass="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                textClass="text-emerald-600 dark:text-emerald-400"
                language={language}
              />
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
          <span>{language === 'ZH' ? '时间进度' : 'Time Progress'}</span>
          <span>{((selectedYear / maxYear) * 100).toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(selectedYear / maxYear) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
