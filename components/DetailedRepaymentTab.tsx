
import React from 'react';
import { TrendingUp, LogIn, Calendar, ArrowRight } from 'lucide-react';
import AmortizationMoodBar from './AmortizationMoodBar';
import DetailedPaymentTable from './DetailedPaymentTable';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import RepaymentCalendar from './RepaymentCalendar';
import InflationProjection from './InflationProjection';
import { WealthCompassHeader } from './WealthCompassHeader';
import InvestmentWisdomCard from './InvestmentWisdomCard';

interface Props {
  t: any;
  language: 'ZH' | 'EN';
  result: any;
  params: any;
  user: any;
  setShowAuthModal: (show: boolean) => void;
  chartGranularity: 'year' | 'month';
  setChartGranularity: (g: 'year' | 'month') => void;
  scheduleChartData: any[];
  darkMode: boolean;
}

const DetailedRepaymentTab: React.FC<Props> = ({
  t,
  language,
  result,
  params,
  user,
  setShowAuthModal,
  chartGranularity,
  setChartGranularity,
  scheduleChartData,
  darkMode
}) => {
  return (
    <div className="w-full space-y-6 animate-fade-in pb-8" id="repayment-report-content">
       {/* New Branding Header */}
       <WealthCompassHeader language={language} />

       {/* Wisdom Card */}
       <InvestmentWisdomCard language={language} />

       {/* Visual Header & Chart Section */}
       <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/50 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        {/* Chart Header */}
        <div className="p-8 pb-0 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 mb-2">
                 <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                    <TrendingUp className="h-6 w-6 text-white" />
                 </div>
                 {t.paymentSchedule}
                 <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                    Smart Analysis
                 </span>
               </h3>
               <p className="text-slate-500 dark:text-slate-400 ml-[52px]">
                 {language === 'ZH' ? '深度解析您的还款路径与资金分布' : 'Deep dive into your repayment journey and capital distribution'}
               </p>
            </div>
            
            <div className="flex flex-col gap-3 self-start md:self-center items-end">
              {/* Granularity Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5">
                <button 
                  onClick={() => setChartGranularity('year')} 
                  className={`px-6 py-2 text-sm font-bold rounded-lg transition-all shadow-sm ${chartGranularity === 'year' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {t.viewYear}
                </button>
                <button 
                  onClick={() => setChartGranularity('month')} 
                  className={`px-6 py-2 text-sm font-bold rounded-lg transition-all shadow-sm ${chartGranularity === 'month' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {t.viewMonth}
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Chart */}
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scheduleChartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} opacity={0.5} />
                <XAxis 
                   dataKey="label" 
                   tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500}} 
                   axisLine={false} 
                   tickLine={false}
                   tickMargin={12}
                />
                <YAxis 
                   tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500}} 
                   axisLine={false} 
                   tickLine={false} 
                   tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                      backgroundColor: darkMode ? '#1e293b' : '#fff', 
                      borderRadius: '16px', 
                      border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                  itemStyle={{ paddingBottom: '4px' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                   type="monotone" 
                   dataKey="principal" 
                   stackId="1" 
                   stroke="#6366f1" 
                   strokeWidth={3}
                   fill="url(#colorPrincipal)" 
                   name={t.principal} 
                   animationDuration={1500}
                />
                <Area 
                   type="monotone" 
                   dataKey="interest" 
                   stackId="1" 
                   stroke="#f43f5e" 
                   strokeWidth={3}
                   fill="url(#colorInterest)" 
                   name={t.interest} 
                   animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Amortization Mood Bar (Scale-up) */}
        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mx-8 mb-8">
           <AmortizationMoodBar result={result} params={params} t={t} />
        </div>

        {/* Inflation Projection */}
        <div className="mx-8 mb-8">
          <InflationProjection 
            monthlyPayment={result.monthlyPayment}
            t={t}
            language={language}
            darkMode={darkMode}
          />
        </div>

        {/* Repayment Calendar Section */}
        <div className="px-8 pb-8">
          <RepaymentCalendar 
            monthlyPayment={result.monthlyPayment} 
            t={t} 
            language={language}
            darkMode={darkMode}
            params={params}
          />
        </div>
        
        {/* Detailed Table Section */}
        <div className="relative border-t border-slate-100 dark:border-slate-800">
          {!user && (
            <div className="absolute inset-0 z-20 bg-white/60 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center transition-all">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 text-center max-w-md mx-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform group-hover:scale-110 transition-transform duration-500">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">
                  {language === 'EN' ? 'Unlock Professional Data' : '解锁详细还款报告'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-base mb-8 leading-relaxed">
                  {language === 'EN' 
                    ? 'Log in to view complete monthly repayment schedule, principal/interest breakdown, and more professional insights.' 
                    : '登录后即可查看 30 年完整的逐月还款明细、本金/利息动态分布及更多专业投资分析。'}
                </p>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  {language === 'EN' ? 'Login / Sign Up Free' : '立即免费登录 / 注册'}
                  <ArrowRight className="h-5 w-5" />
                </button>
                <div className="mt-6 flex justify-center gap-6">
                   <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      {language === 'ZH' ? 'SSL 安全加密' : 'SSL Secure'}
                   </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {language === 'ZH' ? '隐私优先保护' : 'Privacy First'}
                   </div>
                </div>
              </div>
            </div>
          )}
          
          <div id="payment-schedule" className={`p-8 ${!user ? 'opacity-30 blur-sm pointer-events-none select-none grayscale' : ''} transition-all duration-700`}>
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                   <Calendar className="h-5 w-5 text-slate-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                   {language === 'ZH' ? '逐月还款详情' : 'Monthly Schedule'}
                </h4>
             </div>
            <DetailedPaymentTable 
              monthlyPayments={result.monthlyData}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedRepaymentTab;
