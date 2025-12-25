import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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

  // 8. Naval Biography Modal
  const [showNavalBio, setShowNavalBio] = useState(false);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (showNavalBio) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showNavalBio]);
  
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
      {/* Header - Premium Design with Flowing Gradient */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden text-white">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        
        {/* Decorative Brain Icon */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Brain size={250} />
        </div>
        
        {/* Quote Marks */}
        <div className="absolute top-4 left-6 text-6xl text-purple-500/30 font-serif">"</div>
        
        <div className="relative z-10">
          {/* Main Title with Flowing Gradient - Clickable */}
          <h2 
            className="text-4xl font-black flex items-center gap-4 mb-4 cursor-pointer group"
            onClick={() => setShowNavalBio(true)}
          >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-[length:200%_auto] group-hover:opacity-80 transition-opacity"
              style={{ 
                animation: 'gradient-flow 3s linear infinite',
              }}
            >
              {language === 'EN' ? 'Naval Wisdom Engine' : 'Naval 智慧引擎'}
            </span>
            <span className="text-xs text-purple-400/60 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">{language === 'EN' ? 'Click for bio' : '点击查看简介'}</span>
          </h2>
          
          {/* Quote with Premium Typography */}
          <div className="relative pl-6 border-l-2 border-purple-500/50 ml-2">
            <p className="text-xl font-medium text-white/90 leading-relaxed tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {language === 'EN' 
                ? '"Seek wealth, not money or status. Wealth is having assets that earn while you sleep."'
                : '"追求财富，而非金钱或地位。财富是拥有能在你睡觉时也能赚钱的资产。"'
              }
            </p>
            <p 
              className="text-sm text-purple-300/70 mt-2 font-medium cursor-pointer hover:text-purple-300 transition-colors"
              onClick={() => setShowNavalBio(true)}
            >
              — Naval Ravikant
            </p>
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      </div>
      
      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

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
        <div className="bg-white dark:bg-slate-900 rounded-t-2xl rounded-b-none border border-b-0 border-slate-200 dark:border-slate-800 p-6 shadow-lg">
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
               
               {/* Allocation Donut Chart */}
               <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-4">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{language === 'EN' ? "Distribution Overview" : "分配预览"}</p>
                 <div className="flex items-center gap-4">
                   {/* Donut Chart */}
                   <div className="relative w-24 h-24">
                     <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                       {(() => {
                         const total = Object.values(allocationStrategy).reduce((a, b) => a + b, 0) || 1;
                         let currentAngle = 0;
                         const colors = { labor: '#64748b', capital: '#f59e0b', code: '#8b5cf6', media: '#ec4899' };
                         return Object.entries(allocationStrategy).map(([key, val]) => {
                           const percentage = (val / total) * 100;
                           const strokeDasharray = `${percentage * 2.51} ${251.2 - percentage * 2.51}`;
                           const strokeDashoffset = -currentAngle * 2.51;
                           currentAngle += percentage;
                           return (
                             <circle
                               key={key}
                               cx="50" cy="50" r="40"
                               fill="none"
                               stroke={colors[key as keyof typeof colors]}
                               strokeWidth="12"
                               strokeDasharray={strokeDasharray}
                               strokeDashoffset={strokeDashoffset}
                               className="transition-all duration-500"
                             />
                           );
                         });
                       })()}
                       <circle cx="50" cy="50" r="28" fill="currentColor" className="text-white dark:text-slate-900" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="text-center">
                         <div className="text-lg font-black text-slate-800 dark:text-white">{(totalOutput / (resourceInput || 1)).toFixed(0)}x</div>
                         <div className="text-[8px] text-slate-400">{language === 'EN' ? 'leverage' : '杠杆'}</div>
                       </div>
                     </div>
                   </div>
                   
                   {/* Legend */}
                   <div className="flex-1 space-y-1.5">
                     {[
                       { key: 'labor', label: language === 'EN' ? 'Labor' : '劳动力', color: 'bg-slate-500' },
                       { key: 'capital', label: language === 'EN' ? 'Capital' : '资本', color: 'bg-amber-500' },
                       { key: 'code', label: language === 'EN' ? 'Code' : '代码', color: 'bg-purple-500' },
                       { key: 'media', label: language === 'EN' ? 'Media' : '媒体', color: 'bg-pink-500' }
                     ].map(item => (
                       <div key={item.key} className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5">
                           <div className={`w-2 h-2 rounded-full ${item.color}`} />
                           <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.label}</span>
                         </div>
                         <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{allocationStrategy[item.key as keyof typeof allocationStrategy]}%</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </div>

            {/* Visual Output - Enhanced with more data */}
            <div className="space-y-3">
              {/* Top Stats - Refined Layout */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <div className="text-center mb-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{language === 'EN' ? "Effective Output" : "有效产出"}</div>
                  <div className="text-3xl font-black text-slate-800 dark:text-white">{totalOutput.toLocaleString()}</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <span className="text-[10px] text-green-600 dark:text-green-400">{language === 'EN' ? "Leverage" : "杠杆"}: </span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{(totalOutput / (resourceInput || 1)).toFixed(1)}x</span>
                    </div>
                  </div>
                </div>
                
                {/* Bar Chart */}
                <div className="flex items-end justify-around gap-2 h-[100px]">
                  {allocationData.map((item) => {
                    const logHeight = Math.log10(item.output + 1) * 20; 
                    return (
                      <div key={item.name} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full rounded-t-lg transition-all duration-500 group-hover:opacity-90 flex items-end justify-center" 
                             style={{ height: `${Math.max(logHeight, 8)}%`, backgroundColor: item.color }}>
                          <span className="text-[9px] font-bold text-white mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{item.output > 1000 ? (item.output/1000).toFixed(1)+'k' : Math.round(item.output)}</span>
                        </div>
                        <div className="mt-1 text-[9px] font-bold text-slate-500 dark:text-slate-400 truncate w-full text-center">{item.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Income Stream Breakdown */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2">{language === 'EN' ? "Income Stream" : "收入流分析"}</p>
                <div className="space-y-1.5">
                  {allocationData.map(item => {
                    const pct = totalOutput > 0 ? (item.output / totalOutput) * 100 : 0;
                    return (
                      <div key={item.key} className="flex items-center gap-1.5">
                        <div className="w-12 text-[9px] text-slate-500 truncate">{item.name}</div>
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                        </div>
                        <div className="w-10 text-right text-[9px] font-bold" style={{ color: item.color }}>{pct.toFixed(0)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Key Metrics Row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 border border-emerald-100 dark:border-emerald-800/30">
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400">{language === 'EN' ? "Best ROI" : "最佳ROI"}</div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {allocationData.length > 0 ? allocationData.reduce((a, b) => a.output > b.output ? a : b).name : '-'}
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-100 dark:border-amber-800/30">
                  <div className="text-[9px] text-amber-600 dark:text-amber-400">{language === 'EN' ? "Passive %" : "被动占比"}</div>
                  <div className="text-sm font-bold text-amber-700 dark:text-amber-300">
                    {totalOutput > 0 ? (((allocationData.find(d => d.key === 'capital')?.output || 0) + (allocationData.find(d => d.key === 'code')?.output || 0) + (allocationData.find(d => d.key === 'media')?.output || 0)) / totalOutput * 100).toFixed(0) : 0}%
                  </div>
                </div>
              </div>
              
              {/* Time to Freedom - Full Width */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-[10px] opacity-80 mb-1">{language === 'EN' ? "Time to Financial Freedom" : "财务自由预估时间"}</div>
                    <div className="text-2xl font-black">
                      {(() => {
                        // Use allocation strategy percentages directly for more varied results
                        const { labor, capital, code, media } = allocationStrategy;
                        
                        // Labor slows you down, high-leverage activities speed you up
                        // Score ranges from 0 (all labor) to 100 (all media)
                        const score = (capital * 0.3) + (code * 0.6) + (media * 1.0) - (labor * 0.4);
                        
                        // More granular time ranges
                        if (score >= 80) return language === 'EN' ? '1-2 years' : '1-2年';
                        if (score >= 65) return language === 'EN' ? '2-3 years' : '2-3年';
                        if (score >= 50) return language === 'EN' ? '3-5 years' : '3-5年';
                        if (score >= 38) return language === 'EN' ? '5-7 years' : '5-7年';
                        if (score >= 28) return language === 'EN' ? '7-10 years' : '7-10年';
                        if (score >= 18) return language === 'EN' ? '10-15 years' : '10-15年';
                        if (score >= 8) return language === 'EN' ? '15-20 years' : '15-20年';
                        if (score >= 0) return language === 'EN' ? '20-30 years' : '20-30年';
                        return language === 'EN' ? '30+ years' : '30+年';
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl">🎯</div>
                    <div className="text-[8px] opacity-70 mt-1">{language === 'EN' ? "Based on allocation" : "基于分配策略"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Infinite Game Simulator - Merged with Capital Allocation */}
        <div className="bg-white dark:bg-slate-900 rounded-t-none rounded-b-2xl border border-t border-t-slate-200 dark:border-t-slate-700 border-slate-200 dark:border-slate-800 p-6 shadow-lg overflow-hidden relative">
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

      {/* Naval Biography Modal - Rendered via Portal */}
      {showNavalBio && ReactDOM.createPortal(
        <div 
          className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fade-in"
          onClick={() => setShowNavalBio(false)}
        >
          <div 
            className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto animate-scale-in"
            style={{ animation: 'scale-in 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes scale-in {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
              }
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-scale-in { animation: scale-in 0.3s ease-out; }
              .animate-fade-in { animation: fade-in 0.2s ease-out; }
            `}</style>
            {/* Close Button */}
            <button 
              onClick={() => setShowNavalBio(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-red-500/80 flex items-center justify-center text-white transition-colors z-10 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with Photo */}
            <div className="relative p-8 pb-6 border-b border-slate-700">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-lg">
                    <img 
                      src="https://unavatar.io/twitter/naval" 
                      alt="Naval Ravikant"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Naval+Ravikant&background=8b5cf6&color=fff&size=128';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-white mb-1">Naval Ravikant</h2>
                  <a 
                    href="https://twitter.com/naval" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 font-medium hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    @naval
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">{language === 'EN' ? 'Entrepreneur' : '创业家'}</span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">{language === 'EN' ? 'Investor' : '投资人'}</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">{language === 'EN' ? 'Philosopher' : '思想家'}</span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">{language === 'EN' ? 'Podcaster' : '播客主'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Content */}
            <div className="p-8 space-y-6 text-white/90">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                  <div className="text-2xl font-bold text-purple-400">1974</div>
                  <div className="text-xs text-slate-400">{language === 'EN' ? 'Born in India' : '出生于印度'}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                  <div className="text-2xl font-bold text-emerald-400">$10B+</div>
                  <div className="text-xs text-slate-400">{language === 'EN' ? 'Portfolio Value' : '投资组合价值'}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                  <div className="text-2xl font-bold text-blue-400">200+</div>
                  <div className="text-xs text-slate-400">{language === 'EN' ? 'Companies Invested' : '投资公司数'}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                  <div className="text-2xl font-bold text-amber-400">2M+</div>
                  <div className="text-xs text-slate-400">{language === 'EN' ? 'Twitter Followers' : '推特粉丝'}</div>
                </div>
              </div>

              {/* Main Biography */}
              <div className="space-y-4 leading-relaxed">
                <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <span>📖</span> {language === 'EN' ? 'Biography' : '人物简介'}
                </h3>
                <p className="text-slate-300">
                  {language === 'EN' 
                    ? `Naval Ravikant is an Indian-American entrepreneur, investor, and philosopher who has become one of the most influential voices in Silicon Valley. Born in New Delhi, India in 1974, he immigrated to the United States with his family as a child, growing up in Queens, New York. His journey from humble beginnings to becoming a tech titan embodies the American dream and his own philosophy of building wealth through leverage.`
                    : `纳瓦尔·拉维坎特（Naval Ravikant）是一位印裔美籍创业家、投资人和思想家，已成为硅谷最具影响力的声音之一。1974年出生于印度新德里，童年时随家人移民美国，成长于纽约皇后区。他从贫寒背景到成为科技巨头的历程，正是美国梦的缩影，也印证了他自己关于通过杠杆创造财富的哲学。`
                  }
                </p>
                <p className="text-slate-300">
                  {language === 'EN'
                    ? `After graduating from Dartmouth College with degrees in Computer Science and Economics, Naval co-founded Epinions in 1999, which later merged to become Shopping.com and was acquired by eBay for $620 million. He went on to co-found AngelList in 2010, a platform that has revolutionized startup fundraising and venture capital, now valued at over $4 billion.`
                    : `从达特茅斯学院计算机科学和经济学双学位毕业后，纳瓦尔于1999年联合创立了Epinions，后来合并成为Shopping.com，被eBay以6.2亿美元收购。2010年他又联合创立了AngelList，这个平台彻底改变了初创企业融资和风险投资的方式，目前估值超过40亿美元。`
                  }
                </p>
              </div>

              {/* Investments */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <span>💰</span> {language === 'EN' ? 'Notable Investments' : '知名投资'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Twitter', 'Uber', 'Notion', 'Clubhouse', 'Postmates', 'Yammer', 'Clearbit', 'Opendoor'].map((company) => (
                    <div key={company} className="bg-slate-800 px-4 py-2 rounded-lg text-center text-sm font-medium text-white border border-slate-700">
                      {company}
                    </div>
                  ))}
                </div>
                <p className="text-slate-300 text-sm">
                  {language === 'EN'
                    ? `As an angel investor, Naval has invested in over 200 companies, with many becoming unicorns. His early investments in Twitter, Uber, and other tech giants have generated returns exceeding 1000x.`
                    : `作为天使投资人，纳瓦尔已投资超过200家公司，其中许多成为独角兽企业。他对Twitter、Uber等科技巨头的早期投资已产生超过1000倍的回报。`
                  }
                </p>
              </div>

              {/* Philosophy */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <span>💡</span> {language === 'EN' ? 'Core Philosophy' : '核心理念'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="font-bold text-blue-400 mb-2">{language === 'EN' ? 'Specific Knowledge' : '特有知识'}</div>
                    <p className="text-sm text-slate-400">{language === 'EN' ? 'Build skills that cannot be taught or outsourced. Find what feels like play to you but looks like work to others.' : '培养无法传授或外包的技能。找到对你来说像游戏、对他人来说像工作的事情。'}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="font-bold text-purple-400 mb-2">{language === 'EN' ? 'Leverage' : '杠杆效应'}</div>
                    <p className="text-sm text-slate-400">{language === 'EN' ? 'Use code, media, and capital to multiply your output. Seek permissionless leverage for infinite scalability.' : '利用代码、媒体和资本来放大你的产出。寻求无需许可的杠杆以实现无限可扩展性。'}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="font-bold text-emerald-400 mb-2">{language === 'EN' ? 'Judgment' : '判断力'}</div>
                    <p className="text-sm text-slate-400">{language === 'EN' ? 'The most important skill. Wisdom applied to real decisions. It comes from experience and self-knowledge.' : '最重要的技能。将智慧应用于实际决策。它来自经验和自我认知。'}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="font-bold text-amber-400 mb-2">{language === 'EN' ? 'Happiness' : '幸福'}</div>
                    <p className="text-sm text-slate-400">{language === 'EN' ? 'Happiness is a skill and a choice. It comes from inner peace, not external achievements. Desire is suffering.' : '幸福是一种技能和选择。它来自内心的平静，而非外在的成就。欲望即痛苦。'}</p>
                  </div>
                </div>
              </div>

              {/* Famous Works */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <span>📚</span> {language === 'EN' ? 'Famous Works & Podcasts' : '著名作品与播客'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-3xl">📘</div>
                    <div>
                      <div className="font-bold text-white">{language === 'EN' ? 'The Almanack of Naval Ravikant' : '纳瓦尔宝典'}</div>
                      <div className="text-sm text-slate-400">{language === 'EN' ? 'A guide to wealth and happiness, compiled by Eric Jorgenson' : '由Eric Jorgenson编纂的财富与幸福指南'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-3xl">🎙️</div>
                    <div>
                      <div className="font-bold text-white">{language === 'EN' ? 'Naval Podcast' : 'Naval 播客'}</div>
                      <div className="text-sm text-slate-400">{language === 'EN' ? 'Deep conversations on wealth, happiness, and life philosophy' : '关于财富、幸福和人生哲学的深度对话'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-3xl">🐦</div>
                    <div>
                      <div className="font-bold text-white">{language === 'EN' ? 'Twitter Threads' : '推特长文'}</div>
                      <div className="text-sm text-slate-400">{language === 'EN' ? '"How to Get Rich (without getting lucky)" - viral thread with millions of readers' : '"如何致富（不靠运气）" - 数百万读者的病毒式传播长文'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">
                <div className="text-4xl mb-4">"</div>
                <p className="text-xl font-medium text-white/90 italic leading-relaxed">
                  {language === 'EN'
                    ? 'The most important skill for getting rich is becoming a perpetual learner.'
                    : '致富最重要的技能是成为一个终身学习者。'
                  }
                </p>
                <p className="text-purple-300/70 mt-4 font-medium">— Naval Ravikant</p>
              </div>

              {/* Links Section */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
                <a 
                  href="https://nav.al" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  {language === 'EN' ? 'Visit Official Website' : '访问官方网站'}
                </a>
                <a 
                  href="https://twitter.com/naval" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  {language === 'EN' ? 'Follow on X' : '关注 X (Twitter)'}
                </a>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowNavalBio(false)}
                className="w-full mt-4 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white font-medium rounded-xl transition-all border border-slate-700/50"
              >
                {language === 'EN' ? 'Close' : '关闭'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

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
  const [carouselSpeed, setCarouselSpeed] = useState(40); // 0 = paused, 10-60 seconds

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
    }, 8000); // Slower rotation - 8 seconds
    return () => clearInterval(timer);
  }, [isAutoPlay, filteredTweets.length, selectedCategory]);

  // Reset index when category changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const currentTweet = filteredTweets[currentIndex];
  const currentCategory = categories.find(c => c.id === currentTweet?.category) || categories[0];

  // Throttle for smoother hover switching
  const lastHoverTime = React.useRef(0);
  const throttleDelay = 150; // ms between switches

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  // Throttled version for hover
  const goToThrottled = (index: number) => {
    const now = Date.now();
    if (now - lastHoverTime.current >= throttleDelay) {
      lastHoverTime.current = now;
      setCurrentIndex(index);
    }
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

        {/* Main Quote Card - Exact Match to Top Header */}
        {currentTweet && (
          <div className="relative">
            {/* Double Quote Marks - Large decorative */}
            <div className="absolute top-6 left-8 text-7xl text-purple-400/20 font-serif z-20 leading-none">"</div>
            <div className="absolute bottom-6 right-8 text-7xl text-purple-400/20 font-serif z-20 leading-none rotate-180">"</div>
            
            <div 
              onClick={goNext}
              className={`p-10 md:p-12 rounded-3xl border border-purple-500/20 shadow-2xl relative overflow-hidden min-h-[200px] flex flex-col justify-center transition-all duration-700 cursor-pointer hover:scale-[1.01] active:scale-[0.99]`}
              style={{
                background: currentTweet.category === 'wealth' 
                  ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
                  : currentTweet.category === 'wisdom'
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                  : currentTweet.category === 'life'
                  ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
                  : currentTweet.category === 'entrepreneurship'
                  ? 'linear-gradient(135deg, #200122 0%, #6f0000 50%, #200122 100%)'
                  : currentTweet.category === 'politics'
                  ? 'linear-gradient(135deg, #1a0a1c 0%, #3d1a40 50%, #1a0a1c 100%)'
                  : currentTweet.category === 'technology'
                  ? 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0a1628 100%)'
                  : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
              }}
            >
              {/* Animated Background Blobs - Match header exactly */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
              
              {/* Category Badge */}
              <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${currentCategory.color} text-white shadow-lg z-20`}>
                {language === 'EN' ? currentCategory.labelEN : currentCategory.labelZH}
              </div>

              {/* Tweet Text - Exact same as top header */}
              <p className="relative z-10 text-xl md:text-2xl font-medium text-white/90 leading-relaxed tracking-wide mb-6 px-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {getTweetText(currentTweet)}
              </p>

              {/* Meta Info - Same as top header */}
              <div className="relative z-10 flex items-center gap-4 text-sm text-purple-300/60 px-8">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>❤️</span> {currentTweet.likes}
                </span>
                <span>•</span>
                <span>{currentTweet.date}</span>
                <span className="ml-auto font-mono font-medium">
                  {currentIndex + 1} / {filteredTweets.length}
                </span>
              </div>
              
              {/* Bottom Accent Line - Same as top */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
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

        {/* Pagination Dots - Hover to switch (macOS Dock style) */}
        <div className="flex items-center justify-center gap-1.5 mt-6 py-3 px-4 rounded-full bg-slate-800/30 backdrop-blur-sm mx-auto w-fit">
          {filteredTweets.slice(0, Math.min(filteredTweets.length, 15)).map((_, idx) => {
            // Calculate scale based on distance from current (Dock magnification effect)
            const distance = Math.abs(idx - currentIndex);
            const scale = distance === 0 ? 1.5 : distance === 1 ? 1.2 : 1;
            
            return (
              <button
                key={idx}
                onMouseEnter={() => goToThrottled(idx)}
                onClick={() => goTo(idx)}
                className={`rounded-full cursor-pointer ${
                  idx === currentIndex 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-purple-500/40' 
                    : 'bg-slate-500/50 hover:bg-purple-400/70'
                }`}
                style={{
                  width: idx === currentIndex ? '24px' : '8px',
                  height: '8px',
                  transform: `scale(${scale})`,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring-like easing
                }}
              />
            );
          })}
          {filteredTweets.length > 15 && (
            <span className="text-xs text-slate-400 ml-2">+{filteredTweets.length - 15}</span>
          )}
        </div>

        {/* Bidirectional Infinite Carousel with Hover Control */}
        <div className="relative mt-8 pt-16 group/carousel">
          {/* Floating Speed Control - Above carousel, only visible on hover */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 pointer-events-none group-hover/carousel:pointer-events-auto">
            <div className="flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl rounded-2xl px-5 py-3 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              {/* Pause Button */}
              <button
                onClick={() => setCarouselSpeed(0)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  carouselSpeed === 0 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                title={language === 'EN' ? 'Pause' : '暂停'}
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
              
              {/* Speed Slider */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative w-32 h-1.5">
                  <div className="absolute inset-0 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ 
                        width: carouselSpeed === 0 ? '0%' : `${((carouselSpeed - 10) / 50) * 100}%`,
                        backgroundSize: '200% 100%',
                        animation: carouselSpeed > 0 ? 'gradient-flow 3s linear infinite' : 'none'
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={carouselSpeed || 10}
                    onChange={(e) => setCarouselSpeed(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {/* Slider Thumb */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-150"
                    style={{ left: `calc(${((carouselSpeed || 10) - 10) / 50 * 100}% - 6px)` }}
                  />
                </div>
                <span className="text-[10px] text-purple-400 font-medium">
                  {carouselSpeed === 0 
                    ? (language === 'EN' ? 'Paused' : '暂停')
                    : `${carouselSpeed}s`
                  }
                </span>
              </div>
              
              {/* Play Button */}
              <button
                onClick={() => setCarouselSpeed(40)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  carouselSpeed > 0 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                title={language === 'EN' ? 'Play' : '播放'}
              >
                <Play className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Carousel Content */}
          <div className="space-y-4 overflow-hidden">
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes scroll-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .quote-card {
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .quote-card:hover {
              transform: scale(1.08) translateY(-8px);
              box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.35);
              z-index: 10;
            }
          `}</style>
          
          {/* Top Row - Left to Right */}
          <div className="carousel-container relative">
            <div 
              className="flex gap-4" 
              style={{ 
                width: 'max-content',
                animation: carouselSpeed > 0 ? `scroll-left ${carouselSpeed}s linear infinite` : 'none',
              }}
              onMouseEnter={(e) => { if (carouselSpeed > 0) e.currentTarget.style.animationPlayState = 'paused'; }}
              onMouseLeave={(e) => { if (carouselSpeed > 0) e.currentTarget.style.animationPlayState = 'running'; }}
            >
              {[...allTweets.slice(0, 15), ...allTweets.slice(0, 15)].map((tweet, idx) => {
                const cat = categories.find(c => c.id === tweet.category);
                return (
                  <div
                    key={`left-${idx}`}
                    onClick={() => goTo(allTweets.indexOf(tweet))}
                    className="quote-card flex-shrink-0 w-72 p-5 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${cat?.color} blur-xl`} style={{ transform: 'scale(0.8)' }} />
                    
                    {/* Category Badge */}
                    <div className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${cat?.color} text-white mb-3 shadow-lg`}>
                      {language === 'EN' ? cat?.labelEN : cat?.labelZH}
                    </div>
                    
                    {/* Quote */}
                    <p className="relative z-10 text-sm text-slate-200 leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                      "{getTweetText(tweet)}"
                    </p>
                    
                    {/* Footer */}
                    <div className="relative z-10 flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                      <span className="flex items-center gap-1 text-xs text-pink-400">
                        <span>❤️</span> {tweet.likes}
                      </span>
                      <span className="text-xs text-slate-500">{tweet.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row - Right to Left */}
          <div className="carousel-container relative">
            <div 
              className="flex gap-4" 
              style={{ 
                width: 'max-content',
                animation: carouselSpeed > 0 ? `scroll-right ${carouselSpeed}s linear infinite` : 'none',
              }}
              onMouseEnter={(e) => { if (carouselSpeed > 0) e.currentTarget.style.animationPlayState = 'paused'; }}
              onMouseLeave={(e) => { if (carouselSpeed > 0) e.currentTarget.style.animationPlayState = 'running'; }}
            >
              {[...allTweets.slice(15, 30), ...allTweets.slice(15, 30)].map((tweet, idx) => {
                const cat = categories.find(c => c.id === tweet.category);
                return (
                  <div
                    key={`right-${idx}`}
                    onClick={() => goTo(allTweets.indexOf(tweet))}
                    className="quote-card flex-shrink-0 w-72 p-5 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${cat?.color} blur-xl`} style={{ transform: 'scale(0.8)' }} />
                    
                    {/* Category Badge */}
                    <div className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${cat?.color} text-white mb-3 shadow-lg`}>
                      {language === 'EN' ? cat?.labelEN : cat?.labelZH}
                    </div>
                    
                    {/* Quote */}
                    <p className="relative z-10 text-sm text-slate-200 leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                      "{getTweetText(tweet)}"
                    </p>
                    
                    {/* Footer */}
                    <div className="relative z-10 flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                      <span className="flex items-center gap-1 text-xs text-pink-400">
                        <span>❤️</span> {tweet.likes}
                      </span>
                      <span className="text-xs text-slate-500">{tweet.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NavalWisdomEngine;
