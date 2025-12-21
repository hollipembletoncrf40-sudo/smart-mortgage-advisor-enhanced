
import React, { useState } from 'react';
import HouseRoastPanel from './HouseRoastPanel';
import { InvestmentParams, CalculationResult, Language } from '../types';
import { generateAlternativePaths, calculateIrreversibility, generateAIPerspective } from '../utils/decisionSupport';
import { FutureSelfPanel } from './FutureSelfPanel';
import { 
  calculatePeerDistribution,
  calculateMinorityStatus,
  calculateFutureBuyerOverlap,
  calculateFamilyImpact
} from '../utils/socialPerspective';
import { CheckCircle2, AlertTriangle, RefreshCw, ShieldAlert, BadgeCheck, Bot, ThumbsUp, ThumbsDown, Users, TrendingUp, UserCheck, Heart, Share2, Download, X } from 'lucide-react';
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BattleReportCard from './BattleReportCard';
import html2canvas from 'html2canvas';

interface DecisionDashboardProps {
  params: InvestmentParams;
  result: CalculationResult;
  t: any;
  language: Language;
}

const DecisionDashboard: React.FC<DecisionDashboardProps> = ({ params, result, t, language }) => {
  const [activeTab, setActiveTab] = useState<'alternatives' | 'irreversible'>('alternatives');
  const [socialTab, setSocialTab] = useState<'peer' | 'minority' | 'future' | 'family'>('peer'); 
  const [showReport, setShowReport] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      // Wait a bit for any animations to settle
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0f172a',
        logging: false,
        width: 375,
        height: 667,
        imageTimeout: 0,
        removeContainer: true
      });
      
      // Use dataURL for better compatibility
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `DeepEstate_战报_${new Date().getTime()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsGenerating(false);
    } catch (err) {
      console.error('Failed to generate report', err);
      alert('图片生成失败，请重试');
      setIsGenerating(false);
    }
  }; 

  // Derive language from translation object detection (since prop isn't passed yet)
  

  const alternatives = generateAlternativePaths(params, language);
  const factors = calculateIrreversibility(params, language);
  const aiPerspective = generateAIPerspective(params, language);

  // Social perspective calculations
  // Social perspective calculations
  const peerDistribution = calculatePeerDistribution(params.totalPrice || 300, params.familyMonthlyIncome || 30000, 30, t);
  const minorityStatus = calculateMinorityStatus(params.downPaymentRatio || 30, params.totalPrice || 300, params.familyMonthlyIncome || 30000, t);
  const futureBuyerOverlap = calculateFutureBuyerOverlap(params.totalPrice || 300, params.downPaymentRatio || 30, params.familyMonthlyIncome || 30000, t);
  const familyImpact = calculateFamilyImpact(params.totalPrice || 300, params.familyMonthlyIncome || 30000, params.loanTerm || 30, t);
  
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-indigo-600" />
          {t.decisionDashboard?.title || 'AI Decision Center'}
        </h2>
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <Share2 className="h-4 w-4" />
          {t.battleReport?.shareBtn}
        </button>
      </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Column: House Roast + Social Perspective */}
      <div className="space-y-6">
         <HouseRoastPanel params={params} result={result} t={t} language={language} />
         
         {/* Social Perspective - Compact */}
         <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-3xl p-6 shadow-xl border border-purple-200 dark:border-purple-800">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-purple-500 rounded-xl">
               <Users className="h-5 w-5 text-white" />
             </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.socialTitle || 'Social Perspective'}</h3>
                <p className="text-xs text-slate-500">{t.socialAiCheck || 'AI Perspective'}</p>
              </div>
           </div>
           
           {/* Compact Tabs */}
           <div className="flex gap-1 mb-4 bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl">
             {[
               { id: 'peer', icon: Users },
               { id: 'minority', icon: TrendingUp },
               { id: 'future', icon: UserCheck },
               { id: 'family', icon: Heart }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setSocialTab(tab.id as any)}
                 className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-medium text-xs transition-all ${
                   socialTab === tab.id
                     ? 'bg-purple-500 text-white shadow'
                     : 'text-slate-600 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-slate-700'
                 }`}
               >
                 <tab.icon className="h-3 w-3" />
               </button>
             ))}
           </div>
           
           {/* Content */}
           <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
              {socialTab === 'peer' && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">{t.socialPeer || 'Peer Choice'}</h4>
                 <ResponsiveContainer width="100%" height={200}>
                   <PieChart>
                     <Pie
                       data={peerDistribution as any[]}
                       cx="50%"
                       cy="50%"
                       innerRadius={40}
                       outerRadius={70}
                       fill="#8884d8"
                       dataKey="percentage"
                       label={({ percentage }) => `${percentage}%`}
                     >
                       {peerDistribution.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="space-y-1 mt-2">
                   {peerDistribution.map((choice, i) => (
                     <div key={i} className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                         <span className="text-slate-600 dark:text-slate-400">{choice.choice}</span>
                       </div>
                       <span className="font-bold text-slate-800 dark:text-white">{choice.percentage}%</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             
             {socialTab === 'minority' && (
               <div>
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">{t.decisionDashboard.minorityReport}</h4>
                 <div className="text-center">
                   <div className={`inline-block px-4 py-2 rounded-xl font-bold text-sm mb-3 ${
                     minorityStatus.trend === 'mainstream' ? 'bg-blue-100 text-blue-700' :
                     minorityStatus.trend === 'contrarian' ? 'bg-orange-100 text-orange-700' :
                     'bg-green-100 text-green-700'
                   }`}>
                     {minorityStatus.trend === 'mainstream' ? t.decisionDashboard.mainstream :
                      minorityStatus.trend === 'contrarian' ? t.decisionDashboard.contrarian :
                      t.decisionDashboard.balanced}
                   </div>
                   <div className="text-3xl font-black text-slate-800 dark:text-white mb-2">{minorityStatus.percentile}%</div>
                   <div className="relative h-3 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 rounded-full mb-3">
                     <div 
                       className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-800 rounded-full shadow"
                       style={{ left: `${minorityStatus.percentile}%`, transform: 'translate(-50%, -50%)' }}
                     ></div>
                   </div>
                   <p className="text-xs text-slate-600 dark:text-slate-300">{minorityStatus.message}</p>
                 </div>
               </div>
             )}
             
             {socialTab === 'future' && (
               <div>
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">{t.decisionDashboard.futureBuyerOverlap}</h4>
                 <div className="text-center mb-3">
                   <div className="text-4xl font-black text-purple-600 dark:text-purple-400">{futureBuyerOverlap.totalOverlap}%</div>
                   <div className="text-xs text-slate-500">
                     {futureBuyerOverlap.totalOverlap > 70 ? t.decisionDashboard.easyToSell : futureBuyerOverlap.totalOverlap > 40 ? t.decisionDashboard.mediumToSell : t.decisionDashboard.hardToSell}
                   </div>
                 </div>
                 <ResponsiveContainer width="100%" height={180}>
                   <RadarChart data={futureBuyerOverlap.profiles}>
                     <PolarGrid />
                     <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                     <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                     <Radar name={t.decisionDashboard.radarYou} dataKey="yourScore" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                     <Radar name={t.decisionDashboard.radarFuture} dataKey="futureAvgScore" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                     <Tooltip />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
             )}
             
             {socialTab === 'family' && (
               <div>
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">{t.decisionDashboard.familyImpact}</h4>
                 <div className="space-y-2">
                   {familyImpact.map((impact, i) => (
                     <div key={i} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                       <div className="flex items-center justify-between mb-1">
                         <div className="flex items-center gap-2">
                           <span className="text-lg">{impact.icon}</span>
                           <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{impact.member}</span>
                         </div>
                         <span className={`text-sm font-black ${
                           impact.impactScore > 70 ? 'text-red-500' :
                           impact.impactScore > 40 ? 'text-orange-500' :
                           'text-green-500'
                         }`}>
                           {Math.round(impact.impactScore)}
                         </span>
                       </div>
                       <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div 
                           className={`h-full ${
                             impact.impactScore > 70 ? 'bg-red-500' :
                             impact.impactScore > 40 ? 'bg-orange-500' :
                             'bg-green-500'
                           }`}
                           style={{ width: `${impact.impactScore}%` }}
                         ></div>
                       </div>
                       <p className="text-[10px] text-slate-500 mt-1">{impact.primaryConcern}</p>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>

      
      {/* Future Self Panel (Moved to Left Bottom) */}
      <FutureSelfPanel params={params} monthlyPayment={result.monthlyPayment} t={t} language={language} />
      
      </div>



      {/* Right Column: Decision Tools */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
        {/* AI Perspective Card */}
        <div className={`mb-6 p-5 rounded-2xl border-2 ${
          aiPerspective.grade === 'ready' 
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-400 dark:border-emerald-600' 
            : aiPerspective.grade === 'caution'
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-400 dark:border-amber-600'
            : aiPerspective.grade === 'stop'
            ? 'bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-rose-400 dark:border-rose-600'
            : 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-400 dark:border-slate-600'
        }`}>
          {/* Decision Grade Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl font-bold text-sm ${
              aiPerspective.grade === 'ready' ? 'bg-emerald-500 text-white' :
              aiPerspective.grade === 'caution' ? 'bg-amber-500 text-white' :
              aiPerspective.grade === 'stop' ? 'bg-rose-500 text-white' :
              'bg-slate-500 text-white'
            }`}>
              <span className="text-2xl">{aiPerspective.gradeIcon}</span>
              <span>{aiPerspective.gradeLabel}</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              aiPerspective.confidence > 70 ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {aiPerspective.confidence}% {t.decisionDashboard.confidence}
            </span>
          </div>

          {/* Grade Reason */}
          <div className="mb-4 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {aiPerspective.gradeReason}
            </p>
          </div>

          {/* AI Perspective */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t.ifIWereYou}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {aiPerspective.oneSentence}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-3">
            {aiPerspective.keyFactors.map((factor, i) => (
              <span key={i} className="text-[10px] px-2 py-1 bg-white/60 dark:bg-slate-800/60 rounded-lg text-slate-600 dark:text-slate-400 font-medium">
                {factor}
              </span>
            ))}
            </div>
          </div>






        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('alternatives')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'alternatives'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            {t.decisionDashboard.alternativePaths}
          </button>
          <button
            onClick={() => setActiveTab('irreversible')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'irreversible'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            {t.decisionDashboard.irreversibilityCheck}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2">
          {activeTab === 'alternatives' ? (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.decisionDashboard.ifNotBuying}</h3>
                <p className="text-xs text-slate-500">{t.decisionDashboard.ifNotBuyingDesc}</p>
              </div>
              {alternatives.map((path) => (
                <div key={path.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">A</span>
                      {path.title}
                    </h4>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      {t.decisionDashboard.matchScore} {path.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{path.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                      <div className="font-bold text-emerald-600 mb-1">{t.decisionDashboard.pros}</div>
                      {path.pros.slice(0, 2).map((p, i) => <div key={i} className="text-slate-600 dark:text-slate-400">• {p}</div>)}
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                      <div className="font-bold text-slate-500 mb-1">{t.decisionDashboard.cons}</div>
                      {path.cons.slice(0, 2).map((p, i) => <div key={i} className="text-slate-600 dark:text-slate-400">• {p}</div>)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                    <BadgeCheck className="h-4 w-4" />
                    {path.financialOutcome}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.decisionDashboard.regretDetector}</h3>
                 <p className="text-xs text-slate-500">{t.decisionDashboard.regretDetectorDesc}</p>
              </div>
              {factors.map((factor, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/80">
                  <div className="flex-shrink-0 mt-1">
                     {factor.level === 'irreversible' && <AlertTriangle className="h-6 w-6 text-rose-500" />}
                     {factor.level === 'semi-irreversible' && <AlertTriangle className="h-6 w-6 text-amber-500" />}
                     {factor.level === 'reversible' && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{factor.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                        ${factor.level === 'irreversible' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 
                          factor.level === 'semi-irreversible' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {factor.level === 'irreversible' ? t.decisionDashboard.irreversible : factor.level === 'semi-irreversible' ? t.decisionDashboard.semiIrreversible : t.decisionDashboard.reversible}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{factor.impact}</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                      💡 {factor.advice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Battle Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowReport(false)}>
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
             {/* Close Button */}
             <button 
               onClick={() => setShowReport(false)}
               className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-md"
             >
               <X className="h-5 w-5" />
             </button>

             {/* Preview Area */}
             <div className="flex justify-center bg-slate-950 p-0">
               <BattleReportCard 
                 ref={reportRef}
                 params={params} 
                 result={result} 
                 roast={(() => {
                   // Get a better roast from House Roast if available
                   const dti = result.monthlyPayment / (params.familyMonthlyIncome || 30000);
                   if (dti > 0.5) return t.decisionDashboard?.highDtiRoast || "月供压力山大，建议三思！";
                   if (params.totalPrice && params.totalPrice > 1000) return t.decisionDashboard?.highPriceRoast || "大手笔！确保现金流充足。";
                   if (result.rentalYield && result.rentalYield < 1.5) return t.decisionDashboard?.lowYieldRoast || "租售比偏低，投资需谨慎。";
                   return t.decisionDashboard?.commonRoast || "稳健之选，继续加油！";
                 })()}
                 t={t}
                 riskScore={(() => {
                   const dti = (result.monthlyPayment / (params.familyMonthlyIncome || 30000)) * 100;
                   const leverage = ((params.totalPrice || 300) * (1 - (params.downPaymentRatio || 30) / 100)) / (params.totalPrice || 300) * 100;
                   return Math.round(Math.min(100, (dti * 0.6 + leverage * 0.4)));
                 })()}
                 beatPercent={(() => {
                   // Calculate based on multiple factors
                   const roi = result.rentalYield || 0;
                   const dti = result.monthlyPayment / (params.familyMonthlyIncome || 30000);
                   let score = 50; // Base score
                   if (roi > 2.5) score += 30;
                   else if (roi > 1.5) score += 15;
                   if (dti < 0.3) score += 20;
                   else if (dti < 0.5) score += 10;
                   else score -= 10;
                   return Math.min(99, Math.max(10, Math.round(score)));
                 })()}
               />
             </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default DecisionDashboard;
