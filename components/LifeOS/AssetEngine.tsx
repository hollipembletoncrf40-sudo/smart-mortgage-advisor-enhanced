import React, { useMemo } from 'react';
import { AssetParams, EngineHealth } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Landmark, Settings, AlertOctagon, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface Props {
  data: AssetParams;
  language: 'ZH' | 'EN';
  onChange?: (data: AssetParams) => void;
  onEdit?: () => void;
  extendedParams?: { portfolioReturn?: number; portfolioVolatility?: number };
}

const AssetEngine: React.FC<Props> = ({ data, language, extendedParams }) => {
  const portfolioReturn = extendedParams?.portfolioReturn ?? 4.5;
  const portfolioVolatility = extendedParams?.portfolioVolatility ?? 12;
  const health = useMemo((): EngineHealth => {
    const totalValue = data.totalValue || 1;
    const totalLiability = data.assets.reduce((sum, a) => sum + (a.liability || 0), 0);
    const netWorth = totalValue - totalLiability;
    
    // Liquidity Score
    const liquidValue = data.assets
      .filter(a => ['T0', 'T7'].includes(a.liquidity))
      .reduce((sum, a) => sum + (a.value - (a.liability || 0)), 0);
    const liquidityRatio = data.monthlyExpense > 0 ? liquidValue / data.monthlyExpense : 0;
    const liquidityScore = Math.min(100, liquidityRatio * 5); // 20 months = 100

    // Leverage Score (Debt Ratio)
    const debtRatio = totalLiability / totalValue; // 0.3 is healthy, 0.6 is risky
    const leverageScore = Math.max(0, 100 - (debtRatio * 150)); // 0% debt = 100, 66% debt = 0

    // Growth Score
    const weightedReturn = data.assets.reduce((sum, a) => sum + (a.value / totalValue) * a.expectedReturn, 0);
    const growthScore = Math.min(100, weightedReturn * 10); 

    // Total Score
    const totalScore = Math.round(
      0.3 * liquidityScore + 
      0.3 * leverageScore + 
      0.2 * growthScore + 
      0.2 * 50 // Quality Base
    );

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (totalScore < 50) status = 'critical';
    else if (totalScore < 75) status = 'warning';

    const advice = [];
    if (liquidityRatio < 6) advice.push(language === 'ZH' ? '流动性不足6个月' : 'Low liquidity < 6mo');
    if (debtRatio > 0.5) advice.push(language === 'ZH' ? '杠杆率过高 (>50%)' : 'High Leverage > 50%');

    return { totalScore, label: 'Assets', status, metrics: [], advice };
  }, [data, language]);

  // Visual Data
  const allocationData = data.assets.map(a => ({ name: a.name, value: a.value }));
  const leverageData = [
     { name: language === 'ZH' ? '净值' : 'Equity', value: (data.totalValue - data.assets.reduce((s,a)=>s+(a.liability||0),0)) },
     { name: language === 'ZH' ? '负债' : 'Debt', value: data.assets.reduce((s,a)=>s+(a.liability||0),0) }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative group hover:border-indigo-500/30 transition-colors">
      
      {/* Edit Button */}


      {/* Header */}
      <div className="flex justify-between items-start mb-6 pr-12">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${health.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-500' : health.status === 'warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-500'}`}>
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {language === 'ZH' ? '资产引擎' : 'Asset Engine'}
              <span className={`text-xs px-2 py-0.5 rounded-full ${health.status === 'healthy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : health.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                {health.totalScore}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ZH' ? '净资产 · 杠杆率 · 流动性' : 'Net Worth · Leverage · Liquidity'}
            </p>
          </div>
        </div>
        <div className="text-right">
             <div className="text-2xl font-black text-slate-900 dark:text-white flex flex-col items-end">
               <span>{(data.netWorth / 10000).toFixed(1)}W</span>
             </div>
             <div className="text-xs text-slate-500 uppercase tracking-widest">
               {language === 'ZH' ? '净资产' : 'Net Worth'}
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Allocation Pie */}
        <div className="h-40 relative">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie data={allocationData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                 {allocationData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
               </Pie>
               <Tooltip contentStyle={{background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px'}} />
             </PieChart>
           </ResponsiveContainer>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
               {data.assets.length}
             </span>
           </div>
        </div>
        
        {/* Leverage Bar */}
        <div className="flex flex-col justify-center gap-4">
             <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-500">
                      <span>{language === 'ZH' ? '总资产' : 'Gross Assets'}</span>
                      <span>{(data.totalValue/10000).toFixed(0)}W</span>
                 </div>
                 <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{width: '100%'}}></div>
                 </div>
             </div>
             <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-500">
                      <span>{language === 'ZH' ? '负债总额' : 'Liabilities'}</span>
                      <span className="text-rose-500">{(data.assets.reduce((s,a)=>s+(a.liability||0),0)/10000).toFixed(0)}W</span>
                 </div>
                 <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{width: `${data.debtToAssetRatio * 100}%`}}></div>
                 </div>
             </div>
        </div>
      </div>
      
      {/* Portfolio Growth Projection - driven by portfolioReturn slider */}
      <div className="mb-4">
        <h4 className="text-[10px] text-slate-400 mb-2 uppercase">{language === 'ZH' ? '5年增长预测' : '5-Year Projection'}</h4>
        <div className="h-24">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart 
               data={[
                 { name: language === 'ZH' ? '现在' : 'Now', val: data.netWorth / 10000 },
                 { name: language === 'ZH' ? '+1年' : '+1Yr', val: Math.round(data.netWorth * (1 + portfolioReturn/100)) / 10000 },
                 { name: language === 'ZH' ? '+3年' : '+3Yr', val: Math.round(data.netWorth * Math.pow(1 + portfolioReturn/100, 3)) / 10000 },
                 { name: language === 'ZH' ? '+5年' : '+5Yr', val: Math.round(data.netWorth * Math.pow(1 + portfolioReturn/100, 5)) / 10000 },
               ]}
               margin={{top:0, bottom:0, right:10, left:-10}}
             >
               <XAxis dataKey="name" tick={{fontSize: 9, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
               <YAxis tick={{fontSize: 9, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
               <Tooltip contentStyle={{background: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '10px'}} formatter={(v: any) => [`${v.toFixed(0)}W`, '']} />
               <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
      
      {/* Footer Metrics */}
      <div className="grid grid-cols-4 gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="text-center">
               <div className="text-[10px] text-slate-400 uppercase">{language === 'ZH' ? '预期回报' : 'Return'}</div>
               <div className="text-sm font-bold text-emerald-500">
                  {portfolioReturn.toFixed(1)}%
               </div>
          </div>
          <div className="text-center border-l border-slate-200 dark:border-slate-800">
               <div className="text-[10px] text-slate-400 uppercase">{language === 'ZH' ? '波动率' : 'Volatility'}</div>
               <div className={`text-sm font-bold ${portfolioVolatility > 25 ? 'text-rose-500' : 'text-amber-500'}`}>
                  {portfolioVolatility.toFixed(0)}%
               </div>
          </div>
          <div className="text-center border-l border-slate-200 dark:border-slate-800">
               <div className="text-[10px] text-slate-400 uppercase">{language === 'ZH' ? '杠杆率' : 'Leverage'}</div>
               <div className={`text-sm font-bold ${data.debtToAssetRatio > 0.5 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}`}>
                  {(data.debtToAssetRatio * 100).toFixed(0)}%
               </div>
          </div>
          <div className="text-center border-l border-slate-200 dark:border-slate-800">
               <div className="text-[10px] text-slate-400 uppercase">{language === 'ZH' ? '流动月' : 'Liquid'}</div>
               <div className="text-sm font-bold text-blue-500">
                  {(data.monthlyExpense > 0 ? (data.assets.filter(a => ['T0','T7'].includes(a.liquidity)).reduce((s,a)=>s+(a.value-(a.liability||0)),0) / data.monthlyExpense) : 0).toFixed(1)} mo
               </div>
          </div>
      </div>
    </div>
  );
};

export default AssetEngine;
