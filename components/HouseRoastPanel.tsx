import React, { useState, useEffect } from 'react';
import { Home, AlertTriangle, Info, Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react';
import { RoastResult, generateHouseRoasts } from '../utils/houseRoast';
import { InvestmentParams, CalculationResult, Language } from '../types';

interface HouseRoastPanelProps {
  params: InvestmentParams;
  result: CalculationResult;
  t: any;
  language?: Language;
}

const HouseRoastPanel: React.FC<HouseRoastPanelProps> = ({ params, result, t, language = 'ZH' as Language }) => {
  const [roasts, setRoasts] = useState<RoastResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [animatedIndex, setAnimatedIndex] = useState(-1);

  useEffect(() => {
    const generatedRoasts = generateHouseRoasts(params, result, language);
    setRoasts(generatedRoasts);
    
    // 如果有严重或危险的问题，自动展开
    const hasCritical = generatedRoasts.some(r => r.severity === 'critical' || r.severity === 'serious');
    setIsExpanded(hasCritical);
    setShowPanel(generatedRoasts.length > 0);
  }, [params, result]);

  // 打字机动画效果
  useEffect(() => {
    if (isExpanded && roasts.length > 0) {
      setAnimatedIndex(-1);
      const timer = setTimeout(() => {
        setAnimatedIndex(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, roasts]);

  useEffect(() => {
    if (animatedIndex >= 0 && animatedIndex < roasts.length - 1) {
      const timer = setTimeout(() => {
        setAnimatedIndex(animatedIndex + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [animatedIndex, roasts.length]);

  if (!showPanel || roasts.length === 0) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'serious': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'mild': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-slate-300 bg-slate-50 dark:bg-slate-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'serious': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'mild': return <Info className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 rounded-3xl p-6 shadow-xl border-2 border-purple-200 dark:border-purple-800 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -z-0"></div>
      
      {/* 关闭按钮 */}
      <button
        onClick={() => setShowPanel(false)}
        className="absolute top-4 right-4 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors z-10"
        title="关闭"
      >
        <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* 标题区域 */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {t.roastTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.roastSubtitle}
            </p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex gap-2 mt-3">
          {roasts.filter(r => r.severity === 'critical').length > 0 && (
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
              {(t.roastCritical || '{count} Danger Signals').replace('{count}', roasts.filter(r => r.severity === 'critical').length)}
            </span>
          )}
          {roasts.filter(r => r.severity === 'serious').length > 0 && (
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium">
              {(t.roastSerious || '{count} Serious Issues').replace('{count}', roasts.filter(r => r.severity === 'serious').length)}
            </span>
          )}
          {roasts.filter(r => r.severity === 'mild').length > 0 && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
              {(t.roastMild || '{count} Tips').replace('{count}', roasts.filter(r => r.severity === 'mild').length)}
            </span>
          )}
        </div>
      </div>

      {/* 展开/收起按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all mb-4 relative z-10"
      >
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {isExpanded 
            ? (t.roastCollapse || 'Hide Roasts') 
            : (t.roastExpand || 'View {count} Roasts').replace('{count}', roasts.length)}
        </span>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {/* 吐槽内容 */}
      {isExpanded && (
        <div className="space-y-4 relative z-10">
          {roasts.map((roast, index) => (
            <div
              key={index}
              className={`${getSeverityColor(roast.severity)} border-2 rounded-2xl p-5 transition-all duration-500 ${
                index <= animatedIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {/* 吐槽标题 */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{roast.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityIcon(roast.severity)}
                    <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                      {roast.category === 'budget' && (t.roastCatBudget || 'Budget Issue')}
                      {roast.category === 'location' && (t.roastCatLocation || 'Location Fantasy')}
                      {roast.category === 'commute' && (t.roastCatCommute || 'Commute Cost')}
                      {roast.category === 'cost' && (t.roastCatCost || 'Cost Beautification')}
                      {roast.category === 'return' && (t.roastCatReturn || 'Return Fantasy')}
                      {roast.category === 'lifestyle' && (t.roastCatLifestyle || 'Lifestyle Mismatch')}
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-800 dark:text-white leading-relaxed">
                    {roast.roastMessage}
                  </p>
                </div>
              </div>

              {/* 现实检查 */}
              <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 mb-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      📊 {t.roastReality || 'Reality Check'}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {roast.realityCheck}
                    </p>
                  </div>
                </div>
              </div>

              {/* 建议 */}
              <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                      💡 {t.roastSuggestion || 'Advice'}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {roast.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 底部提示 */}
          <div className="text-center pt-4 border-t border-purple-200 dark:border-purple-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.roastFooter || '💜 Roast is tough love. Buy smart, live happy.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseRoastPanel;
