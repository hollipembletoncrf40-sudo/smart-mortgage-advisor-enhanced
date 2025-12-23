import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { MonthlyPayment } from '../types';

interface DetailedPaymentTableProps {
  monthlyPayments: MonthlyPayment[];
  t: any;
}

type ViewMode = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';

// 分页配置
const PAGE_SIZE = {
  day: 90,   // 每次加载90天（3个月）
  week: 48,  // 每次加载48周（1年）
};

const DetailedPaymentTable: React.FC<DetailedPaymentTableProps> = ({ monthlyPayments, t }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedQuarter, setExpandedQuarter] = useState<number | null>(null);
  const [dayPage, setDayPage] = useState(1);
  const [weekPage, setWeekPage] = useState(1);

  // 重置分页当切换视图时
  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'day') setDayPage(1);
    if (mode === 'week') setWeekPage(1);
  }, []);

  // 生成完整的月度数据
  const monthlyData = useMemo(() => {
    if (!monthlyPayments) return [];
    return monthlyPayments.map((month, index) => ({
      ...month,
      monthIndex: index + 1,
      year: Math.floor(index / 12) + 1,
      monthInYear: (index % 12) + 1,
      date: new Date(new Date().getFullYear(), new Date().getMonth() + index + 1, 1)
    }));
  }, [monthlyPayments]);

  // 按日数据 - 简化版：使用该日所属月份的月末剩余本金
  const dailyData = useMemo(() => {
    return monthlyData.flatMap((month) => {
      const dailyPayment = month.payment / 30;
      const dailyPrincipal = month.principal / 30;
      const dailyInterest = month.interest / 30;
      
      return Array.from({ length: 30 }, (_, dayIdx) => ({
        dayIndex: (month.monthIndex - 1) * 30 + dayIdx + 1,
        monthIndex: month.monthIndex,
        day: dayIdx + 1,
        payment: dailyPayment,
        principal: dailyPrincipal,
        interest: dailyInterest,
        // 剩余本金单位是"万"，转换为"元"需要乘以10000
        remainingPrincipal: month.remainingPrincipal * 10000,
        date: new Date(month.date.getFullYear(), month.date.getMonth(), dayIdx + 1)
      }));
    });
  }, [monthlyData]);

  // 按周数据 - 简化版：使用该周所属月份的月末剩余本金
  const weeklyData = useMemo(() => {
    return monthlyData.flatMap((month) => {
      const weeklyPayment = month.payment / 4;
      const weeklyPrincipal = month.principal / 4;
      const weeklyInterest = month.interest / 4;
      
      return Array.from({ length: 4 }, (_, weekIdx) => ({
        weekIndex: (month.monthIndex - 1) * 4 + weekIdx + 1,
        monthIndex: month.monthIndex,
        week: weekIdx + 1,
        payment: weeklyPayment,
        principal: weeklyPrincipal,
        interest: weeklyInterest,
        // 剩余本金单位是"万"，转换为"元"需要乘以10000
        remainingPrincipal: month.remainingPrincipal * 10000,
        date: new Date(month.date.getFullYear(), month.date.getMonth(), weekIdx * 7 + 1)
      }));
    });
  }, [monthlyData]);

  // 按季度数据（带月份明细）
  const quarterlyData = useMemo(() => {
    const quarters: any[] = [];
    for (let q = 0; q < Math.ceil(monthlyData.length / 3); q++) {
      const quarterMonths = monthlyData.slice(q * 3, q * 3 + 3);
      if (quarterMonths.length === 0) continue;
      
      const totalPayment = quarterMonths.reduce((sum, m) => sum + m.payment, 0);
      const totalPrincipal = quarterMonths.reduce((sum, m) => sum + m.principal, 0);
      const totalInterest = quarterMonths.reduce((sum, m) => sum + m.interest, 0);
      const endingBalance = quarterMonths[quarterMonths.length - 1].remainingPrincipal;
      
      quarters.push({
        quarterIndex: q + 1,
        year: Math.floor(q / 4) + 1,
        quarterInYear: (q % 4) + 1,
        totalPayment,
        totalPrincipal,
        totalInterest,
        endingBalance,
        date: quarterMonths[0].date,
        months: quarterMonths
      });
    }
    return quarters;
  }, [monthlyData]);

  // 按年汇总数据
  const yearlyData = useMemo(() => {
    const years: any[] = [];
    for (let year = 1; year <= Math.ceil(monthlyData.length / 12); year++) {
      const yearMonths = monthlyData.filter(m => m.year === year);
      if (yearMonths.length === 0) continue;

      const totalPayment = yearMonths.reduce((sum, m) => sum + m.payment, 0);
      const totalPrincipal = yearMonths.reduce((sum, m) => sum + m.principal, 0);
      const totalInterest = yearMonths.reduce((sum, m) => sum + m.interest, 0);
      const endingBalance = yearMonths[yearMonths.length - 1].remainingPrincipal;

      years.push({
        year,
        totalPayment,
        totalPrincipal,
        totalInterest,
        endingBalance,
        months: yearMonths
      });
    }
    return years;
  }, [monthlyData]);

  // 翻译文本
  const labels = {
    byDay: t.paymentDetails?.byDay || '按日',
    byWeek: t.paymentDetails?.byWeek || '按周',
    byMonth: t.paymentDetails?.byMonth || '按月',
    byQuarter: t.paymentDetails?.byQuarter || '按季',
    byYear: t.paymentDetails?.byYear || '按年',
    all: t.paymentDetails?.all || '全部',
    day: t.paymentDetails?.dayLabel || '天',
    week: t.paymentDetails?.weekLabel || '周',
    month: t.paymentDetails?.monthLabel || '月',
    quarter: t.paymentDetails?.quarterLabel || '季度',
    year: t.paymentDetails?.yearLabel || '年',
    date: t.paymentDetails?.date || '日期',
    payment: t.paymentDetails?.payment || '还款',
    principal: t.paymentDetails?.principal || '本金',
    interest: t.paymentDetails?.interest || '利息',
    remaining: t.paymentDetails?.remaining || '剩余本金',
    total: t.paymentDetails?.total || '合计',
  };

  return (
    <div className="flex flex-col overflow-hidden h-[750px] border-t border-slate-100 dark:border-slate-800">
      {/* 标题栏 */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {t.paymentDetails?.title || '详细还款计划'}
            </h3>
          </div>
        </div>

        {/* 视图切换 */}
        <div className="flex flex-wrap gap-2">
          {[
            { mode: 'day' as ViewMode, label: labels.byDay },
            { mode: 'week' as ViewMode, label: labels.byWeek },
            { mode: 'month' as ViewMode, label: labels.byMonth },
            { mode: 'quarter' as ViewMode, label: labels.byQuarter },
            { mode: 'year' as ViewMode, label: labels.byYear },
            { mode: 'all' as ViewMode, label: labels.all },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => handleViewChange(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                viewMode === mode
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 表格内容 */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        {/* 按年视图 */}
        {viewMode === 'year' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {yearlyData.map((yearData) => (
              <div key={yearData.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedYear(expandedYear === yearData.year ? null : yearData.year)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedYear === yearData.year ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="font-bold text-slate-800 dark:text-white">
                        {t.paymentDetails?.yearN?.replace('{year}', yearData.year) || `第${yearData.year}年`}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">{labels.payment}：</span>
                        <span className="font-medium text-slate-800 dark:text-white">
                          {(yearData.totalPayment / 10000).toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">{labels.principal}：</span>
                        <span className="font-medium text-green-600">
                          {(yearData.totalPrincipal / 10000).toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">{labels.interest}：</span>
                        <span className="font-medium text-red-600">
                          {(yearData.totalInterest / 10000).toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">{labels.remaining}：</span>
                        <span className="font-medium text-indigo-600">
                          {yearData.endingBalance.toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedYear === yearData.year && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-4 pb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-2 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.month}</th>
                          <th className="py-2 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.date}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.payment}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.principal}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.interest}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.remaining}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearData.months.map((month: any) => (
                          <tr key={month.monthIndex} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 text-slate-700 dark:text-slate-300">{month.monthIndex}</td>
                            <td className="py-2 text-slate-700 dark:text-slate-300">{month.date.toLocaleDateString()}</td>
                            <td className="py-2 text-right font-medium text-slate-800 dark:text-white">{month.payment.toFixed(2)}</td>
                            <td className="py-2 text-right text-green-600">{month.principal.toFixed(2)}</td>
                            <td className="py-2 text-right text-red-600">{month.interest.toFixed(2)}</td>
                            <td className="py-2 text-right text-indigo-600">{(month.remainingPrincipal * 10000).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 按季度视图（可展开） */}
        {viewMode === 'quarter' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {quarterlyData.map((quarter) => (
              <div key={quarter.quarterIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedQuarter(expandedQuarter === quarter.quarterIndex ? null : quarter.quarterIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedQuarter === quarter.quarterIndex ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="font-bold text-slate-800 dark:text-white">
                        {t.paymentDetails?.quarterN?.replace('{year}', quarter.year).replace('{q}', quarter.quarterInYear) || 
                          `第${quarter.year}年 Q${quarter.quarterInYear}`}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">{labels.payment}：</span>
                        <span className="font-medium text-slate-800 dark:text-white">
                          {(quarter.totalPayment / 10000).toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">{labels.principal}：</span>
                        <span className="font-medium text-green-600">
                          {(quarter.totalPrincipal / 10000).toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">{labels.interest}：</span>
                        <span className="font-medium text-red-600">
                          {(quarter.totalInterest / 10000).toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">{labels.remaining}：</span>
                        <span className="font-medium text-indigo-600">
                          {quarter.endingBalance.toFixed(2)}{t.unitWanSimple}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedQuarter === quarter.quarterIndex && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-4 pb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-2 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.month}</th>
                          <th className="py-2 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.date}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.payment}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.principal}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.interest}</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.remaining}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quarter.months.map((month: any) => (
                          <tr key={month.monthIndex} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 text-slate-700 dark:text-slate-300">{month.monthIndex}</td>
                            <td className="py-2 text-slate-700 dark:text-slate-300">{month.date.toLocaleDateString()}</td>
                            <td className="py-2 text-right font-medium text-slate-800 dark:text-white">{month.payment.toFixed(2)}</td>
                            <td className="py-2 text-right text-green-600">{month.principal.toFixed(2)}</td>
                            <td className="py-2 text-right text-red-600">{month.interest.toFixed(2)}</td>
                            <td className="py-2 text-right text-indigo-600">{(month.remainingPrincipal * 10000).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 按日视图 */}
        {viewMode === 'day' && (
          <>
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                <tr>
                  <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.day}</th>
                  <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.date}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.payment}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.principal}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.interest}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.remaining}</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.slice(0, dayPage * PAGE_SIZE.day).map((day) => (
                  <tr key={day.dayIndex} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{day.dayIndex}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{day.date.toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-white">{day.payment.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-green-600">{day.principal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-red-600">{day.interest.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-indigo-600">{day.remainingPrincipal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dayPage * PAGE_SIZE.day < dailyData.length && (
              <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setDayPage(p => p + 1)}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t.paymentDetails?.loadMore || '加载更多'} ({dayPage * PAGE_SIZE.day}/{dailyData.length})
                </button>
              </div>
            )}
          </>
        )}

        {/* 按周视图 */}
        {viewMode === 'week' && (
          <>
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                <tr>
                  <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.week}</th>
                  <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.date}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.payment}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.principal}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.interest}</th>
                  <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.remaining}</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.slice(0, weekPage * PAGE_SIZE.week).map((week) => (
                  <tr key={week.weekIndex} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{week.weekIndex}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{week.date.toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-white">{week.payment.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-green-600">{week.principal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-red-600">{week.interest.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-indigo-600">{week.remainingPrincipal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {weekPage * PAGE_SIZE.week < weeklyData.length && (
              <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setWeekPage(p => p + 1)}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t.paymentDetails?.loadMore || '加载更多'} ({weekPage * PAGE_SIZE.week}/{weeklyData.length})
                </button>
              </div>
            )}
          </>
        )}

        {/* 按月视图 */}
        {viewMode === 'month' && (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
              <tr>
                <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.month}</th>
                <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">{labels.date}</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.payment}</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.principal}</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.interest}</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">{labels.remaining}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month) => (
                <tr key={month.monthIndex} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{month.monthIndex}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{month.date.toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-white">{month.payment.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-green-600">{month.principal.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-red-600">{month.interest.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-indigo-600">{(month.remainingPrincipal * 10000).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 全部视图 */}
        {viewMode === 'all' && (
          <div className="p-4 space-y-2">
            {monthlyData.map((month) => (
              <div
                key={month.monthIndex}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {t.paymentDetails?.periodN?.replace('{n}', month.monthIndex) || `第${month.monthIndex}期`}
                  </span>
                  <span className="text-xs text-slate-500">{month.date.toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{labels.payment}：</span>
                    <span className="font-medium text-slate-800 dark:text-white">{month.payment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{labels.principal}：</span>
                    <span className="font-medium text-green-600">{month.principal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{labels.interest}：</span>
                    <span className="font-medium text-red-600">{month.interest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{labels.remaining}：</span>
                    <span className="font-medium text-indigo-600">{(month.remainingPrincipal * 10000).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部统计 */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="text-slate-500 mb-1">{t.paymentDetails?.totalTerms || '总期数'}</div>
            <div className="font-bold text-slate-800 dark:text-white">
              {monthlyData.length} {labels.month}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 mb-1">{t.paymentDetails?.totalRepayment || '总还款'}</div>
            <div className="font-bold text-slate-800 dark:text-white">
              {(monthlyData.reduce((sum, m) => sum + m.payment, 0) / 10000).toFixed(2)}{t.unitWanSimple}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 mb-1">{t.paymentDetails?.totalInterest || '总利息'}</div>
            <div className="font-bold text-red-600">
              {(monthlyData.reduce((sum, m) => sum + m.interest, 0) / 10000).toFixed(2)}{t.unitWanSimple}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPaymentTable;
