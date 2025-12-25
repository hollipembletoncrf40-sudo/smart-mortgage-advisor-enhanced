import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { TrendingUp, Activity, AlertTriangle, Layers, Repeat, Briefcase, Zap, DollarSign, Wallet, Settings, Landmark, FileText } from 'lucide-react';
import { IncomeParams, EngineHealth } from './types';

// Constants
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

interface Props {
  data: IncomeParams;
  language: 'ZH' | 'EN';
  onEdit?: () => void;
  extendedParams?: { avgTaxRate?: number; incomeGrowthRate?: number };
}

const IncomeEngine: React.FC<Props> = ({ data, language, extendedParams }) => {
  const avgTaxRate = extendedParams?.avgTaxRate ?? 20;
  const incomeGrowthRate = extendedParams?.incomeGrowthRate ?? 5;
  
  // 1. Health Calculation
  const health = useMemo((): EngineHealth => {
    const totalIncome = data.monthlyIncome;
    const passiveIncome = data.sources
      .filter(s => ['investment', 'royalty', 'business'].includes(s.type))
      .reduce((sum, s) => sum + s.amount, 0);
    
    const passiveRatio = totalIncome > 0 ? (passiveIncome / totalIncome) : 0;
    
    // Replicability Score (0-100)
    const repScores = { low: 20, medium: 60, high: 100 };
    const weightedRep = data.sources.reduce((sum, s) => sum + (s.amount / totalIncome) * repScores[s.replicability], 0);

    // Diversity Score (based on number of significant sources > 10%)
    const significantSources = data.sources.filter(s => s.amount / totalIncome > 0.1).length;
    const diversityScore = Math.min(100, significantSources * 25);

    // Risk Inverse (Higher is better)
    const riskInverse = Math.max(0, 100 - data.industryRiskScore);

    // Growth Score (Avg growth rate)
    const avgGrowth = data.sources.reduce((sum, s) => sum + s.growthRate, 0) / (data.sources.length || 1);
    const growthScore = Math.min(100, avgGrowth * 5); // 20% growth = 100 score

    // Total Score
    const totalScore = Math.round(
      0.3 * (passiveRatio * 100) + 
      0.2 * weightedRep + 
      0.2 * riskInverse + 
      0.15 * diversityScore +
      0.15 * growthScore
    );

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (totalScore < 50) status = 'critical';
    else if (totalScore < 75) status = 'warning';

    const advice: string[] = [];
    if (passiveRatio < 0.2) advice.push(language === 'ZH' ? '被动收入占比过低' : 'Low passive income');
    if (weightedRep < 50) advice.push(language === 'ZH' ? '收入可复制性差 (手停口停)' : 'Low replicability (Time Trap)');
    if (data.liquidSavings < 6) advice.push(language === 'ZH' ? '现金流储备不足6个月' : 'Low Savings (<6mo)');

    return { totalScore, label: 'Income', status, metrics: [], advice };
  }, [data, language]);

  // Chart Data Preparation - Simplified Labels
  const pieData = data.sources.map(s => ({ name: s.name, value: s.amount }));
  const radarData = [
    { subject: language === 'ZH' ? '被动' : 'Passive', A: ((data.sources.filter(s => ['investment','business','royalty'].includes(s.type)).reduce((sum,s)=>sum+s.amount,0)/data.monthlyIncome)*100), fullMark: 100 },
    { subject: language === 'ZH' ? '复制' : 'Scalable', A: data.sources.reduce((sum, s) => sum + (s.amount / data.monthlyIncome) * (s.replicability==='high'?100:s.replicability==='medium'?60:20), 0), fullMark: 100 },
    { subject: language === 'ZH' ? '稳健' : 'Stable', A: data.sources.reduce((sum,s)=>sum+(s.amount/data.monthlyIncome)*s.stabilityScore, 0), fullMark: 100 },
    { subject: language === 'ZH' ? '增长' : 'Growth', A: Math.min(100, data.sources.reduce((sum,s)=>sum+s.growthRate,0)/data.sources.length*5), fullMark: 100 },
    { subject: language === 'ZH' ? '多元' : 'Diversity', A: Math.min(100, data.sources.length * 20), fullMark: 100 },
  ];

  // Projection Data
  const projectionData = [
    { name: language === 'ZH' ? '现在' : 'Now', val: data.monthlyIncome },
    { name: language === 'ZH' ? '+1年' : '+1Yr', val: Math.round(data.monthlyIncome * (1 + incomeGrowthRate/100)) },
    { name: language === 'ZH' ? '+3年' : '+3Yr', val: Math.round(data.monthlyIncome * Math.pow(1 + incomeGrowthRate/100, 3)) },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative group hover:border-indigo-500/30 transition-colors">
      
      {/* Edit Button */}


      {/* Header */}
      <div className="flex justify-between items-start mb-6 pr-12">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${health.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-500' : health.status === 'warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-500'}`}>
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {language === 'ZH' ? '收入引擎' : 'Income Engine'}
              <span className={`text-xs px-2 py-0.5 rounded-full ${health.status === 'healthy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : health.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                {health.totalScore}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ZH' ? '稳定性 · 可复制性 · 增长潜力' : 'Stability · Scalability · Growth'}
            </p>
          </div>
        </div>
        <div className="text-right">
           <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1 justify-end">
             <span className="text-sm text-slate-400 font-normal mr-1">$</span>
             {data.monthlyIncome.toLocaleString()} 
             <span className="text-xs text-slate-400 font-normal self-end mb-1">/mo</span>
           </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Income Composition */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 h-64 relative">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-center">
            {language === 'ZH' ? '收入来源构成' : 'Sources Breakdown'}
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', background: '#1e293b', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{data.sources.length}</span>
            <div className="text-[10px] text-slate-400">{language === 'ZH' ? '来源' : 'STREAMS'}</div>
          </div>
        </div>

        {/* Replicability Radar (Optimized) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 h-64">
           <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-center">
              {language === 'ZH' ? '收入健康六维' : 'Health Radar'}
           </h4>
           <div className="h-full flex items-center justify-center -mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                 <PolarGrid stroke="#334155" opacity={0.3} />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                 <Radar
                   name="Score"
                   dataKey="A"
                   stroke="#10b981"
                   fill="#10b981"
                   fillOpacity={0.3}
                 />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Growth Projection (New) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 h-64 hidden lg:block">
           <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-center">
              {language === 'ZH' ? '3年增长预测' : '3-Year Projection'}
           </h4>
           <ResponsiveContainer width="100%" height="90%">
              <BarChart data={projectionData} margin={{top: 20, right: 10, left: -20, bottom: 0}}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                 <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                 <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', background: '#1e293b', border: 'none', color: '#fff' }} />
                 <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Tax Impact Chart - driven by avgTaxRate slider */}
      <div className="mb-4">
        <h4 className="text-[10px] text-slate-400 mb-2 uppercase">{language === 'ZH' ? '税后收入分析' : 'Tax Impact'}</h4>
        <div className="h-16">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart 
               data={[
                 { name: language === 'ZH' ? '毛收入' : 'Gross', val: data.monthlyIncome, fill: '#3b82f6' },
                 { name: language === 'ZH' ? '税负' : 'Tax', val: Math.round(data.monthlyIncome * avgTaxRate / 100), fill: '#f43f5e' },
                 { name: language === 'ZH' ? '净收入' : 'Net', val: Math.round(data.monthlyIncome * (1 - avgTaxRate / 100)), fill: '#10b981' },
               ]}
               layout="vertical"
               margin={{top:0, bottom:0, right:30, left:50}}
             >
               <XAxis type="number" hide />
               <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 9, fill: '#94a3b8'}} />
               <Tooltip contentStyle={{background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '10px'}} />
               <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={12}>
                 {[0,1,2].map((i) => <Cell key={i} fill={['#3b82f6', '#f43f5e', '#10b981'][i]} />)}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Row (Expanded) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label={language === 'ZH' ? '稳定性' : 'Stability'} val={`${Math.round(100 - data.industryRiskScore)}/100`} icon={Activity} color="text-indigo-500" />
        <MetricCard label={language === 'ZH' ? '税务负担' : 'Avg Tax'} val={`${avgTaxRate}%`} icon={FileText} color="text-rose-500" />
        <MetricCard label={language === 'ZH' ? '年增长率' : 'Growth'} val={`${incomeGrowthRate > 0 ? '+' : ''}${incomeGrowthRate}%`} icon={TrendingUp} color="text-emerald-500" />
        <MetricCard label={language === 'ZH' ? '应急储备' : 'Runway'} val={`${data.liquidSavings} mo`} icon={Layers} color={data.liquidSavings > 6 ? 'text-emerald-500' : 'text-amber-500'} />
      </div>
    </div>
  );
};

const MetricCard = ({ label, val, icon: Icon, color }: any) => (
  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
    <Icon className={`h-4 w-4 ${color}`} />
    <span className="text-[10px] text-slate-400 uppercase">{label}</span>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{val}</span>
  </div>
);

export default IncomeEngine;
