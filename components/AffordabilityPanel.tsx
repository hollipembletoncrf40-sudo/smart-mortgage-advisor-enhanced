import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine, Cell } from 'recharts';
import { DollarSign, TrendingDown, AlertTriangle, CheckCircle2, Home, Percent } from 'lucide-react';
import { AffordabilityMetrics } from '../utils/calculate';
import { Language } from '../types';

interface AffordabilityPanelProps {
  affordability: AffordabilityMetrics;
  monthlyIncome: number;
  monthlyPayment: number;
  t: any;
  language?: Language;
}

const AffordabilityPanel: React.FC<AffordabilityPanelProps> = ({ affordability, monthlyIncome, monthlyPayment, t, language = 'ZH' }) => {
  const isEn = language === 'EN';
  
  // Prepare data for monthly payment vs income bar chart
  const paymentVsIncomeData = [
    { name: isEn ? 'Monthly Income' : '月收入', value: monthlyIncome, fill: '#10b981' },
    { name: isEn ? 'Monthly Payment' : '月供', value: monthlyPayment, fill: '#6366f1' },
    { name: isEn ? 'Max Affordable' : '最大承受', value: affordability.maxAffordableMonthlyPayment, fill: '#f59e0b' }
  ];

  // Prepare data for income stress test line chart
  const stressTestData = affordability.incomeStressPoints;

  // DTI Gauge calculation
  const dtiAngle = Math.min(180, (affordability.currentDTI / 100) * 180);
  const dtiColor = affordability.currentDTI < 30 ? '#10b981' : affordability.currentDTI < 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Down Payment Capacity */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <Home className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {isEn ? 'Down Payment Capacity' : '首付能力'}
            </h4>
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {isEn ? `¥${(affordability.downPaymentCapacity * 10000).toLocaleString()}` : `${affordability.downPaymentCapacity.toFixed(0)}万`}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isEn ? 'Based on savings and income' : '基于储蓄和收入估算'}
          </p>
        </div>

        {/* Max Affordable Monthly Payment */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-500 rounded-xl">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {isEn ? 'Max Monthly Payment' : '最大承受月供'}
            </h4>
          </div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            ¥{affordability.maxAffordableMonthlyPayment.toLocaleString()}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isEn ? 'Based on 30% DTI safe limit' : '基于30% DTI安全线'}
          </p>
        </div>

        {/* Max Affordable Price */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-500 rounded-xl">
              <Home className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {isEn ? 'Max Buying Power' : '最大购买力'}
            </h4>
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
            {isEn ? `¥${(affordability.maxAffordablePrice * 10000).toLocaleString()}` : `${affordability.maxAffordablePrice.toFixed(0)}万`}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isEn ? 'Maximum affordable home price' : '可承受的最高房价'}
          </p>
        </div>
      </div>

      {/* DTI Gauge */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Percent className="h-4 w-4 text-indigo-500"/>
          {isEn ? 'DTI (Debt-to-Income Ratio)' : 'DTI 负债收入比'}
        </h3>
        <div className="flex flex-col items-center">
          {/* Simple Gauge Visualization */}
          <div className="relative w-64 h-32 mb-4">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Colored segments */}
              <path
                d="M 20 80 A 80 80 0 0 1 100 20"
                fill="none"
                stroke="#10b981"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 100 20 A 80 80 0 0 1 140 40"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 140 40 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="#ef4444"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Needle */}
              <line
                x1="100"
                y1="80"
                x2={100 + 70 * Math.cos((180 - dtiAngle) * Math.PI / 180)}
                y2={80 - 70 * Math.sin((180 - dtiAngle) * Math.PI / 180)}
                stroke={dtiColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="80" r="5" fill={dtiColor} />
            </svg>
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: dtiColor }}>
                  {affordability.currentDTI.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn ? 'Current DTI' : '当前DTI'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'Safe (<30%)' : '安全 (<30%)'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'Warning (30-50%)' : '警告 (30-50%)'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'Danger (>50%)' : '危险 (>50%)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Payment vs Income Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-indigo-500"/>
          {isEn ? 'Payment vs Income Comparison' : '月供 vs 收入对比'}
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentVsIncomeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => `¥${value.toLocaleString()}`}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {paymentVsIncomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income Stress Test Line Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-indigo-500"/>
          {isEn ? 'Income Stress Test' : '收入压力测试'}
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stressTestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="incomeReduction" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{ value: isEn ? 'Income Reduction (%)' : '收入下降 (%)', position: 'bottom', offset: -5, style: { fontSize: 12, fill: '#64748b' } }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{ value: 'DTI (%)', angle: -90, position: 'left', style: { fontSize: 12, fill: '#64748b' } }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => `${value}%`}
              />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" label={isEn ? 'Safe' : '安全线'} />
              <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label={isEn ? 'Danger' : '危险线'} />
              <Line 
                type="monotone" 
                dataKey="dti" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const color = payload.status === 'safe' ? '#10b981' : payload.status === 'warning' ? '#f59e0b' : '#ef4444';
                  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={2} />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          {isEn 
            ? 'Shows how DTI changes when income decreases, helping identify financial risk points'
            : '图表显示收入下降时DTI的变化，帮助识别财务危险点'
          }
        </p>
      </div>

      {/* Stress Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Down 20% */}
        <div className={`rounded-2xl p-5 border ${
          affordability.stressTests.incomeDown20.canAfford 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30'
            : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/30'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {affordability.stressTests.incomeDown20.canAfford ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            )}
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {isEn ? 'Income -20%' : '收入下降20%'}
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'New Income:' : '新收入:'}
              </span>
              <span className="font-bold text-slate-800 dark:text-white">
                ¥{affordability.stressTests.incomeDown20.newIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'New DTI:' : '新DTI:'}
              </span>
              <span className={`font-bold ${
                affordability.stressTests.incomeDown20.newDTI < 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {affordability.stressTests.incomeDown20.newDTI}%
              </span>
            </div>
            {!affordability.stressTests.incomeDown20.canAfford && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  {isEn ? 'Shortfall:' : '缺口:'}
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  ¥{affordability.stressTests.incomeDown20.shortfall.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rate Up 1% */}
        <div className={`rounded-2xl p-5 border ${
          affordability.stressTests.rateUp1.canAfford 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30'
            : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/30'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {affordability.stressTests.rateUp1.canAfford ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            )}
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {isEn ? 'Rate +1%' : '利率上涨1%'}
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'New Rate:' : '新利率:'}
              </span>
              <span className="font-bold text-slate-800 dark:text-white">
                {affordability.stressTests.rateUp1.newRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'New Payment:' : '新月供:'}
              </span>
              <span className="font-bold text-slate-800 dark:text-white">
                ¥{affordability.stressTests.rateUp1.newPayment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'Extra Cost:' : '额外成本:'}
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                +¥{affordability.stressTests.rateUp1.extraCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Combined Scenario */}
        <div className={`rounded-2xl p-5 border ${
          affordability.stressTests.combined.canAfford 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30'
            : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/30'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {affordability.stressTests.combined.canAfford ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            )}
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {isEn ? 'Combined Scenario' : '组合场景'}
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'New DTI:' : '新DTI:'}
              </span>
              <span className={`font-bold ${
                affordability.stressTests.combined.newDTI < 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {affordability.stressTests.combined.newDTI}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {isEn ? 'New Payment:' : '新月供:'}
              </span>
              <span className="font-bold text-slate-800 dark:text-white">
                ¥{affordability.stressTests.combined.newPayment.toLocaleString()}
              </span>
            </div>
            {!affordability.stressTests.combined.canAfford && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  {isEn ? 'Shortfall:' : '缺口:'}
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  ¥{affordability.stressTests.combined.shortfall.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffordabilityPanel;
