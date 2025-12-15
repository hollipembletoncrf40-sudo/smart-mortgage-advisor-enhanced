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
import { Sliders, TrendingUp, Activity, Flame, LayoutGrid } from 'lucide-react';

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
  const [activeChart, setActiveChart] = useState<'timeline' | 'risk' | 'breathing' | 'heatmap' | 'all'>('all');

  // Calculate all data
  const timelineData = useMemo(() => 
    calculateTimelineData(totalPrice, downPaymentRatio, interestRate, 30, monthlyIncome),
    [totalPrice, downPaymentRatio, interestRate, monthlyIncome]
  );

  const riskGradient = useMemo(() => 
    calculateRiskGradient(totalPrice, downPaymentRatio, interestRate, monthlyIncome),
    [totalPrice, downPaymentRatio, interestRate, monthlyIncome]
  );

  const cashFlowBreathing = useMemo(() => 
    calculateCashFlowBreathing(totalPrice, downPaymentRatio, interestRate, 30, monthlyIncome),
    [totalPrice, downPaymentRatio, interestRate, monthlyIncome]
  );

  const regretHeatmap = useMemo(() => 
    calculateRegretHeatmap(totalPrice, interestRate, downPaymentRatio, monthlyIncome),
    [totalPrice, interestRate, downPaymentRatio, monthlyIncome]
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/20 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500 rounded-xl">
          <Sliders className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">实时决策可视化</h2>
          <p className="text-sm text-slate-500">拖动参数，实时查看财务影响</p>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl">
        {/* Total Price Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            房价总价: <span className="text-indigo-600 dark:text-indigo-400">{totalPrice}万</span>
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="10"
            value={totalPrice}
            onChange={(e) => setTotalPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
        </div>

        {/* Down Payment Ratio Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            首付比例: <span className="text-indigo-600 dark:text-indigo-400">{downPaymentRatio}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={downPaymentRatio}
            onChange={(e) => setDownPaymentRatio(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
        </div>

        {/* Interest Rate Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            利率: <span className="text-indigo-600 dark:text-indigo-400">{interestRate.toFixed(2)}%</span>
          </label>
          <input
            type="range"
            min="2"
            max="7"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
        </div>

        {/* Monthly Income Slider */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            月收入: <span className="text-indigo-600 dark:text-indigo-400">{(monthlyIncome/10000).toFixed(1)}万</span>
          </label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: '综合看板', icon: LayoutGrid },
          { id: 'timeline', label: '时间轴', icon: TrendingUp },
          { id: 'risk', label: '风险梯度', icon: Activity },
          { id: 'breathing', label: '现金流呼吸', icon: Activity },
          { id: 'heatmap', label: '后悔热力图', icon: Flame }
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">30年还款时间轴</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: '年份', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: '金额(万)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="remainingPrincipal" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="剩余本金" />
                <Area type="monotone" dataKey="cumulativeInterest" stackId="2" stroke="#f59e0b" fill="#f59e0b" name="累计利息" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {(activeChart === 'all' || activeChart === 'risk') && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">风险颜色梯度</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskGradient}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="风险值">
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">现金流呼吸</h3>
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
                    呼吸空间
                  </text>
                </svg>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              月收入: ¥{cashFlowBreathing.monthlyIncome.toLocaleString()} | 
              月供: ¥{cashFlowBreathing.monthlyPayment.toFixed(0).toLocaleString()} | 
              可支配: ¥{cashFlowBreathing.discretionary.toFixed(0).toLocaleString()}
            </div>
          </div>
        )}

        {(activeChart === 'all' || activeChart === 'heatmap') && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">后悔热力图</h3>
            <div className="grid grid-cols-5 gap-2">
              {regretHeatmap.map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    backgroundColor: `rgba(239, 68, 68, ${cell.regretScore / 100})`
                  }}
                  title={`价格: ${cell.price}万, 利率: ${cell.rate}%, 后悔度: ${cell.regretScore}`}
                >
                  {cell.regretScore}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-500 text-center">
              颜色越深 = 后悔概率越高
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveDashboard;
