import React, { useState, useMemo } from 'react';
import { Smile, Meh, Frown, Calendar, TrendingUp } from 'lucide-react';
import { CalculationResult, InvestmentParams } from '../types';
import PaymentCalendar from './PaymentCalendar';

interface AmortizationMoodBarProps {
  result: CalculationResult;
  params: InvestmentParams;
  t: any;
}

const AmortizationMoodBar: React.FC<AmortizationMoodBarProps> = ({ result, params, t }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(0); // 0 = Year 1
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Calculate yearly aggregated data
  const yearlyData = useMemo(() => {
    if (!result.monthlyData || result.monthlyData.length === 0) return [];
    
    const years: Array<{
      year: number;
      totalPrincipal: number;
      totalInterest: number;
      principalRatio: number;
      mood: 'sad' | 'neutral' | 'happy';
      moodEmoji: string;
    }> = [];
    
    const totalYears = Math.ceil(result.monthlyData.length / 12);
    
    for (let year = 0; year < totalYears; year++) {
      const startMonth = year * 12;
      const endMonth = Math.min((year + 1) * 12, result.monthlyData.length);
      
      let totalPrincipal = 0;
      let totalInterest = 0;
      
      for (let i = startMonth; i < endMonth; i++) {
        totalPrincipal += result.monthlyData[i].principal;
        totalInterest += result.monthlyData[i].interest;
      }
      
      const total = totalPrincipal + totalInterest;
      const principalRatio = total > 0 ? (totalPrincipal / total) * 100 : 0;
      
      // Mood mapping
      let mood: 'sad' | 'neutral' | 'happy' = 'neutral';
      let moodEmoji = '😐';
      
      if (principalRatio < 40) {
        mood = 'sad';
        moodEmoji = '😔';
      } else if (principalRatio >= 40 && principalRatio < 60) {
        mood = 'neutral';
        moodEmoji = '😐';
      } else {
        mood = 'happy';
        moodEmoji = '😄';
      }
      
      years.push({
        year: year + 1,
        totalPrincipal,
        totalInterest,
        principalRatio,
        mood,
        moodEmoji
      });
    }
    
    return years;
  }, [result.monthlyData]);

  const currentYear = yearlyData[selectedPeriod];
  
  if (!currentYear) return null;

  const interestRatio = 100 - currentYear.principalRatio;

  const handleDateSelect = (year: number, month: number) => {
    // Find the period index based on year
    const periodIndex = year - 1;
    if (periodIndex >= 0 && periodIndex < yearlyData.length) {
      setSelectedPeriod(periodIndex);
    }
    setShowCalendar(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-500" />
          {t.amortizationMood || '还款心情条'}
        </h3>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-xs font-medium text-indigo-700 dark:text-indigo-400"
        >
          <Calendar className="h-3 w-3" />
          {t.year || '年'} {currentYear.year}
        </button>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg animate-in slide-in-from-top-2">
          <PaymentCalendar
            onDateSelect={handleDateSelect}
            selectedYear={currentYear.year}
            selectedMonth={0}
            paymentData={yearlyData.map((y, i) => ({ year: i + 1, month: 0, principalRatio: y.principalRatio }))}
            t={t}
          />
        </div>
      )}

      {/* Year Slider for Quick Navigation */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={yearlyData.length - 1}
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>{t.year || '年'} 1</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {t.year || '年'} {currentYear.year}
          </span>
          <span>{t.year || '年'} {yearlyData.length}</span>
        </div>
      </div>

      {/* Mood Bar */}
      <div className="mb-4">
        <div className="h-16 w-full rounded-2xl overflow-hidden shadow-inner bg-slate-200 dark:bg-slate-700 flex">
          {/* Principal (Green) */}
          <div 
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm transition-all duration-500 relative group"
            style={{ width: `${currentYear.principalRatio}%` }}
          >
            {currentYear.principalRatio > 15 && (
              <>
                <span className="relative z-10">{currentYear.principalRatio.toFixed(1)}%</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </>
            )}
          </div>
          
          {/* Interest (Red) */}
          <div 
            className="bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center text-white font-bold text-sm transition-all duration-500 relative group"
            style={{ width: `${interestRatio}%` }}
          >
            {interestRatio > 15 && (
              <>
                <span className="relative z-10">{interestRatio.toFixed(1)}%</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </>
            )}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-between mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-slate-600 dark:text-slate-400">{t.principal || '本金'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-600 dark:text-slate-400">{t.interest || '利息'}</span>
          </div>
        </div>
      </div>

      {/* Mood Feedback */}
      <div className={`p-4 rounded-2xl border-2 transition-all duration-500 ${
        currentYear.mood === 'sad' 
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900' 
          : currentYear.mood === 'neutral'
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900'
          : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className="text-3xl">{currentYear.moodEmoji}</div>
          <div className="flex-1">
            <div className={`text-sm font-bold mb-1 ${
              currentYear.mood === 'sad' 
                ? 'text-red-700 dark:text-red-400' 
                : currentYear.mood === 'neutral'
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              {t.moodIndex || '心情指数'}: {currentYear.mood === 'sad' ? (t.unhappy || '不开心') : currentYear.mood === 'neutral' ? (t.neutral || '一般') : (t.happy || '开心')}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentYear.mood === 'sad' && (
                t.sadMessage?.replace('{year}', currentYear.year).replace('{ratio}', interestRatio.toFixed(0)) ||
                `第${currentYear.year}年，您每月约 ${interestRatio.toFixed(0)}% 的还款都献给了银行利息，只有 ${currentYear.principalRatio.toFixed(0)}% 在为自己积累资产。`
              )}
              {currentYear.mood === 'neutral' && (
                t.neutralMessage?.replace('{year}', currentYear.year).replace('{ratio}', currentYear.principalRatio.toFixed(0)) ||
                `第${currentYear.year}年，您每月约 ${currentYear.principalRatio.toFixed(0)}% 的还款在为自己积累资产，情况正在好转！`
              )}
              {currentYear.mood === 'happy' && (
                t.happyMessage?.replace('{year}', currentYear.year).replace('{ratio}', currentYear.principalRatio.toFixed(0)) ||
                `第${currentYear.year}年，您每月 ${currentYear.principalRatio.toFixed(0)}% 的还款都在为自己积累资产，大部分钱都是您的了！`
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmortizationMoodBar;
