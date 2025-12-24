import React, { useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Clock, AlertTriangle, ShieldCheck, Zap, TrendingUp, TrendingDown, 
  Brain, RotateCcw, Target
} from 'lucide-react';
import { BuyTargetParams } from '../types';
import { calculateBuyDeduction } from '../utils/buyCalculations';

interface BuyDecisionDashboardProps {
  t: any;
  language: 'ZH' | 'EN';
}

const BuyDecisionDashboard: React.FC<BuyDecisionDashboardProps> = ({ t, language }) => {
  // 1. Local State
  const [params, setParams] = useState<BuyTargetParams>({
    totalPrice: 300, // 万
    planYears: 5,
    downPaymentRatio: 30, // %
    currentSavings: 50, // 万
    monthlyIncome: 30000, // 元
    monthlyExpense: 10000,
    anxietyScore: 70,
    fomoScore: 65,
    marketHeat: 80,
    financialStretch: 60,
    decisionSpeed: 90
  });

  const [showRisks, setShowRisks] = useState(false);
  const [emotionalState, setEmotionalState] = useState<'neutral' | 'stressed' | 'fomo' | 'uncertain'>('neutral');

  // 2. Calculation
  // 2. Calculation
  const result = useMemo(() => calculateBuyDeduction(params, language), [params, language]);

  const handleParamChange = (key: keyof BuyTargetParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // 3. Helper Data for Charts
  const goalData = [
    { name: 'Savings', value: params.currentSavings, fill: '#10b981' },
    { name: 'Gap', value: result.gap, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
             <Clock className="h-8 w-8 text-rose-400" />
             {language === 'ZH' ? '买房倒计时 & 理性驾驶舱' : 'Buying Countdown & Rational Cockpit'}
          </h2>
          <p className="text-slate-300 max-w-2xl text-sm leading-relaxed opacity-90">
             {language === 'ZH' 
               ? '销售在制造焦虑，我们在还原真相。这是一个反FOMO（错失恐惧）系统，帮你从由于情绪驱动的“买买买”中抽离，用数据评估“等一周”的真实代价。'
               : 'Sales create urgency; we restore truth. This is an anti-FOMO system to detach you from emotional buying and evaluate the real cost of waiting.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Module 1: Goal Deduction (The Countdown) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-500" />
                  {language === 'ZH' ? '目标倒推 (Goal Deduction)' : 'Goal Deduction'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                          <InputGroup label={language === 'ZH' ? "目标房价 (万)" : "Target Price (w)"} value={params.totalPrice} onChange={(v: number) => handleParamChange('totalPrice', v)} />
                          <InputGroup label={language === 'ZH' ? "首付比例 (%)" : "Down Payment (%)"} value={params.downPaymentRatio} onChange={(v: number) => handleParamChange('downPaymentRatio', v)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <InputGroup label={language === 'ZH' ? "现有存款 (万)" : "Current Savings (w)"} value={params.currentSavings} onChange={(v: number) => handleParamChange('currentSavings', v)} />
                           <InputGroup label={language === 'ZH' ? "计划年限 (年)" : "Plan Years"} value={params.planYears} onChange={(v: number) => handleParamChange('planYears', v)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <InputGroup label={language === 'ZH' ? "月收入 (元)" : "Monthly Income"} value={params.monthlyIncome} onChange={(v: number) => handleParamChange('monthlyIncome', v)} />
                           <InputGroup label={language === 'ZH' ? "月支出 (元)" : "Monthly Expense"} value={params.monthlyExpense} onChange={(v: number) => handleParamChange('monthlyExpense', v)} />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                           <InputGroup label={language === 'ZH' ? "父母支持 (万)" : "Parental Support (w)"} value={params.parentalSupport || 0} onChange={(v: number) => handleParamChange('parentalSupport', v)} />
                      </div>
                  </div>

                  {/* Result Visualization */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative">
                      {/* Circular Progress (Simplified as Text for now or Recharts Pie) */}
                      <div className="h-32 w-32 relative mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie data={goalData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                                      {goalData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                  </Pie>
                              </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className="text-xs text-slate-400">{language === 'ZH' ? '缺口' : 'Gap'}</span>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{result.gap.toFixed(0)}w</span>
                          </div>
                      </div>

                      <div className="mb-2">
                          <div className="text-sm text-slate-500">{language === 'ZH' ? '所需年化收益率' : 'Required ROI'}</div>
                          <div className={`text-4xl font-bold ${result.isAchievable ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {result.isAchievable ? '0%' : `${result.requiredReturn.toFixed(1)}%`}
                          </div>
                      </div>
                      <div className="text-xs px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {result.isAchievable 
                             ? (language === 'ZH' ? '轻松达成' : 'Achievable') 
                             : (language === 'ZH' ? '目标激进，需理财辅助' : 'Aggressive Goal')}
                      </div>
                  </div>
              </div>
          </div>

          {/* Module 4: Impulse Radar (Psychological Check) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg relative overflow-hidden">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  {language === 'ZH' ? '冲动检测雷达' : 'Impulse Radar'}
               </h3>
               
               {result.isImpulsive && (
                   <div className="absolute top-4 right-4 animate-pulse flex items-center gap-1 text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full text-xs font-bold ring-1 ring-rose-200 dark:ring-rose-800">
                       <AlertTriangle className="h-3 w-3" />
                       {language === 'ZH' ? '冲动预警' : 'High Impulse'}
                   </div>
               )}

               <div className="h-[200px] w-full mb-4">
                   <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.impulseRadar}>
                           <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                           <Radar name="User" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                       </RadarChart>
                   </ResponsiveContainer>
               </div>

               {/* Emotional Inputs */}
               <div className="space-y-3">
                   <RangeInput label={language === 'ZH' ? '焦虑程度' : 'Anxiety'} value={params.anxietyScore} onChange={v => handleParamChange('anxietyScore', v)} color="rose" />
                   <RangeInput label={language === 'ZH' ? 'FOMO(踏空恐慌)' : 'FOMO'} value={params.fomoScore} onChange={v => handleParamChange('fomoScore', v)} color="orange" />
                   <RangeInput label={language === 'ZH' ? '市场热度感知' : 'Market Heat'} value={params.marketHeat} onChange={v => handleParamChange('marketHeat', v)} color="red" />
               </div>
          </div>
      </div>

      {/* Middle Section: Reality Layers & Delay Comparator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Module 2: Reality Layers */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-200">
                  {language === 'ZH' ? '多重倒计时 (真相层)' : 'Multiple Countdowns (Reality Layer)'}
              </h3>
              <div className="space-y-3">
                  <CountdownItem 
                      title={language === 'ZH' ? '房源保留倒计时' : 'Reservation expiry'} 
                      time="24:00:00" 
                      tag={language === 'ZH' ? '销售话术' : 'Sales Tactic'} 
                      tagColor="orange"
                  />
                  <CountdownItem 
                      title={language === 'ZH' ? '利率锁定截止' : 'Rate Lock Deadline'} 
                      time="48:00:00" 
                      tag={language === 'ZH' ? '市场真实' : 'Market Reality'} 
                      tagColor="emerald" 
                  />
                  <CountdownItem 
                      title={language === 'ZH' ? '开发商折扣有效期' : 'Developer Discount'} 
                      time="7 Days" 
                      tag={language === 'ZH' ? '混合套路' : 'Mixed'} 
                      tagColor="yellow" 
                  />
              </div>
          </div>

          {/* Module 3: Delay Comparator */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
               <h3 className="text-lg font-bold mb-4 text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                   <Clock className="h-5 w-5" />
                   {language === 'ZH' ? '延迟7天对比器' : '7-Day Delay Comparator'}
               </h3>
               <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-4 font-medium">
                   {language === 'ZH' ? '“你不是在赌涨跌，你是在用一周换清醒。”' : '"You are not betting on price, you are buying clarity."'}
               </p>
               
               <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm">
                        <span className="text-sm text-slate-500">{language === 'ZH' ? '房价上涨概率' : 'Prob. Price Rise'}</span>
                        <span className="font-bold text-rose-500">{result.delayAnalysis.probPriceRise}%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm">
                        <span className="text-sm text-slate-500">{language === 'ZH' ? '房价下跌概率' : 'Prob. Price Drop'}</span>
                        <span className="font-bold text-emerald-500">{result.delayAnalysis.probPriceDrop}%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm">
                        <span className="text-sm text-slate-500">{language === 'ZH' ? '多获得的思考时间价值' : 'Value of Clarity'}</span>
                        <span className="font-bold text-indigo-500">{result.delayAnalysis.clarityValue}/100</span>
                    </div>
               </div>
          </div>
      </div>

      {/* Bottom Section: Anti-Regret & Rational Reset */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Module 5: Anti-Regret */}
              <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-rose-400">
                      <ShieldCheck className="h-6 w-6" />
                      {language === 'ZH' ? '反后悔按钮 (核武器)' : 'Anti-Regret Button'}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">
                      {language === 'ZH' ? '如果不顾一切现在签约，三年后你可能因为什么而后悔？' : 'If you sign now, what will you regret in 3 years?'}
                  </p>
                  
                  {!showRisks ? (
                      <button 
                        onClick={() => setShowRisks(true)}
                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-900/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                          <Zap className="h-5 w-5" />
                          {language === 'ZH' ? '生成3条致命风险' : 'Generate 3 Fatal Risks'}
                      </button>
                  ) : (
                      <div className="space-y-4 animate-fade-in-up">
                          {result.risks.map(risk => (
                              <div key={risk.id} className="bg-white/10 p-4 rounded-xl border border-white/10">
                                  <div className="flex justify-between items-center mb-1">
                                      <div className="font-bold text-rose-300">{risk.riskTitle}</div>
                                      <div className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded uppercase">{risk.severity}</div>
                                  </div>
                                  <p className="text-xs text-slate-300 opacity-80">{risk.description}</p>
                              </div>
                          ))}
                          <button onClick={() => setShowRisks(false)} className="text-xs text-slate-500 underline mt-2 w-full text-center">
                              {language === 'ZH' ? '收起风险' : 'Hide Risks'}
                          </button>
                      </div>
                  )}
              </div>

              {/* Module 6: Rational Reset */}
              <div>
                   <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
                      <RotateCcw className="h-6 w-6" />
                      {language === 'ZH' ? '理性复位区' : 'Rational Reset Area'}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">
                      {language === 'ZH' ? '给你一个逃生出口。现在的你处于什么状态？' : 'Your escape hatch. What is your current state?'}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                      <button onClick={() => setEmotionalState('stressed')} className={`py-3 rounded-xl border transition-all ${emotionalState === 'stressed' ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-700 text-slate-400 hover:border-orange-500/50'}`}>
                          {language === 'ZH' ? '压力很大' : 'Stressed'}
                      </button>
                      <button onClick={() => setEmotionalState('fomo')} className={`py-3 rounded-xl border transition-all ${emotionalState === 'fomo' ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-700 text-slate-400 hover:border-rose-500/50'}`}>
                          {language === 'ZH' ? '怕错过(FOMO)' : 'FOMO'}
                      </button>
                      <button onClick={() => setEmotionalState('uncertain')} className={`py-3 rounded-xl border transition-all ${emotionalState === 'uncertain' ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-700 text-slate-400 hover:border-blue-500/50'}`}>
                          {language === 'ZH' ? '不确定' : 'Uncertain'}
                      </button>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl text-sm leading-relaxed text-slate-300 min-h-[100px]">
                      {emotionalState === 'neutral' && (language === 'ZH' ? '请选择当前状态以获取针对性建议。' : 'Select state to get advice.')}
                      {emotionalState === 'stressed' && (
                          <div className="animate-fade-in">
                              <p className="mb-2 font-bold text-orange-300">{language === 'ZH' ? '深呼吸。' : 'Breathe.'}</p>
                              {language === 'ZH' ? '现在的压力主要来自“必须现在做决定”的错觉。实际上，除了你自己的签字，没有任何力量能强迫你成交。建议：离开售楼处 1 小时，去喝杯咖啡。' : 'The pressure comes from the illusion of "now". Only you can sign. Suggestion: Leave the showroom for 1 hour.'}
                          </div>
                      )}
                      {emotionalState === 'fomo' && (
                          <div className="animate-fade-in">
                              <p className="mb-2 font-bold text-rose-300">{language === 'ZH' ? '你害怕的不是错过房子，是害怕“失败”。' : 'Fear of failure, not missing out.'}</p>
                              {language === 'ZH' ? '好房子永远有，且明年可能更便宜。现在冲进去当接盘侠的概率（30%）远大于你通过买房暴富的概率（5%）。' : 'Good houses always exist. The chance of being a bagholder (30%) is higher than getting rich (5%).'}
                          </div>
                      )}
                      {emotionalState === 'uncertain' && (
                          <div className="animate-fade-in">
                              <p className="mb-2 font-bold text-blue-300">{language === 'ZH' ? '不确定就是“No”。' : 'Uncertain means No.'}</p>
                              {language === 'ZH' ? '如果你对几百万的负债感到犹豫，那说明你的直觉在保护你。请相信直觉，回家，睡一觉再说。' : 'If you hesitate on millions of debt, your intuition is protecting you. Trust it. Go home.'}
                          </div>
                      )}
                  </div>
              </div>

          </div>
      </div>

    </div>
  );
};

// Sub-components
const InputGroup = ({ label, value, onChange }: any) => (
    <div>
        <label className="text-xs text-slate-500 block mb-1">{label}</label>
        <input 
            type="number" 
            value={value} 
            onChange={e => onChange(parseFloat(e.target.value))}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
    </div>
)

const RangeInput = ({ label, value, onChange, color }: any) => (
    <div className="flex items-center gap-4">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 w-24">{label}</label>
        <div className="flex-1 flex items-center gap-3">
             <input 
                type="range" 
                min="0" max="100" 
                value={value} 
                onChange={e => onChange(parseInt(e.target.value))}
                className={`w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
            />
            <span className={`text-xs font-bold w-6 text-${color}-600`}>{value}</span>
        </div>
    </div>
)

const CountdownItem = ({ title, time, tag, tagColor }: any) => (
    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800/50">
        <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</div>
            <div className="text-xs text-slate-400 font-mono tracking-wider">{time}</div>
        </div>
        <div className={`text-[10px] px-2 py-0.5 rounded border border-${tagColor}-200 text-${tagColor}-600 bg-${tagColor}-50 font-medium`}>
            {tag}
        </div>
    </div>
)

export default BuyDecisionDashboard;
