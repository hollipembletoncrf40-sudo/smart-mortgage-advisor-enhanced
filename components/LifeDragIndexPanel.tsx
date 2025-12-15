import React, { useState } from 'react';
import { calculateLifeDragIndex } from '../utils/calculate';
import { InvestmentParams, LiquidityParams, LifeDragMetrics } from '../types';
import { Bot, Sparkles, Lock, MapPin, Coffee, Hourglass, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { sendAIMessage } from '../utils/aiProvider';

// Simple markdown parser (reuse from LiquidityCheckPanel or import utility if shared)
// Duplicating for now to ensure standalone component works
const parseMarkdown = (text: string): string => {
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2 text-violet-800 dark:text-violet-300">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-4 mb-2 text-violet-800 dark:text-violet-300">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-violet-900 dark:text-violet-200">$1</strong>')
    .replace(/^\s*- (.*$)/gim, '<li class="ml-4 text-slate-700 dark:text-slate-300 my-1">• $1</li>')
    .replace(/\n\n/g, '<br/><br/>');
};

interface LifeDragIndexPanelProps {
  params: InvestmentParams;
  liquidityParams?: LiquidityParams;
  monthlyIncome?: number;
  aiConfig: any;
  onOpenSettings: () => void;
  t: any;
}

const LifeDragIndexPanel: React.FC<LifeDragIndexPanelProps> = ({ 
  params, 
  liquidityParams, 
  monthlyIncome = 30000, 
  aiConfig, 
  onOpenSettings,
  t 
}) => {
  const metrics = calculateLifeDragIndex(params, liquidityParams, monthlyIncome);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const dragColor = metrics.totalDragScore < 30 ? 'text-emerald-500' 
                   : metrics.totalDragScore < 60 ? 'text-amber-500' 
                   : 'text-rose-600';
  
  const handleAskAI = async () => {
    if (!aiConfig.apiKey) {
      onOpenSettings();
      return;
    }
    
    setIsGenerating(true);
    const prompt = `房产拖累指数分析：总分${metrics.totalDragScore}/100。
    维度详情：
    1. 职业锁定：${metrics.careerLockScore}/100 (因房贷不敢换工作/失业风险)
    2. 城市枷锁：${metrics.geoLockScore}/100 (因房产难以置换/跨城市发展)
    3. 生活压缩：${metrics.lifestyleCompressionScore}/100 (因月供压缩消费/旅行/学习)
    4. 计划推迟：${metrics.futureDelayScore}/100 (结婚/生子/创业等计划受阻)
    
    请扮演一位资深人生规划师，给出犀利但诚恳的分析：
    1. 用一句话总结这个“拖累”程度。
    2. 深度剖析这套房产对人生的潜在隐性成本。
    3. 给出3条具体的“解套”或“减负”建议。`;

    try {
      const response = await sendAIMessage(aiConfig, prompt);
      setAiAnalysis(response);
    } catch (error) {
      console.error(error);
      setAiAnalysis("AI连接失败，请检查设置。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Lock className="h-6 w-6 text-rose-400" />
          房子拖累指数 (Life Drag Index)
        </h2>
        <p className="text-slate-400 text-sm mt-1">有些房子不会毁掉你，但会慢慢拖住你。</p>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* Left: Score & Visual */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Circular Progress Placeholder */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200 dark:text-slate-700" />
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - metrics.totalDragScore / 100)}
                className={metrics.totalDragScore < 30 ? 'text-emerald-500' : metrics.totalDragScore < 60 ? 'text-amber-500' : 'text-rose-500'}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-5xl font-black ${dragColor}`}>{metrics.totalDragScore}</span>
              <span className="text-sm text-slate-500 uppercase font-bold tracking-wider">拖累值</span>
            </div>
          </div>
          <p className="text-center mt-4 text-slate-600 dark:text-slate-300 font-medium px-4">
            "{metrics.advice}"
          </p>
        </div>

        {/* Right: Dimensions */}
        <div className="space-y-4">
          <DragDimension 
            icon={<Bot className="h-5 w-5" />} 
            label="职业锁定" 
            subLabel="是否限制换工作/失业风险" 
            score={metrics.careerLockScore} 
            color="bg-blue-500"
          />
          <DragDimension 
            icon={<MapPin className="h-5 w-5" />} 
            label="城市枷锁" 
            subLabel="是否限制城市流动" 
            score={metrics.geoLockScore} 
            color="bg-purple-500"
          />
          <DragDimension 
            icon={<Coffee className="h-5 w-5" />} 
            label="生活压缩" 
            subLabel="是否压缩社交/旅行/学习" 
            score={metrics.lifestyleCompressionScore} 
            color="bg-amber-500"
          />
          <DragDimension 
            icon={<Hourglass className="h-5 w-5" />} 
            label="人生推迟" 
            subLabel="是否推迟结婚/生子/创业" 
            score={metrics.futureDelayScore} 
            color="bg-rose-500"
          />
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        {!aiAnalysis ? (
          <div className="text-center">
            <button 
              onClick={handleAskAI}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-5 w-5" />
              {isGenerating ? 'AI 正在分析你的人生...' : 'AI 投资顾问：评估我的人生自由度'}
            </button>
            <p className="text-xs text-slate-400 mt-2">基于 AI 深度分析房产对你未来的隐性影响</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
            <h3 className="text-md font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI 投资顾问深度评估
            </h3>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(aiAnalysis) }}
            />
            <div className="mt-4 flex justify-end">
              <button onClick={() => setAiAnalysis(null)} className="text-sm text-slate-400 hover:text-indigo-500">
                重新分析
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DragDimension: React.FC<{ icon: React.ReactNode, label: string, subLabel: string, score: number, color: string }> = ({ icon, label, subLabel, score, color }) => (
  <div>
    <div className="flex justify-between items-end mb-1">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg text-white ${color.replace('bg-', 'bg-opacity-80 bg-')}`}>{icon}</div>
        <div>
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</div>
          <div className="text-[10px] text-slate-400">{subLabel}</div>
        </div>
      </div>
      <span className={`text-sm font-bold ${score > 60 ? 'text-rose-500' : score > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>{score}分</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color}`} 
        style={{ width: `${score}%` }}
      ></div>
    </div>
  </div>
);

export default LifeDragIndexPanel;
