
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, BarChart, Bar, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine
} from 'recharts';
import { 
  Calculator, TrendingUp, BrainCircuit, Moon, Sun, AlertTriangle, 
  Wallet, ShieldAlert, BadgeCheck, Coffee, Send, User, Bot, BarChart3,
  List, X, History, BadgePercent, Settings, Key, Info, BookOpen, ArrowRightLeft,
  Landmark, Loader, Download, FileText, Image as ImageIcon, FileType2, Share2, ChevronDown, CheckCircle2, XCircle, PieChart as PieChartIcon, Coins, Building2, MapPin, Globe2, Lightbulb, ClipboardCheck, ArrowDown, Home, PiggyBank, DollarSign, Droplets, Target
} from 'lucide-react';
import HousingTrendsPanel from './components/HousingTrendsPanel';
import AffordabilityPanel from './components/AffordabilityPanel';
import LifePathSimulator from './components/LifePathSimulator';
import FloatingAIAdvisor from './components/FloatingAIAdvisor';
import GameModePanel from './components/GameModePanel';
import HouseRoastPanel from './components/HouseRoastPanel';
import { InvestmentParams, RepaymentMethod, CalculationResult, PrepaymentStrategy, StressTestResult, LoanType, PurchaseScenario, LocationFactors, LocationScore, AssetComparisonItem, KnowledgeCardData, Language, Currency, TaxParams, TaxResult, AppreciationPredictorParams, AppreciationPrediction, MonthlyCashFlow, CustomStressTestParams } from './types';
import { TRANSLATIONS } from './utils/translations';
import { calculateInvestment, calculateStressTest, aggregateYearlyPaymentData, calculateLocationScore, calculateTaxes, predictAppreciation, calculateComprehensiveRisk, calculateAffordability } from './utils/calculate';

// --- Components ---

// Error Boundary Component
// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-rose-500 mb-2">出错了</h3>
          <p className="text-sm text-slate-500 mb-4">无法显示详细数据，请尝试刷新页面。</p>
          <pre className="text-xs text-left bg-slate-100 p-2 rounded overflow-auto max-h-32 text-slate-600">{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// New: BuyingProcessModal
const BuyingProcessModal = ({ onClose, t }: { onClose: () => void, t: any }) => {
  const steps = [
    { 
      title: t.buyingStep1Title, 
      desc: t.buyingStep1Desc,
      detail: t.buyingStep1Detail,
      icon: Wallet,
      color: 'bg-indigo-500'
    },
    { 
      title: t.buyingStep2Title, 
      desc: t.buyingStep2Desc,
      detail: t.buyingStep2Detail,
      icon: MapPin,
      color: 'bg-emerald-500'
    },
    { 
      title: t.buyingStep3Title, 
      desc: t.buyingStep3Desc,
      detail: t.buyingStep3Detail,
      icon: FileText,
      color: 'bg-amber-500'
    },
    { 
      title: t.buyingStep4Title, 
      desc: t.buyingStep4Desc,
      detail: t.buyingStep4Detail,
      icon: Landmark,
      color: 'bg-violet-500'
    },
    { 
      title: t.buyingStep5Title, 
      desc: t.buyingStep5Desc,
      detail: t.buyingStep5Detail,
      icon: ClipboardCheck,
      color: 'bg-rose-500'
    },
    { 
      title: t.buyingStep6Title, 
      desc: t.buyingStep6Desc,
      detail: t.buyingStep6Detail,
      icon: Key,
      color: 'bg-slate-500'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
            <List className="h-5 w-5 text-indigo-500"/> {t.buyingProcessTitle}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="relative pl-4">
             {/* Vertical Line */}
             <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
             
             {steps.map((step, idx) => {
               const Icon = step.icon;
               return (
                 <div key={idx} className="relative pl-10 pb-8 last:pb-0 group">
                    {/* Dot Icon */}
                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full ${step.color} text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900 z-10`}>
                       <Icon className="h-5 w-5" />
                    </div>
                    {/* Content */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                       <h4 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center justify-between">
                         {step.title}
                       </h4>
                       <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{step.desc}</p>
                       <div className="text-xs text-slate-400 flex items-start gap-1">
                          <Info className="h-3 w-3 mt-0.5 shrink-0" /> {step.detail}
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};

// New: AssetComparisonTable
const AssetComparisonTable = ({ data, t }: { data: AssetComparisonItem[], t: any }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mb-6">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">{t.thDimension}</th>
            <th className="px-4 py-3 text-indigo-600 dark:text-indigo-400">{t.labelHouseInvest}</th>
            <th className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{t.labelStockInvest}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{item.dimension}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${item.houseScore >= 4 ? 'bg-emerald-500' : item.houseScore >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                   <span className="text-slate-600 dark:text-slate-400">{item.houseValue}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${item.stockScore >= 4 ? 'bg-emerald-500' : item.stockScore >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                   <span className="text-slate-600 dark:text-slate-400">{item.stockValue}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// New: KnowledgeCarousel
const KnowledgeCarousel = ({ cards, t }: { cards: KnowledgeCardData[], t: any }) => {
  const getIcon = (iconName?: string) => {
      switch(iconName) {
          case 'ArrowRightLeft': return ArrowRightLeft;
          case 'TrendingUp': return TrendingUp;
          case 'AlertTriangle': return AlertTriangle;
          case 'Building2': return Building2;
          case 'BarChart3': return BarChart3;
          default: return Lightbulb;
      }
  };

  return (
    <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
            <BookOpen className="h-3 w-3"/> {t.financeClass}
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
        {cards.map((card, i) => {
            const IconComp = getIcon(card.icon);
            return (
            <div key={i} className="min-w-[220px] max-w-[220px] p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm snap-start hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                    <IconComp className="h-4 w-4" />
                    <h4 className="font-bold text-sm">{card.title}</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {card.content}
                </p>
            </div>
            );
        })}
        </div>
    </div>
  );
};


const LocationGuideModal = ({ onClose, onApply, t }: { onClose: () => void, onApply: (score: LocationScore) => void, t: any }) => {
    const [factors, setFactors] = useState<LocationFactors>({
        transport: 5,
        education: 5,
        commercial: 5,
        environment: 5,
        potential: 5
    });

    const score = calculateLocationScore(factors, t);

    const Slider = ({ label, val, setVal, icon: Icon }: any) => (
        <div className="mb-4">
            <div className="flex justify-between mb-2">
                <label className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Icon className="h-4 w-4 text-indigo-500"/> {label}
                </label>
                <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{val}/10</span>
            </div>
            <input 
                type="range" 
                min="0" max="10" step="1"
                value={val}
                onChange={(e) => setVal(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/20">
                    <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-indigo-500"/> {t.locationGuideTitle}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <p className="text-sm text-slate-500 mb-6 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
                        <List className="inline h-4 w-4 mr-1"/>
                        {t.locationIntro}
                    </p>

                    <Slider label={t.locTransport} val={factors.transport} setVal={(v: number) => setFactors({...factors, transport: v})} icon={TrendingUp} />
                    <Slider label={t.locEducation} val={factors.education} setVal={(v: number) => setFactors({...factors, education: v})} icon={BookOpen} />
                    <Slider label={t.locCommercial} val={factors.commercial} setVal={(v: number) => setFactors({...factors, commercial: v})} icon={Building2} />
                    <Slider label={t.locEnvironment} val={factors.environment} setVal={(v: number) => setFactors({...factors, environment: v})} icon={Sun} />
                    <Slider label={t.locPotential} val={factors.potential} setVal={(v: number) => setFactors({...factors, potential: v})} icon={Globe2} />
                    
                    <div className="mt-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">{t.locTotalScore}</div>
                        <div className={`text-4xl font-black mb-2 ${score.total >= 80 ? 'text-emerald-500' : score.total >= 60 ? 'text-indigo-500' : 'text-amber-500'}`}>
                            {score.total} <span className="text-lg font-medium text-slate-400">/ 100</span>
                        </div>
                        <div className="inline-block px-3 py-1 bg-white dark:bg-slate-900 rounded-full text-sm font-bold shadow-sm mb-2">
                            {t.locRating}: {score.level}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{score.advice}</p>
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={() => onApply(score)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
                    >
                        {t.applyScore}
                    </button>
                </div>
            </div>
        </div>
    );
};

const TourGuide = ({ onComplete, t }: { onComplete: () => void, t: any }) => {
  // ... (TourGuide impl same as before)
  const [step, setStep] = useState(0);
  const steps = [
    { targetId: 'header-title', title: t.tourWelcomeTitle, content: t.tourWelcomeContent, position: 'bottom' },
    { targetId: 'input-panel', title: t.tourStep1Title, content: t.tourStep1Content, position: 'right' },
    { targetId: 'result-panel', title: t.tourStep2Title, content: t.tourStep2Content, position: 'left' },
    { targetId: 'comparison-panel', title: t.tourStep3Title, content: t.tourStep3Content, position: 'top' },
    { targetId: 'ai-panel', title: t.tourStep4Title, content: t.tourStep4Content, position: 'left' }
  ];
  const currentStep = steps[step];
  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1); else onComplete(); };
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    const el = document.getElementById(currentStep.targetId);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTargetRect(el.getBoundingClientRect()); }
  }, [step]);
  if (!targetRect) return null;
  const isMobile = window.innerWidth < 768;
  const style: React.CSSProperties = isMobile ? { bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%' } : { top: currentStep.position === 'bottom' ? targetRect.bottom + 20 : currentStep.position === 'top' ? targetRect.top - 200 : targetRect.top, left: currentStep.position === 'right' ? targetRect.right + 20 : currentStep.position === 'left' ? targetRect.left - 340 : targetRect.left, transform: currentStep.position === 'top' ? 'translateY(-10px)' : 'none' };
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
       <div className="absolute inset-0 bg-black/60 transition-opacity" />
       <div className="absolute border-4 border-indigo-500 rounded-xl transition-all duration-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] box-content pointer-events-none" style={{ top: targetRect.top - 5, left: targetRect.left - 5, width: targetRect.width + 10, height: targetRect.height + 10 }} />
       <div className="absolute bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl max-w-xs w-full animate-fade-in transition-all duration-300 z-50 border border-slate-200 dark:border-slate-700" style={isMobile ? { bottom: '40px', left: '50%', transform: 'translateX(-50%)' } : style}>
          <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{t.tourGuide} {step + 1}/{steps.length}</span><button onClick={onComplete} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{currentStep.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{currentStep.content}</p>
          <div className="flex justify-end gap-2"><button onClick={onComplete} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium">{t.tourSkip}</button><button onClick={handleNext} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all">{step === steps.length - 1 ? t.tourStart : t.tourNext}</button></div>
       </div>
    </div>
  );
};

const FeedbackModal = ({ onClose, t }: { onClose: () => void, t: any }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => { console.log("User Feedback:", { rating, comment }); setSubmitted(true); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
        {!submitted ? (
          <>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.feedbackTitle}</h3>
            <div className="flex gap-2 justify-center mb-6">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110"><Coins className={`h-8 w-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} /></button>))}</div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t.feedbackPlaceholder} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white mb-4 h-32 resize-none" />
            <button onClick={handleSubmit} disabled={rating === 0} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">{t.submitFeedback}</button>
          </>
        ) : (
          <div className="text-center py-8 animate-fade-in"><div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500"><CheckCircle2 className="h-8 w-8" /></div><h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t.feedbackSuccessTitle}</h3><p className="text-slate-500 dark:text-slate-400 text-sm mb-2">{t.feedbackSuccessDesc}</p><p className="text-slate-400 dark:text-slate-500 text-xs">{t.feedbackContact}</p></div>
        )}
      </div>
    </div>
  );
};

const WealthGrowthChart = ({ data, removeInflation, t }: { data: any[], removeInflation: boolean, t: any }) => {
  const darkMode = document.documentElement.classList.contains('dark');
  return (
    <div className="h-80 w-full min-w-0">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
              <linearGradient id="colorRealProperty" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient>
              <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
              <linearGradient id="colorRealStock" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff7300" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff7300" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v)=>t.axisYear.replace('{v}', v)} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: darkMode ? '#fff' : '#1e293b' }} formatter={(value: number) => [`${value.toFixed(2)} ${t.unitWanSimple}`, '']} />
            <Legend iconType="circle" />
            <Area type="monotone" dataKey="propertyValue" name={t.propertyValue} stroke="#6366f1" fillOpacity={1} fill="url(#colorProperty)" strokeWidth={2} />
            {removeInflation && <Area type="monotone" dataKey="realPropertyValue" name={t.realPropertyValue} stroke="#82ca9d" fillOpacity={1} fill="url(#colorRealProperty)" strokeWidth={2} />}
            <Area type="monotone" dataKey="stockNetWorth" name={t.stockNetWorth} stroke="#fbbf24" fillOpacity={1} fill="url(#colorStock)" strokeWidth={2} strokeDasharray="5 5"/>
            {removeInflation && <Area type="monotone" dataKey="realStockNetWorth" name={t.realStockNetWorth} stroke="#ff7300" fillOpacity={1} fill="url(#colorRealStock)" strokeWidth={2} strokeDasharray="5 5"/>}
            <Line type="monotone" dataKey="remainingLoan" name={t.remainingLoan} stroke="#f43f5e" fill="transparent" strokeDasharray="3 3" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (<div className="flex items-center justify-center h-full text-slate-400 text-sm">{t.noData}</div>)}
    </div>
  );
};

const RentVsBuyChart = ({ data, t }: { data: any[], t: any }) => {
  const darkMode = document.documentElement.classList.contains('dark');
  return (
    <div className="h-80 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
            <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v)=>t.axisYear.replace('{v}', v)} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: darkMode ? '#fff' : '#1e293b' }} formatter={(value: number) => [`${value.toFixed(2)} ${t.unitWanSimple}`, '']} />
          <Legend iconType="circle" />
          <Area type="monotone" dataKey="houseNetWorth" name={t.buyNetWorth} stroke="#6366f1" fillOpacity={1} fill="url(#colorBuy)" strokeWidth={2} />
          <Area type="monotone" dataKey="stockNetWorth" name={t.rentNetWorth} stroke="#fbbf24" fillOpacity={1} fill="url(#colorRent)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CashFlowChart = ({ data, t }: { data: MonthlyCashFlow[], t: any }) => {
  const darkMode = document.documentElement.classList.contains('dark');
  
  // 转换数据格式以适配图表
  const chartData = data.map(item => ({
    month: t.monthLabel.replace('{n}', item.month.toString()),
    [t.rentalIncome]: item.rentalIncome,
    [t.mortgagePayment]: -item.mortgagePayment, // 负值表示支出
    [t.holdingCost]: -item.holdingCost, // 负值表示支出
    [t.netCashFlow]: item.netCashFlow
  }));

  // 计算平均值
  const avgNetCashFlow = data.reduce((sum, item) => sum + item.netCashFlow, 0) / data.length;

  return (
    <div className="space-y-4">
      {/* 平均现金流指示器 */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-700 dark:text-white">{t.cashFlowProjection}</h4>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${avgNetCashFlow >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {t.monthlyAverage}: {avgNetCashFlow.toFixed(0)}元 {avgNetCashFlow >= 0 ? '✓' : '✗'}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="month" tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11}} />
            <YAxis tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11}} />
            <Tooltip 
              contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none' }} 
              formatter={(value: number) => [`${Math.abs(value).toFixed(0)}元`, '']}
            />
            <Legend wrapperStyle={{fontSize: '12px'}} />
            
            {/* 零线参考 */}
            <ReferenceLine y={0} stroke={darkMode ? '#64748b' : '#94a3b8'} strokeDasharray="3 3" />
            
            {/* 堆积柱状图 */}
            <Bar dataKey={t.rentalIncome} stackId="a" fill="#10b981" />
            <Bar dataKey={t.mortgagePayment} stackId="a" fill="#ef4444" />
            <Bar dataKey={t.holdingCost} stackId="a" fill="#f97316" />
            
            {/* 净现金流折线 */}
            <Line 
              type="monotone" 
              dataKey={t.netCashFlow} 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const RentVsBuyPanel = ({ result, params, t }: { result: CalculationResult, params: InvestmentParams, t: any }) => {
  // Transform data for the chart: calculate houseNetWorth for each year
  const chartData = result.yearlyData.map(d => ({
    ...d,
    houseNetWorth: d.propertyValue - d.remainingLoan
  }));

  const finalYear = chartData[chartData.length - 1];
  const winner = finalYear.houseNetWorth > finalYear.stockNetWorth ? t.buyScenario : t.rentScenario;
  const diff = Math.abs(finalYear.houseNetWorth - finalYear.stockNetWorth).toFixed(1);
  // Note: result.breakEvenYear is based on Total Return > 0. 
  // For Rent vs Buy, we want Net Worth Crossover.
  const crossoverYear = chartData.find(d => d.houseNetWorth > d.stockNetWorth)?.year;

  return (
    <div className="space-y-6">
      {params.monthlyRent === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-start gap-3 text-sm text-amber-800 dark:text-amber-200">
           <AlertTriangle className="w-5 h-5 shrink-0" />
           <div>
             For a valid "Buy vs Rent" comparison when self-occupying, please enter the <strong>Market Rent</strong> you would otherwise pay in the "Monthly Rent" field. Currently it is 0, so the "Rent" scenario assumes you live for free and invest all savings.
           </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
         <div>
           <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t.breakevenPoint}</div>
           <div className="text-lg font-bold text-slate-800 dark:text-white">
             {crossoverYear ? t.breakevenDesc.replace('{year}', crossoverYear) : t.neverBreakeven}
           </div>
         </div>
         <div className={`px-3 py-1 rounded-full text-xs font-bold ${finalYear.houseNetWorth > finalYear.stockNetWorth ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
           {t.diffAnalysis.replace('{year}', finalYear.year).replace('{winner}', winner).replace('{diff}', diff).replace('{unit}', t.unitWanSimple)}
         </div>
      </div>

      <RentVsBuyChart data={chartData} t={t} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
           <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400 font-bold"><Home className="h-4 w-4"/> {t.buyScenario}</div>
           <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
             {t.housePro1} • {t.housePro2} • {t.housePro3}
           </div>
        </div>
        <div className="p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
           <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-bold"><PiggyBank className="h-4 w-4"/> {t.rentScenario}</div>
           <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
             {t.stockPro1} • {t.stockPro2} • {t.stockPro3}
           </div>
        </div>
      </div>
    </div>
  );
};



const TaxCalculatorModal = ({ isOpen, onClose, t, initialPrice }: { isOpen: boolean; onClose: () => void; t: any; initialPrice: number }) => {
  const [params, setParams] = useState<TaxParams>({
    cityTier: 'other',
    isSecondHand: false,
    area: 90,
    buyerStatus: 'first',
    yearsHeld: '<2',
    isSellerOnlyHome: false,
    price: initialPrice,
  });

  const [result, setResult] = useState<TaxResult | null>(null);

  useEffect(() => {
    setParams(p => ({ ...p, price: initialPrice }));
  }, [initialPrice]);

  const handleCalculate = () => {
    const res = calculateTaxes(params);
    setResult(res);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-500"/> {t.taxTitle}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.inputCityTier}</label>
               <select value={params.cityTier} onChange={e => setParams({...params, cityTier: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                 <option value="tier1">{t.tier1}</option>
                 <option value="other">{t.tierOther}</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.inputArea}</label>
               <div className="relative">
                 <input type="number" value={params.area} onChange={e => setParams({...params, area: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                 <span className="absolute right-3 top-2 text-xs text-slate-400">㎡</span>
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.inputFirstTime}</label>
               <select value={params.buyerStatus} onChange={e => setParams({...params, buyerStatus: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                 <option value="first">{t.buyerFirst}</option>
                 <option value="second">{t.buyerSecond}</option>
                 <option value="other">{t.buyerOther}</option>
               </select>
             </div>
             <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 h-full pt-6">
                  <input type="checkbox" checked={params.isSecondHand} onChange={e => setParams({...params, isSecondHand: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  Is Second Hand?
                </label>
             </div>
          </div>

          {params.isSecondHand && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.inputYearsHeld}</label>
                   <select value={params.yearsHeld} onChange={e => setParams({...params, yearsHeld: e.target.value as any})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:text-white">
                     <option value="<2">{t.heldLess2}</option>
                     <option value="2-5">{t.held2to5}</option>
                     <option value=">5">{t.heldMore5}</option>
                   </select>
                 </div>
                 <div className="space-y-2 flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={params.isSellerOnlyHome} onChange={e => setParams({...params, isSellerOnlyHome: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                      {t.inputSellerOnly}
                    </label>
                 </div>
               </div>
            </div>
          )}

          <button onClick={handleCalculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">{t.calcTax}</button>

          {/* Results */}
          {result && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-end pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500">{t.taxTotal}</span>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.total.toFixed(2)} <span className="text-sm text-slate-400">{t.unitWanSimple}</span></span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                     <div className="text-xs text-slate-500 mb-1">{t.taxDeed}</div>
                     <div className="font-bold dark:text-white">{result.deedTax.toFixed(2)}</div>
                     <div className="text-[10px] text-slate-400">{(result.breakdown.deedRate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                     <div className="text-xs text-slate-500 mb-1">{t.taxVAT}</div>
                     <div className="font-bold dark:text-white">{result.vat.toFixed(2)}</div>
                     <div className="text-[10px] text-slate-400">{(result.breakdown.vatRate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                     <div className="text-xs text-slate-500 mb-1">{t.taxPIT}</div>
                     <div className="font-bold dark:text-white">{result.pit.toFixed(2)}</div>
                     <div className="text-[10px] text-slate-400">{(result.breakdown.pitRate * 100).toFixed(1)}%</div>
                  </div>
               </div>
               <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                 {t.taxExplanation}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppreciationPredictorModal = ({ isOpen, onClose, t }: { isOpen: boolean; onClose: () => void; t: any }) => {
  const [params, setParams] = useState<AppreciationPredictorParams>({
    cityTier: '新一线',
    district: '近郊',
    propertyType: '住宅',
    policyEnvironment: '中性',
    infrastructurePlan: '一般规划',
    populationTrend: '稳定',
    industryDevelopment: '中等',
  });

  const [prediction, setPrediction] = useState<AppreciationPrediction | null>(null);

  const handlePredict = () => {
    const result = predictAppreciation(params);
    setPrediction(result);
  };

  if (!isOpen) return null;

  const darkMode = document.documentElement.classList.contains('dark');

  const radarData = prediction ? [
    { dimension: t.cityTier, value: prediction.breakdown.cityTierScore, fullMark: 35 },
    { dimension: t.district, value: prediction.breakdown.districtScore, fullMark: 20 },
    { dimension: t.policyEnv, value: prediction.breakdown.policyScore, fullMark: 15 },
    { dimension: t.infrastructure, value: prediction.breakdown.infrastructureScore, fullMark: 15 },
    { dimension: t.populationTrend, value: prediction.breakdown.populationScore, fullMark: 10 },
    { dimension: t.industryDev, value: prediction.breakdown.industryScore, fullMark: 10 },
  ] : [];

  const trendData = prediction ? prediction.yearlyRate.map((rate, idx) => ({
    year: `第${idx + 1}年`,
    rate: rate
  })) : [];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'S': return 'from-purple-500 to-pink-500';
      case 'A': return 'from-emerald-500 to-teal-500';
      case 'B': return 'from-blue-500 to-indigo-500';
      case 'C': return 'from-amber-500 to-orange-500';
      case 'D': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'S': return t.levelS;
      case 'A': return t.levelA;
      case 'B': return t.levelB;
      case 'C': return t.levelC;
      case 'D': return t.levelD;
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-indigo-500"/> {t.appreciationPredictor}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">基于多维度分析预测房产未来增值潜力</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.cityTier}</label>
              <select value={params.cityTier} onChange={e => setParams({...params, cityTier: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="一线">{t.tier1}</option>
                <option value="新一线">{t.tierNew1}</option>
                <option value="二线">{t.tier2}</option>
                <option value="三线及以下">{t.tier3}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.district}</label>
              <select value={params.district} onChange={e => setParams({...params, district: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="核心区">{t.districtCore}</option>
                <option value="近郊">{t.districtNear}</option>
                <option value="远郊">{t.districtFar}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.propertyTypeLabel}</label>
              <select value={params.propertyType} onChange={e => setParams({...params, propertyType: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="住宅">{t.propertyResidential}</option>
                <option value="公寓">{t.propertyApartment}</option>
                <option value="别墅">{t.propertyVilla}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.policyEnv}</label>
              <select value={params.policyEnvironment} onChange={e => setParams({...params, policyEnvironment: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="宽松">{t.policyLoose}</option>
                <option value="中性">{t.policyNeutral}</option>
                <option value="严格">{t.policyStrict}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.infrastructure}</label>
              <select value={params.infrastructurePlan} onChange={e => setParams({...params, infrastructurePlan: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="重大规划">{t.infraMajor}</option>
                <option value="一般规划">{t.infraNormal}</option>
                <option value="无规划">{t.infraNone}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.populationTrend}</label>
              <select value={params.populationTrend} onChange={e => setParams({...params, populationTrend: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="持续流入">{t.popInflow}</option>
                <option value="稳定">{t.popStable}</option>
                <option value="流出">{t.popOutflow}</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.industryDev}</label>
              <select value={params.industryDevelopment} onChange={e => setParams({...params, industryDevelopment: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="强劲">{t.industryStrong}</option>
                <option value="中等">{t.industryMedium}</option>
                <option value="疲软">{t.industryWeak}</option>
              </select>
            </div>
          </div>

          <button onClick={handlePredict} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]">
            {t.predictBtn}
          </button>

          {prediction && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`p-6 rounded-2xl bg-gradient-to-br ${getLevelColor(prediction.level)} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="text-sm font-medium opacity-90 mb-1">{t.predictionScore}</div>
                  <div className="text-5xl font-black mb-2">{prediction.score}<span className="text-2xl opacity-75">/100</span></div>
                  <div className="text-lg font-bold">{getLevelText(prediction.level)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-white mb-4">{t.dimensionAnalysis}</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={darkMode ? '#475569' : '#cbd5e1'} />
                      <PolarAngleAxis dataKey="dimension" tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11}} />
                      <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 10}} />
                      <Radar name="评分" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-white mb-4">{t.futureGrowth}</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="year" tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11}} />
                      <YAxis tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11}} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none' }} />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-900 dark:text-blue-100 mb-1">投资建议</div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{prediction.recommendation}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-3 text-red-700 dark:text-red-400 font-bold">
                    <AlertTriangle className="h-4 w-4" /> {t.risks}
                  </div>
                  <ul className="space-y-2">
                    {prediction.risks.map((risk, idx) => (
                      <li key={idx} className="text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400 font-bold">
                    <TrendingUp className="h-4 w-4" /> {t.opportunities}
                  </div>
                  <ul className="space-y-2">
                    {prediction.opportunities.map((opp, idx) => (
                      <li key={idx} className="text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomStressTestModal = ({ isOpen, onClose, t, onApply }: { isOpen: boolean; onClose: () => void; t: any; onApply: (params: CustomStressTestParams) => void }) => {
  const [params, setParams] = useState<CustomStressTestParams>({
    name: t.customScenario,
    priceChange: 0,
    rentChange: 0,
    rateChange: 0,
    vacancyRate: 0,
    holdingCostChange: 0,
    sellYear: undefined
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-500" />
            {t.addCustom}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Scenario Name */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.scenarioName}</label>
            <input 
              type="text" 
              value={params.name}
              onChange={(e) => setParams({...params, name: e.target.value})}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>

          {/* Price Change */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.priceChange} (%)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="-50" max="50" step="5"
                value={params.priceChange}
                onChange={(e) => setParams({...params, priceChange: Number(e.target.value)})}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm font-mono">{params.priceChange > 0 ? '+' : ''}{params.priceChange}%</span>
            </div>
          </div>

          {/* Rent Change */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.rentChange} (%)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="-50" max="50" step="5"
                value={params.rentChange}
                onChange={(e) => setParams({...params, rentChange: Number(e.target.value)})}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm font-mono">{params.rentChange > 0 ? '+' : ''}{params.rentChange}%</span>
            </div>
          </div>

          {/* Rate Change */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.rateChange} (%)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="-2" max="5" step="0.5"
                value={params.rateChange}
                onChange={(e) => setParams({...params, rateChange: Number(e.target.value)})}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm font-mono">{params.rateChange > 0 ? '+' : ''}{params.rateChange}%</span>
            </div>
          </div>

          {/* Vacancy Rate */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.vacancyChange} (%)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="0" max="50" step="5"
                value={params.vacancyRate}
                onChange={(e) => setParams({...params, vacancyRate: Number(e.target.value)})}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm font-mono">{params.vacancyRate}%</span>
            </div>
          </div>

          {/* Holding Cost Change */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.holdingCostChange} (%)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="-30" max="100" step="10"
                value={params.holdingCostChange}
                onChange={(e) => setParams({...params, holdingCostChange: Number(e.target.value)})}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm font-mono">{params.holdingCostChange > 0 ? '+' : ''}{params.holdingCostChange}%</span>
            </div>
          </div>
          
          {/* Sell Year */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.sellYearCustom} (Optional)</label>
            <input 
              type="number" min="1" max="30"
              value={params.sellYear || ''}
              onChange={(e) => setParams({...params, sellYear: e.target.value ? Number(e.target.value) : undefined})}
              placeholder="Default holding period"
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
          <button 
            onClick={() => setParams({
              name: t.customScenario,
              priceChange: 0,
              rentChange: 0,
              rateChange: 0,
              vacancyRate: 0,
              holdingCostChange: 0,
              sellYear: undefined
            })}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            {t.resetScenario}
          </button>
          <button 
            onClick={() => { onApply(params); onClose(); }}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
          >
            {t.applyScenario}
          </button>
        </div>
      </div>
    </div>
  );
};

const StressTestPanel = ({ results, t, onAddCustom, onDeleteCustom }: { results: StressTestResult[], t: any, onAddCustom: () => void, onDeleteCustom: (index: number) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.stressTest}</h3>
        <button 
          onClick={onAddCustom}
          className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Settings className="h-3.5 w-3.5" /> {t.addCustom}
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((res, idx) => {
          // 判断是否为自定义场景 (假设前13个是预设场景)
          const isCustom = idx >= 13;
          const customIndex = idx - 13;

          return (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group relative">
              {isCustom && (
                <button 
                  onClick={() => onDeleteCustom(customIndex)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Scenario"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              
              <div className="flex justify-between items-start mb-3 pr-4">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate" title={res.scenarioName}>{res.scenarioName}</h4>
                <div className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${res.diffRevenue < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                  {res.diffRevenue < 0 ? '-' : '+'}{(Math.abs(res.diffRevenue)).toFixed(1)}{t.unitWanSimple}
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t.metricTotalRevenue}</span>
                  <span className={`font-mono font-bold ${res.totalRevenue >= 0 ? 'text-slate-700 dark:text-slate-300' : 'text-red-500'}`}>
                    {(res.totalRevenue).toFixed(1)}{t.unitWanSimple}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t.metricComprehensive}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{res.returnRate.toFixed(1)}%</span>
                </div>
              </div>

              {/* Explanation Section */}
              {res.explanation && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {res.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RiskAssessmentPanel = ({ result, params, t }: { result: CalculationResult, params: InvestmentParams, t: any }) => {
  const comprehensiveRisk = calculateComprehensiveRisk(params, result, t);
  
  // Prepare radar chart data
  const radarData = [
    { dimension: '现金流', value: comprehensiveRisk.dimensions.cashFlow.score, fullMark: 100 },
    { dimension: '杠杆', value: comprehensiveRisk.dimensions.leverage.score, fullMark: 100 },
    { dimension: '流动性', value: comprehensiveRisk.dimensions.liquidity.score, fullMark: 100 },
    { dimension: '市场', value: comprehensiveRisk.dimensions.market.score, fullMark: 100 },
    { dimension: '政策', value: comprehensiveRisk.dimensions.policy.score, fullMark: 100 },
    { dimension: '持有成本', value: comprehensiveRisk.dimensions.holdingCost.score, fullMark: 100 }
  ];

  const getRiskColor = (level: string) => {
    return level === 'low' ? 'emerald' : level === 'medium' ? 'amber' : 'rose';
  };

  const getRiskIcon = (name: string) => {
    const icons: any = {
      '现金流压力': DollarSign,
      '杠杆风险': TrendingUp,
      '流动性风险': Droplets,
      '市场风险': BarChart3,
      '政策风险': FileText,
      '持有成本风险': Home
    };
    return icons[name] || AlertTriangle;
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-500"/>
            综合风险评估
          </h2>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            comprehensiveRisk.overallLevel === 'low' 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : comprehensiveRisk.overallLevel === 'medium'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
          }`}>
            {comprehensiveRisk.overallLevel === 'low' ? '低风险' : comprehensiveRisk.overallLevel === 'medium' ? '中风险' : '高风险'}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {comprehensiveRisk.overallScore.toFixed(0)}
              <span className="text-lg text-slate-400">/100</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  comprehensiveRisk.overallLevel === 'low' ? 'bg-emerald-500' : 
                  comprehensiveRisk.overallLevel === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${comprehensiveRisk.overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-500"/>
          风险维度分析
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name="风险评分" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(comprehensiveRisk.dimensions).map((dimension: any, idx) => {
          const Icon = getRiskIcon(dimension.name);
          const color = getRiskColor(dimension.level);
          
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/20`}>
                    <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{dimension.name}</h4>
                    <span className={`text-xs font-medium text-${color}-600 dark:text-${color}-400`}>
                      {dimension.score.toFixed(0)}分
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400`}>
                  {dimension.level === 'low' ? '低' : dimension.level === 'medium' ? '中' : '高'}
                </span>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {dimension.explanation}
              </p>
              
              {dimension.suggestions.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    改善建议:
                  </div>
                  <ul className="space-y-1">
                    {dimension.suggestions.slice(0, 2).map((suggestion: string, i: number) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-500"/>
          关键指标
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">月供收入比</div>
            <div className={`text-lg font-bold ${result.dtiRatio > 0.5 ? 'text-rose-500' : result.dtiRatio > 0.3 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {(result.dtiRatio * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">贷款比例</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
              {(100 - params.downPaymentRatio).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">月供金额</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
              ¥{result.monthlyPayment.toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">总债务</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
              ¥{result.totalMonthlyDebt.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for collapsible AI messages
const CollapsibleMessage = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldCollapse = content.length > 150;

  if (!shouldCollapse) {
    return <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
  }

  return (
    <div>
      <div className={`transition-all ${isExpanded ? '' : 'max-h-[80px] overflow-hidden relative'}`}>
        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
        )}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="text-indigo-500 dark:text-indigo-400 text-xs mt-2 hover:underline font-medium flex items-center gap-1"
      >
        {isExpanded ? '收起全文' : '展开阅读全文'}
      </button>
    </div>
  );
};

function App() {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [chartGranularity, setChartGranularity] = useState<'month' | 'year'>('year'); 
  const [showSettings, setShowSettings] = useState(false); 
  const [showMethodology, setShowMethodology] = useState(false);
  const [removeInflation, setRemoveInflation] = useState(false); 
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Language & Currency State
  const [language, setLanguage] = useState<Language>('ZH');
  const [currency, setCurrency] = useState<Currency>('CNY');

  const t = TRANSLATIONS[language];

  const toggleLanguage = () => {
    if (language === 'ZH') {
      setLanguage('EN');
      setCurrency('USD');
    } else {
      setLanguage('ZH');
      setCurrency('CNY');
    }
  };
  
  // New: Location Guide & Buying Process
  const [showLocationGuide, setShowLocationGuide] = useState(false);
  const [showBuyingProcess, setShowBuyingProcess] = useState(false);
  const [showTaxCalculator, setShowTaxCalculator] = useState(false);
  const [showAppreciationPredictor, setShowAppreciationPredictor] = useState(false);
  const [showHousingTrends, setShowHousingTrends] = useState(false);
  const [showCustomStressTest, setShowCustomStressTest] = useState(false);
  const [customScenarios, setCustomScenarios] = useState<CustomStressTestParams[]>([]);
  const [locationScore, setLocationScore] = useState<LocationScore | null>(null);

  // Tour State
  const [showTour, setShowTour] = useState(false);

  // Custom API Key State
  const [customApiKey, setCustomApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState(""); 

  const [params, setParams] = useState<InvestmentParams>({
    totalPrice: 300,
    downPaymentRatio: 30,
    holdingYears: 10,
    loanType: LoanType.COMMERCIAL,
    loanTerm: 30,
    interestRate: 4.1, 
    providentInterestRate: 2.85,
    providentQuota: 100,
    deedTaxRate: 1.5, 
    agencyFeeRatio: 2.0, 
    renovationCost: 20, 
    enablePrepayment: false,
    prepaymentYear: 3,
    prepaymentAmount: 50,
    prepaymentStrategy: PrepaymentStrategy.REDUCE_PAYMENT,
    monthlyRent: 5000,
    holdingCostRatio: 1.0, 
    propertyMaintenanceCost: 0.2,
    appreciationRate: 4,
    vacancyRate: 5, 
    emergencyFund: 20,
    familyMonthlyIncome: 30000,
    method: RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST,
    alternativeReturnRate: 4.0, 
    inflationRate: 2.5, 
    existingPropertyCount: 0,
    existingMonthlyDebt: 0,
    monthlyIncome: 30000, // 默认月收入3万
    purchaseScenario: PurchaseScenario.FIRST_HOME
  });

  const result = useMemo(() => calculateInvestment(params, t), [params, t]);
  const stressTestResults = useMemo(() => calculateStressTest(params, t, customScenarios), [params, t, customScenarios]);
  const scheduleChartData = useMemo(() => {
      if (!result || !result.monthlyData || result.monthlyData.length === 0) {
          return [];
      }
      if (chartGranularity === 'year') {
          return aggregateYearlyPaymentData(result.monthlyData, t);
      } else {
          return result.monthlyData.filter((_, i) => i % 6 === 0 || i === result.monthlyData.length - 1).map((m, idx) => ({
              year: Math.floor(m.monthIndex / 12) + 1,
              label: t.monthIndex.replace('{n}', m.monthIndex.toString()),
              payment: m.payment,
              principal: m.principal,
              interest: m.interest,
              remainingPrincipal: m.remainingPrincipal
          }));
      }
  }, [result, result?.monthlyData, chartGranularity, t]);


  const [activeTab, setActiveTab] = useState('chart'); // For the new tabbed panel

  // --- Effects ---
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setDarkMode(true);
    const savedKey = localStorage.getItem('user_gemini_api_key');
    if (savedKey) { setCustomApiKey(savedKey); setTempApiKey(savedKey); }
    const hasSeenTour = localStorage.getItem('has_seen_tour');
    if (!hasSeenTour) setShowTour(true);
  }, []);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);



  // --- Handlers ---
  const handleInputChange = (field: keyof InvestmentParams, value: number | string | boolean) => {
    setParams(prev => ({
      ...prev,
      [field]: typeof value === 'string' && !['method', 'prepaymentStrategy', 'loanType', 'purchaseScenario'].includes(field) ? Number(value) : value
    }));
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) { localStorage.setItem('user_gemini_api_key', tempApiKey.trim()); setCustomApiKey(tempApiKey.trim()); } 
    else { localStorage.removeItem('user_gemini_api_key'); setCustomApiKey(""); }
    setShowSettings(false);
  };



  const handleApplyLocationScore = (score: LocationScore) => {
    setLocationScore(score);
    setShowLocationGuide(false);
  };

  const handleDeleteCustomScenario = (index: number) => {
    setCustomScenarios(prev => prev.filter((_, i) => i !== index));
  };

  const initialCostData = [
    { name: t.labelDownPayment, value: result.initialCosts.downPayment, color: '#6366f1' },
    { name: t.labelDeedTax, value: result.initialCosts.deedTax, color: '#f43f5e' },
    { name: t.labelAgencyFee, value: result.initialCosts.agencyFee, color: '#fbbf24' },
    { name: t.labelRenovation, value: result.initialCosts.renovation, color: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-indigo-50/30 text-slate-900'}`}>
      
      {showTour && <TourGuide onComplete={() => { setShowTour(false); localStorage.setItem('has_seen_tour', 'true'); }} t={t} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} t={t} />}
      
      {/* New Modal */}
      {showLocationGuide && <LocationGuideModal onClose={() => setShowLocationGuide(false)} onApply={handleApplyLocationScore} t={t} />}
      {showBuyingProcess && <BuyingProcessModal onClose={() => setShowBuyingProcess(false)} t={t} />}
      {showTaxCalculator && <TaxCalculatorModal isOpen={showTaxCalculator} onClose={() => setShowTaxCalculator(false)} t={t} initialPrice={params.totalPrice} />}
      {showAppreciationPredictor && <AppreciationPredictorModal isOpen={showAppreciationPredictor} onClose={() => setShowAppreciationPredictor(false)} t={t} />}
      {showCustomStressTest && (
        <CustomStressTestModal 
          isOpen={showCustomStressTest} 
          onClose={() => setShowCustomStressTest(false)} 
          t={t} 
          onApply={(newScenario) => setCustomScenarios([...customScenarios, newScenario])} 
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3" id="header-title">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                {t.appTitle} <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2 align-middle">{t.pro}</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { localStorage.removeItem('has_seen_tour'); setShowTour(true); }} className="hidden md:block px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg">{t.tutorial}</button>
            
            {/* New Button for Buying Process */}
            <button 
                onClick={() => setShowBuyingProcess(true)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <ClipboardCheck className="h-3.5 w-3.5" /> {t.buyingProcess}
            </button>

            {/* New Button for Location Guide */}
            <button 
                onClick={() => setShowLocationGuide(true)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 dark:border-emerald-900/30"
            >
                <MapPin className="h-3.5 w-3.5" /> {t.locationGuide}
            </button>

            {/* New Button for Appreciation Predictor */}
            <button 
              onClick={() => setShowAppreciationPredictor(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl transition-all text-sm font-medium border border-purple-100 dark:border-purple-900/30"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t.predictAppreciation}</span>
            </button>
            <button 
              onClick={() => setShowHousingTrends(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all text-sm font-medium border border-emerald-100 dark:border-emerald-900/30"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.viewHousingTrends}</span>
            </button>

            <button onClick={() => setShowMethodology(true)} className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><BookOpen className="h-3.5 w-3.5" /> {t.methodology}</button>
            <button onClick={toggleLanguage} className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{language === 'ZH' ? 'EN' : '中文'}</button>
            <button onClick={() => setShowSettings(true)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 relative"><Settings className="h-5 w-5" />{customApiKey && <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900"></span>}</button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">{darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          </div>
        </div>
      </header>

      {/* Main Container: Expanded width to 1600px */}
      <main id="main-report" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. INPUT DASHBOARD */}
        <section id="input-panel" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all duration-300">
           {/* ... (Existing inputs, logic preserved but now in wider container) ... */}
           <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white font-bold text-lg relative z-10"><List className="h-5 w-5 text-indigo-500" /> {t.inputPanelTitle}</div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 relative z-10">
               {/* Column 1 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.baseInfo}</h3>
                   <div className="space-y-4">
                        <InputGroup label={t.totalPrice} value={params.totalPrice} onChange={v => handleInputChange('totalPrice', v)} tooltip={t.tipTotalPrice} />
                        <InputGroup label={t.downPaymentRatio} value={params.downPaymentRatio} onChange={v => handleInputChange('downPaymentRatio', v)} subtext={`${t.netDownPayment}: ${(result?.downPayment || 0).toFixed(2)}${t.unitWanSimple}`} tooltip={t.tipDownPayment} />
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">{t.oneTimeCost}</div>
                                <button onClick={() => setShowTaxCalculator(true)} className="text-[10px] flex items-center gap-1 text-indigo-600 font-bold hover:underline"><Calculator className="h-3 w-3" /> {t.calcTax}</button>
                            </div>
                            <div className="space-y-2">
                                <InputGroup label={t.deedTax} value={params.deedTaxRate} onChange={v => handleInputChange('deedTaxRate', v)} step={0.1} tooltip={t.tipDeedTax} />
                                <InputGroup label={t.agencyFee} value={params.agencyFeeRatio} onChange={v => handleInputChange('agencyFeeRatio', v)} step={0.1} tooltip={t.tipAgencyFee} />
                                <InputGroup label={t.renovationCost} value={params.renovationCost} onChange={v => handleInputChange('renovationCost', v)} tooltip={t.tipRenovation} />
                            </div>
                        </div>
                   </div>
               </div>
               {/* Column 2 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.loanScheme}</h3>
                   <div className="space-y-4">
                       <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.loanType}</label><div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg"><button onClick={() => handleInputChange('loanType', LoanType.COMMERCIAL)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.COMMERCIAL ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>{t.commercial}</button><button onClick={() => handleInputChange('loanType', LoanType.PROVIDENT)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.PROVIDENT ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>{t.provident}</button><button onClick={() => handleInputChange('loanType', LoanType.COMBINATION)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.COMBINATION ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>{t.combination}</button></div></div>
                       {(params.loanType === LoanType.COMMERCIAL || params.loanType === LoanType.COMBINATION) && <InputGroup label={t.commercialRate} value={params.interestRate} onChange={v => handleInputChange('interestRate', v)} step={0.01} tooltip={t.tipInterestRate} />}
                       {(params.loanType === LoanType.PROVIDENT || params.loanType === LoanType.COMBINATION) && <div className="animate-fade-in"><InputGroup label={t.providentRate} value={params.providentInterestRate} onChange={v => handleInputChange('providentInterestRate', v)} step={0.01} tooltip={t.tipProvidentRate} />{params.loanType === LoanType.COMBINATION && <InputGroup label={t.providentQuota} value={params.providentQuota} onChange={v => handleInputChange('providentQuota', v)} tooltip={t.tipProvidentQuota} />}</div>}
                       <InputGroup label={t.loanTerm} value={params.loanTerm} onChange={v => handleInputChange('loanTerm', v)} tooltip={t.tipLoanTerm} />
                   </div>
               </div>
               {/* Column 3 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.financeAndRepayment}</h3>
                   <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">{t.enablePrepayment}</label><input type="checkbox" checked={params.enablePrepayment} onChange={(e) => handleInputChange('enablePrepayment', e.target.checked)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" /></div>
                            {params.enablePrepayment && (<div className="animate-fade-in space-y-4 pt-2"><InputGroup label={t.prepaymentYear} value={params.prepaymentYear} onChange={v => handleInputChange('prepaymentYear', v)} tooltip={t.tipPrepaymentYear} /><InputGroup label={t.prepaymentAmount} value={params.prepaymentAmount} onChange={v => handleInputChange('prepaymentAmount', v)} tooltip={t.tipPrepaymentAmount} /><div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.repaymentStrategy}</label><select value={params.prepaymentStrategy} onChange={(e) => handleInputChange('prepaymentStrategy', e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"><option value={PrepaymentStrategy.REDUCE_PAYMENT}>{t.reducePayment}</option><option value={PrepaymentStrategy.REDUCE_TERM}>{t.reduceTerm}</option></select></div></div>)}
                        </div>
                        <InputGroup label={t.alternativeReturn} value={params.alternativeReturnRate} onChange={v => handleInputChange('alternativeReturnRate', v)} step={0.1} tooltip={t.tipAlternativeReturn} />
                        <InputGroup label={t.inflationRate} value={params.inflationRate} onChange={v => handleInputChange('inflationRate', v)} step={0.1} tooltip={t.tipInflation} />
                   </div>
               </div>
               {/* Column 4 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.revenueAndRisk}</h3>
                   <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-2"><InputGroup label={t.holdingYears} value={params.holdingYears} onChange={v => handleInputChange('holdingYears', v)} tooltip={t.tipHoldingYears} /><InputGroup label={t.monthlyRent} value={params.monthlyRent} onChange={v => handleInputChange('monthlyRent', v)} tooltip={t.tipMonthlyRent} /></div>
                       <div className="grid grid-cols-2 gap-2"><InputGroup label={t.annualAppreciation} value={params.appreciationRate} onChange={v => handleInputChange('appreciationRate', v)} step={0.1} tooltip={t.tipAppreciation} /><InputGroup label={t.vacancyRate} value={params.vacancyRate} onChange={v => handleInputChange('vacancyRate', v)} tooltip={t.tipVacancy} /></div>
                       <div className="grid grid-cols-2 gap-2"><InputGroup label={t.holdingCostRatio} value={params.holdingCostRatio} onChange={v => handleInputChange('holdingCostRatio', v)} step={0.1} tooltip={t.tipHoldingCost} /><InputGroup label={t.maintenanceCost} value={params.propertyMaintenanceCost} onChange={v => handleInputChange('propertyMaintenanceCost', v)} step={0.1} tooltip={t.tipMaintenance} /></div>
                       <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                           <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Building2 className="h-3 w-3"/> {t.existingAssets}</div>
                           <div className="space-y-2">
                               <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.purchaseScenario}</label><select value={params.purchaseScenario} onChange={(e) => handleInputChange('purchaseScenario', e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"><option value={PurchaseScenario.FIRST_HOME}>{t.firstHome}</option><option value={PurchaseScenario.SECOND_HOME}>{t.secondHome}</option><option value={PurchaseScenario.INVESTMENT}>{t.investment}</option></select></div>
                               <InputGroup label={t.existingProperties} value={params.existingPropertyCount} onChange={v => handleInputChange('existingPropertyCount', v)} tooltip={t.tipExistingProp} />
                               <InputGroup label={t.existingMonthlyDebt} value={params.existingMonthlyDebt} onChange={v => handleInputChange('existingMonthlyDebt', v)} tooltip={t.tipExistingDebt} />
                           </div>
                       </div>
                       <InputGroup label={t.familyIncome} value={params.familyMonthlyIncome} onChange={v => handleInputChange('familyMonthlyIncome', v)} tooltip={t.tipFamilyIncome} />
                   </div>
               </div>
           </div>
        </section>

        {/* 2. MAIN RESULTS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column (2/3) */}
          <div className="xl:col-span-2 space-y-8" id="result-panel">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <MetricCard label={t.metricCashOnCash} value={`${result.cashOnCashReturn.toFixed(2)}%`} sub={t.subActualInvest} color="indigo" tooltip={t.tipCashOnCash} />
               <MetricCard label={t.metricComprehensive} value={`${result.comprehensiveReturn.toFixed(2)}%`} sub={t.subIncAppreciation} color="violet" tooltip={t.tipComprehensive} />
               <MetricCard label={t.metricFirstPayment} value={`${t.currencySymbol}${result.monthlyPaymentText}`} sub={`${t.subCoverage}: ${result.monthlyCoverageRatio.toFixed(2)}`} color="slate" tooltip={t.tipFirstPayment} />
               <MetricCard label={t.metricTotalRevenue} value={`${result.totalRevenue.toFixed(1)}${t.unitWanSimple}`} sub={result.breakEvenYear ? t.subBreakEven.replace('{year}', result.breakEvenYear) : t.subNotBreakEven} color="emerald" tooltip={t.tipTotalRevenue} />
            </div>

            {/* Asset Comparison & Cost */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Initial Cost - 缩短高度 */}
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 md:col-span-1 flex flex-col">
                  <h2 className="text-sm font-bold flex items-center gap-2 dark:text-white mb-4"><PieChartIcon className="h-4 w-4 text-indigo-500" /> {t.chartInitialCost}</h2>
                  <div className="flex-1 min-h-[120px] relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={initialCostData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                            {initialCostData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => `${v.toFixed(1)}${t.unitWanSimple}`} contentStyle={{borderRadius:'8px', fontSize:'12px'}} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><div className="text-base font-bold text-slate-700 dark:text-white">{result.initialCosts.total.toFixed(0)}</div><div className="text-[9px] text-slate-400">{t.labelTotalInvest}</div></div>
                  </div>
                  <div className="mt-2 space-y-1">{initialCostData.map((item, i) => <div key={i} className="flex justify-between text-xs text-slate-500"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: item.color}}></span>{item.name}</span><span>{item.value.toFixed(1)}{t.unitWanSimple}</span></div>)}</div>
                  
                  {/* 现金流图表 */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <CashFlowChart data={result.monthlyCashFlow} t={t} />
                  </div>
               </div>

               {/* Asset Comparison */}
               <div id="comparison-panel" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 md:col-span-2">
                  <div className="flex items-center justify-between mb-6 relative z-10">
                     <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg"><TrendingUp className="h-5 w-5 text-indigo-500" /> {t.assetComparison}</div>
                     <div className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{t.netWorthAtYear.replace('{year}', params.holdingYears.toString())}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={`relative p-4 rounded-2xl border transition-all ${result.assetComparison.winner === 'House' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                        {result.assetComparison.winner === 'House' && <div className="absolute -top-2 left-2 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">{t.labelWinner}</div>}
                        <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-md text-indigo-600 dark:text-indigo-400"><TrendingUp className="h-4 w-4"/></div><div className="text-xs font-bold dark:text-white">{t.labelHouseInvest}</div></div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white mb-2">{result.assetComparison.houseNetWorth.toFixed(1)} <span className="text-xs font-normal text-slate-500">{t.unitWanSimple}</span></div>
                      </div>
                      <div className={`relative p-4 rounded-2xl border transition-all ${result.assetComparison.winner === 'Stock' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                        {result.assetComparison.winner === 'Stock' && <div className="absolute -top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">{t.labelWinner}</div>}
                        <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-emerald-100 dark:bg-emerald-900 rounded-md text-emerald-600 dark:text-emerald-400"><BarChart3 className="h-4 w-4"/></div><div className="text-xs font-bold dark:text-white">{t.labelStockInvest}</div></div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white mb-2">{result.assetComparison.stockNetWorth.toFixed(1)} <span className="text-xs font-normal text-slate-500">{t.unitWanSimple}</span></div>
                      </div>
                  </div>
                  
                  {/* New Asset Comparison Table */}
                  <AssetComparisonTable data={result.assetComparison.qualitative} t={t} />

                  {/* New Knowledge Carousel */}
                  <KnowledgeCarousel cards={result.assetComparison.knowledgeCards} t={t} />
               </div>
            </div>

            {/* Wealth Chart */}
            {/* Wealth Chart & Analysis Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
               <div className="flex gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
                   <button onClick={() => setActiveTab('chart')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'chart' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t.wealthCurve}</button>
                   <button onClick={() => setActiveTab('rentVsBuy')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rentVsBuy' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t.rentVsBuyAnalysis}</button>
                   <button onClick={() => setActiveTab('stress')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'stress' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t.stressTest}</button>
                   <button onClick={() => setActiveTab('risk')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'risk' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t.riskAssessment}</button>
                   <button onClick={() => setActiveTab('affordability')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'affordability' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t.affordabilityTitle}</button>
                   <button onClick={() => setActiveTab('lifePath')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'lifePath' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t.lifePathTitle || '人生路线'}</button>
                </div>

               {activeTab === 'chart' && (
                   <>
                       <div className="flex items-center justify-end mb-4">
                           <div className="flex items-center gap-2">
                               <span className="text-xs text-slate-500">{removeInflation ? t.removedInflation : t.removeInflation}</span>
                               <button onClick={() => setRemoveInflation(!removeInflation)} className={`w-10 h-5 rounded-full transition-colors relative ${removeInflation ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}><div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${removeInflation ? 'translate-x-5' : ''}`} /></button>
                           </div>
                       </div>
                       <WealthGrowthChart data={result.yearlyData} removeInflation={removeInflation} t={t} />
                   </>
               )}

               {activeTab === 'rentVsBuy' && <RentVsBuyPanel result={result} params={params} t={t} />}
               {activeTab === 'stress' && (
                 <StressTestPanel 
                   results={stressTestResults} 
                   t={t} 
                   onAddCustom={() => setShowCustomStressTest(true)}
                   onDeleteCustom={handleDeleteCustomScenario}
                 />
               )}
               {activeTab === 'risk' && <RiskAssessmentPanel result={result} params={params} t={t} />}
                {activeTab === 'affordability' && (
                  <AffordabilityPanel 
                    affordability={calculateAffordability(params, result)}
                    monthlyIncome={params.familyMonthlyIncome || 30000}
                    monthlyPayment={result.monthlyPayment}
                    t={t}
                  />
                )}
                {activeTab === 'lifePath' && <LifePathSimulator params={params} t={t} />}
             </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="xl:col-span-1 flex flex-col gap-6 h-full" id="ai-panel">
            {/* Payment Schedule Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  {t.scheduleTitle || '还款计划详情'}
                </h3>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setChartGranularity('year')} 
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartGranularity === 'year' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500'}`}
                  >
                    {t.granularityYear || '按年'}
                  </button>
                  <button 
                    onClick={() => setChartGranularity('month')} 
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartGranularity === 'month' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500'}`}
                  >
                    {t.granularityMonth || '按月'}
                  </button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={scheduleChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                    <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Legend wrapperStyle={{fontSize: '11px'}} />
                    <Bar yAxisId="left" dataKey="interest" name={t.legendInterest || '支付利息'} stackId="a" fill="#f43f5e" />
                    <Bar yAxisId="left" dataKey="principal" name={t.legendPrincipal || '偿还本金'} stackId="a" fill="#10b981" />
                    <Line yAxisId="right" type="monotone" dataKey="remainingPrincipal" name={t.legendRemaining || '剩余本金'} stroke="#6366f1" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>


          </div>
        </div>

        {/* 房子评价你 - House Roast Section */}
        <HouseRoastPanel params={params} result={result} t={t} />

        {/* 游戏化买房模式 - Game Mode Section */}
        <GameModePanel params={params} t={t} />

      </main>

      {/* Housing Trends Modal */}
      {showHousingTrends && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-6xl shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            {/* Header Bar */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">全国房价排行榜</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">住宅 2025年10月</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHousingTrends(false)}
                className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-md border border-slate-200 dark:border-slate-700"
                title="关闭"
              >
                <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1">
              <HousingTrendsPanel t={t} />
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Advisor */}
      <FloatingAIAdvisor t={t} contextParams={params} result={result} />

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 border-t border-slate-200 dark:border-slate-800 py-16 mt-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          {/* Quote */}
          <div className="text-center mb-8">
            <p className="text-slate-400 dark:text-slate-500 text-sm italic max-w-2xl mx-auto">
              {t.footerQuote}
            </p>
          </div>
          
          {/* Main content */}
          <div className="flex flex-col items-center gap-6">
            {/* Creator info with special styling */}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="text-sm">Crafted with</span>
              <span className="text-red-500 animate-pulse">♥</span>
              <span className="text-sm">by</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Josephine
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button 
                onClick={() => setShowDonation(true)} 
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
              >
                <Coffee className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                {t.footerDonate}
              </button>
              
              <button 
                onClick={() => setShowFeedback(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Send className="h-4 w-4" />
                {t.footerFeedback}
              </button>
            </div>
            
            {/* Appreciation message */}
            <div className="mt-4 px-6 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                感谢您的支持 🙏 您的赞赏是我持续创作的动力
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {showSettings && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"><h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><Key className="h-5 w-5 text-indigo-500"/> {t.settingsTitle}</h3><button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button></div><div className="p-6 space-y-4"><div className="space-y-2"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.settingsKeyLabel}</label><input type="password" value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} placeholder={t.settingsKeyPlaceholder} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" /><p className="text-[10px] text-slate-400">{t.settingsKeyTip}</p></div><div className="flex gap-3 pt-2"><button onClick={() => { setTempApiKey(''); setCustomApiKey(''); localStorage.removeItem('user_gemini_api_key'); setShowSettings(false); }} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">{t.settingsClear}</button><button onClick={handleSaveApiKey} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">{t.settingsSave}</button></div></div></div></div>}
      {showDonation && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDonation(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.donationTitle}</h3><p className="text-slate-500 dark:text-slate-400 text-xs mb-6">{t.donationDesc}</p><div className="bg-emerald-500 p-4 rounded-xl inline-block mb-4 shadow-lg shadow-emerald-500/30"><div className="bg-white p-2 rounded-lg"><img src="/mm_reward_qrcode_1764664984491.png" alt="Payment QR" className="w-48 h-48 object-contain"/></div></div><button onClick={() => setShowDonation(false)} className="block w-full text-sm text-slate-400 hover:text-slate-600 mt-2">{t.donationClose}</button></div></div>}
      {showMethodology && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowMethodology(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10"><h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-500"/> {t.methodologyTitle}</h3><button onClick={() => setShowMethodology(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button></div><div className="p-8 space-y-8 text-sm text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: t.methodologyContent }} /></div></div>}




    </div>
  );
}

// ... existing small components ...
const InputGroup = ({ label, value, onChange, subtext, step = 1, tooltip }: { label: string, value: any, onChange: (v: any) => void, subtext?: string, step?: number, tooltip?: string }) => (
  <div className="flex flex-col gap-1.5 group relative">
    <div className="flex items-center gap-1"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>{tooltip && (<div className="relative group/tooltip"><Info className="h-3 w-3 text-slate-300 cursor-help" /><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">{tooltip}</div></div>)}</div><input type="number" step={step} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all hover:border-indigo-300 dark:hover:border-indigo-700" />{subtext && <div className="text-[10px] text-slate-400">{subtext}</div>}
  </div>
);
const MetricCard = ({ label, value, sub, color, tooltip }: any) => { const bgColors: any = { indigo: 'bg-indigo-500', violet: 'bg-violet-600', slate: 'bg-slate-800 dark:bg-slate-700', emerald: 'bg-emerald-500' }; return (<div className={`${bgColors[color]} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group`}><div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Wallet size={48} /></div>{tooltip && (<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity"><Info className="h-4 w-4" /></div>)}<div className="relative z-10"><div className="text-indigo-100/80 text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">{label}</div><div className="text-2xl font-bold mb-1">{value}</div><div className="text-[10px] opacity-80">{sub}</div></div>{tooltip && (<div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity z-20">{tooltip}</div>)}</div>); };

const RiskBar = ({ label, score, max, color }: any) => { const colors: any = { amber: 'bg-amber-500', rose: 'bg-rose-500' }; return (<div><div className="flex justify-between mb-1.5 text-xs"><span className="text-slate-600 dark:text-slate-400">{label}</span><span className="font-bold dark:text-white">{score}/{max}</span></div><div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden"><div className={`h-full ${colors[color]} rounded-full transition-all duration-1000`} style={{ width: `${(score/max)*100}%` }}></div></div></div>); };

export default App;

