
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ThemeMode } from './types';
import { PRESETS, getPresetById } from './utils/presets';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, BarChart, Bar, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine
} from 'recharts';
import { 
  Calculator, TrendingUp, BrainCircuit, Moon, Sun, AlertTriangle, 
  Wallet, ShieldAlert, BadgeCheck, Coffee, Send, User, Bot, BarChart3,
  List, X, History, BadgePercent, Settings, Key, Info, BookOpen, ArrowRightLeft,
  Landmark, Loader, Download, FileText, Image as ImageIcon, FileType2, Share2, ChevronDown, CheckCircle2, XCircle, PieChart as PieChartIcon, Coins, Building2, MapPin, Globe2, Lightbulb, ClipboardCheck, ArrowDown, Home, PiggyBank, DollarSign, Droplets, Target, Zap,
  Compass, ChevronRight, Database, MessageCircle, ExternalLink, LogIn, LogOut
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, logout } from './services/authService';
import { AuthModal } from './components/AuthModal';
import HousingTrendsPanel from './components/HousingTrendsPanel';
import AffordabilityPanel from './components/AffordabilityPanel';
import LifePathSimulator from './components/LifePathSimulator';
import FloatingAIAdvisor from './components/FloatingAIAdvisor';
import GameModePanel from './components/GameModePanel';
import DecisionDashboard from './components/DecisionDashboard';
import InteractiveDashboard from './components/InteractiveDashboard';
import InteractiveTimeline from './components/InteractiveTimeline';
import DetailedPaymentTable from './components/DetailedPaymentTable';
import InvestmentWisdomCard from './components/InvestmentWisdomCard';
import MarketSentimentSlider from './components/MarketSentimentSlider';
import RentHiddenCostCalculator from './components/RentHiddenCostCalculator';
import CarPurchasePanel from './components/CarPurchasePanel';
import AssetAllocationPanel from './components/AssetAllocationPanel';
import TokenExchangePanel from './components/TokenExchangePanel';
import RiskHeartbeatChart from './components/RiskHeartbeatChart';
import AmortizationMoodBar from './components/AmortizationMoodBar';
import KnowledgeTree from './components/KnowledgeTree';
import KnowledgeTooltip from './components/KnowledgeTooltip';
import AISettingsModal from './components/AISettingsModal';
import OpportunityCostPanel from './components/OpportunityCostPanel';
import CareerStabilityPanel from './components/CareerStabilityPanel';
import DecisionJournalPanel from './components/DecisionJournalPanel';
import NegotiationHelperPanel from './components/NegotiationHelperPanel';
import LiquidityCheckPanel from './components/LiquidityCheckPanel';
import MarketPositionRadar from './components/MarketPositionRadar';
import LifeDragIndexPanel from './components/LifeDragIndexPanel';
import CommunityDataPanel from './components/CommunityDataPanel';
import IncomeRequirementPanel from './components/IncomeRequirementPanel';
import SellDecisionDashboard from './components/SellDecisionDashboard';
import BuyDecisionDashboard from './components/BuyDecisionDashboard';
import DecisionAutopsy from './components/DecisionAutopsy';
import FreedomAnalytics from './components/FreedomAnalytics';
import LifeLeverageAnalytics from './components/LifeLeverageAnalytics';
import NavalWisdomEngine from './components/NavalWisdomEngine';
import DetailedRepaymentTab from './components/DetailedRepaymentTab';
import LifeOSDashboard from './components/LifeOSDashboard';
import SectionNav from './components/SectionNav';
import { loadAIConfig, sendAIMessage, AIMessage, getProviderName } from './utils/aiProvider';
import { InvestmentParams, RepaymentMethod, CalculationResult, PrepaymentStrategy, StressTestResult, LoanType, PurchaseScenario, LocationFactors, LocationScore, AssetComparisonItem, KnowledgeCardData, Language, Currency, TaxParams, TaxResult, AppreciationPredictorParams, AppreciationPrediction, MonthlyCashFlow, CustomStressTestParams, DecisionSnapshot, BuyTargetParams } from './types';
import { TRANSLATIONS } from './utils/translations';
import { calculateInvestment, calculateStressTest, aggregateYearlyPaymentData, calculateLocationScore, calculateTaxes, predictAppreciation, calculateComprehensiveRisk, calculateAffordability, calculateComparison, calculateMarketRadarData } from './utils/calculate';


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
    return (this as any).props.children;
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

// New: KnowledgeCarousel - Enhanced with auto-scroll and bilingual cards
const KnowledgeCarousel = ({ cards, t, language = 'ZH' }: { cards: KnowledgeCardData[], t: any, language?: Language }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  // Define enhanced bilingual knowledge cards
  const enhancedCards = [
    {
      icon: 'ArrowRightLeft',
      title: language === 'EN' ? 'Opportunity Cost' : '机会成本',
      titleEn: 'Opportunity Cost',
      content: language === 'EN' 
        ? 'Buying a house means giving up potential returns from stocks or bonds. The "Asset Comparison" feature quantifies this hidden cost.'
        : '选择买房意味着这笔首付款失去了投资股市或债券赚取收益的机会。计算器中的"资产对比"正是量化了这一隐形成本。',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: 'TrendingUp',
      title: language === 'EN' ? 'Compound Effect' : '复利效应',
      titleEn: 'Compound Effect',
      content: language === 'EN'
        ? 'Investment returns grow exponentially over time through compounding; while real estate gains mainly come from leveraged price appreciation.'
        : '理财收益通常具有复利效应（利滚利），时间越长威力越大；而房产收益主要来自杠杆放大后的资产增值。',
      color: 'from-cyan-500 to-teal-600'
    },
    {
      icon: 'AlertTriangle',
      title: language === 'EN' ? 'Liquidity Trap' : '流动性陷阱',
      titleEn: 'Liquidity Trap',
      content: language === 'EN'
        ? 'Real estate is illiquid. Selling in a downturn may take months or require a discount, while stocks can be sold instantly.'
        : '房产是低流动性资产。在经济下行或市场下行时，可能需要数月才能卖出，而股票基金可以速赎回。',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: 'Building2',
      title: language === 'EN' ? 'Leverage Sword' : '杠杆双刃剑',
      titleEn: 'Leverage Sword',
      content: language === 'EN'
        ? 'A 30% down payment gives you 3.3x leverage. Prices up 10% = 33% return. But a 10% drop could wipe out your equity.'
        : '首付30%意味着3.3倍杠杆。房价涨10%=收益33%。但房价跌10%可能亏掉全部首付。',
      color: 'from-rose-500 to-pink-600'
    },
    {
      icon: 'BarChart3',
      title: language === 'EN' ? 'DTI Ratio' : '债务收入比',
      titleEn: 'Debt-to-Income',
      content: language === 'EN'
        ? 'Banks recommend keeping monthly debt payments under 36% of income. Exceeding 50% puts you in the financial danger zone.'
        : '银行建议月供总额不超过月收入的36%。超过50%即进入财务危险区域。',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: 'Lightbulb',
      title: language === 'EN' ? 'Hedonic Adaptation' : '享乐适应',
      titleEn: 'Hedonic Adaptation',
      content: language === 'EN'
        ? 'Studies show the happiness boost from a new home fades within 2 years. Consider this before overextending financially.'
        : '研究表明，新房带来的幸福感会在2年内消退。在过度负债前请考虑这一心理因素。',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: 'TrendingUp',
      title: language === 'EN' ? 'Mean Reversion' : '均值回归',
      titleEn: 'Mean Reversion',
      content: language === 'EN'
        ? 'Asset prices tend to return to their long-term average. Past high growth doesn\'t guarantee future performance.'
        : '资产价格倾向于回归长期均值。过去的高增长并不保证未来的表现。',
      color: 'from-fuchsia-500 to-purple-600'
    },
    {
      icon: 'AlertTriangle',
      title: language === 'EN' ? 'Recency Bias' : '近因偏差',
      titleEn: 'Recency Bias',
      content: language === 'EN'
        ? 'We overweight recent trends when making decisions. Just because prices rose last year doesn\'t mean they will this year.'
        : '人们倾向于高估近期趋势。去年房价上涨并不意味着今年也会上涨。',
      color: 'from-red-500 to-rose-600'
    }
  ];

  // Auto-scroll effect
  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;
    const scrollSpeed = 1.2; // pixels per frame (increased for faster scroll)

    const scroll = () => {
      if (!isPaused && container) {
        scrollPos += scrollSpeed;
        
        // Reset when reaching the end
        if (scrollPos >= container.scrollWidth - container.clientWidth) {
          scrollPos = 0;
        }
        
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
        <BookOpen className="h-3 w-3"/> {language === 'EN' ? 'Finance Lessons' : '金融小课堂'} 
        <span className="text-[10px] font-normal ml-2 text-slate-500">{language === 'EN' ? '(Auto-scroll)' : '(自动轮播)'}</span>
      </h3>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {enhancedCards.map((card, i) => {
          const IconComp = card.icon === 'ArrowRightLeft' ? ArrowRightLeft :
                          card.icon === 'TrendingUp' ? TrendingUp :
                          card.icon === 'AlertTriangle' ? AlertTriangle :
                          card.icon === 'Building2' ? Building2 :
                          card.icon === 'BarChart3' ? BarChart3 : Lightbulb;
          return (
            <div 
              key={i} 
              className={`min-w-[260px] max-w-[260px] p-5 bg-gradient-to-br ${card.color} rounded-2xl shadow-lg snap-start hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm">{card.title}</h4>
                </div>
              </div>
              <p className="text-xs text-white/90 leading-relaxed mb-3">
                {card.content}
              </p>
              <div className="pt-2 border-t border-white/20">
                <span className="text-[10px] text-white/60 font-medium">{card.titleEn}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100"
            style={{ 
              width: scrollRef.current 
                ? `${(scrollRef.current.scrollLeft / (scrollRef.current.scrollWidth - scrollRef.current.clientWidth)) * 100}%` 
                : '0%' 
            }}
          />
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="text-xs text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
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
  const [step, setStep] = useState(0);
  const steps = [
    { 
      targetId: 'header-title', 
      title: t.tourWelcomeTitle || '🏠 欢迎使用 WealthCompass 财富罗盘', 
      content: t.tourWelcomeContent || '这是一款专业的房产投资分析工具，帮助您做出明智的购房决策。接下来让我们快速了解各个功能模块！', 
      position: 'bottom' 
    },
    { 
      targetId: 'input-panel', 
      title: t.tourStep1Title || '📝 第一步：输入房产参数', 
      content: t.tourStep1Content || '在这里输入房屋总价、面积、首付比例、贷款利率等基本信息。系统会根据这些数据计算出详细的投资回报分析。', 
      position: 'right' 
    },
    { 
      targetId: 'market-sentiment', 
      title: '📊 市场情绪调节器', 
      content: '拖动滑块模拟不同的市场环境（乐观/悲观），系统会自动调整房产增值率、理财收益率和贷款利率，帮您在不同市场预期下做压力测试。', 
      position: 'top' 
    },
    { 
      targetId: 'result-panel', 
      title: t.tourStep2Title || '💰 核心指标仪表盘', 
      content: t.tourStep2Content || '这里展示四大核心指标：现金回报率、综合回报率、首月月供和总收益。绿色表示健康，红色需要注意！', 
      position: 'left' 
    },
    { 
      targetId: 'comparison-panel', 
      title: '⚔️ 资产大比拼', 
      content: '买房 vs 理财，哪个更划算？系统会对比两种投资方式在持有期内的净资产增长，让您一目了然。', 
      position: 'left' 
    },
    { 
      targetId: 'ai-panel', 
      title: '🤖 AI 智能分析', 
      content: '右侧面板展示还款计划图表和详细月供表。您还可以使用 AI 顾问获取个性化的购房建议！', 
      position: 'left' 
    },
    { 
      targetId: 'knowledge-tab', 
      title: '📚 知识树 & 多维分析', 
      content: '点击不同标签页探索：财富曲线、租买对比、压力测试、风险评估、人生路径模拟、机会成本分析等多个维度！', 
      position: 'top' 
    },
    { 
      targetId: 'header-title', 
      title: '🎯 决策复盘功能', 
      content: '点击右上角的"保存决策与复盘"按钮，可以保存当前分析结果。日后可以回顾对比不同房源，还能让 AI 帮你分析决策思路！', 
      position: 'bottom' 
    },
    { 
      targetId: 'header-title', 
      title: '🌍 中英文切换', 
      content: '点击顶部的 EN/ZH 按钮可以切换界面语言，方便不同语言习惯的用户使用。', 
      position: 'bottom' 
    },
    { 
      targetId: 'header-title', 
      title: '🚀 开始探索吧！', 
      content: '现在您已经了解了所有主要功能！记得：滚动页面查看更多分析模块，如"房子的内心独白"、"游戏化买房"等有趣功能。祝您购房顺利！', 
      position: 'bottom' 
    }
  ];
  
  const currentStep = steps[step];
  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1); else onComplete(); };
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  
  useEffect(() => {
    const el = document.getElementById(currentStep.targetId);
    if (el) { 
      el.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
      setTimeout(() => {
        setTargetRect(el.getBoundingClientRect());
      }, 300);
    }
  }, [step]);
  
  if (!targetRect) return null;
  
  const isMobile = window.innerWidth < 768;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  // Improved positioning logic to avoid blocking buttons
  let style: React.CSSProperties = {};
  
  if (isMobile) {
    // Mobile: always at bottom center
    style = { 
      bottom: '80px', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: '90%',
      maxWidth: '400px'
    };
  } else {
    // Desktop: smart positioning
    const tooltipWidth = 340;
    const tooltipHeight = 220;
    const padding = 20;
    
    switch (currentStep.position) {
      case 'bottom':
        style = {
          top: Math.min(targetRect.bottom + padding, windowHeight - tooltipHeight - padding),
          left: Math.max(padding, Math.min(targetRect.left, windowWidth - tooltipWidth - padding))
        };
        break;
      case 'top':
        style = {
          top: Math.max(padding, targetRect.top - tooltipHeight - padding),
          left: Math.max(padding, Math.min(targetRect.left, windowWidth - tooltipWidth - padding))
        };
        break;
      case 'right':
        style = {
          top: Math.max(padding, Math.min(targetRect.top, windowHeight - tooltipHeight - padding)),
          left: Math.min(targetRect.right + padding, windowWidth - tooltipWidth - padding)
        };
        break;
      case 'left':
        style = {
          top: Math.max(padding, Math.min(targetRect.top, windowHeight - tooltipHeight - padding)),
          left: Math.max(padding, targetRect.left - tooltipWidth - padding)
        };
        break;
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
       <div className="absolute inset-0 bg-black/60 transition-opacity" />
       <div 
         className="absolute border-4 border-indigo-500 rounded-xl transition-all duration-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] box-content pointer-events-none" 
         style={{ 
           top: targetRect.top - 5, 
           left: targetRect.left - 5, 
           width: targetRect.width + 10, 
           height: targetRect.height + 10 
         }} 
       />
       <div 
         className="absolute bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in transition-all duration-300 z-50 border border-slate-200 dark:border-slate-700" 
         style={style}
       >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
              {t.tourGuide || '引导教程'} {step + 1}/{steps.length}
            </span>
            <button onClick={onComplete} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{currentStep.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{currentStep.content}</p>
          <div className="flex justify-between items-center gap-3">
            <button 
              onClick={onComplete} 
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors"
            >
              {t.tourSkip || '跳过'}
            </button>
            <button 
              onClick={handleNext} 
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl"
            >
              {step === steps.length - 1 ? (t.tourStart || '开始使用') : (t.tourNext || '下一步')}
            </button>
          </div>
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

const CashFlowChart = ({ data, t, language = 'CN' }: { data: MonthlyCashFlow[], t: any, language?: 'CN' | 'SC' | 'EN' | 'ZH' }) => {
  const darkMode = document.documentElement.classList.contains('dark');
  const isEn = language === 'EN';
  
  // 转换数据格式 - 收入为正值，支出为负值显示
  const chartData = data.map(item => ({
    month: isEn ? `Month ${item.month}` : `${item.month}月`,
    income: item.rentalIncome,
    expense: item.mortgagePayment + item.holdingCost,
    net: item.netCashFlow
  }));

  // 计算平均值
  const avgNetCashFlow = data.reduce((sum, item) => sum + item.netCashFlow, 0) / data.length;

  // 配色方案 - 与左侧深色背景协调
  const colors = {
    income: '#34d399', // 收入 - 柔和的绿色
    expense: '#94a3b8', // 支出 - 柔和的灰蓝色
    net: '#818cf8', // 净现金流 - 紫色
    grid: darkMode ? '#334155' : '#e2e8f0',
    text: darkMode ? '#94a3b8' : '#64748b'
  };

  // 货币单位和格式化
  const formatCurrency = (val: number) => {
    const absVal = Math.abs(val).toFixed(0);
    // 英文模式显示 ¥ 前缀，中文模式显示 元 后缀
    return isEn ? `¥${absVal}` : `${absVal}元`;
  };

  return (
    <div className="space-y-3">
      {/* 平均现金流指示器 */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">{t.cashFlowProjection}</h4>
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${avgNetCashFlow >= 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400'}`}>
          {t.monthlyAverage}: {formatCurrency(avgNetCashFlow)}
        </div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} vertical={false} />
            <XAxis dataKey="month" tick={{fill: colors.text, fontSize: 8}} tickLine={false} axisLine={false} />
            <YAxis tick={{fill: colors.text, fontSize: 8}} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1e293b' : 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '8px', 
                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                fontSize: '10px',
                padding: '8px 12px',
                color: darkMode ? '#f1f5f9' : '#1e293b',
                boxShadow: darkMode ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}
              itemStyle={{ padding: '2px 0', color: darkMode ? '#f1f5f9' : '#1e293b' }}
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'income' ? (isEn ? 'Rental Income' : '租金收入') : 
                name === 'expense' ? (isEn ? 'Total Expense' : '总支出') : 
                (isEn ? 'Net Cash Flow' : '净现金流')
              ]}
            />
            
            {/* 收入柱 - 绿色 */}
            <Bar dataKey="income" fill={colors.income} radius={[3, 3, 0, 0]} name="income" />
            
            {/* 支出柱 - 灰色 */}
            <Bar dataKey="expense" fill={colors.expense} radius={[3, 3, 0, 0]} name="expense" opacity={0.6} />
            
            {/* 净现金流折线 */}
            <Line 
              type="monotone" 
              dataKey="net" 
              stroke={colors.net}
              strokeWidth={2} 
              dot={{ fill: colors.net, r: 2, strokeWidth: 0 }}
              name="net"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* 紧凑图例 */}
      <div className="flex justify-center gap-3 text-[9px] text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{background: colors.income}}></span> {isEn ? 'Rent' : '租金'}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{background: colors.expense, opacity: 0.6}}></span> {isEn ? 'Expense' : '支出'}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: colors.net}}></span> {isEn ? 'Net' : '净额'}</span>
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
                <option value="一线">{t.predTier1}</option>
                <option value="新一线">{t.predTierNew1}</option>
                <option value="二线">{t.predTier2}</option>
                <option value="三线及以下">{t.predTier3}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.district}</label>
              <select value={params.district} onChange={e => setParams({...params, district: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="核心区">{t.districtCore}</option>
                <option value="近郊">{t.districtNear}</option>
                <option value="远郊">{t.districtFar}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.propertyTypeLabel}</label>
              <select value={params.propertyType} onChange={e => setParams({...params, propertyType: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="住宅">{t.propertyResidential}</option>
                <option value="公寓">{t.propertyApartment}</option>
                <option value="别墅">{t.propertyVilla}</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.macroFactors}</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{t.policyEnv}</label>
                   <select value={params.policyEnvironment} onChange={e => setParams({...params, policyEnvironment: e.target.value as any})} className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white">
                     <option value="宽松">{t.policyLoose}</option>
                     <option value="中性">{t.policyNeutral}</option>
                     <option value="严格">{t.policyStrict}</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{t.infrastructure}</label>
                   <select value={params.infrastructurePlan} onChange={e => setParams({...params, infrastructurePlan: e.target.value as any})} className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white">
                     <option value="重大规划">{t.infraMajor}</option>
                     <option value="一般规划">{t.infraNormal}</option>
                     <option value="无规划">{t.infraNone}</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{t.populationTrend}</label>
                   <select value={params.populationTrend} onChange={e => setParams({...params, populationTrend: e.target.value as any})} className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white">
                     <option value="持续流入">{t.popInflow}</option>
                     <option value="稳定">{t.popStable}</option>
                     <option value="流出">{t.popOutflow}</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{t.industryDev}</label>
                   <select value={params.industryDevelopment} onChange={e => setParams({...params, industryDevelopment: e.target.value as any})} className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white">
                     <option value="强劲">{t.industryStrong}</option>
                     <option value="中等">{t.industryMedium}</option>
                     <option value="疲软">{t.industryWeak}</option>
                   </select>
                </div>
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

const RiskAssessmentPanel = ({ result, params, t, language = 'ZH' }: { result: CalculationResult, params: InvestmentParams, t: any, language?: 'ZH' | 'EN' }) => {
  const isEn = language === 'EN';
  const comprehensiveRisk = calculateComprehensiveRisk(params, result, t);
  
  const labels = {
    title: isEn ? 'Comprehensive Risk Assessment' : '综合风险评估',
    lowRisk: isEn ? 'Low Risk' : '低风险',
    mediumRisk: isEn ? 'Medium Risk' : '中风险',
    highRisk: isEn ? 'High Risk' : '高风险',
    riskDimensionAnalysis: isEn ? 'Risk Dimension Analysis' : '风险维度分析',
    riskScore: isEn ? 'Risk Score' : '风险评分',
    cashFlow: isEn ? 'Cash Flow' : '现金流',
    leverage: isEn ? 'Leverage' : '杠杆',
    liquidity: isEn ? 'Liquidity' : '流动性',
    market: isEn ? 'Market' : '市场',
    policy: isEn ? 'Policy' : '政策',
    holdingCost: isEn ? 'Holding Cost' : '持有成本',
    points: isEn ? 'pts' : '分',
    low: isEn ? 'Low' : '低',
    medium: isEn ? 'Med' : '中',
    high: isEn ? 'High' : '高',
    suggestions: isEn ? 'Suggestions:' : '改善建议:',
    keyMetrics: isEn ? 'Key Metrics' : '关键指标',
    dtiRatio: isEn ? 'DTI Ratio' : '月供收入比',
    ltvRatio: isEn ? 'LTV Ratio' : '贷款比例',
    monthlyPayment: isEn ? 'Monthly Payment' : '月供金额',
    totalDebt: isEn ? 'Total Debt' : '总债务',
    // Dimension names for getRiskIcon
    cashFlowPressure: isEn ? 'Cash Flow Pressure' : '现金流压力',
    leverageRisk: isEn ? 'Leverage Risk' : '杠杆风险',
    liquidityRisk: isEn ? 'Liquidity Risk' : '流动性风险',
    marketRisk: isEn ? 'Market Risk' : '市场风险',
    policyRisk: isEn ? 'Policy Risk' : '政策风险',
    holdingCostRisk: isEn ? 'Holding Cost Risk' : '持有成本风险',
  };

  // Prepare radar chart data with i18n labels
  const radarData = [
    { dimension: labels.cashFlow, value: comprehensiveRisk.dimensions.cashFlow.score, fullMark: 100 },
    { dimension: labels.leverage, value: comprehensiveRisk.dimensions.leverage.score, fullMark: 100 },
    { dimension: labels.liquidity, value: comprehensiveRisk.dimensions.liquidity.score, fullMark: 100 },
    { dimension: labels.market, value: comprehensiveRisk.dimensions.market.score, fullMark: 100 },
    { dimension: labels.policy, value: comprehensiveRisk.dimensions.policy.score, fullMark: 100 },
    { dimension: labels.holdingCost, value: comprehensiveRisk.dimensions.holdingCost.score, fullMark: 100 }
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
      '持有成本风险': Home,
      'Cash Flow Pressure': DollarSign,
      'Leverage Risk': TrendingUp,
      'Liquidity Risk': Droplets,
      'Market Risk': BarChart3,
      'Policy Risk': FileText,
      'Holding Cost Risk': Home
    };
    return icons[name] || AlertTriangle;
  };

  const getRiskLevelLabel = (level: string) => {
    return level === 'low' ? labels.lowRisk : level === 'medium' ? labels.mediumRisk : labels.highRisk;
  };

  const getShortLevelLabel = (level: string) => {
    return level === 'low' ? labels.low : level === 'medium' ? labels.medium : labels.high;
  };

  // Translate dimension names from calculateComprehensiveRisk (which returns Chinese)
  const translateDimensionName = (name: string) => {
    if (!isEn) return name;
    const translations: Record<string, string> = {
      '现金流压力': 'Cash Flow Pressure',
      '杠杆风险': 'Leverage Risk',
      '流动性风险': 'Liquidity Risk',
      '市场风险': 'Market Risk',
      '政策风险': 'Policy Risk',
      '持有成本风险': 'Holding Cost Risk'
    };
    return translations[name] || name;
  };

  // Generate English explanations based on data
  const getExplanation = (dimension: any, key: string) => {
    if (!isEn) return dimension.explanation;
    const dtiRatio = (result.monthlyPayment / (params.familyMonthlyIncome || 30000)) * 100;
    const ltvRatio = 100 - params.downPaymentRatio;
    const appreciationRate = params.appreciationRate || 3;
    const interestRate = params.interestRate;
    const holdingCostRatio = params.holdingCostRatio || 0.5;
    const vacancyRate = params.vacancyRate || 5;

    switch(key) {
      case 'cashFlow':
        return dtiRatio < 30 
          ? `DTI ratio ${dtiRatio.toFixed(1)}%, low pressure, healthy finances.`
          : dtiRatio < 50
          ? `DTI ratio ${dtiRatio.toFixed(1)}%, moderate pressure, maintain stable income.`
          : `DTI ratio ${dtiRatio.toFixed(1)}%, high pressure, may affect quality of life.`;
      case 'leverage':
        return ltvRatio < 60
          ? `LTV ${ltvRatio.toFixed(1)}%, moderate leverage, strong risk resistance.`
          : ltvRatio < 80
          ? `LTV ${ltvRatio.toFixed(1)}%, high leverage, monitor price fluctuations.`
          : `LTV ${ltvRatio.toFixed(1)}%, very high leverage, significant risk if prices drop.`;
      case 'liquidity':
        return dimension.level === 'low'
          ? `Emergency reserves adequate, low liquidity risk.`
          : dimension.level === 'medium'
          ? `Emergency reserves moderate, recommend increasing cash reserves.`
          : `Emergency reserves insufficient, high liquidity risk, may need to sell assets in emergency.`;
      case 'market':
        return appreciationRate < 0
          ? `Expected price decline of ${Math.abs(appreciationRate)}%/year, extremely high market risk.`
          : appreciationRate < 3
          ? `Expected appreciation ${appreciationRate}%/year, below inflation, higher market risk.`
          : appreciationRate < 5
          ? `Expected appreciation ${appreciationRate}%/year, stable market performance.`
          : `Expected appreciation ${appreciationRate}%/year, good market outlook.`;
      case 'policy':
        return interestRate > 5
          ? `Current rate ${interestRate}%, on the high side, policy adjustment risk.`
          : interestRate > 4
          ? `Current rate ${interestRate}%, moderate level, monitor policy changes.`
          : `Current rate ${interestRate}%, low rate, favorable policy environment.`;
      case 'holdingCost':
        return `Holding cost ${holdingCostRatio}%, vacancy ${vacancyRate}%, ${dimension.level === 'low' ? 'good cost control' : dimension.level === 'medium' ? 'watch costs' : 'high cost pressure'}.`;
      default:
        return dimension.explanation;
    }
  };

  // Simple English suggestions based on level
  const getSuggestions = (dimension: any, key: string) => {
    if (!isEn) return dimension.suggestions;
    if (dimension.level === 'low') return ['Current situation is healthy', 'Consider long-term investment strategies'];
    if (dimension.level === 'medium') return ['Monitor closely', 'Build emergency reserves', 'Maintain flexibility'];
    return ['Reduce leverage', 'Increase stable assets', 'Consider refinancing options', 'Avoid aggressive assumptions'];
  };

  // Helper to get dimension key from name
  const getDimensionKey = (name: string): string => {
    const keyMap: Record<string, string> = {
      '现金流压力': 'cashFlow',
      '杠杆风险': 'leverage',
      '流动性风险': 'liquidity',
      '市场风险': 'market',
      '政策风险': 'policy',
      '持有成本风险': 'holdingCost'
    };
    return keyMap[name] || 'cashFlow';
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-500"/>
            {labels.title}
          </h2>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            comprehensiveRisk.overallLevel === 'low' 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : comprehensiveRisk.overallLevel === 'medium'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
          }`}>
            {getRiskLevelLabel(comprehensiveRisk.overallLevel)}
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
          {labels.riskDimensionAnalysis}
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name={labels.riskScore} dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
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
          const dimKey = getDimensionKey(dimension.name);
          const translatedName = translateDimensionName(dimension.name);
          const translatedExplanation = getExplanation(dimension, dimKey);
          const translatedSuggestions = getSuggestions(dimension, dimKey);
          
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/20`}>
                    <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{translatedName}</h4>
                    <span className={`text-xs font-medium text-${color}-600 dark:text-${color}-400`}>
                      {dimension.score.toFixed(0)}{labels.points}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400`}>
                  {getShortLevelLabel(dimension.level)}
                </span>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {translatedExplanation}
              </p>
              
              {translatedSuggestions.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    {labels.suggestions}
                  </div>
                  <ul className="space-y-1">
                    {translatedSuggestions.slice(0, 2).map((suggestion: string, i: number) => (
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
          {labels.keyMetrics}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{labels.dtiRatio}</div>
            <div className={`text-lg font-bold ${result.dtiRatio > 0.5 ? 'text-rose-500' : result.dtiRatio > 0.3 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {(result.dtiRatio * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{labels.ltvRatio}</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
              {(100 - params.downPaymentRatio).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{labels.monthlyPayment}</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
              ¥{result.monthlyPayment.toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{labels.totalDebt}</div>
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
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeMode) || 'light';
  });
  const [showDonation, setShowDonation] = useState(false);
  const [showWeChat, setShowWeChat] = useState(false);
  const [chartGranularity, setChartGranularity] = useState<'month' | 'year'>('year'); 
  const [showSettings, setShowSettings] = useState(false); 
  const [showMethodology, setShowMethodology] = useState(false);
  const [removeInflation, setRemoveInflation] = useState(false); 
  const [showFeedback, setShowFeedback] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  
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
  
  // Authentication State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Collapsible sections state
  const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true);
  const [aiConfig, setAIConfig] = useState(loadAIConfig());
  const [tempApiKey, setTempApiKey] = useState(""); 

  const [params, setParams] = useState<InvestmentParams>({
    totalPrice: 300,
    propertyArea: 90,
    unitPrice: 33333,
    communityName: "",
    district: "",
    floorLevel: "中楼层",
    propertyType: "普通住宅",
    buildingAge: 5,
    decorationStatus: "精装",
    propertyRightYears: 70,
    downPaymentRatio: 30,
    holdingYears: 10,
    loanType: LoanType.COMMERCIAL,
    loanTerm: 30,
    interestRate: 4.1, 
    providentInterestRate: 2.85,
    providentQuota: 100,
    deedTaxRate: 1.5, 
    agencyFeeRatio: 2.0, 
    educationBudget: 0, // 教育预算（万元）
    renovationCost: 20, 
    enablePrepayment: false,
    prepaymentYear: 3,
    prepaymentAmount: 50,
    prepaymentStrategy: PrepaymentStrategy.REDUCE_PAYMENT,
    monthlyRent: 5000,
    holdingCostRatio: 1.0, 
    propertyMaintenanceCost: 0.2,
    appreciationRate: 4,
    rentAppreciationRate: 3, // 租金年涨幅（%）
    vacancyRate: 5, 
    emergencyFund: 20,
    familyMonthlyIncome: 30000,
    method: RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST,
    alternativeReturnRate: 4.0, 
    inflationRate: 2.5, 
    rateAdjustmentPeriod: 1,
    expectedRateChange: 0,
    existingPropertyCount: 0,
    existingMonthlyDebt: 0,
    monthlyIncome: 30000, // 默认月收入3万
    purchaseScenario: PurchaseScenario.FIRST_HOME
  });


  const [activeTab, setActiveTab] = useState<'chart' | 'table' | 'rentVsBuy' | 'stress' | 'risk' | 'affordability' | 'lifePath' | 'goal' | 'token' | 'knowledge' | 'opportunity' | 'journal' | 'negotiation' | 'liquidity' | 'life_drag' | 'community_data' | 'income_threshold' | 'car_analysis' | 'asset_allocation' | 'sell_decision' | 'autopsy' | 'freedom' | 'leverage' | 'naval' | 'life_os' | 'repayment_detail'>('chart');
  const [rentMentalCost, setRentMentalCost] = useState(0);
  const [showKnowledgeTree, setShowKnowledgeTree] = useState(false);
  const [selectedKnowledgeTerm, setSelectedKnowledgeTerm] = useState<string | undefined>();
  
  // Decision Journal State
  const [decisionSnapshots, setDecisionSnapshots] = useState<DecisionSnapshot[]>([]);
  const [isAnalyzingSnapshot, setIsAnalyzingSnapshot] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Buy Decision State (Lifted Up)
  const [buyTargetParams, setBuyTargetParams] = useState<BuyTargetParams>({
    totalPrice: 300, // 万
    planYears: 5,
    downPaymentRatio: 30, // %
    currentSavings: 50, // 万
    monthlyIncome: 30000, // 元
    monthlyExpense: 10000,
    parentalSupport: 0,
    anxietyScore: 70,
    fomoScore: 65,
    marketHeat: 80,
    financialStretch: 60,
    decisionSpeed: 90
  });

  const handleBuyParamChange = (newParams: BuyTargetParams) => {
    setBuyTargetParams(newParams);
  };

  // Calculate results
  const result = useMemo(() => {
    const baseResult = calculateInvestment(params, t);
    // Add mental cost to rent scenario total cost
    // Note: This is a simplified addition. Ideally, it should be year-by-year in the calculation logic.
    // For now, we'll add it to the final total cost of renting for display purposes.
    // Or better, we can inject it into the monthly cash flow if we modify the calculation function.
    // Since we can't easily modify calculate.ts right now without a big refactor, let's just add it to the result object here if possible,
    // or just display it. 
    // Wait, the user wants it to be "included in the total expenditure of the investment path for comparison".
    // "Investment Path" usually refers to Buy. "Rent Path" is the comparison.
    // The request says: "Rent Hidden Cost" should be added to the RENT path's cost, making Renting MORE expensive, thus making Buying look relatively better (or closer).
    // Let's add it to the Rent Total Cost.
    
    if (rentMentalCost > 0) {
        const years = params.holdingYears;
        const totalMentalCost = rentMentalCost * years * 12 / 10000; // Convert monthly mental cost to total over holding years in 'wan'
        
        // Adjust Stock Net Worth (Rent Scenario) by subtracting the mental cost
        baseResult.assetComparison.stockNetWorth -= totalMentalCost;
        baseResult.assetComparison.difference = baseResult.assetComparison.houseNetWorth - baseResult.assetComparison.stockNetWorth;
        baseResult.assetComparison.winner = baseResult.assetComparison.houseNetWorth > baseResult.assetComparison.stockNetWorth ? 'House' : 'Stock';
        
        // Update text if needed (simplified)
        if (baseResult.assetComparison.winner === 'House') {
             baseResult.assetComparison.housePros[0] = t.netWorthMore.replace('{amount}', baseResult.assetComparison.difference.toFixed(1));
        } else {
             baseResult.assetComparison.stockPros[0] = t.netWorthMore.replace('{amount}', (-baseResult.assetComparison.difference).toFixed(1));
        }
    }
    return baseResult;
  }, [params, rentMentalCost, t]);
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


  // const [activeTab, setActiveTab] = useState('chart'); // For the new tabbed panel

  // --- Effects ---
  useEffect(() => {
    const savedKey = localStorage.getItem('user_gemini_api_key');
    if (savedKey) { setCustomApiKey(savedKey); setTempApiKey(savedKey); }
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) setShowTour(true);
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Keep dark class for backward compatibility
    document.documentElement.classList.toggle('dark', theme === 'dark' || theme === 'deepblack' || theme === 'gaming');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Listen for authentication state changes and auto-prompt login
  const isAuthInitialized = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      
      // Auto-prompt login on first load if not authenticated
      if (!isAuthInitialized.current) {
        if (!user) {
          setShowAuthModal(true);
        }
        isAuthInitialized.current = true;
      }

      // Cache username for "Welcome back" message
      if (user) {
        const nameToCache = user.displayName || user.email?.split('@')[0];
        if (nameToCache) {
          localStorage.setItem('last_username', nameToCache);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  
  const darkMode = theme !== 'light'; // For backward compatibility with existing code



  // --- Handlers ---
  const handleInputChange = (field: keyof InvestmentParams, value: number | string | boolean) => {
    setParams(prev => {
      const newParams = {
        ...prev,
        [field]: typeof value === 'string' && !['method', 'prepaymentStrategy', 'loanType', 'purchaseScenario', 'communityName', 'district', 'floorLevel', 'propertyType', 'decorationStatus', 'investmentType'].includes(field) ? Number(value) : value
      };
      
      // Auto-calculate unitPrice when totalPrice or propertyArea changes
      if (field === 'totalPrice' || field === 'propertyArea') {
        const totalPrice = field === 'totalPrice' ? Number(value) : prev.totalPrice;
        const area = field === 'propertyArea' ? Number(value) : prev.propertyArea;
        if (area > 0) {
          newParams.unitPrice = Math.round((totalPrice * 10000) / area);
        }
      }
      
      // Auto-adjust alternativeReturnRate when investmentType changes
      if (field === 'investmentType') {
        const typeRanges: Record<string, { min: number; default: number }> = {
          'conservative': { min: 2, default: 3 },
          'balanced': { min: 5, default: 6 },
          'growth': { min: 8, default: 10 },
          'aggressive': { min: 12, default: 15 },
          'custom': { min: 0, default: prev.alternativeReturnRate }
        };
        const range = typeRanges[value as string] || typeRanges['custom'];
        // Set to default value for the selected type
        newParams.alternativeReturnRate = range.default;
      }
      
      return newParams;
    });
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
  
  // Decision Journal Handlers
  // Load preset template
  const loadPreset = (presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) return;
    
    // Apply preset params to state
    setParams(prev => ({
      ...prev,
      ...preset.params
    }));
    
    setShowPresetMenu(false);
    
    // Show toast notification
    const presetName = language === 'ZH' ? preset.name : preset.nameEn;
    alert(t.presets?.presetLoaded.replace('{name}', presetName) || `Loaded: ${presetName}`);
  };

  const handleSaveSnapshot = () => {
    const newSnapshot: DecisionSnapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      params: { ...params },
      marketSentiment: 50, // Should grab from actual state if available, for now default or from params logic if refactored
      userNotes: '',
      rejectedOptions: '',
      riskAssessment: '',
    };
    setDecisionSnapshots([newSnapshot, ...decisionSnapshots]);
    setActiveTab('journal');
    // Optional: Show toast
  };

  const handleUpdateSnapshot = (id: string, updates: Partial<DecisionSnapshot>) => {
    setDecisionSnapshots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteSnapshot = (id: string) => {
    setDecisionSnapshots(prev => prev.filter(s => s.id !== id));
  };

  const handleRestoreSnapshot = (savedParams: InvestmentParams) => {
    setParams(savedParams);
    setActiveTab('chart'); // Go back to chart to see results
  };

  const handleAnalyzeSnapshot = async (snapshot: DecisionSnapshot) => {
    if (!aiConfig.apiKey && !customApiKey) {
      alert("请先配置 AI API Key");
      setShowSettings(true);
      return;
    }
    
    setIsAnalyzingSnapshot(true);
    try {
      const prompt = `
        作为专业的购房投资顾问，请分析以下用户的决策：
        
        【决策参数】:
        - 房产总价: ${snapshot.params.totalPrice}万
        - 首付: ${snapshot.params.downPaymentRatio}%
        - 贷款利率: ${snapshot.params.interestRate}% (商贷) / ${snapshot.params.providentInterestRate}% (公积金)
        
        【用户理由】: ${snapshot.userNotes}
        
        【放弃的选项】: ${snapshot.rejectedOptions}
        
        请点评：
        1. 用户的决策理由是否理智？有没有明显的心理偏差（如FOMO、由于沉没成本等）？
        2. 放弃的选项中，是否有其实更好的可能性被忽略了？
        3. 基于当前参数，给出一个客观的风险提示。
        
        请用Markdown格式输出，保持客观犀利。
      `;
      
      // const response = await sendAIMessage(prompt, [], aiConfig); // OLD INCORRECT
      const response = await sendAIMessage(aiConfig, [{ role: 'user', content: prompt }]);
      
      handleUpdateSnapshot(snapshot.id, { aiFeedback: response, riskAssessment: 'AI Analyzed' });
    } catch (error) {
      console.error(error);
      alert("AI分析失败，请稍后重试");
    } finally {
      setIsAnalyzingSnapshot(false);
    }
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
            <img src="/logo.png" alt="WealthCompass" className="h-10 w-10 object-contain hover:scale-110 transition-transform" />
            <div>
              <h1 className="text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>
                {t.appTitle} <span className="text-[10px] tracking-normal bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-md ml-1 align-top font-sans font-bold">{t.pro}</span>
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
            
            {/* Preset Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPresetMenu(!showPresetMenu)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors border border-indigo-100 dark:border-indigo-900/30"
              >
                <Zap className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.headerPreset || '快速预设'}</span>
              </button>
              
              {showPresetMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => loadPreset(preset.id)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{preset.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {language === 'ZH' ? preset.name : preset.nameEn}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {language === 'ZH' ? preset.description : preset.descriptionEn}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={() => setShowSettings(true)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 relative" title={`AI: ${getProviderName(aiConfig.provider)}`}><Settings className="h-5 w-5" />{aiConfig.apiKey && <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900"></span>}</button>
            
            {/* Theme Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
              >
                {theme === 'light' && <Sun className="h-5 w-5" />}
                {theme === 'dark' && <Moon className="h-5 w-5" />}
                {theme === 'professional' && <span className="text-lg">💼</span>}
                {theme === 'gaming' && <span className="text-lg">🎮</span>}
                {theme === 'deepblack' && <span className="text-lg">⚫</span>}
              </button>
              
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  {[
                    { id: 'light' as ThemeMode, icon: '☀️', label: t.themes?.light || '浅色' },
                    { id: 'dark' as ThemeMode, icon: '🌙', label: t.themes?.dark || '深色' },
                    { id: 'deepblack' as ThemeMode, icon: '⚫', label: t.themes?.deepblack || '深黑色' }
                  ].map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => {
                        setTheme(themeOption.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        theme === themeOption.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-lg">{themeOption.icon}</span>
                      <span className="text-sm font-medium">{themeOption.label}</span>
                      {theme === themeOption.id && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Authentication UI */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                {user.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="h-8 w-8 rounded-full border-2 border-indigo-200 dark:border-indigo-800"
                  />
                )}
                <div className="hidden md:block">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {user.displayName || user.email}
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="登出"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">登出</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors border border-indigo-100 dark:border-indigo-900/30"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.headerLogin || '登录'}</span>
              </button>
            )}
            
            <button 
              onClick={handleSaveSnapshot}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-100 dark:border-emerald-900/30"
            >
              <History className="h-3.5 w-3.5" /> {t.headerSave || '保存决策与复盘'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Expanded width to 1600px */}
      <main id="main-report" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* WealthCompass Branding Header */}
        {/* WealthCompass Branding Header */}
        <div className="text-center mb-12 mt-4 relative z-10">
          <style>
            {`
              @keyframes liquid-flow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .liquid-block-text {
                background-image: 
                  repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 6px),
                  linear-gradient(90deg, #4f46e5, #9333ea, #db2777, #f59e0b, #4f46e5);
                background-size: 200% auto;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: liquid-flow 6s linear infinite;
              }
            `}
          </style>
          <h1 className="liquid-block-text text-4xl md:text-8xl font-black mb-4 tracking-tighter relative z-10 select-none drop-shadow-2xl" 
              style={{ 
                WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4))'
              }}>
            WealthCompass
          </h1>
          <div className="flex items-center justify-center gap-4 opacity-90">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-indigo-500 to-purple-500 rounded-full opacity-50"></div>
            <p className="liquid-block-text text-lg md:text-2xl font-bold tracking-[0.2em] uppercase" 
               style={{ 
                 WebkitTextStroke: '0.5px rgba(255,255,255,0.15)',
                 filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))'
               }}>
              财富罗盘终极决策系统
            </p>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent via-indigo-500 to-purple-500 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* 1. INPUT DASHBOARD */}
        <section id="input-panel" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800/50 relative overflow-hidden transition-all duration-300">
           {/* ... (Existing inputs, logic preserved but now in wider container) */}
            {/* Investment Wisdom Card */}
            <InvestmentWisdomCard language={language} />

           <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white font-bold text-lg relative z-10"><List className="h-5 w-5 text-indigo-500" /> {t.inputPanelTitle}</div>
           
           {/* Market Sentiment Slider */}
           <div className="relative z-10 mb-6">
             <MarketSentimentSlider params={params} onChange={(updates) => setParams({...params, ...updates})} result={result} t={t} />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 relative z-10">
                {/* Column 1 - Enhanced Basic Info */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.baseInfo}</h3>
                        <button 
                            onClick={() => setIsBasicInfoExpanded(!isBasicInfoExpanded)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                            {isBasicInfoExpanded ? (language === 'EN' ? 'Collapse' : '收起') : (language === 'EN' ? 'Expand' : '展开')}
                            <ChevronDown className={`h-3 w-3 transition-transform ${isBasicInfoExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    
                    {isBasicInfoExpanded && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Community & District */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.communityName}</label>
                                    <input 
                                        type="text"
                                        value={params.communityName}
                                        onChange={(e) => handleInputChange('communityName', e.target.value)}
                                        placeholder={language === 'EN' ? 'Enter community name' : '请输入小区名称'}
                                        className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.district}</label>
                                    <input 
                                        type="text"
                                        value={params.district}
                                        onChange={(e) => handleInputChange('district', e.target.value)}
                                        placeholder={language === 'EN' ? 'Enter district' : '请输入所在区域'}
                                        className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                                    />
                                </div>
                            </div>
                            
                            {/* Area & Unit Price & Total Price */}
                            <div className="grid grid-cols-3 gap-2">
                                <InputGroup label={t.propertyArea} value={params.propertyArea} onChange={v => handleInputChange('propertyArea', v)} tooltip={t.tipPropertyArea} />
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.unitPrice}</label>
                                        <KnowledgeTooltip term={t.tipUnitPrice} />
                                    </div>
                                    <input 
                                        type="text"
                                        value={params.unitPrice.toLocaleString()}
                                        readOnly
                                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                                <InputGroup label={t.totalPrice} value={params.totalPrice} onChange={v => handleInputChange('totalPrice', v)} tooltip={t.tipTotalPrice} />
                            </div>
                            
                            {/* Property Type & Floor & Building Age */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.propertyType}</label>
                                        <KnowledgeTooltip term={t.tipPropertyType} />
                                    </div>
                                    <select 
                                        value={params.propertyType}
                                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                                        className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                                    >
                                        <option value="普通住宅">{language === 'EN' ? 'Residential' : '普通住宅'}</option>
                                        <option value="公寓">{language === 'EN' ? 'Apartment' : '公寓'}</option>
                                        <option value="别墅">{language === 'EN' ? 'Villa' : '别墅'}</option>
                                        <option value="loft">loft</option>
                                        <option value="其他">{language === 'EN' ? 'Other' : '其他'}</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.floorLevel}</label>
                                        <KnowledgeTooltip term={t.tipFloorLevel} />
                                    </div>
                                    <select 
                                        value={params.floorLevel}
                                        onChange={(e) => handleInputChange('floorLevel', e.target.value)}
                                        className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                                    >
                                        <option value="低楼层">{language === 'EN' ? 'Low (1-5F)' : '低楼层 (1-5层)'}</option>
                                        <option value="中楼层">{language === 'EN' ? 'Mid (6-15F)' : '中楼层 (6-15层)'}</option>
                                        <option value="高楼层">{language === 'EN' ? 'High (16F+)' : '高楼层 (16层以上)'}</option>
                                    </select>
                                </div>
                                <InputGroup label={t.buildingAge} value={params.buildingAge} onChange={v => handleInputChange('buildingAge', v)} tooltip={t.tipBuildingAge} />
                            </div>
                            
                            {/* Decoration & Property Rights & Down Payment */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.decorationStatus}</label>
                                        <KnowledgeTooltip term={t.tipDecorationStatus} />
                                    </div>
                                    <select 
                                        value={params.decorationStatus}
                                        onChange={(e) => handleInputChange('decorationStatus', e.target.value)}
                                        className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                                    >
                                        <option value="毛坯">{language === 'EN' ? 'Bare' : '毛坯'}</option>
                                        <option value="简装">{language === 'EN' ? 'Basic' : '简装'}</option>
                                        <option value="精装">{language === 'EN' ? 'Furnished' : '精装'}</option>
                                        <option value="豪装">{language === 'EN' ? 'Luxury' : '豪装'}</option>
                                    </select>
                                </div>
                                <InputGroup label={t.propertyRightYears} value={params.propertyRightYears} onChange={v => handleInputChange('propertyRightYears', v)} tooltip={t.tipPropertyRightYears} />
                                <InputGroup label={t.downPaymentRatio} value={params.downPaymentRatio} onChange={v => handleInputChange('downPaymentRatio', v)} subtext={`${t.netDownPayment}: ${(result?.downPayment || 0).toFixed(2)}${t.unitWanSimple}`} tooltip={t.tipDownPayment} />
                            </div>
                            
                            {/* One-time Costs */}
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
                    )}
                </div>
                {/* Column 2 - Enhanced Loan Scheme */}
                <div className="space-y-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.loanScheme}</h3>
                    <div className="space-y-4">
                        {/* Loan Type Selector */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.loanType}</label>
                            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
                                <button 
                                    onClick={() => handleInputChange('loanType', LoanType.COMMERCIAL)} 
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.COMMERCIAL ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                                >
                                    {t.commercial}
                                </button>
                                <button 
                                    onClick={() => handleInputChange('loanType', LoanType.PROVIDENT)} 
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.PROVIDENT ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                                >
                                    {t.provident}
                                </button>
                                <button 
                                    onClick={() => handleInputChange('loanType', LoanType.COMBINATION)} 
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.COMBINATION ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                                >
                                    {t.combination}
                                </button>
                            </div>
                        </div>
                        
                        {/* Interest Rates */}
                        {(params.loanType === LoanType.COMMERCIAL || params.loanType === LoanType.COMBINATION) && (
                            <InputGroup label={t.commercialRate} value={params.interestRate} onChange={v => handleInputChange('interestRate', v)} step={0.01} tooltip={t.tipInterestRate} />
                        )}
                        {(params.loanType === LoanType.PROVIDENT || params.loanType === LoanType.COMBINATION) && (
                            <div className="animate-fade-in space-y-4">
                                <InputGroup label={t.providentRate} value={params.providentInterestRate} onChange={v => handleInputChange('providentInterestRate', v)} step={0.01} tooltip={t.tipProvidentRate} />
                                {params.loanType === LoanType.COMBINATION && (
                                    <InputGroup label={t.providentQuota} value={params.providentQuota} onChange={v => handleInputChange('providentQuota', v)} tooltip={t.tipProvidentQuota} />
                                )}
                            </div>
                        )}
                        
                        {/* Loan Term */}
                        <InputGroup label={t.loanTerm} value={params.loanTerm} onChange={v => handleInputChange('loanTerm', v)} tooltip={t.tipLoanTerm} />
                        
                        {/* Repayment Method */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.repaymentMethod}</label>
                                <KnowledgeTooltip term={t.tipRepaymentMethod} />
                            </div>
                            <select 
                                value={params.method}
                                onChange={(e) => handleInputChange('method', e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                            >
                                <option value={RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST}>{t.equalPrincipalAndInterest}</option>
                                <option value={RepaymentMethod.EQUAL_PRINCIPAL}>{t.equalPrincipal}</option>
                            </select>
                        </div>
                        
                        {/* Rate Adjustment */}
                        <div className="grid grid-cols-2 gap-2">
                            <InputGroup 
                                label={t.rateAdjustmentPeriod} 
                                value={params.rateAdjustmentPeriod} 
                                onChange={v => handleInputChange('rateAdjustmentPeriod', v)} 
                                tooltip={t.tipRateAdjustment} 
                            />
                            <InputGroup 
                                label={t.expectedRateChange} 
                                value={params.expectedRateChange} 
                                onChange={v => handleInputChange('expectedRateChange', v)} 
                                step={0.1}
                                tooltip={t.tipExpectedRateChange} 
                            />
                        </div>
                        
                        {/* LTV Display */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.ltvRatio}</span>
                                    <KnowledgeTooltip term={t.tipLTV} />
                                </div>
                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                    {(100 - params.downPaymentRatio).toFixed(1)}%
                                </span>
                            </div>
                        </div>
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
                        
                        {/* Investment Type Selector */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{language === 'EN' ? 'Investment Type' : '投资类型'}</label>
                                <KnowledgeTooltip term={language === 'EN' ? 'Choose your investment strategy to adjust return rate range' : '选择投资策略，自动调整收益率区间'} />
                            </div>
                            <select 
                                value={params.investmentType ?? 'balanced'}
                                onChange={(e) => handleInputChange('investmentType', e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                            >
                                <option value="conservative">{language === 'EN' ? '🏦 Conservative (≤4%)' : '🏦 保守型 (≤4%)'}</option>
                                <option value="balanced">{language === 'EN' ? '📊 Balanced (5-8%)' : '📊 稳健型 (5-8%)'}</option>
                                <option value="growth">{language === 'EN' ? '📈 Growth (8-12%)' : '📈 成长型 (8-12%)'}</option>
                                <option value="aggressive">{language === 'EN' ? '🚀 Aggressive (12-20%)' : '🚀 进取型 (12-20%)'}</option>
                                <option value="custom">{language === 'EN' ? '⚙️ Custom (Manual)' : '⚙️ 自定义 (手动)'}</option>
                            </select>
                        </div>
                        
                        <InputGroup label={t.alternativeReturn} value={params.alternativeReturnRate} onChange={v => handleInputChange('alternativeReturnRate', v)} step={0.1} tooltip={language === 'EN' ? 'Affects: Asset Comparison Chart, Wealth Curve, Opportunity Cost Panel' : '影响：资产对比图表、财富曲线、机会成本面板'} />
                        
                        <InputGroup label={t.inflationRate} value={params.inflationRate} onChange={v => handleInputChange('inflationRate', v)} step={0.1} tooltip={language === 'EN' ? 'Affects: Real Wealth Curve (after inflation), Asset Comparison' : '影响：实际财富曲线（扣除通胀）、资产对比'} />
                        
                        {/* Tax Rate on Investment Returns */}
                        <InputGroup 
                            label={language === 'EN' ? 'Investment Tax Rate (%)' : '投资收益税率 (%)'} 
                            value={params.investmentTaxRate || 0} 
                            onChange={v => handleInputChange('investmentTaxRate', v)} 
                            step={0.1} 
                            tooltip={language === 'EN' ? 'Affects: Stock Net Worth in Asset Comparison (reduces investment returns)' : '影响：资产对比中的股票净值（减少投资收益）'} 
                        />
                   </div>
               </div>
               {/* Column 4 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.revenueAndRisk}</h3>
                   <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-2"><InputGroup label={t.holdingYears} value={params.holdingYears} onChange={v => handleInputChange('holdingYears', v)} tooltip={t.tipHoldingYears} /><InputGroup label={t.monthlyRent} value={params.monthlyRent} onChange={v => handleInputChange('monthlyRent', v)} tooltip={t.tipMonthlyRent} /></div>
                       <div className="grid grid-cols-2 gap-2"><InputGroup label={language === 'EN' ? 'Rent Appreciation (%)' : '租金年涨幅(%)'} value={params.rentAppreciationRate || 0} onChange={v => handleInputChange('rentAppreciationRate', v)} tooltip={language === 'EN' ? 'Expected annual rent increase percentage' : '预计每年租金上涨的百分比'} /></div>
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
        <div className="flex flex-col gap-8">
          
          {/* Main Content Area */}
          <div className="w-full space-y-8" id="result-panel">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <MetricCard label={t.metricCashOnCash} value={`${result.cashOnCashReturn.toFixed(2)}%`} sub={t.subActualInvest} color="indigo" tooltip={t.tipCashOnCash} />
               <MetricCard label={t.metricComprehensive} value={`${result.comprehensiveReturn.toFixed(2)}%`} sub={t.subIncAppreciation} color="violet" tooltip={t.tipComprehensive} />
               <MetricCard label={t.metricFirstPayment} value={`${t.currencySymbol}${result.monthlyPaymentText}`} sub={`${t.subCoverage}: ${result.monthlyCoverageRatio.toFixed(2)}`} color="slate" tooltip={t.tipFirstPayment} />
               <MetricCard label={t.metricTotalRevenue} value={`${result.totalRevenue.toFixed(1)}${t.unitWanSimple}`} sub={result.breakEvenYear ? t.subBreakEven.replace('{year}', result.breakEvenYear) : t.subNotBreakEven} color="emerald" tooltip={t.tipTotalRevenue} />
            </div>

            {/* Asset Comparison & Cost */}
            {/* Unified Asset Comparison & Initial Cost Panel */}
            <div id="comparison-panel" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800/50">
               {/* Section Header */}
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg"><TrendingUp className="h-5 w-5 text-indigo-500" /> {t.assetComparison}</div>
                  <div className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{t.netWorthAtYear.replace('{year}', params.holdingYears.toString())}</div>
               </div>
               
               {/* Main Grid: Comparison (2/3) + Cost Pie (1/3) */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Comparison Cards & Table */}
                  <div className="lg:col-span-2">
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
                     
                     {/* Qualitative Table */}
                     <AssetComparisonTable data={result.assetComparison.qualitative} t={t} />
                  </div>
                  
                  {/* Right: Initial Cost Pie Chart - Clean Premium Design */}
                  <div className="lg:col-span-1 flex flex-col">
                     <h3 className="text-sm font-bold flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-3">
                       <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                         <PieChartIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                       </div>
                       {t.chartInitialCost}
                     </h3>
                     
                     {/* Large Elegant Donut Chart */}
                     <div className="flex-1 min-h-[250px] flex flex-col items-center justify-center mb-2">
                       <div className="w-full h-[200px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie 
                               data={initialCostData} 
                               cx="50%" 
                               cy="50%" 
                               innerRadius={50} 
                               outerRadius={95} 
                               paddingAngle={2} 
                               dataKey="value" 
                               stroke={document.documentElement.classList.contains('dark') ? "#0f172a" : "#fff"} 
                               strokeWidth={3}
                               animationBegin={0}
                               animationDuration={800}
                             >
                               {initialCostData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} stroke={document.documentElement.classList.contains('dark') ? "#0f172a" : "#fff"} />
                               ))}
                             </Pie>
                             <Tooltip 
                               formatter={(v: number, name: string) => {
                                 const total = initialCostData.reduce((sum, item) => sum + item.value, 0);
                                 const percent = ((v / total) * 100).toFixed(1);
                                 return [`${v.toFixed(1)}万 (${percent}%)`, name];
                               }}
                               contentStyle={{
                                 background: document.documentElement.classList.contains('dark') ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                                 border: document.documentElement.classList.contains('dark') ? '1px solid #334155' : '1px solid #e2e8f0', 
                                 borderRadius: '8px', 
                                 fontSize: '12px', 
                                 color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#1e293b',
                                 padding: '8px 12px',
                                 boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                               }}
                               itemStyle={{ color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#1e293b' }}
                             />
                           </PieChart>
                         </ResponsiveContainer>
                       </div>
                       
                       {/* Total Label moved below with spacing */}
                       <div className="flex flex-col items-center justify-center mt-2">
                         <div className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{result.initialCosts.total.toFixed(0)}<span className="text-sm font-normal text-slate-500 ml-1">{t.unitWanSimple}</span></div>
                         <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.labelTotalInvest}</div>
                       </div>
                     </div>
                     
                     {/* Clean Legend */}
                     <div className="mt-2 grid grid-cols-2 gap-2">
                       {initialCostData.map((item, i) => (
                         <div 
                           key={i} 
                           className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                         >
                           <span className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                             <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{background: item.color}} />
                             {item.name}
                           </span>
                           <span className="text-[11px] font-bold text-slate-800 dark:text-white">{item.value.toFixed(1)}<span className="text-[9px] text-slate-400 dark:text-slate-500 ml-0.5">{language === 'EN' ? 'W' : '万'}</span></span>
                         </div>
                       ))}
                     </div>
                     
                     {/* Cash Flow Chart */}
                     <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <CashFlowChart data={result.monthlyCashFlow} t={t} language={language} />
                     </div>
                  </div>
               </div>
               
               {/* Knowledge Carousel at bottom */}
               <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <KnowledgeCarousel cards={result.assetComparison.knowledgeCards} t={t} language={language} />
               </div>
            </div>

            {/* Wealth Chart */}
            {/* Wealth Chart & Analysis Tabs */}
            <div id="tabs-section" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800/50">
               <div className="flex flex-wrap gap-2 mb-6">
                   <button onClick={() => setActiveTab('repayment_detail')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'repayment_detail' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Payment Schedule' : '详细还款计划'}</button>
                   <button onClick={() => setActiveTab('chart')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'chart' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.wealthCurve}</button>
                   <button onClick={() => setActiveTab('rentVsBuy')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'rentVsBuy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.rentVsBuyAnalysis}</button>
                   <button onClick={() => setActiveTab('stress')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'stress' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.stressTest}</button>
                   <button onClick={() => setActiveTab('risk')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'risk' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.riskAssessment}</button>
                   <button onClick={() => setActiveTab('affordability')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'affordability' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Affordability' : '购买力分析'}</button>
                   <button onClick={() => setActiveTab('lifePath')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'lifePath' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.lifePathSimulator || '人生路径模拟'}</button>
                   <button onClick={() => setActiveTab('goal')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'goal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.goalCalculator || '买房倒计时'}</button>
                   <button onClick={() => setActiveTab('token')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'token' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.tokenExchange || '财富兑换'}</button>
                   <button onClick={() => setActiveTab('knowledge')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'knowledge' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.navKnowledgeTree || '知识树'}</button>
                   <button onClick={() => setActiveTab('opportunity')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'opportunity' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.navOpportunity || '机会成本&股市'}</button>
                   <button onClick={() => setActiveTab('journal')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'journal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.navReview || '决策复盘'}</button>
                   <button onClick={() => setActiveTab('negotiation')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'negotiation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.navNegotiation || '谈判助手'}</button>
                   <button onClick={() => setActiveTab('liquidity')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'liquidity' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.navLiquidity || '流动性分析'}</button>
                   <button onClick={() => setActiveTab('life_drag')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'life_drag' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.lifeDragIndex || '房子拖累指数'}</button>
                   <button onClick={() => setActiveTab('community_data')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'community_data' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Community Data' : '小区数据'}</button>
                   <button onClick={() => setActiveTab('income_threshold')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'income_threshold' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Income Threshold' : '收入门槛'}</button>
                   <button onClick={() => setActiveTab('car_analysis')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'car_analysis' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Car Analysis' : '买车分析'}</button>
                   <button onClick={() => setActiveTab('asset_allocation')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'asset_allocation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Asset Alloc.' : '资产配置'}</button>

                   <button onClick={() => setActiveTab('sell_decision')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'sell_decision' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Sell Decision' : '卖房决策'}</button>
                   <button onClick={() => setActiveTab('autopsy')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'autopsy' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Decision Autopsy' : '决策尸检室'}</button>
                   <button onClick={() => setActiveTab('freedom')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'freedom' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Freedom Analytics' : '未来自由度'}</button>
                   <button onClick={() => setActiveTab('leverage')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'leverage' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{language === 'EN' ? 'Life Leverage' : '人生杠杆'}</button>
                   <button onClick={() => setActiveTab('naval')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'naval' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>{t.navNavalWisdom || 'Naval智慧引擎'}</button>
                   <button onClick={() => setActiveTab('life_os')} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${activeTab === 'life_os' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>Life OS</button>

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
               {activeTab === 'risk' && (
                 <div className="space-y-6">
                   <MarketPositionRadar data={calculateMarketRadarData(params)} language={language} />
                   <RiskHeartbeatChart result={result} params={params} t={t} />
                   <RiskAssessmentPanel result={result} params={params} t={t} language={language} />
                 </div>
               )}
                {activeTab === 'affordability' && (
                  <AffordabilityPanel 
                    affordability={calculateAffordability(params, result)}
                    monthlyIncome={params.familyMonthlyIncome || 30000}
                    monthlyPayment={result.monthlyPayment}
                    t={t}
                    language={language}
                  />
                )}
                {activeTab === 'lifePath' && <LifePathSimulator params={params} t={t} />}
                 {activeTab === 'goal' && (
                   <BuyDecisionDashboard t={t} language={language} params={buyTargetParams} onParamChange={handleBuyParamChange} />
                 )}
                 {activeTab === 'token' && (
                   <TokenExchangePanel result={result} params={params} t={t} />
                 )}
                 {activeTab === 'car_analysis' && (
                   <CarPurchasePanel t={t} language={language} user={user} onOpenLogin={() => setShowAuthModal(true)} />
                 )}
                 {activeTab === 'asset_allocation' && (
                   <AssetAllocationPanel t={t} language={language} />
                 )}
                 {activeTab === 'sell_decision' && (
                    <SellDecisionDashboard t={t} language={language} />
                 )}
                 {activeTab === 'autopsy' && (
                   <div id="decision-autopsy" className="animate-fade-in">
                     <DecisionAutopsy params={buyTargetParams} language={language} onParamChange={handleBuyParamChange} />
                   </div>
                 )}
                 {activeTab === 'freedom' && (
                   <div id="freedom-analytics" className="animate-fade-in">
                     <FreedomAnalytics params={buyTargetParams} language={language} />
                   </div>
                 )}
                 {activeTab === 'leverage' && (
                   <div id="life-leverage" className="animate-fade-in">
                     <LifeLeverageAnalytics params={buyTargetParams} language={language} />
                   </div>
                 )}
                 {activeTab === 'naval' && (
                   <div id="naval-wisdom" className="animate-fade-in">
                     <NavalWisdomEngine language={language} t={t} />
                   </div>
                 )}
                 {activeTab === 'life_os' && (
                   <div id="life-os" className="animate-fade-in">
                     <LifeOSDashboard language={language} t={t} />
                   </div>
                 )}
                 {activeTab === 'knowledge' && (
                   <div className="py-4">
                     <KnowledgeTree
                       isOpen={true}
                       onClose={() => setActiveTab('chart')}
                       selectedTermId={selectedKnowledgeTerm}
                       onSelectTerm={setSelectedKnowledgeTerm}
                       t={t}
                     />
                   </div>
                 )}
                 {activeTab === 'opportunity' && (
                    <OpportunityCostPanel result={result} params={params} darkMode={darkMode} t={t} />
                 )}
                 {activeTab === 'journal' && (
                    <DecisionJournalPanel 
                      snapshots={decisionSnapshots}
                      onDelete={handleDeleteSnapshot}
                      onUpdate={handleUpdateSnapshot}
                      onRestore={handleRestoreSnapshot}
                      onanalyze={handleAnalyzeSnapshot}
                      isAnalyzing={isAnalyzingSnapshot}
                      t={t}
                    />
                 )}
                 {activeTab === 'negotiation' && (
                    <NegotiationHelperPanel 
                      t={t} 
                      aiConfig={aiConfig} 
                      onOpenSettings={() => setShowSettings(true)}
                    />
                 )}

                 {activeTab === 'liquidity' && (
                    <LiquidityCheckPanel 
                      t={t} 
                      aiConfig={aiConfig} 
                      onOpenSettings={() => setShowSettings(true)}
                    />
                 )}
               
               {activeTab === 'life_drag' && (
                 <LifeDragIndexPanel 
                   params={params} 
                   monthlyIncome={params.familyMonthlyIncome || 30000}
                   t={t}
                   aiConfig={aiConfig}
                   onOpenSettings={() => setShowSettings(true)}
                 />
               )}

               {activeTab === 'community_data' && (
                 <div className="relative">
                   {!user && (
                     <div className="absolute inset-0 z-20 bg-white/80 dark:bg-black/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center transition-colors">
                       <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center max-w-sm mx-4 shadow-2xl">
                         <div className="w-14 h-14 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                           <LogIn className="h-7 w-7 text-white" />
                         </div>
                         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                           {language === 'EN' ? 'Unlock Community Data' : '解锁小区深度分析'}
                         </h3>
                         <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                           {language === 'EN' 
                             ? 'Log in to view historical transactions, price trends, and neighborhood analysis.' 
                             : '登录后查看小区历史成交记录、价格走势及周边配套深度评测'}
                         </p>
                         <button 
                           onClick={() => setShowAuthModal(true)}
                           className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                         >
                           {language === 'EN' ? 'Login / Sign Up Now' : '立即登录 / 解锁数据'}
                         </button>
                         <p className="text-slate-400 dark:text-slate-600 text-xs mt-4 flex items-center justify-center gap-1">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                           {language === 'EN' ? 'Verified real estate data' : '真实房产数据保障'}
                         </p>
                       </div>
                     </div>
                   )}
                   <div className={!user ? 'pointer-events-none select-none' : ''}>
                     <CommunityDataPanel t={t as any} />
                   </div>
                 </div>
               )}

               {activeTab === 'income_threshold' && (
                 <IncomeRequirementPanel 
                   params={params} 
                   result={result} 
                   t={t} 
                   language={language}
                 />
               )}
             </div>
          </div>

             {activeTab === 'repayment_detail' && (
               <DetailedRepaymentTab
                 t={t}
                 language={language}
                 result={result}
                 params={params}
                 user={user}
                 setShowAuthModal={setShowAuthModal}
                 chartGranularity={chartGranularity}
                 setChartGranularity={setChartGranularity}
                 scheduleChartData={scheduleChartData}
                 darkMode={darkMode}
               />
             )}
          </div>


        {/* 房子评价你 - House Roast Section */}
        <div id="roast-panel">
          <DecisionDashboard params={params} result={result} t={t} language={language} />
        </div>

        

        {/* Interactive Visualization Dashboard */}
        <div id="interactive-dashboard">
          <InteractiveDashboard initialParams={params} t={t} />
        </div>
        
        {/* Interactive Timeline */}
        <div id="timeline-panel" className="animate-fade-in-up animate-delay-200">
          <InteractiveTimeline result={result} language={language} t={t} />
        </div>

        {/* 游戏化买房模式 - Game Mode Section */}
        <div id="game-panel">
          <GameModePanel params={params} t={t} language={language} />
        </div>



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

      {/* Section Navigation */}
      <SectionNav t={t} onTabChange={setActiveTab} />

      {/* Floating AI Advisor */}
      <FloatingAIAdvisor 
        t={t} 
        contextParams={params} 
        result={result}
        isLoggedIn={!!user}
        userPhoto={user?.photoURL}
        userName={user?.displayName}
        onOpenLogin={() => setShowAuthModal(true)}
      />

      {/* Footer */}
      <footer className="relative bg-white dark:bg-[#0a0a0f] border-t border-slate-200 dark:border-slate-800 py-12 mt-12 overflow-hidden">
        {/* Background decoration - removed for pure black */}
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <div id="faq-section" className="mb-12">
            <div className="max-w-full">
              <p className="text-red-500 font-medium text-sm mb-2">FAQ</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'serif' }}>
                {language === 'EN' ? 'Frequently Asked Questions' : '常见问题解答'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                {language === 'EN' ? 'Got questions? We have answers.' : '有疑问？我们来解答。'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mb-8 flex items-center gap-1">
                <span>👆</span>
                <span>{language === 'EN' ? 'Click a question to expand the answer' : '点击问题展开查看答案'}</span>
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                {/* Left Column */}
                <div className="space-y-0">
                  {(language === 'EN' ? [
                    {
                      q: "What is WealthCompass?",
                      a: "WealthCompass is a professional real estate investment analysis tool that helps you comprehensively analyze home purchase costs, long-term financial planning, rent vs. buy comparisons, and various stress test scenarios. Through visualizations and smart analysis, it makes your home buying decisions more informed."
                    },
                    {
                      q: "How do I use the mortgage calculator?",
                      a: "Simply fill in your property information in the left input panel (price, area, loan ratio, etc.), and the system will automatically calculate monthly payments, total interest, payment details, and generate charts to help you understand the long-term financial impact."
                    },
                    {
                      q: "How is the rent vs. buy analysis calculated?",
                      a: "Our rent vs. buy comparison considers mortgage costs, rent growth, property appreciation, investment opportunity costs, taxes, and more. We use NPV (Net Present Value) method to calculate financial returns under various scenarios."
                    },
                    {
                      q: "What is the stress test feature for?",
                      a: "The stress test simulates extreme economic scenarios (rising interest rates, falling home prices, income reduction, etc.) to help you assess your repayment ability and financial resilience under adverse conditions."
                    },
                    {
                      q: "Is my data secure?",
                      a: "Your data is completely secure. All calculations are performed locally in your browser and are never uploaded to any server. You can confidently use this tool for financial planning and analysis."
                    }
                  ] : [
                    {
                      q: "WealthCompass 是什么？",
                      a: "WealthCompass 是一款专业的房产投资决策分析工具，帮助您全面分析购房成本、长期财务规划、租买对比、以及多种压力测试场景。通过可视化图表和智能分析，让您的购房决策更加明智。"
                    },
                    {
                      q: "如何使用房贷计算器？",
                      a: "只需在左侧输入面板填写您的房产基本信息（房价、面积、贷款比例等），系统会自动计算月供、总利息、还款明细等关键数据，并生成可视化图表帮助您理解长期财务影响。"
                    },
                    {
                      q: "租房vs买房分析是如何计算的？",
                      a: "我们的租买对比分析综合考虑了房贷成本、租金增长、房产增值、投资机会成本、税费等多种因素，通过NPV（净现值）方法计算出各种情况下的财务收益对比。"
                    },
                    {
                      q: "压力测试功能有什么用？",
                      a: "压力测试功能模拟各种极端经济场景（如利率上涨、房价下跌、收入减少等），帮助您评估在不利情况下的还款能力和财务韧性，确保您的购房决策经得起考验。"
                    },
                    {
                      q: "我的数据安全吗？",
                      a: "您的数据完全安全。所有计算都在本地浏览器中完成，不会上传到任何服务器。您可以放心使用本工具进行财务规划和分析。"
                    }
                  ]).map((faq, i) => (
                    <div key={i} className={`border-l-2 transition-all duration-200 mb-2 ${expandedFAQ === i ? 'bg-slate-50 dark:bg-slate-800/50 rounded-r-lg' : ''}`} style={{ borderColor: expandedFAQ === i ? '#ef4444' : 'transparent' }}>
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                        className="w-full text-left px-4 py-3 transition-colors"
                      >
                        <h3 className={`font-medium transition-colors ${expandedFAQ === i ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {faq.q}
                        </h3>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${expandedFAQ === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-0">
                  {(language === 'EN' ? [
                    {
                      q: "Is WealthCompass free to use?",
                      a: "🎉 Currently completely free! We're committed to providing professional home-buying decision support to every user. If you find the tool helpful, you can support our development through the donation feature. Thank you for your support!"
                    },
                    {
                      q: "How can I support WealthCompass?",
                      a: "You can donate through the 'Support Us' button at the bottom of the page to help us continuously improve and develop more useful features. Every bit of support drives us forward!"
                    },
                    {
                      q: "Which browsers are supported?",
                      a: "WealthCompass supports all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest browser version."
                    },
                    {
                      q: "How do I switch between dark/light mode?",
                      a: "You can use the theme toggle button in the top right corner to freely switch between dark and light modes for your most comfortable viewing experience."
                    },
                    {
                      q: "How do I provide feedback?",
                      a: "You can submit feedback through the 'Submit Feedback' button at the bottom of the page. You can also contact us directly via email at hollipembletoncrf40@gmail.com."
                    }
                  ] : [
                    {
                      q: "WealthCompass 收费吗？",
                      a: "🎉 现阶段完全免费使用！我们致力于为每一位用户提供最专业的购房决策支持。如果您觉得工具对您有帮助，欢迎通过赞赏功能支持我们的开发工作。感谢大家的支持！"
                    },
                    {
                      q: "如何支持 WealthCompass？",
                      a: "您可以通过页面底部的「赞赏支持」按钮进行打赏，帮助我们持续优化和开发更多实用功能。您的每一份支持都是我们前进的动力！"
                    },
                    {
                      q: "支持哪些浏览器？",
                      a: "WealthCompass 支持所有现代浏览器，包括 Chrome、Firefox、Safari、Edge 等。为了获得最佳体验，建议使用最新版本的浏览器。"
                    },
                    {
                      q: "如何切换深色/浅色模式？",
                      a: "您可以通过页面右上角的主题切换按钮，在深色模式和浅色模式之间自由切换，选择最舒适的视觉体验。"
                    },
                    {
                      q: "有问题如何反馈？",
                      a: "欢迎通过页面底部的「提交反馈」按钮向我们反馈问题或建议。您也可以通过邮箱 hollipembletoncrf40@gmail.com 直接联系我们。"
                    }
                  ]).map((faq, i) => (
                    <div key={i + 10} className={`border-l-2 transition-all duration-200 mb-2 ${expandedFAQ === i + 10 ? 'bg-slate-50 dark:bg-slate-800/50 rounded-r-lg' : ''}`} style={{ borderColor: expandedFAQ === i + 10 ? '#ef4444' : 'transparent' }}>
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === i + 10 ? null : i + 10)}
                        className="w-full text-left px-4 py-3 transition-colors"
                      >
                        <h3 className={`font-medium transition-colors ${expandedFAQ === i + 10 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {faq.q}
                        </h3>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${expandedFAQ === i + 10 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mb-8 border-t border-slate-200 dark:border-slate-800 pt-8">

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                {t.quickNav || '快速导航'}
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => { setActiveTab('chart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {t.navHome || '首页/对比分析'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('asset_allocation'); setTimeout(() => document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {t.navAsset || '资产配置'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('lifePath'); setTimeout(() => document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {t.navLifePath || '人生路径'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('car_analysis'); setTimeout(() => document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {t.navCar || '购车决策'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('knowledge'); setTimeout(() => document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {t.navKnowledge || '知识树/词汇百科'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('stress'); setTimeout(() => document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {t.navStress || '压力测试/情景模拟'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowMethodology(true)} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {t.navLogic || '计算原理说明'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Data Sources */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                {t.dataSources || '数据来源'}
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                  <span>{t.sourceLpr || 'LPR利率：中国人民银行'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                  <span>{t.sourcePrice || '房价数据：国家统计局'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                  <span>{t.sourceMarket || '市场数据：公开市场信息'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                  <span>{t.sourceModel || '计算模型：标准金融公式'}</span>
                </li>
              </ul>
            </div>

            {/* Macro Data & Trends */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                {t.externalLinks?.title || '宏观数据与趋势'}
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {[
                  { name: t.externalLinks?.ershoufang || '二手房大数据', url: 'https://ershoufangdata.com' },
                  { name: t.externalLinks?.creprice || 'CRE Price', url: 'https://www.creprice.cn' },
                  { name: t.externalLinks?.eastmoney || '东方财富指数', url: 'https://data.eastmoney.com/cjsj/newhouse.html' },
                  { name: t.externalLinks?.stats || '国家统计局', url: 'https://data.stats.gov.cn' },
                  { name: t.externalLinks?.tsinghua || '清华恒大指数', url: 'https://www.cre.tsinghua.edu.cn/scjc/csesfzs.htm' }
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                       <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                       <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help & Feedback */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                {t.helpFeedback || '帮助与反馈'}
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowFeedback(true)} 
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <Send className="h-3 w-3" />
                  {t.feedbackBtn || '提交反馈'}
                </button>
                <button 
                  onClick={() => setShowDonation(true)} 
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-xs font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
                >
                  <Coffee className="h-3 w-3" />
                  {t.donateBtn || '赞赏支持'}
                </button>
                <button 
                  onClick={() => setShowWeChat(true)} 
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-xs font-medium shadow-lg shadow-green-500/30 transition-all transform hover:scale-105"
                >
                  <User className="h-3 w-3" />
                  {t.contactAuthor || '联系作者'}
                </button>
              </div>
            </div>
          </div>

          {/* Risk Warning & Disclaimer */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mb-6">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-2">
                    {t.riskTitle || '⚠️ 风险提示与免责声明'}
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {t.riskWarning || '本工具提供的所有分析和结果均基于用户输入和假设的宏观数据，仅供参考，不构成任何投资建议。房地产市场受多种因素影响，实际情况可能与预测存在差异。市场有风险，决策需谨慎。请在做出重大财务决策前咨询专业的财务顾问或房产专家。'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Professional Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex flex-col items-center gap-3">
              {/* Quote */}
              <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center max-w-md">
                {t.quote || '"明智的决策源于充分的信息"'}
              </p>
              
              {/* Copyright - Professional Style */}
              <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
                © 2025 WealthCompass by Josephine. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <AISettingsModal isOpen={showSettings} onClose={() => { setShowSettings(false); setAIConfig(loadAIConfig()); }} t={t} />
      {showDonation && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDonation(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.donationTitle}</h3><p className="text-slate-500 dark:text-slate-400 text-xs mb-6">{t.donationDesc}</p><div className="bg-emerald-500 p-4 rounded-xl inline-block mb-4 shadow-lg shadow-emerald-500/30"><div className="bg-white p-2 rounded-lg"><img src="/mm_reward_qrcode_1764664984491.png" alt="Payment QR" className="w-48 h-48 object-contain"/></div></div><button onClick={() => setShowDonation(false)} className="block w-full text-sm text-slate-400 hover:text-slate-600 mt-2">{t.donationClose}</button></div></div>}
      
      {/* Contact Author WeChat Modal */}
      {showWeChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowWeChat(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {t.contactAuthorTitle || '联系作者'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
              {t.contactAuthorDesc || '扫码添加微信，期待与你交流 ✨'}
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl inline-block mb-4 shadow-lg shadow-green-500/30">
              <div style={{ backgroundColor: '#ffffff' }} className="p-3 rounded-lg">
                <img src="/4e357b455c718f917a05a611ec1efd8f.jpg" alt="WeChat QR" className="w-48 h-48 object-contain rounded" style={{ backgroundColor: '#ffffff' }}/>
              </div>
            </div>
            <button onClick={() => setShowWeChat(false)} className="block w-full text-sm text-slate-400 hover:text-slate-600 mt-2">
              {t.contactClose || '关闭'}
            </button>
          </div>
        </div>
      )}
      {showMethodology && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowMethodology(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10"><h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-500"/> {t.methodologyTitle}</h3><button onClick={() => setShowMethodology(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button></div><div className="p-8 space-y-8 text-sm text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: t.methodologyContent }} /></div></div>}

      {/* Authentication Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} t={t} darkMode={darkMode} />



    </div>
  );
}

// ... existing small components ...
const InputGroup = ({ label, value, onChange, subtext, step = 1, tooltip }: { label: string, value: any, onChange: (v: any) => void, subtext?: string, step?: number, tooltip?: string }) => {
  // Use local state for controlled input to allow empty string
  const [localValue, setLocalValue] = React.useState(String(value ?? ''));
  
  // Sync when external value changes
  React.useEffect(() => {
    setLocalValue(String(value ?? ''));
  }, [value]);
  
  return (
    <div className="flex flex-col gap-1.5 group relative">
      <div className="flex items-center gap-1"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>{tooltip && (<div className="relative group/tooltip"><Info className="h-3 w-3 text-slate-300 cursor-help" /><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">{tooltip}</div></div>)}</div>
      <input 
        type="number" 
        step={step} 
        value={localValue}
        onChange={(e) => {
          const val = e.target.value;
          setLocalValue(val);
          // Only update parent state on blur or with valid number
        }}
        onBlur={() => {
          // Convert to number on blur, default to 0 if empty
          const numVal = localValue === '' ? 0 : parseFloat(localValue);
          onChange(isNaN(numVal) ? 0 : numVal);
        }}
        placeholder="0" 
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all hover:border-indigo-300 dark:hover:border-indigo-700" 
      />
      {subtext && <div className="text-[10px] text-slate-400">{subtext}</div>}
    </div>
  );
};
const MetricCard = ({ label, value, sub, color, tooltip }: any) => { const bgColors: any = { indigo: 'bg-indigo-500', violet: 'bg-violet-600', slate: 'bg-slate-800 dark:bg-slate-700', emerald: 'bg-emerald-500' }; return (<div className={`${bgColors[color]} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group`}><div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Wallet size={48} /></div>{tooltip && (<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity"><Info className="h-4 w-4" /></div>)}<div className="relative z-10"><div className="text-indigo-100/80 text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">{label}</div><div className="text-2xl font-bold mb-1">{value}</div><div className="text-[10px] opacity-80">{sub}</div></div>{tooltip && (<div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity z-20">{tooltip}</div>)}</div>); };

const RiskBar = ({ label, score, max, color }: any) => { const colors: any = { amber: 'bg-amber-500', rose: 'bg-rose-500' }; return (<div><div className="flex justify-between mb-1.5 text-xs"><span className="text-slate-600 dark:text-slate-400">{label}</span><span className="font-bold dark:text-white">{score}/{max}</span></div><div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden"><div className={`h-full ${colors[color]} rounded-full transition-all duration-1000`} style={{ width: `${(score/max)*100}%` }}></div></div></div>); };

export default App;

