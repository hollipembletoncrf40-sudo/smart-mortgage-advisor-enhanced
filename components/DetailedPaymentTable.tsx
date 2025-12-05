import React, { useState, useMemo } from 'react';
import { Calendar, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { CalculationResult } from '../types';

interface DetailedPaymentTableProps {
  result: CalculationResult;
  t: any;
}

type ViewMode = 'year' | 'month' | 'all';

const DetailedPaymentTable: React.FC<DetailedPaymentTableProps> = ({ result, t }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  // 生成完整的月度数据
  const monthlyData = useMemo(() => {
    if (!result.monthlyData) return [];
    return result.monthlyData.map((month, index) => ({
      ...month,
      monthIndex: index + 1,
      year: Math.floor(index / 12) + 1,
      monthInYear: (index % 12) + 1,
      date: new Date(new Date().getFullYear(), new Date().getMonth() + index + 1, 1)
    }));
  }, [result.monthlyData]);

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

  // 导出为CSV
  const exportToCSV = () => {
    const headers = ['期数', '年份', '月份', '日期', '月供(元)', '本金(元)', '利息(元)', '剩余本金(元)'];
    const rows = monthlyData.map(m => [
      m.monthIndex,
      m.year,
      m.monthInYear,
      m.date.toLocaleDateString('zh-CN'),
      m.payment.toFixed(2),
      m.principal.toFixed(2),
      m.interest.toFixed(2),
      m.remainingPrincipal.toFixed(2)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `还款计划_${new Date().toLocaleDateString('zh-CN')}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col overflow-hidden h-[750px] border-t border-slate-100 dark:border-slate-800">
      {/* 标题栏 */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              详细还款计划
            </h3>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors"
            title="导出CSV"
          >
            <Download className="h-3.5 w-3.5" />
            导出
          </button>
        </div>

        {/* 视图切换 */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('year')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'year'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
            }`}
          >
            按年
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'month'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
            }`}
          >
            按月
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
            }`}
          >
            全部
          </button>
        </div>
      </div>

      {/* 表格内容 */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'year' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {yearlyData.map((yearData) => (
              <div key={yearData.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {/* 年度汇总行 */}
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
                        第 {yearData.year} 年
                      </span>
                    </div>
                    <div className="flex gap-6 text-xs">
                      <div>
                        <span className="text-slate-500">年供：</span>
                        <span className="font-medium text-slate-800 dark:text-white">
                          {(yearData.totalPayment / 10000).toFixed(2)}万
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">本金：</span>
                        <span className="font-medium text-green-600">
                          {(yearData.totalPrincipal / 10000).toFixed(2)}万
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">利息：</span>
                        <span className="font-medium text-red-600">
                          {(yearData.totalInterest / 10000).toFixed(2)}万
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">剩余：</span>
                        <span className="font-medium text-indigo-600">
                          {(yearData.endingBalance / 10000).toFixed(2)}万
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 展开的月度明细 */}
                {expandedYear === yearData.year && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-4 pb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-2 text-left text-slate-600 dark:text-slate-400 font-medium">期数</th>
                          <th className="py-2 text-left text-slate-600 dark:text-slate-400 font-medium">月份</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">月供(元)</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">本金(元)</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">利息(元)</th>
                          <th className="py-2 text-right text-slate-600 dark:text-slate-400 font-medium">剩余本金(元)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearData.months.map((month: any) => (
                          <tr key={month.monthIndex} className="border-b border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800">
                            <td className="py-2 text-slate-700 dark:text-slate-300">{month.monthIndex}</td>
                            <td className="py-2 text-slate-700 dark:text-slate-300">{month.date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}</td>
                            <td className="py-2 text-right font-medium text-slate-800 dark:text-white">{month.payment.toFixed(2)}</td>
                            <td className="py-2 text-right text-green-600">{month.principal.toFixed(2)}</td>
                            <td className="py-2 text-right text-red-600">{month.interest.toFixed(2)}</td>
                            <td className="py-2 text-right text-indigo-600">{month.remainingPrincipal.toFixed(2)}</td>
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

        {viewMode === 'month' && (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
              <tr>
                <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">期数</th>
                <th className="py-3 px-4 text-left text-slate-600 dark:text-slate-400 font-medium">日期</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">月供(元)</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">本金(元)</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">利息(元)</th>
                <th className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">剩余本金(元)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month) => (
                <tr key={month.monthIndex} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{month.monthIndex}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{month.date.toLocaleDateString('zh-CN')}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-white">{month.payment.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-green-600">{month.principal.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-red-600">{month.interest.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-indigo-600">{month.remainingPrincipal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {viewMode === 'all' && (
          <div className="p-4 space-y-2">
            {monthlyData.map((month) => (
              <div
                key={month.monthIndex}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    第 {month.monthIndex} 期 - {month.date.toLocaleDateString('zh-CN')}
                  </span>
                  <span className="text-xs text-slate-500">
                    第 {month.year} 年第 {month.monthInYear} 月
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">月供：</span>
                    <span className="font-medium text-slate-800 dark:text-white">{month.payment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">本金：</span>
                    <span className="font-medium text-green-600">{month.principal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">利息：</span>
                    <span className="font-medium text-red-600">{month.interest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">剩余：</span>
                    <span className="font-medium text-indigo-600">{month.remainingPrincipal.toFixed(2)}</span>
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
            <div className="text-slate-500 mb-1">总期数</div>
            <div className="font-bold text-slate-800 dark:text-white">{monthlyData.length} 期</div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 mb-1">累计还款</div>
            <div className="font-bold text-slate-800 dark:text-white">
              {(monthlyData.reduce((sum, m) => sum + m.payment, 0) / 10000).toFixed(2)}万
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 mb-1">累计利息</div>
            <div className="font-bold text-red-600">
              {(monthlyData.reduce((sum, m) => sum + m.interest, 0) / 10000).toFixed(2)}万
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPaymentTable;
