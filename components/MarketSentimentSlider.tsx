import React, { useMemo, useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info, Sparkles, Activity, Target, Zap, BarChart3, Gauge, DollarSign, Home, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { InvestmentParams, CalculationResult } from '../types';

interface MarketSentimentSliderProps {
  params: InvestmentParams;
  onChange: (updates: Partial<InvestmentParams>) => void;
  result?: CalculationResult;
  t: any;
}

const MarketSentimentSlider: React.FC<MarketSentimentSliderProps> = ({ params, onChange, result, t }) => {
  // Calculate current sentiment value (0-100) based on appreciation rate
  const getSliderValue = () => {
    const rate = params.appreciationRate;
    if (rate <= -2) return 0;
    if (rate >= 8) return 100;
    return ((rate + 2) / 10) * 100;
  };

  // Local state for 60fps smooth sliding
  const [localVal, setLocalVal] = useState(getSliderValue());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Sync local state when params change externally
  useEffect(() => {
    const newVal = getSliderValue();
    if (Math.abs(newVal - localVal) > 1 && !debounceTimer.current) {
      setLocalVal(newVal);
    }
  }, [params.appreciationRate]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalVal(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      const newAppreciation = -2 + (val / 100) * 10;
      
      let newReturn = 4;
      if (val < 50) {
        newReturn = 2 + (val / 50) * 2;
      } else {
        newReturn = 4 + ((val - 50) / 50) * 4;
      }

      const baseRate = 4.2;
      const rateAdjustment = ((val - 50) / 50) * 0.5;
      const newInterestRate = baseRate + rateAdjustment;

      onChange({
        appreciationRate: Number(newAppreciation.toFixed(1)),
        alternativeReturnRate: Number(newReturn.toFixed(1)),
        interestRate: Number(newInterestRate.toFixed(2))
      });
      
      debounceTimer.current = null;
    }, 15);
  };

  const getSentimentData = (val: number) => {
    if (val < 30) {
      return {
        text: t.sentimentBearish || '悲观 (熊市)',
        shortText: '熊市',
        color: 'from-emerald-500 to-teal-500',
        textColor: 'text-emerald-400',
        icon: TrendingDown,
        description: t.sentimentDescBearish || '市场低迷，房价可能下跌，但贷款利率较低',
        advice: t.sentimentAdviceBearish || '适合有稳定收入、风险承受能力强的购房者',
        score: Math.round(val * 1.5),
        riskLevel: '低风险',
        marketPhase: '买入机会',
        impacts: [
          { label: '房价', trend: 'down', value: '下行压力', icon: Home },
          { label: '利率', trend: 'down', value: '较低', icon: Percent },
          { label: '租金', trend: 'stable', value: '稳定', icon: DollarSign }
        ]
      };
    }
    if (val > 70) {
      return {
        text: t.sentimentBullish || '乐观 (牛市)',
        shortText: '牛市',
        color: 'from-rose-500 to-red-500',
        textColor: 'text-rose-400',
        icon: TrendingUp,
        description: t.sentimentDescBullish || '市场繁荣，房价上涨，但贷款成本增加',
        advice: t.sentimentAdviceBullish || '需要评估高房价和高利率的双重压力',
        score: Math.round(val * 1.2),
        riskLevel: '高风险',
        marketPhase: '谨慎观望',
        impacts: [
          { label: '房价', trend: 'up', value: '上涨', icon: Home },
          { label: '利率', trend: 'up', value: '较高', icon: Percent },
          { label: '租金', trend: 'up', value: '上涨', icon: DollarSign }
        ]
      };
    }
    return {
      text: t.sentimentNeutral || '中性 (震荡)',
      shortText: '震荡',
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      icon: Minus,
      description: t.sentimentDescNeutral || '市场平稳，各项指标处于合理区间',
      advice: t.sentimentAdviceNeutral || '适合大多数购房者的常规市场环境',
      score: 50 + Math.round((val - 50) * 0.8),
      riskLevel: '中等风险',
      marketPhase: '正常配置',
      impacts: [
        { label: '房价', trend: 'stable', value: '平稳', icon: Home },
        { label: '利率', trend: 'stable', value: '中等', icon: Percent },
        { label: '租金', trend: 'stable', value: '稳定', icon: DollarSign }
      ]
    };
  };

  const currentVal = localVal;
  const sentimentData = getSentimentData(currentVal);
  const Icon = sentimentData.icon;

  // Calculate impact preview
  const impactPreview = useMemo(() => {
    if (!result) return null;
    
    const buyAdvantage = result.assetComparison.houseNetWorth - result.assetComparison.stockNetWorth;
    const buyAdvantagePercent = ((buyAdvantage / result.assetComparison.stockNetWorth) * 100).toFixed(1);
    
    return {
      buyAdvantage,
      buyAdvantagePercent,
      recommendation: buyAdvantage > 0 ? (t.recommendBuy || '买房更优') : (t.recommendRent || '租房投资更优')
    };
  }, [result, t]);

  // Circular gauge component
  const CircularGauge = ({ value, max, color, label, icon: GaugeIcon }: any) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / max) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent"
              className="text-slate-900"
            />
            <circle
              cx="40" cy="40" r={radius} stroke={color} strokeWidth="4" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <GaugeIcon className={`w-5 h-5 ${sentimentData.textColor}`} />
          </div>
        </div>
        <div className="text-center mt-1">
          <div className="text-lg font-bold text-white">{value}%</div>
          <div className="text-[10px] text-slate-400">{label}</div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="bg-black rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header - Naval Style */}
      <div className="relative px-6 py-5 border-b border-slate-800/30 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute inset-0 bg-gradient-to-r ${sentimentData.color} transition-all duration-700`} style={{ opacity: 0.2 }} />
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-br ${sentimentData.color} rounded-2xl shadow-lg`}>
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {t.marketSentiment || '市场情绪调节器'}
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/30 text-purple-300 rounded-full">PRO</span>
              </h3>
              <p className="text-xs text-slate-400">{t.marketSentimentDesc || '动态模拟不同市场周期环境'}</p>
            </div>
          </div>
          
          {/* Sentiment Badge */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${sentimentData.color} shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
            <div className="text-right">
              <div className="text-xs text-white/70">{sentimentData.riskLevel}</div>
              <div className="text-sm font-bold text-white">{sentimentData.shortText}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Slider */}
        <div className="relative mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> 悲观
            </span>
            <span className="text-xs font-bold text-amber-400">中性</span>
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              乐观 <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          
          <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
            {/* Gradient Track */}
            <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500" />
            
            {/* Active Fill */}
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 transition-all duration-100"
              style={{ width: `${currentVal}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.6)]" />
            </div>
          </div>
          
          {/* Invisible Input */}
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={currentVal}
            onChange={handleSliderChange}
            className="absolute top-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{ top: '-8px', height: 'calc(100% + 16px)' }}
          />
          
          {/* Current Value Indicator */}
          <div 
            className="absolute -bottom-6 transform -translate-x-1/2 transition-all duration-100"
            style={{ left: `${currentVal}%` }}
          >
            <div className={`px-2 py-1 rounded bg-gradient-to-r ${sentimentData.color} text-white text-xs font-bold shadow-lg`}>
              {currentVal.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Core Metrics - Naval Style Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/80 backdrop-blur rounded-xl p-4 border border-slate-700/30 hover:border-indigo-500/50 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Home className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-xs text-indigo-300 font-medium">{t.sentimentProperty || '房产增值'}</span>
            </div>
            <div className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
              {params.appreciationRate >= 0 ? '+' : ''}{params.appreciationRate.toFixed(1)}%
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, (params.appreciationRate + 2) / 10 * 100))}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur rounded-xl p-4 border border-slate-700/30 hover:border-emerald-500/50 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-emerald-300 font-medium">{t.sentimentReturn || '理财收益'}</span>
            </div>
            <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
              +{params.alternativeReturnRate.toFixed(1)}%
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, params.alternativeReturnRate / 10 * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur rounded-xl p-4 border border-slate-700/30 hover:border-amber-500/50 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs text-amber-300 font-medium">{t.sentimentRate || '贷款利率'}</span>
            </div>
            <div className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
              {params.interestRate.toFixed(2)}%
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, params.interestRate / 8 * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Market Impact - Enhanced Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            <h4 className="text-sm font-bold text-white">{t.marketImpact || '市场影响分析'}</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {sentimentData.impacts.map((impact, index) => {
              const ImpactIcon = impact.icon;
              return (
                <div 
                  key={index} 
                  className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/30 hover:border-purple-500/30 transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ImpactIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium text-slate-400">{impact.label}</span>
                    </div>
                    <div className={`p-1.5 rounded-lg ${
                      impact.trend === 'up' ? 'bg-rose-500/20' :
                      impact.trend === 'down' ? 'bg-emerald-500/20' :
                      'bg-slate-800'
                    }`}>
                      {impact.trend === 'up' ? <TrendingUp className="w-3 h-3 text-rose-400" /> :
                       impact.trend === 'down' ? <TrendingDown className="w-3 h-3 text-emerald-400" /> :
                       <Minus className="w-3 h-3 text-slate-400" />}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">{impact.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Info className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-purple-300 mb-1">市场分析</div>
                <p className="text-xs text-slate-400 leading-relaxed">{sentimentData.description}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Target className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300 mb-1">投资建议</div>
                <p className="text-xs text-slate-400 leading-relaxed">{sentimentData.advice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Result - Premium Card */}
        {impactPreview && (
          <div className={`relative overflow-hidden p-5 rounded-2xl border-2 ${
            impactPreview.buyAdvantage > 0 
              ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-teal-900/20'
              : 'border-rose-500/30 bg-gradient-to-br from-rose-900/20 to-red-900/20'
          }`}>
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl ${
              impactPreview.buyAdvantage > 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'
            }`} />
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className={`w-4 h-4 ${impactPreview.buyAdvantage > 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className="text-xs font-bold text-slate-300">{t.predictionResult || '当前情绪下的结果预测'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${impactPreview.buyAdvantage > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {impactPreview.recommendation}
                  </span>
                  {impactPreview.buyAdvantage > 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-rose-400" />
                  )}
                </div>
              </div>
              <div className={`text-4xl font-black ${impactPreview.buyAdvantage > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {impactPreview.buyAdvantage > 0 ? '+' : ''}{impactPreview.buyAdvantagePercent}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketSentimentSlider;
