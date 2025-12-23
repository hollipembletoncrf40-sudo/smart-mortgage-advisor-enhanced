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
  Wallet,
  Activity,
  BarChart3,
  Shield,
  Zap,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingDown as TrendDown,
  DollarSign,
  Percent,
  Edit3,
  Check,
  X
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
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { AssetItem, AssetType, PortfolioAnalysisResult, Language } from '../types';

interface AssetAllocationPanelProps {
  t: any;
  language?: Language;
}

// Asset type colors
const ASSET_COLORS: Record<string, string> = {
  property: '#6366f1',
  vehicle: '#f59e0b',
  hard_asset: '#8b5cf6',
  stock: '#10b981',
  crypto: '#f97316',
  gold: '#eab308',
  cash: '#06b6d4',
  fund_bond: '#3b82f6',
  other_fixed: '#64748b',
  other_liquid: '#94a3b8'
};

const AssetAllocationPanel: React.FC<AssetAllocationPanelProps> = ({ t, language = 'ZH' }) => {
  const isEn = language === 'EN';

  // Initial Data
  const [assets, setAssets] = useState<AssetItem[]>([
    { id: '1', name: isEn ? 'Main Residence' : '自住房产', category: 'fixed', type: 'property', value: 3000000, growthRate: 3, riskLevel: 'low', liquidityScore: 2 },
    { id: '2', name: isEn ? 'Family Car' : '家用代步车', category: 'fixed', type: 'vehicle', value: 200000, growthRate: -15, riskLevel: 'medium', liquidityScore: 4 },
    { id: '3', name: isEn ? 'Stocks Account' : '股票账户', category: 'liquid', type: 'stock', value: 500000, growthRate: 8, riskLevel: 'high', liquidityScore: 9 },
    { id: '4', name: isEn ? 'Emergency Fund' : '应急储蓄', category: 'liquid', type: 'cash', value: 100000, growthRate: 2, riskLevel: 'low', liquidityScore: 10 },
    { id: '5', name: isEn ? 'Gold Investment' : '黄金投资', category: 'liquid', type: 'gold', value: 80000, growthRate: 5, riskLevel: 'low', liquidityScore: 7 },
    { id: '6', name: isEn ? 'Bond Fund' : '债券基金', category: 'liquid', type: 'fund_bond', value: 150000, growthRate: 4, riskLevel: 'low', liquidityScore: 8 },
  ]);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<AssetItem>>({
    category: 'fixed',
    type: 'property',
    growthRate: 0,
    riskLevel: 'medium',
    liquidityScore: 5
  });

  // Enhanced Analysis with Financial Health Scoring
  const analysis = useMemo(() => {
    const totalFixed = assets.filter(a => a.category === 'fixed').reduce((sum, a) => sum + a.value, 0);
    const totalLiquid = assets.filter(a => a.category === 'liquid').reduce((sum, a) => sum + a.value, 0);
    const totalNetWorth = totalFixed + totalLiquid;
    
    // Projection (20 Years)
    const projection = [];
    for (let year = 0; year <= 20; year++) {
      let currentFixed = 0;
      let currentLiquid = 0;
      
      assets.forEach(asset => {
        const futureValue = asset.value * Math.pow(1 + asset.growthRate / 100, year);
        if (asset.category === 'fixed') currentFixed += futureValue;
        else currentLiquid += futureValue;
      });
      
      projection.push({
        year: 2024 + year,
        total: currentFixed + currentLiquid,
        fixed: currentFixed,
        liquid: currentLiquid
      });
    }

    // Risk Analysis
    let weightedRisk = 0;
    let weightedReturn = 0;
    let weightedLiquidity = 0;
    assets.forEach(asset => {
      const weight = asset.value / totalNetWorth;
      const riskScore = asset.riskLevel === 'very_high' ? 10 : asset.riskLevel === 'high' ? 8 : asset.riskLevel === 'medium' ? 5 : 2;
      weightedRisk += riskScore * weight;
      weightedReturn += asset.growthRate * weight;
      weightedLiquidity += (asset.liquidityScore || 5) * weight;
    });

    // Asset Type Breakdown
    const assetTypeBreakdown: Record<string, number> = {};
    assets.forEach(asset => {
      assetTypeBreakdown[asset.type] = (assetTypeBreakdown[asset.type] || 0) + asset.value;
    });

    const assetTypeChart = Object.entries(assetTypeBreakdown).map(([type, value]) => ({
      name: getAssetTypeName(type as AssetType, isEn),
      value,
      type,
      color: ASSET_COLORS[type] || '#64748b'
    }));

    // Risk-Return scatter data
    const riskReturnData = assets.map(asset => ({
      name: asset.name,
      risk: asset.riskLevel === 'very_high' ? 10 : asset.riskLevel === 'high' ? 8 : asset.riskLevel === 'medium' ? 5 : 2,
      return: asset.growthRate,
      value: asset.value,
      type: asset.type
    }));

    // Financial Health Scores (0-100)
    const liquidRatio = (totalLiquid / totalNetWorth) * 100;
    
    // Liquidity Score: 20-40% liquid is ideal
    const liquidityScore = liquidRatio < 10 ? 30 : 
                          liquidRatio < 20 ? 60 :
                          liquidRatio <= 40 ? 100 :
                          liquidRatio <= 60 ? 80 : 50;
    
    // Diversity Score: More asset types = better
    const assetTypeCount = Object.keys(assetTypeBreakdown).length;
    const diversityScore = Math.min(100, assetTypeCount * 15 + 10);
    
    // Growth Score: Based on weighted return
    const growthScore = weightedReturn < 0 ? 20 :
                       weightedReturn < 3 ? 50 :
                       weightedReturn < 6 ? 70 :
                       weightedReturn < 10 ? 90 : 100;
    
    // Risk Control Score: Lower risk = higher score (for balanced portfolio)
    const riskControlScore = weightedRisk > 8 ? 30 :
                            weightedRisk > 6 ? 50 :
                            weightedRisk > 4 ? 70 :
                            weightedRisk > 2 ? 90 : 100;
    
    // Overall Health Score
    const healthScore = Math.round(
      liquidityScore * 0.25 + 
      diversityScore * 0.25 + 
      growthScore * 0.25 + 
      riskControlScore * 0.25
    );

    // Health Score radar data
    const healthRadarData = [
      { subject: isEn ? 'Liquidity' : '流动性', score: liquidityScore, fullMark: 100 },
      { subject: isEn ? 'Diversity' : '多样性', score: diversityScore, fullMark: 100 },
      { subject: isEn ? 'Growth' : '增长性', score: growthScore, fullMark: 100 },
      { subject: isEn ? 'Risk Control' : '风险控制', score: riskControlScore, fullMark: 100 },
    ];

    // Profile & Advice
    let profileType = isEn ? 'Balanced Investor' : '平衡型投资者';
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const optimizations: string[] = [];

    if (liquidRatio < 10) {
      profileType = isEn ? 'Asset Heavy (Illiquid)' : '重资产型 (流动性差)';
      warnings.push(isEn ? 'High liquidity risk. Hard to raise cash in emergencies.' : '流动性风险高，突发情况难以变现');
      suggestions.push(isEn ? 'Increase emergency fund to 3-6 months of expenses.' : '建议增加应急储备至3-6个月开销');
    } else if (liquidRatio > 60) {
      profileType = isEn ? 'Cash Heavy' : '现金充沛型';
      suggestions.push(isEn ? 'Consider investing in appreciating assets.' : '建议配置抗通胀资产，如房产或指数基金');
    }

    if (weightedRisk > 7) {
      profileType = isEn ? 'Aggressive Investor' : '激进型投资者';
      warnings.push(isEn ? 'High volatility exposure. Consider hedging.' : '组合波动性高，考虑对冲策略');
    } else if (weightedRisk < 3) {
      profileType = isEn ? 'Conservative Investor' : '保守型投资者';
    }

    // Specific warnings
    const carValue = assets.filter(a => a.type === 'vehicle').reduce((sum, a) => sum + a.value, 0);
    if (carValue / totalNetWorth > 0.2) {
      warnings.push(isEn ? 'Vehicle assets > 20%. Cars depreciate rapidly.' : '车辆资产占比超20%，贬值拖累财富积累');
      optimizations.push(isEn ? 'Consider selling extra vehicles.' : '考虑出售多余车辆，释放资金');
    }

    const cashValue = assets.filter(a => a.type === 'cash').reduce((sum, a) => sum + a.value, 0);
    if (cashValue / totalNetWorth > 0.3) {
      suggestions.push(isEn ? 'Too much idle cash. Inflation is eroding value.' : '现金闲置过多，通胀正在侵蚀购买力');
      optimizations.push(isEn ? 'Move excess cash to money market funds.' : '将多余现金转入货币基金获取收益');
    }

    const stockValue = assets.filter(a => a.type === 'stock' || a.type === 'crypto').reduce((sum, a) => sum + a.value, 0);
    if (stockValue / totalNetWorth > 0.5) {
      warnings.push(isEn ? 'High exposure to volatile assets (>50%).' : '高波动资产占比超50%，风险较大');
      optimizations.push(isEn ? 'Rebalance to include more bonds/gold.' : '建议增配债券/黄金以降低波动');
    }

    // Calculate potential improvement
    const potentialImprovement = optimizations.length > 0 ? 
      Math.min(2.5, optimizations.length * 0.8) : 0;

    return {
      totalNetWorth,
      totalFixed,
      totalLiquid,
      liquidRatio,
      projection,
      riskScore: weightedRisk * 10,
      weightedReturn,
      weightedLiquidity,
      healthScore,
      healthScores: {
        liquidity: liquidityScore,
        diversity: diversityScore,
        growth: growthScore,
        riskControl: riskControlScore
      },
      healthRadarData,
      assetTypeChart,
      riskReturnData,
      advice: { profileType, warnings, suggestions, optimizations, potentialImprovement },
      charts: {
        allocation: [
          { name: isEn ? 'Fixed Assets' : '固定资产', value: totalFixed, type: 'fixed' },
          { name: isEn ? 'Liquid Assets' : '流动资产', value: totalLiquid, type: 'liquid' }
        ]
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

  const handleUpdateAsset = (id: string, field: keyof AssetItem, value: any) => {
    setAssets(assets.map(a => a.id === id ? { ...a, [field]: value } : a));
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
      case 'fund_bond': return <Landmark className="h-4 w-4" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  const getHealthLabel = (score: number) => {
    if (score >= 85) return { label: isEn ? 'Excellent' : '优秀', color: 'text-emerald-500' };
    if (score >= 70) return { label: isEn ? 'Good' : '良好', color: 'text-green-500' };
    if (score >= 55) return { label: isEn ? 'Fair' : '一般', color: 'text-amber-500' };
    return { label: isEn ? 'Needs Work' : '待优化', color: 'text-rose-500' };
  };

  const healthLabel = getHealthLabel(analysis.healthScore);

  return (
    <div className="space-y-6">
      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-indigo-100 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Total Net Worth' : '总净值'}</div>
            <div className="text-3xl font-bold">{formatMoney(analysis.totalNetWorth)}</div>
            <div className="text-xs text-indigo-100 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {isEn ? 'Exp. Growth' : '预期年化'}: {analysis.weightedReturn.toFixed(1)}%
            </div>
          </div>
          <Sparkles className="absolute -bottom-2 -right-2 h-20 w-20 text-white/10" />
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow">
          <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Liquid Assets' : '流动资产'}</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(analysis.totalLiquid)}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded">
              {analysis.liquidRatio.toFixed(1)}%
            </span>
            {isEn ? 'of total' : '占比'}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow">
           <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Fixed Assets' : '固定资产'}</div>
           <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatMoney(analysis.totalFixed)}</div>
           <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
             <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded">
               {(100 - analysis.liquidRatio).toFixed(1)}%
             </span>
             {isEn ? 'of total' : '占比'}
           </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 shadow relative overflow-hidden">
          <div className="text-amber-700 dark:text-amber-400 text-xs mb-1 uppercase tracking-wider">{isEn ? 'Health Score' : '财务健康分'}</div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{analysis.healthScore}</div>
            <div className={`text-sm font-medium mb-1 ${healthLabel.color}`}>{healthLabel.label}</div>
          </div>
          <div className="mt-2 h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${analysis.healthScore}%` }}
            />
          </div>
          <Activity className="absolute -bottom-2 -right-2 h-16 w-16 text-amber-500/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Asset Management - Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
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
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newItem.name || ''}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                  >
                    <option value="fixed">{isEn ? 'Fixed' : '固定'}</option>
                    <option value="liquid">{isEn ? 'Liquid' : '流动'}</option>
                  </select>
                  <select 
                    className="text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    value={newItem.type}
                    onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                  >
                    <option value="property">{isEn ? 'Property' : '房产'}</option>
                    <option value="vehicle">{isEn ? 'Vehicle' : '车辆'}</option>
                    <option value="stock">{isEn ? 'Stock' : '股票'}</option>
                    <option value="fund_bond">{isEn ? 'Bonds/Fund' : '债券/基金'}</option>
                    <option value="cash">{isEn ? 'Cash' : '现金'}</option>
                    <option value="gold">{isEn ? 'Gold' : '黄金'}</option>
                    <option value="crypto">{isEn ? 'Crypto' : '加密货币'}</option>
                    <option value="other_fixed">{isEn ? 'Other' : '其他'}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <input 
                    type="number"
                    placeholder={isEn ? "Value (¥)" : "市值 (元)"}
                    className="text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    value={newItem.value || ''}
                    onChange={e => setNewItem({...newItem, value: Number(e.target.value)})}
                  />
                  <input 
                    type="number"
                    placeholder={isEn ? "Growth %" : "年涨跌幅 %"}
                    className="text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    value={newItem.growthRate}
                    onChange={e => setNewItem({...newItem, growthRate: Number(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    value={newItem.riskLevel}
                    onChange={e => setNewItem({...newItem, riskLevel: e.target.value as any})}
                  >
                    <option value="low">{isEn ? 'Low Risk' : '低风险'}</option>
                    <option value="medium">{isEn ? 'Medium Risk' : '中风险'}</option>
                    <option value="high">{isEn ? 'High Risk' : '高风险'}</option>
                  </select>
                  <input 
                    type="number"
                    placeholder={isEn ? "Liquidity (1-10)" : "流动性 (1-10)"}
                    min="1"
                    max="10"
                    className="text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    value={newItem.liquidityScore || 5}
                    onChange={e => setNewItem({...newItem, liquidityScore: Number(e.target.value)})}
                  />
                </div>
                <button 
                  onClick={handleAddItem}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  {isEn ? 'Add Asset' : '添加资产'}
                </button>
              </div>
            )}

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {assets.map(asset => (
                <div key={asset.id} className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${ASSET_COLORS[asset.type]}20`, color: ASSET_COLORS[asset.type] }}
                    >
                      {getAssetIcon(asset.type)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-white text-sm">{asset.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className={`${asset.growthRate >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {asset.growthRate > 0 ? '+' : ''}{asset.growthRate}%
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className={`${asset.riskLevel === 'high' ? 'text-rose-500' : asset.riskLevel === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {isEn ? asset.riskLevel : (asset.riskLevel === 'low' ? '低风险' : asset.riskLevel === 'high' ? '高风险' : '中风险')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div className="font-bold text-slate-800 dark:text-white text-sm">
                      {formatMoney(asset.value)}
                    </div>
                    <button 
                      onClick={() => handleDelete(asset.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Health Radar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              {isEn ? 'Health Analysis' : '健康分析'}
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analysis.healthRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analysis.healthRadarData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">{item.subject}</span>
                  <span className={`font-bold ${item.score >= 70 ? 'text-emerald-500' : item.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Charts & AI Advisory - Right Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Wealth Projection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-indigo-500" />
               {isEn ? 'Wealth Projection (20 Years)' : '未来20年财富推演'}
            </h3>
            <div className="h-[280px]">
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
                  <XAxis dataKey="year" tick={{fontSize: 11}} />
                  <YAxis tickFormatter={(val) => `${(val/10000).toFixed(0)}w`} tick={{fontSize: 11}} />
                  <Tooltip formatter={(val: number) => formatMoney(val)} />
                  <Area type="monotone" dataKey="liquid" stackId="1" stroke="#10b981" fill="url(#colorLiquid)" name={isEn ? "Liquid" : "流动资产"} />
                  <Area type="monotone" dataKey="fixed" stackId="1" stroke="#6366f1" fill="url(#colorFixed)" name={isEn ? "Fixed" : "固定资产"} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Type Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
              <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-violet-500" />
                {isEn ? 'Asset Breakdown' : '资产类型分布'}
              </h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.assetTypeChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {analysis.assetTypeChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => formatMoney(val)} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Advisory Panel - Enhanced */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/20 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
              <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                {isEn ? 'AI Investment Advisor' : 'AI 投资顾问'}
              </h3>
              
              {/* Portfolio Score */}
              <div className="mb-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">{isEn ? 'Portfolio Score' : '组合评分'}</span>
                  <span className={`text-lg font-bold ${healthLabel.color}`}>{analysis.healthScore}/100</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      analysis.healthScore >= 70 ? 'bg-emerald-500' : 
                      analysis.healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${analysis.healthScore}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">{analysis.advice.profileType}</div>
              </div>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {analysis.advice.warnings.length > 0 && (
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> {isEn ? 'Warnings' : '风险预警'}
                    </h4>
                    <ul className="text-xs text-rose-700 dark:text-rose-300 space-y-1">
                      {analysis.advice.warnings.map((w, i) => <li key={i}>• {w}</li>)}
                    </ul>
                  </div>
                )}
                
                {analysis.advice.optimizations.length > 0 && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
                      <Target className="h-3 w-3" /> {isEn ? 'Optimization' : '优化建议'}
                    </h4>
                    <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                      {analysis.advice.optimizations.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                    {analysis.advice.potentialImprovement > 0 && (
                      <div className="mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-800 text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {isEn ? 'Potential return improvement' : '预期收益提升'}: +{analysis.advice.potentialImprovement.toFixed(1)}%
                      </div>
                    )}
                  </div>
                )}
                
                {analysis.advice.suggestions.length > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" /> {isEn ? 'Suggestions' : '改进建议'}
                    </h4>
                    <ul className="text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
                      {analysis.advice.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                )}

                {analysis.advice.warnings.length === 0 && analysis.advice.optimizations.length === 0 && analysis.advice.suggestions.length === 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {isEn ? 'Your portfolio is well balanced!' : '您的资产配置非常均衡！'}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      {isEn ? 'Keep monitoring and stay disciplined.' : '请继续保持，定期审视调整。'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Risk-Return Analysis */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="font-bold text-sm mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-violet-500" />
              {isEn ? 'Asset Performance Comparison' : '资产表现对比'}
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assets} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val}%`} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip formatter={(val: number) => `${val}%`} />
                  <Bar dataKey="growthRate" radius={[0, 4, 4, 0]}>
                    {assets.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.growthRate >= 0 ? '#10b981' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for asset type names
function getAssetTypeName(type: AssetType, isEn: boolean): string {
  const names: Record<AssetType, [string, string]> = {
    property: ['Property', '房产'],
    vehicle: ['Vehicle', '车辆'],
    hard_asset: ['Equipment', '设备'],
    stock: ['Stocks', '股票'],
    crypto: ['Crypto', '加密货币'],
    gold: ['Gold', '黄金'],
    cash: ['Cash', '现金'],
    fund_bond: ['Bonds/Fund', '债基'],
    other_fixed: ['Other Fixed', '其他固定'],
    other_liquid: ['Other Liquid', '其他流动']
  };
  return names[type]?.[isEn ? 0 : 1] || type;
}

export default AssetAllocationPanel;
