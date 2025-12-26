import React, { useState, useEffect } from 'react';
import MoodAdvicePanel from './MoodAdvicePanel';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Smile, Meh, Frown, DollarSign, Wallet, TrendingDown, AlertCircle, CheckCircle2, Clock, CalendarDays, CalendarRange, Sparkles } from 'lucide-react';

interface Props {
  monthlyPayment: number;
  t: any;
  language: 'ZH' | 'EN';
  darkMode: boolean;
}

type Mood = 'happy' | 'neutral' | 'stressed';

const RepaymentCalendar: React.FC<Props> = ({ monthlyPayment, t, language, darkMode }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [paymentDay, setPaymentDay] = useState<number>(1);
  const [moodLog, setMoodLog] = useState<Record<string, Mood>>({});
  const [showMoodSelector, setShowMoodSelector] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [showSavingsInput, setShowSavingsInput] = useState(false);
  const [selectedMoodForAdvice, setSelectedMoodForAdvice] = useState<Mood | null>(null);

  // Generate calendar grid
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    // Adjust for Monday start if needed, but Sunday start is standard
    const prefixDays = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return [...prefixDays, ...days];
  };

  const days = getDaysInMonth(viewDate);
  const weekDays = language === 'ZH' 
    ? ['日', '一', '二', '三', '四', '五', '六'] 
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const toggleMood = (dateStr: string, mood: Mood) => {
    setMoodLog(prev => ({
      ...prev,
      [dateStr]: mood
    }));
    setSelectedMoodForAdvice(mood); // Trigger Advice Panel
    setShowMoodSelector(null);
  };

  const remainingBalance = monthlyIncome - monthlyPayment;
  const isBalanceSafe = remainingBalance >= 0;

  // Granular Calculations
  const [workHours, setWorkHours] = useState<number>(8);
  const [showHourlyPopup, setShowHourlyPopup] = useState(false);

  const weeklyPayment = monthlyPayment / 4.3; // Approx weeks per month
  const dailyPayment = monthlyPayment / 30;
  const workHourlyPayment = dailyPayment / workHours; 

  const getDayClass = (day: number | null) => {
    if (!day) return 'invisible';
    
    const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
    const isPaymentDay = day === paymentDay;
    
    let baseClass = "min-h-[120px] p-2 border border-slate-100 dark:border-slate-800 relative transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col items-start justify-between cursor-pointer group"; 
    
    if (isToday) baseClass += " bg-indigo-50/30 dark:bg-indigo-900/10";
    
    return baseClass;
  };

  const formatDate = (day: number) => {
    return `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getHourlyFeedback = (cost: number, hours: number) => {
    // High Hourly Value -> Efficient -> Light Burden
    if (cost >= 100) return {
       text: language === 'ZH' ? "卓越的效能！您用高时薪轻松驾驭房贷，这是智慧与能力的体现�" : "Elite Efficiency! Your high value time masters the mortgage easily �",
       color: "text-emerald-500",
       bg: "bg-emerald-50 dark:bg-emerald-900/20"
    };

    // Medium Hourly Value -> Balanced
    if (cost >= 50) return {
       text: language === 'ZH' ? "稳健的步伐！您在工作与生活之间找到了完美平衡，未来可期⚖️" : "Steady Pace! Perfectly balancing life and duty, the future is bright ⚖️",
       color: "text-indigo-500",
       bg: "bg-indigo-50 dark:bg-indigo-900/20"
    };

    // Low Hourly Value (Long Hours) -> Hardworking -> Heavy Burden (Encouragement needed)
    return {
       text: language === 'ZH' ? "致敬奋斗者！每一小时的辛勤耕耘，都是为家筑起的坚实堡垒，您辛苦了🛡️" : "Salute to the Striver! Every hour of hard work builds a fortress for your home 🛡️",
       color: "text-rose-500",
       bg: "bg-rose-50 dark:bg-rose-900/20"
    };
  };

  const hourlyFeedback = getHourlyFeedback(workHourlyPayment, workHours);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-visible shadow-xl relative z-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {language === 'ZH' ? '智能还款日历' : 'Repayment Calendar'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {viewDate.toLocaleString(language === 'ZH' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500">
             <ChevronLeft className="h-4 w-4" />
           </button>
           <button onClick={() => setViewDate(new Date())} className="text-xs font-bold px-3 text-slate-600 dark:text-slate-300">
             {language === 'ZH' ? '今天' : 'Today'}
           </button>
           <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500">
             <ChevronRight className="h-4 w-4" />
           </button>
        </div>

        <div className="flex items-center gap-4">
            {/* Savings Widget */}
            <div className="relative group/savings">
               <button 
                 onClick={() => setShowSavingsInput(!showSavingsInput)}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                   monthlyIncome > 0 
                     ? (isBalanceSafe ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200')
                     : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                 }`}
               >
                  <Wallet className="h-4 w-4" />
                  {monthlyIncome > 0 ? (
                    <span>{language === 'ZH' ? '余额: ' : 'Bal: '}¥{remainingBalance.toFixed(0)}</span>
                  ) : (
                    <span>{language === 'ZH' ? '设置月收入' : 'Set Income'}</span>
                  )}
               </button>
               
               {showSavingsInput && (
                 <div className="absolute top-full right-0 mt-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 w-64 z-50 animate-in slide-in-from-top-2">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                      {language === 'ZH' ? '每月可用资金' : 'Monthly Budget'}
                    </h4>
                    <div className="relative mb-3">
                       <span className="absolute left-3 top-2 text-slate-400">¥</span>
                       <input 
                         type="number" 
                         value={monthlyIncome || ''}
                         onChange={e => setMonthlyIncome(Number(e.target.value))}
                         className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                         placeholder="0"
                       />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-500">{language === 'ZH' ? '月供:' : 'Payment:'}</span>
                       <span className="font-bold text-slate-700 dark:text-slate-300">¥{monthlyPayment.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1 pt-2 border-t border-slate-100 dark:border-slate-700">
                       <span className="font-bold text-slate-600">{language === 'ZH' ? '剩余:' : 'Remaining:'}</span>
                       <span className={`font-bold ${isBalanceSafe ? 'text-emerald-500' : 'text-rose-500'}`}>
                         ¥{remainingBalance.toFixed(0)}
                       </span>
                    </div>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-2">
               <span className="text-xs font-medium text-slate-500">{language === 'ZH' ? '还款日:' : 'Day:'}</span>
               <select 
                 value={paymentDay} 
                 onChange={(e) => setPaymentDay(Number(e.target.value))}
                 className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               >
                 {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                   <option key={d} value={d}>{d}{language === 'ZH' ? '日' : ''}</option>
                 ))}
               </select>
            </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
          <div className="p-4 flex flex-col items-center justify-center hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                 <CalendarRange className="h-3.5 w-3.5" />
                 {language === 'ZH' ? '每周需备' : 'Weekly Cost'}
              </div>
              <div className="text-lg font-black text-slate-700 dark:text-slate-200">
                 ¥{weeklyPayment.toFixed(0)}
              </div>
          </div>
          <div className="p-4 flex flex-col items-center justify-center hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                 <CalendarDays className="h-3.5 w-3.5" />
                 {language === 'ZH' ? '每日仅需' : 'Daily Cost'}
              </div>
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                 ¥{dailyPayment.toFixed(0)}
              </div>
          </div>
          
          {/* Interactive Hourly Cost Card */}
          <div className="relative p-4 flex flex-col items-center justify-center hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group/hourly"
               onClick={() => setShowHourlyPopup(!showHourlyPopup)}
          >
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                 <Clock className="h-3.5 w-3.5 text-indigo-500" />
                 {language === 'ZH' ? '工作时薪负担' : 'Hourly Burden'}
              </div>
              <div className="text-lg font-black text-slate-700 dark:text-slate-200 flex items-center gap-1">
                 ¥{workHourlyPayment.toFixed(0)}
                 <span className="text-[10px] font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                   {workHours}h
                 </span>
              </div>
              
              {/* Hourly Feedback Popup */}
              {showHourlyPopup && (
                 <div 
                   className="absolute top-full right-4 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-5 z-50 animate-in zoom-in-95 slide-in-from-top-2"
                   onClick={e => e.stopPropagation()}
                 >
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                         {language === 'ZH' ? '调整工作时长' : 'Adjust Work Hours'}
                       </h4>
                       <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
                         {workHours} Hours/Day
                       </span>
                    </div>

                    <input 
                      type="range" 
                      min="1" 
                      max="16" 
                      step="0.5"
                      value={workHours}
                      onChange={(e) => setWorkHours(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-4"
                    />
                    
                    <div className={`rounded-xl p-3 ${hourlyFeedback.bg} transition-colors duration-300`}>
                       <div className={`font-bold text-xs mb-1 flex items-center gap-1.5 ${hourlyFeedback.color}`}>
                          <Sparkles className="h-3.5 w-3.5" />
                          {language === 'ZH' ? 'AI 洞察' : 'AI Insight'}
                       </div>
                       <p className={`text-xs ${hourlyFeedback.color} leading-relaxed`}>
                         “{hourlyFeedback.text}”
                       </p>
                    </div>
                 </div>
              )}
          </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {weekDays.map(d => (
          <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 bg-white dark:bg-slate-900">
        {days.map((day, idx) => {
          const dateStr = day ? formatDate(day) : `empty-${idx}`;
          const isPaymentDay = day === paymentDay;
          const userMood = moodLog[dateStr];

          return (
             <div key={idx} className={getDayClass(day)} onClick={() => day && isPaymentDay && setShowMoodSelector(showMoodSelector === dateStr ? null : dateStr)}>
               {day && (
                 <>
                   <span className={`text-sm font-medium ${isPaymentDay ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400'} transition-transform`}>
                     {day}
                   </span>
                   
                   {isPaymentDay && (
                     <div className="w-full mt-1 animate-in fade-in slide-in-from-top-1 relative z-10">
                       <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-lg p-2 mb-1 group-hover:shadow-md transition-all">
                         <div className="text-[10px] text-indigo-400 mb-0.5 flex items-center justify-between gap-1">
                           <div className="flex items-center gap-1">
                             <DollarSign className="h-3 w-3" />
                             {language === 'ZH' ? '还款' : 'Pay'}
                           </div>
                           {monthlyIncome > 0 && (
                             <div title={isBalanceSafe ? '资金充足' : '资金紧张'}>
                               {isBalanceSafe ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertCircle className="h-3 w-3 text-rose-500 animate-pulse" />}
                             </div>
                           )}
                         </div>
                         <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                           {monthlyPayment.toFixed(0)}
                         </div>
                       </div>

                       {/* Mood Display / Selector Trigger */}
                       <div className="relative">
                         {userMood ? (
                            <div 
                              onClick={(e) => { e.stopPropagation(); setSelectedMoodForAdvice(userMood); }}
                              className={`flex justify-center p-1.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm cursor-pointer hover:scale-110 transition-transform ${
                              userMood === 'happy' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600' : 
                              userMood === 'neutral' ? 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500' : 'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600'
                            }`}>
                              {userMood === 'happy' && <Smile className="h-5 w-5" />}
                              {userMood === 'neutral' && <Meh className="h-5 w-5" />}
                              {userMood === 'stressed' && <Frown className="h-5 w-5" />}
                            </div>
                         ) : (
                           <div className="text-[10px] text-center text-slate-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 dark:bg-slate-800 rounded px-1">
                             {language === 'ZH' ? '点击记录' : 'Log Mood'}
                           </div>
                         )}

                         {/* Mood Selector Popup - Fixed Position to avoid overlaying using simple absolute strategy: show BELOW details */}
                         {showMoodSelector === dateStr && (
                           <div 
                             className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-3 flex gap-3 z-50 animate-in zoom-in-95 w-max" 
                             onClick={e => e.stopPropagation()}
                           >
                             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-slate-100 dark:border-slate-700 transform rotate-45"></div>
                             
                             <button onClick={() => toggleMood(dateStr, 'happy')} className="group/mood flex flex-col items-center gap-1">
                               <div className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-500 hover:text-emerald-600 transition-colors shadow-sm">
                                  <Smile className="h-6 w-6" />
                               </div>
                               <span className="text-[10px] font-bold text-slate-400 group-hover/mood:text-emerald-500 transition-colors">轻松</span>
                             </button>
                             <button onClick={() => toggleMood(dateStr, 'neutral')} className="group/mood flex flex-col items-center gap-1">
                               <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                                  <Meh className="h-6 w-6" />
                               </div>
                               <span className="text-[10px] font-bold text-slate-400 group-hover/mood:text-slate-500 transition-colors">平淡</span>
                             </button>
                             <button onClick={() => toggleMood(dateStr, 'stressed')} className="group/mood flex flex-col items-center gap-1">
                               <div className="p-3 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-500 hover:text-rose-600 transition-colors shadow-sm">
                                  <Frown className="h-6 w-6" />
                               </div>
                               <span className="text-[10px] font-bold text-slate-400 group-hover/mood:text-rose-500 transition-colors">压力</span>
                             </button>
                           </div>
                         )}
                       </div>
                     </div>
                   )}
                 </>
               )}
             </div>
          );
        })}
      </div>

      {/* Mood Advice Panel Integration */}
      {selectedMoodForAdvice && (
        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 rounded-b-3xl">
           <MoodAdvicePanel 
             mood={selectedMoodForAdvice} 
             monthlyPayment={monthlyPayment}
             monthlyIncome={monthlyIncome}
             language={language}
           />
        </div>
      )}
    </div>
  );
};

export default RepaymentCalendar;
