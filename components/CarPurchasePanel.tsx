import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Wallet, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Train, 
  Fuel, 
  ParkingCircle, 
  Calculator,
  Info,
  Zap,
  Tag,
  Smile,
  LogIn
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { CarParams, CarAnalysisResult, Language, MonthlyPayment } from '../types';
import DetailedPaymentTable from './DetailedPaymentTable';

import { User as FirebaseUser } from 'firebase/auth';

interface CarPurchasePanelProps {
  t: any;
  language?: Language;
  user?: FirebaseUser | null;
  onOpenLogin?: () => void;
}

const CarPurchasePanel: React.FC<CarPurchasePanelProps> = ({ t, language = 'ZH', user, onOpenLogin }) => {
  const isEn = language === 'EN';

  // Initial State
  const [params, setParams] = useState<CarParams>({
    carPrice: 200000,
    downPaymentRatio: 30,
    loanTerm: 3,
    interestRate: 3.5,
    monthlyIncome: 15000,
    insurance: 5000,
    maintenance: 3000,
    fuelCost: 10000,
    parkingFee: 500,
    depreciationRate: 15,
    commuteMethod: 'public_transport',
    monthlyCommuteCost: 500,
    weekendUsage: 'medium',
    familySupportAmount: 0,
    energyType: 'gas',
    purchaseTax: 17000, 
    licensePlateCost: 0,
    loanServiceFee: 3000, // Common service fee
    enableMileageCalc: false,
    fuelConsumption: 8, // 8L/100km or 15kWh/100km
    energyPrice: 8, // 8 RMB/L or 1.2 RMB/kWh
    annualMileage: 15000,
    purchasePurpose: 'commute'
  });

  // Calculations
  const result: CarAnalysisResult = useMemo(() => {
    // 1. Loan Calculation
    const loanAmount = params.carPrice * (1 - params.downPaymentRatio / 100);
    const totalDownPayment = params.carPrice * params.downPaymentRatio / 100;
    const personalDownPayment = Math.max(0, totalDownPayment - (params.familySupportAmount || 0));
    
    const monthlyRate = params.interestRate / 100 / 12;
    const totalMonths = params.loanTerm * 12;
    
    let monthlyPayment = 0;
    let totalLoanInterest = 0;
    
    const monthlyData: MonthlyPayment[] = [];
    
    if (loanAmount > 0) {
      if (monthlyRate > 0) {
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        totalLoanInterest = monthlyPayment * totalMonths - loanAmount;
        
        // Generate Schedule
        let remainingPrincipal = loanAmount;
        for (let i = 1; i <= totalMonths; i++) {
          const interest = remainingPrincipal * monthlyRate;
          const principal = monthlyPayment - interest;
          remainingPrincipal -= principal;
          
          monthlyData.push({
            monthIndex: i,
            payment: monthlyPayment,
            principal,
            interest,
            remainingPrincipal: Math.max(0, remainingPrincipal)
          });
        }
        
      } else {
        monthlyPayment = loanAmount / totalMonths;
        
         // Generate Schedule (Zero Interest)
        let remainingPrincipal = loanAmount;
        for (let i = 1; i <= totalMonths; i++) {
          const principal = monthlyPayment;
          remainingPrincipal -= principal;
          
          monthlyData.push({
            monthIndex: i,
            payment: monthlyPayment,
            principal,
            interest: 0,
            remainingPrincipal: Math.max(0, remainingPrincipal)
          });
        }
      }
    }

    // 2. Running Costs (Monthly average)
    const monthlyInsurance = params.insurance / 12;
    const monthlyMaintenance = params.maintenance / 12;
    const monthlyFuel = params.fuelCost / 12;
    const monthlyRunningCost = monthlyInsurance + monthlyMaintenance + monthlyFuel + params.parkingFee;
    
    const monthlyTotalCost = monthlyPayment + monthlyRunningCost;

    // 3. Depreciation & Resale Value (5 Years)
    const depreciationCurve = [];
    let currentValue = params.carPrice;
    let totalRunningCostSoFar = 0;
    
    for (let year = 0; year <= 5; year++) {
      depreciationCurve.push({
        year,
        value: currentValue,
        totalCost: params.carPrice * (params.downPaymentRatio / 100) + // Down payment
                   (monthlyPayment * 12 * Math.min(year, params.loanTerm)) + // Loan payments made
                   (monthlyRunningCost * 12 * year) // Running costs
      });
      if (year < 5) {
        currentValue = currentValue * (1 - params.depreciationRate / 100);
      }
    }
    
    const resaleValue5Years = currentValue;
    const initialOneOffCost = params.purchaseTax + params.licensePlateCost + (params.loanServiceFee || 0);
    const totalCost5Years = (monthlyPayment * totalMonths) + (params.carPrice * params.downPaymentRatio / 100) + (monthlyRunningCost * 12 * 5) + initialOneOffCost - resaleValue5Years;

    // 4. Analysis Metrics
    const dti = (monthlyPayment / params.monthlyIncome) * 100;
    const transportCostRatio = (monthlyTotalCost / params.monthlyIncome) * 100;
    
    // Break-even analysis (Car vs Alternative)
    // Monthly gain/loss = Alternative Cost - Car Total Cost
    const monthlyDifference = params.monthlyCommuteCost - monthlyTotalCost;
    let breakEvenYear = null;
    
    // Simple logic: if car is cheaper monthly (unlikely), break even is immediate. 
    // Usually car is more expensive. We look at "utility" or calculate strictly financial cost?
    // Let's stick to cost comparison. If monthlyDifference is negative, you simply spend more.
    // Break-even usually implies upfront cost vs saving. Here car has upfront AND higher monthly.
    // So "break even" might be against taxi if taxi is very expensive.
    
    // Let's calculate equivalent taxi cost for comparison chart
    
    // 5. Necessity Score
    let score = 50; 
    
    // Adjust by DTI
    if (dti > 20) score -= 20;
    else if (dti > 10) score -= 10;
    else score += 10;
    
    // Adjust by Transport Cost Ratio
    if (transportCostRatio > 30) score -= 20;
    else if (transportCostRatio > 15) score -= 10;
    else score += 5;
    
    // Adjust by Usage
    if (params.weekendUsage === 'high') score += 15;
    if (params.weekendUsage === 'medium') score += 5;
    
    // Adjust by Alternative Cost (If alternative is expensive, car is more justified)
    // Adjust by Alternative Cost (If alternative is expensive, car is more justified)
    if (params.monthlyCommuteCost > 1500) score += 15;
    if (params.monthlyCommuteCost < 300) score -= 10;

    // Adjust by Family Support (Reduces initial burden)
    if ((params.familySupportAmount || 0) > 0) {
      if ((params.familySupportAmount || 0) >= totalDownPayment) score += 15; // Family covers all down payment
      else score += 10; 
    }

    // Adjust by Purpose
    if (params.purchasePurpose === 'marriage') score += 10; // High necessity for life event
    if (params.purchasePurpose === 'family') score += 15; // High necessity for kids/elderly
    if (params.purchasePurpose === 'status') score -= 10; // Purely for face usually irrational financially
    
    score = Math.max(0, Math.min(100, score));
    
    let recommendationAction: 'BUY' | 'WAIT' | 'DONT_BUY' = 'WAIT';
    if (score >= 70) recommendationAction = 'BUY';
    else if (score <= 40) recommendationAction = 'DONT_BUY';
    
    return {
      monthlyPayment,
      totalLoanInterest,
      totalCost5Years,
      monthlyTotalCost,
      resaleValue5Years,
      dti,
      transportCostRatio,
      breakEvenYear,
      necessityScore: score,
      recommendation: {
        action: recommendationAction,
        reason: isEn ? getRecommendationReasonEn(score, dti, transportCostRatio) : getRecommendationReasonZh(score, dti, transportCostRatio),
        description: isEn ? getRecommendationDescEn(recommendationAction) : getRecommendationDescZh(recommendationAction)

      },
      // Pass calculated personal down payment to use in UI if needed (though we calculate it in render for summary usually, here we can return it if we expanded result type, or just calc in component)
      personalDownPayment, 
      monthlyData, // Add generated schedule
      charts: {
        monthlyCashFlow: [
          { name: isEn ? 'Car Return' : '车贷月供', value: monthlyPayment },
          { name: isEn ? 'Fuel/Charge' : '油费/电费', value: monthlyFuel },
          { name: isEn ? 'Insurance' : '保险费', value: monthlyInsurance },
          { name: isEn ? 'Maintenance' : '保养维修', value: monthlyMaintenance },
          { name: isEn ? 'Parking' : '停车费', value: params.parkingFee }
        ],
        costBreakdown: [
          { name: isEn ? 'Depreciation' : '车辆折旧', value: params.carPrice - resaleValue5Years },
          { name: isEn ? 'Loan Interest' : '贷款利息', value: totalLoanInterest },
          { name: isEn ? 'Insurance' : '保险费用', value: monthlyInsurance * 12 * 5 },
          { name: isEn ? 'Parking' : '停车费用', value: params.parkingFee * 12 * 5 },
          { name: isEn ? 'Insurance' : '保险费用', value: monthlyInsurance * 12 * 5 },
          { name: isEn ? 'Parking' : '停车费用', value: params.parkingFee * 12 * 5 },
          { name: isEn ? 'Fuel/Maint.' : '油费保养', value: (monthlyFuel + monthlyMaintenance) * 12 * 5 },
          { name: isEn ? 'Fuel/Maint.' : '油费保养', value: (monthlyFuel + monthlyMaintenance) * 12 * 5 },
          { name: isEn ? 'Tax & Fees' : '税费杂项', value: params.purchaseTax + params.licensePlateCost + (params.loanServiceFee || 0) }
        ],
        depreciationCurve
      }
    };
  }, [params, isEn]);

  // Helpers
  const formatCurrency = (val: number) => isEn ? `¥${Math.round(val).toLocaleString()}` : `${(val/10000).toFixed(1)}万`;
  const formatMoney = (val: number) => `¥${Math.round(val).toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* 1. Header & Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Car className="h-6 w-6" />
                {isEn ? 'Car Purchase Necessity Score' : '买车必要性评分'}
              </h2>
              <p className="text-indigo-200">
                {isEn ? 'AI Analysis based on financial health & usage' : '基于财务状况和用车频率的AI综合分析'}
              </p>
            </div>
            
            <div className="flex items-end gap-4 mt-6">
              <div className="text-7xl font-bold tracking-tighter">
                {result.necessityScore}
              </div>
              <div className="pb-4">
                <div className="text-xl font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg inline-block">
                  {result.recommendation.action === 'BUY' ? (isEn ? 'Recommended' : '建议购买') :
                   result.recommendation.action === 'WAIT' ? (isEn ? 'Wait & See' : '建议观望') :
                   (isEn ? 'Not Recommended' : '不建议购买')}
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-indigo-100 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-md">
              "{result.recommendation.reason}"
            </p>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl"></div>
        </div>
        
        {/* Recommendation Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-center">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-500" />
            {isEn ? 'Analysis Advice' : '分析建议'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {result.recommendation.description}
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-slate-500">{isEn ? 'DTI Impact' : '月痛感指数'}</span>
              <span className={`font-bold ${result.transportCostRatio > 20 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {result.transportCostRatio.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${result.transportCostRatio > 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, result.transportCostRatio)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isEn ? '% of monthly income spent on car' : '车相关支出占月收入比例'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Parameters Input */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg h-fit">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
            <Calculator className="h-5 w-5 text-indigo-500"/>
            {isEn ? 'Parameters' : '参数设置'}
          </h3>
          
          <div className="space-y-6">
            {/* Energy Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isEn ? 'Energy Type' : '能源类型'}
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                 <button
                   onClick={() => setParams({
                      ...params, 
                      energyType: 'gas', 
                      purchaseTax: Math.round(params.carPrice / 11.3),
                      fuelConsumption: 8.0,
                      energyPrice: 8.0
                    })}
                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${params.energyType === 'gas' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600' : 'text-slate-500'}`}
                 >
                   {isEn ? 'Gas' : '燃油车'}
                 </button>
                 <button
                   onClick={() => setParams({
                      ...params, 
                      energyType: 'electric', 
                      purchaseTax: 0,
                      fuelConsumption: 15, // kWh/100km
                      energyPrice: 1.2 // Commercial/Home mix
                    })}
                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${params.energyType === 'electric' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600' : 'text-slate-500'}`}
                 >
                   {isEn ? 'EV' : '纯电'}
                 </button>
                 <button
                   onClick={() => setParams({
                      ...params, 
                      energyType: 'hybrid', 
                      purchaseTax: 0,
                      fuelConsumption: 5.0,
                      energyPrice: 8.0
                    })} 
                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${params.energyType === 'hybrid' ? 'bg-white dark:bg-slate-700 shadow text-cyan-600' : 'text-slate-500'}`}
                 >
                   {isEn ? 'Hybrid' : '混动'}
                 </button>
              </div>
            </div>
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isEn ? 'Car Price (¥)' : '车辆价格 (元)'}
              </label>
              <input 
                type="range" 
                min="50000" 
                max="1000000" 
                step="10000" 
                value={params.carPrice}
                onChange={(e) => setParams({...params, carPrice: Number(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-2"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">5万</span>
                <input 
                  type="number" 
                  value={params.carPrice}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setParams({
                      ...params, 
                      carPrice: price,
                      purchaseTax: params.energyType === 'gas' ? Math.round(price / 11.3) : 0
                    });
                  }}
                  className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-700 dark:text-slate-300 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isEn ? 'Monthly Income' : '月收入'}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={params.monthlyIncome}
                  onChange={(e) => setParams({...params, monthlyIncome: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-8 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute left-3 top-3.5 text-slate-400 text-sm">¥</span>
              </div>
            </div>
            
            {/* Down Payment & Loan */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{isEn ? 'Down Payment %' : '首付比例'}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={params.downPaymentRatio}
                    onChange={(e) => setParams({...params, downPaymentRatio: Number(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{isEn ? 'Interest Rate' : '贷款利率'}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={params.interestRate}
                    onChange={(e) => setParams({...params, interestRate: Number(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">%</span>
                </div>
              </div>
            </div>

            {/* Loan Term Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isEn ? 'Loan Term (Years)' : '贷款期限 (年)'}
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {[1, 2, 3, 4, 5].map((year) => (
                  <button
                    key={year}
                    onClick={() => setParams({...params, loanTerm: year})}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      params.loanTerm === year 
                        ? 'bg-white dark:bg-slate-700 shadow text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {year}{isEn ? 'Y' : '年'}
                  </button>
                ))}
              </div>
            </div>

            {/* Family Support */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                {isEn ? 'Family Support (Down Payment)' : '家人支持 (首付赞助)'}
                <span className="bg-emerald-100 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded-full">{isEn ? 'Bonus' : '加分项'}</span>
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={params.familySupportAmount}
                  onChange={(e) => setParams({...params, familySupportAmount: Number(e.target.value)})}
                  className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl px-4 py-3 pl-8 text-emerald-700 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
                <span className="absolute left-3 top-3.5 text-emerald-500 text-sm">¥</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 pl-1">
                {isEn ? 'Deducted from your initial payment' : '将从您的首付支出中扣除'}
              </p>
            </div>

            {/* Annual Costs */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isEn ? 'Annual Costs' : '年度开销'}</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">{isEn ? 'Insurance/yr' : '保险/年'}</label>
                    <input type="number" value={params.insurance} onChange={e => setParams({...params, insurance: Number(e.target.value)})} className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">{isEn ? 'Maintenance/yr' : '保养/年'}</label>
                    <input type="number" value={params.maintenance} onChange={e => setParams({...params, maintenance: Number(e.target.value)})} className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">{params.energyType === 'gas' ? (isEn ? 'Fuel/yr' : '油费/年') : (isEn ? 'Charge/yr' : '电费/年')}</label>
                    <input type="number" value={params.fuelCost} onChange={e => setParams({...params, fuelCost: Number(e.target.value)})} className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">{isEn ? 'Parking/mo' : '停车/月'}</label>
                    <input type="number" value={params.parkingFee} onChange={e => setParams({...params, parkingFee: Number(e.target.value)})} className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 text-sm"/>
                  </div>
               </div>
            </div>

             {/* One-off Costs */}
             <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isEn ? 'Upfront Costs' : '落地开销'}</h4>
                <div className="grid grid-cols-3 gap-2">
                   <div>
                     <label className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
                       {isEn ? 'Tax' : '购置税'}
                     </label>
                     <input type="number" value={params.purchaseTax} onChange={e => setParams({...params, purchaseTax: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 text-xs"/>
                   </div>
                   <div>
                     <label className="text-[10px] text-slate-500 mb-1">{isEn ? 'Plate' : '上牌'}</label>
                     <input type="number" value={params.licensePlateCost} onChange={e => setParams({...params, licensePlateCost: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 text-xs"/>
                   </div>
                   <div>
                     <label className="text-[10px] text-slate-500 mb-1">{isEn ? 'Service' : '金融/服务费'}</label>
                     <input type="number" value={params.loanServiceFee} onChange={e => setParams({...params, loanServiceFee: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 text-xs"/>
                   </div>
                </div>
             </div>

             {/* Usage */}
             <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isEn ? 'Usage' : '用车场景'}</h4>
               <div>
                 <label className="text-xs text-slate-500 mb-2 block">{isEn ? 'Current Commute Cost' : '当前通勤开销 (打车/公交)'}</label>
                 <input type="number" value={params.monthlyCommuteCost} onChange={e => setParams({...params, monthlyCommuteCost: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 text-sm"/>
               </div>
               <div>
                  <label className="text-xs text-slate-500 mb-2 block">{isEn ? 'Weekend Usage' : '周末用车需求'}</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setParams({...params, weekendUsage: level as any})}
                        className={`flex-1 text-xs py-1.5 rounded-md transition-all ${params.weekendUsage === level ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
                      >
                        {level === 'low' ? (isEn ? 'Low' : '低') : level === 'medium' ? (isEn ? 'Med' : '中') : (isEn ? 'High' : '高')}
                      </button>
                    ))}
                  </div>
               </div>
             </div>

             {/* Mileage Calculator - Fills empty space */}
             <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Fuel className="h-3 w-3"/> {isEn ? 'Smart Mileage' : '能耗计算器'}
                  </h4>
                  <button 
                    onClick={() => {
                       const nextState = !params.enableMileageCalc;
                       setParams(p => ({
                         ...p, 
                         enableMileageCalc: nextState,
                         fuelCost: nextState ? (Math.round(p.annualMileage / 100 * p.fuelConsumption * p.energyPrice)) : p.fuelCost
                       }));
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${params.enableMileageCalc ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                  >
                    {params.enableMileageCalc ? (isEn ? 'On' : '已开启') : (isEn ? 'Off' : '未开启')}
                  </button>
                </div>

                {params.enableMileageCalc && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">
                            {params.energyType === 'gas' ? (isEn ? 'Fuel/100km' : '油耗(L/100km)') : (isEn ? 'kWh/100km' : '电耗(度/100km)')}
                          </label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={params.fuelConsumption} 
                            onChange={e => {
                               const val = Number(e.target.value);
                               setParams(p => ({...p, fuelConsumption: val, fuelCost: Math.round(p.annualMileage / 100 * val * p.energyPrice)}));
                            }} 
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">
                            {params.energyType === 'gas' ? (isEn ? 'Price (¥/L)' : '油价(元/升)') : (isEn ? 'Price (¥/kWh)' : '电价(元/度)')}
                          </label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={params.energyPrice} 
                            onChange={e => {
                               const val = Number(e.target.value);
                               setParams(p => ({...p, energyPrice: val, fuelCost: Math.round(p.annualMileage / 100 * p.fuelConsumption * val)}));
                            }} 
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] text-slate-400 block mb-1">
                           {isEn ? 'Annual Mileage (km)' : '年行驶里程 (公里)'}
                        </label>
                        <div className="flex items-center gap-2">
                           <input 
                              type="range" 
                              min="5000" 
                              max="50000" 
                              step="1000" 
                              value={params.annualMileage} 
                              onChange={e => {
                                 const val = Number(e.target.value);
                                 setParams(p => ({...p, annualMileage: val, fuelCost: Math.round(val / 100 * p.fuelConsumption * p.energyPrice)}));
                              }} 
                              className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                           />
                           <span className="text-xs font-medium w-12 text-right">{params.annualMileage/10000}万</span>
                        </div>
                     </div>
                     <div className="text-right text-xs text-indigo-600 font-medium pt-1 border-t border-dashed border-indigo-200">
                        = {params.fuelCost} {isEn ? 'CNY/yr' : '元/年'}
                     </div>
                  </div>
                )}
              </div>

             {/* Purchase Purpose */}
             <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isEn ? 'Core Purpose' : '购车核心动因'}</h4>
                <div className="grid grid-cols-2 gap-2">
                   {[
                     { id: 'commute', label: isEn?'Commute':'纯代步', icon: '🚲' },
                     { id: 'marriage', label: isEn?'Marriage':'结婚刚需', icon: '💍' },
                     { id: 'family', label: isEn?'Kids/Family':'接送娃/老人', icon: '👶' },
                     { id: 'status', label: isEn?'Social Status':'撑门面/社交', icon: '🤝' }
                   ].map(item => (
                     <button
                       key={item.id}
                       onClick={() => setParams({...params, purchasePurpose: item.id as any})}
                       className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${params.purchasePurpose === item.id 
                         ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                         : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'}`}
                     >
                       <span>{item.icon}</span>
                       {item.label}
                     </button>
                   ))}
                </div>
                {params.purchasePurpose === 'status' && (
                  <div className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                     ⚠ {isEn ? 'Warning: Paying for premiums often leads to faster wealth depreciation.' : '提醒：为"面子"买单通常是财富缩水的快车道，请确保这是商业投资而非纯消费。'}
                  </div>
                )}

             </div>

             {/* Repayment Mood Bar */}
             <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Smile className="h-4 w-4 text-emerald-500" />
                  {isEn ? 'Repayment Mood' : '还款心情条'}
                </h4>
                
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-medium text-slate-500">{isEn ? 'Monthly Burden' : '月度负担感'}</span>
                     <span className={`text-sm font-bold ${
                       result.transportCostRatio < 10 ? 'text-emerald-500' : 
                       result.transportCostRatio < 20 ? 'text-indigo-500' : 
                       result.transportCostRatio < 30 ? 'text-amber-500' : 'text-rose-500'
                     }`}>
                       {result.transportCostRatio < 10 ? (isEn?'Relaxed':'轻松') :
                        result.transportCostRatio < 20 ? (isEn?'Manageable':'适中') :
                        result.transportCostRatio < 30 ? (isEn?'Tight':'吃紧') : (isEn?'Painful':'痛苦')}
                     </span>
                  </div>
                  
                  {/* Mood Slider Track */}
                  <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                     {/* Gradient Zones */}
                     <div className="absolute inset-y-0 left-0 w-full flex">
                        <div className="w-[20%] bg-emerald-400/30"></div>
                        <div className="w-[20%] bg-indigo-400/30"></div>
                        <div className="w-[20%] bg-amber-400/30"></div>
                        <div className="w-[40%] bg-rose-400/30"></div>
                     </div>
                     
                     {/* Indicator */}
                     <div 
                       className="absolute top-0 h-full w-2 bg-white shadow-md border border-slate-300 rounded-full transition-all duration-500"
                       style={{ left: `${Math.min(95, Math.max(0, result.transportCostRatio * 2))}%` }} // Scale roughly 0-50% ratio to 0-100% width
                     ></div>
                  </div>

                  {/* Mood Emoji & Text */}
                  <div className="flex items-start gap-3 mt-2">
                     <div className="text-2xl pt-1">
                        {result.transportCostRatio < 10 ? '😎' : 
                         result.transportCostRatio < 20 ? '🙂' : 
                         result.transportCostRatio < 30 ? '😰' : '😭'}
                     </div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {result.transportCostRatio < 10 ? (isEn ? 'Like buying a toy. No sweat.' : '就像买个大玩具，毫无压力，尽情享受驾驶乐趣吧！') :
                         result.transportCostRatio < 20 ? (isEn ? 'Standard expense. Life is good.' : '标准用车支出，生活质量不受影响，稳稳的幸福。') :
                         result.transportCostRatio < 30 ? (isEn ? 'Might need to cut back on dining out.' : '钱包有点紧，可能要减少外出就餐或购物了。') :
                         (isEn ? 'Warning: You might work just to pay for the car.' : '警告：您可能沦为"车奴"，大部分收入都用来养车，慎重！')}
                     </p>
                  </div>
                </div>
             </div>

          </div>
        </div>

        {/* 3. Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">{isEn ? 'Monthly Total' : '月度总支出'}</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white">
                {formatMoney(result.monthlyTotalCost)}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">{isEn ? '5-Year Cost' : '5年总成本'}</div>
               <div className="text-lg font-bold text-slate-800 dark:text-white">
                {formatCurrency(result.totalCost5Years)}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">{isEn ? 'Transport Ratio' : '出行收入比'}</div>
              <div className={`text-lg font-bold ${result.transportCostRatio > 20 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {result.transportCostRatio.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="text-xs text-slate-500 mb-1">{isEn ? 'Resale Value' : '5年后残值'}</div>
               <div className="text-lg font-bold text-indigo-500">
                {formatCurrency(result.resaleValue5Years)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Cost Breakdown Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
               <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300">
                 {isEn ? 'Monthly Cost Breakdown' : '月度支出构成'}
               </h3>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={result.charts.monthlyCashFlow}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {[ '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color, index) => (
                         <Cell key={`cell-${index}`} fill={color} />
                       ))}
                     </Pie>
                     <Tooltip formatter={(val: number) => `¥${val.toLocaleString()}`}/>
                     <Legend verticalAlign="bottom" height={36}/>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Total Cost Breakdown Chart */}
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
               <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300">
                 {isEn ? '5-Year Total Direct Cost' : '5年真金白银总支出'}
               </h3>
                <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={result.charts.costBreakdown} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10}} />
                     <Tooltip formatter={(val: number) => `¥${val.toLocaleString()}`}/>
                     <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                       {result.charts.costBreakdown.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][index % 5]} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <p className="text-xs text-center text-slate-400 mt-2">
                 {isEn ? '*Includes depreciation loss, not just cash out' : '*包含车辆贬值带来的隐形亏损'}
               </p>
            </div>
          </div>
          
          {/* Comparison Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              {isEn ? 'Make Sense? Car vs Taxi' : '值不值？买车 vs 打车'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">{isEn ? 'Item' : '项目'}</th>
                    <th className="px-4 py-3">{isEn ? 'Buying Car' : '自己买车'}</th>
                    <th className="px-4 py-3 rounded-r-xl">{isEn ? 'Taxi/Ride-share' : '天天打车'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="px-4 py-3 font-medium">{isEn ? 'Monthly Cost' : '月度开销'}</td>
                    <td className="px-4 py-3 font-bold text-rose-600">{formatMoney(result.monthlyTotalCost)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{formatMoney(params.monthlyCommuteCost)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">{isEn ? 'Cost Difference (Yr)' : '年开销差额'}</td>
                    <td className="px-4 py-3 text-slate-500">
                       {result.monthlyTotalCost > params.monthlyCommuteCost ? 
                         `+${formatMoney((result.monthlyTotalCost - params.monthlyCommuteCost) * 12)}` : 
                         `-${formatMoney((params.monthlyCommuteCost - result.monthlyTotalCost) * 12)}`
                       }
                    </td>
                    <td className="px-4 py-3 text-slate-500">-</td>
                  </tr>
                   <tr>
                    <td className="px-4 py-3 font-medium">{isEn ? 'Capital Occupied' : '资金占用'}</td>
                    <td className="px-4 py-3 text-slate-500">{formatCurrency((params.carPrice * params.downPaymentRatio / 100) + params.purchaseTax + params.licensePlateCost + (params.loanServiceFee || 0))}</td>
                    <td className="px-4 py-3 text-slate-500">{formatCurrency((params.carPrice * params.downPaymentRatio / 100 - (params.familySupportAmount || 0)) + params.purchaseTax + params.licensePlateCost + (params.loanServiceFee || 0))}</td>
                    <td className="px-4 py-3 text-slate-500">0</td>
                  </tr>
                  {(params.familySupportAmount || 0) > 0 && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-emerald-600">{isEn ? 'Family Support' : '家人赞助'}</td>
                    <td className="px-4 py-3 text-emerald-600">-{formatCurrency(params.familySupportAmount!)}</td>
                    <td className="px-4 py-3 text-slate-500">-</td>
                  </tr>
                  )}
                   <tr>
                    <td className="px-4 py-3 font-medium">{isEn ? 'Pros' : '优势'}</td>
                    <td className="px-4 py-3 text-slate-500">{isEn ? 'Freedom, Privacy, Capacity' : '自由、私密、装载力强'}</td>
                    <td className="px-4 py-3 text-slate-500">{isEn ? 'No maintenance, No parking' : '无需保养、不用找车位'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Repayment Schedule - Login Required */}
            {(result.monthlyData && result.monthlyData.length > 0) && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative">
                {!user && (
                  <div className="absolute inset-0 z-10 bg-black/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center max-w-sm mx-4 shadow-2xl">
                      <div className="w-14 h-14 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center">
                        <LogIn className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {isEn ? 'Unlock Car Loan Schedule' : '解锁车贷还款明细'}
                      </h3>
                      <p className="text-slate-400 text-sm mb-6">
                        {isEn 
                          ? 'Log in to view complete monthly repayment schedule, principal/interest breakdown, and detailed analysis.' 
                          : '登录后查看完整的逐月还款计划、本金利息分布等详细数据'}
                      </p>
                      <button 
                        onClick={() => onOpenLogin && onOpenLogin()}
                        className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all"
                      >
                        {isEn ? 'Login / Sign Up Now' : '立即登录 / 注册'}
                      </button>
                      <p className="text-slate-600 text-xs mt-4">
                        {isEn ? '🔒 Your data is secure' : '🔒 您的数据安全有保障'}
                      </p>
                    </div>
                  </div>
                )}
                <div className={!user ? 'opacity-30 pointer-events-none select-none' : ''}>
                  <DetailedPaymentTable monthlyPayments={result.monthlyData} t={t} />
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-sm">
               <span className="font-bold mr-2">{isEn ? 'Insight:' : '醒脑结论:'}</span>
               {result.monthlyTotalCost > params.monthlyCommuteCost 
                 ? (isEn 
                     ? `Owning this car costs ¥${Math.round(result.monthlyTotalCost - params.monthlyCommuteCost).toLocaleString()} MORE per month than your current commute. Is the "freedom" worth this premium?`
                     : `买车后每月比现在多花 ${Math.round(result.monthlyTotalCost - params.monthlyCommuteCost).toLocaleString()} 元。为了"开车自由"支付这笔溢价是否值得？`)
                 : (isEn
                     ? `Wow! Buying this car is actually cheaper than your commute. You should probably buy it.`
                     : `哇！买车居然比你现在通勤还便宜，从财务角度看完全值得买！`)
               }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Functions for Text Generation
const getRecommendationReasonZh = (score: number, dti: number, transportRatio: number) => {
  if (score >= 80) return "您的财务状况完全可以轻松负担，且用车需求强烈，买车能显著提升生活质量。";
  if (score >= 60) return "买车在财务上可行，虽有一定压力但可控。建议关注后续养车成本。";
  if (score >= 40) return "买车会带来明显的财务压力，大大降低生活从容度。建议再攒攒钱或考虑更便宜的车。";
  return "买车将严重影响您的生活质量，甚至导致财务危机。现阶段强烈建议维持现状。";
}

const getRecommendationReasonEn = (score: number, dti: number, transportRatio: number) => {
  if (score >= 80) return "Financial health helps support this purchase smoothly. It will improve life quality.";
  if (score >= 60) return "Financially feasible with manageable pressure. Watch out for maintenance costs.";
  if (score >= 40) return "This purchase will cause significant financial stress. Consider saving more or a cheaper car.";
  return "Buying this car fits poorly with your current finances. Strongly better to wait.";
}

const getRecommendationDescZh = (action: 'BUY' | 'WAIT' | 'DONT_BUY') => {
  if (action === 'BUY') return "根据分析，您的收入足以覆盖车贷及养车成本，且这笔支出不会过度挤占其他生活开销。如果确实有通勤或家庭出行刚需，现在入手是一个不错的选择。可以适当考虑利用低息贷款保留现金流。";
  if (action === 'WAIT') return "目前的财务状况处于临界区。虽然勉强能买，但车辆相关支出会占到收入的较大比例（通常建议不超过20%）。买车后可能会感到生活质量下降（不敢消费、从容度降低）。建议暂缓购车，或选择总价更低的二手车/代步车。";
  return "当前您的财务状况不适合购车。车辆不仅仅是买车的一次性投入，后续每月的折旧、保险、油费和停车费是一笔巨大的'现金流黑洞'。打车或租车在现阶段是远比买车更经济、更理性的选择。请以此为契机积累资产，而不是增加负债。";
}

const getRecommendationDescEn = (action: 'BUY' | 'WAIT' | 'DONT_BUY') => {
  if (action === 'BUY') return "Your income comfortably covers the loan and maintenance. This expense won't crowd out other lifestyle needs. If you have valid commute needs, it's a good time to buy. Consider low-interest loans to keep cash flow.";
  if (action === 'WAIT') return "Your finances are in the borderline zone. You can afford it, but car expenses will eat up a large chunk of income (ideally <20%). Buying might lower your life quality. Recommend waiting or looking for cheaper/used cars.";
  return "Not suitable to buy right now. A car is not just a one-time cost but a 'cash flow black hole' with depreciation, insurance, and fuel. Taxis or ride-sharing are far more economical and rational for you right now. Build assets, don't add liabilities.";
}

export default CarPurchasePanel;
