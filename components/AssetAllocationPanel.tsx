import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon, 
  ShieldAlert, 
  Coins, 
  Building2, 
  Car, 
  Laptop, 
  Gem, 
  Landmark, 
  Banknote, 
  Bitcoin, 
  ArrowRight,
  Target,
  AlertTriangle,
  Lightbulb,
  Wallet
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  BarChart, 
  Bar,
  Legend
} from 'recharts';
import { AssetItem, AssetType, PortfolioAnalysisResult, Language } from '../types';

interface AssetAllocationPanelProps {
  t: any;
  language?: Language;
}

const AssetAllocationPanel: React.FC<AssetAllocationPanelProps> = ({ t, language = 'ZH' }) => {
  const isEn = language === 'EN';

  // Initial Data
  const [assets, setAssets] = useState<AssetItem[]>([
    { id: '1', name: isEn ? 'Main Residence' : '自住房产', category: 'fixed', type: 'property', value: 3000000, growthRate: 3, riskLevel: 'low', liquidityScore: 2 },
    { id: '2', name: isEn ? 'Family Car' : '家用代步车', category: 'fixed', type: 'vehicle', value: 200000, growthRate: -15, riskLevel: 'medium', liquidityScore: 4 },
    { id: '3', name: isEn ? 'Stocks Account' : '股票账户', category: 'liquid', type: 'stock', value: 500000, growthRate: 8, riskLevel: 'high', liquidityScore: 9 },
    { id: '4', name: isEn ? 'Emergency Fund' : '应急储蓄', category: 'liquid', type: 'cash', value: 100000, growthRate: 2, riskLevel: 'low', liquidityScore: 10 },
  ]);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<AssetItem>>({
    category: 'fixed',
    type: 'property',
    growthRate: 0,
    riskLevel: 'medium',
    liquidityScore: 5
  });

  // Calculations
  const analysis: PortfolioAnalysisResult = useMemo(() => {
    const totalFixed = assets.filter(a => a.category === 'fixed').reduce((sum, a) => sum + a.value, 0);
    const totalLiquid = assets.filter(a => a.category === 'liquid').reduce((sum, a) => sum + a.value, 0);
    const totalNetWorth = totalFixed + totalLiquid;
    
    // Projection (20 Years)
    const projection = [];
    for (let year = 0; year <= 20; year++) {
      let currentFixed = 0;
      let currentLiquid = 0;
      const breakdown: any = {};
      
      assets.forEach(asset => {
        const futureValue = asset.value * Math.pow(1 + asset.growthRate / 100, year);
        if (asset.category === 'fixed') currentFixed += futureValue;
        else currentLiquid += futureValue;
        breakdown[asset.type] = (breakdown[asset.type] || 0) + futureValue;
      });
      
      projection.push({
        year: 2024 + year,
        total: currentFixed + currentLiquid,
        fixed: currentFixed,
        liquid: currentLiquid,
        breakdown
      });
    }

    // Risk Analysis
    let weightedRisk = 0;
    let weightedReturn = 0;
    assets.forEach(asset => {
      const weight = asset.value / totalNetWorth;
      const riskScore = asset.riskLevel === 'very_high' ? 10 : asset.riskLevel === 'high' ? 8 : asset.riskLevel === 'medium' ? 5 : 2;
      weightedRisk += riskScore * weight;
      weightedReturn += asset.growthRate * weight;
    });

    // Profile & Advice
    const liquidRatio = (totalLiquid / totalNetWorth) * 100;
    let profileType = isEn ? 'Balanced Investor' : '平衡型投资者';
    const warnings = [];
    const suggestions = [];

    if (liquidRatio < 10) {
      profileType = isEn ? 'Asset Heavy (Illiquid)' : '重资产型 (流动性差)';
      warnings.push(isEn ? 'High liquidity risk. Hard to raise cash in emergencies.' : '流动性风险高。突发情况可能难以变现。');
      suggestions.push(isEn ? 'Increase emergency fund.' : '建议增加应急储备金。');
    } else if (liquidRatio > 80) {
       profileType = isEn ? 'Cash Heavy' : '现金充沛型';
       suggestions.push(isEn ? 'Consider investing in appreciating assets to fight inflation.' : '考虑配置抗通胀资产。');
    }

    // Specific Fixed Asset Analysis
    const carValue = assets.filter(a => a.type === 'vehicle').reduce((sum, a) => sum + a.value, 0);
    if (carValue / totalNetWorth > 0.3) {
      warnings.push(isEn ? 'High exposure to depreciating assets (Vehicles).' : '车辆等贬值资产占比过高，严重拖累财富积累。');
    }

    return {
      totalNetWorth,
      totalFixed,
      totalLiquid,
      liquidRatio,
      projection,
      riskScore: weightedRisk * 10, // 0-100
      weightedReturn,
      advice: { profileType, warnings, suggestions },
      charts: {
        allocation: [
          { name: isEn ? 'Fixed Assets' : '固定资产', value: totalFixed, type: 'fixed' },
          { name: isEn ? 'Liquid Assets' : '流动资产', value: totalLiquid, type: 'liquid' }
        ],
        riskDistribution: assets.map(a => ({ name: a.name, value: a.value }))
      }
    };
  }, [assets, isEn]);

  // Handlers
  const handleAddItem = () => {
    if (!newItem.name || !newItem.value) return;
    setAssets([...assets, { ...newItem, id: Date.now().toString() } as AssetItem]);
    setShowAddForm(false);
    setNewItem({ category: 'fixed', type: 'property', growthRate: 0, riskLevel: 'medium', liquidityScore: 5 });
  };
  
  const handleDelete = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  // Helpers
  const formatMoney = (val: number) => isEn ? `¥${Math.round(val).toLocaleString()}` : `${(val/10000).toFixed(1)}万`;
  const getAssetIcon = (type: AssetType) => {
    switch(type) {
      case 'property': return <Building2 className="h-4 w-4" />;
      case 'vehicle': return <Car className="h-4 w-4" />;
      case 'hard_asset': return <Laptop className="h-4 w-4" />;
      case 'stock': return <TrendingUp className="h-4 w-4" />;
      case 'crypto': return <Bitcoin className="h-4 w-4" />;
      case 'gold': return <Gem className="h-4 w-4" />;
      case 'cash': return <Banknote className="h-4 w-4" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-indigo-100 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Total Net Worth' : '总净值'}</div>
          <div className="text-3xl font-bold">{formatMoney(analysis.totalNetWorth)}</div>
          <div className="text-xs text-indigo-100 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {isEn ? 'Exp. Growth' : '预期年化'}: {analysis.weightedReturn.toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow">
          <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Liquid Assets' : '流动资产'}</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(analysis.totalLiquid)}</div>
          <div className="text-xs text-slate-400 mt-2">
            {analysis.liquidRatio.toFixed(1)}% {isEn ? 'of total' : '占比'}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow">
           <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Fixed Assets' : '固定资产'}</div>
           <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{formatMoney(analysis.totalFixed)}</div>
           <div className="text-xs text-slate-400 mt-2">
             {(100 - analysis.liquidRatio).toFixed(1)}% {isEn ? 'of total' : '占比'}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow relative overflow-hidden">
           <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Risk Profile' : '风险画像'}</div>
           <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 truncate pr-2" title={analysis.advice.profileType}>
             {analysis.advice.profileType}
           </div>
           <div className="absolute right-2 bottom-2 opacity-10">
             <Target className="h-12 w-12" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Asset Management */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg h-fit">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-white">
               <Wallet className="h-5 w-5 text-indigo-500"/>
               {isEn ? 'Your Assets' : '资产清单'}
             </h3>
             <button 
               onClick={() => setShowAddForm(!showAddForm)}
               className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
             >
               <Plus className="h-5 w-5" />
             </button>
           </div>
           
           {/* Add Form */}
           {showAddForm && (
             <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 space-y-3">
               <input 
                 placeholder={isEn ? "Asset Name" : "资产名称"}
                 className="w-full text-sm p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                 value={newItem.name || ''}
                 onChange={e => setNewItem({...newItem, name: e.target.value})}
               />
               <div className="grid grid-cols-2 gap-2">
                 <select 
                   className="text-sm p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                   value={newItem.category}
                   onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                 >
                   <option value="fixed">{isEn ? 'Fixed' : '固定'}</option>
                   <option value="liquid">{isEn ? 'Liquid' : '流动'}</option>
                 </select>
                 <select 
                   className="text-sm p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                   value={newItem.type}
                   onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                 >
                   <option value="property">{isEn ? 'Property' : '房产'}</option>
                   <option value="vehicle">{isEn ? 'Vehicle' : '车辆'}</option>
                   <option value="stock">{isEn ? 'Stock' : '股票'}</option>
                   <option value="cash">{isEn ? 'Cash' : '现金'}</option>
                   <option value="crypto">{isEn ? 'Crypto' : '加密货币'}</option>
                   <option value="other_fixed">{isEn ? 'Other' : '其他'}</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <input 
                   type="number"
                   placeholder={isEn ? "Value (¥)" : "市值 (元)"}
                   className="text-sm p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                   value={newItem.value || ''}
                   onChange={e => setNewItem({...newItem, value: Number(e.target.value)})}
                 />
                 <input 
                   type="number"
                   placeholder={isEn ? "Growth %" : "年涨跌幅 %"}
                   className="text-sm p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                   value={newItem.growthRate}
                   onChange={e => setNewItem({...newItem, growthRate: Number(e.target.value)})}
                 />
               </div>
               <button 
                 onClick={handleAddItem}
                 className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
               >
                 {isEn ? 'Add Asset' : '添加资产'}
               </button>
             </div>
           )}

           <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
             {assets.map(asset => (
               <div key={asset.id} className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${asset.category === 'liquid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                     {getAssetIcon(asset.type)}
                   </div>
                   <div>
                     <div className="font-medium text-slate-800 dark:text-white text-sm">{asset.name}</div>
                     <div className="text-xs text-slate-500 flex items-center gap-2">
                       <span className={`${asset.growthRate >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {asset.growthRate > 0 ? '+' : ''}{asset.growthRate}%
                       </span>
                       <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                       {isEn ? asset.riskLevel : (asset.riskLevel === 'low' ? '低风险' : asset.riskLevel === 'high' ? '高风险' : '中风险')}
                     </div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="font-bold text-slate-800 dark:text-white text-sm">
                     {formatMoney(asset.value)}
                   </div>
                   <button 
                     onClick={() => handleDelete(asset.id)}
                     className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 px-2"
                   >
                     <Trash2 className="h-4 w-4" />
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* 3. Analysis Charts */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
             <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                {isEn ? 'Wealth Projection (20 Years)' : '未来20年财富推演'}
             </h3>
             <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={analysis.projection}>
                   <defs>
                     <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorLiquid" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="year" tick={{fontSize: 12}} />
                   <YAxis tickFormatter={(val) => `${val/10000}w`} tick={{fontSize: 12}} />
                   <Tooltip formatter={(val: number) => formatMoney(val)} />
                   <Area type="monotone" dataKey="liquid" stackId="1" stroke="#10b981" fill="url(#colorLiquid)" name={isEn ? "Liquid" : "流动资产"} />
                   <Area type="monotone" dataKey="fixed" stackId="1" stroke="#6366f1" fill="url(#colorFixed)" name={isEn ? "Fixed" : "固定资产"} />
                   <Legend />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             <p className="text-xs text-center text-slate-400 mt-2">
               {isEn ? 'Projection based on current growth/depreciation rates' : '基于当前设定资产涨跌幅推演'}
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Allocation Chart */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                 <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300">
                   {isEn ? 'Asset Allocation' : '资产配置比例'}
                 </h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={analysis.charts.allocation}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                       >
                         <Cell fill="#6366f1" />
                         <Cell fill="#10b981" />
                       </Pie>
                       <Tooltip formatter={(val: number) => formatMoney(val)} />
                       <Legend verticalAlign="bottom" height={36}/>
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              {/* Advisory Panel */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col">
                 <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                   <Lightbulb className="h-4 w-4 text-amber-500" />
                   {isEn ? 'AI Advisory' : 'AI 投资顾问'}
                 </h3>
                 
                 <div className="flex-1 space-y-4">
                   {analysis.advice.warnings.length > 0 && (
                     <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
                       <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1">
                         <AlertTriangle className="h-3 w-3" /> {isEn ? 'Risk Warnings' : '风险预警'}
                       </h4>
                       <ul className="text-xs text-rose-700 dark:text-rose-300 space-y-1 list-disc list-inside">
                         {analysis.advice.warnings.map((w, i) => <li key={i}>{w}</li>)}
                       </ul>
                     </div>
                   )}
                   
                   <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                     <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
                       <Target className="h-3 w-3" /> {isEn ? 'Optimization Strategy' : '优化策略'}
                     </h4>
                     <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1 list-disc list-inside">
                       {analysis.advice.suggestions.length > 0 
                         ? analysis.advice.suggestions.map((s, i) => <li key={i}>{s}</li>)
                         : (isEn ? <li>Your portfolio looks balanced. Keep it up!</li> : <li>您的资产配置较为均衡，请继续保持！</li>)
                       }
                     </ul>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationPanel;
