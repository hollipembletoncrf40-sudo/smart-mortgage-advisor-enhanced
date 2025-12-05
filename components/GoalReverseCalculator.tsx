import React, { useState, useEffect } from 'react';
import { Target, Calculator, TrendingUp, AlertTriangle, CheckCircle, Clock, Wallet, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface GoalReverseCalculatorProps {
  t: any;
  currentSavings?: number; // Optional initial value
  monthlySavings?: number; // Optional initial value
}

const GoalReverseCalculator: React.FC<GoalReverseCalculatorProps> = ({ t, currentSavings: initSavings = 50, monthlySavings: initMonthlySavings = 10000 }) => {
  // Goal Params
  const [targetPrice, setTargetPrice] = useState(300); // 万元
  const [targetYears, setTargetYears] = useState(5);
  const [downPaymentRatio, setDownPaymentRatio] = useState(30); // %

  // Financial Params
  const [currentSavings, setCurrentSavings] = useState(initSavings); // 万元
  const [monthlyIncome, setMonthlyIncome] = useState(30000); // 元
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState(0); // 元
  const [monthlyExpenses, setMonthlyExpenses] = useState(10000); // 元
  const [yearlyExpenses, setYearlyExpenses] = useState(20000); // 元 (Annual large expenses like travel, insurance)

  const [requiredRate, setRequiredRate] = useState<number | null>(null);
  const [feasibility, setFeasibility] = useState<'Achieved' | 'Easy' | 'Moderate' | 'Hard' | 'Impossible'>('Moderate');
  
  // Derived
  const netMonthlySavings = (monthlyIncome + otherMonthlyIncome) - monthlyExpenses - (yearlyExpenses / 12);
  const targetDownPaymentWan = targetPrice * (downPaymentRatio / 100);

  const calculateRequiredRate = () => {
    const targetAmount = targetDownPaymentWan * 10000;
    const initialPrincipal = currentSavings * 10000;
    const monthlyContribution = netMonthlySavings;
    const months = targetYears * 12;

    // 1. Check if already achieved
    if (initialPrincipal >= targetAmount) {
        setRequiredRate(0);
        setFeasibility('Achieved');
        return;
    }

    // 2. Check if achievable with 0% return (Savings only)
    const totalSavingsOnly = initialPrincipal + monthlyContribution * months;
    if (totalSavingsOnly >= targetAmount) {
        setRequiredRate(0);
        setFeasibility('Easy');
        return;
    }

    // 3. Binary search for rate
    let low = 0;
    let high = 1.0; // 100% annual return max
    let foundRate = -1;

    for (let i = 0; i < 100; i++) {
      const mid = (low + high) / 2;
      const monthlyRate = mid / 12;
      
      const fvLump = initialPrincipal * Math.pow(1 + monthlyRate, months);
      const fvContrib = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      const fv = fvLump + fvContrib;

      if (Math.abs(fv - targetAmount) < 100) { // Precision 100 yuan
        foundRate = mid;
        break;
      }

      if (fv < targetAmount) {
        low = mid;
      } else {
        high = mid;
      }
    }

    if (foundRate !== -1) {
      const annualRate = foundRate * 100;
      setRequiredRate(annualRate);
      
      if (annualRate <= 4) setFeasibility('Easy');
      else if (annualRate <= 8) setFeasibility('Moderate');
      else if (annualRate <= 15) setFeasibility('Hard');
      else setFeasibility('Impossible');
    } else {
      // Impossible with current savings
      setRequiredRate(null);
      setFeasibility('Impossible');
    }
  };

  useEffect(() => {
    calculateRequiredRate();
  }, [targetPrice, targetYears, downPaymentRatio, currentSavings, netMonthlySavings]);

  const getFeasibilityColor = () => {
    switch (feasibility) {
      case 'Achieved': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'Easy': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'Moderate': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800';
      case 'Hard': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'Impossible': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
  };

  const getFeasibilityText = () => {
    switch (feasibility) {
      case 'Achieved': return t.goalAchieved || '目标已达成';
      case 'Easy': return t.goalEasy || '轻松达成';
      case 'Moderate': return t.goalModerate || '努力可达';
      case 'Hard': return t.goalHard || '极具挑战';
      case 'Impossible': return t.goalImpossible || '无法达成';
    }
  };

  const cashFlowData = [
    { name: '收入', value: monthlyIncome + otherMonthlyIncome, fill: '#10b981' },
    { name: '支出', value: monthlyExpenses + (yearlyExpenses/12), fill: '#ef4444' },
    { name: '净储蓄', value: netMonthlySavings, fill: '#6366f1' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-pink-500 rounded-xl shadow-lg shadow-pink-500/20">
          <Target className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t.goalCalculatorTitle || '买房倒计时 (目标倒推)'}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="h-3 w-3"/> 购房目标</h3>
             <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">{t.targetPrice || '目标房价 (万)'}</label>
                    <div className="relative">
                    <input 
                        type="number" 
                        value={targetPrice} 
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">万</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">{t.targetYears || '计划年限'}</label>
                        <div className="relative">
                        <input 
                            type="number" 
                            value={targetYears} 
                            onChange={(e) => setTargetYears(Number(e.target.value))}
                            className="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">年</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">{t.downPaymentRatio || '首付比例'}</label>
                        <div className="relative">
                        <input 
                            type="number" 
                            value={downPaymentRatio} 
                            onChange={(e) => setDownPaymentRatio(Number(e.target.value))}
                            className="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-2 text-sm">
                    <span className="text-slate-500">目标首付金额:</span>
                    <span className="font-bold text-pink-600 dark:text-pink-400 text-lg">{targetDownPaymentWan.toFixed(1)} 万</span>
                </div>
             </div>
          </div>

          {/* Financial Status Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Wallet className="h-3 w-3"/> 财务状况</h3>
             
             <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">{t.currentSavings || '当前已有存款 (万)'}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={currentSavings} 
                            onChange={(e) => setCurrentSavings(Number(e.target.value))}
                            className="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">万</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">月收入 (元)</label>
                        <input 
                            type="number" 
                            value={monthlyIncome} 
                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">其他月收入 (元)</label>
                        <input 
                            type="number" 
                            value={otherMonthlyIncome} 
                            onChange={(e) => setOtherMonthlyIncome(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">月固定支出 (元)</label>
                        <input 
                            type="number" 
                            value={monthlyExpenses} 
                            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">年均大额支出 (元)</label>
                        <input 
                            type="number" 
                            value={yearlyExpenses} 
                            onChange={(e) => setYearlyExpenses(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 dark:text-white transition-all"
                        />
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl flex items-center justify-between border border-indigo-100 dark:border-indigo-800">
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">每月净储蓄:</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{netMonthlySavings.toFixed(0)} 元</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Results & Viz (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
           {/* Result Card */}
           <div className={`p-6 rounded-2xl border-2 ${getFeasibilityColor()} transition-all relative overflow-hidden flex-1 flex flex-col justify-center`}>
              <div className="relative z-10">
                <div className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">{t.requiredReturn || '所需年化收益率'}</div>
                <div className="text-5xl font-black mb-4 tracking-tight">
                  {requiredRate !== null ? (
                    <span>{requiredRate.toFixed(2)}<span className="text-2xl ml-1">%</span></span>
                  ) : (
                    <span className="text-3xl">无法达成</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 font-bold text-lg mb-4">
                  {feasibility === 'Achieved' && <CheckCircle className="h-6 w-6" />}
                  {feasibility === 'Easy' && <CheckCircle className="h-6 w-6" />}
                  {feasibility === 'Moderate' && <Clock className="h-6 w-6" />}
                  {(feasibility === 'Hard' || feasibility === 'Impossible') && <AlertTriangle className="h-6 w-6" />}
                  {getFeasibilityText()}
                </div>
                
                <p className="text-sm opacity-90 leading-relaxed bg-white/50 dark:bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                   {feasibility === 'Achieved' && '恭喜！您目前的资金已经足以支付首付。'}
                   {feasibility === 'Easy' && (t.adviceEasy || '您的目标非常稳健，建议选择低风险理财产品，如定期存款或国债。')}
                   {feasibility === 'Moderate' && (t.adviceModerate || '目标合理，建议构建股债平衡的投资组合，关注稳健型基金。')}
                   {feasibility === 'Hard' && (t.adviceHard || '目标具有挑战性，需要承担较高风险，建议增加月储蓄或延长购房时间。')}
                   {feasibility === 'Impossible' && (t.adviceImpossible || '以目前的储蓄速度难以达成，建议大幅增加收入、降低购房预算或推迟购房计划。')}
                </p>
              </div>
              
              {/* Background Icon */}
              <TrendingUp className="absolute -bottom-4 -right-4 h-40 w-40 opacity-10 rotate-12" />
           </div>

           {/* Cash Flow Viz */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm h-[200px]">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">月度收支分析</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 11}} width={50} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {cashFlowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GoalReverseCalculator;
