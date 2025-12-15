import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { MarketRadarData } from '../types';
import { ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

interface MarketPositionRadarProps {
  data: MarketRadarData;
}

const MarketPositionRadar: React.FC<MarketPositionRadarProps> = ({ data }) => {
  const chartData = [
    { subject: '杠杆安全', value: data.leverage, fullMark: 100 },
    { subject: '风险承受', value: data.riskTolerance, fullMark: 100 },
    { subject: '流动性', value: data.liquidity || 50, fullMark: 100 }, // Fallback if 0/undefined
    { subject: '职业稳定', value: data.careerStability, fullMark: 100 },
    { subject: '家庭负担', value: data.familyBurden, fullMark: 100 },
    { subject: '市场估值', value: data.marketValuation, fullMark: 100 },
  ];

  // Zones data for background
  const zoneData = chartData.map(d => ({
    subject: d.subject,
    safe: 100,
    warning: 60, 
    danger: 30
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
            你在市场里的位置
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            六维核心竞争力评估 (外圈为优/安全区)
          </p>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500"></div><span className="text-slate-600 dark:text-slate-400">安全区</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500"></div><span className="text-slate-600 dark:text-slate-400">警戒区</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500"></div><span className="text-slate-600 dark:text-slate-400">危险区</span></div>
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            {/* Safe Zone Background (Whole Area) - Visual trick, usually handled by custom background, but Radar works if layered */}
            {/* Actually, Recharts Radar doesn't support 'stacking' nicely for backgrounds without custom shapes. 
                Simpler approach: 3 Polygons. 
            */}
            
            <Radar
              name="安全区"
              dataKey="fullMark"
              stroke="transparent"
              fill="#10b981"
              fillOpacity={0.1}
            />
             {/* We can't easily do concentric rings with dataKey like this without hacking the data structure.
                 Let's stick to just the user data and maybe a reference line or rely on the grid lines.
                 Or user wants Safe/Warning/Danger ZONES. 
                 Try rendering 3 Radars with static values?
                 Yes.
            */}
            
            {/* Danger Zone (Inner) */}
            {/* Warning Zone (Middle) */}
            {/* Safe Zone (Outer) - handled by the grid naturally? No, let's add coloured fills */}
            
            {/* Danger Zone - 0-30 */}
            {/* Warning Zone - 30-60 */}
            {/* Safe - 60-100 */}
            
            {/* Let's try gradient fill for the user data instead, and colored grid background? 
                Actually, simpler: Just show the user polygon vividly. 
                And maybe 2 background polygons for reference: 30 mark and 60 mark.
            */}
            <Radar name="危险线" dataKey={() => 30} stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 3" fill="#f43f5e" fillOpacity={0.05} />
            <Radar name="警戒线" dataKey={() => 60} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" fill="transparent" />
            
            <Radar
              name="我的位置"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              fill="#818cf8"
              fillOpacity={0.4}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        
        {/* Center label or overlay if needed */}
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
