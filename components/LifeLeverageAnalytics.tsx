import React, { useState } from 'react';
import { BuyTargetParams } from '../types';
import { calculateLeverageMetrics, LifeLeverageInput } from '../utils/leverageCalculations';
import { 
    Clock, DollarSign, TrendingUp, TrendingDown, 
    Zap, Activity, Anchor, Repeat, User, 
    Briefcase, Cpu, Layers, ArrowRight, ShieldCheck,
    Settings, ChevronDown
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

interface LifeLeverageAnalyticsProps {
    params: BuyTargetParams;
    language: 'ZH' | 'EN';
}

const LifeLeverageAnalytics: React.FC<LifeLeverageAnalyticsProps> = ({ params, language }) => {
    
    // 1. Initialize State with Intelligent Defaults from Global Params
    const [input, setInput] = useState<LifeLeverageInput>({
        // A. Income
        primaryIncome: params.monthlyIncome,
        sideIncome: 0,
        passiveIncome: (params.currentSavings * 10000 * 0.04) / 12, // Assume 4% yield on savings
        incomeGrowthRate: 5,
        equityValue: 0, // Stock options, RSUs
        taxRate: 20, // % effective tax

        // B. Time
        workHoursPerDay: 8,
        commuteHoursPerDay: 1,
        learningHoursPerWeek: 5,
        sleepHoursPerDay: 7,

        // C. Financial Base
        liquidAssets: params.currentSavings * 10000,
        illiquidAssets: 0,
        totalDebt: 0,
        debtInterestRate: 4.5,
        monthlyLivingCost: params.monthlyExpense,
        expectedReturn: 7, // % expected annual return
        targetSavingsRate: 30, // % of income

        // D. Leverage
        skillType: 'EXPERT',
        employeeCount: 0,
        digitalTraffic: 0,
        reinvestmentRate: 20,
        aiRisk: 'MEDIUM',

        // E. Personal Context
        age: 30,
        industry: 'TECH',
        healthScore: 80
    });

    const [showConfig, setShowConfig] = useState(false);

    const metrics = calculateLeverageMetrics(input, language);
    const t = (zh: string, en: string) => language === 'ZH' ? zh : en;

    // Helper for input groups - use string value during editing to allow deletion
    const ConfigRow = ({ label, value, onChange, unit, step=1, max }: any) => {
        const [localValue, setLocalValue] = React.useState(String(value));
        
        // Sync local value when external value changes
        React.useEffect(() => {
            setLocalValue(String(value));
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalValue(e.target.value);
        };

        const handleBlur = () => {
            const num = parseFloat(localValue);
            onChange(isNaN(num) ? 0 : num);
        };

        return (
            <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 uppercase">{label}</span>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        step={step}
                        max={max}
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono"
                    />
                    {unit && <span className="text-xs text-slate-400">{unit}</span>}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in p-2 pb-20">
            {/* Header / Summary */}
            <div className={`p-6 rounded-3xl relative overflow-hidden shadow-2xl ${
                metrics.summary.totalScore > 80 ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900' : 
                metrics.summary.totalScore > 50 ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' : 
                'bg-gradient-to-br from-slate-900 to-black'
            }`}>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Activity className="h-8 w-8 text-indigo-400" />
                            {t('人生杠杆总指数', 'Life Leverage Index')}
                        </h2>
                        <div className="mt-2 text-indigo-200/80 max-w-lg">
                            {t('你是在用命换钱，还是用钱买命？', 'Are you trading life for money, or money for life?')}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                        <div className="text-right">
                             <div className="text-xs text-indigo-300 uppercase tracking-wider">{t('当前段位', 'Current Level')}</div>
                             <div className="text-xl font-bold text-white">{metrics.summary.level}</div>
                        </div>
                        <div className="h-12 w-px bg-white/20"></div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            {metrics.summary.totalScore}
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulation Cockpit Button */}
            <button 
                onClick={() => setShowConfig(!showConfig)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/30 rounded-xl shadow-sm hover:shadow-md transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('深度参数配置', 'Simulation Cockpit')}</div>
                        <div className="text-xs text-slate-500">{t('自定义收入结构、时间分配与杠杆系数', 'Customize Income, Time, Assets & Leverage')}</div>
                    </div>
                </div>
                <div className={`p-1 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform duration-300 ${showConfig ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
            </button>

            {/* Configuration Panel */}
            {showConfig && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-slide-down">
                    
                    {/* A. Income & Financial Base */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                             <DollarSign className="h-3 w-3" /> {t('财务底座', 'Financial Base')}
                        </h4>
                        <ConfigRow label={t('主业月薪', 'Primary Income')} value={input.primaryIncome} onChange={(v:number) => setInput((p: any) => ({...p, primaryIncome: v}))} />
                        <ConfigRow label={t('副业收入', 'Side Income')} value={input.sideIncome} onChange={(v:number) => setInput((p: any) => ({...p, sideIncome: v}))} />
                        <ConfigRow label={t('被动收入', 'Passive Income')} value={input.passiveIncome} onChange={(v:number) => setInput((p: any) => ({...p, passiveIncome: v}))} />
                        <ConfigRow label={t('股权/期权价值', 'Equity Value')} value={input.equityValue} onChange={(v:number) => setInput((p: any) => ({...p, equityValue: v}))} />
                        <ConfigRow label={t('有效税率', 'Tax Rate')} value={input.taxRate} onChange={(v:number) => setInput((p: any) => ({...p, taxRate: v}))} unit="%" max={60} />
                    </div>

                    {/* B. Assets & Savings */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                             <Layers className="h-3 w-3" /> {t('资产与储蓄', 'Assets & Savings')}
                        </h4>
                        <ConfigRow label={t('流动资产', 'Liquid Assets')} value={input.liquidAssets} onChange={(v:number) => setInput((p: any) => ({...p, liquidAssets: v}))} />
                        <ConfigRow label={t('不动产/非流动', 'Illiquid Assets')} value={input.illiquidAssets} onChange={(v:number) => setInput((p: any) => ({...p, illiquidAssets: v}))} />
                        <ConfigRow label={t('每月生存成本', 'Living Cost')} value={input.monthlyLivingCost} onChange={(v:number) => setInput((p: any) => ({...p, monthlyLivingCost: v}))} />
                        <ConfigRow label={t('预期年化收益', 'Expected Return')} value={input.expectedReturn} onChange={(v:number) => setInput((p: any) => ({...p, expectedReturn: v}))} unit="%" max={30} />
                        <ConfigRow label={t('目标储蓄率', 'Target Savings')} value={input.targetSavingsRate} onChange={(v:number) => setInput((p: any) => ({...p, targetSavingsRate: v}))} unit="%" max={80} />
                    </div>

                    {/* C. Time Allocation */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                             <Clock className="h-3 w-3" /> {t('时间分配', 'Time Allocation')}
                        </h4>
                        <ConfigRow label={t('日工作时长', 'Work Hours/Day')} value={input.workHoursPerDay} onChange={(v:number) => setInput((p: any) => ({...p, workHoursPerDay: v}))} unit="h" max={16} />
                        <ConfigRow label={t('日通勤时长', 'Commute/Day')} value={input.commuteHoursPerDay} onChange={(v:number) => setInput((p: any) => ({...p, commuteHoursPerDay: v}))} unit="h" max={6} />
                        <ConfigRow label={t('周学习时长', 'Learning/Week')} value={input.learningHoursPerWeek} onChange={(v:number) => setInput((p: any) => ({...p, learningHoursPerWeek: v}))} unit="h" max={40} />
                        <ConfigRow label={t('日睡眠时长', 'Sleep/Day')} value={input.sleepHoursPerDay} onChange={(v:number) => setInput((p: any) => ({...p, sleepHoursPerDay: v}))} unit="h" max={12} />
                    </div>

                    {/* D. Leverage & Skill */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                             <Zap className="h-3 w-3" /> {t('杠杆系数', 'Leverage Factors')}
                        </h4>
                        
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 uppercase">{t('职业角色', 'Role')}</span>
                            <select 
                                value={input.skillType}
                                onChange={(e) => setInput((p: any) => ({...p, skillType: e.target.value as any}))}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                            >
                                <option value="LABOR">{t('打工', 'Labor')}</option>
                                <option value="EXPERT">{t('专家', 'Expert')}</option>
                                <option value="MANAGER">{t('管理', 'Manager')}</option>
                                <option value="CAPITALIST">{t('资本', 'Capitalist')}</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 uppercase">{t('行业', 'Industry')}</span>
                            <select 
                                value={input.industry}
                                onChange={(e) => setInput((p: any) => ({...p, industry: e.target.value as any}))}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                            >
                                <option value="TECH">{t('科技', 'Tech')}</option>
                                <option value="FINANCE">{t('金融', 'Finance')}</option>
                                <option value="HEALTHCARE">{t('医疗', 'Healthcare')}</option>
                                <option value="EDUCATION">{t('教育', 'Education')}</option>
                                <option value="CREATIVE">{t('创意', 'Creative')}</option>
                                <option value="OTHER">{t('其他', 'Other')}</option>
                            </select>
                        </div>

                        <ConfigRow label={t('团队人数', 'Team Size')} value={input.employeeCount} onChange={(v:number) => setInput((p: any) => ({...p, employeeCount: v}))} />
                        <ConfigRow label={t('月流量', 'Traffic/Mo')} value={input.digitalTraffic} onChange={(v:number) => setInput((p: any) => ({...p, digitalTraffic: v}))} />
                        <ConfigRow label={t('再投资率', 'Reinvest %')} value={input.reinvestmentRate} onChange={(v:number) => setInput((p: any) => ({...p, reinvestmentRate: v}))} unit="%" max={100} />
                    </div>

                     {/* E. Personal Context & Risk */}
                     <div className="space-y-3">
                        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                             <User className="h-3 w-3" /> {t('个人背景', 'Personal Context')}
                        </h4>
                        
                        <ConfigRow label={t('年龄', 'Age')} value={input.age} onChange={(v:number) => setInput((p: any) => ({...p, age: v}))} unit={t('岁', 'yrs')} max={100} />
                        <ConfigRow label={t('健康评分', 'Health Score')} value={input.healthScore} onChange={(v:number) => setInput((p: any) => ({...p, healthScore: v}))} unit="/100" max={100} />

                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 uppercase">{t('AI 替代风险', 'AI Risk')}</span>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded p-1">
                                {['LOW', 'MEDIUM', 'HIGH'].map((risk) => (
                                    <button
                                        key={risk}
                                        onClick={() => setInput((p: any) => ({ ...p, aiRisk: risk as any }))}
                                        className={`flex-1 py-1 px-1 rounded text-[10px] font-medium transition-all ${
                                            input.aiRisk === risk 
                                                ? 'bg-white dark:bg-slate-700 shadow text-rose-500' 
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {risk === 'LOW' ? t('低', 'Low') : risk === 'MEDIUM' ? t('中', 'Mid') : t('高', 'High')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ConfigRow label={t('收入年增长率', 'Growth Rate')} value={input.incomeGrowthRate} onChange={(v:number) => setInput((p: any) => ({...p, incomeGrowthRate: v}))} unit="%" max={50} />
                        <ConfigRow label={t('负债总额', 'Total Debt')} value={input.totalDebt} onChange={(v:number) => setInput((p: any) => ({...p, totalDebt: v}))} />
                        <ConfigRow label={t('债务利率', 'Debt Rate')} value={input.debtInterestRate} onChange={(v:number) => setInput((p: any) => ({...p, debtInterestRate: v}))} unit="%" max={30} />
                    </div>
                </div>
            )}

            {/* Personal IPO & Valuation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-center border border-slate-700 shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <TrendingUp size={120} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded tracking-wider border border-indigo-500/30">Personal IPO</span>
                                <span className="text-slate-400 text-xs">{t('个人上市市值', 'Your Market Cap')}</span>
                            </div>
                            <div className="text-5xl md:text-6xl font-black tracking-tight flex items-baseline gap-2">
                                <span className="text-2xl text-slate-400">$</span>
                                {metrics.personalIPO.valuation.toLocaleString()}
                            </div>
                            <p className="text-sm text-slate-400 mt-2 max-w-md">
                                {t(
                                    '这是基于你的现金流和杠杆率计算的理论市值。想提高身价？提高可复制性，降低折旧率。',
                                    'Theoretical valuation based on your cashflow & leverage. Want to raise stock price? Increase replicability, decrease decay.'
                                )}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-center bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                <div className="text-xs text-slate-400 mb-1">P/E Ratio</div>
                                <div className="text-xl font-bold text-emerald-400">{metrics.personalIPO.peRatio}x</div>
                            </div>
                            <div className="text-center bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                <div className="text-xs text-slate-400 mb-1">Potential</div>
                                <div className="text-xl font-bold text-amber-400">{metrics.personalIPO.potential}/100</div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Naval's Almanac Card */}
                 <div className="bg-black rounded-2xl p-6 border border-slate-800 flex flex-col relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay transition-opacity duration-700 group-hover:opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    
                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="h-3 w-3" /> Naval's Almanac
                             </div>
                             <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
                        </div>
                        
                        <div className="my-4">
                            <h3 className="text-lg font-serif italic text-slate-200 leading-relaxed">
                                {language === 'ZH' 
                                 ? '"用头脑赚钱，而不是用时间赚钱。如果你还在出卖时间，你就永远无法获得真正的自由。"'
                                 : '"Earn with your mind, not your time. If you require your time to make money, you will never be truly free."'}
                            </h3>
                            <div className="mt-3 flex items-center gap-2 text-slate-500 text-xs">
                                <div className="h-4 w-4 rounded-full bg-slate-700 overflow-hidden">
                                    <img src="https://unavatar.io/twitter/naval" alt="Naval" className="h-full w-full object-cover"/>
                                </div>
                                <span>— Naval Ravikant</span>
                            </div>
                        </div>

                        <a 
                            href="https://twitter.com/naval" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 self-start"
                        >
                            Read The Almanack <ArrowRight className="h-3 w-3" />
                        </a>
                    </div>
                 </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Time vs Money */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-xs font-bold text-slate-400 uppercase">{t('时间换钱指数', 'Time vs Money')}</div>
                        <Clock className="h-5 w-5 text-indigo-500" />
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24">
                             <PieChart width={100} height={100}>
                                <Pie
                                    data={[
                                        { value: metrics.timeMoney.laborRatio }, 
                                        { value: metrics.timeMoney.passiveRatio }
                                    ]}
                                    innerRadius={30}
                                    outerRadius={45}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#6366f1" /> {/* Indigo for Labor */}
                                    <Cell fill="#10b981" /> {/* Emerald for Capital */}
                                </Pie>
                            </PieChart>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                {metrics.timeMoney.passiveRatio}%
                            </div>
                        </div>
                        <div>
                             <div className="text-xs text-slate-500 mb-1">{t('真实时薪 (Labor)', 'Real Hourly Wage')}</div>
                             <div className="text-xl font-bold text-slate-800 dark:text-slate-200">${metrics.timeMoney.realHourlyWage}</div>
                             <div className="text-xs text-slate-500 mt-2 mb-1">{t('睡后时薪 (Passive)', 'Passive / Hr')}</div>
                             <div className="text-xl font-bold text-emerald-500">${metrics.timeMoney.passiveHourlyWage}</div>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        {t('当前状态: ', 'Status: ')} 
                        <span className={metrics.timeMoney.laborRatio > 90 ? 'text-rose-500' : 'text-emerald-500'}>
                            {metrics.timeMoney.interpretation}
                        </span>
                    </div>
                </div>

                {/* 2. Human Capital Decay */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                     <div className="flex justify-between items-start mb-4">
                        <div className="text-xs font-bold text-slate-400 uppercase">{t('人力资产折旧', 'Human Capital Decay')}</div>
                        <TrendingDown className="h-5 w-5 text-rose-500" />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">{t('当前技能半衰期', 'Skill Half-life')}</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{metrics.decay.yearsToObsolescence} {t('年', 'Yrs')}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-400" style={{ width: `${Math.min(100, metrics.decay.yearsToObsolescence * 5)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">{t('AI 替代概率 (5年)', 'AI Replacement (5yr)')}</span>
                                <span className="font-bold text-rose-500">{metrics.decay.aiProb}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500" style={{ width: `${metrics.decay.aiProb}%` }}></div>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-400 mt-2">
                             {metrics.decay.aiProb > 50 
                                ? t('⚠️ 你的技能正在快速贬值，这比通胀更可怕。', '⚠️ Your skills are depreciating faster than inflation.') 
                                : t('✅ 你的经验像陈年老酒，越老越值钱。', '✅ Your experience adds value like fine wine.')}
                        </div>
                    </div>
                </div>

                {/* 3. Replicability */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-xs font-bold text-slate-400 uppercase">{t('收入可复制性', 'Replicability')}</div>
                        <Repeat className={`h-5 w-5 ${metrics.replicability.score > 50 ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </div>
                    
                    <div className="flex items-end gap-3 mb-4">
                        <div className="text-4xl font-black text-slate-800 dark:text-slate-100">{metrics.replicability.leverageFactor}x</div>
                        <div className="text-sm font-medium text-slate-500 mb-2">{t('杠杆倍数', 'Leverage')}</div>
                    </div>

                    <div className="flex gap-2 mb-4">
                        {['Linear', 'Exponential'].map((l) => (
                             <div key={l} className={`text-xs px-2 py-1 rounded border ${
                                metrics.replicability.type === l 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 text-indigo-600' 
                                    : 'border-transparent text-slate-400'
                             }`}>
                                {l}
                             </div>
                        ))}
                    </div>

                    <div className="text-[10px] text-slate-400">
                        {metrics.replicability.score < 20 
                            ? t('你的每一块钱都需要你亲自在场。', 'Needs your physical presence.') 
                            : t('你的系统在你睡觉时也在为你工作。', 'System works while you sleep.')}
                    </div>
                </div>

                {/* 4. Cashflow Power */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-xs font-bold text-slate-400 uppercase">{t('自由现金流强度', 'Free Cashflow Power')}</div>
                        <Zap className="h-5 w-5 text-amber-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mb-4">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="text-xs text-slate-400 mb-1">{t('每月结余', 'Monthly Free')}</div>
                            <div className="font-bold text-slate-800 dark:text-white">${metrics.cashflow.monthlyFree}</div>
                        </div>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">{t('子弹 (再投资)', 'Investable')}</div>
                            <div className="font-bold text-emerald-700 dark:text-emerald-300">${metrics.cashflow.reinvestAmount}</div>
                        </div>
                    </div>
                    
                    <div className="relative pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-slate-500 font-bold">{t('自由重力加速度', 'Freedom Velocity')}</span>
                             <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                {metrics.cashflow.freedomVelocity} {t('年', 'Yrs')}
                             </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-amber-400 to-indigo-500" style={{ width: `${Math.min(100, 1000/metrics.cashflow.freedomVelocity)}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* 5. Fixed Cost Anchor */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                     <div className="flex justify-between items-start mb-4">
                        <div className="text-xs font-bold text-slate-400 uppercase">{t('固定成本锚', 'Fixed Cost Anchor')}</div>
                        <Anchor className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="flex flex-col items-center justify-center py-2">
                        <div className="text-3xl font-black text-slate-700 dark:text-slate-200">${metrics.cashflow.survivalCost}</div>
                        <div className="text-xs text-slate-400 mt-1">{t('每月生存成本', 'Survival Cost / Mo')}</div>
                    </div>

                    <div className="flex justify-between items-center mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px]">
                        <span className="text-slate-500">{t('安全跑道 (Runway)', 'Runway')}</span>
                        <span className={`font-bold ${metrics.cashflow.runway < 6 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {metrics.cashflow.runway} {t('个月', 'Months')}
                        </span>
                    </div>
                </div>

                {/* 6. Wealth Vector (Span 2 Cols) */}
                <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                        <div className="text-xs font-bold text-slate-400 uppercase">{t('自由增长方向性', 'Wealth Vector')}</div>
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                    </div>

                    <div className="flex-1 min-h-[150px] relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.vector.netWorth.map((nw, i) => ({
                                year: metrics.vector.time[i],
                                netWorth: nw,
                                passive: metrics.vector.passiveIncome[i]
                            }))}>
                                <defs>
                                    <linearGradient id="colorNW" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPassive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="year" hide />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="netWorth" stroke="#6366f1" fillOpacity={1} fill="url(#colorNW)" strokeDasharray="5 5" name={t('净资产', 'Net Worth')} />
                                <Area type="monotone" dataKey="passive" stroke="#10b981" fillOpacity={1} fill="url(#colorPassive)" strokeWidth={2} name={t('被动收入', 'Passive')} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-slate-400 px-2">
                        <span>{t('现在', 'Now')}</span>
                        <span>{t('10年后', '10 Years')}</span>
                    </div>
                </div>

            </div>


             {/* Digital Board of Directors (Infinite Scroll) */}
             <div className="mt-8 mb-8">
                <div className="flex items-center justify-between mb-4 px-2">
                     <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> 
                        {t('数字董事会', 'Digital Board of Directors')}
                     </h3>
                     <span className="text-[10px] text-slate-400 hidden md:block">{t('点击头像直达 Twitter 汲取智慧', 'Click avatar to visit Twitter')}</span>
                </div>
                

                {/* Scroll Container - Row 1 (Philosophy & Capital) */}
                <div className="relative w-full overflow-hidden py-2 mb-2 mask-linear-fade">
                    <div className="flex gap-4 animate-scroll whitespace-nowrap hover:pause-animation w-max">
                         {[
                            { name: 'Naval Ravikant', handle: 'naval', role: 'Philosopher', desc: 'Wealth & Happiness' },
                            { name: 'Charlie Munger', handle: 'MungerWisdom', role: 'Legend', desc: 'Rationality' },
                            { name: 'Nassim Taleb', handle: 'nntaleb', role: 'Risk Expert', desc: 'Antifragility' },
                            { name: 'Ray Dalio', handle: 'RayDalio', role: 'Investor', desc: 'Principles' },
                            { name: 'Paul Graham', handle: 'paulg', role: 'Founder YC', desc: 'Startup Wisdom' },
                            { name: 'Morgan Housel', handle: 'morganhousel', role: 'Author', desc: 'Psychology of $' },
                            { name: 'Warren Buffett', handle: 'WarrenBuffett', role: 'Oracle', desc: 'Value Investing' },
                            // Duplicates
                            { name: 'Naval Ravikant', handle: 'naval', role: 'Philosopher', desc: 'Wealth & Happiness' },
                            { name: 'Charlie Munger', handle: 'MungerWisdom', role: 'Legend', desc: 'Rationality' },
                            { name: 'Nassim Taleb', handle: 'nntaleb', role: 'Risk Expert', desc: 'Antifragility' },
                            { name: 'Ray Dalio', handle: 'RayDalio', role: 'Investor', desc: 'Principles' },
                            { name: 'Paul Graham', handle: 'paulg', role: 'Founder YC', desc: 'Startup Wisdom' },
                            { name: 'Morgan Housel', handle: 'morganhousel', role: 'Author', desc: 'Psychology of $' },
                            { name: 'Warren Buffett', handle: 'WarrenBuffett', role: 'Oracle', desc: 'Value Investing' },
                         ].map((guru, index) => (
                             <MentorCard key={`r1-${index}`} guru={guru} />
                         ))}
                    </div>
                </div>

                {/* Scroll Container - Row 2 (Builders & CEOs) - Reverse Scroll */}
                <div className="relative w-full overflow-hidden py-2 mb-2 mask-linear-fade">
                    <div className="flex gap-4 animate-scroll whitespace-nowrap hover:pause-animation w-max" style={{ animationDirection: 'reverse' }}>
                         {[
                            { name: 'Elon Musk', handle: 'elonmusk', role: 'Builder', desc: 'First Principles' },
                            { name: 'Sam Altman', handle: 'sama', role: 'CEO OpenAI', desc: 'Future of AI' },
                            { name: 'Jensen Huang', handle: 'nvidia', role: 'CEO Nvidia', desc: 'Computing' },
                            { name: 'Garry Tan', handle: 'garrytan', role: 'CEO YC', desc: 'Build Builders' },
                            { name: 'Tobi Lutke', handle: 'tobi', role: 'CEO Shopify', desc: 'Engineering' },
                            { name: 'Brian Chesky', handle: 'bchesky', role: 'CEO Airbnb', desc: 'Design Lead' },
                            { name: 'Vitalik Buterin', handle: 'VitalikButerin', role: 'Creator ETH', desc: 'Decentralization' },
                             // Duplicates
                            { name: 'Elon Musk', handle: 'elonmusk', role: 'Builder', desc: 'First Principles' },
                            { name: 'Sam Altman', handle: 'sama', role: 'CEO OpenAI', desc: 'Future of AI' },
                            { name: 'Jensen Huang', handle: 'nvidia', role: 'CEO Nvidia', desc: 'Computing' },
                            { name: 'Garry Tan', handle: 'garrytan', role: 'CEO YC', desc: 'Build Builders' },
                            { name: 'Tobi Lutke', handle: 'tobi', role: 'CEO Shopify', desc: 'Engineering' },
                            { name: 'Brian Chesky', handle: 'bchesky', role: 'CEO Airbnb', desc: 'Design Lead' },
                            { name: 'Vitalik Buterin', handle: 'VitalikButerin', role: 'Creator ETH', desc: 'Decentralization' },
                         ].map((guru, index) => (
                             <MentorCard key={`r2-${index}`} guru={guru} />
                         ))}
                    </div>
                </div>

                 {/* Scroll Container - Row 3 (Creators & Thinkers) */}
                 <div className="relative w-full overflow-hidden py-2 mask-linear-fade">
                    <div className="flex gap-4 animate-scroll whitespace-nowrap hover:pause-animation w-max">
                         {[
                            { name: 'James Clear', handle: 'james_clear', role: 'Author', desc: 'Habit Formation' },
                            { name: 'Tim Ferriss', handle: 'tferriss', role: 'Experimenter', desc: 'Lifestyle Design' },
                            { name: 'Lex Fridman', handle: 'lexfridman', role: 'Podcaster', desc: 'AI & Love' },
                            { name: 'Andrew Huberman', handle: 'hubermanlab', role: 'Scientist', desc: 'Neuroscience' },
                            { name: 'Sahil Bloom', handle: 'SahilBloom', role: 'Creator', desc: 'Visual Wisdom' },
                            { name: 'Pieter Levels', handle: 'levelsio', role: 'Indie Hacker', desc: 'Build in Public' },
                            { name: 'Jack Butcher', handle: 'jackbutcher', role: 'Designer', desc: 'Visualize Value' },
                             // Duplicates
                            { name: 'James Clear', handle: 'james_clear', role: 'Author', desc: 'Habit Formation' },
                            { name: 'Tim Ferriss', handle: 'tferriss', role: 'Experimenter', desc: 'Lifestyle Design' },
                            { name: 'Lex Fridman', handle: 'lexfridman', role: 'Podcaster', desc: 'AI & Love' },
                            { name: 'Andrew Huberman', handle: 'hubermanlab', role: 'Scientist', desc: 'Neuroscience' },
                            { name: 'Sahil Bloom', handle: 'SahilBloom', role: 'Creator', desc: 'Visual Wisdom' },
                            { name: 'Pieter Levels', handle: 'levelsio', role: 'Indie Hacker', desc: 'Build in Public' },
                            { name: 'Jack Butcher', handle: 'jackbutcher', role: 'Designer', desc: 'Visualize Value' },
                         ].map((guru, index) => (
                             <MentorCard key={`r3-${index}`} guru={guru} />
                         ))}
                    </div>
                </div>
                
                {/* CSS for Marquee */}
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-scroll {
                        animation: scroll 80s linear infinite;
                    }
                    .hover\\:pause-animation:hover {
                        animation-play-state: paused;
                    }
                    /* Mask for smooth edges */
                    .mask-linear-fade {
                          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                         -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                    }
                `}</style>
             </div>
        </div>
    );
};


// Helper Component for Mentor Card
const MentorCard = ({ guru }: { guru: any }) => (
    <a 
    href={`https://twitter.com/${guru.handle}`}
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl items-center gap-3 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group hover:shadow-lg hover:shadow-indigo-500/10 min-w-[220px]"
    >
        <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-md">
            <img 
            src={`https://unavatar.io/twitter/${guru.handle}?size=120`} 
            alt={guru.name}
            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
            />
        </div>
        <div className="overflow-hidden">
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{guru.name}</div>
            <div className="text-[10px] text-indigo-500 truncate mb-0.5">@{guru.handle}</div>
            <div className="text-[9px] text-slate-400 truncate max-w-[120px]">{guru.desc}</div>
        </div>
    </a>
);

export default LifeLeverageAnalytics;
