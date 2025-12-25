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
    
    // Reflection Modal State
    const [selectedReflection, setSelectedReflection] = useState<'reconsider' | 'confident' | 'rent' | null>(null);
    
    // Reflection content data
    const reflectionContent = {
        reconsider: {
            emoji: '😰',
            titleZH: '重新审视你的决定',
            titleEN: 'Reconsidering Your Decision',
            contentZH: '你的担忧是正确的。30年的房贷不仅仅是一个财务承诺，更是对你生活方式的深刻影响。研究表明，过高的月供压力会导致生活质量下降、职业选择受限、甚至影响家庭关系。建议你花更多时间重新评估：你的收入是否稳定？是否有足够的应急储备？你对未来5年的职业规划是什么？不要因为"别人都在买"就仓促做出决定。记住，房子不是人生的唯一归宿，安心的生活才是。给自己3-6个月的冷静期，再做决定也不迟。',
            contentEN: 'Your concerns are valid. A 30-year mortgage is not just a financial commitment—it profoundly affects your lifestyle. Studies show that excessive mortgage pressure leads to decreased quality of life, limited career choices, and even strained family relationships. Take time to reassess: Is your income stable? Do you have enough emergency reserves? What are your career plans for the next 5 years? Don\'t rush just because "everyone is buying." Remember, a house isn\'t life\'s only destination—a peaceful life is. Give yourself 3-6 months to cool down before deciding.',
            adviceZH: ['📊 重新计算月供占收入比例，确保不超过30%', '💰 确保有至少12个月的应急储备金', '🔄 考虑租房观望6-12个月再决定', '💬 与家人深入讨论财务压力的承受能力'],
            adviceEN: ['📊 Recalculate mortgage-to-income ratio, keep under 30%', '💰 Ensure at least 12 months emergency fund', '🔄 Consider renting for 6-12 months before deciding', '💬 Discuss financial stress tolerance with family']
        },
        confident: {
            emoji: '💪',
            titleZH: '自信者的风险盲点',
            titleEN: 'Risk Blindspots of the Confident',
            contentZH: '自信是好事，但过度自信是投资者最常见的陷阱之一。心理学家称之为"过度自信偏差"——人们普遍高估自己预测未来的能力。你说你的情况不同，但请思考：是什么让你觉得自己能逃脱统计规律？历史上99%自信能控制风险的人，最终都踩过坑。这不是说你一定会失败，而是提醒你：做好最坏打算，准备好Plan B。如果房价下跌20%，你还能承受吗？如果收入减少30%呢？如果利率上涨2%呢？真正的自信不是盲目乐观，而是在充分准备后的从容。',
            contentEN: 'Confidence is good, but overconfidence is one of the most common traps for investors. Psychologists call it "overconfidence bias"—people consistently overestimate their ability to predict the future. You say your situation is different, but consider: What makes you think you can escape statistical patterns? Historically, 99% of people confident in managing risks eventually face setbacks. This doesn\'t mean you\'ll fail, but rather a reminder: prepare for the worst, have a Plan B. Can you handle a 20% price drop? A 30% income reduction? A 2% rate hike? True confidence isn\'t blind optimism—it\'s composure after thorough preparation.',
            adviceZH: ['⚠️ 做压力测试：收入减半还能还款吗？', '📉 模拟房价下跌30%的场景', '🔮 考虑未来5年可能发生的黑天鹅事件', '🛡️ 购买适当的房贷保险和失业保险'],
            adviceEN: ['⚠️ Run stress test: Can you pay if income halves?', '📉 Simulate a 30% price drop scenario', '🔮 Consider black swan events in next 5 years', '🛡️ Get appropriate mortgage and unemployment insurance']
        },
        rent: {
            emoji: '🧘',
            titleZH: '租房的智慧',
            titleEN: 'The Wisdom of Renting',
            contentZH: '选择租房并不代表失败，恰恰相反，它可能是这个阶段最理性的选择。在高房价、高利率的环境下，租房让你保持财务灵活性——你可以随时换工作、换城市，不被房贷捆绑。把本该付首付的钱用于投资，假设年化收益8%，20年后可能积累一笔可观的财富。租房的另一个好处是心理自由：不用担心房价涨跌，不用担心物业维护，不用担心邻里纠纷。人生的幸福不在于拥有多少资产，而在于有多少选择权。租房给你的，正是这种珍贵的自由。等到真正合适的机会出现，再出手也不迟。',
            contentEN: 'Choosing to rent doesn\'t mean failure—on the contrary, it might be the most rational choice at this stage. In an environment of high prices and rates, renting maintains financial flexibility—you can change jobs or cities anytime without mortgage constraints. Invest the down payment instead: assuming 8% annual returns, you could accumulate significant wealth in 20 years. Renting also offers psychological freedom: no worrying about price fluctuations, property maintenance, or neighbor disputes. Life\'s happiness isn\'t about owning assets, but having choices. Renting gives you that precious freedom. Wait for the right opportunity, then make your move.',
            adviceZH: ['💵 把首付资金投入指数基金或稳健理财', '🏃 利用租房的灵活性拓展事业机会', '📚 用省下的精力提升自己的赚钱能力', '⏰ 设定一个3-5年后的重新评估节点'],
            adviceEN: ['💵 Invest down payment in index funds or stable investments', '🏃 Use rental flexibility to explore career opportunities', '📚 Use saved energy to improve earning potential', '⏰ Set a re-evaluation point 3-5 years from now']
        }
    };

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
                
                {/* Cards Display - Single card during playback, Grid after completion */}
                {replayYear >= timeline.length - 1 ? (
                    /* Full Grid View - All cards visible after completion */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                        {timeline.map((event, idx) => {
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
                                    className={`relative p-5 rounded-2xl border-2 transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-xl
                                        ${color.bg} ${color.border} shadow-md
                                    `}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {/* Year Badge */}
                                    <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white">
                                        {language === 'ZH' ? `第${event.year}年` : `Year ${event.year}`}
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className="text-3xl mb-3 mt-2">
                                        {color.icon}
                                    </div>
                                    
                                    {/* Title */}
                                    <h4 className={`font-bold mb-2 ${color.text}`}>
                                        {event.title}
                                    </h4>
                                    
                                    {/* Description */}
                                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                        {event.description}
                                    </p>
                                    
                                    {/* Irreversible Badge */}
                                    {event.isIrreversible && (
                                        <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                                            <AlertTriangle className="h-3 w-3" />
                                            {language === 'ZH' ? '不可逆' : 'No Return'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Single Card Mystery Mode - During playback */
                    <div className="relative min-h-[280px] flex items-center justify-center">
                        {timeline.map((event, idx) => {
                            const isActive = replayYear >= idx;
                            const isCurrent = replayYear === idx;
                            const isPast = replayYear > idx;
                            const colors = {
                                normal: { bg: 'bg-slate-100 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400', icon: '📝' },
                                warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/50', text: 'text-amber-600 dark:text-amber-400', icon: '⚠️' },
                                critical: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800/50', text: 'text-orange-600 dark:text-orange-400', icon: '🔥' },
                                fatal: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800/50', text: 'text-red-600 dark:text-red-400', icon: '💀' }
                            };
                            const color = colors[event.type as keyof typeof colors] || colors.normal;
                            
                            // Only render current and past cards
                            if (!isActive) return null;
                            
                            return (
                                <div 
                                    key={event.year}
                                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out
                                        ${isCurrent ? 'opacity-100 scale-100 z-20' : isPast ? 'opacity-0 scale-75 z-10' : 'opacity-0 scale-50 z-0'}
                                    `}
                                >
                                    <div 
                                        className={`relative p-8 rounded-3xl border-2 transition-all duration-700 ease-out transform w-full max-w-lg mx-auto
                                            ${color.bg} ${color.border}
                                            ${isCurrent ? 'shadow-2xl ring-4 ring-rose-400/50 ring-offset-4 dark:ring-offset-slate-900' : 'shadow-lg'}
                                        `}
                                    >
                                        {/* Year Badge */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold bg-rose-500 text-white shadow-lg">
                                            {language === 'ZH' ? `第${event.year}年` : `Year ${event.year}`}
                                        </div>
                                        
                                        {/* Icon */}
                                        <div className="text-6xl mb-4 mt-4 text-center animate-pulse">
                                            {color.icon}
                                        </div>
                                        
                                        {/* Title */}
                                        <h4 className={`text-2xl font-bold mb-3 text-center ${color.text}`}>
                                            {event.title}
                                        </h4>
                                        
                                        {/* Description */}
                                        <p className="text-sm leading-relaxed text-center text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                                            {event.description}
                                        </p>
                                        
                                        {/* Irreversible Badge */}
                                        {event.isIrreversible && (
                                            <div className="mt-4 flex justify-center">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-full animate-pulse">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    {language === 'ZH' ? '⚠️ 不可逆转的节点' : '⚠️ Point of No Return'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation Hint */}
                                        {idx < timeline.length - 1 && (
                                            <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                                                <span>{language === 'ZH' ? '接下来发生什么？点击播放继续...' : 'What happens next? Press play to continue...'}</span>
                                                <span className="animate-bounce">▼</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Mystery Cards Behind - Visual effect */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[1, 2, 3].map((offset) => {
                                const futureIdx = replayYear + offset;
                                if (futureIdx >= timeline.length) return null;
                                return (
                                    <div 
                                        key={offset}
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{ 
                                            transform: `translateY(${offset * 8}px) scale(${1 - offset * 0.05})`,
                                            zIndex: 10 - offset
                                        }}
                                    >
                                        <div className={`w-full max-w-lg mx-auto h-48 rounded-3xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700`} style={{ opacity: 0.3 - offset * 0.1 }}>
                                            <div className="h-full flex items-center justify-center">
                                                <span className="text-4xl opacity-20">❓</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                        {/* Reflection Card - Clickable Options */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800/50 shadow-lg transform transition-all duration-700 hover:scale-[1.02]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-4xl">🤔</div>
                                <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                                    {language === 'ZH' ? '看完后，你现在的想法是？' : 'What are you thinking now?'}
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => setSelectedReflection('reconsider')}
                                    className="w-full flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/50 rounded-xl hover:bg-white dark:hover:bg-slate-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 text-left"
                                >
                                    <span className="text-2xl">😰</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {language === 'ZH' ? '"这30年的轨迹太真实了，我需要重新考虑..."' : '"This 30-year trajectory is too real. I need to reconsider..."'}
                                        </p>
                                        <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">{language === 'ZH' ? '点击查看详细分析 →' : 'Click for detailed analysis →'}</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setSelectedReflection('confident')}
                                    className="w-full flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/50 rounded-xl hover:bg-white dark:hover:bg-slate-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-600 text-left"
                                >
                                    <span className="text-2xl">💪</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {language === 'ZH' ? '"我的情况不同，我有信心控制风险！"' : '"My situation is different. I\'m confident I can manage the risks!"'}
                                        </p>
                                        <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">{language === 'ZH' ? '点击查看风险提醒 →' : 'Click for risk reminder →'}</p>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setSelectedReflection('rent')}
                                    className="w-full flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/50 rounded-xl hover:bg-white dark:hover:bg-slate-700/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-600 text-left"
                                >
                                    <span className="text-2xl">🧘</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {language === 'ZH' ? '"也许租房才是现阶段最明智的选择..."' : '"Maybe renting is the wisest choice at this stage..."'}
                                        </p>
                                        <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">{language === 'ZH' ? '点击查看租房优势 →' : 'Click for rental benefits →'}</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Reflection Modal Popup - Creative Flowing Design */}
                        {selectedReflection && (
                            <div 
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                onClick={() => setSelectedReflection(null)}
                            >
                                {/* Animated backdrop with flowing colors */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/95 backdrop-blur-xl">
                                    {/* Animated gradient blobs */}
                                    <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse ${
                                        selectedReflection === 'reconsider' ? 'bg-indigo-500/30' : 
                                        selectedReflection === 'confident' ? 'bg-amber-500/30' : 'bg-emerald-500/30'
                                    }`} style={{ animation: 'pulse 4s ease-in-out infinite' }} />
                                    <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] animate-pulse ${
                                        selectedReflection === 'reconsider' ? 'bg-purple-500/20' : 
                                        selectedReflection === 'confident' ? 'bg-orange-500/20' : 'bg-teal-500/20'
                                    }`} style={{ animation: 'pulse 5s ease-in-out infinite', animationDelay: '1s' }} />
                                    <div className={`absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-[80px] ${
                                        selectedReflection === 'reconsider' ? 'bg-pink-500/15' : 
                                        selectedReflection === 'confident' ? 'bg-yellow-500/15' : 'bg-cyan-500/15'
                                    }`} style={{ animation: 'pulse 6s ease-in-out infinite', animationDelay: '2s' }} />
                                </div>
                                
                                {/* Modal Content - Asymmetric Design, positioned left */}
                                <div 
                                    className="relative w-full max-w-2xl ml-4 md:ml-16 lg:ml-24 mr-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Close button - floating */}
                                    <button 
                                        onClick={() => setSelectedReflection(null)}
                                        className="absolute -top-2 -right-2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 border border-white/20"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {/* Floating Emoji - Asymmetric position */}
                                    <div className={`absolute -top-8 -left-4 z-10 text-7xl transform -rotate-12 animate-bounce`} style={{ animationDuration: '3s' }}>
                                        {reflectionContent[selectedReflection].emoji}
                                    </div>

                                    {/* Main Card - Glassmorphism */}
                                    <div className={`relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl`}>
                                        {/* Gradient Top Bar */}
                                        <div className={`h-2 w-full bg-gradient-to-r ${
                                            selectedReflection === 'reconsider' ? 'from-indigo-400 via-purple-500 to-pink-500' : 
                                            selectedReflection === 'confident' ? 'from-amber-400 via-orange-500 to-red-500' : 
                                            'from-emerald-400 via-teal-500 to-cyan-500'
                                        }`} />
                                        
                                        {/* Content Area */}
                                        <div className="bg-slate-900/80 backdrop-blur-xl p-8 pb-6">
                                            {/* Title */}
                                            <h3 className={`text-2xl font-black mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
                                                selectedReflection === 'reconsider' ? 'from-indigo-300 via-purple-300 to-pink-300' : 
                                                selectedReflection === 'confident' ? 'from-amber-300 via-orange-300 to-red-300' : 
                                                'from-emerald-300 via-teal-300 to-cyan-300'
                                            }`}>
                                                {language === 'ZH' ? reflectionContent[selectedReflection].titleZH : reflectionContent[selectedReflection].titleEN}
                                            </h3>
                                            
                                            {/* Main Content - Better wrapping */}
                                            <div className={`relative p-5 rounded-2xl mb-6 border ${
                                                selectedReflection === 'reconsider' ? 'bg-indigo-950/40 border-indigo-500/30' : 
                                                selectedReflection === 'confident' ? 'bg-amber-950/40 border-amber-500/30' : 
                                                'bg-emerald-950/40 border-emerald-500/30'
                                            }`}>
                                                {/* Decorative corner */}
                                                <div className={`absolute top-0 left-0 w-16 h-16 rounded-br-3xl ${
                                                    selectedReflection === 'reconsider' ? 'bg-indigo-500/10' : 
                                                    selectedReflection === 'confident' ? 'bg-amber-500/10' : 
                                                    'bg-emerald-500/10'
                                                }`} />
                                                <p className="relative z-10 text-slate-300 leading-relaxed text-sm whitespace-pre-wrap break-words">
                                                    {language === 'ZH' ? reflectionContent[selectedReflection].contentZH : reflectionContent[selectedReflection].contentEN}
                                                </p>
                                            </div>
                                            
                                            {/* Action Items - Staggered cards */}
                                            <div className="space-y-2 mb-6">
                                                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                                                    selectedReflection === 'reconsider' ? 'text-indigo-400' : 
                                                    selectedReflection === 'confident' ? 'text-amber-400' : 
                                                    'text-emerald-400'
                                                }`}>
                                                    {language === 'ZH' ? '✨ 行动建议' : '✨ Action Items'}
                                                </h4>
                                                {(language === 'ZH' ? reflectionContent[selectedReflection].adviceZH : reflectionContent[selectedReflection].adviceEN).map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`p-3 rounded-xl bg-white/5 border border-white/10 transform transition-all hover:scale-[1.02] hover:bg-white/10`}
                                                        style={{ marginLeft: `${idx * 8}px` }}
                                                    >
                                                        <span className="text-sm text-slate-300">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Quote - Floating Style */}
                                            <div className="relative py-4">
                                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full ${
                                                    selectedReflection === 'reconsider' ? 'bg-gradient-to-b from-indigo-400 to-purple-500' : 
                                                    selectedReflection === 'confident' ? 'bg-gradient-to-b from-amber-400 to-orange-500' : 
                                                    'bg-gradient-to-b from-emerald-400 to-teal-500'
                                                }`} />
                                                <p className="pl-4 text-sm italic text-slate-400">
                                                    {language === 'ZH' 
                                                        ? '"明智的决策不在于选择最好的，而在于避开最坏的。"' 
                                                        : '"Wise decisions aren\'t about choosing the best, but avoiding the worst."'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Action Button - Gradient border effect */}
                                        <div className="p-4 bg-slate-950/50">
                                            <button 
                                                onClick={() => setSelectedReflection(null)}
                                                className={`relative w-full py-4 rounded-2xl font-bold text-white overflow-hidden group`}
                                            >
                                                {/* Animated gradient background */}
                                                <div className={`absolute inset-0 bg-gradient-to-r ${
                                                    selectedReflection === 'reconsider' ? 'from-indigo-600 via-purple-600 to-pink-600' : 
                                                    selectedReflection === 'confident' ? 'from-amber-600 via-orange-600 to-red-600' : 
                                                    'from-emerald-600 via-teal-600 to-cyan-600'
                                                } group-hover:opacity-90 transition-opacity`} />
                                                {/* Shine effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {language === 'ZH' ? '✓ 我明白了' : '✓ I Understand'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
