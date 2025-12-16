import React from 'react';
import { InvestmentParams, CalculationResult } from '../types';
import { TrendingUp, ShieldAlert, BadgeCheck, QrCode } from 'lucide-react';

interface BattleReportCardProps {
  params: InvestmentParams;
  result: CalculationResult;
  roast: string;
  t: any;
  riskScore: number; // 0-100
  beatPercent: number; // e.g. 95
}

const BattleReportCard = React.forwardRef<HTMLDivElement, BattleReportCardProps>(({ params, result, roast, t, riskScore, beatPercent }, ref) => {
  // Determine Grade
  const getGrade = () => {
    const roi = result.annualizedReturn || 0;
    if (roi > 8 && riskScore < 40) return 'S';
    if (roi > 5 && riskScore < 60) return 'A';
    if (riskScore < 50) return 'B';
    return 'C';
  };

  const grade = getGrade();
  const gradeColor = grade === 'S' ? 'text-amber-400' : grade === 'A' ? 'text-indigo-400' : 'text-slate-400';
  const gradeBg = grade === 'S' ? 'from-amber-500/20 to-orange-500/20' : grade === 'A' ? 'from-indigo-500/20 to-purple-500/20' : 'from-slate-500/20 to-gray-500/20';

  return (
    <div ref={ref} className="w-[375px] h-[667px] bg-slate-900 text-white relative overflow-hidden flex flex-col font-sans select-none">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 z-0" />
      <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-b ${gradeBg} rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2`} />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl">D</div>
            <span className="font-bold tracking-wider text-sm opacity-90">DEEP ESTATE</span>
          </div>
          <div className="text-xs text-slate-400 border border-slate-700 rounded-full px-3 py-1">
            {t.battleReport?.title}
          </div>
        </div>

        {/* Main Grade */}
        <div className="text-center mb-8 relative">
          <div className="text-sm text-slate-400 mb-2 uppercase tracking-widest">{t.battleReport?.grade}</div>
          <div className={`text-[120px] leading-none font-black ${gradeColor} drop-shadow-2xl shader-text`}>
            {grade}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white/5 rounded-full animate-pulse" />
          <div className="mt-4 text-emerald-400 font-bold flex items-center justify-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {t.battleReport?.beat.replace('{percent}', beatPercent)}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-slate-400 mb-1">{t.battleReport?.annualReturn}</div>
            <div className="text-2xl font-bold text-emerald-400">
              {(result.annualizedReturn || 0).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-slate-400 mb-1">{t.battleReport?.risk}</div>
            <div className={`text-2xl font-bold ${riskScore > 60 ? 'text-red-400' : 'text-blue-400'}`}>
              {riskScore}
            </div>
          </div>
        </div>

        {/* AI Roast */}
        <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-6 mb-auto relative">
          <div className="absolute -top-3 left-6 px-2 bg-slate-900 text-indigo-400 text-xs font-bold flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" />
            {t.battleReport?.roast}
          </div>
          <p className="text-sm leading-relaxed text-indigo-100 italic">
            "{roast.length > 80 ? roast.substring(0, 80) + '...' : roast}"
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">{new Date().toLocaleDateString()}</div>
            <div className="text-lg font-bold">Smart Mortgage Advisor</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white p-1 rounded">
              <QrCode className="h-12 w-12 text-black" />
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t.battleReport?.scan}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BattleReportCard;
