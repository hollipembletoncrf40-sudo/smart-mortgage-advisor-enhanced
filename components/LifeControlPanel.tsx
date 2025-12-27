import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ComposedChart, ReferenceLine
} from 'recharts';
import { 
  Compass, Navigation, Wind, AlertTriangle, Activity, 
  GitBranch, Heart, Clock, Skull, Zap, ChevronRight,
  Target, Shield, Gauge, Lock, Unlock, Play, RotateCcw,
  Sparkles, TrendingUp, Brain, Users, Globe
} from 'lucide-react';

interface LifeControlPanelProps {
  language: 'ZH' | 'EN';
}

const LifeControlPanel: React.FC<LifeControlPanelProps> = ({ language }) => {
  // 1. Autopilot Engine State (Multi-Dimensional)
  const [autopilotParams, setAutopilotParams] = useState({
    savingRate: 30, // %
    learningRate: 10, // hours/week
    healthDecay: 20, // Negative factor
    riskAppetite: 40 // %
  });

  // 2. Drift Alert State (6 Dimensions)
  const [driftGoals, setDriftGoals] = useState({
    freedom: 90,
    security: 40,
    growth: 80,
    comfort: 50,
    health: 85,
    connection: 70
  });
  const [driftActions, setDriftActions] = useState({
    freedom: 30, 
    security: 90, 
    growth: 40,
    comfort: 80,
    health: 40,
    connection: 50
  });

  // 3. Butterfly Effect State (Probabilistic)
  const [butterflyParams, setButterflyParams] = useState({
    leverage: 20, // Debt/Equity ratio equivalent
    volatility: 30, // Career instability
    upsideSeek: 50 // Convexity
  });

  // 4. Motivation Analyzer (Authenticity)
  const [motivations, setMotivations] = useState([
    { name: 'Security (Fear)', nameZh: '安全感 (恐惧驱动)', value: 35, color: '#64748b' }, 
    { name: 'External Validation', nameZh: '外部认同 (面子)', value: 30, color: '#f59e0b' },
    { name: 'Curiosity', nameZh: '好奇心 (本能)', value: 20, color: '#8b5cf6' },
    { name: 'Purpose', nameZh: '使命感 (高我不朽)', value: 15, color: '#ec4899' }
  ]);

  // 5. Life ROI (Attention Bandwidth)
  const [roiParams, setRoiParams] = useState({
    age: 30,
    sleepQuality: 80, // % Efficiency
    deepWorkRatio: 20, // % of work time
    commuteTime: 2 // hours/day
  });

  // 6. Regret Simulator (Timeline)
  const [simAge, setSimAge] = useState<40 | 60 | 80>(60);
  
  // 7. Serendipity Engine (Luck Surface Area)
  const [serendipityParams, setSerendipityParams] = useState({
    doing: 40, // Output volume
    telling: 20, // Broadcasting
    connecting: 30 // Network density
  });

  // 8. Fate Leverage (Calculator)
  const [leverageInputs, setLeverageInputs] = useState({
    cityTier: 2, // 1=Tier1, 3=Remote/Rural
    partnerAlignment: 50, // %
    specializedSkill: 30 // %
  });


  // --- Calculations ---

  // 1. Autopilot: Multi-line Simulation
  const autopilotData = useMemo(() => {
    const data = [];
    let wealth = 100;
    let health = 100;
    let cognition = 100;

    for (let i = 0; i <= 30; i++) {
        // Wealth grows with savings + risk; Health decays; Cognition peaks then plateau/drop
        const wealthGrowth = 0.02 + (autopilotParams.savingRate/1000) + (autopilotParams.riskAppetite/2000);
        wealth = wealth * (1 + wealthGrowth);
        
        const healthDrop = 0.01 + (autopilotParams.healthDecay/2000);
        health = health * (1 - healthDrop);

        const learnEffect = autopilotParams.learningRate / 500;
        cognition = cognition * (1 + learnEffect - 0.015); // Aging tax

        data.push({
            year: `+${i}`,
            wealth: Math.round(wealth),
            health: Math.round(health),
            cognition: Math.round(cognition)
        });
    }
    return data;
  }, [autopilotParams]);

  // 2. Drift Score
  const driftScore = useMemo(() => {
    const axes = Object.keys(driftGoals) as (keyof typeof driftGoals)[];
    let totalDiff = 0;
    axes.forEach(k => {
        totalDiff += Math.abs(driftGoals[k] - driftActions[k]);
    });
    return Math.round((totalDiff / (axes.length * 100)) * 100);
  }, [driftGoals, driftActions]);

  // 3. Butterfly: Bell Curve Probability
  const butterflyData = useMemo(() => {
    // Generate a distribution based on volatility and upside
    const data = [];
    const mean = 0 + (butterflyParams.upsideSeek / 2); // Shift right if seeking upside
    const stdDev = 10 + (butterflyParams.volatility + butterflyParams.leverage) / 2;
    
    for (let x = -100; x <= 200; x += 10) {
        // Gaussian function
        const prob = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        data.push({
            outcome: x, // % Return
            probability: prob * 1000, // Scale for visual
            type: x < 0 ? 'Ruin' : 'Gain'
        });
    }
    return data;
  }, [butterflyParams]);

  // 5. Life ROI: Bandwidth Calc
  const bandwidthData = useMemo(() => {
    const totalHours = 24 * 365 * (80 - roiParams.age); // Total remaining hours
    const sleep = totalHours * 0.33 * (2 - roiParams.sleepQuality/100); // Bad sleep wastes more 'life efficiency'? Or simply takes time.
    // Let's model: Bad sleep reduces effective waking hours.
    
    const commute = roiParams.commuteTime * 365 * (80 - roiParams.age - 15); // Until 65
    const zombieWork = (8 - (8 * roiParams.deepWorkRatio/100)) * 250 * (65 - roiParams.age); // Shallow work
    const deepWork = (8 * roiParams.deepWorkRatio/100) * 250 * (65 - roiParams.age);
    
    const trueDisposable = totalHours - (totalHours*0.33) - commute - zombieWork - deepWork; 

    // Normalized for Stacked Bar (Annual Average)
    return [
        { name: 'Sleep', value: 8, color: '#334155', qt: 'N/A' },
        { name: 'Commute', value: roiParams.commuteTime, color: '#ef4444', qt: 'Waste' },
        { name: 'Zombie Work', value: 8 * (1 - roiParams.deepWorkRatio/100), color: '#64748b', qt: 'Low' },
        { name: 'Deep Work', value: 8 * (roiParams.deepWorkRatio/100), color: '#3b82f6', qt: 'High' },
        { name: 'Freedom', value: 24 - 8 - roiParams.commuteTime - 8, color: '#10b981', qt: 'Pure' }
    ];
  }, [roiParams]);

  // 7. Serendipity: Luck Surface Area
  // L = Doing * Telling
  const luckScore = Math.round((serendipityParams.doing * serendipityParams.telling * (1 + serendipityParams.connecting/100)) / 100);
  const luckGrid = useMemo(() => {
    // Generate a 10x10 heatmap grid
    const grid = [];
    for(let y=9; y>=0; y--) { // 10 rows
        for(let x=0; x<10; x++) { // 10 cols
            // Active if x < doing/10 AND y < telling/10
            const active = x < (serendipityParams.doing/10) && y < (serendipityParams.telling/10);
            
            // Connecting boosts intensity
            let opacity = 0.2;
            if(active) {
                opacity = 0.5 + (serendipityParams.connecting/200); // 0.5 to 1.0
            }
            grid.push({ x, y, active, opacity });
        }
    }
    return grid;
  }, [serendipityParams]);

  // 8. Fate Leverage Logic
  const leverageMultiplier = useMemo(() => {
    // City Tier: 1 -> 3x, 2 -> 1.5x, 3 -> 1x
    const cityMult = leverageInputs.cityTier === 1 ? 3 : (leverageInputs.cityTier === 2 ? 1.5 : 1);
    const partnerMult = 0.5 + (leverageInputs.partnerAlignment / 50); // 0.5x to 2.5x
    const skillMult = 1 + (leverageInputs.specializedSkill / 100) * 5; // 1x to 6x (Skill scales non-linearly)
    
    return (cityMult * partnerMult * skillMult).toFixed(1);
  }, [leverageInputs]);


  return (
    <div className="space-y-8 animate-fade-in p-2 pb-32">
       {/* Header */}
       <div className="bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80"></div>
          
          <h2 className="relative z-10 text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            {language === 'ZH' ? '🧭 命运飞行驾驶舱 V2' : '🧭 Fate Cockpit V2'}
          </h2>
          <p className="relative z-10 text-slate-500 font-mono text-xs tracking-[0.3em] uppercase">
            {language === 'ZH' ? '生命全维度监控 & 概率云干预系统' : 'Life Omni-Monitor & Probability Cloud Intervention'}
          </p>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Row 1: Autopilot & Drift (Compact) */}
          
          {/* 1. Autopilot Engine V2 (Multi-Curve) - Compact */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative group overflow-hidden">
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Wind size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-200">{language === 'ZH' ? '惯性模拟 (Autopilot)' : 'Autopilot V2'}</h3>
                  <p className="text-xs text-slate-500">{language === 'ZH' ? '多维衰减与复利' : 'Compounding vs Decay'}</p>
                </div>
             </div>

             <div className="h-40 w-full mb-6 relative">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={autopilotData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradWealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="year" tick={{fontSize: 10, fill: '#64748b'}} />
                      <YAxis tick={{fontSize: 10, fill: '#64748b'}} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                      <Area type="monotone" dataKey="wealth" stroke="#8b5cf6" strokeWidth={3} fill="url(#gradWealth)" name="Wealth" />
                      <Area type="monotone" dataKey="health" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name="Health" />
                      <Area type="monotone" dataKey="cognition" stroke="#06b6d4" strokeWidth={2} fill="transparent" name="Cognition" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             
             {/* Simple inputs for compactness */}
             <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/50 p-2 rounded">
                   <div className="flex justify-between text-slate-400 mb-1"><span>{language === 'ZH' ? '储蓄率' : 'Saving'}</span><span>{autopilotParams.savingRate}%</span></div>
                   <input type="range" className="w-full h-1 bg-slate-800 rounded full accent-indigo-500" value={autopilotParams.savingRate} onChange={e=>setAutopilotParams({...autopilotParams, savingRate: parseInt(e.target.value)})}/>
                </div>
                <div className="bg-slate-950/50 p-2 rounded">
                   <div className="flex justify-between text-slate-400 mb-1"><span>{language === 'ZH' ? '风险偏好' : 'Risk'}</span><span>{autopilotParams.riskAppetite}%</span></div>
                   <input type="range" className="w-full h-1 bg-slate-800 rounded full accent-amber-500" value={autopilotParams.riskAppetite} onChange={e=>setAutopilotParams({...autopilotParams, riskAppetite: parseInt(e.target.value)})}/>
                </div>
             </div>
          </div>

          {/* 3. Drift Alert V2 (6-Axis) - Compact */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><Compass size={20} /></div>
                   <div>
                     <h3 className="font-bold text-slate-200">{language === 'ZH' ? '偏航警报 (Drift)' : 'Drift Alert'}</h3>
                     <p className="text-xs text-slate-500">{language === 'ZH' ? '全方位对齐监控' : 'Alignment Check'}</p>
                   </div>
                 </div>
                 <div className={`px-2 py-0.5 rounded text-[10px] font-mono border ${driftScore > 30 ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-emerald-500/10 border-emerald-500 text-emerald-500'}`}>
                    {driftScore}%
                 </div>
              </div>

              <div className="flex h-56">
                 <div className="w-full flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius="70%" data={[
                        { subject: language === 'ZH' ? '自由' : 'Freedom', A: driftGoals.freedom, B: driftActions.freedom },
                        { subject: language === 'ZH' ? '安全' : 'Security', A: driftGoals.security, B: driftActions.security },
                        { subject: language === 'ZH' ? '成长' : 'Growth', A: driftGoals.growth, B: driftActions.growth },
                        { subject: language === 'ZH' ? '舒适' : 'Comfort', A: driftGoals.comfort, B: driftActions.comfort },
                        { subject: language === 'ZH' ? '健康' : 'Health', A: driftGoals.health, B: driftActions.health },
                        { subject: language === 'ZH' ? '连接' : 'Connection', A: driftGoals.connection, B: driftActions.connection },
                      ]}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                         {/* Goals Layer */}
                        <Radar name="Intention" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} />
                        {/* Actions Layer */}
                        <Radar name="Action" dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                        <RechartsTooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
          </div>

          {/* Row 2: Serendipity (FULL WIDTH) */}
          
          {/* 2. Serendipity Engine (New Panel) - EXPANDED */}
          <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Sparkles size={24} /></div>
                <div>
                  <h3 className="font-bold text-2xl text-slate-200">{language === 'ZH' ? '好运发生器 (Serendipity Engine)' : 'Serendipity Engine'}</h3>
                  <p className="text-sm text-slate-500">{language === 'ZH' ? '运气 = (做 x 说) ^ 连接' : 'Luck = (Doing x Telling) ^ Connection'}</p>
                </div>
             </div>

             <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Heatmap Visualization - Larger */}
                <div className="w-full md:w-1/2 aspect-video flex justify-center">
                    <div className="aspect-square h-full grid grid-cols-10 grid-rows-10 gap-1 bg-slate-950 p-2 rounded-xl border border-slate-800 shadow-xl">
                       {luckGrid.map((cell, idx) => (
                          <div 
                            key={idx} 
                            className={`rounded-[2px] transition-all duration-300 ${cell.active ? 'shadow-[0_0_8px_rgba(234,179,8,0.4)] scale-100' : 'scale-95'}`}
                            style={{ 
                                backgroundColor: cell.active ? `rgba(234, 179, 8, ${cell.opacity})` : '#1e293b' 
                            }}
                          />
                       ))}
                    </div>
                </div>

                {/* Controls & Metrics - Expanded */}
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8">
                   <div className="flex items-baseline gap-4">
                       <div className="text-6xl font-black text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">{luckScore}</div>
                       <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">{language === 'ZH' ? '好运表面积积分' : 'Luck Surface Area Score'}</div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2 group">
                        <div className="flex justify-between text-slate-300 font-medium">
                            <span className="flex items-center gap-2"><Activity size={16} className="text-blue-500"/> {language === 'ZH' ? '行动 (Build)' : 'Build'} <span className="text-xs text-slate-500 font-normal">{language === 'ZH' ? '- 产出量' : '- Output Volume'}</span></span>
                            <span className="font-mono text-blue-400">{serendipityParams.doing}</span>
                        </div>
                        <input type="range" className="w-full h-3 bg-slate-800 rounded-full accent-blue-500 cursor-pointer shadow-inner" value={serendipityParams.doing} onChange={e=>setSerendipityParams({...serendipityParams, doing: parseInt(e.target.value)})} />
                      </div>
                      
                      <div className="space-y-2 group">
                        <div className="flex justify-between text-slate-300 font-medium">
                            <span className="flex items-center gap-2"><Globe size={16} className="text-green-500"/> {language === 'ZH' ? '传播 (Tell)' : 'Tell'} <span className="text-xs text-slate-500 font-normal">{language === 'ZH' ? '- 广播范围' : '- Broadcast Range'}</span></span>
                            <span className="font-mono text-green-400">{serendipityParams.telling}</span>
                        </div>
                        <input type="range" className="w-full h-3 bg-slate-800 rounded-full accent-green-500 cursor-pointer shadow-inner" value={serendipityParams.telling} onChange={e=>setSerendipityParams({...serendipityParams, telling: parseInt(e.target.value)})} />
                      </div>
                      
                      <div className="space-y-2 group">
                        <div className="flex justify-between text-slate-300 font-medium">
                            <span className="flex items-center gap-2"><Users size={16} className="text-purple-500"/> {language === 'ZH' ? '连接 (Connect)' : 'Connect'} <span className="text-xs text-slate-500 font-normal">{language === 'ZH' ? '- 网络密度' : '- Network Density'}</span></span>
                            <span className="font-mono text-purple-400">{serendipityParams.connecting}</span>
                        </div>
                        <input type="range" className="w-full h-3 bg-slate-800 rounded-full accent-purple-500 cursor-pointer shadow-inner" value={serendipityParams.connecting} onChange={e=>setSerendipityParams({...serendipityParams, connecting: parseInt(e.target.value)})} />
                      </div>
                   </div>
                   
                   <div className="p-4 bg-yellow-900/10 border border-yellow-500/10 rounded-xl text-xs text-yellow-200/60 italic">
                        {language === 'ZH' ? '“好运不是偶然，而是你与世界碰撞的次数。”' : '"Luck is not random, it is the number of times you collide with the world."'}
                   </div>
                </div>
             </div>
          </div>

          {/* Row 3: Butterfly (FULL WIDTH) */}

          {/* 4. Butterfly Effect V2 (Probability Cloud) */}
          <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><GitBranch size={20} /></div>
                 <div>
                   <h3 className="font-bold text-slate-200">{language === 'ZH' ? '概率云模拟 (Butterfly Effect)' : 'Probability Cloud Simulator'}</h3>
                   <p className="text-xs text-slate-500">{language === 'ZH' ? '调整决策参数，观察未来分布形态' : 'Adjust inputs to shape the future distribution curve'}</p>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-3/4 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={butterflyData}>
                              <defs>
                                  <linearGradient id="probGrad" x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="30%" stopColor="#ef4444" stopOpacity={0.5} /> {/* Ruin */}
                                      <stop offset="50%" stopColor="#94a3b8" stopOpacity={0.5} /> {/* Mediocre */}
                                      <stop offset="90%" stopColor="#10b981" stopOpacity={0.5} /> {/* Success */}
                                  </linearGradient>
                              </defs>
                              <XAxis dataKey="outcome" type="number" domain={['auto', 'auto']} tick={{fontSize:10, fill: '#64748b'}} />
                              <YAxis hide />
                              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1e293b" />
                              <ReferenceLine x={0} stroke="#475569" label="0" />
                              <Area type="monotone" dataKey="probability" stroke="none" fill="url(#probGrad)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>

                  <div className="w-full md:w-1/4 space-y-4 flex flex-col justify-center">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400"><span>{language === 'ZH' ? '杠杆率' : 'Leverage'}</span><span>{butterflyParams.leverage}%</span></div>
                              <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full accent-purple-500" value={butterflyParams.leverage} onChange={e=>setButterflyParams({...butterflyParams, leverage: parseInt(e.target.value)})}/>
                          </div>
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400"><span>{language === 'ZH' ? '波动性' : 'Volatility'}</span><span>{butterflyParams.volatility}%</span></div>
                              <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full accent-orange-500" value={butterflyParams.volatility} onChange={e=>setButterflyParams({...butterflyParams, volatility: parseInt(e.target.value)})}/>
                          </div>
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400"><span>{language === 'ZH' ? '进攻性 (Upside)' : 'Upside Seek'}</span><span>{butterflyParams.upsideSeek}%</span></div>
                              <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full accent-emerald-500" value={butterflyParams.upsideSeek} onChange={e=>setButterflyParams({...butterflyParams, upsideSeek: parseInt(e.target.value)})}/>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Row 4: Motivation & Regret (Split) */}

          {/* 5. Motivation Analyzer V2 (Authenticity) */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Heart size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-200">{language === 'ZH' ? '内驱力 (Motivation)' : 'Authenticity Analyzer'}</h3>
                  <p className="text-xs text-slate-500">{language === 'ZH' ? '恐惧 vs 爱' : 'Fear vs Love'}</p>
                </div>
             </div>

             <div className="flex items-center gap-4">
                 <div className="w-1/2 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={motivations} innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                                {motivations.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                            </Pie>
                            <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', fontSize: '12px'}} />
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="w-1/2 space-y-2 text-xs">
                    {motivations.map(m => (
                        <div key={m.name} className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: m.color}}></span>
                                <span className="truncate max-w-[100px]">{language === 'ZH' ? m.nameZh : m.name}</span>
                            </div>
                            <input 
                              type="range" className="w-full h-1 bg-slate-800 rounded-full accent-slate-400" 
                              value={m.value}
                              onChange={e => {
                                  const newVal = parseInt(e.target.value);
                                  setMotivations(prev => prev.map(p => p.name === m.name ? {...p, value: newVal} : p));
                              }}
                            />
                        </div>
                    ))}
                 </div>
             </div>
          </div>

          {/* 7. Regret Simulator (Timeline) */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><RotateCcw size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-200">{language === 'ZH' ? '遗憾时间轴 (Regret)' : 'Regret Timeline'}</h3>
                  <p className="text-xs text-slate-500">{language === 'ZH' ? '未来预演' : 'Future Preview'}</p>
                </div>
             </div>

             <div className="relative pt-6 pb-2">
                 <div className="absolute top-8 left-0 w-full h-1 bg-slate-800 rounded-full"></div>
                 <div className="flex justify-between relative z-10 mx-4">
                    {[
                        { age: 40, label: 'Health', labelZh: '健康', color: 'bg-red-500', score: 65 },
                        { age: 60, label: 'Career', labelZh: '事业', color: 'bg-amber-500', score: 45 },
                        { age: 80, label: 'Soul', labelZh: '灵魂', color: 'bg-slate-500', score: 15 }
                    ].map(p => (
                        <div key={p.age} 
                             onClick={() => setSimAge(p.age as any)}
                             className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${simAge === p.age ? 'scale-110 opacity-100' : 'opacity-50'}`}
                        >
                            <div className={`w-4 h-4 rounded-full ${p.color} border-4 border-slate-900 shadow-lg`}></div>
                            <div className="text-xs font-bold text-slate-300">{p.age}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{language === 'ZH' ? p.labelZh : p.label}</div>
                        </div>
                    ))}
                 </div>
                 
                 {/* Visual Data Feedback */}
                 <div className="mt-6 flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>{language === 'ZH' ? '人生满意度指数' : 'Life Satisfaction Index'}</span>
                        <span className="font-mono text-slate-200">
                            {simAge === 40 ? 65 : (simAge === 60 ? 45 : 15)}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ease-out ${simAge === 40 ? 'bg-red-500' : (simAge === 60 ? 'bg-amber-500' : 'bg-slate-500')}`}
                            style={{ width: `${simAge === 40 ? 65 : (simAge === 60 ? 45 : 15)}%` }}
                        ></div>
                    </div>
                 </div>

                 <div className="mt-4 p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs text-slate-300 italic text-center h-16 flex items-center justify-center">
                     {simAge === 40 && (language === 'ZH' ? "“以为身体永远扛得住，直到这张体检单。”" : "\"Thought I was invincible, until this diagnosis.\"")}
                     {simAge === 60 && (language === 'ZH' ? "“为了那点退休金，忍受了30年不爱的工作。”" : "\"Endured 30 years of a job I hated for safety.\"")}
                     {simAge === 80 && (language === 'ZH' ? "“我从没去过想去的地方，也从没爱过想爱的人。”" : "\"I never went where I wanted, never loved who I wanted.\"")}
                 </div>
             </div>
          </div>
          
          {/* Row 5: Life ROI (FULL WIDTH) */}

           {/* 6. Life ROI V2 (Bandwidth) - EXPANDED */}
           <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400"><Clock size={24} /></div>
                <div>
                  <h3 className="font-bold text-2xl text-slate-200">{language === 'ZH' ? '认知带宽 ROI (Cognitive Bandwidth)' : 'Cognitive Bandwidth ROI'}</h3>
                  <p className="text-sm text-slate-500">{language === 'ZH' ? '深度工作 vs 垃圾时间 vs 通勤损耗' : 'Deep Work vs Zombie Time vs Commute Waste'}</p>
                </div>
             </div>

             {/* Main Horizontal Bar - Bigger */}
             <div className="flex flex-col gap-6">
                 <div className="h-10 w-full flex rounded-xl overflow-hidden shadow-lg">
                     {bandwidthData.map(b => (
                         <div key={b.name} className="relative group hover:opacity-90 transition-opacity" style={{ width: `${(b.value/24)*100}%`, backgroundColor: b.color }}>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white drop-shadow-md whitespace-nowrap overflow-hidden">
                                {language === 'ZH' ? (b.name === 'Deep Work' ? '深度工作' : (b.name==='Zombie Work'?'垃圾时间':(b.name==='Commute'?'通勤':(b.name==='Sleep'?'睡眠':'自由')))) : b.name}: {b.value.toFixed(1)}h
                            </div>
                         </div>
                     ))}
                 </div>
                 
                 {/* Legend */}
                 <div className="flex justify-between px-2 pb-4 border-b border-slate-800">
                     {bandwidthData.map(b => (
                         <div key={b.name} className="flex items-center gap-2">
                             <span className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: b.color}}></span>
                             <span className="text-sm text-slate-300 font-medium">
                                 {(()=>{
                                   if (language === 'ZH') {
                                     switch(b.name) {
                                       case 'Sleep': return '睡眠';
                                       case 'Commute': return '通勤';
                                       case 'Zombie Work': return '垃圾时间';
                                       case 'Deep Work': return '深度工作';
                                       case 'Freedom': return '自由支配';
                                       default: return b.name;
                                     }
                                   }
                                   return b.name;
                                 })()}
                             </span>
                         </div>
                     ))}
                 </div>

                 {/* Expanded Controls */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center gap-6">
                         <div className="p-4 bg-red-900/20 rounded-full text-red-500">
                            <TrendingUp size={24} className="rotate-180" />
                         </div>
                         <div className="flex-1 space-y-2">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-slate-400 font-medium">{language === 'ZH' ? '通勤时间' : 'Commute Time'}</span>
                                 <span className="text-xl font-mono text-red-400">{roiParams.commuteTime}h</span>
                             </div>
                             <input type="range" min="0" max="6" step="0.5" className="w-full h-2 bg-slate-800 rounded-full accent-red-500 cursor-pointer" value={roiParams.commuteTime} onChange={e=>setRoiParams({...roiParams, commuteTime: parseFloat(e.target.value)})} />
                             <div className="text-xs text-slate-500">{language === 'ZH' ? '每天1小时 ≈ 生命的4%' : 'Every hour costs ~4% of your life'}</div>
                         </div>
                     </div>
                     
                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center gap-6">
                         <div className="p-4 bg-blue-900/20 rounded-full text-blue-500">
                            <Brain size={24} />
                         </div>
                         <div className="flex-1 space-y-2">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-slate-400 font-medium">{language === 'ZH' ? '深度工作率' : 'Deep Work Ratio'}</span>
                                 <span className="text-xl font-mono text-blue-400">{roiParams.deepWorkRatio}%</span>
                             </div>
                             <input type="range" min="0" max="80" step="5" className="w-full h-2 bg-slate-800 rounded-full accent-blue-500 cursor-pointer" value={roiParams.deepWorkRatio} onChange={e=>setRoiParams({...roiParams, deepWorkRatio: parseInt(e.target.value)})} />
                             <div className="text-xs text-slate-500">{language === 'ZH' ? '普通人峰值为 20% (约1.5小时)' : 'Most people peak at 20% (approx 1.5h/day)'}</div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>

          {/* Row 6: Leverage (FULL WIDTH) */}

          {/* 8. Fate Leverage (Calculator) */}
          <div className="xl:col-span-2 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
             
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                 <div className="flex-1">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-violet-500/20 rounded-lg text-violet-300"><Zap size={20} /></div>
                        <div>
                           <h3 className="font-bold text-white text-xl">{language === 'ZH' ? '杠杆计算器 (Leverage)' : 'Fate Leverage Calculator'}</h3>
                           <p className="text-violet-200/60 text-sm">{language === 'ZH' ? '计算你的当前人生杠杆倍数' : 'Calculate your current life multiplier'}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-4 max-w-md">
                         <div className="space-y-1">
                             <div className="flex justify-between text-xs text-violet-200"><span>{language === 'ZH' ? '城市能级' : 'City Tier'}</span><span>{leverageInputs.cityTier === 1 ? (language==='ZH'?'一线':'Tier 1') : (language==='ZH'?leverageInputs.cityTier+'线':'Tier '+leverageInputs.cityTier)}</span></div>
                             <input type="range" min="1" max="3" step="1" className="w-full h-1.5 bg-violet-900/50 rounded-full accent-fuchsia-400" value={leverageInputs.cityTier} onChange={e=>setLeverageInputs({...leverageInputs, cityTier: parseInt(e.target.value)})} />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-xs text-violet-200"><span>{language === 'ZH' ? '伴侣同频度' : 'Partner Alignment'}</span><span>{leverageInputs.partnerAlignment}%</span></div>
                             <input type="range" min="0" max="100" className="w-full h-1.5 bg-violet-900/50 rounded-full accent-fuchsia-400" value={leverageInputs.partnerAlignment} onChange={e=>setLeverageInputs({...leverageInputs, partnerAlignment: parseInt(e.target.value)})} />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-xs text-violet-200"><span>{language === 'ZH' ? '技能稀缺性' : 'Specialized Skill'}</span><span>{leverageInputs.specializedSkill}%</span></div>
                             <input type="range" min="0" max="100" className="w-full h-1.5 bg-violet-900/50 rounded-full accent-fuchsia-400" value={leverageInputs.specializedSkill} onChange={e=>setLeverageInputs({...leverageInputs, specializedSkill: parseInt(e.target.value)})} />
                         </div>
                     </div>
                 </div>

                 <div className="flex-shrink-0 text-center">
                     <div className="relative">
                         <div className="absolute inset-0 bg-violet-500/30 blur-3xl rounded-full animate-pulse"></div>
                         <div className="relative bg-black/40 backdrop-blur-md p-8 rounded-full border border-violet-500/50 w-48 h-48 flex flex-col items-center justify-center">
                             <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]">
                                 {leverageMultiplier}x
                             </div>
                             <div className="text-xs text-violet-300 font-bold uppercase tracking-widest mt-2">{language === 'ZH' ? '人生速率' : 'Velocity'}</div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>

       </div>
    </div>
  );
};

export default LifeControlPanel;
