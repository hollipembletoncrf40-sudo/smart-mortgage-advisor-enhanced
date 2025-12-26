import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Wallet, 
  TrendingDown, 
  CalendarRange,
  CalendarDays,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { InvestmentParams, CalculationResult } from '../types';
import { MOOD_FEEDBACK } from '../utils/moodFeedback';

interface Props {
  monthlyPayment: number;
  result?: CalculationResult | null;
  t: any;
  language: 'ZH' | 'EN';
  darkMode: boolean;
  user?: any;
  params: InvestmentParams;
}

const RepaymentCalendar: React.FC<Props> = ({ monthlyPayment: initialMonthlyPayment, language, params }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [paymentDay, setPaymentDay] = useState(20);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [moodLog, setMoodLog] = useState<Record<string, { emoji: string; note: string }>>({});
  const [showLatteFactor, setShowLatteFactor] = useState(false);
  const [hoveredMoodLabel, setHoveredMoodLabel] = useState<string | null>(null);
  
  // New State for Rich Feedback
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  
  // Weekly/Daily Metrics
  const weeklyPayment = initialMonthlyPayment * 12 / 52;
  const dailyPayment = initialMonthlyPayment * 12 / 365;
  
  // Salary/Income Logic
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [salaryDay, setSalaryDay] = useState(10);
  const [showSavingsInput, setShowSavingsInput] = useState(false);
  
  const remainingBalance = monthlyIncome - initialMonthlyPayment;
  const isBalanceSafe = remainingBalance > 0;

  // Work Hours Logic
  const [workHours, setWorkHours] = useState(9); // Default 996 lol, 9 hours
  const [showHourlyPopup, setShowHourlyPopup] = useState(false);
  const workHourlyPayment = dailyPayment / workHours;

  const getHourlyFeedback = (rate: number, hours: number) => {
    if (hours > 12) return { text: language === 'ZH' ? '⚠️ 您的身体在预警... 房贷不值得拼命' : '⚠️ Danger zone. Health > Mortgage', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' };
    if (rate > 200) return { text: language === 'ZH' ? '💪 您是高净值时间拥有者！' : '💪 High value time!', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
    if (rate > 100) return { text: language === 'ZH' ? '✨ 您的每一小时都很有份量' : '✨ Solid hourly value', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' };
    return { text: language === 'ZH' ? '🌱 加油，时间是最大的杠杆' : '🌱 Time is your biggest leverage', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' };
  };
  const hourlyFeedback = getHourlyFeedback(workHourlyPayment, workHours);

  // Prepayment Sandbox Logic
  const [showPrepaymentPopup, setShowPrepaymentPopup] = useState(false);
  const [extraPayment, setExtraPayment] = useState(50000); // Default 50k
  
  // Simple re-calc for sandbox (approximate for UI demo)
  const calculateNewMonthlyPayment = () => {
     if (!params) return initialMonthlyPayment;
     // Re-reverse engineer loan amount approx
     const currentLoanAmount = params.totalPrice * 10000 * (1 - params.downPaymentRatio / 100);
     const newPrincipal = currentLoanAmount - extraPayment;
     if (newPrincipal <= 0) return 0;
     
     const rate = (params.interestRate / 100) / 12;
     const n = params.loanTerm * 12;
     return (newPrincipal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  };
  const monthlyPaymentSimulated = extraPayment > 0 ? calculateNewMonthlyPayment() : initialMonthlyPayment;

  // Latte Data
  const getLatteFactor = (dailyCost: number) => {
    return {
      starbucks: (dailyCost / 35).toFixed(1), // ~35 RMB
      bubbleTea: (dailyCost / 18).toFixed(1), // ~18 RMB
      switchGame: (dailyCost / 300).toFixed(1) // ~300 RMB
    };
  };
  const latteData = getLatteFactor(dailyPayment);

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    // Adjust for Monday start if needed, but standard calendar uses Sun=0 usually
    // Let's stick to Sun-Sat for standard view
    const daysArray = Array(firstDay).fill(null); // Empty slots for previous month
    for (let i = 1; i <= days; i++) {
        daysArray.push({ date: i });
    }
    return daysArray;
  };

  const days = getDaysInMonth(viewDate);
  const weekDays = language === 'ZH' 
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  };
  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  };

  const handleMoodSelect = (mood: string) => {
    if (selectedDate) {
        setMoodLog({
            ...moodLog,
            [`${viewDate.getFullYear()}-${viewDate.getMonth()}-${selectedDate}`]: { emoji: mood, note: '' }
        });
        setCurrentMood(mood);
        setShowMoodSelector(false);
        setHoveredMoodLabel(null);
        setShowFeedbackModal(true);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMoodForAdvice, setSelectedMoodForAdvice] = useState<string | null>(null);

  return (
      <div className="bg-white dark:bg-[#0B0C15] rounded-3xl overflow-hidden border border-slate-200 dark:border-[#1E202E] shadow-2xl relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        {/* Rich Mood Feedback Modal */}
        {showFeedbackModal && currentMood && MOOD_FEEDBACK[currentMood] && (
           <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
               <div className="bg-white/90 dark:bg-[#151725]/90 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl relative overflow-hidden text-center animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
                  {/* Decorative Gradient Blob */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setShowFeedbackModal(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#2B2D3C] transition-colors text-slate-400"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <div className="relative z-10">
                      <div className="text-6xl mb-4 animate-bounce delay-100 filter drop-shadow-lg">{currentMood}</div>
                      
                      <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                         {MOOD_FEEDBACK[currentMood][language].title}
                      </h3>
                      
                      <div className="bg-slate-50/50 dark:bg-[#0F1019]/50 rounded-2xl p-6 mb-6 border border-slate-100 dark:border-[#2B2D3C]">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-justify text-sm italic font-serif">
                           {MOOD_FEEDBACK[currentMood][language].message}
                        </p>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-start gap-3 text-left bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20 cursor-pointer hover:scale-[1.02] transition-transform">
                             <div className="mt-0.5">
                                <Sparkles className="h-5 w-5 text-emerald-500" />
                             </div>
                             <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                                {MOOD_FEEDBACK[currentMood][language].actionItem}
                             </p>
                         </div>
                         
                         <div className="text-center">
                            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 dark:bg-[#1E202E] text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-[#2B2D3C]">
                               Daily Wisdom
                            </span>
                            <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 font-serif">
                               {MOOD_FEEDBACK[currentMood][language].quote}
                            </p>
                         </div>
                      </div>

                      <button 
                        onClick={() => setShowFeedbackModal(false)}
                        className="mt-8 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                         {language === 'ZH' ? '我收到了，继续前进' : 'Received. Moving Forward.'}
                      </button>
                  </div>
               </div>
           </div>
        )}

        {/* Header Section - Dashboard Style */}
        <div className="p-6 border-b border-slate-100 dark:border-[#1E202E] bg-white dark:bg-[#0B0C15] flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
             {/* Left: Month Navigation */}
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#151725] p-1.5 rounded-xl border border-slate-100 dark:border-[#2B2D3C]">
                   <button onClick={handlePrevMonth} className="p-2 hover:bg-white dark:hover:bg-[#1E202E] hover:shadow-sm rounded-lg transition-all text-slate-500 dark:text-slate-400">
                     <ChevronLeft className="h-5 w-5" />
                   </button>
                   <div className="flex flex-col items-center min-w-[100px]">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{viewDate.getFullYear()}</span>
                      <span className="text-xl font-black text-slate-800 dark:text-white leading-none mt-0.5">
                        {language === 'ZH' ? `${viewDate.getMonth() + 1}月` : viewDate.toLocaleString('default', { month: 'long' })}
                      </span>
                   </div>
                   <button onClick={handleNextMonth} className="p-2 hover:bg-white dark:hover:bg-[#1E202E] hover:shadow-sm rounded-lg transition-all text-slate-500 dark:text-slate-400">
                     <ChevronRight className="h-5 w-5" />
                   </button>
                </div>
             </div>

             {/* Right: Tools & Popups */}
             <div className="flex flex-wrap items-center gap-3">
                 {/* Prepayment Trigger */}
                 <div className="relative group/prepay">
                   <button 
                     onClick={() => {
                       setShowPrepaymentPopup(!showPrepaymentPopup);
                       setShowSavingsInput(false);
                     }}
                     className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                       showPrepaymentPopup 
                         ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                         : 'bg-slate-50 dark:bg-[#151725] border-slate-200 dark:border-[#2B2D3C] text-slate-500 dark:text-slate-400 hover:border-indigo-500/30 hover:text-indigo-500'
                     }`}
                   >
                      <TrendingDown className="h-4 w-4" />
                      <span>{language === 'ZH' ? '提前还款沙盘' : 'Prepay Sim'}</span>
                   </button>

                   {/* Prepayment Popup */}
                   {showPrepaymentPopup && (
                     <div className="absolute top-full right-0 mt-3 p-6 bg-white dark:bg-[#0F1019] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#2B2D3C] w-80 z-50 animate-in slide-in-from-top-2 ring-1 ring-black/5">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                              {language === 'ZH' ? '模拟"投喂"房贷' : 'Simulate Extra Payment'}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1">
                              {language === 'ZH' ? '输入金额，即刻预览“减负”效果' : 'Input amount for instant relief preview'}
                            </p>
                          </div>
                          <button onClick={() => setShowPrepaymentPopup(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="sr-only">Close</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>

                        <div className="relative mb-6 group-focus-within:scale-105 transition-transform duration-300 origin-left">
                           <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-lg">¥</span>
                           <input 
                             type="number" 
                             value={extraPayment || ''}
                             onChange={e => setExtraPayment(Number(e.target.value))}
                             className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-[#151725] border border-slate-200 dark:border-[#2B2D3C] rounded-xl text-xl font-bold text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-inner"
                             placeholder="50000"
                             autoFocus
                           />
                        </div>

                        {extraPayment > 0 ? (
                          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="p-4 bg-slate-50 dark:bg-[#151725] rounded-xl border border-slate-100 dark:border-[#2B2D3C]">
                                <div className="flex justify-between items-center text-xs mb-2">
                                   <span className="text-slate-500">{language === 'ZH' ? '原月供' : 'Original'}</span>
                                   <span className="text-slate-400 line-through">¥{initialMonthlyPayment.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-200 dark:border-[#2B2D3C] pt-2 mt-2">
                                   <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{language === 'ZH' ? '新月供' : 'New'}</span>
                                   <span className="text-xl font-black text-emerald-500 flex items-center gap-1">
                                     ¥{monthlyPaymentSimulated.toFixed(0)}
                                     <TrendingDown className="h-4 w-4" />
                                   </span>
                                </div>
                             </div>
                             <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                <div className="text-[10px] uppercase tracking-wider text-emerald-600/70 font-bold mb-1">
                                  {language === 'ZH' ? '每日减负' : 'Daily Relief'}
                                </div>
                                <div className="flex items-end gap-2">
                                   <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                     -¥{((initialMonthlyPayment - monthlyPaymentSimulated) / 30).toFixed(1)}
                                   </div>
                                </div>
                             </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-xs text-slate-400 italic">
                            {language === 'ZH' ? '试试输入 50000 看看效果...' : 'Try entering 50,000...'}
                          </div>
                        )}
                     </div>
                   )}
                 </div>

                 {/* Savings Widget */}
                 <div className="relative group/savings">
                    <button 
                      onClick={() => {
                        setShowSavingsInput(!showSavingsInput);
                        setShowPrepaymentPopup(false);
                      }}
                       className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                         showSavingsInput
                           ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                           : 'bg-slate-50 dark:bg-[#151725] border-slate-200 dark:border-[#2B2D3C] text-slate-500 dark:text-slate-400 hover:border-emerald-500/30 hover:text-emerald-500'
                       }`}
                    >
                       <Wallet className="h-4 w-4" />
                       {monthlyIncome > 0 ? (
                         <span>{language === 'ZH' ? '余额 ' : 'Bal '}¥{remainingBalance.toFixed(0)}</span>
                       ) : (
                         <span>{language === 'ZH' ? '设置月收入' : 'Set Income'}</span>
                       )}
                    </button>
                    {/* Reuse popup logic with refreshed styles */}
                    {showSavingsInput && (
                      <div className="absolute top-full right-0 mt-3 p-6 bg-white dark:bg-[#0F1019] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#2B2D3C] w-80 z-50 animate-in slide-in-from-top-2 ring-1 ring-black/5">
                         <div className="flex justify-between items-start mb-6">
                           <div>
                             <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                               <Wallet className="h-4 w-4 text-emerald-500" />
                               {language === 'ZH' ? '每月可用资金' : 'Monthly Budget'}
                             </h4>
                             <p className="text-[10px] text-slate-500 mt-1">
                               {language === 'ZH' ? '设置月收入，监控现金流健康度' : 'Manage your monthly cash flow'}
                             </p>
                           </div>
                           <button onClick={() => setShowSavingsInput(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                             <span className="sr-only">Close</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                         </div>
                         <div className="relative mb-6 group-focus-within:scale-105 transition-transform duration-300 origin-left">
                             <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-lg">¥</span>
                             <input 
                               type="number" 
                               value={monthlyIncome || ''}
                               onChange={e => setMonthlyIncome(Number(e.target.value))}
                               className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-[#151725] border border-slate-200 dark:border-[#2B2D3C] rounded-xl text-xl font-bold text-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-inner"
                               placeholder="0"
                             />
                         </div>
                         <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151725] rounded-xl border border-slate-100 dark:border-[#2B2D3C]">
                               <span className="text-xs font-medium text-slate-500">{language === 'ZH' ? '发薪日 (高亮绿区)' : 'Payday (Green Zone)'}</span>
                               <select 
                                  value={salaryDay}
                                  onChange={(e) => setSalaryDay(Number(e.target.value))}
                                  className="bg-transparent text-sm font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
                                >
                                  {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                    <option key={d} value={d}>{d}{language === 'ZH' ? '日' : ''}</option>
                                  ))}
                                </select>
                            </div>
                            <div className={`p-4 rounded-xl border ${isBalanceSafe 
                               ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-500/20' 
                               : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-500/20'}`}>
                               <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'ZH' ? '自由现金流' : 'Free Cash Flow'}</span>
                                  {isBalanceSafe ? <TrendingDown className="h-4 w-4 text-emerald-500 rotate-180" /> : <TrendingDown className="h-4 w-4 text-rose-500" />}
                               </div>
                               <div className="flex items-baseline justify-between">
                                  <span className="text-xs text-slate-400">Monthly</span>
                                  <span className={`text-2xl font-black ${isBalanceSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    ¥{remainingBalance.toFixed(0)}
                                  </span>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>

                 <div className="h-8 w-px bg-slate-200 dark:bg-[#2B2D3C] mx-1"></div>

                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 hidden md:inline">{language === 'ZH' ? '还款日' : 'Day'}:</span>
                    <div className="relative">
                      <select 
                        value={paymentDay} 
                        onChange={(e) => setPaymentDay(Number(e.target.value))}
                        className="bg-slate-100 dark:bg-[#151725] border border-transparent dark:border-[#2B2D3C] rounded-xl text-xs font-bold text-slate-700 dark:text-white px-3 py-2 pr-8 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-colors appearance-none"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <option key={d} value={d}>{d}{language === 'ZH' ? '日' : ''}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                 </div>
             </div>
        </div>

        {/* Metrics Bar - Bento Box Style */}
        <div className="grid grid-cols-3 gap-px bg-slate-100 dark:bg-[#1E202E] border-b border-slate-100 dark:border-[#1E202E]">
            {/* Weekly Cost */}
            <div className="bg-white dark:bg-[#0B0C15] p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-[#151725] transition-colors group cursor-pointer relative overflow-hidden h-32"
                 onClick={() => setShowLatteFactor(!showLatteFactor)}
            >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                   <CalendarRange className="h-3.5 w-3.5" />
                   {language === 'ZH' ? '周度压力' : 'Weekly Base'}
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mt-1">
                   {showLatteFactor 
                     ? (<span>{language === 'ZH' ? '1 Switch' : '1 Switch'} <span className="text-lg text-slate-500">🎮</span></span>) 
                     : `¥${weeklyPayment.toFixed(0)}`
                   }
                </div>
            </div>

            {/* Daily Cost */}
            <div className="bg-white dark:bg-[#0B0C15] p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-[#151725] transition-colors group cursor-pointer relative overflow-hidden h-32"
               onClick={() => setShowLatteFactor(!showLatteFactor)}
            >
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                   <CalendarDays className="h-3.5 w-3.5" />
                   {language === 'ZH' ? '每日仅需' : 'Daily Cost'}
                </div>
                <div className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                   {showLatteFactor 
                     ? (<span>{latteData.starbucks} {language === 'ZH' ? '杯咖啡' : 'Coffees'} <span className="text-lg">☕️</span></span>)
                     : `¥${dailyPayment.toFixed(0)}`
                   }
                </div>
                {showLatteFactor && (
                  <div className="absolute bottom-3 text-[10px] text-slate-400 animate-in fade-in">
                     {language === 'ZH' ? '生活化换算' : 'Latte Factor'}
                  </div>
                )}
            </div>

            {/* Hourly - No Border right */}
            <div className="bg-white dark:bg-[#0B0C15] p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-[#151725] transition-colors group cursor-pointer relative h-32"
               onClick={() => setShowHourlyPopup(!showHourlyPopup)}
            >
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Clock className="h-3.5 w-3.5" />
                    {language === 'ZH' ? '时薪负担' : 'Hourly Load'}
                 </div>
                 <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2 mt-1">
                    ¥{workHourlyPayment.toFixed(0)}
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-[#1E202E] px-2 py-1 rounded-lg">
                      {workHours}h
                    </span>
                 </div>
                 
                 {/* Hourly Popup (Refined) */}
                 {showHourlyPopup && (
                    <div 
                      className="absolute top-full right-4 mt-2 w-72 bg-white dark:bg-[#0F1019] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#2B2D3C] p-6 z-50 animate-in zoom-in-95 slide-in-from-top-2 ring-1 ring-black/5"
                      onClick={e => e.stopPropagation()}
                    >
                       <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-700 dark:text-white text-sm">
                            {language === 'ZH' ? '调整工作时长' : 'Adjust Work Hours'}
                          </h4>
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                            {workHours} h/day
                          </span>
                       </div>

                       <input 
                         type="range" 
                         min="1" 
                         max="16" 
                         step="0.5"
                         value={workHours}
                         onChange={(e) => setWorkHours(Number(e.target.value))}
                         className="w-full h-1.5 bg-slate-100 dark:bg-[#2B2D3C] rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-6"
                       />
                       
                       <div className={`rounded-xl p-4 ${hourlyFeedback.bg} transition-colors duration-300`}>
                          <div className={`font-bold text-xs mb-1.5 flex items-center gap-1.5 ${hourlyFeedback.color}`}>
                             <Sparkles className="h-3.5 w-3.5" />
                             {language === 'ZH' ? 'AI 洞察' : 'AI Insight'}
                          </div>
                          <p className={`text-xs ${hourlyFeedback.color} leading-relaxed opacity-90`}>
                            “{hourlyFeedback.text}”
                          </p>
                       </div>
                       
                       <div className="absolute top-0 right-4 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#0F1019] border-l border-t border-slate-100 dark:border-[#2B2D3C] rotate-45 transform"></div>
                    </div>
                 )}
            </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-[#1E202E] bg-slate-50 dark:bg-[#0F1019]">
          {weekDays.map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 bg-white dark:bg-[#0B0C15]">
          {days.map((dayObj, index) => {
            if (!dayObj) return <div key={`empty-${index}`} className="aspect-square border-b border-r border-slate-50 dark:border-[#1E202E]" />;
            
            const isToday = 
              dayObj.date === new Date().getDate() && 
              viewDate.getMonth() === new Date().getMonth() && 
              viewDate.getFullYear() === new Date().getFullYear();
            
            const isPaymentDay = dayObj.date === paymentDay;
            const log = moodLog[`${viewDate.getFullYear()}-${viewDate.getMonth()}-${dayObj.date}`];
            
            // Heatmap logic (Refined colors for dark mode)
             let bgStyle = {};
             if (salaryDay > 0) {
              const day = dayObj.date;
              // Simple wrap-around logic for visual checking (approximate)
              let dist = day - salaryDay;
              // Handle start of month wrap around for a roughly 30 day cycle visual
              if (dist < -20) dist += 30; // e.g. day 1, salary 25 -> dist -24 -> +6 (future)
              
              const zoneRadius = 7;
              
              // Highlight Red Zone (days before salary)
              if (dist < 0 && dist >= -zoneRadius) {
                 const intensity = 1 - (Math.abs(dist) / zoneRadius);
                 // Red: 244, 63, 94 (rose-500)
                 bgStyle = { backgroundColor: `rgba(244, 63, 94, ${intensity * 0.15 + 0.05})` };
              }
              // Highlight Green Zone (days after salary)
              else if (dist >= 0 && dist < zoneRadius) {
                 const intensity = 1 - (dist / zoneRadius);
                 // Green: 16, 185, 129 (emerald-500)
                 bgStyle = { backgroundColor: `rgba(16, 185, 129, ${intensity * 0.15 + 0.05})` };
              }
            }

            return (
              <div 
                key={dayObj.date}
                className="aspect-square border-b border-r border-slate-50 dark:border-[#1E202E] p-2 relative group transition-all duration-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#151725]"
                style={bgStyle}
                onClick={() => {
                  setSelectedDate(dayObj.date);
                  setShowMoodSelector(true);
                  setSelectedMoodForAdvice(null);
                  setHoveredMoodLabel(null);
                }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold transition-all ${
                    isToday 
                      ? 'bg-indigo-500 text-white w-6 h-6 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30' 
                      : isPaymentDay
                        ? 'text-rose-500 dark:text-rose-400 scale-110' 
                        : 'text-slate-700 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-300'
                  }`}>
                    {dayObj.date}
                  </span>
                  
                  {isPaymentDay && (
                    <span className="text-[9px] font-black text-rose-500/80 dark:text-rose-400/80 transform translate-x-1">
                      -¥{showLatteFactor ? (dailyPayment / 35).toFixed(0) + '☕️' : (dailyPayment / 1000).toFixed(1) + 'k'}
                    </span>
                  )}
                </div>

                {log && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-2xl animate-in zoom-in spin-in-3 duration-300 filter drop-shadow-md">{log.emoji}</span>
                   </div>
                )}
                
                {!log && isToday && (
                   <div className="absolute inset-x-0 bottom-2 text-center">
                      <span className="text-[10px] text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                         {language === 'ZH' ? '记一笔' : 'Log'}
                      </span>
                   </div>
                )}
                
                {/* Mood Selector Popup */}
                {showMoodSelector && selectedDate === dayObj.date && (
                   <div 
                     className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-[#1E202E] rounded-xl shadow-xl border border-slate-100 dark:border-[#2B2D3C] p-3 w-48 z-50 animate-in zoom-in-95 flex flex-col items-center"
                     onClick={(e) => e.stopPropagation()}
                   >
                       <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider h-4">
                         {hoveredMoodLabel || (language === 'ZH' ? '今天心情如何?' : 'How do you feel?')}
                       </div>
                       
                       <div className="flex gap-1 justify-center mb-1">
                         {[
                           { emoji: '😭', label: language === 'ZH' ? '压力山大' : 'Stressed' }, 
                           { emoji: '😕', label: language === 'ZH' ? '焦虑' : 'Anxious' }, 
                           { emoji: '😐', label: language === 'ZH' ? '一般' : 'Neutral' }, 
                           { emoji: '🙂', label: language === 'ZH' ? '不错' : 'Good' }, 
                           { emoji: '🤩', label: language === 'ZH' ? '超级棒' : 'Great' }
                         ].map(item => (
                            <button 
                              key={item.emoji}
                              onClick={() => handleMoodSelect(item.emoji)}
                              onMouseEnter={() => setHoveredMoodLabel(item.label)}
                              onMouseLeave={() => setHoveredMoodLabel(null)}
                              className="p-1.5 hover:bg-slate-50 dark:hover:bg-[#2B2D3C] rounded-lg transition-colors text-xl transform hover:scale-110 active:scale-95 transition-transform"
                            >
                              {item.emoji}
                            </button>
                         ))}
                       </div>
                       
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white dark:bg-[#1E202E] rotate-45 border-r border-b border-slate-100 dark:border-[#2B2D3C]"></div>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
  );
};

export default RepaymentCalendar;
