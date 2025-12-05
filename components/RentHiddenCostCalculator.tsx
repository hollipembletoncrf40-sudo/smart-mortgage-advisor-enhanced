import React, { useState, useEffect } from 'react';
import { Truck, PaintBucket, HeartCrack, Info, Calculator } from 'lucide-react';

interface RentHiddenCostCalculatorProps {
  t: any;
  onCostChange: (cost: number) => void;
}

const RentHiddenCostCalculator: React.FC<RentHiddenCostCalculatorProps> = ({ t, onCostChange }) => {
  const [movingFreq, setMovingFreq] = useState(2); // Years per move
  const [renovationSatisfaction, setRenovationSatisfaction] = useState(3); // 1-5 stars
  const [stabilityAnxiety, setStabilityAnxiety] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const [annualMentalCost, setAnnualMentalCost] = useState(0);

  useEffect(() => {
    // Logic:
    // 1. Moving Cost: Assume 3000 RMB per move (financial + time + stress). Annual = 3000 / freq.
    // 2. Renovation Satisfaction: 5 stars = 0 cost. 1 star = High mental cost. 
    //    Cost = (5 - stars) * 1500 RMB/year (value of living in a place you like).
    // 3. Stability Anxiety: High = 3000, Medium = 1000, Low = 0.
    
    const movingCost = 3000 / movingFreq;
    const renovationCost = (5 - renovationSatisfaction) * 1500;
    let anxietyCost = 0;
    if (stabilityAnxiety === 'High') anxietyCost = 3000;
    if (stabilityAnxiety === 'Medium') anxietyCost = 1000;

    const total = Math.round(movingCost + renovationCost + anxietyCost);
    setAnnualMentalCost(total);
    onCostChange(total);
  }, [movingFreq, renovationSatisfaction, stabilityAnxiety, onCostChange]);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <HeartCrack className="h-4 w-4 text-orange-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-white">{t.rentHiddenCostTitle || '租房隐性成本计算器'}</h3>
      </div>

      <div className="space-y-4">
        {/* Moving Frequency */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1"><Truck className="h-3 w-3"/> {t.movingFreq || '搬家频率'}</label>
            <span className="font-bold text-slate-700 dark:text-white">{movingFreq} {t.yearPerMove || '年/次'}</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="10" 
            step="0.5" 
            value={movingFreq} 
            onChange={(e) => setMovingFreq(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Renovation Satisfaction */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1"><PaintBucket className="h-3 w-3"/> {t.renovationSat || '装修满意度'}</label>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRenovationSatisfaction(star)}
                  className={`text-xs ${star <= renovationSatisfaction ? 'text-amber-400' : 'text-slate-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-right">
            {renovationSatisfaction === 5 ? (t.satHigh || '非常满意') : renovationSatisfaction === 1 ? (t.satLow || '无法忍受') : (t.satMedium || '一般')}
          </div>
        </div>

        {/* Stability Anxiety */}
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2"><Info className="h-3 w-3"/> {t.stabilityAnxiety || '不续租焦虑'}</label>
          <div className="flex bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
            {(['Low', 'Medium', 'High'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setStabilityAnxiety(level)}
                className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                  stabilityAnxiety === level 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
              >
                {level === 'Low' ? (t.low || '低') : level === 'Medium' ? (t.medium || '中') : (t.high || '高')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="text-xs text-slate-500">{t.annualMentalCost || '年度心力成本估值'}</div>
        <div className="text-lg font-black text-orange-500">
          ¥{annualMentalCost.toLocaleString()}
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-1 leading-tight">
        * {t.hiddenCostNote || '该成本将计入“租房模式”的总支出中进行对比。'}
      </p>
    </div>
  );
};

export default RentHiddenCostCalculator;
