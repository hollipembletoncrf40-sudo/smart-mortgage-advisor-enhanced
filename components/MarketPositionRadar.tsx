import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { MarketRadarData, Language } from '../types';
import { ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

interface MarketPositionRadarProps {
  data: MarketRadarData;
  language?: Language;
}

const MarketPositionRadar: React.FC<MarketPositionRadarProps> = ({ data, language = 'ZH' }) => {
  const isEn = language === 'EN';

  const labels = {
    leverage: isEn ? 'Leverage Safety' : '杠杆安全',
    riskTolerance: isEn ? 'Risk Tolerance' : '风险承受',
    liquidity: isEn ? 'Liquidity' : '流动性',
    careerStability: isEn ? 'Career Stability' : '职业稳定',
    familyBurden: isEn ? 'Family Burden' : '家庭负担',
    marketValuation: isEn ? 'Market Value' : '市场估值',
    title: isEn ? 'Your Market Position' : '你在市场里的位置',
    subtitle: isEn ? '6D Core Competitiveness (Outer = Safe)' : '六维核心竞争力评估 (外圈为优/安全区)',
    safeZone: isEn ? 'Safe Zone' : '安全区',
    warningZone: isEn ? 'Warning Zone' : '警戒区',
    dangerZone: isEn ? 'Danger Zone' : '危险区',
    dangerLine: isEn ? 'Danger Line' : '危险线',
    myPosition: isEn ? 'My Position' : '我的位置',
    warningLine: isEn ? 'Warning Line' : '警戒线',
  };

  const chartData = [
    { subject: labels.leverage, value: data.leverage, fullMark: 100 },
    { subject: labels.riskTolerance, value: data.riskTolerance, fullMark: 100 },
    { subject: labels.liquidity, value: data.liquidity || 50, fullMark: 100 },
    { subject: labels.careerStability, value: data.careerStability, fullMark: 100 },
    { subject: labels.familyBurden, value: data.familyBurden, fullMark: 100 },
    { subject: labels.marketValuation, value: data.marketValuation, fullMark: 100 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
            {labels.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {labels.subtitle}
          </p>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500"></div><span className="text-slate-600 dark:text-slate-400">{labels.safeZone}</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500"></div><span className="text-slate-600 dark:text-slate-400">{labels.warningZone}</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500"></div><span className="text-slate-600 dark:text-slate-400">{labels.dangerZone}</span></div>
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            <Radar
              name={labels.safeZone}
              dataKey="fullMark"
              stroke="transparent"
              fill="#10b981"
              fillOpacity={0.1}
            />
            
            <Radar name={labels.dangerLine} dataKey={() => 30} stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 3" fill="#f43f5e" fillOpacity={0.05} />
            <Radar name={labels.warningLine} dataKey={() => 60} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" fill="transparent" />
            
            <Radar
              name={labels.myPosition}
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              fill="#818cf8"
              fillOpacity={0.4}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
         {chartData.map((d, i) => (
           <div key={i} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
             <span className="text-xs text-slate-500 dark:text-slate-400">{d.subject}</span>
             <span className={`text-sm font-bold ${d.value >= 80 ? 'text-emerald-500' : d.value >= 60 ? 'text-indigo-500' : d.value >= 30 ? 'text-amber-500' : 'text-rose-500'}`}>{Math.round(d.value)}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default MarketPositionRadar;
