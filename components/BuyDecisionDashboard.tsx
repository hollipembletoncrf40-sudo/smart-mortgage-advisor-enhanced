import React, { useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Clock, AlertTriangle, ShieldCheck, Zap, TrendingUp, TrendingDown, 
  Brain, RotateCcw, Target, Info, XCircle, MessageCircle, Binary
} from 'lucide-react';
import { BuyTargetParams } from '../types';
import { calculateBuyDeduction } from '../utils/buyCalculations';

interface BuyDecisionDashboardProps {
  t: any;
  language: 'ZH' | 'EN';
  params: BuyTargetParams;
  onParamChange: (params: BuyTargetParams) => void;
}

const BuyDecisionDashboard: React.FC<BuyDecisionDashboardProps> = ({ t, language, params, onParamChange }) => {
  // Local state removed, using props 'params'

  const handleParamChange = (key: keyof BuyTargetParams, value: number) => {
    onParamChange({ ...params, [key]: value });
  };


  const [showRisks, setShowRisks] = useState(false);
  const [emotionalState, setEmotionalState] = useState<'neutral' | 'stressed' | 'fomo' | 'uncertain'>('neutral');
  const [selectedTruth, setSelectedTruth] = useState<TruthContent | null>(null);

  const handleReveal = (type: 'tactic' | 'reality' | 'mixed') => {
      const data: Record<string, TruthContent> = language === 'ZH' ? {
          tactic: {
              type: '销售话术',
              script: "哥/姐，这套房现在有三组客户在看，房东/开发商只给了我24小时保留权限。如果您今晚不转定金，系统自动释放，明天可能就没了。",
              reality: "这是经典的“假性稀缺”。除非是倒挂严重的红盘，否则“系统自动释放”通常是销售主管手动设置的心理施压。房子的真实售出周期通常按月计算，而不是按小时。",
              verdict: "建议：不要被“24小时”吓住。告诉销售：“好的，如果明天还在，说明我们有缘；如果卖了，说明这房不适合我。”"
          },
          reality: {
              type: '市场真实',
              script: "接银行通知，下周一利率全线上调 10BP。现在网签能锁定当前低利率，省下几十万利息。",
              reality: "这通常是真实的外部约束。银行政策调整有明确时间点（如LPR调整日或银行额度耗尽）。这是您需要优先考虑的“硬约束”，而非单纯的话术。",
              verdict: "建议：去银行官网或新闻核实消息源。如果是真的，需要加速决策流程。"
          },
          mixed: {
              type: '混合套路',
              script: "特价房活动仅限本周，下周一回收 2% 折扣，到时候总价要多出 5 万。",
              reality: "半真半假。月底/年底为了冲业绩报表，折扣确实可能回收。但如果市场冷淡，下周虽然“活动结束”，通常会有“新活动”接力，或者您可以申请“特批保留”。",
              verdict: "建议：不要仅仅为了折扣而买。如果房子本身满意，可以作为谈判筹码：“如果能帮我保留这个折扣到下周，我更有可能成交。”"
          }
      } : {
          tactic: {
              type: 'Sales Tactic',
              script: "This unit has 3 other interested parties. I can only hold it for 24 hours. If no deposit tonight, it goes back on the market.",
              reality: "Classic artificial scarcity. Unless it's a super-hot property, 'system release' is a pressure tactic controlled by managers. Real sales cycles are months, not hours.",
              verdict: "Advice: Call the bluff. 'If it's still there tomorrow, it's destiny. If not, it wasn't meant for me.'"
          },
          reality: {
              type: 'Market Reality',
              script: "Bank rates are hiking 10bps next Monday. Signing now locks your rate and saves $50k interest.",
              reality: "Likely TRUE. Central bank policies and quota deadlines are real external constraints, not just sales talk.",
              verdict: "Advice: Verify with bank news. If true, speed up your decision, but don't skip due diligence."
          },
          mixed: {
              type: 'Mixed Tactic',
              script: "The 2% Manager's Discount ends this Sunday. Price goes up $10k on Monday.",
              reality: "Half-true. Quarters/Years end, and targets matter. But in a slow market, 'new' discounts usually appear next week, or exemptions can be made.",
              verdict: "Advice: Don't buy JUST for the discount. Use it: 'If you can extend this discount to next week, I'm more likely to sign.'"
          }
      };
      setSelectedTruth(data[type]);
  };

  // 2. Calculation
  // 2. Calculation
  const result = useMemo(() => calculateBuyDeduction(params, language), [params, language]);



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
                      onReveal={() => handleReveal('tactic')}
                  />
                  <CountdownItem 
                      title={language === 'ZH' ? '利率锁定截止' : 'Rate Lock Deadline'} 
                      time="48:00:00" 
                      tag={language === 'ZH' ? '市场真实' : 'Market Reality'} 
                      tagColor="emerald" 
                      onReveal={() => handleReveal('reality')}
                  />
                  <CountdownItem 
                      title={language === 'ZH' ? '开发商折扣有效期' : 'Developer Discount'} 
                      time="7 Days" 
                      tag={language === 'ZH' ? '混合套路' : 'Mixed'} 
                      tagColor="yellow" 
                      onReveal={() => handleReveal('mixed')}
                  />
              </div>
          </div>

          <TruthRevealModal 
            content={selectedTruth} 
            onClose={() => setSelectedTruth(null)} 
            language={language}
          />

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
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Module 5: Anti-Regret */}
              <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-rose-500 dark:text-rose-400">
                      <ShieldCheck className="h-6 w-6" />
                      {language === 'ZH' ? '反后悔按钮 (核武器)' : 'Anti-Regret Button'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                      {language === 'ZH' ? '如果不顾一切现在签约，三年后你可能因为什么而后悔？' : 'If you sign now, what will you regret in 3 years?'}
                  </p>
                  
                  {!showRisks ? (
                      <button 
                        onClick={() => setShowRisks(true)}
                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 dark:shadow-rose-900/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                          <Zap className="h-5 w-5" />
                          {language === 'ZH' ? '生成3条致命风险' : 'Generate 3 Fatal Risks'}
                      </button>
                  ) : (
                      <div className="space-y-4 animate-fade-in-up">
                          {result.risks.map(risk => (
                              <div key={risk.id} className="bg-rose-50 dark:bg-white/10 p-4 rounded-xl border border-rose-100 dark:border-white/10">
                                  <div className="flex justify-between items-center mb-1">
                                      <div className="font-bold text-rose-600 dark:text-rose-300">{risk.riskTitle}</div>
                                      <div className="text-xs px-2 py-0.5 bg-rose-200 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded uppercase">{risk.severity}</div>
                                  </div>
                                  <p className="text-xs text-rose-800/70 dark:text-slate-300 dark:opacity-80">{risk.description}</p>
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
                   <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
                      <RotateCcw className="h-6 w-6" />
                      {language === 'ZH' ? '理性复位区' : 'Rational Reset Area'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                      {language === 'ZH' ? '给你一个逃生出口。现在的你处于什么状态？' : 'Your escape hatch. What is your current state?'}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                      <button onClick={() => setEmotionalState('stressed')} className={`py-3 rounded-xl border transition-all ${emotionalState === 'stressed' ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-500/50 hover:text-orange-500'}`}>
                          {language === 'ZH' ? '压力很大' : 'Stressed'}
                      </button>
                      <button onClick={() => setEmotionalState('fomo')} className={`py-3 rounded-xl border transition-all ${emotionalState === 'fomo' ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-500/50 hover:text-rose-500'}`}>
                          {language === 'ZH' ? '怕错过(FOMO)' : 'FOMO'}
                      </button>
                      <button onClick={() => setEmotionalState('uncertain')} className={`py-3 rounded-xl border transition-all ${emotionalState === 'uncertain' ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500/50 hover:text-blue-500'}`}>
                          {language === 'ZH' ? '不确定' : 'Uncertain'}
                      </button>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 min-h-[100px] border border-slate-100 dark:border-transparent">
                      {emotionalState === 'neutral' && (language === 'ZH' ? '请选择当前状态以获取针对性建议。' : 'Select state to get advice.')}
                      {emotionalState === 'stressed' && (
                          <div className="animate-fade-in">
                              <p className="mb-2 font-bold text-orange-500 dark:text-orange-300">{language === 'ZH' ? '深呼吸。' : 'Breathe.'}</p>
                              {language === 'ZH' ? '现在的压力主要来自“必须现在做决定”的错觉。实际上，除了你自己的签字，没有任何力量能强迫你成交。建议：离开售楼处 1 小时，去喝杯咖啡。' : 'The pressure comes from the illusion of "now". Only you can sign. Suggestion: Leave the showroom for 1 hour.'}
                          </div>
                      )}
                      {emotionalState === 'fomo' && (
                          <div className="animate-fade-in">
                              <p className="mb-2 font-bold text-rose-500 dark:text-rose-300">{language === 'ZH' ? '你害怕的不是错过房子，是害怕“失败”。' : 'Fear of failure, not missing out.'}</p>
                              {language === 'ZH' ? '好房子永远有，且明年可能更便宜。现在冲进去当接盘侠的概率（30%）远大于你通过买房暴富的概率（5%）。' : 'Good houses always exist. The chance of being a bagholder (30%) is higher than getting rich (5%).'}
                          </div>
                      )}
                      {emotionalState === 'uncertain' && (
                          <div className="animate-fade-in">
                              <p className="mb-2 font-bold text-blue-500 dark:text-blue-300">{language === 'ZH' ? '不确定就是“No”。' : 'Uncertain means No.'}</p>
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

const CountdownItem = ({ title, time, tag, tagColor, onReveal }: any) => (
    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800/50">
        <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</div>
            <div className="text-xs text-slate-400 font-mono tracking-wider">{time}</div>
        </div>
        <button 
            onClick={onReveal}
            className={`text-[10px] px-2 py-0.5 rounded border border-${tagColor}-200 text-${tagColor}-600 bg-${tagColor}-50 font-medium hover:scale-105 transition-transform cursor-pointer flex items-center gap-1`}
        >
            {tag} <Info className="h-3 w-3" />
        </button>
    </div>
)

interface TruthContent {
    type: string;
    script: string;
    reality: string;
    verdict: string;
}

const TruthRevealModal = ({ content, onClose, language }: { content: TruthContent | null, onClose: () => void, language: 'ZH' | 'EN' }) => {
    if (!content) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-700/50 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <XCircle className="h-6 w-6" />
                </button>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                    <ShieldCheck className="h-6 w-6 text-indigo-500" />
                    {language === 'ZH' ? '理性解码器' : 'Reality Decoder'}
                </h3>

                <div className="space-y-6">
                    {/* Sales Script */}
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                        <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {language === 'ZH' ? '销售话术 (听听就好)' : 'The Sales Script'}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                            "{content.script}"
                        </p>
                    </div>

                    {/* The Truth */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                            <Binary className="h-3 w-3" />
                            {language === 'ZH' ? '市场真相 (核心逻辑)' : 'The Reality'}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {content.reality}
                        </p>
                    </div>

                    {/* Verdict */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                             <div className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold">
                                 {language === 'ZH' ? '理性建议' : 'Verdict'}
                             </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {content.verdict}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyDecisionDashboard;
