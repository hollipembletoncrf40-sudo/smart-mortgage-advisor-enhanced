import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info, Sparkles } from 'lucide-react';
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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    
    // Map 0-100 to different parameters based on market sentiment
    const newAppreciation = -2 + (val / 100) * 10; // -2% to 8%
    
    // Investment Return: More dynamic based on sentiment
    let newReturn = 4;
    if (val < 50) {
      newReturn = 2 + (val / 50) * 2; // 2% to 4%
    } else {
      newReturn = 4 + ((val - 50) / 50) * 4; // 4% to 8%
    }

    // Interest rate adjustment (inverse relationship with market sentiment)
    // Bullish market often means higher rates, bearish means lower rates
    const baseRate = 4.2;
    const rateAdjustment = ((val - 50) / 50) * 0.5; // ±0.5%
    const newInterestRate = baseRate + rateAdjustment;

    onChange({
      appreciationRate: Number(newAppreciation.toFixed(1)),
      alternativeReturnRate: Number(newReturn.toFixed(1)),
      interestRate: Number(newInterestRate.toFixed(2))
    });
  };

  const getSentimentData = (val: number) => {
    if (val < 30) {
      return {
        text: t.sentimentBearish || '悲观 (熊市)',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-900',
        icon: TrendingDown,
        description: t.sentimentDescBearish || '市场低迷，房价可能下跌，但贷款利率较低',
        advice: t.sentimentAdviceBearish || '适合有稳定收入、风险承受能力强的购房者',
        impacts: [
          { label: t.impactPrice || '房价', trend: 'down', value: t.impactDown || '下行压力' },
          { label: t.impactRateShort || '利率', trend: 'down', value: t.impactLow || '相对较低' },
          { label: t.impactRent || '租金', trend: 'stable', value: t.impactStable || '相对稳定' }
        ]
      };
    }
    if (val > 70) {
      return {
        text: t.sentimentBullish || '乐观 (牛市)',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-900',
        icon: TrendingUp,
        description: t.sentimentDescBullish || '市场繁荣，房价上涨，但贷款成本增加',
        advice: t.sentimentAdviceBullish || '需要评估高房价和高利率的双重压力',
        impacts: [
          { label: t.impactPrice || '房价', trend: 'up', value: t.impactUp || '快速上涨' },
          { label: t.impactRateShort || '利率', trend: 'up', value: t.impactHigh || '相对较高' },
          { label: t.impactRent || '租金', trend: 'up', value: t.impactSyncUp || '同步上涨' }
        ]
      };
    }
    return {
      text: t.sentimentNeutral || '中性 (震荡)',
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-50 dark:bg-slate-800/50',
      borderColor: 'border-slate-200 dark:border-slate-700',
      icon: Minus,
      description: t.sentimentDescNeutral || '市场平稳，各项指标处于合理区间',
      advice: t.sentimentAdviceNeutral || '适合大多数购房者的常规市场环境',
      impacts: [
        { label: t.impactPrice || '房价', trend: 'stable', value: t.impactSteady || '平稳增长' },
        { label: t.impactRateShort || '利率', trend: 'stable', value: t.impactMedium || '中等水平' },
        { label: t.impactRent || '租金', trend: 'stable', value: t.impactSteadyGrow || '稳定增长' }
      ]
    };
  };

  const currentVal = getSliderValue();
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

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-green-500" />;
    return <Minus className="h-3 w-3 text-slate-400" />;
  };

  return (
    <div className={`p-5 rounded-2xl border-2 ${sentimentData.borderColor} ${sentimentData.bgColor} shadow-lg transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <label className="text-sm font-bold text-slate-700 dark:text-white">
            {t.marketSentiment || '市场情绪调节'}
          </label>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${sentimentData.bgColor} border ${sentimentData.borderColor}`}>
          <Icon className={`h-4 w-4 ${sentimentData.color}`} />
          <span className={`text-xs font-bold ${sentimentData.color}`}>{sentimentData.text}</span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-8 flex items-center mb-4">
        <div className="absolute w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-slate-400 to-red-500" 
            style={{ width: '100%' }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={currentVal}
          onChange={handleSliderChange}
          className="absolute w-full h-3 opacity-0 cursor-pointer z-10"
        />
        <div 
          className="absolute h-6 w-6 bg-white dark:bg-slate-800 border-3 border-indigo-500 rounded-full shadow-lg pointer-events-none transition-all duration-200 flex items-center justify-center"
          style={{ left: `calc(${currentVal}% - 12px)` }}
        >
          <div className="h-2 w-2 bg-indigo-500 rounded-full" />
        </div>
      </div>

      <div className="flex justify-between mb-4 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        <span>{t.sentimentBearish?.split(' ')[0] || '悲观'}</span>
        <span>{t.sentimentNeutral?.split(' ')[0] || '中性'}</span>
        <span>{t.sentimentBullish?.split(' ')[0] || '乐观'}</span>
      </div>

      {/* Description */}
      <div className="mb-4 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-2 mb-2">
          <Info className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {sentimentData.description}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {sentimentData.advice}
          </p>
        </div>
      </div>

      {/* Parameter Display */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] text-slate-500 mb-1">{t.sentimentProperty || '房产增值'}</div>
          <div className="text-sm font-bold text-slate-800 dark:text-white">
            {params.appreciationRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] text-slate-500 mb-1">{t.sentimentReturn || '理财收益'}</div>
          <div className="text-sm font-bold text-slate-800 dark:text-white">
            {params.alternativeReturnRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] text-slate-500 mb-1">{t.sentimentRate || '贷款利率'}</div>
          <div className="text-sm font-bold text-slate-800 dark:text-white">
            {params.interestRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Market Impact Indicators */}
      <div className="mb-4">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">{t.marketImpact || '市场影响'}</div>
        <div className="grid grid-cols-3 gap-2">
          {sentimentData.impacts.map((impact, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">{impact.label}</span>
                {getTrendIcon(impact.trend)}
              </div>
              <div className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                {impact.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Preview */}
      {impactPreview && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-900">
          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">
            {t.predictionResult || '当前情绪下的结果预测'}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {impactPreview.recommendation}
            </span>
            <span className={`text-sm font-bold ${impactPreview.buyAdvantage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {impactPreview.buyAdvantage > 0 ? '+' : ''}{impactPreview.buyAdvantagePercent}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketSentimentSlider;
