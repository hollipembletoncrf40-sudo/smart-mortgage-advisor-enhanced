import React from 'react';
import { FreedomParams, RiskParams, LearningParams, Insurance, Skill } from './types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Wind, ShieldAlert, GraduationCap, MapPin, AlertTriangle, PlayCircle, Lock, Settings, HeartPulse, Calculator } from 'lucide-react';

// --- Freedom Engine ---
export const FreedomEngine: React.FC<{ data: FreedomParams, language: 'ZH' | 'EN' }> = ({ data, language }) => {
  const survivalYears = data.survivalMonthlyCost > 0 ? (data.liquidAssets / data.survivalMonthlyCost / 12) : 0;
  const comfortYears = data.comfortMonthlyCost > 0 ? (data.liquidAssets / data.comfortMonthlyCost / 12) : 0;
  
  const healthScore = Math.min(100, Math.round(
    0.3 * (comfortYears * 5) + 
    0.3 * data.skillTransferability +
    0.2 * (100 - data.locationLockScore) +
    0.2 * Math.max(0, 100 - (data.fireYearProjection - 5) * 5)
  ));
  
  const fiScore = Math.max(0, 100 - (data.fireYearProjection - 5) * 5); // 5 yr to FI = 100, 25 yr = 0

  const radarData = [
    { subject: language === 'ZH' ? '地理' : 'Geo', A: 100 - data.locationLockScore, fullMark: 100 },
    { subject: language === 'ZH' ? '跑道' : 'Runway', A: Math.min(100, comfortYears * 10), fullMark: 100 },
    { subject: language === 'ZH' ? '技能' : 'Skills', A: data.skillTransferability, fullMark: 100 },
    { subject: language === 'ZH' ? '被动' : 'Passive', A: Math.min(100, (data.passiveIncome / (data.comfortMonthlyCost || 1)) * 100), fullMark: 100 },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative group hover:border-indigo-500/30 transition-colors">

      <div className="flex items-center justify-between mb-4 pr-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-xl">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {language === 'ZH' ? '自由引擎' : 'Freedom Engine'}
              <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {Math.round(healthScore)}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'ZH' ? 'Fire进度 · 地理套利' : 'FIRE Progress · Geo-Arbitrage'}</p>
          </div>
        </div>
      </div>
      
      {/* FIRE Progress Chart - driven by freedom tab sliders */}
      <div className="mb-4">
        <h4 className="text-[10px] text-slate-400 mb-2 uppercase">{language === 'ZH' ? '财务自由进度' : 'FIRE Progress'}</h4>
        <div className="h-28">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart 
               data={[
                 { name: language === 'ZH' ? '生存跑道' : 'Survival', val: Math.min(100, survivalYears * 5), fill: '#10b981' },
                 { name: language === 'ZH' ? '舒适跑道' : 'Comfort', val: Math.min(100, comfortYears * 5), fill: '#3b82f6' },
                 { name: language === 'ZH' ? '被动/支出' : 'Passive%', val: Math.min(100, (data.passiveIncome / (data.comfortMonthlyCost || 1)) * 100), fill: '#8b5cf6' },
                 { name: language === 'ZH' ? '地理自由' : 'Geo Free', val: 100 - data.locationLockScore, fill: '#f59e0b' },
                 { name: language === 'ZH' ? '技能迁移' : 'Skills', val: data.skillTransferability, fill: '#ec4899' },
                 { name: language === 'ZH' ? '抚养负担' : 'Dependents', val: Math.max(0, 100 - data.dependents * 20), fill: '#06b6d4' },
               ]}
               layout="vertical"
               margin={{top:0, bottom:0, right:30, left:55}}
             >
               <XAxis type="number" hide domain={[0,100]} />
               <YAxis dataKey="name" type="category" width={55} tick={{fontSize: 9, fill: '#94a3b8'}} />
               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '10px'}} />
               <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={10} background={{ fill: '#334155', opacity: 0.1 }}>
                 {[0,1,2,3,4,5].map((i) => <Cell key={i} fill={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'][i]} />)}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="h-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
            <PolarGrid stroke="#334155" opacity={0.3} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Radar name="Freedom" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="absolute top-0 right-0 text-right">
             <div className="text-[10px] text-slate-400">{language === 'ZH' ? '财务自由预测' : 'FI PROJECTION'}</div>
             <div className="text-lg font-bold text-slate-700 dark:text-white">{data.fireYearProjection} {language === 'ZH' ? '年' : 'Years'}</div>
        </div>
      </div>
    </div>
  );
};

// --- Risk Engine ---
export const RiskEngine: React.FC<{ data: RiskParams, language: 'ZH' | 'EN', extendedParams?: { insuranceCoverage?: number } }> = ({ data, language, extendedParams }) => {
  const insuranceCoverageDisplay = extendedParams?.insuranceCoverage ?? 2000000;
  const bankruptcyMonths = data.monthlyBurn > 0 ? (data.emergencyFund / data.monthlyBurn) : 0;
  const insuranceScore = data.insurance.filter(i => i.valid).length / (data.insurance.length || 1) * 100; 

  // Dynamic risk data driven by sliders
  const riskData = [
     { name: language === 'ZH' ? '收入波动' : 'Income Vol', val: data.incomeVolatility, fill: '#f43f5e' }, 
     { name: language === 'ZH' ? '市场关联' : 'Mkt Corr', val: data.marketCorrelation, fill: '#f59e0b' },
     { name: language === 'ZH' ? '燃烧速率' : 'Burn Rate', val: Math.min(100, (data.monthlyBurn / 50000) * 100), fill: '#ef4444' },
  ];

  // Protection data driven by sliders
  const protectionData = [
     { name: language === 'ZH' ? '应急基金' : 'Emergency', val: Math.min(100, bankruptcyMonths * 8), fill: '#10b981' },
     { name: language === 'ZH' ? '保险覆盖' : 'Insurance', val: Math.min(100, (insuranceCoverageDisplay / 5000000) * 100), fill: '#3b82f6' },
     { name: language === 'ZH' ? '下行保护' : 'Protection', val: data.downsideProtectionScore, fill: '#8b5cf6' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative group hover:border-rose-500/30 transition-colors">

      <div className="flex items-center justify-between mb-4 pr-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {language === 'ZH' ? '风险引擎' : 'Risk Engine'}
              <span className="text-xs bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 px-2 py-0.5 rounded-full">
                 {data.downsideProtectionScore}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'ZH' ? '反脆弱 · 保险 · 黑天鹅' : 'Antifragility · Insurance'}</p>
          </div>
        </div>
      </div>
      
      {/* Risk Exposure Chart */}
      <div className="mb-4">
        <h4 className="text-[10px] text-slate-400 mb-2 uppercase">{language === 'ZH' ? '风险敞口' : 'Risk Exposure'}</h4>
        <div className="h-20">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={riskData} layout="vertical" margin={{top:0, bottom:0, right:30, left:50}}>
               <XAxis type="number" hide domain={[0,100]} />
               <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 9, fill: '#94a3b8'}} />
               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '10px'}} />
               <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={10} background={{ fill: '#334155', opacity: 0.1 }}>
                 {riskData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Protection Chart */}
      <div>
        <h4 className="text-[10px] text-slate-400 mb-2 uppercase">{language === 'ZH' ? '保护能力' : 'Protection'}</h4>
        <div className="h-20">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={protectionData} layout="vertical" margin={{top:0, bottom:0, right:30, left:50}}>
               <XAxis type="number" hide domain={[0,100]} />
               <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 9, fill: '#94a3b8'}} />
               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '10px'}} />
               <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={10} background={{ fill: '#334155', opacity: 0.1 }}>
                 {protectionData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Learning Engine ---
export const LearningEngine: React.FC<{ data: LearningParams, language: 'ZH' | 'EN', extendedParams?: { skillDemand?: number; aiReplacability?: number; skillDecayYears?: number } }> = ({ data, language, extendedParams }) => {
  const skillDemand = extendedParams?.skillDemand ?? 85;
  const aiReplacability = extendedParams?.aiReplacability ?? 40;
  const skillDecayYears = extendedParams?.skillDecayYears ?? 5;
  const transferability = data.skills.reduce((sum, s) => sum + s.proficiency * (s.marketDemand/100), 0) / (data.skills.length || 1);
  const npv = data.humanCapitalValuation; // Mocked NPV
  
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative group hover:border-amber-500/30 transition-colors">

      <div className="flex items-center justify-between mb-4 pr-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {language === 'ZH' ? '学习引擎' : 'Learning Engine'}
              <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {Math.round(transferability)}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'ZH' ? '技能半衰期 · 人力资本' : 'Skill Half-life · Human Capital'}</p>
          </div>
        </div>
      </div>

       <div className="mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-3 rounded-xl border border-amber-500/20 flex justify-between items-center">
          <div>
             <div className="text-[10px] text-amber-600 dark:text-amber-400 uppercase">{language === 'ZH' ? '人力资本估值' : 'Human Capital'}</div>
             <div className="text-lg font-black text-amber-600 dark:text-amber-300">${(npv/1000000).toFixed(1)}M</div>
          </div>
          <Calculator className="h-5 w-5 text-amber-400" />
      </div>

      {/* Skill Viability Chart - driven by sliders */}
      <div className="mb-4">
        <h4 className="text-[10px] text-slate-400 mb-2 uppercase">{language === 'ZH' ? '技能可行性分析' : 'Skill Viability'}</h4>
        <div className="h-24">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart 
               data={[
                 { name: language === 'ZH' ? '市场需求' : 'Demand', val: skillDemand, fill: '#3b82f6' },
                 { name: language === 'ZH' ? '抗AI能力' : 'AI-Proof', val: 100 - aiReplacability, fill: '#10b981' },
                 { name: language === 'ZH' ? '衰减速度' : 'Longevity', val: Math.min(100, skillDecayYears * 7), fill: '#8b5cf6' },
                 { name: language === 'ZH' ? '综合评分' : 'Overall', val: Math.round((skillDemand + (100 - aiReplacability) + skillDecayYears * 5) / 3), fill: '#f59e0b' },
               ]} 
               layout="vertical" 
               margin={{top:0, bottom:0, right:30, left:60}}
             >
               <XAxis type="number" hide domain={[0,100]} />
               <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 9, fill: '#94a3b8'}} />
               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '10px'}} />
               <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={12} background={{ fill: '#334155', opacity: 0.1 }}>
                 {[0,1,2,3].map((i) => <Cell key={i} fill={['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'][i]} />)}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
         {data.skills.slice(0, 3).map((skill, i) => (
             <div key={i} className="flex items-center justify-between text-xs group/skill">
                 <div className="flex flex-col">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-[9px] text-slate-400">{language === 'ZH' ? '半衰期' : 'Half-life'}: {skill.decayHalfLife} {language === 'ZH' ? '年' : 'yrs'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-400">{language === 'ZH' ? '熟练度' : 'Proficiency'}</span>
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};
