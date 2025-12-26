import React, { useState } from 'react';
import { TrendingDown, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  monthlyPayment: number;
  t: any;
  language: 'ZH' | 'EN';
  darkMode: boolean;
}

const InflationProjection: React.FC<Props> = ({ monthlyPayment, t, language, darkMode }) => {
  const [inflationRate, setInflationRate] = useState(3.0);
  const [showInfo, setShowInfo] = useState(false);

  const calculateFutureValue = (years: number) => {
    return monthlyPayment / Math.pow(1 + inflationRate / 100, years);
  };

  const generateChartData = () => {
    const data = [];
    for (let year = 0; year <= 30; year += 2) {
      data.push({
        year: year,
        original: monthlyPayment,
        realValue: calculateFutureValue(year),
        discount: ((1 - calculateFutureValue(year) / monthlyPayment) * 100).toFixed(0)
      });
    }
    return data;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {language === 'ZH' ? '通胀红利预测' : 'Inflation Bonus Curve'}
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ZH' ? '随着时间推移，您的真实还款压力将大幅降低' : 'Real burden decreases significantly over time'}
              </p>
            </div>
          </div>
          
          {/* Rate Adjuster */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700 self-start md:self-auto">
            <span className="text-xs font-bold text-slate-500 ml-1">{language === 'ZH' ? '预计通胀率' : 'Inflation'}:</span>
            <input 
              type="number" 
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              step="0.5"
              className="w-14 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <span className="text-xs font-bold text-slate-500 mr-1">%</span>
          </div>
        </div>

        {showInfo && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in slide-in-from-top-2">
            {language === 'ZH' 
              ? '房贷金额是固定的，但货币购买力会随通胀下降。图中绿色区域展示了您的“真实”还款压力如何随时间递减。30年后，同样的月供可能只相当于现在的几分之一。' 
              : 'Mortgage payments are fixed, but purchasing power drops with inflation. The green area shows how your "real" burden decreases over time. In 30 years, the same payment might feel like a fraction of what it is today.'}
          </div>
        )}

        {/* Chart Area */}
        <div className="h-[250px] w-full mt-4">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={generateChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
               <XAxis 
                 dataKey="year" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: '#94A3B8', fontSize: 10 }}
                 tickFormatter={(value) => `${value}y`}
               />
               <YAxis 
                 hide={true} 
                 domain={['dataMin', 'dataMax']} 
               />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 labelFormatter={(label) => `${label} ${language === 'ZH' ? '年后' : 'Years Later'}`}
                 formatter={(value, name) => [
                   `¥${Number(value).toFixed(0)}`, 
                   name === 'realValue' 
                     ? (language === 'ZH' ? '真实价值' : 'Real Value') 
                     : (language === 'ZH' ? '名义月供' : 'Nominal')
                 ]}
               />
               <Area 
                 type="monotone" 
                 dataKey="realValue" 
                 stroke="#10B981" 
                 strokeWidth={3}
                 fillOpacity={1} 
                 fill="url(#colorReal)" 
                 name="realValue"
                 animationDuration={1500}
               />
               {/* Reference line for original payment - visually distinct */}
               <Area 
                 type="monotone" 
                 dataKey="original" 
                 stroke="#94A3B8" 
                 strokeDasharray="5 5" 
                 fill="none" 
                 strokeOpacity={0.5}
                 name="original"
               />
             </AreaChart>
           </ResponsiveContainer>
        </div>
        
        {/* Insight Footer */}
        <div className="mt-4 flex justify-between items-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
           <span>{language === 'ZH' ? '30年累计通胀红利' : '30Y Inflation Bonus'}:</span>
           <span className="font-black text-emerald-500 text-sm">
             -{((1 - calculateFutureValue(30) / monthlyPayment) * 100).toFixed(0)}%
           </span>
        </div>
      </div>
    </div>
  );
};

export default InflationProjection;
