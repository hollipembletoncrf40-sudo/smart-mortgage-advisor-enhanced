import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { HOUSING_RANKINGS } from '../utils/housingData';
import { TrendingUp, TrendingDown, BarChart3, ScatterChart as ScatterIcon, PieChart as PieIcon } from 'lucide-react';

const HousingTrendsPanel = ({ t }: { t: any }) => {
  const [showCount, setShowCount] = useState(15);
  const [sortBy, setSortBy] = useState<'rank' | 'yoy' | 'mom'>('rank');
  const [viewMode, setViewMode] = useState<'bar' | 'scatter' | 'pie'>('bar');

  // Get top N cities for chart
  const topCities = HOUSING_RANKINGS.slice(0, showCount);
  
  // Prepare chart data
  const chartData = topCities.map(city => ({
    name: city.name,
    price: city.price,
    newPrice: city.newPrice
  }));

  // Prepare scatter data
  const scatterData = topCities.map(city => ({
    name: city.name,
    secondHand: city.price,
    newHouse: city.newPrice,
    yoy: parseFloat(city.yoy.replace('%', '').replace('+', '')) || 0
  }));

  // Prepare pie data (top 10 cities by price)
  const pieData = HOUSING_RANKINGS.slice(0, 10).map(city => ({
    name: city.name,
    value: city.price
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1'];

  // Sort data for table
  const sortedData = [...HOUSING_RANKINGS].sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank;
    if (sortBy === 'yoy') {
      const aVal = parseFloat(a.yoy.replace('%', '').replace('+', '')) || 0;
      const bVal = parseFloat(b.yoy.replace('%', '').replace('+', '')) || 0;
      return bVal - aVal;
    }
    if (sortBy === 'mom') {
      const aVal = parseFloat(a.mom.replace('%', '').replace('+', '')) || 0;
      const bVal = parseFloat(b.mom.replace('%', '').replace('+', '')) || 0;
      return bVal - aVal;
    }
    return 0;
  });

  const parseChange = (change: string) => {
    if (change === '--') return null;
    return parseFloat(change.replace('%', '').replace('+', ''));
  };

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">可视化视图:</span>
        <button
          onClick={() => setViewMode('bar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            viewMode === 'bar'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          柱状图
        </button>
        <button
          onClick={() => setViewMode('scatter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            viewMode === 'scatter'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <ScatterIcon className="h-4 w-4" />
          散点图
        </button>
        <button
          onClick={() => setViewMode('pie')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            viewMode === 'pie'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <PieIcon className="h-4 w-4" />
          饼图
        </button>
      </div>

      {/* Chart Controls */}
      {viewMode !== 'pie' && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">显示前:</span>
          {[10, 15, 20, 30].map(count => (
            <button
              key={count}
              onClick={() => setShowCount(count)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                showCount === count
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {count}名
            </button>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'bar' && (
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}
              />
              <Legend />
              <Bar dataKey="price" name="二手房(元/㎡)" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="newPrice" name="新房(元/㎡)" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
          
          {viewMode === 'scatter' && (
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="secondHand" 
                name="二手房价格" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                label={{ value: '二手房(元/㎡)', position: 'bottom', offset: 40, style: { fontSize: 12, fill: '#64748b' } }}
              />
              <YAxis 
                type="number" 
                dataKey="newHouse" 
                name="新房价格"
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                label={{ value: '新房(元/㎡)', angle: -90, position: 'left', style: { fontSize: 12, fill: '#64748b' } }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any, name: string) => {
                  if (name === '二手房价格' || name === '新房价格') return `${value.toLocaleString()}元/㎡`;
                  return value;
                }}
              />
              <Scatter name="城市" data={scatterData} fill="#6366f1">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.yoy >= 0 ? '#10b981' : '#f43f5e'} />
                ))}
              </Scatter>
            </ScatterChart>
          )}

          {viewMode === 'pie' && (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => `${value.toLocaleString()}元/㎡`}
              />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-slate-600 dark:text-slate-400">排序:</span>
        <button
          onClick={() => setSortBy('rank')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            sortBy === 'rank'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          排名
        </button>
        <button
          onClick={() => setSortBy('yoy')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            sortBy === 'yoy'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          同比
        </button>
        <button
          onClick={() => setSortBy('mom')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            sortBy === 'mom'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          环比
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">排名</th>
                <th className="px-6 py-4">城市</th>
                <th className="px-6 py-4">二手房(元/㎡)</th>
                <th className="px-6 py-4">同比(去年)</th>
                <th className="px-6 py-4">环比(上月)</th>
                <th className="px-6 py-4">新房(元/㎡)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedData.map(city => {
                const yoyVal = parseChange(city.yoy);
                const momVal = parseChange(city.mom);
                
                return (
                  <tr key={city.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">{city.rank}</td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{city.name}</td>
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {city.price.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 font-mono font-bold ${
                      yoyVal === null ? 'text-slate-400' : yoyVal >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      <div className="flex items-center gap-1">
                        {yoyVal !== null && (yoyVal >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
                        {city.yoy}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-mono font-bold ${
                      momVal === null ? 'text-slate-400' : momVal >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      <div className="flex items-center gap-1">
                        {momVal !== null && (momVal >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
                        {city.mom}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                      {city.newPrice.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 text-center">
        数据来源: 用户提供 (2025年10月)
      </div>
    </div>
  );
};

export default HousingTrendsPanel;
