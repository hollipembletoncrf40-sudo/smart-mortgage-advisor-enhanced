import React, { useState, useMemo } from 'react';
import { InvestmentParams, Language } from '../types';
import { generateFutureMessage, TimeFrame, Persona } from '../utils/futureSelf';
import { calculateRegretHeatmap, calculateCashFlowBreathing } from '../utils/dashboardCalculations';
import { User, Calculator, TrendingUp, Shield, AlertTriangle, Clock, PlayCircle } from 'lucide-react';

interface FutureSelfPanelProps {
  params: InvestmentParams;
  monthlyPayment: number;
  t: any;
  language: Language;
}

export const FutureSelfPanel: React.FC<FutureSelfPanelProps> = ({ params, monthlyPayment, t, language }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(5);
  const [persona, setPersona] = useState<Persona>('conservative');
  const [isOpen, setIsOpen] = useState(false);

  // 1. Calculate Metrics on the fly to get risk status
  const riskMetrics = useMemo(() => {
    // Basic Metrics
    const monthlyIncome = params.familyMonthlyIncome || 30000;
    const dti = monthlyPayment / monthlyIncome;

    // Breathing Room
    const breathingData = calculateCashFlowBreathing({
      ...params,
      familyMonthlyIncome: monthlyIncome
    });
    
    // Regret Score (Simplified from Heatmap logic for this specific point)
    // We can pick the cell corresponding to current price/rate (offset 0)
    const heatmap = calculateRegretHeatmap(params);
    // Find the center cell (approx) or calculate direct score
    const centerCell = heatmap.find(c => c.price === Math.round(params.totalPrice || 200) && Math.abs(c.rate - (params.interestRate || 3.5)) < 0.1);
    const regretScore = centerCell ? centerCell.regretScore : 0;

    return {
      dti,
      breathingRoom: breathingData.breathingRoom,
      regretScore
    };
  }, [params, monthlyPayment]);

  // 2. Generate Content
  const content = useMemo(() => {
    return generateFutureMessage(params, riskMetrics, timeFrame, persona, language);
  }, [params, riskMetrics, timeFrame, persona, language]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 shadow-xl transition-all hover:shadow-2xl hover:scale-[1.01] border border-white/10"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-white">{t.futureTitle || "对话未来的自己 (Future You)"}</h3>
              <p className="text-sm text-indigo-100">{t.futureSubtitle || "AI 已模拟未来 10 年的 3 种人生剧本"}</p>
            </div>
          </div>
          <PlayCircle className="h-8 w-8 text-white/80 group-hover:text-white" />
        </div>
      </button>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              <User className="h-5 w-5" />
            </span>
            {t.futureDialogTitle || "未来的你 · 跨时空对话"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{t.futureDialogDesc || "不是算命，是基于数据的理性推演"}</p>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {t.collapse || "收起"}
        </button>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.timeLine || "时间线"}</span>
          <div className="flex rounded-lg bg-white p-1 shadow-sm dark:bg-slate-900">
            {[3, 5, 10].map((yr) => (
              <button
                key={yr}
                onClick={() => setTimeFrame(yr as TimeFrame)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  timeFrame === yr
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {(t.yearsLater || "{n}年后").replace('{n}', yr)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.persona || "人格偏移"}</span>
          <div className="flex rounded-lg bg-white p-1 shadow-sm dark:bg-slate-900">
            <button
              onClick={() => setPersona('conservative')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                persona === 'conservative'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Shield className="h-3 w-3" />
              {t.personaConservative || "保守慎重"}
            </button>
            <button
              onClick={() => setPersona('aggressive')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                persona === 'aggressive'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              {t.personaAggressive || "激进进取"}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="relative mb-6">
        {/* Avatar */}
        <div className="absolute -top-3 -left-2 z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg dark:border-slate-800">
          <span className="text-xs font-bold">{2025 + timeFrame}</span>
        </div>

        {/* Message Bubble */}
        <div className={`ml-6 rounded-2xl rounded-tl-none p-6 shadow-sm border ${
          content.mood === 'happy' ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30' :
          content.mood === 'sad' ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30' :
          'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'
        }`}>
          <h3 className={`mb-3 text-lg font-bold ${
             content.mood === 'happy' ? 'text-emerald-800 dark:text-emerald-300' :
             content.mood === 'sad' ? 'text-rose-800 dark:text-rose-300' :
             'text-slate-800 dark:text-slate-200'
          }`}>
            {content.title}
          </h3>
          <p className="mb-4 text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {content.message}
          </p>
          
          {/* Summary Card */}
          <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-black/20 dark:ring-white/10">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              {(t.adviceFrom || "来自 {year} 年的忠告").replace('{year}', 2025 + timeFrame)}
            </p>
            <p className="text-base font-bold italic text-indigo-700 dark:text-indigo-300">
              {content.advice}
            </p>
          </div>
        </div>
      </div>
    
      {/* Risk Metrics Quick View (Context) */}
      <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-100 dark:border-slate-800">
         <div>
            <div className="text-xs text-slate-400">{t.currentDTI || "目前 DTI"}</div>
            <div className={`text-sm font-bold ${riskMetrics.dti > 0.5 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {(riskMetrics.dti * 100).toFixed(0)}%
            </div>
         </div>
         <div>
            <div className="text-xs text-slate-400">{t.survivalPeriod || "现金流生存期"}</div>
            <div className={`text-sm font-bold ${riskMetrics.breathingRoom < 30 ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>
               {riskMetrics.breathingRoom < 0 ? (t.crash || "崩盘") : `${params.emergencyReserves || 6}${language === 'EN' ? 'mo' : '个月'}`}
            </div>
         </div>
         <div>
            <div className="text-xs text-slate-400">{t.regretIndex || "AI后悔指数"}</div>
             <div className={`text-sm font-bold ${riskMetrics.regretScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {riskMetrics.regretScore}
            </div>
         </div>
      </div>

    </div>
  );
};
