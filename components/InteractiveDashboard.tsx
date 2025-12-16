import React, { useState, useMemo } from 'react';
import { InvestmentParams } from '../types';
import { 
  calculateTimelineData, 
  calculateRiskGradient, 
  calculateCashFlowBreathing,
  calculateRegretHeatmap 
} from '../utils/dashboardCalculations';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { Sliders, TrendingUp, Activity, Flame, LayoutGrid, ShieldAlert } from 'lucide-react';

interface InteractiveDashboardProps {
  initialParams: InvestmentParams;
  t: any;
}

const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ initialParams, t }) => {
  // Interactive parameters
  const [totalPrice, setTotalPrice] = useState(initialParams.totalPrice || 300);
  const [downPaymentRatio, setDownPaymentRatio] = useState(initialParams.downPaymentRatio || 30);
  const [interestRate, setInterestRate] = useState(initialParams.interestRate || 3.5);
  const [monthlyIncome, setMonthlyIncome] = useState(initialParams.familyMonthlyIncome || 30000);
  
  // Advanced Financial Parameters
  const [incomeFluctuation, setIncomeFluctuation] = useState(initialParams.incomeFluctuation || 10);
  const [minLivingExpenses, setMinLivingExpenses] = useState(initialParams.minLivingExpenses || 5000);
  const [emergencyReserves, setEmergencyReserves] = useState(initialParams.emergencyReserves || 6);
  const [maxPaymentRatio, setMaxPaymentRatio] = useState(initialParams.maxPaymentRatio || 35);
  const [rateHikeAssumption, setRateHikeAssumption] = useState(initialParams.rateHikeAssumption || 1.0);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const [activeChart, setActiveChart] = useState<'timeline' | 'risk' | 'breathing' | 'heatmap' | 'all'>('all');

  // Calculate all data
  const timelineData = useMemo(() => 
    calculateTimelineData(totalPrice, downPaymentRatio, interestRate, 30, monthlyIncome),
    [totalPrice, downPaymentRatio, interestRate, monthlyIncome]
  );

  const riskGradient = useMemo(() => 
    calculateRiskGradient({
      ...initialParams,
      totalPrice, downPaymentRatio, interestRate, familyMonthlyIncome: monthlyIncome,
      incomeFluctuation, minLivingExpenses, emergencyReserves, maxPaymentRatio, rateHikeAssumption
    }),
    [totalPrice, downPaymentRatio, interestRate, monthlyIncome, incomeFluctuation, minLivingExpenses, emergencyReserves, maxPaymentRatio, rateHikeAssumption]
  );

  const cashFlowBreathing = useMemo(() => 
    calculateCashFlowBreathing({
      ...initialParams,
      totalPrice, downPaymentRatio, interestRate, familyMonthlyIncome: monthlyIncome,
      incomeFluctuation, minLivingExpenses, emergencyReserves, maxPaymentRatio, rateHikeAssumption
    }),
    [totalPrice, downPaymentRatio, interestRate, monthlyIncome, incomeFluctuation, minLivingExpenses, emergencyReserves, maxPaymentRatio, rateHikeAssumption]
  );

  const regretHeatmap = useMemo(() => 
    calculateRegretHeatmap({
      ...initialParams,
      totalPrice, downPaymentRatio, interestRate, familyMonthlyIncome: monthlyIncome,
      incomeFluctuation, minLivingExpenses, emergencyReserves, maxPaymentRatio, rateHikeAssumption
    }),
    [totalPrice, interestRate, downPaymentRatio, monthlyIncome, incomeFluctuation, minLivingExpenses, emergencyReserves, maxPaymentRatio, rateHikeAssumption]
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/20 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500 rounded-xl">
            <Sliders className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.realTimeViz}</h2>
            <p className="text-sm text-slate-500">{t.dragParams}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold text-sm hover:bg-indigo-200 transition-colors"
        >
          {showAdvanced ? t.hideAdvanced : t.showAdvanced}
        </button>
      </div>

      {/* Basic Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl">
        {/* Total Price Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.totalPrice}: <span className="text-indigo-600 dark:text-indigo-400">{totalPrice}{t.unitWanSimple}</span>
          </label>
          <input type="range" min="100" max="2000" step="10" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
        </div>

        {/* Down Payment Ratio Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.downPaymentRatio}: <span className="text-indigo-600 dark:text-indigo-400">{downPaymentRatio}%</span>
          </label>
          <input type="range" min="10" max="90" step="5" value={downPaymentRatio} onChange={(e) => setDownPaymentRatio(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
        </div>

        {/* Interest Rate Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.commercialRate}: <span className="text-indigo-600 dark:text-indigo-400">{interestRate.toFixed(2)}%</span>
          </label>
          <input type="range" min="2" max="7" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
        </div>

        {/* Monthly Income Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.monthlyIncome}: <span className="text-indigo-600 dark:text-indigo-400">{(monthlyIncome/10000).toFixed(1)}{t.unitWanSimple}</span>
          </label>
          <input type="range" min="5000" max="100000" step="1000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
        </div>
      </div>
      
      {/* Advanced Parameters Section */}
      {showAdvanced && (
        <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl">
          <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            {t.advancedRiskParams}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Income Fluctuation */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {t.incomeVolatility}: <span className="text-slate-800 dark:text-white">{incomeFluctuation}%</span>
                <span className="block text-[10px] text-slate-400 font-normal">{t.volatilityNote}</span>
              </label>
              <input type="range" min="0" max="50" step="5" value={incomeFluctuation} onChange={(e) => setIncomeFluctuation(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Min Living Expenses */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {t.minLivingExpense}: <span className="text-slate-800 dark:text-white">{minLivingExpenses}{t.unitYuan || '元'}</span>
                <span className="block text-[10px] text-slate-400 font-normal">{t.basicLivingCost}</span>
              </label>
              <input type="range" min="2000" max="20000" step="1000" value={minLivingExpenses} onChange={(e) => setMinLivingExpenses(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Emergency Reserves */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {t.emergencyReserve}: <span className="text-slate-800 dark:text-white">{emergencyReserves} {t.unitMonth || 'Mo'}</span>
                <span className="block text-[10px] text-slate-400 font-normal">{t.survivalMonths}</span>
              </label>
              <input type="range" min="3" max="24" step="1" value={emergencyReserves} onChange={(e) => setEmergencyReserves(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Max Payment Ratio */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {t.maxDti}: <span className="text-slate-800 dark:text-white">{maxPaymentRatio}%</span>
                <span className="block text-[10px] text-slate-400 font-normal">{t.psychologicalThreshold}</span>
              </label>
              <input type="range" min="20" max="70" step="5" value={maxPaymentRatio} onChange={(e) => setMaxPaymentRatio(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Rate Hike Assumption */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {t.rateHikeAssumption}: <span className="text-slate-800 dark:text-white">+{rateHikeAssumption}%</span>
                <span className="block text-[10px] text-slate-400 font-normal">{t.stressTestNote}</span>
              </label>
              <input type="range" min="0" max="3" step="0.5" value={rateHikeAssumption} onChange={(e) => setRateHikeAssumption(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* Chart Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: t.overviewTab, icon: LayoutGrid },
          { id: 'timeline', label: t.timelineTab, icon: TrendingUp },
          { id: 'risk', label: t.riskTab, icon: Activity },
          { id: 'breathing', label: t.cashFlowTab, icon: Activity },
          { id: 'heatmap', label: t.regretTab, icon: Flame }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveChart(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              activeChart === tab.id
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-slate-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {(activeChart === 'all' || activeChart === 'timeline') && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.timelineTitle}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: t.yearAxis, position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: t.amountAxis, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="remainingPrincipal" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name={t.remainingPrincipal} />
                <Area type="monotone" dataKey="cumulativeInterest" stackId="2" stroke="#f59e0b" fill="#f59e0b" name={t.cumulativeInterest} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {(activeChart === 'all' || activeChart === 'risk') && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.riskGradientTitle}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskGradient}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name={t.riskValue}>
                  {riskGradient.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {(activeChart === 'all' || activeChart === 'breathing') && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.cashFlowTab}</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Breathing circle animation */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={cashFlowBreathing.status === 'healthy' ? '#10b981' : cashFlowBreathing.status === 'tight' ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${cashFlowBreathing.breathingRoom * 5} ${500 - cashFlowBreathing.breathingRoom * 5}`}
                    className="animate-pulse"
                  />
                  <text x="100" y="90" textAnchor="middle" className="text-2xl font-bold fill-slate-700 dark:fill-white">
                    {cashFlowBreathing.breathingRoom}%
                  </text>
                  <text x="100" y="110" textAnchor="middle" className="text-sm fill-slate-500">
                    {t.breathingRoom}
                  </text>
                </svg>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              {t.incomeLabel}: ¥{cashFlowBreathing.monthlyIncome.toLocaleString()} | 
              {t.paymentLabel}: ¥{cashFlowBreathing.monthlyPayment.toFixed(0).toLocaleString()} | 
              {t.discretionaryLabel}: ¥{cashFlowBreathing.discretionary.toFixed(0).toLocaleString()}
            </div>
          </div>
        )}

        {(activeChart === 'all' || activeChart === 'heatmap') && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.regretTab}</h3>
            <div className="grid grid-cols-5 gap-2">
              {regretHeatmap.map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    backgroundColor: `rgba(239, 68, 68, ${cell.regretScore / 100})`
                  }}
                  title={`Price: ${cell.price}, Rate: ${cell.rate}%, Regret: ${cell.regretScore}`}
                >
                  {cell.regretScore}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-500 text-center">
              {t.regretHeatmapTip}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveDashboard;
