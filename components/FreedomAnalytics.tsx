import React, { useState } from 'react';
import { BuyTargetParams } from '../types';
import { calculateDetailedFreedomMetrics, FreedomParams } from '../utils/freedomCalculations';
import { 
    Unlock, Lock, AlertTriangle, TrendingDown, 
    RefreshCw, Zap, Wind, Anchor, 
    Activity, ShieldAlert, HeartPulse, Scale,
    Briefcase, Globe, Skull, ChevronDown, ChevronUp,
    Settings, Users, Target, Brain, TrendingUp
} from 'lucide-react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    LineChart, Line, CartesianGrid, Legend
} from 'recharts';

interface FreedomAnalyticsProps {
    params: BuyTargetParams;
    language: 'ZH' | 'EN';
}

const FreedomAnalytics: React.FC<FreedomAnalyticsProps> = ({ params, language }) => {
    const [freedomParams, setFreedomParams] = useState<FreedomParams>({
        careerMobility: 50,
        familyDependency: 50,
        cityTierDiff: 'SAME',
        riskTolerance: 'MODERATE',
        opportunityCostRate: 4,
        expectedSalaryGrowth: 3,
        industryVolatility: 30, // New default
        healthScore: 80 // New default
    });

    const [showParams, setShowParams] = useState(false);

    const metrics = calculateDetailedFreedomMetrics(params, freedomParams, language);

    const updateParam = (key: keyof FreedomParams, value: any) => {
        setFreedomParams(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6 animate-fade-in p-2 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-indigo-500/30 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100 dark:bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black flex items-center gap-3 mb-2">
                        <Wind className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        {language === 'ZH' ? '未来自由度罗盘 (Pro)' : 'Freedom Compass (Pro)'}
                    </h2>
                    <p className="text-slate-500 dark:text-indigo-200/80 max-w-2xl text-sm leading-relaxed">
                        {language === 'ZH' 
                            ? '不仅是算账，更是量化你为这套房子让渡的人生可能性。真正的自由，是随时可以说“不”的能力。' 
                            : 'Quantify the life possibilities traded for this property. True freedom is the ability to say "NO" at any time.'}
                    </p>
                </div>
            </div>

            {/* Parameter Control Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-all duration-300">
                <button 
                    onClick={() => setShowParams(!showParams)}
                    className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                        <Settings className="h-5 w-5 text-indigo-500" />
                        {language === 'ZH' ? '调整你的人生参数' : 'Adjust Life Parameters'}
                    </div>
                    {showParams ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                
                {showParams && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-800 animate-fade-in-down">
                        {/* Career Mobility */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {language === 'ZH' ? '职场流动性' : 'Career Mobility'}
                            </label>
                            <input 
                                type="range" min="0" max="100" 
                                value={freedomParams.careerMobility}
                                onChange={(e) => updateParam('careerMobility', Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{language === 'ZH' ? '很难跳槽' : 'Risk Averse'}</span>
                                <span className="text-indigo-500 font-bold">{freedomParams.careerMobility}</span>
                                <span>{language === 'ZH' ? '行业顶流' : 'Super Star'}</span>
                            </div>
                        </div>

                        {/* Family Dependency */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {language === 'ZH' ? '家庭依赖度' : 'Family Burden'}
                            </label>
                            <input 
                                type="range" min="0" max="100" 
                                value={freedomParams.familyDependency}
                                onChange={(e) => updateParam('familyDependency', Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{language === 'ZH' ? '一人吃饱' : 'Solo'}</span>
                                <span className="text-indigo-500 font-bold">{freedomParams.familyDependency}</span>
                                <span>{language === 'ZH' ? '全家支柱' : 'Support Heavy'}</span>
                            </div>
                        </div>

                        {/* Industry Volatility (New) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {language === 'ZH' ? '行业震荡指数' : 'Industry Volatility'}
                            </label>
                            <input 
                                type="range" min="0" max="100" 
                                value={freedomParams.industryVolatility}
                                onChange={(e) => updateParam('industryVolatility', Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{language === 'ZH' ? '铁饭碗' : 'Stable'}</span>
                                <span className="text-rose-500 font-bold">{freedomParams.industryVolatility}</span>
                                <span>{language === 'ZH' ? '高危裁员' : 'Volatile'}</span>
                            </div>
                        </div>

                        {/* Health Score (New) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                <HeartPulse className="h-3 w-3" />
                                {language === 'ZH' ? '身心健康值' : 'Health Score'}
                            </label>
                            <input 
                                type="range" min="0" max="100" 
                                value={freedomParams.healthScore}
                                onChange={(e) => updateParam('healthScore', Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{language === 'ZH' ? '过劳燃尽' : 'Burnout'}</span>
                                <span className="text-emerald-500 font-bold">{freedomParams.healthScore}</span>
                                <span>{language === 'ZH' ? '元气满满' : 'Peak'}</span>
                            </div>
                        </div>

                        {/* Risk Tolerance */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Brain className="h-3 w-3" />
                                {language === 'ZH' ? '风险偏好' : 'Risk Tolerance'}
                            </label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                {['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => updateParam('riskTolerance', opt)}
                                        className={`flex-1 py-1.5 text-xs rounded-md transition-all font-medium ${freedomParams.riskTolerance === opt ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        {opt === 'CONSERVATIVE' 
                                            ? (language === 'ZH' ? '保守' : 'Safe') 
                                            : opt === 'MODERATE' 
                                                ? (language === 'ZH' ? '稳健' : 'Mid') 
                                                : (language === 'ZH' ? '激进' : 'YOLO')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Investment Yield */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {language === 'ZH' ? '理财收益率' : 'Invest Yield'}
                            </label>
                             <div className="flex items-center gap-3">
                                <input 
                                    type="range" min="1" max="15" step="0.5"
                                    value={freedomParams.opportunityCostRate}
                                    onChange={(e) => updateParam('opportunityCostRate', Number(e.target.value))}
                                    className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 w-12 text-right">{freedomParams.opportunityCostRate}%</span>
                             </div>
                        </div>

                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* 1. Life Friction Index */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '人生摩擦系数' : 'Life Friction Index'}
                            </div>
                            <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
                                {metrics.friction.score}<span className="text-sm font-normal text-slate-400">/ 100</span>
                            </h3>
                            <div className="text-xs text-rose-500 font-bold mt-1 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded inline-block">
                                {metrics.friction.interpretation}
                            </div>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                            <Anchor className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        {/* Detail Bars */}
                        {[
                            { label: language === 'ZH' ? '换城市成本' : 'Relocation Cost', val: metrics.friction.details.relocationCost / 2000, max: 100, color: 'bg-slate-400' },
                            { label: language === 'ZH' ? '卖房时间' : 'Time to Sell', val: metrics.friction.details.timeCost * 8, max: 100, color: 'bg-orange-400' },
                            { label: language === 'ZH' ? '人脉折损' : 'Network Loss', val: metrics.friction.details.networkLoss, max: 100, color: 'bg-indigo-400' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">{item.label}</span>
                                    {i === 1 && <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{metrics.friction.details.timeCost} {language === 'ZH' ? '个月' : 'Mos'}</span>}
                                </div>
                                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(100, item.val)}%` }} />
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="text-xs text-slate-400">{language === 'ZH' ? '交易摩擦成本' : 'Transaction Fee'}</div>
                            <div className="text-lg font-bold text-rose-600 dark:text-rose-500">
                                -{(metrics.friction.details.transactionCost / 10000).toFixed(1)} W
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Default Impact Detailed */}
                <div className={`rounded-2xl border p-6 shadow-lg relative overflow-hidden transition-all
                    ${metrics.defaultImpact.score > 80 ? 'bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900 border-red-200 dark:border-red-900/50' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}
                `}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '断供毁灭指数' : 'Default Destruction'}
                            </div>
                            <h3 className={`text-4xl font-black ${metrics.defaultImpact.score > 80 ? 'text-red-600 dark:text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>
                                -{metrics.defaultImpact.score}<span className="text-sm font-normal text-slate-400 ml-1">lvl</span>
                            </h3>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                            <Skull className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl text-center border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 mb-1">{language === 'ZH' ? '信用修复期' : 'Credit Repair'}</div>
                            <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{metrics.defaultImpact.creditRepairYears} <span className="text-xs font-normal">Years</span></div>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl text-center border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 mb-1">{language === 'ZH' ? '职业污点' : 'Career Stain'}</div>
                            <div className={`text-xl font-bold ${metrics.defaultImpact.careerDamageScore > 50 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                {metrics.defaultImpact.careerDamageScore}
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-start gap-2">
                        <TrendingDown className="h-4 w-4 shrink-0 mt-0.5" />
                        {language === 'ZH' 
                            ? '不仅是失去房子，你的征信记录、社会评价和精神状态将受到长期且不可逆的冲击。' 
                            : 'Default is not just losing a house. It causes long-term irreversible damage to credit and social status.'}
                    </div>
                </div>

                {/* 3. Life Reboot (Radar Chart) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg row-span-2 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '人生可重启性' : 'Life Reboot'}
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                                    {metrics.reboot.score}
                                </h3>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <RefreshCw className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="flex-1 min-h-[250px] relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metrics.reboot.radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Me"
                                    dataKey="A"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="#10b981"
                                    fillOpacity={0.3}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#059669', fontWeight: 'bold' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                            <div className="text-xs text-slate-400 mb-1">{language === 'ZH' ? '生存续航' : 'Runway'}</div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">{metrics.reboot.liquidRunway} <span className="text-xs font-normal">Mos</span></div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                            <div className="text-xs text-slate-400 mb-1">{language === 'ZH' ? '技能通用性' : 'Skill Transfer'}</div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">{metrics.reboot.skillTransferability}%</div>
                        </div>
                    </div>
                </div>

                {/* 4. Path Lock-in Index */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '路径锁死指数' : 'Path Lock-in Index'}
                            </div>
                            <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">
                                {metrics.lockIn.score}<span className="text-sm font-normal text-slate-400 ml-1">%</span>
                            </h3>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                            <Lock className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {metrics.lockIn.lostPaths.map((path, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                path.status === 'LOCKED' 
                                    ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60' 
                                    : path.status === 'RISKY'
                                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
                                    : 'bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-700'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${path.status === 'LOCKED' ? 'bg-slate-400' : path.status === 'RISKY' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <span className={`text-sm font-medium ${path.status === 'LOCKED' ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {path.name}
                                    </span>
                                </div>
                                {path.status === 'LOCKED' && <Lock className="h-4 w-4 text-slate-400" />}
                                {path.status === 'RISKY' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                                {path.status === 'OPEN' && <Unlock className="h-4 w-4 text-emerald-500" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Illusion vs Real */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                         <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '纸面富贵 vs 真实自由' : 'Illusion vs Real'}
                            </div>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                            <Scale className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-8 mt-2">
                        <div className="relative">
                            <div className="flex justify-between text-sm mb-2 font-bold text-indigo-600 dark:text-indigo-400">
                                <span>{language === 'ZH' ? '真实自由 (现金流)' : 'Real (Cash Flow)'}</span>
                                <span>{metrics.illusion.realScore}</span>
                            </div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${metrics.illusion.realScore}%` }} />
                            </div>
                            <div className="text-xs text-slate-400 mt-1 max-w-xs">{language === 'ZH' ? '你可以自由支配的真金白银。' : 'Money you can clearly spend.'}</div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between text-sm mb-2 font-bold text-purple-500">
                                <span>{language === 'ZH' ? '幻觉自由 (资产泡沫)' : 'Illusion (Asset)'}</span>
                                <span>{metrics.illusion.illusionScore}</span>
                            </div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500/50 border border-purple-400 border-dashed rounded-full transition-all duration-1000" style={{ width: `${metrics.illusion.illusionScore}%` }} />
                            </div>
                            <div className="text-xs text-slate-400 mt-1 max-w-xs">{language === 'ZH' ? '房价下跌时会瞬间蒸发的部分。' : 'Evaporates when prices drop.'}</div>
                        </div>
                    </div>
                </div>

                {/* 6. Mental Bandwidth (New) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '心力带宽' : 'Mental Bandwidth'}
                            </div>
                            <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">
                                {metrics.mental.score}<span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl ${metrics.mental.score > 60 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                            <Brain className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Stress Level Bar */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500 font-bold">{language === 'ZH' ? '精神内耗指数' : 'Stress Level'}</span>
                                <span className={`font-bold ${metrics.mental.stressLevel > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{metrics.mental.stressLevel}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${metrics.mental.stressLevel > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                    style={{ width: `${metrics.mental.stressLevel}%` }} 
                                />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                {metrics.mental.stressLevel > 50 
                                    ? (language === 'ZH' ? '高负债与行业波动正在吞噬你的注意力。' : 'High debt & volatility are consuming your mind.') 
                                    : (language === 'ZH' ? '心态平稳，不仅有钱还有闲心。' : 'Calm mind, ready for challenges.')}
                            </div>
                        </div>

                        {/* Sleep Quality Indicator */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-indigo-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{language === 'ZH' ? '睡眠质量预估' : 'Sleep Quality'}</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div key={star} className={`w-2 h-6 rounded-sm ${star <= metrics.mental.sleepQuality / 20 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Opportunity Absorption */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '机会接纳能力' : 'Opportunity Absorption'}
                            </div>
                            <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">
                                {metrics.opportunity.score}<span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
                            </h3>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                            <Zap className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-1 rounded-full bg-indigo-500"></div>
                            <div>
                                <div className="text-xs text-slate-500">{language === 'ZH' ? '可承受最大降薪' : 'Max Pay Cut'}</div>
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {metrics.opportunity.absorptionCapacity}%
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-500 font-bold uppercase">{language === 'ZH' ? '行动窗口期' : 'Action Window'}</span>
                                <span className="text-xs font-mono bg-white dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                                    {metrics.opportunity.actionWindow} {language === 'ZH' ? '个月' : 'Mos'}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500" 
                                    style={{ width: `${Math.min(100, metrics.opportunity.actionWindow * 4)}%` }} // 25 months visualized as full
                                />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-2">
                                {language === 'ZH' ? '你可以0收入寻找新机会的时间。' : 'Time you can survive with 0 income.'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8. Anti-Fragility Index (New) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '反脆弱指数' : 'Anti-Fragility'}
                            </div>
                            
                            <h3 className={`text-4xl font-black ${metrics.antiFragility.score > 70 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                {metrics.antiFragility.score}<span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl ${metrics.antiFragility.score > 70 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-4 relative">
                        {/* Concept visualization */}
                        <div className="flex justify-between items-end h-24 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                            <div className="w-12 text-center text-xs text-slate-400 flex flex-col items-center gap-1 group">
                                <div className="w-full bg-emerald-500/20 rounded-t-lg relative group-hover:bg-emerald-500/30 transition-colors" style={{ height: `${metrics.antiFragility.resilienceScore}%` }}>
                                    <div className="absolute inset-0 border-t border-x border-emerald-500/50 rounded-t-lg"></div>
                                </div>
                                <span>{language === 'ZH' ? '韧性' : 'Resilience'}</span>
                            </div>
                            
                            <div className="text-xl font-bold text-slate-300 mb-6">VS</div>

                            <div className="w-12 text-center text-xs text-slate-400 flex flex-col items-center gap-1 group">
                                <div className="w-full bg-rose-500/20 rounded-t-lg relative group-hover:bg-rose-500/30 transition-colors" style={{ height: `${metrics.antiFragility.stressExposure}%` }}>
                                    <div className="absolute inset-0 border-t border-x border-rose-500/50 rounded-t-lg"></div>
                                </div>
                                <span>{language === 'ZH' ? '暴露' : 'Exposure'}</span>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg leading-relaxed">
                            {metrics.antiFragility.score > 60 
                                ? (language === 'ZH' ? '✅ 你从无序中获益。高流动性让你在危机中可以抄底，而不是被清算。' : 'You gain from disorder. High liquidity allows you to buy the dip.') 
                                : (language === 'ZH' ? '⚠️ 结构脆弱。任何黑天鹅事件（失业、生病、房价暴跌）都可能击穿你的防线。' : 'Fragile structure. Any black swan event could breach your defense.')}
                        </div>
                    </div>
                </div>

                {/* 7. New Freedom Trajectory Line Chart */}
                <div className="col-span-1 lg:col-span-2 xl:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {language === 'ZH' ? '自由度复苏曲线 (30年预测)' : 'Freedom Recovery Curve (30Y)'}
                            </div>
                             <p className="text-sm text-slate-500 max-w-2xl">
                                {language === 'ZH' 
                                    ? '这是你选择买房 vs 租房理财的未来自由度走势。买房前期自由度极低，30年后拥有一套资产；租房则一直在积累流动性。' 
                                    : 'Forecast of your freedom score. Buying dips low initially but builds equity. Renting keeps high liquidity.'}
                            </p>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.trajectory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="year" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                    tickFormatter={(val) => `Y${val}`}
                                />
                                <YAxis 
                                    hide 
                                    domain={[0, 100]} 
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line 
                                    type="monotone" 
                                    dataKey="freedomScoreBuy" 
                                    name={language === 'ZH' ? '买房 (Buy)' : 'Buy'}
                                    stroke="#6366f1" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#6366f1' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="freedomScoreRent" 
                                    name={language === 'ZH' ? '租房+理财 (Rent & Invest)' : 'Rent & Invest'} 
                                    stroke="#10b981" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#10b981' }}
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FreedomAnalytics;
