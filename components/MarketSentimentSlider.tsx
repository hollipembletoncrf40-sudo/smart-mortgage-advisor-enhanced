import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { InvestmentParams } from '../types';

interface MarketSentimentSliderProps {
  params: InvestmentParams;
  onChange: (updates: Partial<InvestmentParams>) => void;
  t: any;
}

const MarketSentimentSlider: React.FC<MarketSentimentSliderProps> = ({ params, onChange, t }) => {
  // Calculate current sentiment value (0-100) based on appreciation rate
  // Bearish (-2%) -> 0
  // Neutral (3%) -> 50
  // Bullish (8%) -> 100
  const getSliderValue = () => {
    const rate = params.appreciationRate;
    if (rate <= -2) return 0;
    if (rate >= 8) return 100;
    return ((rate + 2) / 10) * 100;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    
    // Map 0-100 back to rates
    // Appreciation: -2% to 8%
    const newAppreciation = -2 + (val / 100) * 10;
    
    // Investment Return: 2% to 8% (Bearish market often implies lower alternative returns too, or higher safety seeking)
    // Let's map: 0 -> 2%, 50 -> 4%, 100 -> 8%
    let newReturn = 4;
    if (val < 50) {
        newReturn = 2 + (val / 50) * 2;
    } else {
        newReturn = 4 + ((val - 50) / 50) * 4;
    }

    onChange({
      appreciationRate: Number(newAppreciation.toFixed(1)),
      alternativeReturnRate: Number(newReturn.toFixed(1))
    });
  };

  const getSentimentLabel = (val: number) => {
    if (val < 30) return { text: t.sentimentBearish || '悲观 (熊市)', color: 'text-green-600', icon: TrendingDown };
    if (val > 70) return { text: t.sentimentBullish || '乐观 (牛市)', color: 'text-red-600', icon: TrendingUp };
    return { text: t.sentimentNeutral || '中性 (震荡)', color: 'text-slate-600', icon: Minus };
  };

  const currentVal = getSliderValue();
  const label = getSentimentLabel(currentVal);
  const Icon = label.icon;

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t.marketSentiment || '市场情绪调节'}
        </label>
        <div className={`flex items-center gap-1 text-xs font-bold ${label.color}`}>
          <Icon className="h-3.5 w-3.5" />
          {label.text}
        </div>
      </div>
      
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-green-500 via-slate-400 to-red-500 opacity-50" 
             style={{ width: '100%' }}
           />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={currentVal}
          onChange={handleSliderChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        />
        <div 
          className="absolute h-5 w-5 bg-white dark:bg-slate-700 border-2 border-indigo-500 rounded-full shadow-md pointer-events-none transition-all"
          style={{ left: `calc(${currentVal}% - 10px)` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium">
        <span>悲观预期</span>
        <span>中性预期</span>
        <span>乐观预期</span>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
         <div className="flex justify-between">
            <span className="text-slate-500">房产增值:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{params.appreciationRate.toFixed(1)}%</span>
         </div>
         <div className="flex justify-between">
            <span className="text-slate-500">理财收益:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{params.alternativeReturnRate.toFixed(1)}%</span>
         </div>
      </div>
    </div>
  );
};

export default MarketSentimentSlider;
