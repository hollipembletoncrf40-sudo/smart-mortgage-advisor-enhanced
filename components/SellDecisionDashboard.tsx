import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, 
  ArrowRight, ShieldCheck, HelpCircle, Lock, Unlock, Clock, Ghost,
  ArrowUpRight, ArrowDownRight, Info, Sliders, ChevronDown
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, ComposedChart, Area
} from 'recharts';
import { SellParams, SellResult } from '../types';
import { calculateSellScenario, calculateRegret } from '../utils/sellCalculations';

interface SellDecisionDashboardProps {
  t: any;
  language: 'ZH' | 'EN';
}

const SellDecisionDashboard: React.FC<SellDecisionDashboardProps> = ({ t, language }) => {
  // Initial Params
  const [params, setParams] = useState<SellParams>({
    currentPrice: 500, // 万
    originalPrice: 450, // 万
    remainingMortgage: 300, // 万
    monthlyIncome: 30000, // 元
    interestRate: 3.8, // %
    holdingCostPerYear: 1.5, // 万
    appreciationRate: 2.0, // %
    rentalYield: 1.5, // %
    investmentReturnRate: 3.5, // %
    careerStability: 80, 
    cityLockScore: 60,
    regretFearScore: 50
  });

  // Interactive Scenario State
  const [scenarioMarketChange, setScenarioMarketChange] = useState<number>(-10); // Default -10% drop
  const [scenarioMarketRise, setScenarioMarketRise] = useState<number>(20); // Default +20% rise

  const result = useMemo(() => calculateSellScenario(params), [params]);
  
  // Dynamic Regret Calculation
  const regretDrop = useMemo(() => calculateRegret(scenarioMarketChange, params.regretFearScore), [scenarioMarketChange, params.regretFearScore]);
  const regretRise = useMemo(() => calculateRegret(scenarioMarketRise, params.regretFearScore), [scenarioMarketRise, params.regretFearScore]);
  
  const unit = language === 'ZH' ? '万' : 'w';

  const handleParamChange = (key: keyof SellParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Waterfall Chart Data Preparation
  const waterfallData = [
    { name: language === 'ZH' ? '买入价' : 'Buy Price', value: result.illusionBreakdown.buyPrice, fill: '#94a3b8' },
    { name: language === 'ZH' ? '付息' : 'Interest', value: result.illusionBreakdown.interestPaid, fill: '#fb923c' },
    { name: language === 'ZH' ? '持有' : 'Holding', value: result.illusionBreakdown.holdingCosts, fill: '#fb923c' },
    { name: language === 'ZH' ? '通胀' : 'Inflation', value: result.illusionBreakdown.inflationLoss, fill: '#f87171' },
    { name: language === 'ZH' ? '总成本' : 'Total Cost', value: result.illusionBreakdown.totalCost, fill: '#ef4444', isTotal: true },
    { name: language === 'ZH' ? '卖出价' : 'Sell Price', value: result.illusionBreakdown.sellPrice, fill: '#6366f1', isTotal: true },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Area */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
              <Ghost className="h-8 w-8 text-indigo-400" />
              {language === 'ZH' ? '卖房决策智舱' : 'Sell Decision Cockpit'}
            </h2>
            <p className="text-slate-300 max-w-2xl text-sm leading-relaxed opacity-90">
              {language === 'ZH' 
                ? '这不是一个简单的计算器，而是一个“平行宇宙模拟器”。我们将帮你剥离沉没成本的心理干扰，推演“卖与不卖”在未来 30 年的真实人生分岔路。' 
                : 'This is not just a calculator, but a "Multiverse Simulator". We help you strip away sunk cost fallacies and simulate the real life divergence of "Sell vs Hold" over the next 30 years.'}
            </p>
          </div>
          
          <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[140px]">
                   <div className="text-xs text-indigo-200 mb-1">{language === 'ZH' ? '未来30年最优' : '30y Optimal'}</div>
                   <div className={`text-xl font-bold ${result.optimalPath === 'HOLD' ? 'text-indigo-300' : 'text-emerald-400'}`}>
                       {result.optimalPath === 'HOLD' ? (language === 'ZH' ? '继续持有' : 'HOLD') : (language === 'ZH' ? '建议卖出' : 'SELL NOW')}
                   </div>
               </div>
               <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[140px]">
                   <div className="text-xs text-indigo-200 mb-1">{language === 'ZH' ? '真实盈亏' : 'Real Profit'}</div>
                   <div className={`text-xl font-bold ${result.illusionBreakdown.realProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                       {result.illusionBreakdown.realProfit > 0 ? '+' : ''}{result.illusionBreakdown.realProfit.toFixed(0)}{unit}
                   </div>
               </div>
          </div>
        </div>
      </div>

      {/* Module 1: Current Dilemma Scan (Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DilemmaCard 
          icon={Unlock}
          title={language === 'ZH' ? '自由度锁定值' : 'Freedom Locked'}
          value={`${params.cityLockScore}`} 
          subtext={language === 'ZH' ? '被房子困住的程度' : 'Degree of being trapped'}
          color="indigo"
          score={params.cityLockScore}
          detail={language === 'ZH' ? '基于城市绑定与职业依赖' : 'Based on City & Career Lock'}
          items={[
             { label: language === 'ZH' ? '城市绑定' : 'City Lock', value: `${params.cityLockScore}%` },
             { label: language === 'ZH' ? '职业稳定' : 'Career Stability', value: `${params.careerStability}%` }
          ]}
        />
        <DilemmaCard 
          icon={Activity}
          title={language === 'ZH' ? '现金流压力' : 'Cash Flow Pressure'}
          value={`${result.cashFlowPressure.toFixed(0)}%`} 
          subtext={language === 'ZH' ? '月供占收入比重过高风险' : 'Risk of high DTI'}
          color="orange"
          score={result.cashFlowPressure}
          detail={language === 'ZH' ? `DTI: ${(result.dtiRatio*100).toFixed(0)}%` : `DTI: ${(result.dtiRatio*100).toFixed(0)}%`}
          items={[
             { label: language === 'ZH' ? '月供' : 'Payment', value: `${(params.remainingMortgage * 10000 * params.interestRate/100/12).toFixed(0)}` },
             { label: language === 'ZH' ? '持有成本' : 'Holding', value: `${(params.holdingCostPerYear*10000/12).toFixed(0)}` }
          ]}
        />
        <DilemmaCard 
          icon={ShieldCheck}
          title={language === 'ZH' ? '资产流动性' : 'Asset Liquidity'}
          value="Low" 
          subtext={language === 'ZH' ? '变现难度系数' : 'Difficulty to liquidate'}
          color="emerald"
          score={80} // Mock for now
          inverse
          detail={language === 'ZH' ? '预计成交周期: 6-12个月' : 'Est. Time to Sell: 6-12m'}
          items={[
             { label: language === 'ZH' ? '挂牌数' : 'Listings', value: 'High' },
             { label: language === 'ZH' ? '带看量' : 'Viewings', value: 'Low' }
          ]}
        />
      </div>

      {/* Parameters Control Bar (Refined) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {language === 'ZH' ? '关键假设调整' : 'Key Assumptions'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <InputSlider 
             label={language === 'ZH' ? '当前估值 (万)' : 'Current Price'} 
             value={params.currentPrice} 
             min={100} max={2000} step={10}
             onChange={(v) => handleParamChange('currentPrice', v)}
             color="indigo"
           />
           <InputSlider 
             label={language === 'ZH' ? '剩余贷款 (万)' : 'Remaining Loan'} 
             value={params.remainingMortgage} 
             min={0} max={1500} step={10}
             onChange={(v) => handleParamChange('remainingMortgage', v)}
             color="blue"
           />
           <InputSlider 
             label={language === 'ZH' ? '预期年涨幅 (%)' : 'Exp. Appreciation'} 
             value={params.appreciationRate} 
             min={-5} max={10} step={0.1}
             onChange={(v) => handleParamChange('appreciationRate', v)}
             color="emerald"
           />
           <InputSlider 
             label={language === 'ZH' ? '理财收益率 (%)' : 'Investment Return'} 
             value={params.investmentReturnRate} 
             min={1} max={8} step={0.1}
             onChange={(v) => handleParamChange('investmentReturnRate', v)}
             color="purple"
           />
        </div>
      </div>

      {/* Main Content: Tabs / Modules */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Module 2: 30-Year Multiverse Comparison */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-indigo-500" />
                        {language === 'ZH' ? '30年多世界线对比 (Multiverse)' : '30-Year Multiverse Comparison'}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {language === 'ZH' ? '拉长到30年周期，对比“持有”与“卖出”的复利效应' : 'Comparing Net Worth of holding vs selling over 30 years with compound interest'}
                    </p>
                </div>
                
                {/* Breakeven Annotation */}
                {result.multiversePath[10].sellNowNetWorth > result.multiversePath[10].holdNetWorth && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 border border-emerald-100 dark:border-emerald-800">
                        <ArrowUpRight className="h-4 w-4" />
                        {language === 'ZH' ? '10年后卖出策略优势: ' : '10y Sell Adv: '}
                        <span className="font-bold">{(result.multiversePath[10].sellNowNetWorth - result.multiversePath[10].holdNetWorth).toFixed(0)}{unit}</span>
                    </div>
                )}
            </div>
            
            <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={result.multiversePath} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorHold" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} unit={language === 'ZH' ? "万" : "w"} domain={['auto', 'auto']} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)', backgroundColor: '#1e293b', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        
                        <Area type="monotone" dataKey="holdNetWorth" name={language === 'ZH' ? "继续持有 (Hold)" : "Hold"} stroke="#6366f1" fill="url(#colorHold)" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                        <Area type="monotone" dataKey="sellNowNetWorth" name={language === 'ZH' ? "现在卖出 (Sell Now)" : "Sell Now"} stroke="#10b981" fill="url(#colorSell)" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="sellLaterNetWorth" name={language === 'ZH' ? "3年后卖 (Sell Later)" : "Sell Later"} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Module 3: Price Illusion Stripper (Waterfall Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-slate-100 dark:border-slate-800">
            <div className="p-8 border-r border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    {language === 'ZH' ? '价格错觉剥离器' : 'Price Illusion Stripper'}
                </h3>
                
                <div className="h-[300px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={waterfallData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.3} />
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                             <Bar dataKey="value" barSize={24} radius={[0, 4, 4, 0]}>
                                {waterfallData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                             </Bar>
                         </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{language === 'ZH' ? '实际真实盈亏' : 'Real Profit/Loss'}</span>
                     <span className={`text-xl font-bold ${result.illusionBreakdown.realProfit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {result.illusionBreakdown.realProfit > 0 ? '+' : ''}{result.illusionBreakdown.realProfit.toFixed(1)}{unit}
                     </span>
                </div>
            </div>

            {/* Module 6: Regret Model (Interactive) */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-purple-500" />
                    {language === 'ZH' ? '情景模拟 & 后悔概率' : 'Scenario & Regret Model'}
                </h3>
                
                {/* Interactive Sliders Section */}
                <div className="mb-6 space-y-6">
                    <InteractiveScenarioRow 
                         label={language === 'ZH' ? '如果未来3年房价下跌' : 'If Price Drops'}
                         value={scenarioMarketChange}
                         onChange={setScenarioMarketChange}
                         color="red"
                         impact={language === 'ZH' ? '持有后悔率' : 'Regret Holding'}
                         prob={regretDrop.regretHold}
                         min={-50} max={0}
                    />
                    
                    <InteractiveScenarioRow 
                         label={language === 'ZH' ? '如果未来3年房价上涨' : 'If Price Rises'}
                         value={scenarioMarketRise}
                         onChange={setScenarioMarketRise}
                         color="emerald"
                         impact={language === 'ZH' ? '卖出后悔率' : 'Regret Selling'}
                         prob={regretRise.regretSell}
                         min={0} max={100}
                    />
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm mt-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex gap-2">
                        <Info className="h-5 w-5 text-indigo-500 shrink-0" />
                        {language === 'ZH' 
                           ? '自由调节滑块来模拟极端市场情况。如果不仅“可接受”最好的结果，也能“承受”最坏的结果，那才是正确的决策。' 
                           : 'Adjust sliders to simulate extreme market conditions. The right decision is one where you can accept the best outcome AND withstand the worst.'}
                    </p>
                </div>
            </div>
        </div>

        {/* Module 4: Real World & Time Evasion */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    {language === 'ZH' ? '卖房后真实世界' : 'Real World After Sale'}
                 </h3>
                 <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden">
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-sm text-emerald-800 dark:text-emerald-300 mb-1 font-medium">{language === 'ZH' ? '卖房到手现金' : 'Cash in Hand'}</div>
                                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{result.cashAfterSale.toFixed(0)} <span className="text-lg">{unit}</span></div>
                            </div>
                            <div className="text-right text-xs text-slate-400">
                                <div>{language === 'ZH' ? '预计税费/中介费' : 'Est. Fees'}: {(params.currentPrice * 0.04).toFixed(1)}{unit}</div>
                                <div>{language === 'ZH' ? '偿还贷款' : 'Pay Mortgage'}: {params.remainingMortgage}{unit}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {language === 'ZH' ? 'AI 策略建议' : 'AI Strategic Advice'}
                             </h4>
                             <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                                {result.nextStepPotential[language === 'ZH' ? 'zh' : 'en']}
                             </p>
                        </div>
                     </div>
                 </div>
             </div>

             <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    {language === 'ZH' ? '时间博弈 (等1年)' : 'Wait 1 Year?'}
                 </h3>
                 <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm text-blue-800 dark:text-blue-300 font-medium">{language === 'ZH' ? '等1年盈亏期望' : '1 Yr Wait Gain/Loss'}</span>
                            <span className={`text-2xl font-bold ${result.waitOneYearOutcome.gainOrLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {result.waitOneYearOutcome.gainOrLoss > 0 ? '+' : ''}{result.waitOneYearOutcome.gainOrLoss.toFixed(1)}{unit}
                            </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-xs text-slate-500 border-b border-dashed border-slate-300 pb-1">
                                <span>{language === 'ZH' ? '+ 预期房产增值' : '+ Appreciation'}</span>
                                <span>+{(params.currentPrice * params.appreciationRate / 100).toFixed(1)}{unit}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 border-b border-dashed border-slate-300 pb-1">
                                <span>{language === 'ZH' ? '- 贷款利息支出' : '- Interest Cost'}</span>
                                <span>-{(params.remainingMortgage * params.interestRate / 100).toFixed(1)}{unit}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 border-b border-dashed border-slate-300 pb-1">
                                <span>{language === 'ZH' ? '- 资金机会成本' : '- Opportunity Cost'}</span>
                                <span>-{((params.currentPrice - params.remainingMortgage) * params.investmentReturnRate / 100).toFixed(1)}{unit}</span>
                            </div>
                        </div>

                        <div className={`p-3 rounded-xl border ${result.waitOneYearOutcome.recommendation === 'WAIT' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-red-100 border-red-200 text-red-800'} text-center font-bold`}>
                             {result.waitOneYearOutcome.recommendation === 'WAIT' 
                                 ? (language === 'ZH' ? '建议：值得等待' : 'Advice: WAIT') 
                                 : (language === 'ZH' ? '建议：尽早出手/止损' : 'Advice: SELL / CUT LOSS')}
                        </div>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

// Sub-components
const DilemmaCard = ({ icon: Icon, title, value, subtext, color, score, inverse, detail, items }: any) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative group overflow-hidden transition-all hover:shadow-md">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <Icon className={`h-28 w-28 text-${color}-500`} />
            </div>
            
            <div className="flex items-start justify-between mb-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold bg-${color}-50 text-${color}-600`}>
                    {detail}
                </div>
            </div>

            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">{value}</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">{title}</div>
            <div className="text-xs text-slate-400 mb-4">{subtext}</div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
                <div className={`h-full bg-${color}-500 transition-all duration-1000 ease-out`} style={{ width: `${score}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                {items && items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                        <div className="scale-90 opacity-70 mb-0.5">{item.label}</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const InteractiveScenarioRow = ({ label, value, onChange, color, impact, prob, min, max }: any) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-3">
             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
             <span className={`text-sm font-bold text-${color}-500 bg-${color}-50 px-2 py-0.5 rounded`}>
                 {value > 0 ? '+' : ''}{value}%
             </span>
        </div>
        <input 
            type="range" 
            min={min} max={max} step={5} 
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${color}-500 mb-4`}
        />
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{impact}</span>
            <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-${color}-500`} style={{ width: `${prob}%` }}></div>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{prob.toFixed(0)}%</span>
            </div>
        </div>
    </div>
)

const InputSlider = ({ label, value, min, max, step, onChange, color = 'indigo' }: any) => (
    <div className="space-y-4">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex justify-between items-center">
            {label}
            <span className={`text-${color}-600 font-mono bg-${color}-50 dark:bg-${color}-900/20 px-2 py-1 rounded-md min-w-[60px] text-center`}>
                {value}
            </span>
        </label>
        <input 
            type="range" 
            min={min} max={max} step={step} 
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className={`w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${color}-600`}
        />
    </div>
)

export default SellDecisionDashboard;
