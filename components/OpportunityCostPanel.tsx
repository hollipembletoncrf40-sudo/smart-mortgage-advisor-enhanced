import React, { useState, useMemo } from 'react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TrendingUp, AlertTriangle, HelpCircle, ArrowRightLeft, DollarSign } from 'lucide-react';
import { CalculationResult, InvestmentParams } from '../types';

interface Props {
  result: CalculationResult;
  params: InvestmentParams;
  darkMode: boolean;
  t: any;
}

const OpportunityCostPanel: React.FC<Props> = ({ result, params, darkMode, t }) => {
  const [volatility, setVolatility] = useState(15); // Standard Deviation % (Stock Market default ~15%)
  
  // Calculate Probabilistic Stock Outcomes
  const stockProjections = useMemo(() => {
    const data = result.yearlyData;
    if (!data || data.length === 0) return [];

    const initialInvestment = result.initialCosts.total * 10000; // in Yuan
    const years = params.holdingYears;
    const meanReturn = params.alternativeReturnRate / 100;
    const sigma = volatility / 100;

    return data.map((d, i) => {
        const year = d.year;
        // Simplified Log-Normal projection for the accumulated portfolio
        // This is an approximation because we have monthly contributions/withdrawals in the main logic.
        // To be precise, we should apply volatility to the path.
        // For visualization, we will apply the spread factor to the calculated deterministic stockNetWorth.
        
        // Spread factor at year t: exp( +/- Z * sigma * sqrt(t) )
        // 90th percentile (Z approx 1.28)
        // 10th percentile (Z approx -1.28)
        
        const spreadUp = Math.exp(1.28 * sigma * Math.sqrt(year));
        const spreadDown = Math.exp(-1.28 * sigma * Math.sqrt(year));
        
        // We apply this spread to the *Growth* portion or the total?
        // Usually applied to the total asset value if fully invested.
        
        return {
            year: d.year,
            houseNetWorth: d.propertyValue - d.remainingLoan, // Wan
            stockBase: d.stockNetWorth, // Wan
            stockOptimistic: d.stockNetWorth * spreadUp,
            stockPessimistic: d.stockNetWorth * spreadDown,
            difference: (d.propertyValue - d.remainingLoan) - d.stockNetWorth
        };
    });
  }, [result, volatility, params.alternativeReturnRate, params.holdingYears]);

  const winningScenario = result.assetComparison.winner;
  const netWorthDiff = Math.abs(result.assetComparison.difference).toFixed(1);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Executive Summary Card */}
      <div className={`rounded-2xl p-6 border ${winningScenario === 'House' ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'}`}>
         <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${winningScenario === 'House' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
               {winningScenario === 'House' ? <TrendingUp size={24} /> : <DollarSign size={24} />}
            </div>
            <div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                  {winningScenario === 'House' ? (t.oppWinHouse || '房产投资胜出') : (t.oppWinStock || '指数基金胜出')}
               </h3>
               <p className="text-sm text-slate-600 dark:text-slate-300">
                  {(t.oppWinDesc || '在 {years} 年持有的情况下，{winner} 预计比另一种选择的净资产高出 {diff} 万。')
                    .replace('{years}', params.holdingYears)
                    .replace('{winner}', winningScenario === 'House' ? (t.oppHouseName || '购房') : (t.oppStockName || '投资股市'))
                    .replace('{diff}', `<span class="font-bold text-lg mx-1">${netWorthDiff}</span>`)}
               </p>
               <div className="mt-4 flex gap-4 text-xs">
                  <div>
                      <span className="block text-slate-400 mb-0.5">{t.oppIrrHouse || '房产预期 IRR'}</span>
                      <span className="font-mono font-bold text-indigo-600 text-lg">{result.annualizedReturn.toFixed(2)}%</span>
                  </div>
                  <div>
                      <span className="block text-slate-400 mb-0.5">{t.oppIrrStock || '基金预期 IRR'}</span>
                      <span className="font-mono font-bold text-emerald-600 text-lg">{params.alternativeReturnRate.toFixed(2)}%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Deterministic Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
         <h4 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-indigo-500" /> {t.oppChartTitle || '净资产增长对比'}
         </h4>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={stockProjections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v)=>`${v}`} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} unit={t.unitWanSimple || "万"} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     formatter={(value: number) => [value.toFixed(0) + (t.unitWanSimple || '万'), '']}
                     labelFormatter={(v) => `${t.yearLabel || '第'} ${v} ${t.yearSuffix || '年'}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="houseNetWorth" name={t.oppChartHouse || '房产净值'} stroke="#6366f1" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="stockBase" name={t.oppChartStock || '基金净值 (基准)'} stroke="#10b981" strokeWidth={3} dot={false} strokeDasharray="5 5" />
               </ComposedChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* 3. Probabilistic "Risk" View */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
         <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
               <AlertTriangle className="h-5 w-5 text-amber-500" /> {t.oppRiskTitle || '逆向思考：如果不买房？'}
            </h4>
            <div className="flex items-center gap-2">
               <span className="text-xs text-slate-500">{t.oppRiskVol || '市场波动率(Risk)'}</span>
               <input 
                 type="range" 
                 min="5" 
                 max="30" 
                 value={volatility} 
                 onChange={(e) => setVolatility(Number(e.target.value))}
                 className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
               <span className="text-xs font-mono w-8">{volatility}%</span>
            </div>
         </div>
         
         <p className="text-sm text-slate-500 mb-4">
            {t.oppRiskDesc || '股市投资具有不确定性。下图展示了在不同市场表现下，您的财富（同等本金投资指数基金）的可能分布范围 (90% 置信区间)。'}
         </p>

         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={stockProjections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v)=>`${v}`} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} unit={t.unitWanSimple || "万"} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     labelFormatter={(v) => `${t.yearLabel || '第'} ${v} ${t.yearSuffix || '年'}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="stockOptimistic" name={t.oppBull || "牛市上限"} stroke="#34d399" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="stockBase" name={t.oppBase || "基准预测"} stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="stockPessimistic" name={t.oppBear || "熊市下限"} stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                  
                  {/* Compare with House */}
                  <Line type="monotone" dataKey="houseNetWorth" name={t.oppChartHouse || '房产净值'} stroke="#6366f1" strokeWidth={3} dot={false} />
               </ComposedChart>
            </ResponsiveContainer>
         </div>
      </div>

    </div>
  );
};

export default OpportunityCostPanel;
