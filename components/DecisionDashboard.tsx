
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
import { CheckCircle2, AlertTriangle, RefreshCw, ShieldAlert, BadgeCheck, Bot, ThumbsUp, ThumbsDown, Users, TrendingUp, UserCheck, Heart, Share2, Download, X, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DecisionDashboardProps {
  params: InvestmentParams;
  result: CalculationResult;
  t: any;
  language: Language;
}

const DecisionDashboard: React.FC<DecisionDashboardProps> = ({ params, result, t, language }) => {
  const [activeTab, setActiveTab] = useState<'alternatives' | 'irreversible'>('alternatives');
  const [socialTab, setSocialTab] = useState<'peer' | 'minority' | 'future' | 'family'>('peer'); 
  
  // Derive language from translation object detection (since prop isn't passed yet)
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

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Column: House Roast + Social Perspective - Seamlessly Connected */}
      <div className="flex flex-col">
         {/* House Roast Panel - Top part */}
         <HouseRoastPanel params={params} result={result} t={t} language={language} />
         
         {/* Unified Social & Future Self Panel - Bottom part (seamlessly connected) */}
         <div className="bg-white dark:bg-[#0a0a0f] rounded-b-3xl p-5 shadow-xl border border-t-0 border-slate-200 dark:border-slate-800 flex-1">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                 <Users className="h-5 w-5 text-white" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.socialTitle || '社会视角'}</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400">{t.socialAiCheck || 'AI 决策分析'}</p>
               </div>
             </div>
           </div>
           
           {/* Enhanced Tabs with Future Self */}
           <div className="flex gap-1 mb-4 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl overflow-x-auto border border-slate-100 dark:border-transparent">
             {[
               { id: 'peer', icon: Users, label: t.socialTabPeer || '同龄人' },
               { id: 'minority', icon: TrendingUp, label: t.socialTabMinority || '逆势分析' },
               { id: 'future', icon: UserCheck, label: t.socialTabFuture || '接盘侠' },
               { id: 'family', icon: Heart, label: t.socialTabFamily || '家庭影响' },
               { id: 'futureSelf', icon: Clock, label: t.socialTabFutureSelf || '跨时空对话' }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setSocialTab(tab.id as any)}
                 className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-medium text-xs transition-all whitespace-nowrap ${
                   socialTab === tab.id
                     ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                     : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                 }`}
               >
                 <tab.icon className="h-3.5 w-3.5" />
                 <span className="hidden sm:inline">{tab.label}</span>
               </button>
             ))}
           </div>
           
           {/* Content Area */}
           <div className="bg-white dark:bg-slate-800/30 rounded-2xl p-5 min-h-[300px] border border-slate-100 dark:border-transparent">
             {socialTab === 'peer' && (
               <div>
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">{t.socialPeer || '同龄人选择'}</h4>
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
                        <span className="text-slate-600 dark:text-slate-300">{choice.choice}</span>
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
                    minorityStatus.trend === 'mainstream' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                    minorityStatus.trend === 'contrarian' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' :
                    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
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
                  <div className="text-xs text-slate-600 dark:text-slate-400">
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
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{impact.icon}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{impact.member}</span>
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
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">{impact.primaryConcern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Future Self Tab Content - Embedded */}
            {socialTab === 'futureSelf' && (
              <FutureSelfPanel params={params} monthlyPayment={result.monthlyPayment} t={t} language={language} embedded={true} />
            )}
          </div>
         </div>
      
      </div>


      {/* Right Column: Decision Tools */}
      <div className="bg-white dark:bg-[#0a0a0f] rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('alternatives')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'alternatives'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            {t.decisionDashboard.alternativePaths}
          </button>
          <button
            onClick={() => setActiveTab('irreversible')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'irreversible'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
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


    </div>
    </div>
  );
};

export default DecisionDashboard;
