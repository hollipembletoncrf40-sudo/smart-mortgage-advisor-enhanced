import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Map, ArrowRight, Home, DollarSign, TrendingUp, Truck, PenTool, Award, Info } from 'lucide-react';
import { InvestmentParams } from '../types';
import { calculateLifePathMetrics, PropertyStage, LifePathResult } from '../utils/lifePath';

interface LifePathSimulatorProps {
  params: InvestmentParams;
  t: any;
}

const LifePathSimulator: React.FC<LifePathSimulatorProps> = ({ params, t }) => {
  const [activePath, setActivePath] = useState<'A' | 'B' | 'C'>('B');

  // Define scenarios
  const scenarios = useMemo(() => {
    const startPrice = params.totalPrice;
    
    // Path A: Buy & Hold (Stable)
    const pathAStages: PropertyStage[] = [
      { id: 'a1', name: '首套房', price: startPrice, area: 90, yearStart: 1, yearEnd: 30, comfortLevel: 6 }
    ];

    // Path B: 1 Exchange (Agile) - Upgrade at year 7
    const pathBStages: PropertyStage[] = [
      { id: 'b1', name: '首套上车', price: startPrice, area: 70, yearStart: 1, yearEnd: 7, comfortLevel: 5 },
      { id: 'b2', name: '改善置换', price: startPrice * 1.8, area: 120, yearStart: 7, yearEnd: 30, comfortLevel: 9 }
    ];

    // Path C: 2 Exchanges (Dynamic) - Upgrade at year 5 and 15
    const pathCStages: PropertyStage[] = [
      { id: 'c1', name: '老破小', price: startPrice * 0.8, area: 50, yearStart: 1, yearEnd: 5, comfortLevel: 3 },
      { id: 'c2', name: '次新两居', price: startPrice * 1.5, area: 90, yearStart: 5, yearEnd: 15, comfortLevel: 7 },
      { id: 'c3', name: '终极改善', price: startPrice * 2.5, area: 150, yearStart: 15, yearEnd: 30, comfortLevel: 10 }
    ];

    return {
      A: calculateLifePathMetrics(params, pathAStages),
      B: calculateLifePathMetrics(params, pathBStages),
      C: calculateLifePathMetrics(params, pathCStages)
    };
  }, [params]);

  const currentResult = scenarios[activePath];

  // Prepare chart data combining all paths
  const comparisonData = useMemo(() => {
    return scenarios.A.assetCurve.map((point, idx) => ({
      year: point.year,
      PathA: point.value,
      PathB: scenarios.B.assetCurve[idx].value,
      PathC: scenarios.C.assetCurve[idx].value,
    }));
  }, [scenarios]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Map className="h-6 w-6 text-indigo-500" />
            {t.lifePathTitle || '人生换房路线模拟'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t.lifePathDesc || '模拟不同换房策略下的资产积累与生活质量'}
          </p>
        </div>
        
        {/* Path Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['A', 'B', 'C'] as const).map((path) => (
            <button
              key={path}
              onClick={() => setActivePath(path)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePath === path
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {path === 'A' ? '一房到底' : path === 'B' ? '一次置换' : '多次折腾'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-500 rounded-xl">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">最终净资产</h4>
          </div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            {currentResult.totalAssets.toFixed(0)}<span className="text-sm">万</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            30年后房产价值 - 剩余贷款
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-rose-500 rounded-xl">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">交易摩擦成本</h4>
          </div>
          <div className="text-3xl font-bold text-rose-600 dark:text-rose-400 mb-1">
            {currentResult.totalCosts.toFixed(0)}<span className="text-sm">万</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            中介费 + 税费 + 装修损耗
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <Home className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">居住舒适度</h4>
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {currentResult.avgComfort.toFixed(1)}<span className="text-sm">/10</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            加权平均居住体验评分
          </p>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-500"/>
          换房时间轴
        </h3>
        
        <div className="relative pt-8 pb-4 px-4">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            {/* Start Point */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-400 border-4 border-white dark:border-slate-900 mb-2"></div>
              <span className="text-xs text-slate-500">第1年</span>
            </div>

            {/* Exchange Events */}
            {currentResult.events.map((event, idx) => (
              <div key={idx} className="flex flex-col items-center" style={{ position: 'absolute', left: `${(event.year / 30) * 100}%`, transform: 'translateX(-50%)' }}>
                <div className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full mb-2 shadow-lg whitespace-nowrap">
                  置换 #{idx + 1}
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-md cursor-pointer group relative">
                  <ArrowRight className="h-4 w-4 text-white" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-xs p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <div className="font-bold mb-1">第 {event.year} 年置换</div>
                    <div className="flex justify-between"><span>卖出:</span> <span>{event.sellPrice.toFixed(0)}万</span></div>
                    <div className="flex justify-between"><span>买入:</span> <span>{event.buyPrice.toFixed(0)}万</span></div>
                    <div className="flex justify-between text-rose-300"><span>成本:</span> <span>-{event.transactionCost.toFixed(0)}万</span></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 mt-2">第{event.year}年</span>
              </div>
            ))}

            {/* End Point */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-400 border-4 border-white dark:border-slate-900 mb-2"></div>
              <span className="text-xs text-slate-500">第30年</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-500"/>
          资产积累对比
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={comparisonData}>
              <defs>
                <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => `${value.toFixed(0)}万`}
              />
              <Legend />
              <Area type="monotone" dataKey="PathA" name="一房到底" stroke="#94a3b8" fillOpacity={1} fill="url(#colorA)" strokeWidth={2} />
              <Area type="monotone" dataKey="PathB" name="一次置换" stroke="#6366f1" fillOpacity={1} fill="url(#colorB)" strokeWidth={3} />
              <Area type="monotone" dataKey="PathC" name="多次折腾" stroke="#10b981" fillOpacity={1} fill="url(#colorC)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          智能推荐
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">资产最优解</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {scenarios.A.totalAssets > scenarios.B.totalAssets && scenarios.A.totalAssets > scenarios.C.totalAssets 
                  ? '一房到底 (Path A)' 
                  : scenarios.B.totalAssets > scenarios.C.totalAssets 
                  ? '一次置换 (Path B)' 
                  : '多次折腾 (Path C)'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                交易成本越低，复利效应越强。如果房价涨幅不高，频繁换房会损耗大量财富。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
              <Home className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">体验最优解</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {scenarios.C.avgComfort > scenarios.B.avgComfort ? '多次折腾 (Path C)' : '一次置换 (Path B)'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                通过阶梯式置换，可以在不同人生阶段匹配最适合的居住环境，生活质量更高。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifePathSimulator;
