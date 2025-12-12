import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Home, 
  ArrowRight,
  BrainCircuit,
  Info
} from 'lucide-react';
import { NegotiationParams, NegotiationResult } from '../types';
import { sendAIMessage } from '../utils/aiProvider';
import { marked } from 'marked';

interface Props {
  t: any;
  aiConfig: any;
  onOpenSettings: () => void;
}

const NegotiationHelperPanel: React.FC<Props> = ({ t, aiConfig, onOpenSettings }) => {
  const [params, setParams] = useState<NegotiationParams>({
    listingPrice: 300,
    recentTransactionPrice: 280,
    marketInventory: 50,
    listingDays: 30,
    priceCuts: 0,
    renovationScore: 5, // 1-10, 5 is average
    floorScore: 5 // 1-10
  });

  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [aiScript, setAiScript] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Logic to calculate discount and urgency
  const calculateNegotiation = () => {
    let urgencyScore = 0;
    const urgencyFactors = [];
    
    // 1. Time Factor
    if (params.listingDays > 180) { urgencyScore += 40; urgencyFactors.push("挂牌超过半年，严重滞销"); }
    else if (params.listingDays > 90) { urgencyScore += 25; urgencyFactors.push("挂牌超过3个月，热度下降"); }
    else if (params.listingDays > 30) { urgencyScore += 10; }
    else { urgencyFactors.push("新上房源，卖家心态较强"); }

    // 2. Inventory Factor
    if (params.marketInventory > 100) { urgencyScore += 20; urgencyFactors.push("小区抛盘量大，竞争激烈"); }
    else if (params.marketInventory > 50) { urgencyScore += 10; }

    // 3. Price Cuts
    if (params.priceCuts >= 3) { urgencyScore += 25; urgencyFactors.push("多次调价，急于变现"); }
    else if (params.priceCuts >= 1) { urgencyScore += 10; }

    // Cap Urgency
    urgencyScore = Math.min(100, urgencyScore);

    // Calculate Base Bargain Space
    // Base gap from recent transaction price
    const priceGapPercent = (params.listingPrice - params.recentTransactionPrice) / params.listingPrice; 
    
    // Quality Adjustment (Renovation & Floor)
    // Assume recentTransactionPrice is for "Average" (5/5). 
    // If this house is better (8/8), it deserves premium.
    const qualityPremium = ((params.renovationScore - 5) * 0.01) + ((params.floorScore - 5) * 0.005); 
    
    // Theoretical Fair Price
    const fairPrice = params.recentTransactionPrice * (1 + qualityPremium);
    
    let targetDiscount = 0;
    // If Listing > Fair, we definitely target Fair.
    if (params.listingPrice > fairPrice) {
       targetDiscount = (params.listingPrice - fairPrice) / params.listingPrice;
    }
    
    // Add "Sentiment Discount" based on urgency
    // High urgency = extra 2-5% discount possible below fair price
    const sentimentDiscount = (urgencyScore / 100) * 0.05; 
    
    const maxDiscount = targetDiscount + sentimentDiscount;
    const minDiscount = Math.max(0, targetDiscount * 0.8); // Aim for at least correcting most of the overpricing

    setResult({
      suggestedOfferLow: params.listingPrice * (1 - maxDiscount),
      suggestedOfferHigh: params.listingPrice * (1 - minDiscount),
      sellerUrgencyScore: urgencyScore,
      urgencyFactors,
      bargainSpace: maxDiscount * 100
    });
  };

  useEffect(() => {
    calculateNegotiation();
  }, [params]);

  const handleAiAdvice = async () => {
    if (!aiConfig.apiKey) {
      onOpenSettings();
      return;
    }
    setLoadingAi(true);
    const prompt = `
      我正在考虑购买一套房子，请帮我生成一段谈判话术。
      
      【房源情况】:
      - 挂牌价: ${params.listingPrice}万
      - 同小区成交均价折算: ${params.recentTransactionPrice}万
      - 挂牌天数: ${params.listingDays}天
      - 调价次数: ${params.priceCuts}次
      - 小区在售: ${params.marketInventory}套
      - 房子状况: 装修${params.renovationScore}/10分，楼层${params.floorScore}/10分
      
      【系统分析】:
      - 卖家急售指数: ${result?.sellerUrgencyScore}/100
      - 建议出价区间: ${result?.suggestedOfferLow.toFixed(0)} - ${result?.suggestedOfferHigh.toFixed(0)}万
      
      请生成：
      1. 谈判开场白（礼貌但展示懂行）。
      2. 核心压价理由（基于以上数据）。
      3. 面对卖家拒绝时的回应策略。
      
      风格要诚恳但坚定。
    `;
    try {
      const res = await sendAIMessage(aiConfig, [{ role: 'user', content: prompt }]);
      setAiScript(res);
    } catch (e) {
      console.error(e);
      alert("AI Error");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
       {/* Left: Inputs */}
       <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
             <h3 className="flex items-center gap-2 font-bold text-slate-700 dark:text-white mb-6">
                <Calculator className="h-5 w-5 text-indigo-500" /> 房源情报输入
             </h3>
             
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">挂牌价格 (万)</label>
                   <input 
                     type="number" 
                     value={params.listingPrice}
                     onChange={e => setParams({...params, listingPrice: Number(e.target.value)})}
                     className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono font-bold"
                   />
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between">
                     <label className="text-xs font-bold text-slate-500 uppercase">参考成交价 (万)</label>
                     <span className="text-[10px] text-slate-400 flex items-center gap-1"><Info className="h-3 w-3"/> 同户型近期均价</span>
                   </div>
                   <input 
                     type="number" 
                     value={params.recentTransactionPrice}
                     onChange={e => setParams({...params, recentTransactionPrice: Number(e.target.value)})}
                     className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">挂牌天数</label>
                      <div className="relative">
                        <Clock className="absolute top-3.5 left-3 h-4 w-4 text-slate-400" />
                        <input 
                          type="number" 
                          value={params.listingDays}
                          onChange={e => setParams({...params, listingDays: Number(e.target.value)})}
                          className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">调价次数</label>
                      <input 
                          type="number" 
                          value={params.priceCuts}
                          onChange={e => setParams({...params, priceCuts: Number(e.target.value)})}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">小区在售库存 (套)</label>
                   <input 
                     type="number" 
                     value={params.marketInventory}
                     onChange={e => setParams({...params, marketInventory: Number(e.target.value)})}
                     className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">装修评分 (1-10)</label>
                      <input 
                        type="range" min="1" max="10"
                        value={params.renovationScore}
                        onChange={e => setParams({...params, renovationScore: Number(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center text-xs font-bold text-indigo-500">{params.renovationScore}分</div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">楼层评分 (1-10)</label>
                      <input 
                        type="range" min="1" max="10"
                        value={params.floorScore}
                        onChange={e => setParams({...params, floorScore: Number(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center text-xs font-bold text-indigo-500">{params.floorScore}分</div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Right: Results */}
       <div className="flex-1 space-y-6">
          {result && (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div>
                     <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><TrendingDown className="h-6 w-6"/> 建议砍价目标</h2>
                     <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-black tracking-tighter">
                          {result.suggestedOfferLow.toFixed(0)} <span className="text-2xl font-normal opacity-80">~</span> {result.suggestedOfferHigh.toFixed(0)}
                          <span className="text-lg font-normal ml-1 opacity-80">万</span>
                        </span>
                     </div>
                     <div className="mt-2 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/20">
                        <span>当前挂牌: {params.listingPrice}万</span>
                        <ArrowRight className="h-3 w-3"/>
                        <span className="font-bold">砍价: -{(params.listingPrice - result.suggestedOfferHigh).toFixed(1)}万 ({(result.bargainSpace).toFixed(1)}%)</span>
                     </div>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 w-full md:w-auto min-w-[200px]">
                     <div className="text-xs font-bold opacity-70 uppercase mb-2">卖家急售指数</div>
                     <div className="flex items-end gap-2 mb-2">
                        <span className={`text-3xl font-black ${result.sellerUrgencyScore > 70 ? 'text-rose-300' : 'text-emerald-300'}`}>{result.sellerUrgencyScore}</span>
                        <span className="text-sm opacity-60 mb-1">/ 100</span>
                     </div>
                     <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${result.sellerUrgencyScore > 70 ? 'bg-rose-400' : result.sellerUrgencyScore > 40 ? 'bg-yellow-400' : 'bg-emerald-400'}`} 
                          style={{width: `${result.sellerUrgencyScore}%`}}
                        />
                     </div>
                  </div>
               </div>

               {result.urgencyFactors.length > 0 && (
                 <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex gap-2 flex-wrap">
                       {result.urgencyFactors.map((f, i) => (
                         <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/30 border border-rose-300/30 rounded-lg text-xs font-bold">
                            <AlertTriangle className="h-3 w-3" /> {f}
                         </span>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* AI Advisor */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-bold text-slate-700 dark:text-white">
                   <BrainCircuit className="h-5 w-5 text-indigo-500" /> AI 谈判军师
                </h3>
                <button 
                  onClick={handleAiAdvice}
                  disabled={loadingAi}
                  className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {loadingAi ? '生成锦囊...' : '生成谈判话术'}
                </button>
             </div>
             
             {aiScript ? (
               <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 h-[300px] overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                     <div dangerouslySetInnerHTML={{ __html: marked.parse(aiScript) }} />
                  </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[300px]">
                  <BrainCircuit className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm">点击上方按钮，AI 将根据当前的房源数据，为你定制专属的砍价剧本。</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default NegotiationHelperPanel;
