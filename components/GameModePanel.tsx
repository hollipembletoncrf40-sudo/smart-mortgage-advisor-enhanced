import React, { useMemo, useState } from 'react';
import { Trophy, Frown, Smile, Meh, TrendingUp, Heart, Zap, RefreshCw, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InvestmentParams } from '../types';
import { simulateLife, GameResult, EndingType } from '../utils/gameSimulation';

interface GameModePanelProps {
  params: InvestmentParams;
  t: any;
}

const GameModePanel: React.FC<GameModePanelProps> = ({ params, t }) => {
  const [simulationKey, setSimulationKey] = useState(0); // Force re-simulation
  
  const result = useMemo(() => {
    return simulateLife(params);
  }, [params, simulationKey]);

  const getEndingConfig = (ending: EndingType) => {
    switch (ending) {
      case 'WEALTHY':
        return {
          icon: Trophy,
          color: 'text-amber-500',
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          border: 'border-amber-200 dark:border-amber-800',
          title: '富裕结局',
          desc: '资产大幅增值，实现了财务自由！'
        };
      case 'DEBT':
        return {
          icon: Frown,
          color: 'text-rose-500',
          bg: 'bg-rose-100 dark:bg-rose-900/30',
          border: 'border-rose-200 dark:border-rose-800',
          title: '欠债结局',
          desc: '高额房贷压垮了生活，陷入财务危机。'
        };
      case 'ZEN':
        return {
          icon: Smile,
          color: 'text-emerald-500',
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          title: '佛系结局',
          desc: '知足常乐，虽然不是巨富，但生活幸福美满。'
        };
      case 'STRUGGLE':
        return {
          icon: Zap,
          color: 'text-purple-500',
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          border: 'border-purple-200 dark:border-purple-800',
          title: '房奴结局',
          desc: '虽然有房有产，但生活质量被严重挤压。'
        };
      default:
        return {
          icon: Meh,
          color: 'text-blue-500',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-800',
          title: '普通结局',
          desc: '平平淡淡才是真，度过了充实的一生。'
        };
    }
  };

  const config = getEndingConfig(result.ending);
  const Icon = config.icon;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-indigo-500" />
          {t.gameModeTitle || '模拟人生：买房后的20年'}
        </h2>
        <button 
          onClick={() => setSimulationKey(prev => prev + 1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          title="重新模拟"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Ending Card */}
      <div className={`rounded-2xl p-6 mb-8 border-2 ${config.bg} ${config.border} flex flex-col md:flex-row items-center gap-6 text-center md:text-left`}>
        <div className={`w-24 h-24 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg shrink-0`}>
          <Icon className={`h-12 w-12 ${config.color}`} />
        </div>
        <div className="flex-1">
          <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${config.color}`}>ENDING REACHED</div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{config.title}</h3>
          <p className="text-slate-600 dark:text-slate-300 text-lg">{result.summary}</p>
        </div>
        
        {/* Final Stats */}
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
          <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl text-center">
            <div className="text-xs text-slate-500 mb-1">最终资产</div>
            <div className="font-bold text-indigo-600 dark:text-indigo-400">{result.finalWealth.toFixed(0)}万</div>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl text-center">
            <div className="text-xs text-slate-500 mb-1">幸福指数</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">{result.finalHappiness.toFixed(0)}</div>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl text-center">
            <div className="text-xs text-slate-500 mb-1">压力指数</div>
            <div className="font-bold text-rose-600 dark:text-rose-400">{result.finalStress.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            关键人生事件
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {result.history.filter(h => h.event).map((h, idx) => (
              <div key={idx} className="relative pl-6 pb-4 border-l-2 border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900"></div>
                <div className="text-xs font-bold text-indigo-500 mb-1">第 {h.year} 年</div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="font-bold text-slate-800 dark:text-white mb-1">{h.event?.title}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{h.event?.description}</p>
                  <div className="flex gap-2 text-[10px]">
                    {h.event?.impact.wealth !== 0 && (
                      <span className={`${h.event?.impact.wealth! > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        💰 {h.event?.impact.wealth! > 0 ? '+' : ''}{h.event?.impact.wealth}万
                      </span>
                    )}
                    {h.event?.impact.happiness !== 0 && (
                      <span className={`${h.event?.impact.happiness! > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        😊 {h.event?.impact.happiness! > 0 ? '+' : ''}{h.event?.impact.happiness}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {result.history.filter(h => h.event).length === 0 && (
              <div className="text-center text-slate-400 py-8">
                平平淡淡的一生，没有发生重大意外事件。
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            人生轨迹曲线
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.history}>
                <defs>
                  <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHappy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="wealth" name="净资产(万)" stroke="#6366f1" fillOpacity={1} fill="url(#colorWealth)" />
                <Area yAxisId="right" type="monotone" dataKey="happiness" name="幸福度" stroke="#10b981" fillOpacity={1} fill="url(#colorHappy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 justify-center text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span>净资产 (左轴)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>幸福度 (右轴)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModePanel;
