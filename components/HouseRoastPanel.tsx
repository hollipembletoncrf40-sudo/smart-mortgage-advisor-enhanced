import React, { useState, useEffect } from 'react';
import { Home, AlertTriangle, Info, Lightbulb, ChevronRight, Bot, MessageSquare, Brain } from 'lucide-react';
import { RoastResult, generateHouseRoasts } from '../utils/houseRoast';
import { InvestmentParams, CalculationResult, Language } from '../types';
import { generateAIPerspective } from '../utils/decisionSupport';

interface HouseRoastPanelProps {
  params: InvestmentParams;
  result: CalculationResult;
  t: any;
  language?: Language;
}

const HouseRoastPanel: React.FC<HouseRoastPanelProps> = ({ params, result, t, language = 'ZH' as Language }) => {
  const [roasts, setRoasts] = useState<RoastResult[]>([]);
  const [activeTab, setActiveTab] = useState<'roast' | 'advice'>('roast');

  // Generate roasts
  useEffect(() => {
    const generatedRoasts = generateHouseRoasts(params, result, language);
    setRoasts(generatedRoasts);
  }, [params, result, language]);

  // Generate AI Perspective
  const aiPerspective = generateAIPerspective(params, language);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-rose-500 bg-rose-500/5';
      case 'serious': return 'border-l-amber-500 bg-amber-500/5';
      case 'mild': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-slate-500 bg-slate-500/5';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-[10px] font-bold uppercase rounded">{language === 'EN' ? 'DANGER' : '危险'}</span>;
      case 'serious': return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase rounded">{language === 'EN' ? 'WARNING' : '警告'}</span>;
      case 'mild': return <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-[10px] font-bold uppercase rounded">{language === 'EN' ? 'TIP' : '提示'}</span>;
      default: return null;
    }
  };

  // 统计各类问题数量
  const criticalCount = roasts.filter(r => r.severity === 'critical').length;
  const seriousCount = roasts.filter(r => r.severity === 'serious').length;
  const mildCount = roasts.filter(r => r.severity === 'mild').length;

  return (
    <div className="bg-white dark:bg-[#0a0a0f] rounded-t-3xl p-5 border border-b-0 border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.roastTitle || '🏠 房子有话说'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.roastSubtitle || '清醒一下，让我们面对现实'}</p>
          </div>
        </div>
        
        {/* Problem Count Badges */}
        <div className="flex gap-1.5">
          {criticalCount > 0 && (
            <span className="px-2 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {criticalCount}
            </span>
          )}
          {seriousCount > 0 && (
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {seriousCount}
            </span>
          )}
          {mildCount > 0 && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg text-xs font-bold flex items-center gap-1">
              <Info className="h-3 w-3" />
              {mildCount}
            </span>
          )}
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-transparent">
        <button
          onClick={() => setActiveTab('roast')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'roast'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          {t.roastTabRoast || '现实检查'}
        </button>
        <button
          onClick={() => setActiveTab('advice')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'advice'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50'
          }`}
        >
          <Brain className="h-4 w-4" />
          {t.roastTabAdvice || 'AI 建议'}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800/30 rounded-2xl p-4 min-h-[200px] border border-slate-100 dark:border-transparent">
        {/* Roast Tab Content */}
        {activeTab === 'roast' && (
          <div className="space-y-2">
            {roasts.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">🎉</span>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{t.roastNoIssues || '恭喜！暂无重大问题'}</p>
              </div>
            ) : (
              <>
                {roasts.slice(0, 3).map((roast, index) => (
                  <div
                    key={index}
                    className={`${getSeverityColor(roast.severity)} border-l-4 rounded-lg p-3 bg-white/80 dark:bg-slate-800/50`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl flex-shrink-0">{roast.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getSeverityBadge(roast.severity)}
                          <span className="text-[10px] font-medium text-slate-500 uppercase">
                            {roast.category === 'budget' && (t.roastCatBudget || '预算问题')}
                            {roast.category === 'location' && (t.roastCatLocation || '地段幻想')}
                            {roast.category === 'commute' && (t.roastCatCommute || '通勤成本')}
                            {roast.category === 'cost' && (t.roastCatCost || '成本美化')}
                            {roast.category === 'return' && (t.roastCatReturn || '回报幻想')}
                            {roast.category === 'lifestyle' && (t.roastCatLifestyle || '生活错配')}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white leading-snug mb-2">
                          {roast.roastMessage}
                        </p>
                        
                        {/* Reality Check & Suggestion */}
                        <div className="flex flex-col gap-1.5 text-xs">
                          <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                            <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-indigo-400" />
                            <span>{roast.realityCheck}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                            <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0 text-amber-400" />
                            <span>{roast.suggestion}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* More indicator */}
                {roasts.length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      {t.roastMore || `还有 ${roasts.length - 3} 条提醒`}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* AI Advice Tab Content */}
        {activeTab === 'advice' && (
          <div className="space-y-4">
            {/* Decision Grade Badge */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-xl font-bold text-sm ${
                aiPerspective.grade === 'ready' ? 'bg-emerald-500 text-white' :
                aiPerspective.grade === 'caution' ? 'bg-amber-500 text-white' :
                aiPerspective.grade === 'stop' ? 'bg-rose-500 text-white' :
                'bg-slate-500 text-white'
              }`}>
                <span className="text-2xl">{aiPerspective.gradeIcon}</span>
                <span>{aiPerspective.gradeLabel}</span>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                aiPerspective.confidence > 70 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white' : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
              }`}>
                {aiPerspective.confidence}% {t.decisionDashboard?.confidence || '置信度'}
              </span>
            </div>

            {/* Grade Reason */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {aiPerspective.gradeReason}
              </p>
            </div>

            {/* AI Perspective */}
            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700/30">
              <div className="p-2 rounded-xl bg-indigo-500">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                  {t.ifIWereYou || '"如果我是你" AI 立场'}
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {aiPerspective.oneSentence}
                </p>
              </div>
            </div>
            
            {/* Key Factors */}
            <div className="flex flex-wrap gap-1.5">
              {aiPerspective.keyFactors.map((factor, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-400 font-medium border border-slate-200 dark:border-slate-600/50">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseRoastPanel;
