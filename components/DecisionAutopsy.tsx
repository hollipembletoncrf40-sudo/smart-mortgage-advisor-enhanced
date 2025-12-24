import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle, Skull, Activity, TrendingDown, Thermometer, Brain, Play, FastForward, Pause, RotateCcw, Settings, ChevronDown, ChevronUp, DollarSign, Calendar, Percent, PiggyBank, Wallet, Heart, Flame, Zap, Gauge } from 'lucide-react';
import { BuyTargetParams } from '../types';
import { calculateAutopsyReport, simulateScenario, getFailureTimeline } from '../utils/autopsyCalculations';

interface DecisionAutopsyProps {
    params: BuyTargetParams;
    language: 'ZH' | 'EN';
    onParamChange?: (params: BuyTargetParams) => void;
}

// Reusable Slider Input Component
const ParamSlider = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 1, 
    unit = '', 
    icon: Icon,
    color = 'indigo'
}: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void; 
    min: number; 
    max: number; 
    step?: number; 
    unit?: string;
    icon?: any;
    color?: 'indigo' | 'rose' | 'amber' | 'emerald' | 'purple';
}) => {
    const colorClasses = {
        indigo: 'accent-indigo-500',
        rose: 'accent-rose-500',
        amber: 'accent-amber-500',
        emerald: 'accent-emerald-500',
        purple: 'accent-purple-500'
    };
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {label}
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{value.toLocaleString()}{unit}</span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step}
                value={value} 
                onChange={(e) => onChange(Number(e.target.value))}
                className={`w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer ${colorClasses[color]}`}
            />
        </div>
    );
};

const DecisionAutopsy: React.FC<DecisionAutopsyProps> = ({ params, language, onParamChange }) => {
    const report = useMemo(() => calculateAutopsyReport(params, language), [params, language]);
    const timeline = useMemo(() => getFailureTimeline(language), [language]);

    // Parameter Panel State
    const [showParams, setShowParams] = useState(true);

    const handleParamChange = (key: keyof BuyTargetParams, value: number) => {
        if (onParamChange) {
            onParamChange({ ...params, [key]: value });
        }
    };

    // Simulator State
    const [scenarios, setScenarios] = useState<string[]>([]);
    
    const toggleScenario = (id: string) => {
        setScenarios(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const simResult = useMemo(() => simulateScenario(params, scenarios), [params, scenarios]);

    // Replay State
    const [replayYear, setReplayYear] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    React.useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setReplayYear(prev => {
                    if (prev >= timeline.length - 1) {
                        setIsPlaying(false);
                        return prev; // Stop at last stage
                    }
                    return prev + 1;
                });
            }, 1500); // 1.5 sec per stage for better viewing
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeline.length]);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            
            {/* Parameter Control Panel */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <button 
                    onClick={() => setShowParams(!showParams)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {language === 'ZH' ? '💀 调整你的"死法"参数' : '💀 Adjust Your "Death" Parameters'}
                        </span>
                    </div>
                    {showParams ? <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                </button>
                
                {showParams && (
                    <div className="p-6 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            {/* Financial Params */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    {language === 'ZH' ? '财务参数' : 'Financial'}
                                </h4>
                                <ParamSlider 
                                    label={language === 'ZH' ? '目标房价' : 'Target Price'} 
                                    value={params.totalPrice} 
                                    onChange={(v) => handleParamChange('totalPrice', v)} 
                                    min={50} max={2000} step={10} unit={language === 'ZH' ? '万' : 'W'} 
                                    icon={DollarSign} color="emerald"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '首付比例' : 'Down Payment %'} 
                                    value={params.downPaymentRatio} 
                                    onChange={(v) => handleParamChange('downPaymentRatio', v)} 
                                    min={20} max={80} step={5} unit="%" 
                                    icon={Percent} color="emerald"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '月收入' : 'Monthly Income'} 
                                    value={params.monthlyIncome} 
                                    onChange={(v) => handleParamChange('monthlyIncome', v)} 
                                    min={5000} max={200000} step={1000} unit={language === 'ZH' ? '元' : ''} 
                                    icon={Wallet} color="emerald"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '月支出' : 'Monthly Expense'} 
                                    value={params.monthlyExpense} 
                                    onChange={(v) => handleParamChange('monthlyExpense', v)} 
                                    min={2000} max={100000} step={500} unit={language === 'ZH' ? '元' : ''} 
                                    icon={Wallet} color="amber"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '目前存款' : 'Current Savings'} 
                                    value={params.currentSavings} 
                                    onChange={(v) => handleParamChange('currentSavings', v)} 
                                    min={0} max={500} step={5} unit={language === 'ZH' ? '万' : 'W'} 
                                    icon={PiggyBank} color="emerald"
                                />
                            </div>

                            {/* Psychological Params */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Brain className="h-3.5 w-3.5" />
                                    {language === 'ZH' ? '心理参数' : 'Psychology'}
                                </h4>
                                <ParamSlider 
                                    label={language === 'ZH' ? '焦虑指数' : 'Anxiety Score'} 
                                    value={params.anxietyScore} 
                                    onChange={(v) => handleParamChange('anxietyScore', v)} 
                                    min={0} max={100} unit="" 
                                    icon={Heart} color="rose"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? 'FOMO 指数' : 'FOMO Score'} 
                                    value={params.fomoScore} 
                                    onChange={(v) => handleParamChange('fomoScore', v)} 
                                    min={0} max={100} unit="" 
                                    icon={Flame} color="rose"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '财务紧绷感' : 'Financial Stretch'} 
                                    value={params.financialStretch} 
                                    onChange={(v) => handleParamChange('financialStretch', v)} 
                                    min={0} max={100} unit="" 
                                    icon={Zap} color="amber"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '决策速度感' : 'Decision Speed'} 
                                    value={params.decisionSpeed} 
                                    onChange={(v) => handleParamChange('decisionSpeed', v)} 
                                    min={0} max={100} unit="" 
                                    icon={Gauge} color="purple"
                                />
                            </div>

                            {/* Market & Time Params */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="h-3.5 w-3.5" />
                                    {language === 'ZH' ? '市场参数' : 'Market'}
                                </h4>
                                <ParamSlider 
                                    label={language === 'ZH' ? '计划年限' : 'Plan Years'} 
                                    value={params.planYears} 
                                    onChange={(v) => handleParamChange('planYears', v)} 
                                    min={1} max={30} unit={language === 'ZH' ? '年' : 'Yrs'} 
                                    icon={Calendar} color="indigo"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '市场热度' : 'Market Heat'} 
                                    value={params.marketHeat} 
                                    onChange={(v) => handleParamChange('marketHeat', v)} 
                                    min={0} max={100} unit="" 
                                    icon={Thermometer} color="rose"
                                />
                                <ParamSlider 
                                    label={language === 'ZH' ? '父母资助' : 'Parental Support'} 
                                    value={params.parentalSupport || 0} 
                                    onChange={(v) => handleParamChange('parentalSupport', v)} 
                                    min={0} max={200} step={5} unit={language === 'ZH' ? '万' : 'W'} 
                                    icon={Heart} color="purple"
                                />
                                
                                {/* Summary Stats */}
                                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{language === 'ZH' ? '关键指标预览' : 'Key Metrics'}</div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{language === 'ZH' ? '月供估算:' : 'Est. Payment:'}</span>
                                            <span className="font-bold text-rose-600 dark:text-rose-400">
                                                {((params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045).toFixed(0)}{language === 'ZH' ? '元' : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{language === 'ZH' ? '月供/收入:' : 'DTI:'}</span>
                                            <span className={`font-bold ${((params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045 / params.monthlyIncome) > 0.5 ? 'text-rose-500' : 'text-emerald-400'}`}>
                                                {(((params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045 / params.monthlyIncome) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Header: The Grave */}
            <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-rose-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/30 rounded-3xl p-8 border border-rose-200 dark:border-rose-900/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-900/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2 relative z-10 text-rose-600 dark:text-rose-400">
                    <Skull className="h-8 w-8 text-rose-500 animate-pulse" />
                    {language === 'ZH' ? '决策尸检室' : 'Decision Autopsy'}
                    <Skull className="h-6 w-6 text-rose-600/50" />
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 relative z-10 italic">
                    {language === 'ZH' ? '"让你在做决定之前，就看到自己失败的样子。"' : '"See your failure before you make the decision."'}
                </p>

                {/* Dynamic Warning Quote Banner */}
                <div className="relative z-10 mb-8 p-4 bg-gradient-to-r from-rose-950/80 to-slate-950/80 rounded-xl border border-rose-800/50 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="text-xs text-amber-400/70 uppercase tracking-wider font-bold mb-1">
                                {language === 'ZH' ? '☠️ 死亡预警' : '☠️ DEATH WARNING'}
                            </div>
                            <p className="text-slate-200 text-sm font-medium leading-relaxed">
                                {(() => {
                                    const dti = (params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045 / params.monthlyIncome;
                                    if (dti > 0.6) return language === 'ZH' 
                                        ? '"如果你知道自己会怎么死，你就绝对不会走向那条路。" —— 查理·芒格' 
                                        : '"If you know how you die, you\'d never walk that path." — Charlie Munger';
                                    if (dti > 0.5) return language === 'ZH'
                                        ? '"房奴不是一种生活方式的选择，而是对未来自己的一次绑架。" —— 匿名购房者遗言'
                                        : '"Being house-poor isn\'t a lifestyle choice—it\'s holding your future self hostage." — Anonymous';
                                    if (params.fomoScore > 70) return language === 'ZH'
                                        ? '"当所有人都在买的时候，恰恰是你应该卖的时候。" —— 沃伦·巴菲特'
                                        : '"Be fearful when others are greedy." — Warren Buffett';
                                    if (params.marketHeat > 80) return language === 'ZH'
                                        ? '"在泡沫里，每个人都觉得自己是最后一个接棒的聪明人。" —— 罗伯特·席勒'
                                        : '"In a bubble, everyone thinks they\'re the last smart buyer." — Robert Shiller';
                                    return language === 'ZH'
                                        ? '"最大的风险不是市场下跌，而是你被迫在下跌时卖出。" —— 霍华德·马克斯'
                                        : '"The biggest risk isn\'t market decline—it\'s being forced to sell during one." — Howard Marks';
                                })()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    
                    {/* Death Certificate Card */}
                    <div className="bg-gradient-to-b from-slate-800 to-slate-950 text-white p-5 rounded-xl shadow-xl relative transform -rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-105 border border-amber-900/50">
                        <div className="absolute top-3 right-3 border-2 border-amber-500 text-amber-500 font-bold text-[10px] px-1.5 py-0.5 rounded uppercase rotate-12 opacity-80">
                            {language === 'ZH' ? '预判' : 'PREDICTED'}
                        </div>
                        <div className="text-center border-b border-amber-800/50 pb-3 mb-3">
                            <div className="text-3xl mb-1">💀</div>
                            <h3 className="text-xl font-serif font-black tracking-wider uppercase text-amber-400">
                                {language === 'ZH' ? '死亡证明' : 'DEATH CERT'}
                            </h3>
                        </div>
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">{language === 'ZH' ? '死因:' : 'Cause:'}</span>
                                <span className="font-bold text-rose-400 text-right text-[11px]">{report.deathCert.cause}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">{language === 'ZH' ? '死亡时间:' : 'Time:'}</span>
                                <span className="font-bold text-slate-200">{report.deathCert.timeOfDeath}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">{language === 'ZH' ? '诱因:' : 'Trigger:'}</span>
                                <span className="font-bold text-slate-200 text-right text-[11px]">{report.deathCert.trigger}</span>
                            </div>
                        </div>
                    </div>

                    {/* Autopsy Report Card */}
                    <div className="bg-gradient-to-b from-rose-950 to-slate-950 text-white p-5 rounded-xl shadow-xl relative transform rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-105 border border-rose-800/50">
                        <div className="absolute top-3 right-3 text-rose-500 text-xs font-bold uppercase tracking-wider opacity-70">
                            ⚠️ {language === 'ZH' ? '高危' : 'HIGH RISK'}
                        </div>
                        <div className="text-center border-b border-rose-800/50 pb-3 mb-3">
                            <div className="text-3xl mb-1">🩺</div>
                            <h3 className="text-xl font-serif font-black tracking-wider uppercase text-rose-400">
                                {language === 'ZH' ? '尸检报告' : 'AUTOPSY'}
                            </h3>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-rose-400">☠️</span>
                                <span className="text-slate-300">{language === 'ZH' ? '财务器官：严重受损' : 'Financial organs: Severely damaged'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-amber-400">⚡</span>
                                <span className="text-slate-300">{language === 'ZH' ? '决策神经：过度焦虑' : 'Decision nerves: Over-anxious'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400">🧠</span>
                                <span className="text-slate-300">{language === 'ZH' ? '理性皮层：被FOMO侵蚀' : 'Rational cortex: FOMO-eroded'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400">💔</span>
                                <span className="text-slate-300">{language === 'ZH' ? '心理承压：临界状态' : 'Mental capacity: Critical'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Epitaph Card */}
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-5 rounded-xl shadow-xl relative transform -rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-105 border border-slate-700">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🪦</div>
                            <h3 className="text-lg font-serif font-black tracking-wider uppercase text-slate-400 mb-3">
                                {language === 'ZH' ? '墓志铭' : 'EPITAPH'}
                            </h3>
                            <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700/50">
                                <p className="text-slate-300 text-sm italic leading-relaxed">
                                    {language === 'ZH' 
                                        ? '"这里长眠着一个曾以为房价只涨不跌的人"' 
                                        : '"Here lies one who thought prices only go up"'}
                                </p>
                                <p className="text-slate-500 text-xs mt-3 font-mono">
                                    {language === 'ZH' ? '—— 未来的你' : '—— Future You'}
                                </p>
                            </div>
                            <div className="flex justify-center gap-2 mt-4 text-2xl opacity-50">
                                <span>💀</span>
                                <span>⚰️</span>
                                <span>💀</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: Comprehensive Risk Dashboard */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Activity className="h-5 w-5 text-rose-400" />
                    {language === 'ZH' ? '💀 死亡风险仪表盘' : '💀 Death Risk Dashboard'}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* Death Risk Gauge */}
                    {(() => {
                        const dti = (params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045 / params.monthlyIncome;
                        const riskScore = Math.min(100, Math.round(dti * 100 + params.fomoScore * 0.3 + (100 - params.marketHeat) * 0.2));
                        const riskLevel = riskScore > 80 ? 'CRITICAL' : riskScore > 60 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW';
                        const riskColor = riskScore > 80 ? 'text-red-600 dark:text-red-500' : riskScore > 60 ? 'text-orange-600 dark:text-orange-500' : riskScore > 40 ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500';
                        const lightBg = riskScore > 80 ? 'from-red-100 to-red-50' : riskScore > 60 ? 'from-orange-100 to-orange-50' : riskScore > 40 ? 'from-amber-100 to-amber-50' : 'from-emerald-100 to-emerald-50';
                        const darkBg = riskScore > 80 ? 'dark:from-red-950/50 dark:to-slate-950' : riskScore > 60 ? 'dark:from-orange-950/50 dark:to-slate-950' : riskScore > 40 ? 'dark:from-amber-950/50 dark:to-slate-950' : 'dark:from-emerald-950/50 dark:to-slate-950';
                        const borderColor = riskScore > 80 ? 'border-red-200 dark:border-red-900/50' : riskScore > 60 ? 'border-orange-200 dark:border-orange-900/50' : riskScore > 40 ? 'border-amber-200 dark:border-amber-900/50' : 'border-emerald-200 dark:border-emerald-900/50';
                        
                        return (
                            <div className={`col-span-2 p-5 rounded-xl bg-gradient-to-br ${lightBg} ${darkBg} border ${borderColor}`}>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">{language === 'ZH' ? '综合死亡风险' : 'Overall Death Risk'}</div>
                                <div className="flex items-end gap-3">
                                    <span className={`text-5xl font-black ${riskColor}`}>{riskScore}</span>
                                    <span className="text-slate-500 text-sm mb-2">/ 100</span>
                                </div>
                                <div className={`text-xs font-bold mt-2 ${riskColor} uppercase tracking-widest`}>
                                    {language === 'ZH' ? (riskLevel === 'CRITICAL' ? '☠️ 极度危险' : riskLevel === 'HIGH' ? '⚠️ 高风险' : riskLevel === 'MEDIUM' ? '⚡ 中等风险' : '✅ 相对安全') : `☠️ ${riskLevel}`}
                                </div>
                                {/* Risk Bar */}
                                <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-700 ${riskScore > 80 ? 'bg-red-500' : riskScore > 60 ? 'bg-orange-500' : riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${riskScore}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })()}
                    
                    {/* Monthly Cash Flow Health */}
                    {(() => {
                        const monthlyPayment = (params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045;
                        const netCashFlow = params.monthlyIncome - params.monthlyExpense - monthlyPayment;
                        const isNegative = netCashFlow < 0;
                        
                        return (
                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{language === 'ZH' ? '月净现金流' : 'Net Cash Flow'}</div>
                                <div className={`text-2xl font-black ${isNegative ? 'text-red-500' : 'text-emerald-400'}`}>
                                    {isNegative ? '' : '+'}{netCashFlow.toFixed(0)}
                                </div>
                                <div className="text-xs text-slate-500">{language === 'ZH' ? '元/月' : '/month'}</div>
                                {isNegative && <div className="text-xs text-red-400 mt-1">☠️ {language === 'ZH' ? '入不敷出!' : 'Bleeding!'}</div>}
                            </div>
                        );
                    })()}
                    
                    {/* Survival Months */}
                    {(() => {
                        const monthlyPayment = (params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045;
                        const emergencyFund = params.currentSavings * 10000 - (params.totalPrice * params.downPaymentRatio / 100 * 10000);
                        const survivalMonths = emergencyFund > 0 ? Math.floor(emergencyFund / (params.monthlyExpense + monthlyPayment)) : 0;
                        
                        return (
                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{language === 'ZH' ? '断供生存月数' : 'Survival Months'}</div>
                                <div className={`text-2xl font-black ${survivalMonths < 3 ? 'text-red-500' : survivalMonths < 6 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {survivalMonths}
                                </div>
                                <div className="text-xs text-slate-500">{language === 'ZH' ? '个月' : 'months'}</div>
                                {survivalMonths < 3 && <div className="text-xs text-red-400 mt-1">☠️ {language === 'ZH' ? '极度脆弱!' : 'Extremely fragile!'}</div>}
                            </div>
                        );
                    })()}
                </div>

                {/* Financial Vital Signs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { 
                            label: language === 'ZH' ? '月供/收入比' : 'DTI Ratio',
                            value: ((params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045 / params.monthlyIncome * 100).toFixed(0) + '%',
                            danger: (params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045 / params.monthlyIncome > 0.5,
                            warning: (params.totalPrice * (100 - params.downPaymentRatio) / 100) * 10000 * 0.0045 / params.monthlyIncome > 0.35,
                            icon: '💳'
                        },
                        { 
                            label: language === 'ZH' ? '杠杆倍数' : 'Leverage',
                            value: (100 / params.downPaymentRatio).toFixed(1) + 'x',
                            danger: params.downPaymentRatio < 25,
                            warning: params.downPaymentRatio < 35,
                            icon: '⚖️'
                        },
                        { 
                            label: language === 'ZH' ? 'FOMO 程度' : 'FOMO Level',
                            value: params.fomoScore + '',
                            danger: params.fomoScore > 80,
                            warning: params.fomoScore > 60,
                            icon: '🔥'
                        },
                        { 
                            label: language === 'ZH' ? '市场风险' : 'Market Risk',
                            value: (100 - params.marketHeat) + '',
                            danger: params.marketHeat > 85,
                            warning: params.marketHeat > 70,
                            icon: '📉'
                        },
                    ].map((metric, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${metric.danger ? 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800/50' : metric.warning ? 'bg-amber-100 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/50' : 'bg-slate-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50'}`}>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                                <span>{metric.icon}</span>
                                {metric.label}
                            </div>
                            <div className={`text-lg font-black ${metric.danger ? 'text-red-600 dark:text-red-400' : metric.warning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Failure Heatmap */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <Thermometer className="h-5 w-5" />
                        {language === 'ZH' ? '如果我错了，错在哪？' : 'Top Failure Causes'}
                    </h3>
                    <div className="space-y-3">
                        {report.reasons.map(reason => (
                            <div key={reason.id} className="group">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-sm font-bold ${reason.severity === 'fatal' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {reason.title}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">{reason.probability}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${reason.severity === 'fatal' ? 'bg-red-500' : reason.severity === 'critical' ? 'bg-orange-500' : 'bg-yellow-500'}`} 
                                        style={{ width: `${reason.probability}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {reason.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Assumption Collapse Simulator */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <Activity className="h-5 w-5" />
                        {language === 'ZH' ? '假设崩塌模拟器' : 'Assumption Collapse Sim'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {[
                            { id: 'income_drop', labelZH: '收入 -10%', labelEN: 'Income -10%' },
                            { id: 'price_flat', labelZH: '房价不涨', labelEN: 'Price Flat' },
                            { id: 'rate_hike', labelZH: '利率 +1%', labelEN: 'Rate +1%' },
                            { id: 'expense_hike', labelZH: '支出 +20%', labelEN: 'Expense +20%' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => toggleScenario(opt.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${scenarios.includes(opt.id) ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                            >
                                {language === 'ZH' ? opt.labelZH : opt.labelEN}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className={`p-4 rounded-xl border-2 transition-all ${simResult.assets < 100 ? 'border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                            <div className="text-xs text-slate-500 mb-1">{language === 'ZH' ? '资产' : 'Assets'}</div>
                            <div className={`text-xl font-black ${simResult.assets < 100 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>{simResult.assets}%</div>
                        </div>
                         <div className={`p-4 rounded-xl border-2 transition-all ${simResult.cashFlow < 100 ? 'border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                            <div className="text-xs text-slate-500 mb-1">{language === 'ZH' ? '现金流' : 'Cash Flow'}</div>
                            <div className={`text-xl font-black ${simResult.cashFlow < 100 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>{simResult.cashFlow}%</div>
                        </div>
                         <div className={`p-4 rounded-xl border-2 transition-all ${simResult.freedom < 100 ? 'border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                            <div className="text-xs text-slate-500 mb-1">{language === 'ZH' ? '自由度' : 'Freedom'}</div>
                            <div className={`text-xl font-black ${simResult.freedom < 100 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>{simResult.freedom}%</div>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-center text-slate-400 italic">
                        {language === 'ZH' ? '“你不是输给市场，你是输给一个被打破的前提。”' : '"You lose not to the market, but to a broken premise."'}
                    </div>
                </div>
            </div>

            {/* 3. Failure Replay - Card Based */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <TrendingDown className="h-5 w-5 text-rose-500" />
                        {language === 'ZH' ? '🎬 翻车路径回放' : '🎬 Failure Replay'}
                    </h3>
                    <button 
                        onClick={() => {
                            if (replayYear >= timeline.length) setReplayYear(0);
                            setIsPlaying(!isPlaying);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-rose-500/30"
                    >
                        {isPlaying ? <Pause className="h-4 w-4" /> : (replayYear >= timeline.length ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />)}
                        {isPlaying ? (language === 'ZH' ? '暂停' : 'Pause') : (replayYear >= timeline.length ? (language === 'ZH' ? '重播' : 'Replay') : (language === 'ZH' ? '播放' : 'Play'))}
                    </button>
                </div>
                
                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {timeline.map((event, idx) => {
                        const isActive = replayYear >= idx;
                        const isCurrent = replayYear === idx;
                        const colors = {
                            normal: { bg: 'bg-slate-100 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400', icon: '📝' },
                            warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/50', text: 'text-amber-600 dark:text-amber-400', icon: '⚠️' },
                            critical: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800/50', text: 'text-orange-600 dark:text-orange-400', icon: '🔥' },
                            fatal: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800/50', text: 'text-red-600 dark:text-red-400', icon: '💀' }
                        };
                        const color = colors[event.type as keyof typeof colors] || colors.normal;
                        
                        return (
                            <div 
                                key={event.year}
                                className={`relative p-5 rounded-2xl border-2 transition-all duration-700 ease-out transform
                                    ${isActive ? color.bg : 'bg-slate-100/50 dark:bg-slate-800/20'}
                                    ${isActive ? color.border : 'border-slate-200/50 dark:border-slate-700/30'}
                                    ${isCurrent ? 'scale-105 shadow-xl ring-2 ring-rose-400 ring-offset-2 dark:ring-offset-slate-900' : isActive ? 'shadow-md' : 'opacity-50'}
                                    ${isActive ? 'translate-y-0' : 'translate-y-2'}
                                `}
                                style={{ 
                                    transitionDelay: `${idx * 100}ms`,
                                    animationDelay: `${idx * 150}ms`
                                }}
                            >
                                {/* Year Badge */}
                                <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold transition-all duration-500
                                    ${isActive ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
                                `}>
                                    {language === 'ZH' ? `第${event.year}年` : `Year ${event.year}`}
                                </div>
                                
                                {/* Icon */}
                                <div className={`text-3xl mb-3 mt-2 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-75'}`}>
                                    {color.icon}
                                </div>
                                
                                {/* Title */}
                                <h4 className={`font-bold mb-2 transition-all duration-500 ${isActive ? color.text : 'text-slate-400'}`}>
                                    {event.title}
                                </h4>
                                
                                {/* Description */}
                                <p className={`text-xs leading-relaxed transition-all duration-500 ${isActive ? 'text-slate-600 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                    {event.description}
                                </p>
                                
                                {/* Irreversible Badge */}
                                {event.isIrreversible && isActive && (
                                    <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full animate-pulse">
                                        <AlertTriangle className="h-3 w-3" />
                                        {language === 'ZH' ? '不可逆' : 'No Return'}
                                    </div>
                                )}
                                
                                {/* Progress Line */}
                                {idx < timeline.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-4 h-0.5 z-10">
                                        <div className={`h-full transition-all duration-700 ${isActive && replayYear > idx ? 'bg-rose-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="mt-6 relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="absolute h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(replayYear / (timeline.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Conclusion Cards - Show after reaching the end */}
                {replayYear >= timeline.length - 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 animate-fade-in">
                        {/* Reflection Card */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800/50 shadow-lg transform transition-all duration-700 hover:scale-[1.02]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-4xl">🤔</div>
                                <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                                    {language === 'ZH' ? '看完后，你现在的想法是？' : 'What are you thinking now?'}
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-800/50 rounded-xl">
                                    <span className="text-xl">😰</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ZH' ? '"这30年的轨迹太真实了，我需要重新考虑..."' : '"This 30-year trajectory is too real. I need to reconsider..."'}
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-800/50 rounded-xl">
                                    <span className="text-xl">💪</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ZH' ? '"我的情况不同，我有信心控制风险！"' : '"My situation is different. I\'m confident I can manage the risks!"'}
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-800/50 rounded-xl">
                                    <span className="text-xl">🧘</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ZH' ? '"也许租房才是现阶段最明智的选择..."' : '"Maybe renting is the wisest choice at this stage..."'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations Card */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800/50 shadow-lg transform transition-all duration-700 hover:scale-[1.02]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-4xl">💡</div>
                                <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                    {language === 'ZH' ? '理性建议' : 'Rational Advice'}
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ZH' ? '月供不超过收入的30%，留足应急缓冲。' : 'Keep mortgage under 30% of income. Maintain emergency buffer.'}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ZH' ? '确保有6-12个月生活费的紧急储备金。' : 'Ensure 6-12 months of living expenses as emergency fund.'}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ZH' ? '不要因为FOMO冲动决策，逆势才是机会。' : 'Avoid FOMO-driven decisions. Opportunity lies in going against the crowd.'}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">4</div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ZH' ? '考虑机会成本：这笔钱投资其他地方会怎样？' : 'Consider opportunity cost: What if this money was invested elsewhere?'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-center">
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                    {language === 'ZH' ? '🏠 买房不是人生终点，好的生活才是！' : '🏠 Buying a house isn\'t life\'s goal—living well is!'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Regret & Bias */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Regret Curve */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-200">
                        {language === 'ZH' ? '后悔峰值曲线' : 'Regret Peak Curve'}
                    </h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={report.regretData}>
                                <defs>
                                    <linearGradient id="colorRegret" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorRegret)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-slate-400 mt-2">
                        {language === 'ZH' ? '预警：第3-5年是“想骂自己”的高峰期' : 'Warning: Regret peaks at Year 3-5'}
                    </p>
                </div>

                {/* Cognitive Bias */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Brain className="h-5 w-5" />
                            {language === 'ZH' ? '认知偏差仪表盘' : 'Cognitive Bias'}
                        </h3>
                        <div className="text-right">
                            <div className="text-xs text-slate-400 font-medium mb-0.5">{language === 'ZH' ? '不可信指数' : 'Unreliable Score'}</div>
                            <div className="text-2xl font-black text-rose-500 leading-none">{report.unreliabilityScore}</div>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={report.biasMetrics}>
                                <defs>
                                    <linearGradient id="colorBias" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.2}/>
                                    </linearGradient>
                                </defs>
                                <PolarGrid stroke="#e2e8f0" strokeOpacity={0.2} />
                                <PolarAngleAxis 
                                    dataKey="name" 
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                                />
                                <PolarRadiusAxis 
                                    angle={30} 
                                    domain={[0, 100]} 
                                    tick={false}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Radar 
                                    name="Bias" 
                                    dataKey="score" 
                                    stroke="#6366f1" 
                                    strokeWidth={2}
                                    fill="url(#colorBias)" 
                                    fillOpacity={0.6} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                    }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecisionAutopsy;
