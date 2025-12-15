import React, { useState } from 'react';
import HouseRoastPanel from './HouseRoastPanel';
import { InvestmentParams, CalculationResult } from '../types';
import { generateAlternativePaths, calculateIrreversibility, generateAIPerspective } from '../utils/decisionSupport';
import { 
  calculatePeerDistribution,
  calculateMinorityStatus,
  calculateFutureBuyerOverlap,
  calculateFamilyImpact
} from '../utils/socialPerspective';
import { CheckCircle2, AlertTriangle, RefreshCw, ShieldAlert, BadgeCheck, Bot, ThumbsUp, ThumbsDown, Users, TrendingUp, UserCheck, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DecisionDashboardProps {
  params: InvestmentParams;
  result: CalculationResult;
  t: any;
}

const DecisionDashboard: React.FC<DecisionDashboardProps> = ({ params, result, t }) => {
  const [activeTab, setActiveTab] = useState<'alternatives' | 'irreversible'>('alternatives');
  const [socialTab, setSocialTab] = useState<'peer' | 'minority' | 'future' | 'family'>('peer'); 

  const alternatives = generateAlternativePaths(params);
  const factors = calculateIrreversibility(params);
  const aiPerspective = generateAIPerspective(params);

  // Social perspective calculations
  const peerDistribution = calculatePeerDistribution(params.totalPrice || 300, params.familyMonthlyIncome || 30000, 30);
  const minorityStatus = calculateMinorityStatus(params.downPaymentRatio || 30, params.totalPrice || 300, params.familyMonthlyIncome || 30000);
  const futureBuyerOverlap = calculateFutureBuyerOverlap(params.totalPrice || 300, params.downPaymentRatio || 30, params.familyMonthlyIncome || 30000);
  const familyImpact = calculateFamilyImpact(params.totalPrice || 300, params.familyMonthlyIncome || 30000, params.loanTerm || 30);
  
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Column: House Roast + Social Perspective */}
      <div className="space-y-6">
         <HouseRoastPanel params={params} result={result} t={t} />
         
         {/* Social Perspective - Compact */}
         <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-3xl p-6 shadow-xl border border-purple-200 dark:border-purple-800">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-purple-500 rounded-xl">
               <Users className="h-5 w-5 text-white" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white">对照与社会视角</h3>
               <p className="text-xs text-slate-500">你在人群中的位置</p>
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
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">同类人群选择</h4>
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
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">少数派提示</h4>
                 <div className="text-center">
                   <div className={`inline-block px-4 py-2 rounded-xl font-bold text-sm mb-3 ${
                     minorityStatus.trend === 'mainstream' ? 'bg-blue-100 text-blue-700' :
                     minorityStatus.trend === 'contrarian' ? 'bg-orange-100 text-orange-700' :
                     'bg-green-100 text-green-700'
                   }`}>
                     {minorityStatus.trend === 'mainstream' ? '🚶 随大流' :
                      minorityStatus.trend === 'contrarian' ? '🏃 逆行者' :
                      '⚖️ 平衡派'}
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
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">未来买家重叠度</h4>
                 <div className="text-center mb-3">
                   <div className="text-4xl font-black text-purple-600 dark:text-purple-400">{futureBuyerOverlap.totalOverlap}%</div>
                   <div className="text-xs text-slate-500">
                     {futureBuyerOverlap.totalOverlap > 70 ? '易转手' : futureBuyerOverlap.totalOverlap > 40 ? '中等' : '难转手'}
                   </div>
                 </div>
                 <ResponsiveContainer width="100%" height={180}>
                   <RadarChart data={futureBuyerOverlap.profiles}>
                     <PolarGrid />
                     <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                     <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                     <Radar name="你" dataKey="yourScore" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                     <Radar name="未来" dataKey="futureAvgScore" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                     <Tooltip />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
             )}
             
             {socialTab === 'family' && (
               <div>
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">家庭成员影响</h4>
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
              {aiPerspective.confidence}% 确信度
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
                🤖 "如果我是你" AI 立场
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
            替代人生方案
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
            不可逆程度检测
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2">
          {activeTab === 'alternatives' ? (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">如果不买这套房...</h3>
                <p className="text-xs text-slate-500">别陷入"非买不可"的误区，看看这些可能性</p>
              </div>
              {alternatives.map((path) => (
                <div key={path.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">A</span>
                      {path.title}
                    </h4>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      匹配度 {path.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{path.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                      <div className="font-bold text-emerald-600 mb-1">✅ 优势</div>
                      {path.pros.slice(0, 2).map((p, i) => <div key={i} className="text-slate-600 dark:text-slate-400">• {p}</div>)}
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                      <div className="font-bold text-slate-500 mb-1">❌ 劣势</div>
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
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white">决策后悔药检测</h3>
                 <p className="text-xs text-slate-500">优先关注那些"一旦错了就回不了头"的地方</p>
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
                        {factor.level === 'irreversible' ? '不可逆' : factor.level === 'semi-irreversible' ? '半不可逆' : '可逆'}
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
  );
};

export default DecisionDashboard;
