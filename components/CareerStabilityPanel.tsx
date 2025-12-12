import React, { useState, useMemo } from 'react';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Bar,
  ReferenceLine
} from 'recharts';
import { Briefcase, AlertTriangle, ShieldCheck, Activity, Milestone } from 'lucide-react';
import { CalculationResult, InvestmentParams, CareerType, CareerStressResult } from '../types';
import { calculateCareerStress } from '../utils/calculate';

interface Props {
  result: CalculationResult;
  params: InvestmentParams;
  darkMode: boolean;
}

const CareerStabilityPanel: React.FC<Props> = ({ result, params, darkMode }) => {
  const [careerType, setCareerType] = useState<CareerType>(CareerType.STABLE);
  const [emergencyFund, setEmergencyFund] = useState<number>(params.emergencyFund || 10); // Sync with params later if needed

  const stressResult = useMemo(() => {
    return calculateCareerStress(params, result, careerType, emergencyFund);
  }, [params, result, careerType, emergencyFund]);

  const cards = [
    { 
      type: CareerType.STABLE, 
      label: '稳定职业', 
      desc: '教师/公务员/国企', 
      icon: ShieldCheck,
      color: 'indigo'
    },
    { 
      type: CareerType.CYCLICAL, 
      label: '周期职业', 
      desc: '互联网/金融/销售', 
      icon: Activity,
      color: 'amber' // Changed to amber/orange
    },
    { 
      type: CareerType.FREELANCE, 
      label: '自由职业', 
      desc: '自媒体/创业者', 
      icon: Briefcase,
      color: 'rose'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Career Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" /> 选择您的职业类型
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {cards.map((card) => {
               const Icon = card.icon;
               const isSelected = careerType === card.type;
               // Dynamic color classes based on selection
               const borderClass = isSelected 
                  ? (card.type === CareerType.STABLE ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                   : card.type === CareerType.CYCLICAL ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                   : 'border-rose-500 bg-rose-50 dark:bg-rose-900/20')
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200';
               
               return (
                  <button 
                    key={card.type}
                    onClick={() => setCareerType(card.type)}
                    className={`p-4 rounded-xl border-2 text-left transition-all relative ${borderClass}`}
                  >
                     {isSelected && (
                       <div className={`absolute -top-3 left-4 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm ${
                         card.type === CareerType.STABLE ? 'bg-indigo-500' : card.type === CareerType.CYCLICAL ? 'bg-amber-500' : 'bg-rose-500'
                       }`}>当前选择</div>
                     )}
                     <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                           <Icon className={`h-5 w-5 ${
                             card.type === CareerType.STABLE ? 'text-indigo-600' : card.type === CareerType.CYCLICAL ? 'text-amber-600' : 'text-rose-600'
                           }`} />
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 dark:text-white">{card.label}</div>
                           <div className="text-xs text-slate-500 dark:text-slate-400">{card.desc}</div>
                        </div>
                     </div>
                  </button>
               );
            })}
         </div>

         {/* Emergency Fund Input */}
         <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
             <div className="flex-1">
                 <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">应急备用金 (万元)</label>
                 <div className="text-xs text-slate-500">如果不幸失业，您手里有多少现金可以立马用于还房贷？</div>
             </div>
             <div className="w-32 relative">
                 <input 
                   type="number" 
                   value={emergencyFund} 
                   onChange={(e) => setEmergencyFund(Number(e.target.value))}
                   className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-right font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                 />
                 <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-slate-400 opacity-0">万</span>
             </div>
         </div>
      </div>

      {/* 2. Simulation Results & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Key Metrics */}
          <div className="lg:col-span-1 space-y-4">
              <div className={`p-6 rounded-3xl border shadow-sm ${
                  stressResult.foreclosureRisk === 'Critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800' :
                  stressResult.foreclosureRisk === 'High' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800' :
                  stressResult.foreclosureRisk === 'Medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800' :
                  'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800'
              }`}>
                 <div className="flex items-center gap-2 mb-2 opacity-80">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">断供风险预测</span>
                 </div>
                 <div className="text-3xl font-black mb-1">{stressResult.foreclosureRisk === 'Critical' ? '极高危' : stressResult.foreclosureRisk === 'High' ? '高风险' : stressResult.foreclosureRisk === 'Medium' ? '中等风险' : '相对安全'}</div>
                 <p className="text-sm opacity-80 leading-relaxed">
                    在第3年遭遇重创（收入减半）时，您的备用金可支撑 <span className="font-bold text-lg">{stressResult.survivalMonths.toFixed(1)}</span> 个月的房贷。
                 </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">最坏情况缺口</h4>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                      -{stressResult.worstYearGap.toFixed(1)} <span className="text-sm font-normal text-slate-400">万/年</span>
                  </div>
                  <div className="text-xs text-slate-500">
                      当发生职业震荡时，您的年度收支赤字。如果是 0 则表示仍有盈余。
                  </div>
              </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                 <Activity className="h-5 w-5 text-indigo-500" /> 压力测试模拟 (未来10年)
              </h4>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={stressResult.simulatedIncomePath} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                       <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v)=>`第${v}年`} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} unit="万" />
                       <Tooltip 
                          contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [value.toFixed(1) + '万', '']}
                       />
                       <Legend />
                       <ReferenceLine y={stressResult.simulatedIncomePath[0]?.payment} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '房贷红线', position: 'right', fill: '#ef4444', fontSize: 10 }} />
                       <Bar dataKey="income" name="模拟收入" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                       <Line type="monotone" dataKey="savings" name="累计备用金结余" stroke="#10b981" strokeWidth={3} dot={false} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-500 text-center">
                  模拟假设：第3年发生重大职业危机（收入减半），平时根据职业类型有不同的收入波动。
              </div>
          </div>
      </div>

    </div>
  );
};

export default CareerStabilityPanel;
