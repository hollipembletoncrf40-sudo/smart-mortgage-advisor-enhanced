import React, { useState } from 'react';
import { LiquidityParams, LiquidityAnalysis, BuyerType } from '../types';
import { calculateLiquidityAnalysis } from '../utils/calculate';
import { TrendingUp, TrendingDown, Minus, Users, Home, Briefcase, UserMinus, AlertTriangle, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { sendAIMessage } from '../utils/aiProvider';

// Simple markdown to HTML converter
const parseMarkdown = (text: string): string => {
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2 text-violet-800 dark:text-violet-300">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-4 mb-2 text-violet-800 dark:text-violet-300">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-4 mb-2 text-violet-800 dark:text-violet-300">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-violet-900 dark:text-violet-200">$1</strong>')
    .replace(/^\s*- (.*$)/gim, '<li class="ml-4 text-slate-700 dark:text-slate-300 my-1">• $1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 text-slate-700 dark:text-slate-300 my-1">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
};

interface LiquidityCheckPanelProps {
  t: any;
  aiConfig: any;
  onOpenSettings: () => void;
}

const LiquidityCheckPanel: React.FC<LiquidityCheckPanelProps> = ({ t, aiConfig, onOpenSettings }) => {
  const [params, setParams] = useState<LiquidityParams>({
    area: 90, bedrooms: 3, location: 'suburb', hasSchool: true, transitScore: 7,
    priceLevel: 'medium', propertyAge: 5, competitionLevel: 'medium',
    populationTrend: 'stable', policyEnvironment: 'neutral'
  });

  const [analysis, setAnalysis] = useState<LiquidityAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(calculateLiquidityAnalysis(params, t));
      setIsAnalyzing(false);
    }, 300);
  };

  const handleAIInsights = async () => {
    if (!aiConfig.apiKey) { onOpenSettings(); return; }
    setIsGeneratingAI(true);
    const prompt = `房产流动性分析：面积${params.area}㎡，${params.bedrooms}室，${params.hasSchool?'学区房':'非学区'}，交通${params.transitScore}/10，房龄${params.propertyAge}年。人口${params.populationTrend}，政策${params.policyEnvironment}。流动性${analysis?.liquidityScore}/100，预计${analysis?.expectedSaleMonths}月出售。请生成：1.买家画像 2.趋势预测 3.出售策略 4.风险提示`;
    try {
      setAiInsights(await sendAIMessage(prompt, aiConfig));
    } catch { setAiInsights('AI分析失败'); }
    setIsGeneratingAI(false);
  };

  const getBuyerIcon = (type: BuyerType) => {
    const icons = { [BuyerType.FIRST_TIME_YOUNG]: Users, [BuyerType.UPGRADING_FAMILY]: Home, [BuyerType.INVESTOR]: Briefcase, [BuyerType.DOWNSIZING]: UserMinus };
    const Icon = icons[type] || AlertTriangle;
    return <Icon className="h-5 w-5" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (trend === 'decreasing') return <TrendingDown className="h-4 w-4 text-rose-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const getScoreColor = (s: number) => s >= 75 ? 'text-emerald-600 dark:text-emerald-400' : s >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
  const getScoreBg = (s: number) => s >= 75 ? 'bg-emerald-500' : s >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Users className="h-6 w-6 text-indigo-500" />{t.liqTitle}</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.liqSubTitle}</p></div>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800/50">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">{t.liqInfo}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqArea}</label><input type="number" value={params.area} onChange={e=>setParams({...params,area:+e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"/></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqBedrooms}</label><select value={params.bedrooms} onChange={e=>setParams({...params,bedrooms:+e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}{t.unit || '室'}</option>)}</select></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqLocation}</label><select value={params.location} onChange={e=>setParams({...params,location:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"><option value="cbd">{t.locCBD}</option><option value="suburb">{t.locSuburb}</option><option value="remote">{t.locRemote}</option></select></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqSchool}</label><div className="flex gap-2">{[true,false].map(v=><button key={String(v)} onClick={()=>setParams({...params,hasSchool:v})} className={`flex-1 py-2 text-xs font-medium rounded-lg ${params.hasSchool===v?'bg-indigo-500 text-white':'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{v? (t.yes || '是') : (t.no || '否')}</button>)}</div></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqTransit}</label><input type="range" min="1" max="10" value={params.transitScore} onChange={e=>setParams({...params,transitScore:+e.target.value})} className="w-full"/><div className="text-center text-sm font-bold text-indigo-600 dark:text-indigo-400">{params.transitScore}</div></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqPriceLevel}</label><select value={params.priceLevel} onChange={e=>setParams({...params,priceLevel:e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"><option value="low">{t.plLow}</option><option value="medium">{t.plMedium}</option><option value="high">{t.plHigh}</option><option value="luxury">{t.plLuxury}</option></select></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqAge}</label><input type="number" value={params.propertyAge} onChange={e=>setParams({...params,propertyAge:+e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"/></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqCompetition}</label><select value={params.competitionLevel} onChange={e=>setParams({...params,competitionLevel:e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"><option value="low">{t.compLow}</option><option value="medium">{t.compMedium}</option><option value="high">{t.compHigh}</option></select></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqPopTrend}</label><select value={params.populationTrend} onChange={e=>setParams({...params,populationTrend:e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"><option value="growing">{t.popGrow}</option><option value="stable">{t.popStable}</option><option value="declining">{t.popDecline}</option></select></div>
          <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{t.liqPolicy}</label><select value={params.policyEnvironment} onChange={e=>setParams({...params,policyEnvironment:e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"><option value="favorable">{t.polFavor}</option><option value="neutral">{t.polNeutral}</option><option value="restrictive">{t.polRestrict}</option></select></div>
        </div>
        <button onClick={handleAnalyze} disabled={isAnalyzing} className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50">{isAnalyzing? (t.analyzing || '分析中...') : (t.liqAnalyzeBtn || '开始分析流动性')}</button>
      </div>

      {analysis && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800/50"><div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">{t.liqScore}</div><div className={`text-4xl font-bold ${getScoreColor(analysis.liquidityScore)} mb-2`}>{analysis.liquidityScore}<span className="text-lg">/100</span></div><div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2"><div className={`h-full ${getScoreBg(analysis.liquidityScore)} transition-all duration-1000`} style={{width:`${analysis.liquidityScore}%`}}/></div></div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800/50"><div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">{t.liqSaleCycle}</div><div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{analysis.expectedSaleMonths}<span className="text-lg">{t.months || '月'}</span></div><div className="text-xs text-slate-500 dark:text-slate-400">{analysis.expectedSaleMonths<=4? t.cycleFast || '快速成交' : analysis.expectedSaleMonths<=8? t.cycleNormal || '正常周期' : t.cycleSlow || '周期较长'}</div></div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800/50"><div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">{t.liqDiscountProb}</div><div className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-2">{analysis.discountProbability}<span className="text-lg">%</span></div><div className="text-xs text-slate-500 dark:text-slate-400">{analysis.discountProbability<=30? t.discountLow || '议价空间小' : analysis.discountProbability<=60? t.discountMed || '可能需要让价' : t.discountHigh || '大概率折价'}</div></div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800/50">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-indigo-500"/>{t.liqBuyerProfile}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.buyerProfiles.map((buyer,idx)=>(
                <div key={idx} className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">{getBuyerIcon(buyer.type)}</div><div><div className="text-sm font-bold text-slate-800 dark:text-white">{buyer.label}</div><div className="text-xs text-slate-500 dark:text-slate-400">{buyer.percentage}% {t.percentage || '占比'}</div></div></div>
                    {getTrendIcon(buyer.trend)}
                  </div>
                  <div className="space-y-2">
                    <div><div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t.characteristics || '特征'}</div><div className="flex flex-wrap gap-1">{buyer.characteristics.map((c,i)=><span key={i} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">{c}</span>)}</div></div>
                    <div><div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t.concerns || '关注点'}</div>{buyer.concerns.slice(0,3).map((c,i)=><div key={i} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400"><ChevronRight className="h-3 w-3"/>{c}</div>)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.strengths.length>0&&<div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-900/30"><h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/>{t.liqStrengths}</h3><div className="space-y-2">{analysis.strengths.map((s,i)=><div key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300"><span className="text-emerald-500">✓</span>{s}</div>)}</div></div>}
            {analysis.riskFactors.length>0&&<div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl p-6 border border-rose-200 dark:border-rose-900/30"><h3 className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>{t.liqRisks}</h3><div className="space-y-2">{analysis.riskFactors.map((r,i)=><div key={i} className="flex items-start gap-2 text-sm text-rose-700 dark:text-rose-300"><span className="text-rose-500">⚠</span>{r}</div>)}</div></div>}
          </div>

          <button onClick={handleAIInsights} disabled={isGeneratingAI} className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"><Sparkles className="h-5 w-5"/>{isGeneratingAI? (t.analyzing || 'AI分析中...') : (t.liqAIInsight || 'AI深度洞察')}</button>
          
          {aiInsights&&<div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-violet-200 dark:border-violet-900/30"><h3 className="text-sm font-bold text-violet-800 dark:text-violet-400 mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5"/>{t.marketInsight || 'AI 市场洞察'}</h3><div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: parseMarkdown(aiInsights) }}/></div>}
        </div>
      )}
    </div>
  );
};

export default LiquidityCheckPanel;
