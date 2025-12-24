import React, { useState, useEffect, useMemo } from 'react';
import { Activity, AlertTriangle, Heart, ShieldCheck, ShieldAlert } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, ReferenceLine, Tooltip } from 'recharts';
import { CalculationResult, InvestmentParams } from '../types';

interface RiskHeartbeatChartProps {
  result: CalculationResult;
  params: InvestmentParams;
  t: any;
}

const RiskHeartbeatChart: React.FC<RiskHeartbeatChartProps> = ({ result, params, t }) => {
  const [riskAversion, setRiskAversion] = useState(3); // 1-5
  const [data, setData] = useState<{ i: number; value: number }[]>([]);
  
  // 1. Calculate Volatility Score (0-100)
  const volatilityScore = useMemo(() => {
    let score = 0;
    
    // Logic:
    // Buy Path: Relatively stable, mainly affected by Interest Rate and Leverage (LTV)
    // Rent/Invest Path: Volatile, affected by Investment Return Rate and Market Sentiment
    
    const interestRisk = params.interestRate * 5; // e.g. 4% -> 20
    const marketRisk = Math.abs(params.appreciationRate - 3) * 10; // Deviation from 3% stable growth
    const investRisk = params.alternativeReturnRate * 8; // Higher return = Higher risk usually
    
    // Composite "Market Volatility" score.
    score = Math.max(interestRisk + marketRisk, investRisk);
    
    // Cap at 100
    return Math.min(100, Math.max(10, score));
  }, [params]);

  // 2. Calculate Tolerance Threshold based on Risk Aversion
  // 1 Star (Low Aversion/High Tolerance) -> Threshold 90
  // 5 Stars (High Aversion/Low Tolerance) -> Threshold 30
  const toleranceThreshold = useMemo(() => {
      return 105 - (riskAversion * 15);
  }, [riskAversion]);

  // 3. Generate EKG Data
  useEffect(() => {
    const generateData = () => {
      const points = [];
      for (let i = 0; i < 100; i++) {
        // Simulate heartbeat
        const base = Math.sin(i / 5) * (volatilityScore / 10);
        const noise = (Math.random() - 0.5) * (volatilityScore / 5);
        
        // Random "Market Shock" spikes if volatility is high
        let spike = 0;
        if (volatilityScore > 50 && Math.random() > 0.95) {
             spike = (Math.random() > 0.5 ? 1 : -1) * (volatilityScore);
        }
        
        points.push({ i, value: base + noise + spike });
      }
      return points;
    };
    
    setData(generateData());
    
    const interval = setInterval(() => {
        setData(prev => {
            const nextI = prev[prev.length - 1].i + 1;
            const base = Math.sin(nextI / 5) * (volatilityScore / 10);
            const noise = (Math.random() - 0.5) * (volatilityScore / 5);
            let spike = 0;
            if (volatilityScore > 50 && Math.random() > 0.95) {
                spike = (Math.random() > 0.5 ? 1 : -1) * (volatilityScore);
            }
            return [...prev.slice(1), { i: nextI, value: base + noise + spike }];
        });
    }, 100); 
    
    return () => clearInterval(interval);
  }, [volatilityScore]);

  // 4. Warning Logic
  const isTachycardia = volatilityScore > toleranceThreshold;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-500">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Activity className="h-4 w-4" />
          {t.financialEKG || '财务波动心电图'}
        </h3>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 px-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">{t.riskAversion || '风险厌恶度'}:</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button 
                        key={star}
                        onClick={() => setRiskAversion(star)}
                        className={`text-sm transition-transform hover:scale-110 ${star <= riskAversion ? 'text-red-500' : 'text-slate-300 dark:text-slate-600'}`}
                        title={star === 1 ? "激进型" : star === 5 ? "保守型" : "平衡型"}
                    >
                        ♥
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className={`h-40 w-full rounded-xl border relative transition-colors duration-500 ${isTachycardia ? 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30' : 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={[-120, 120]} hide />
            {/* Tolerance Line (Visualizing the ceiling) */}
            {/* Since data is centered around 0 with amplitude ~volatilityScore, we can map threshold to Y axis roughly */}
            {/* Let's just use color coding for now, adding a reference line might be confusing on a sine wave */}
            
            <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isTachycardia ? '#ef4444' : '#10b981'} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Overlay Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        
        {/* Dynamic Feedback Overlay */}
        <div className="absolute top-2 right-2 flex flex-col items-end pointer-events-none">
             <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
                {t.currentVolatility || '当前波动'}: <span className={volatilityScore > 50 ? 'text-orange-500 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'}>{Math.round(volatilityScore)}</span>
             </div>
             <div className="text-xs font-mono text-slate-500 dark:text-slate-500">
                {t.maxTolerance || '承受上限'}: <span>{toleranceThreshold}</span>
             </div>
        </div>
      </div>

      {/* Status / Warning */}
      <div className="mt-4">
        {isTachycardia ? (
            <div className="flex items-start gap-3 bg-red-100 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-900/50 animate-in slide-in-from-bottom-2">
                <div className="p-2 bg-red-200 dark:bg-red-900/50 rounded-full animate-pulse">
                    <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">{t.tachycardiaWarning || '心率过速警告！'}</div>
                    <p className="text-xs text-red-700/70 dark:text-red-200/70 leading-relaxed">
                        {t.riskWarningDesc || '当前投资组合的波动幅度已超过您的心理承受极限。建议：1. 降低杠杆率 2. 增加稳健资产配置 3. 避免激进的投资假设。'}
                    </p>
                </div>
            </div>
        ) : (
            <div className="flex items-start gap-3 bg-emerald-100 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 animate-in slide-in-from-bottom-2">
                <div className="p-2 bg-emerald-200 dark:bg-emerald-900/50 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">{t.healthNormal || '心率正常'}</div>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-200/70 leading-relaxed">
                        {t.riskSafeDesc || '当前财务波动在您的舒适区内。您可以尝试适当增加风险以换取更高收益，或保持现状享受稳健增长。'}
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RiskHeartbeatChart;
