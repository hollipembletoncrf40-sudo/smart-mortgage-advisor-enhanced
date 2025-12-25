import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, BookOpen, TrendingUp, Award, Unlock, Sparkles } from 'lucide-react';
import { knowledgeBase, knowledgeCategories, getUnlockedTerms, getTerm, KnowledgeTerm, getNextLockedTerm } from '../utils/knowledgeBase';
import MarkdownRenderer from './MarkdownRenderer';

interface KnowledgeTreeProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTermId?: string;
  onSelectTerm?: (termId: string) => void;
  t: any;
}

const KnowledgeTree: React.FC<KnowledgeTreeProps> = ({ isOpen, onClose, selectedTermId, onSelectTerm, t }) => {
  const [userProgress, setUserProgress] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<KnowledgeTerm | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Check language
  const isEnglish = t.knowledgeTree === 'Knowledge Tree';

  // Load user progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('knowledgeProgress');
    if (stored) {
      setUserProgress(JSON.parse(stored));
    } else {
      // Initialize with 'always' unlocked terms
      setUserProgress(['always']);
    }
  }, []);

  // Auto-select term if provided
  useEffect(() => {
    if (selectedTermId) {
      const term = getTerm(selectedTermId);
      if (term) {
        setSelectedTerm(term);
        setActiveCategory(term.category);
      }
    }
  }, [selectedTermId]);

  const unlockProgress = (condition: string) => {
    if (!userProgress.includes(condition)) {
      const newProgress = [...userProgress, condition];
      setUserProgress(newProgress);
      localStorage.setItem('knowledgeProgress', JSON.stringify(newProgress));
    }
  };

  const manualUnlockTerm = (termId: string) => {
    const term = getTerm(termId);
    if (term && !userProgress.includes(term.unlockCondition)) {
      unlockProgress(term.unlockCondition);
    }
  };

  const unlockedTerms = getUnlockedTerms(userProgress);
  const totalTerms = Object.keys(knowledgeBase).length;
  const progressPercentage = (unlockedTerms.length / totalTerms) * 100;

  const isTermUnlocked = (term: KnowledgeTerm) => {
    return term.unlockCondition === 'always' || userProgress.includes(term.unlockCondition);
  };

  const getCategoryTerms = (category: string) => {
    return Object.values(knowledgeBase).filter(term => term.category === category);
  };

  const getTermTitle = (term: KnowledgeTerm) => isEnglish ? (term.termEn || term.term) : term.term;
  const getTermShort = (term: KnowledgeTerm) => isEnglish ? (term.shortDescEn || term.shortDesc) : term.shortDesc;
  const getTermLong = (term: KnowledgeTerm) => isEnglish ? (term.longDescEn || term.longDesc) : term.longDesc;
  const getCategoryName = (cat: any) => isEnglish ? (cat.nameEn || cat.name) : cat.name;

  if (!isOpen) return null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.knowledgeTree || '知识树'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.knowledgeTreeDesc || '学习财务知识，做出明智决策'}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">{t.learningProgress || '学习进度'}</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{unlockedTerms.length} / {totalTerms}</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex min-h-[600px]">
          {/* Categories Sidebar */}
          <div className="w-48 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 space-y-2">
            {Object.entries(knowledgeCategories).map(([key, category]) => {
              const categoryTerms = getCategoryTerms(key);
              const unlockedCount = categoryTerms.filter(isTermUnlocked).length;
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveCategory(key);
                    setSelectedTerm(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    activeCategory === key
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-white">{getCategoryName(category)}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {unlockedCount}/{categoryTerms.length} {t.unlocked || '已解锁'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedTerm ? (
              /* Term Detail View */
              <div className="p-6 animate-in slide-in-from-right duration-200">
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-4 flex items-center gap-1"
                >
                  ← {t.backToList || '返回列表'}
                </button>

                <div className="space-y-6">
                  {/* Term Header */}
                  <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{getTermTitle(selectedTerm)}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{getTermShort(selectedTerm)}</p>
                  </div>

                  {/* Term Content */}
                  <div>
                    <MarkdownRenderer content={getTermLong(selectedTerm)} />
                  </div>

                  {/* Related Terms */}
                  {selectedTerm.relatedTerms.length > 0 && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-bold text-slate-700 dark:text-white mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                        {t.relatedTerms || '相关术语'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTerm.relatedTerms.map(termId => {
                          const relatedTerm = getTerm(termId);
                          if (!relatedTerm) return null;
                          const unlocked = isTermUnlocked(relatedTerm);
                          
                          return (
                            <button
                              key={termId}
                              onClick={() => unlocked && setSelectedTerm(relatedTerm)}
                              disabled={!unlocked}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                unlocked
                                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {unlocked ? getTermTitle(relatedTerm) : `🔒 ${getTermTitle(relatedTerm)}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Unlock Next Term Button */}
                  {(() => {
                    const nextTerm = getNextLockedTerm(selectedTerm.id, userProgress);
                    if (nextTerm) {
                      return (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                <Unlock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                                  {t.unlockNext || '解锁下一个知识点'}
                                </h5>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                  {t.unlockHint || '看完当前内容后，点击下方按钮解锁：'}<span className="font-bold text-indigo-600 dark:text-indigo-400">{getTermTitle(nextTerm)}</span>
                                </p>
                                <button
                                  onClick={() => {
                                    manualUnlockTerm(nextTerm.id);
                                    setSelectedTerm(nextTerm);
                                  }}
                                  className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                  <Unlock className="h-4 w-4" />
                                  {t.unlockAndView || '解锁并查看'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            ) : activeCategory ? (
              /* Category Term List */
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {getCategoryName(knowledgeCategories[activeCategory as keyof typeof knowledgeCategories])}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.clickTermHint || '点击术语查看详细解释，看完后可以解锁下一个知识点'}
                  </p>
                </div>
                <div className="space-y-3">
                  {getCategoryTerms(activeCategory).map(term => {
                    const unlocked = isTermUnlocked(term);
                    
                    return (
                      <button
                        key={term.id}
                        onClick={() => unlocked && setSelectedTerm(term)}
                        disabled={!unlocked}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          unlocked
                            ? 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                            : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${unlocked ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            {unlocked ? (
                              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                              <Lock className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-800 dark:text-white mb-1">{getTermTitle(term)}</div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{getTermShort(term)}</p>
                            {!unlocked && (
                              <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-2">
                                🔒 {t.unlockHint || '完成相关操作后解锁'}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Welcome View */
              <div className="flex items-center justify-center h-full p-6">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <TrendingUp className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      {t.welcomeToKnowledgeTree || '欢迎来到知识树'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t.knowledgeTreeWelcome || '选择左侧分类开始学习财务知识，每完成一次分析就能解锁更多内容！'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Award className="h-4 w-4" />
                    <span>{t.keepLearning || '持续学习，提升财商'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default KnowledgeTree;
