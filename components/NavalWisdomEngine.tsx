import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts';
import { 
  Brain, Zap, Shield, Target, Award, Gem, Anchor, Scale, 
  ChevronRight, AlertTriangle, CheckCircle, TrendingUp, Users, Heart,
  Play, Pause
} from 'lucide-react';
import { navalTweets } from '../data/navalTweets';

interface NavalWisdomEngineProps {
  language: 'CN' | 'EN';
  t: any;
}

const NavalWisdomEngine: React.FC<NavalWisdomEngineProps> = ({ language, t }) => {
  // 1. Wealth Engine State (Productize Matrix - 6 Axes)
  const [wealthMatrix, setWealthMatrix] = useState({
    labor: 20,
    capital: 30,
    code: 60,
    media: 50,
    community: 40,
    knowledge: 70
  });

  // 2. Freedom Engine State (Sovereignty Dashboard)
  const [freedomMetrics, setFreedomMetrics] = useState({
    timeFreedom: 30,    // % of day owned
    financialFreedom: 25, // Passive Income / Expenses ratio %
    locationFreedom: 40,  // % location independent
    mentalFreedom: 60     // % "Zero-Notify" hours
  });
  const [geoArbFactor, setGeoArbFactor] = useState(100); // 100% = High Cost City, 30% = Bali/Chiang Mai
  const [freedomStats, setFreedomStats] = useState({
    monthlyBurn: 5000,
    liquidAssets: 150000,
    passiveIncome: 2000
  });

  // 3. Specific Knowledge State (Talent Stack)
  const [skillStack, setSkillStack] = useState({
    baseTalent: 60,      // Genetic/Childhood optimized
    obsessiveInterest: 80, // "Play to you, work to others"
    marketKnowledge: 40,   // Domain expertise
    salesAbility: 30       // Ability to sell/build
  });

  // 4. Judgment Engine State (Decision Razor)
  const [judgmentParams, setJudgmentParams] = useState({
    isLongTerm: false,
    isWinWin: false,
    isExciting: false // "Hell Yeah or No"
  });

  // 5. Downside Shield State (Antifragility)
  const [shieldMetrics, setShieldMetrics] = useState({
    runwayMonths: 6,
    checklist: {
      noDebt: true,
      noJail: true,
      noAddiction: true,
      noShortcuts: true
    }
  });

  // 6. Capital Allocation Optimizer (Leverage Multipliers)
  const [allocationStrategy, setAllocationStrategy] = useState({
    labor: 50,   // Low leverage (1x)
    capital: 20, // High leverage (50x)
    code: 15,    // Infinite leverage (1000x)
    media: 15    // Infinite leverage (1000x)
  });
  const [resourceInput, setResourceInput] = useState(100); // Abstract units of Time/Money

  // 7. Infinite Game Simulator (Ethical Wealth)
  const [infiniteGame, setInfiniteGame] = useState({
    years: 20,
    ethics: 100, // 0-100% (Safety factor)
    consistency: 80 // 0-100% (Growth factor)
  });
  
  // Helpers
  const updateWealth = (key: string, value: number) => {
    setWealthMatrix(prev => ({ ...prev, [key]: value }));
  };

  // Logic for Wealth Engine (Radial Bar)
  const wealthData = React.useMemo(() => {
    return [
      { name: language === 'EN' ? 'Labor' : '劳动力', value: wealthMatrix.labor, fill: '#94a3b8' },
      { name: language === 'EN' ? 'Capital' : '资本', value: wealthMatrix.capital, fill: '#f59e0b' },
      { name: language === 'EN' ? 'Community' : '社群', value: wealthMatrix.community, fill: '#06b6d4' },
      { name: language === 'EN' ? 'Media' : '媒体', value: wealthMatrix.media, fill: '#ec4899' },
      { name: language === 'EN' ? 'Code' : '代码', value: wealthMatrix.code, fill: '#8b5cf6' },
      { name: language === 'EN' ? 'Knowledge' : '知识IP', value: wealthMatrix.knowledge, fill: '#f97316' },
    ];
  }, [wealthMatrix, language]);
  const productizeScore = Math.round(Object.values(wealthMatrix).reduce((a, b) => a + b, 0) / 6);



  // Logic for Freedom Engine
  const adjustedFinancialFreedom = Math.min(100, Math.round((freedomStats.passiveIncome / freedomStats.monthlyBurn) * 100 * (100 / geoArbFactor)));
  const totalFreedomScore = Math.round((freedomMetrics.timeFreedom + adjustedFinancialFreedom + freedomMetrics.locationFreedom + freedomMetrics.mentalFreedom) / 4);
  
  // Logic for Freedom Pro (Financial Cockpit)
  const runwayYears = React.useMemo(() => {
    const netBurn = freedomStats.monthlyBurn - freedomStats.passiveIncome;
    if (netBurn <= 0) return 999; // Infinite
    return parseFloat((freedomStats.liquidAssets / netBurn / 12).toFixed(1));
  }, [freedomStats]);
  
  const fireProgress = React.useMemo(() => {
    const target = freedomStats.monthlyBurn * 12 * 25;
    return Math.min(100, Math.round((freedomStats.liquidAssets / target) * 100));
  }, [freedomStats]);
  
  const sleepIncome = React.useMemo(() => {
    return ((freedomStats.passiveIncome * 12) / 365 / 8).toFixed(2);
  }, [freedomStats]);

  // Logic for Capital Allocation Optimizer
  const leverageMultipliers = { labor: 1, capital: 50, code: 500, media: 1000 };
  const getResourceName = (key: string) => {
    const names: Record<string, string> = { labor: 'Labor', capital: 'Capital', code: 'Code', media: 'Media' };
    const namesCN: Record<string, string> = { labor: '劳动力', capital: '资本', code: '代码', media: '媒体' };
    return language === 'EN' ? names[key] : namesCN[key];
  };

  const allocationData = React.useMemo(() => {
    return Object.entries(allocationStrategy).map(([key, alignPct]) => {
      // alignPct is just a distribution weight here
      const multiplier = leverageMultipliers[key as keyof typeof leverageMultipliers];
      // Effective Output = Input Unit * (Allocation % / 100) * Multiplier
      const inputAmount = resourceInput * (alignPct / 100); 
      const effectiveOutput = inputAmount * multiplier;
      
      let color = '#94a3b8';
      if (key === 'capital') color = '#f59e0b';
      if (key === 'code') color = '#8b5cf6';
      if (key === 'media') color = '#ec4899';

      return {
        name: getResourceName(key),
        key,
        input: inputAmount,
        output: effectiveOutput,
        color
      };
    });
  }, [allocationStrategy, resourceInput, language]);

  const totalOutput = allocationData.reduce((acc, curr) => acc + curr.output, 0);

  // Logic for Infinite Game Simulator
  const gameData = React.useMemo(() => {
    const data = [];
    const growthRate = 0.05 + (infiniteGame.consistency / 100) * 0.25;
    
    for (let i = 0; i <= infiniteGame.years; i++) {
        let effectiveGrowth = growthRate;
        if (infiniteGame.ethics < 90) {
             effectiveGrowth *= (infiniteGame.ethics / 100); 
        }
        if (infiniteGame.ethics < 50 && i > 5) {
            effectiveGrowth = -0.5; // Crash
        }

        const value = 100 * Math.pow(1 + effectiveGrowth, i);
        data.push({ 
            year: i, 
            value: Math.round(value),
            shortTerm: Math.round(100 * Math.pow(1.3, Math.min(i, 5))) 
        });
    }
    return data;
  }, [infiniteGame]);

  return (
    <div className="space-y-6 animate-fade-in p-2 pb-20">
      {/* Header - Matching FreedomAnalytics Style */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-purple-400" />
            {language === 'EN' ? 'Naval Wisdom Engine' : 'Naval 智慧引擎'}
          </h2>
          <p className="text-purple-200/80 max-w-2xl text-sm leading-relaxed italic">
            "Seek wealth, not money or status. Wealth is having assets that earn while you sleep."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Wealth Engine (6-Axis Productize Matrix) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Gem className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{language === 'EN' ? 'Wealth Engine (Productize Matrix)' : '财富引擎 (产品化矩阵)'}</h3>
          </div>
          
          {/* Legend moved outside chart for better spacing */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {wealthData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="h-[320px] w-full relative">
            {/* Animated glow background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl animate-pulse" />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%"
                cy="50%"
                innerRadius="25%" 
                outerRadius="95%" 
                barSize={22} 
                data={wealthData}
                startAngle={180} 
                endAngle={-180}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  background={{ fill: 'rgba(241, 245, 249, 0.3)' }}
                  dataKey="value"
                  cornerRadius={12}
                  style={{ filter: 'url(#glow)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.2)',
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    color: 'white'
                  }}
                  itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Center Score with gradient ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 text-center pointer-events-none">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-20 blur-lg animate-pulse" />
                <div className="relative bg-white dark:bg-slate-900 rounded-full p-4 shadow-xl">
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">{productizeScore}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">SCORE</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
            {Object.entries(wealthMatrix).map(([key, value]) => {
              const labelEN: Record<string, string> = { labor: 'Labor', capital: 'Capital', code: 'Code', media: 'Media', community: 'Community', knowledge: 'Knowledge/IP' };
              const labelCN: Record<string, string> = { labor: '劳动力', capital: '资本', code: '代码', media: '媒体', community: '社群', knowledge: '知识IP' };
              return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="capitalize">{language === 'EN' ? labelEN[key] : labelCN[key]}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{value}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={value} 
                  onChange={(e) => updateWealth(key, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                />
              </div>
              );
            })}
          </div>
        </div>

        {/* 2. Freedom Engine (Sovereignty Dashboard 2.0) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
              <Anchor className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{language === 'EN' ? 'Freedom Engine (Sovereignty)' : '自由引擎 (主权仪表盘)'}</h3>
          </div>

          <div className="space-y-6">
            {/* Freedom Core Visual */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Spinning Rings */}
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 border-4 border-emerald-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-8 border-4 border-purple-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                
                {/* Core Score */}
                <div className="text-center z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-full shadow-sm">
                  <div className="text-4xl font-black text-slate-800 dark:text-white">{totalFreedomScore}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">SCORE</div>
                </div>
              </div>
            </div>

            {/* Financial Independence Cockpit (Pro) - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 h-24 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 font-bold mb-1">{language === 'EN' ? "Runway" : "跑道"}</div>
                    <div className="text-2xl font-black text-slate-700 dark:text-slate-200" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {runwayYears >= 999 ? '∞' : runwayYears.toFixed(1)}
                      <span className="text-sm font-normal ml-1 text-slate-400">{language === 'EN' ? "years" : "年"}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: runwayYears > 5 ? '#10b981' : '#ef4444', color: 'white' }}>
                    {runwayYears > 5 ? 'Safe' : 'Risk'}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 h-24 flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-bold mb-1">{language === 'EN' ? "FIRE Progress" : "自由度"}</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>{fireProgress}%</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all" style={{ width: `${fireProgress}%` }} />
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 h-24 flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-bold mb-1">{language === 'EN' ? "Sleep Income" : "睡后时薪"}</div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  ${sleepIncome}
                  <span className="text-sm font-normal ml-1 text-slate-400">/hr</span>
                </div>
              </div>
            </div>

            {/* Controls: Financial Inputs */}
            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>{language === 'EN' ? "Monthly Burn" : "月支出"}</span>
                   <span className="w-20 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>${freedomStats.monthlyBurn.toLocaleString()}</span>
                 </div>
                 <input type="range" min="1000" max="20000" step="500" value={freedomStats.monthlyBurn} onChange={(e) => setFreedomStats({...freedomStats, monthlyBurn: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-400" />
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>{language === 'EN' ? "Liquid Assets" : "流动资产"}</span>
                   <span className="w-24 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>${freedomStats.liquidAssets.toLocaleString()}</span>
                 </div>
                 <input type="range" min="0" max="1000000" step="5000" value={freedomStats.liquidAssets} onChange={(e) => setFreedomStats({...freedomStats, liquidAssets: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-400" />
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>{language === 'EN' ? "Passive Income" : "被动收入"}</span>
                   <span className="w-20 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>${freedomStats.passiveIncome.toLocaleString()}</span>
                 </div>
                 <input type="range" min="0" max="20000" step="100" value={freedomStats.passiveIncome} onChange={(e) => setFreedomStats({...freedomStats, passiveIncome: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-400" />
               </div>
            </div>

            {/* Bottom: Geo-Arbitrage & Freedom Dimensions */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'EN' ? "Geo-Arbitrage" : "地理套利"}</span>
                     <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{geoArbFactor < 100 ? `+${Math.round((100/geoArbFactor - 1)*100)}% Power` : 'Inactive'}</span>
                   </div>
                   <input 
                    type="range" min="30" max="150" value={geoArbFactor}
                    onChange={(e) => setGeoArbFactor(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                   />
                   <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                     <span>Bali (30%)</span>
                     <span>NYC (150%)</span>
                   </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-3">
                   {/* Time Freedom Slider */}
                   <div className="space-y-1">
                     <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                       <span>{language === 'EN' ? "Time" : "时间"}</span>
                       <span className="font-bold text-cyan-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{freedomMetrics.timeFreedom}%</span>
                     </div>
                     <input type="range" min="0" max="100" value={freedomMetrics.timeFreedom} 
                       onChange={(e) => setFreedomMetrics({...freedomMetrics, timeFreedom: parseInt(e.target.value)})}
                       className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-cyan-500" />
                   </div>
                   {/* Wealth (Dynamic) */}
                   <div className="space-y-1">
                     <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                       <span>{language === 'EN' ? "Wealth" : "财富"}</span>
                       <span className="font-bold text-emerald-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{adjustedFinancialFreedom}%</span>
                     </div>
                     <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 transition-all" style={{ width: `${adjustedFinancialFreedom}%` }} />
                     </div>
                   </div>
                   {/* Location Freedom Slider */}
                   <div className="space-y-1">
                     <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                       <span>{language === 'EN' ? "Location" : "地理"}</span>
                       <span className="font-bold text-purple-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{freedomMetrics.locationFreedom}%</span>
                     </div>
                     <input type="range" min="0" max="100" value={freedomMetrics.locationFreedom}
                       onChange={(e) => setFreedomMetrics({...freedomMetrics, locationFreedom: parseInt(e.target.value)})}
                       className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-500" />
                   </div>
                   {/* Mental Freedom Slider */}
                   <div className="space-y-1">
                     <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                       <span>{language === 'EN' ? "Mind" : "心智"}</span>
                       <span className="font-bold text-rose-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{freedomMetrics.mentalFreedom}%</span>
                     </div>
                     <input type="range" min="0" max="100" value={freedomMetrics.mentalFreedom}
                       onChange={(e) => setFreedomMetrics({...freedomMetrics, mentalFreedom: parseInt(e.target.value)})}
                       className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-rose-500" />
                   </div>
                </div>
            </div>
          </div>
        </div> 


        {/* 3. Specific Knowledge Map (Unfair Advantage Stack) - Enhanced Design */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg overflow-hidden relative">
          {/* Background glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{language === 'EN' ? 'Specific Knowledge' : '特有知识'}</h3>
                  <p className="text-[10px] text-slate-400">{language === 'EN' ? "Your Unfair Advantage Stack" : "你的不可复制优势栈"}</p>
                </div>
              </div>
              
              {/* Uniqueness Score Ring */}
              <div className="relative">
                <svg className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle 
                    cx="40" cy="40" r="34" 
                    stroke="url(#uniqueGradient)" 
                    strokeWidth="5" 
                    fill="transparent"
                    strokeDasharray={`${Math.round((skillStack.baseTalent + skillStack.obsessiveInterest + skillStack.marketKnowledge + skillStack.salesAbility) / 4 / 100 * 213.6)} 213.6`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="uniqueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {Math.round((skillStack.baseTalent + skillStack.obsessiveInterest + skillStack.marketKnowledge + skillStack.salesAbility) / 4)}
                  </span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider">AVG</span>
                </div>
              </div>
            </div>
            
            {/* Skill Cards Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Foundational Talent */}
              <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-200 dark:bg-orange-800/50 flex items-center justify-center text-lg">🧒</div>
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{language === 'EN' ? "Foundation" : "基础天赋"}</div>
                    <div className="text-[9px] text-slate-400">{language === 'EN' ? "Childhood optimized" : "童年习得"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-300 rounded-full transition-all duration-500 ease-out" style={{ width: `${skillStack.baseTalent}%` }} />
                  </div>
                  <span className="text-sm font-black text-orange-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{skillStack.baseTalent}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillStack.baseTalent} 
                  onChange={(e) => setSkillStack(prev => ({...prev, baseTalent: parseInt(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
              </div>

              {/* Obsessive Interest */}
              <div className="group relative bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-200 dark:bg-pink-800/50 flex items-center justify-center text-lg">🔥</div>
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{language === 'EN' ? "Obsession" : "狂热兴趣"}</div>
                    <div className="text-[9px] text-slate-400">{language === 'EN' ? "Play for you, work for others" : "你的游戏，别人的工作"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-pink-100 dark:bg-pink-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${skillStack.obsessiveInterest}%` }} />
                  </div>
                  <span className="text-sm font-black text-pink-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{skillStack.obsessiveInterest}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillStack.obsessiveInterest}
                  onChange={(e) => setSkillStack(prev => ({...prev, obsessiveInterest: parseInt(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
              </div>

              {/* Domain Knowledge */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-200 dark:bg-blue-800/50 flex items-center justify-center text-lg">📚</div>
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{language === 'EN' ? "Domain" : "行业洞察"}</div>
                    <div className="text-[9px] text-slate-400">{language === 'EN' ? "Deep expertise" : "深度专业知识"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${skillStack.marketKnowledge}%` }} />
                  </div>
                  <span className="text-sm font-black text-blue-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{skillStack.marketKnowledge}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillStack.marketKnowledge}
                  onChange={(e) => setSkillStack(prev => ({...prev, marketKnowledge: parseInt(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
              </div>

              {/* Sales & Build */}
              <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-200 dark:bg-emerald-800/50 flex items-center justify-center text-lg">🚀</div>
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{language === 'EN' ? "Execution" : "构建销售"}</div>
                    <div className="text-[9px] text-slate-400">{language === 'EN' ? "Build or sell" : "能造能卖"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${skillStack.salesAbility}%` }} />
                  </div>
                  <span className="text-sm font-black text-emerald-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{skillStack.salesAbility}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillStack.salesAbility}
                  onChange={(e) => setSkillStack(prev => ({...prev, salesAbility: parseInt(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
              </div>
            </div>

            {/* Combination Multiplier Section */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-[1px] rounded-2xl">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                      {language === 'EN' ? "Irreplaceability Score" : "不可替代性指数"}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'EN' ? "Unique skill combination = Monopoly" : "独特技能组合 = 个人垄断"}
                    </div>
                    
                    {/* Formula visualization */}
                    <div className="flex items-center gap-1 mt-2 text-[9px]">
                      <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-600">🧒{skillStack.baseTalent}</span>
                      <span className="text-slate-400">×</span>
                      <span className="px-1.5 py-0.5 bg-pink-100 dark:bg-pink-900/30 rounded text-pink-600">🔥{skillStack.obsessiveInterest}</span>
                      <span className="text-slate-400">×</span>
                      <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600">📚{skillStack.marketKnowledge}</span>
                      <span className="text-slate-400">×</span>
                      <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-600">🚀{skillStack.salesAbility}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {Math.round((skillStack.baseTalent + skillStack.obsessiveInterest + skillStack.marketKnowledge + skillStack.salesAbility) * 2.5)}
                    </div>
                    <div className="text-[10px] text-slate-400">{language === 'EN' ? "out of 1000" : "/ 1000 分"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Judgment Engine (Naval's Razor) - Enhanced Professional Design */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg overflow-hidden relative">
          {/* Background Glow Effect */}
          <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl transition-all duration-1000 ${
            judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting 
              ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30' 
              : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
          }`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{language === 'EN' ? 'Judgment Engine' : '判断力引擎'}</h3>
                  <p className="text-[10px] text-slate-400">{language === 'EN' ? "Naval's Decision Razor" : "纳瓦尔决策剃刀"}</p>
                </div>
              </div>
              
              {/* Decision Score Circle */}
              <div className="relative">
                <svg className="w-16 h-16 -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle 
                    cx="32" cy="32" r="28" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth="4" 
                    fill="transparent"
                    strokeDasharray={`${((judgmentParams.isLongTerm ? 1 : 0) + (judgmentParams.isWinWin ? 1 : 0) + (judgmentParams.isExciting ? 1 : 0)) / 3 * 175.9} 175.9`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-slate-700 dark:text-white">
                    {(judgmentParams.isLongTerm ? 1 : 0) + (judgmentParams.isWinWin ? 1 : 0) + (judgmentParams.isExciting ? 1 : 0)}/3
                  </span>
                </div>
              </div>
            </div>
            
            {/* Criteria Cards */}
            <div className="space-y-3">
              {/* Long-Term Game */}
              <div 
                onClick={() => setJudgmentParams(prev => ({...prev, isLongTerm: !prev.isLongTerm}))}
                className={`group cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  judgmentParams.isLongTerm 
                    ? 'bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-400' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
                      judgmentParams.isLongTerm ? 'bg-emerald-500 shadow-lg scale-110' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      {judgmentParams.isLongTerm ? '🎯' : '⏰'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 dark:text-slate-200">{language === 'EN' ? "Long-Term Game" : "长期游戏"}</div>
                      <div className="text-[11px] text-slate-400">{language === 'EN' ? "Can you play this for 10+ years?" : "你能玩这个游戏10年以上吗?"}</div>
                    </div>
                  </div>
                  <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${judgmentParams.isLongTerm ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${judgmentParams.isLongTerm ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              {/* Compounding */}
              <div 
                onClick={() => setJudgmentParams(prev => ({...prev, isWinWin: !prev.isWinWin}))}
                className={`group cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  judgmentParams.isWinWin 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-400' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
                      judgmentParams.isWinWin ? 'bg-blue-500 shadow-lg scale-110' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      {judgmentParams.isWinWin ? '📈' : '💹'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 dark:text-slate-200">{language === 'EN' ? "Compounding" : "复利效应"}</div>
                      <div className="text-[11px] text-slate-400">{language === 'EN' ? "Does effort accumulate over time?" : "努力会随时间累积增长吗?"}</div>
                    </div>
                  </div>
                  <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${judgmentParams.isWinWin ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${judgmentParams.isWinWin ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              {/* Hell Yeah or No */}
              <div 
                onClick={() => setJudgmentParams(prev => ({...prev, isExciting: !prev.isExciting}))}
                className={`group cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  judgmentParams.isExciting 
                    ? 'bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 border-pink-400' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
                      judgmentParams.isExciting ? 'bg-pink-500 shadow-lg scale-110' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      {judgmentParams.isExciting ? '🔥' : '🤔'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 dark:text-slate-200">{language === 'EN' ? "Hell Yeah!" : "非它不可"}</div>
                      <div className="text-[11px] text-slate-400">{language === 'EN' ? "If it's not a hell yeah, it's a no" : "如果不是'非它不可'，那就是'不'"}</div>
                    </div>
                  </div>
                  <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${judgmentParams.isExciting ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${judgmentParams.isExciting ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Output Panel */}
            <div className={`mt-6 p-5 rounded-2xl transition-all duration-700 relative overflow-hidden ${
              judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
                : 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'
            }`}>
              {/* Animated particles for success state */}
              {judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-2 left-4 w-2 h-2 bg-white/30 rounded-full animate-ping" />
                  <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-4 left-1/3 w-1 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                </div>
              )}
              
              <div className="relative flex items-center justify-between">
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                    judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting ? 'text-white/80' : 'text-slate-500'
                  }`}>{language === 'EN' ? "DECISION OUTPUT" : "决策结果"}</div>
                  <div className={`text-3xl font-black ${
                    judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting ? 'text-white' : 'text-slate-400'
                  }`}>
                    {judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting
                      ? (language === 'EN' ? "GO ALL IN! 🚀" : "全力以赴! 🚀")
                      : (language === 'EN' ? "Pass ❌" : "果断放弃 ❌")
                    }
                  </div>
                  {judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting && (
                    <div className="text-[11px] text-white/70 mt-1">{language === 'EN' ? "All criteria met - maximum conviction!" : "所有条件满足 - 值得全情投入!"}</div>
                  )}
                </div>
                <div className={`text-6xl transition-all duration-500 ${
                  judgmentParams.isLongTerm && judgmentParams.isWinWin && judgmentParams.isExciting 
                    ? 'animate-bounce drop-shadow-2xl' 
                    : 'grayscale opacity-30'
                }`}>
                  🦁
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Capital Allocation Optimizer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
              <PieChartIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{language === 'EN' ? 'Capital Allocation Optimizer' : '资本配置优化器'}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500 dark:text-slate-400 font-bold">{language === 'EN' ? "Resource Input (Time/Energy)" : "投入资源 (时间/精力)"}</span>
                   <span className="text-slate-800 dark:text-white font-mono">{resourceInput}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" value={resourceInput}
                   onChange={(e) => setResourceInput(parseInt(e.target.value))}
                   className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                 />
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{language === 'EN' ? "Distribution Strategy" : "分配策略"}</p>
                 {Object.entries(allocationStrategy).map(([key, val]) => (
                   <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-300 capitalize">{key === 'code' ? (language === 'EN' ? 'Code' : '代码') : key === 'media' ? (language === 'EN' ? 'Media' : '媒体') : key === 'labor' ? (language === 'EN' ? 'Labor' : '劳动力') : (language === 'EN' ? 'Capital' : '资本')}</span>
                        <span className="text-slate-400">{val}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={val}
                        onChange={(e) => setAllocationStrategy(prev => ({...prev, [key]: parseInt(e.target.value)}))}
                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                          key === 'labor' ? 'bg-slate-200 accent-slate-500' :
                          key === 'capital' ? 'bg-amber-100 accent-amber-500' :
                          key === 'code' ? 'bg-purple-100 accent-purple-500' :
                          'bg-pink-100 accent-pink-500'
                        }`}
                      />
                   </div>
                 ))}
               </div>
            </div>

            {/* Visual Output */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col justify-end min-h-[250px] relative overflow-hidden">
               <div className="absolute top-4 right-4 text-right">
                 <div className="text-xs text-slate-400 uppercase tracking-wider">{language === 'EN' ? "Effective Output" : "有效产出"}</div>
                 <div className="text-3xl font-black text-slate-800 dark:text-white">{totalOutput.toLocaleString()}</div>
                 <div className="text-[10px] text-slate-400">{language === 'EN' ? "Leverage Multiplier" : "杠杆倍数"}: <span className="text-green-500">{(totalOutput / (resourceInput || 1)).toFixed(1)}x</span></div>
               </div>

               <div className="flex items-end justify-around gap-2 h-[150px] mt-auto">
                  {allocationData.map((item) => {
                    const heightPct = Math.min((item.output / totalOutput) * 100, 100) || 0;
                    // Log scale visual for bar to show massive diff
                    const logHeight = Math.log10(item.output + 1) * 20; 
                    
                    return (
                      <div key={item.name} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full rounded-t-lg transition-all duration-500 group-hover:opacity-90 flex items-end justify-center" 
                             style={{ 
                               height: `${Math.max(logHeight, 5)}%`, 
                               backgroundColor: item.color 
                             }}>
                           <span className="text-[10px] font-bold text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.output > 1000 ? (item.output/1000).toFixed(1)+'k' : Math.round(item.output)}</span>
                        </div>
                        <div className="mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate w-full text-center">{item.name}</div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>

        {/* 7. Infinite Game Simulator - Enhanced Professional Design */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg overflow-hidden relative">
          {/* Background effects */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{language === 'EN' ? 'Infinite Game Simulator' : '无限游戏模拟器'}</h3>
                  <p className="text-[10px] text-slate-400">{language === 'EN' ? "Compound your way to freedom" : "复利你的财富自由之路"}</p>
                </div>
              </div>
              
              {/* Final Value Display */}
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{language === 'EN' ? "Projected Value" : "预期终值"}</div>
                <div className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {gameData.length > 0 ? (gameData[gameData.length - 1]?.value > 1000 ? `${(gameData[gameData.length - 1]?.value / 1000).toFixed(1)}k` : Math.round(gameData[gameData.length - 1]?.value || 0)) : 0}
                </div>
              </div>
            </div>

            {/* Control Cards Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Years Card */}
              <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 h-32">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{language === 'EN' ? "Time Horizon" : "时间跨度"}</div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-200 dark:bg-indigo-800/50 flex items-center justify-center text-xl flex-shrink-0">⏳</div>
                  <div className="text-3xl font-black text-indigo-600 whitespace-nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>{infiniteGame.years}{language === 'EN' ? 'yr' : '年'}</div>
                </div>
                <div className="h-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(infiniteGame.years * 2.5, 100)}%` }} />
                </div>
                <input type="range" min="1" max="40" value={infiniteGame.years} 
                  onChange={(e) => setInfiniteGame(prev => ({...prev, years: parseInt(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
              </div>

              {/* Ethics Card */}
              <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 h-32">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{language === 'EN' ? "Ethics (Safety)" : "诚信度 (安全)"}</div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-200 dark:bg-emerald-800/50 flex items-center justify-center text-xl flex-shrink-0">🛡️</div>
                  <div className={`text-3xl font-black ${infiniteGame.ethics >= 80 ? 'text-emerald-600' : 'text-amber-500'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>{infiniteGame.ethics}%</div>
                </div>
                <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ease-out ${infiniteGame.ethics >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-amber-400'}`} style={{ width: `${infiniteGame.ethics}%` }} />
                </div>
                <input type="range" min="0" max="100" value={infiniteGame.ethics}
                  onChange={(e) => setInfiniteGame(prev => ({...prev, ethics: parseInt(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
              </div>

              {/* Consistency Card */}
              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 h-32">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{language === 'EN' ? "Consistency (Growth)" : "一致性 (增长)"}</div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-200 dark:bg-blue-800/50 flex items-center justify-center text-xl flex-shrink-0">📈</div>
                  <div className="text-3xl font-black text-blue-600" style={{ fontVariantNumeric: 'tabular-nums' }}>{infiniteGame.consistency}%</div>
                </div>
                <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${infiniteGame.consistency}%` }} />
                </div>
                <input type="range" min="0" max="100" value={infiniteGame.consistency}
                  onChange={(e) => setInfiniteGame(prev => ({...prev, consistency: parseInt(e.target.value)}))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" />
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-4">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gameData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(v) => v > 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '12px', 
                        color: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                      }}
                      itemStyle={{ fontSize: '12px' }}
                      labelFormatter={(label) => `Year ${label}`}
                      formatter={(value: number, name: string) => [value > 1000 ? `${(value/1000).toFixed(1)}k` : Math.round(value), name]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      name={language === 'EN' ? "Your Trajectory" : "你的轨迹"} 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      fill="url(#colorValue)"
                      dot={false} 
                      activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="shortTerm" 
                      name={language === 'EN' ? "Short-term Thinking" : "短视思维"} 
                      stroke="#94a3b8" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      fill="url(#colorShort)"
                      dot={false} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-[11px] text-slate-500">{language === 'EN' ? "Long-term Compounding" : "长期复利"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-slate-400" style={{ borderStyle: 'dashed', borderWidth: '1px' }} />
                  <span className="text-[11px] text-slate-400">{language === 'EN' ? "Short-term Gains" : "短期收益"}</span>
                </div>
              </div>
            </div>

            {/* Bottom Insight Panel */}
            <div className={`p-4 rounded-xl transition-all duration-500 ${
              infiniteGame.ethics >= 80 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/30' 
                : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30'
            }`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{infiniteGame.ethics >= 80 ? '🛡️' : '⚠️'}</div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${infiniteGame.ethics >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {infiniteGame.ethics >= 80 ? (language === 'EN' ? "SUSTAINABLE PATH" : "可持续路径") : (language === 'EN' ? "RISK WARNING" : "风险提示")}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {infiniteGame.ethics < 80 
                      ? (language === 'EN' ? "Low ethics creates hidden risks. You might win fast, but you risk ruining your reputation capital. The house always wins against cheaters." : "低诚信度会制造隐性风险。你可能赢在当下，但正冒着声誉破产的风险。对作弊者，庄家永远赢。")
                      : (language === 'EN' ? `High ethics + ${infiniteGame.consistency}% consistency over ${infiniteGame.years} years = exponential growth. Compound interest requires survival first.` : `高诚信度 + ${infiniteGame.consistency}% 一致性坚持 ${infiniteGame.years} 年 = 指数级增长。复利的前提是活着。`)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Naval Tweet Quotes Carousel */}
      <NavalTweetCarousel language={language} />

    </div>
  );
};

// Helper Components
const MetricCard = ({ title, value, unit, color, desc, inverse }: any) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}{unit}</div>
      <div className="text-[10px] text-slate-400 mt-1">{desc}</div>
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
        <div 
          className={`h-full rounded-full ${color.replace('text-', 'bg-').replace(' dark:text-', ' dark:bg-')} transition-all duration-500`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const MetricBar = ({ label, value, max, unit, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <span className="font-bold">{value}{unit}</span>
    </div>
    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${color} transition-all duration-500`} 
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

const SliderMetric = ({ label, value, onChange, color, inverse }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
      <span className="capitalize">{label}</span>
      <span className="font-bold">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer ${color}`}
    />
  </div>
);

const ToggleItem = ({ label, checked, onChange }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors" onClick={onChange}>
    <span className="text-slate-700 dark:text-slate-300">{label}</span>
    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

// Fallback icon since PieChart isn't an icon
const PieChartIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

const StackLayer = ({ level, title, value, onChange, color }: any) => (
  <div className="relative mb-4 last:mb-0">
    <div className="flex justify-between items-end mb-1 px-1">
       <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{title}</span>
       <span className="text-xs font-mono text-slate-400">{value}%</span>
    </div>
    <div className="relative h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <div 
        className={`absolute top-0 left-0 h-full ${color} opacity-80 transition-all duration-300`}
        style={{ width: `${value}%` }} 
      />
      <input 
        type="range" min="0" max="100" value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-10"
      />
      <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] text-white/50 font-bold pointer-events-none">
        LAYER {level}
      </div>
    </div>
  </div>
);

const CircularMetric = ({ label, value, color, icon, subLabel }: any) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 mb-2">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="40" cy="40" r={radius} stroke={color} strokeWidth="6" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xl">
          {icon}
        </div>
      </div>
      <div className="text-center">
         <div className="text-lg font-bold text-slate-800 dark:text-white leading-none">{value}%</div>
         <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">{label}</div>
         <div className="text-[10px] text-slate-400">{subLabel}</div>
      </div>
    </div>
  );
}; 


// Naval Tweet Carousel Component
const NavalTweetCarousel = ({ language }: { language: 'CN' | 'EN' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Use imported tweets from data file
  const allTweets = navalTweets;

  const categories = [
    { id: 'all', labelZH: '全部', labelEN: 'All', color: 'from-purple-500 to-pink-500' },
    { id: 'wealth', labelZH: '财富', labelEN: 'Wealth', color: 'from-emerald-500 to-teal-500' },
    { id: 'wisdom', labelZH: '智慧', labelEN: 'Wisdom', color: 'from-amber-500 to-orange-500' },
    { id: 'life', labelZH: '人生', labelEN: 'Life', color: 'from-blue-500 to-indigo-500' },
    { id: 'entrepreneurship', labelZH: '创业', labelEN: 'Startup', color: 'from-orange-500 to-red-500' },
    { id: 'politics', labelZH: '政治', labelEN: 'Politics', color: 'from-rose-500 to-pink-500' },
    { id: 'technology', labelZH: '科技', labelEN: 'Tech', color: 'from-cyan-500 to-blue-500' },
  ];

  const filteredTweets = selectedCategory === 'all' 
    ? allTweets 
    : allTweets.filter(t => t.category === selectedCategory);

  // Auto-play effect
  React.useEffect(() => {
    if (!isAutoPlay || filteredTweets.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredTweets.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, filteredTweets.length, selectedCategory]);

  // Reset index when category changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const currentTweet = filteredTweets[currentIndex];
  const currentCategory = categories.find(c => c.id === currentTweet?.category) || categories[0];

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const goPrev = () => {
    setCurrentIndex(prev => prev === 0 ? filteredTweets.length - 1 : prev - 1);
    setIsAutoPlay(false);
  };

  const goNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredTweets.length);
    setIsAutoPlay(false);
  };

  // Helper to get tweet text based on language
  const getTweetText = (tweet: typeof allTweets[0]) => language === 'EN' ? tweet.textEN : tweet.textZH;

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800">
              <img 
                src="https://unavatar.io/twitter/naval" 
                alt="Naval Ravikant" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Naval+Ravikant&background=random';
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                @naval
              </h3>
              <p className="text-sm text-slate-500 dark:text-purple-300/70">
                {language === 'EN' ? `${filteredTweets.length} curated insights` : `${filteredTweets.length} 条精选语录`}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat.id 
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105` 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {language === 'EN' ? cat.labelEN : cat.labelZH}
              </button>
            ))}
          </div>
        </div>

        {/* Main Quote Card */}
        {currentTweet && (
          <div className="relative">
            {/* Quote Marks */}
            <div className="absolute -top-2 left-2 text-7xl text-purple-500/20 font-serif leading-none">"</div>
            
            <div className={`relative p-6 md:p-10 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 min-h-[180px] flex flex-col justify-center`}>
              {/* Category Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${currentCategory.color} text-white`}>
                {language === 'EN' ? currentCategory.labelEN : currentCategory.labelZH}
              </div>

              {/* Tweet Text */}
              <p className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-800 dark:text-white leading-relaxed mb-6">
                {getTweetText(currentTweet)}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-purple-300/60">
                <span className="flex items-center gap-1">
                  <span>❤️</span> {currentTweet.likes}
                </span>
                <span>•</span>
                <span>{currentTweet.date}</span>
                <span className="ml-auto text-purple-600 dark:text-purple-400 font-mono">
                  {currentIndex + 1} / {filteredTweets.length}
                </span>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-lg flex items-center justify-center text-slate-600 dark:text-white transition-all hover:scale-110 border border-slate-200 dark:border-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-lg flex items-center justify-center text-slate-600 dark:text-white transition-all hover:scale-110 border border-slate-200 dark:border-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {filteredTweets.slice(0, Math.min(filteredTweets.length, 15)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex 
                  ? 'w-8 h-2 bg-gradient-to-r from-purple-400 to-pink-400' 
                  : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
            />
          ))}
          {filteredTweets.length > 15 && (
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">+{filteredTweets.length - 15}</span>
          )}
        </div>

        {/* Auto-play Toggle */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${
              isAutoPlay 
                ? 'bg-white dark:bg-slate-800 text-purple-500 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-900/20' 
                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title={language === 'EN' ? (isAutoPlay ? 'Pause Auto-play' : 'Start Auto-play') : (isAutoPlay ? '暂停自动播放' : '开始自动播放')}
          >
            {isAutoPlay ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Tweet Thumbnails */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredTweets.slice(0, 10).map((tweet, idx) => {
            const cat = categories.find(c => c.id === tweet.category);
            return (
              <button
                key={tweet.id}
                onClick={() => goTo(idx)}
                className={`p-3 rounded-xl text-left transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-400 scale-105' 
                    : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat?.color} mb-2`} />
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
                  {getTweetText(tweet).slice(0, 50)}...
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">❤️ {tweet.likes}</p>
              </button>
            );
          })}
        </div>

        {/* Flowing Quote Ticker - Bidirectional */}
        <div className="mt-8 overflow-hidden">
          {/* Top Row - Left to Right */}
          <div className="relative mb-3 overflow-hidden">
            <div className="flex gap-4 animate-scroll-left">
              {/* Duplicate for seamless loop */}
              {[...allTweets.slice(0, 20), ...allTweets.slice(0, 20)].map((tweet, idx) => (
                <div
                  key={`ticker-l-${idx}`}
                  className="flex-shrink-0 px-5 py-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40 rounded-xl border border-purple-200 dark:border-purple-700/50 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-400 dark:hover:border-purple-400/50 hover:z-10 transition-all duration-300 cursor-pointer group"
                  onClick={() => goTo(tweet.id - 1)}
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    "{getTweetText(tweet).slice(0, 80)}..."
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Right to Left */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4 animate-scroll-right">
              {/* Duplicate for seamless loop */}
              {[...allTweets.slice(20, 40), ...allTweets.slice(20, 40)].map((tweet, idx) => (
                <div
                  key={`ticker-r-${idx}`}
                  className="flex-shrink-0 px-5 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl border border-blue-200 dark:border-blue-700/50 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400 dark:hover:border-blue-400/50 hover:z-10 transition-all duration-300 cursor-pointer group"
                  onClick={() => goTo(tweet.id - 1)}
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    "{getTweetText(tweet).slice(0, 80)}..."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavalWisdomEngine;
