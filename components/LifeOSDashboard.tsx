import React, { useState, useMemo } from 'react';
import { LifeOSState, IncomeParams, AssetParams, FreedomParams, RiskParams, LearningParams, HistoryData } from './LifeOS/types';
import IncomeEngine from './LifeOS/IncomeEngine';
import AssetEngine from './LifeOS/AssetEngine';
import { FreedomEngine, RiskEngine, LearningEngine } from './LifeOS/OtherEngines';
import { LayoutDashboard, Zap, History, Play, RotateCcw, Settings, ChevronDown, ChevronUp, DollarSign, Percent, Wallet, PiggyBank, Briefcase, Activity, ShieldAlert, GraduationCap, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  language: 'ZH' | 'EN';
  t: any;
}

const INITIAL_STATE: LifeOSState = {
  income: {
    monthlyIncome: 35000,
    sources: [
       { id: '1', name: 'Salary', type: 'salary', amount: 30000, taxable: true, taxRate: 20, stabilityScore: 90, growthRate: 5, replicability: 'low' },
       { id: '2', name: 'Dividend', type: 'investment', amount: 2000, taxable: true, taxRate: 20, stabilityScore: 60, growthRate: 8, replicability: 'high' },
       { id: '3', name: 'Consulting', type: 'contract', amount: 3000, taxable: true, taxRate: 10, stabilityScore: 40, growthRate: 0, replicability: 'medium' }
    ],
    liquidSavings: 8,
    industryRiskScore: 30,
    projectedIncome3Yr: 45000 
  },
  assets: {
    assets: [
       { id: '1', name: 'Cash', type: 'cash', value: 200000, cost: 200000, liability: 0, interestRate: 0, liquidity: 'T0', expectedReturn: 2.5, volatility: 0 },
       { id: '2', name: 'Stock Portfolio', type: 'stock', value: 500000, cost: 400000, liability: 0, interestRate: 0, liquidity: 'T0', expectedReturn: 8, volatility: 15 },
       { id: '3', name: 'Apartment', type: 'property', value: 3000000, cost: 2500000, liability: 1800000, interestRate: 3.5, liquidity: 'Locked', expectedReturn: 3, volatility: 5 }
    ],
    monthlyExpense: 15000,
    totalValue: 3700000,
    netWorth: 1900000,
    debtToAssetRatio: 0.48
  },
  freedom: {
    locationLockScore: 70,
    dependents: 2,
    survivalMonthlyCost: 8000,
    comfortMonthlyCost: 15000,
    skillTransferability: 60,
    passiveIncome: 5000,
    liquidAssets: 700000,
    fireYearProjection: 12
  },
  risk: {
    incomeVolatility: 20,
    marketCorrelation: 60,
    insurance: [
        { id: '1', type: 'medical', coverage: 2000000, premium: 500, valid: true },
        { id: '2', type: 'life', coverage: 1000000, premium: 2000, valid: true }
    ],
    emergencyFund: 200000,
    monthlyBurn: 15000,
    totalAssets: 3700000,
    downsideProtectionScore: 75
  },
  learning: {
    skills: [
       { id: '1', name: 'React/Code', proficiency: 85, marketDemand: 90, aiReplacability: 40, decayHalfLife: 5, investmentHoursPerMonth: 20 },
       { id: '2', name: 'Writing', proficiency: 60, marketDemand: 70, aiReplacability: 20, decayHalfLife: 10, investmentHoursPerMonth: 10 },
       { id: '3', name: 'Sales', proficiency: 30, marketDemand: 80, aiReplacability: 10, decayHalfLife: 15, investmentHoursPerMonth: 0 }
    ],
    monthlyLearningBudget: 1000,
    learningRoi: 150,
    humanCapitalValuation: 5000000
  },
  history: [
    { date: '2022', scores: { income: 60, asset: 50, freedom: 30, risk: 40, learning: 50, total: 46 } },
    { date: '2023', scores: { income: 65, asset: 55, freedom: 35, risk: 50, learning: 60, total: 53 } },
    { date: '2024', scores: { income: 72, asset: 65, freedom: 45, risk: 65, learning: 70, total: 63 } },
    { date: '2025', scores: { income: 78, asset: 70, freedom: 52, risk: 75, learning: 75, total: 70 } },
  ]
};

// Reusable Slider (Copied from DecisionAutopsy for consistency)
const ParamSlider = ({ label, value, onChange, min, max, step=1, unit='', icon: Icon, color='indigo' }: any) => {
    const colorClasses: any = { indigo: 'accent-indigo-500', rose: 'accent-rose-500', amber: 'accent-amber-500', emerald: 'accent-emerald-500', purple: 'accent-purple-500' };
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">{Icon && <Icon className="h-3.5 w-3.5" />}{label}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{value.toLocaleString()}{unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
                className={`w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer ${colorClasses[color]}`} />
        </div>
    );
};

const LifeOSDashboard: React.FC<Props> = ({ language, t }) => {
  const [state, setState] = useState<LifeOSState>(INITIAL_STATE);
  const [simulatorMode, setSimulatorMode] = useState(false);
  const [showParams, setShowParams] = useState(true); // Default open like Autopsy
  const [activeTab, setActiveTab] = useState('income'); // Current tab in parameter panel
  
  // Extended params (local state for fields not in core LifeOSState)
  const [avgTaxRate, setAvgTaxRate] = useState(20);
  const [incomeGrowthRate, setIncomeGrowthRate] = useState(5);
  const [portfolioReturn, setPortfolioReturn] = useState(4.5);
  const [portfolioVolatility, setPortfolioVolatility] = useState(12);
  const [insuranceCoverage, setInsuranceCoverage] = useState(2000000);
  const [skillDemand, setSkillDemand] = useState(85);
  const [aiReplacability, setAiReplacability] = useState(40);
  const [skillDecayYears, setSkillDecayYears] = useState(5);

  // Update Helpers
  const updateIncome = (field: keyof IncomeParams, val: any) => setState(prev => ({...prev, income: {...prev.income, [field]: val}}));
  const updateAsset = (field: keyof AssetParams, val: any) => setState(prev => ({...prev, assets: {...prev.assets, [field]: val}}));
  const updateFreedom = (field: keyof FreedomParams, val: any) => setState(prev => ({...prev, freedom: {...prev.freedom, [field]: val}}));
  const updateRisk = (field: keyof RiskParams, val: any) => setState(prev => ({...prev, risk: {...prev.risk, [field]: val}}));
  const updateLearning = (field: keyof LearningParams, val: any) => setState(prev => ({...prev, learning: {...prev.learning, [field]: val}}));
  
  // Update individual income source amount
  const updateIncomeSource = (sourceId: string, amount: number) => {
    setState(prev => {
      const newSources = prev.income.sources.map(s => 
        s.id === sourceId ? {...s, amount} : s
      );
      const newMonthlyIncome = newSources.reduce((sum, s) => sum + s.amount, 0);
      return {
        ...prev,
        income: {
          ...prev.income,
          sources: newSources,
          monthlyIncome: newMonthlyIncome
        }
      };
    });
  };
  
  // Simulator State
  const [simParams, setSimParams] = useState({
    incomeChange: 0,
    marketReturn: 0,
    expenseInflation: 0
  });

  // Derived Simulated State
  const simState = useMemo(() => {
    if (!simulatorMode) return state;
    
    // Deep Clone to avoid mutation
    const s = JSON.parse(JSON.stringify(state)) as LifeOSState;
    
    // Apply Income Shocks
    s.income.sources.forEach(source => {
        if (source.type === 'salary' || source.type === 'contract') {
            source.amount *= (1 + simParams.incomeChange / 100);
        }
    });
    s.income.monthlyIncome = s.income.sources.reduce((sum, s) => sum + s.amount, 0);

    // Apply Market Shocks
    s.assets.assets.forEach(asset => {
        if (asset.type === 'stock' || asset.type === 'fund' || asset.type === 'crypto') {
            asset.value *= (1 + simParams.marketReturn / 100);
        }
    });
    s.assets.totalValue = s.assets.assets.reduce((sum, a) => sum + a.value, 0);

    // Apply Inflation
    s.freedom.comfortMonthlyCost *= (1 + simParams.expenseInflation / 100);
    s.freedom.survivalMonthlyCost *= (1 + simParams.expenseInflation / 100);

    return s;
  }, [state, simulatorMode, simParams]);

  // Dynamic Total Score - reacts to all parameter changes
  const totalScore = useMemo(() => {
    const s = simState;
    // Income Score (0-100): based on stability, growth, savings
    const incomeScore = Math.min(100, 
      (100 - s.income.industryRiskScore) * 0.3 + 
      (s.income.liquidSavings * 5) * 0.3 + 
      (Math.min(100, incomeGrowthRate * 5)) * 0.2 +
      (100 - avgTaxRate) * 0.2
    );
    // Asset Score (0-100): based on net worth growth, leverage, returns
    const assetScore = Math.min(100,
      (Math.min(100, (s.assets.netWorth / 1000000) * 20)) * 0.3 +
      (100 - s.assets.debtToAssetRatio * 100) * 0.3 +
      (portfolioReturn * 8) * 0.2 +
      (100 - portfolioVolatility * 2) * 0.2
    );
    // Freedom Score (0-100)
    const freedomScore = Math.min(100,
      (100 - s.freedom.locationLockScore) * 0.2 +
      s.freedom.skillTransferability * 0.25 +
      Math.min(100, (s.freedom.passiveIncome / s.freedom.comfortMonthlyCost) * 100) * 0.3 +
      Math.max(0, (25 - s.freedom.fireYearProjection) * 4) * 0.25
    );
    // Risk Score (0-100)
    const riskScore = Math.min(100,
      s.risk.downsideProtectionScore * 0.3 +
      Math.min(100, (s.risk.emergencyFund / s.risk.monthlyBurn) * 8) * 0.3 +
      Math.min(100, (insuranceCoverage / 5000000) * 100) * 0.2 +
      (100 - s.risk.incomeVolatility) * 0.2
    );
    // Learning Score (0-100)
    const learningScore = Math.min(100,
      skillDemand * 0.35 +
      (100 - aiReplacability) * 0.35 +
      Math.min(100, skillDecayYears * 7) * 0.3
    );
    // Overall weighted average
    return Math.round(
      incomeScore * 0.25 + 
      assetScore * 0.25 + 
      freedomScore * 0.2 + 
      riskScore * 0.15 + 
      learningScore * 0.15
    );
  }, [simState, incomeGrowthRate, avgTaxRate, portfolioReturn, portfolioVolatility, insuranceCoverage, skillDemand, aiReplacability, skillDecayYears]);

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      
      {/* Top Bar - Header with Total Score */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 relative overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <h2 className="text-2xl font-black flex items-center gap-3">
                  <LayoutDashboard className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  Life OS <span className="text-indigo-600 dark:text-indigo-400">2.0</span>
               </h2>
               <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                  {language === 'ZH' ? '个人操作系统：全维度量化人生健康度。' : 'Your Personal Operating System: Quantify life health.'}
               </p>
            </div>
            
            <div className="text-center bg-slate-50 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[120px]">
               <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{language === 'ZH' ? '综合评分' : 'Total Score'}</div>
               <div className={`text-4xl font-black transition-all duration-300 ${totalScore >= 75 ? 'text-emerald-500 dark:text-emerald-400' : totalScore >= 50 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {totalScore}
               </div>
            </div>
         </div>
      </div>

      {/* Parameter Control Panel (Detailed Tabs) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <button onClick={() => setShowParams(!showParams)} className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{language === 'ZH' ? 'Life OS 核心参数配置 (全维度)' : 'Life OS Core Parameters (Full Detail)'}</span>
              </div>
              {showParams ? <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
          </button>
          
          {showParams && (
              <div className="p-0 border-t border-slate-200 dark:border-slate-800">
                  {/* Tabs Header */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                     {['income', 'assets', 'freedom', 'risk', 'learning'].map((tab) => {
                        const active = activeTab === tab;
                        const labels: {[key:string]: {zh: string, en: string}} = { 
                           income: { zh: '收入', en: 'Income' }, 
                           assets: { zh: '资产', en: 'Assets' }, 
                           freedom: { zh: '自由度', en: 'Freedom' }, 
                           risk: { zh: '风险', en: 'Risk' }, 
                           learning: { zh: '成长', en: 'Growth' } 
                        };
                        const icons: {[key:string]: any} = { income: Wallet, assets: PiggyBank, freedom: MapPin, risk: ShieldAlert, learning: Briefcase };
                        const Icon = icons[tab];
                        return (
                           <button 
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${active ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                           >
                              <Icon className="h-4 w-4" />
                              {language === 'ZH' ? labels[tab].zh : labels[tab].en}
                           </button>
                        )
                     })}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-[320px]">
                      {activeTab === 'income' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 animate-fade-in">
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{language === 'ZH' ? '收入来源构成' : 'Income Sources'}</h4>
                              <ParamSlider label={language === 'ZH' ? '工资/薪水' : 'Salary'} value={state.income.sources.find(s => s.id === '1')?.amount || 0} onChange={(v: number) => updateIncomeSource('1', v)} min={0} max={150000} step={1000} color="emerald" icon={Wallet} />
                              <ParamSlider label={language === 'ZH' ? '投资收益' : 'Dividend'} value={state.income.sources.find(s => s.id === '2')?.amount || 0} onChange={(v: number) => updateIncomeSource('2', v)} min={0} max={50000} step={500} color="indigo" icon={PiggyBank} />
                              <ParamSlider label={language === 'ZH' ? '咨询/副业' : 'Consulting'} value={state.income.sources.find(s => s.id === '3')?.amount || 0} onChange={(v: number) => updateIncomeSource('3', v)} min={0} max={50000} step={500} color="purple" icon={Briefcase} />
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">{language === 'ZH' ? '收入稳定性' : 'Income Stability'}</h4>
                              <ParamSlider label={language === 'ZH' ? '流动储蓄 (月数)' : 'Liquid Savings (Months)'} value={state.income.liquidSavings} onChange={(v: number) => updateIncome('liquidSavings', v)} min={0} max={36} step={1} color="emerald" icon={PiggyBank} />
                              <ParamSlider label={language === 'ZH' ? '收入稳定性 (0-100)' : 'Income Stability (0-100)'} value={100 - state.income.industryRiskScore} onChange={(v: number) => updateIncome('industryRiskScore', 100 - v)} min={0} max={100} color="indigo" icon={Activity} />
                              <ParamSlider label={language === 'ZH' ? '行业风险系数' : 'Industry Risk Score'} value={state.income.industryRiskScore} onChange={(v: number) => updateIncome('industryRiskScore', v)} min={0} max={100} color="amber" icon={ShieldAlert} />
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">{language === 'ZH' ? '税务与增长' : 'Tax & Growth'}</h4>
                              <ParamSlider label={language === 'ZH' ? '平均税率' : 'Avg Tax Rate'} value={avgTaxRate} onChange={(v: number) => setAvgTaxRate(v)} min={0} max={50} unit="%" color="rose" icon={Percent} />
                              <ParamSlider label={language === 'ZH' ? '年收入增长率' : 'Income Growth (YoY)'} value={incomeGrowthRate} onChange={(v: number) => setIncomeGrowthRate(v)} min={-10} max={30} unit="%" color="indigo" icon={Zap} />
                          </div>
                      )}

                      {activeTab === 'assets' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 animate-fade-in">
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{language === 'ZH' ? '资产负债表' : 'Balance Sheet'}</h4>
                              <ParamSlider label={language === 'ZH' ? '总资产规模' : 'Total Assets'} value={state.assets.totalValue} onChange={(v: number) => updateAsset('totalValue', v)} min={100000} max={20000000} step={100000} color="indigo" icon={Wallet} />
                              <ParamSlider label={language === 'ZH' ? '净资产' : 'Net Worth'} value={state.assets.netWorth} onChange={(v: number) => updateAsset('netWorth', v)} min={0} max={15000000} step={50000} color="emerald" icon={PiggyBank} />
                              <ParamSlider label={language === 'ZH' ? '月支出' : 'Monthly Expense'} value={state.assets.monthlyExpense} onChange={(v: number) => updateAsset('monthlyExpense', v)} min={3000} max={100000} step={1000} color="rose" icon={Activity} />
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">{language === 'ZH' ? '投资组合' : 'Portfolio'}</h4>
                              <ParamSlider label={language === 'ZH' ? '负债率上限' : 'Debt/Asset Ratio Limit'} value={state.assets.debtToAssetRatio} onChange={(v: number) => updateAsset('debtToAssetRatio', v)} min={0} max={1} step={0.05} unit="x" color="rose" icon={Percent} />
                              <ParamSlider label={language === 'ZH' ? '组合预期回报率' : 'Avg Portfolio Return'} value={portfolioReturn} onChange={(v: number) => setPortfolioReturn(v)} min={-5} max={20} step={0.5} unit="%" color="emerald" icon={Zap} />
                              <ParamSlider label={language === 'ZH' ? '组合波动率' : 'Portfolio Volatility'} value={portfolioVolatility} onChange={(v: number) => setPortfolioVolatility(v)} min={0} max={50} step={1} unit="%" color="amber" icon={Activity} />
                          </div>
                      )}

                      {activeTab === 'freedom' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 animate-fade-in">
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{language === 'ZH' ? '生活成本阈值' : 'Lifestyle Thresholds'}</h4>
                              <ParamSlider label={language === 'ZH' ? '生存成本 (最低)' : 'Survival Cost (Min)'} value={state.freedom.survivalMonthlyCost} onChange={(v: number) => updateFreedom('survivalMonthlyCost', v)} min={2000} max={50000} step={500} color="rose" icon={ShieldAlert} />
                              <ParamSlider label={language === 'ZH' ? '舒适成本 (目标)' : 'Comfort Cost (Target)'} value={state.freedom.comfortMonthlyCost} onChange={(v: number) => updateFreedom('comfortMonthlyCost', v)} min={5000} max={100000} step={1000} color="indigo" icon={Activity} />
                              <ParamSlider label={language === 'ZH' ? '被抚养人数' : 'Dependents (People)'} value={state.freedom.dependents} onChange={(v: number) => updateFreedom('dependents', v)} min={0} max={5} step={1} color="purple" icon={GraduationCap} />
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">{language === 'ZH' ? '自由因子' : 'Freedom Factors'}</h4>
                              <ParamSlider label={language === 'ZH' ? '地理锁定程度 (0-100)' : 'Location Lock (0-100)'} value={state.freedom.locationLockScore} onChange={(v: number) => updateFreedom('locationLockScore', v)} min={0} max={100} color="rose" icon={MapPin} />
                              <ParamSlider label={language === 'ZH' ? '月被动收入' : 'Passive Income / Mo'} value={state.freedom.passiveIncome} onChange={(v: number) => updateFreedom('passiveIncome', v)} min={0} max={50000} step={500} color="emerald" icon={Wallet} />
                              <ParamSlider label={language === 'ZH' ? '技能可迁移性 (0-100)' : 'Skill Transferability (0-100)'} value={state.freedom.skillTransferability} onChange={(v: number) => updateFreedom('skillTransferability', v)} min={0} max={100} color="indigo" icon={Briefcase} />
                          </div>
                      )}

                      {activeTab === 'risk' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 animate-fade-in">
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{language === 'ZH' ? '安全网' : 'Safety Net'}</h4>
                              <ParamSlider label={language === 'ZH' ? '应急基金' : 'Emergency Fund'} value={state.risk.emergencyFund} onChange={(v: number) => updateRisk('emergencyFund', v)} min={0} max={1000000} step={10000} color="emerald" icon={ShieldAlert} />
                              <ParamSlider label={language === 'ZH' ? '保险覆盖额度' : 'Insurance Coverage'} value={insuranceCoverage} onChange={(v: number) => setInsuranceCoverage(v)} min={0} max={10000000} step={100000} color="indigo" icon={ShieldAlert} />
                              <ParamSlider label={language === 'ZH' ? '月燃烧率' : 'Monthly Burn Rate'} value={state.risk.monthlyBurn} onChange={(v: number) => updateRisk('monthlyBurn', v)} min={5000} max={100000} step={1000} color="rose" icon={Activity} />
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">{language === 'ZH' ? '风险敞口' : 'Exposure'}</h4>
                              <ParamSlider label={language === 'ZH' ? '收入与市场相关性' : 'Income/Market Correlation'} value={state.risk.marketCorrelation} onChange={(v: number) => updateRisk('marketCorrelation', v)} min={0} max={100} color="amber" icon={Activity} />
                              <ParamSlider label={language === 'ZH' ? '收入波动性' : 'Income Volatility'} value={state.risk.incomeVolatility} onChange={(v: number) => updateRisk('incomeVolatility', v)} min={0} max={100} color="rose" icon={Zap} />
                              <ParamSlider label={language === 'ZH' ? '下行保护评分' : 'Downside Protection Score'} value={state.risk.downsideProtectionScore} onChange={(v: number) => updateRisk('downsideProtectionScore', v)} min={0} max={100} color="indigo" icon={ShieldAlert} />
                          </div>
                      )}

                      {activeTab === 'learning' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 animate-fade-in">
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{language === 'ZH' ? '自我投资' : 'Investment in Self'}</h4>
                              <ParamSlider label={language === 'ZH' ? '月学习预算' : 'Monthly Learning Budget'} value={state.learning.monthlyLearningBudget} onChange={(v: number) => updateLearning('monthlyLearningBudget', v)} min={0} max={10000} step={100} color="indigo" icon={GraduationCap} />
                              <ParamSlider label={language === 'ZH' ? '学习投资回报率' : 'Learning ROI'} value={state.learning.learningRoi} onChange={(v: number) => updateLearning('learningRoi', v)} min={0} max={500} step={10} unit="%" color="emerald" icon={Zap} />
                              <ParamSlider label={language === 'ZH' ? '人力资本估值' : 'Human Capital Valuation'} value={state.learning.humanCapitalValuation} onChange={(v: number) => updateLearning('humanCapitalValuation', v)} min={0} max={20000000} step={100000} color="purple" icon={Wallet} />
                              <h4 className="col-span-full text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">{language === 'ZH' ? '技能可行性' : 'Skill Viability'}</h4>
                              <ParamSlider label={language === 'ZH' ? '核心技能市场需求' : 'Primary Skill Demand'} value={skillDemand} onChange={(v: number) => setSkillDemand(v)} min={0} max={100} color="indigo" icon={Activity} />
                              <ParamSlider label={language === 'ZH' ? 'AI替代风险' : 'AI Replacability Risk'} value={aiReplacability} onChange={(v: number) => setAiReplacability(v)} min={0} max={100} color="rose" icon={Zap} />
                              <ParamSlider label={language === 'ZH' ? '技能衰减速度 (年)' : 'Skill Decay Halflife (Yr)'} value={skillDecayYears} onChange={(v: number) => setSkillDecayYears(v)} min={1} max={20} color="amber" icon={Activity} />
                          </div>
                      )}
                  </div>
              </div>
          )}
      </div>

      {/* Main Grid: 5 Engines */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
         {/* Left Column: Financials */}
         <div className="md:col-span-7 space-y-6">
            <IncomeEngine 
               data={simState.income} 
               language={language} 
               extendedParams={{ avgTaxRate, incomeGrowthRate }}
             />
             <AssetEngine 
               data={simState.assets} 
               language={language} 
               extendedParams={{ portfolioReturn, portfolioVolatility }}
             />
             
             {/* Time Travel Chart (History) */}
             <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500">
                        <History className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200">{language === 'ZH' ? '时光回溯 (历史健康度)' : 'Time Travel (Health History)'}</h3>
                    </div>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={state.history}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis dataKey="date" tick={{fontSize:10}} stroke="#94a3b8" />
                            <YAxis domain={[0,100]} tick={{fontSize:10}} stroke="#94a3b8" />
                            <Tooltip contentStyle={{background:'#1e293b', border:'none', borderRadius:'8px', color:'#fff'}} />
                            <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} dot={{r:4, fill:'#6366f1'}} />
                            <Line type="monotone" dataKey="scores.income" stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                            <Line type="monotone" dataKey="scores.asset" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </div>
         </div>

         {/* Right Column: Strategy */}
         <div className="md:col-span-5 space-y-6">
            <FreedomEngine data={simState.freedom} language={language} />
            <RiskEngine data={simState.risk} language={language} extendedParams={{ insuranceCoverage }} />
            <LearningEngine data={simState.learning} language={language} extendedParams={{ skillDemand, aiReplacability, skillDecayYears }} />
         </div>
      </div>
    </div>
  );
};

export default LifeOSDashboard;
