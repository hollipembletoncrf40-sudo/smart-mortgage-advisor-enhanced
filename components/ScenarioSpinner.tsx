import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Zap, RotateCcw } from 'lucide-react';
import { InvestmentParams } from '../types';

interface ScenarioSpinnerProps {
  params: InvestmentParams;
  onChange: (updates: Partial<InvestmentParams>) => void;
  t: any;
}

type ScenarioType = 'normal' | 'crisis' | 'prosperity' | 'rateHike';

const ScenarioSpinner: React.FC<ScenarioSpinnerProps> = ({ params, onChange, t }) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('normal');
  const [isSpinning, setIsSpinning] = useState(false);

  const handleScenarioSelect = (scenario: ScenarioType) => {
    if (isSpinning || activeScenario === scenario) return;

    setIsSpinning(true);
    setActiveScenario(scenario);

    // Simulate spin delay for effect
    setTimeout(() => {
      setIsSpinning(false);
      applyScenario(scenario);
    }, 600);
  };

  const applyScenario = (scenario: ScenarioType) => {
    let updates: Partial<InvestmentParams> = {};

    switch (scenario) {
      case 'crisis':
        // Crisis: Appreciation 0%, Return drops 30% (e.g. 4% -> 2.8%)
        updates = {
          appreciationRate: 0,
          alternativeReturnRate: Number((params.alternativeReturnRate * 0.7).toFixed(1))
        };
        break;
      case 'prosperity':
        // Prosperity: Appreciation +50% (e.g. 3% -> 4.5%), Return +50%
        updates = {
          appreciationRate: Number((params.appreciationRate * 1.5).toFixed(1)),
          alternativeReturnRate: Number((params.alternativeReturnRate * 1.5).toFixed(1))
        };
        break;
      case 'rateHike':
        // Rate Hike: Interest +1%
        updates = {
          interestRate: Number((params.interestRate + 1).toFixed(2))
        };
        break;
      case 'normal':
        // Reset logic could be complex if we don't store original. 
        // For now, "Normal" might just mean "Stop applying special logic", 
        // but since we modify params directly, maybe we just leave it or reset to defaults?
        // Let's just set some reasonable defaults for "Normal" to allow recovery.
        updates = {
            appreciationRate: 3.0,
            alternativeReturnRate: 4.0,
            interestRate: 4.1
        };
        break;
    }

    onChange(updates);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-slate-700 dark:text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          {t.scenarioSimulator || '极端情景模拟'}
        </h3>
        <button 
            onClick={() => handleScenarioSelect('normal')}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
            title="重置参数"
        >
            <RotateCcw className="h-3 w-3" /> {t.reset || '重置'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 relative z-10">
        {/* Crisis Mode */}
        <button
          onClick={() => handleScenarioSelect('crisis')}
          className={`relative group p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
            activeScenario === 'crisis' 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-lg shadow-red-500/20 scale-105' 
              : 'border-slate-100 dark:border-slate-800 hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/10 text-slate-500'
          }`}
        >
          <div className={`p-2 rounded-full transition-colors ${activeScenario === 'crisis' ? 'bg-red-100 dark:bg-red-900' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-red-100'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold">{t.scenarioCrisis || '危机模式'}</span>
          {activeScenario === 'crisis' && <span className="absolute -top-2 -right-2 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span></span>}
        </button>

        {/* Prosperity Mode */}
        <button
          onClick={() => handleScenarioSelect('prosperity')}
          className={`relative group p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
            activeScenario === 'prosperity' 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20 scale-105' 
              : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 text-slate-500'
          }`}
        >
          <div className={`p-2 rounded-full transition-colors ${activeScenario === 'prosperity' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100'}`}>
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold">{t.scenarioProsperity || '繁荣模式'}</span>
        </button>

        {/* Rate Hike Mode */}
        <button
          onClick={() => handleScenarioSelect('rateHike')}
          className={`relative group p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
            activeScenario === 'rateHike' 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/20 scale-105' 
              : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 text-slate-500'
          }`}
        >
          <div className={`p-2 rounded-full transition-colors ${activeScenario === 'rateHike' ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100'}`}>
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold">{t.scenarioRateHike || '利率突变'}</span>
        </button>
      </div>
      
      {/* Description Text */}
      <div className="mt-4 text-[10px] text-slate-400 text-center h-4 transition-all duration-300">
        {activeScenario === 'crisis' && (t.descCrisis || '房产增值归零，投资收益-30%')}
        {activeScenario === 'prosperity' && (t.descProsperity || '房产增值+50%，投资收益+50%')}
        {activeScenario === 'rateHike' && (t.descRateHike || '贷款利率上升100个基点')}
        {activeScenario === 'normal' && (t.descNormal || '当前为自定义参数模式')}
      </div>
    </div>
  );
};

export default ScenarioSpinner;
