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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-slate-50 via-indigo-50/50 to-purple-50/50 dark:from-slate-800 dark:via-indigo-900/20 dark:to-purple-900/20 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <label className="text-base font-bold text-slate-800 dark:text-white">
                {t.marketSentiment || '市场情绪调节'}
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">调整参数模拟不同市场环境</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
            currentVal < 30 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' :
            currentVal > 70 ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white' :
            'bg-gradient-to-r from-slate-600 to-slate-700 text-white'
          }`}>
            <Icon className="h-4 w-4" />
            <span className="text-sm font-bold">{sentimentData.text}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Premium Slider */}
        <div className="relative mb-6">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 via-50% to-rose-500 opacity-80" style={{ width: '100%' }} />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={currentVal}
            onChange={handleSliderChange}
            className="absolute top-0 w-full h-4 opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-8 w-8 bg-white dark:bg-slate-800 border-4 border-indigo-500 dark:border-indigo-400 rounded-full shadow-xl pointer-events-none transition-all duration-200 flex items-center justify-center"
            style={{ left: `calc(${currentVal}% - 16px)` }}
          >
            <div className="h-3 w-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-sm" />
          </div>
          
          {/* Tick marks */}
          <div className="flex justify-between mt-2 px-1">
            <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">悲观</div>
            <div className="text-[10px] font-medium text-amber-600 dark:text-amber-400">中性</div>
            <div className="text-[10px] font-medium text-rose-600 dark:text-rose-400">乐观</div>
          </div>
        </div>

        {/* Description Card */}
        <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {sentimentData.description}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {sentimentData.advice}
            </p>
          </div>
        </div>

        {/* Parameter Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">{t.sentimentProperty || '房产增值'}</div>
            <div className="text-xl font-black text-indigo-700 dark:text-indigo-300">
              {params.appreciationRate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">{t.sentimentReturn || '理财收益'}</div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
              {params.alternativeReturnRate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">{t.sentimentRate || '贷款利率'}</div>
            <div className="text-xl font-black text-amber-700 dark:text-amber-300">
              {params.interestRate.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Market Impact Grid */}
        <div className="mb-5">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            {t.marketImpact || '市场影响'}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {sentimentData.impacts.map((impact, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{impact.label}</span>
                  <div className={`p-1 rounded-full ${
                    impact.trend === 'up' ? 'bg-rose-100 dark:bg-rose-900/30' :
                    impact.trend === 'down' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    {getTrendIcon(impact.trend)}
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  {impact.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Preview */}
        {impactPreview && (
          <div className={`p-4 rounded-xl border-2 ${
            impactPreview.buyAdvantage > 0 
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
              : 'bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-rose-200 dark:border-rose-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.predictionResult || '当前情绪下的结果预测'}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {impactPreview.recommendation}
                </span>
              </div>
              <div className={`text-2xl font-black ${impactPreview.buyAdvantage > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
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
