
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, BarChart, Bar, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Calculator, TrendingUp, BrainCircuit, Moon, Sun, AlertTriangle, 
  Wallet, ShieldAlert, BadgeCheck, Coffee, Send, User, Bot, BarChart3,
  List, X, History, BadgePercent, Settings, Key, Info, BookOpen, ArrowRightLeft,
  Landmark, Loader, Download, FileText, Image as ImageIcon, FileType2, Share2, ChevronDown, CheckCircle2, XCircle, PieChart as PieChartIcon, Coins, Building2, MapPin, Globe2, Lightbulb, ClipboardCheck, ArrowDown
} from 'lucide-react';
import { InvestmentParams, RepaymentMethod, CalculationResult, ChatMessage, PrepaymentStrategy, StressTestResult, LoanType, PurchaseScenario, LocationFactors, LocationScore, AssetComparisonItem, KnowledgeCardData } from './types';
import { calculateInvestment, calculateStressTest, aggregateYearlyPaymentData, calculateLocationScore } from './utils/calculate';
import { createInvestmentChat, sendMessageToAI } from './services/geminiService';
import { Chat } from '@google/genai';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

// --- Components ---

// New: BuyingProcessModal
const BuyingProcessModal = ({ onClose }: { onClose: () => void }) => {
  const steps = [
    { 
      title: '1. 资金与资质准备', 
      desc: '核实购房资格（社保/个税/户口）。确认首付资金来源，预留契税、中介费及装修备用金。',
      detail: '建议提前拉取征信报告，确保无不良记录影响贷款。',
      icon: Wallet,
      color: 'bg-indigo-500'
    },
    { 
      title: '2. 看房选筹', 
      desc: '遵循“地段-配套-户型”原则。白天看采光，晚上看噪音，雨天看渗水。',
      detail: '利用本工具的“选筹指南”进行打分。关注学区政策和周边未来规划。',
      icon: MapPin,
      color: 'bg-emerald-500'
    },
    { 
      title: '3. 签约认购', 
      desc: '签署定金协议或认购书。核实业主身份及房产证真伪（查档）。',
      detail: '注意合同中的违约责任条款。资金必须进入监管账户，切勿私转业主。',
      icon: FileText,
      color: 'bg-amber-500'
    },
    { 
      title: '4. 贷款办理', 
      desc: '提交收入证明、银行流水（通常要求月供的2倍）。银行面签，等待批贷函。',
      detail: '优先选择公积金贷款或组合贷。根据现金流选择等额本金或本息。',
      icon: Landmark,
      color: 'bg-violet-500'
    },
    { 
      title: '5. 缴税过户', 
      desc: '网签备案，缴纳契税、个税及维修基金。去房管局办理过户手续。',
      detail: '过户后大约 3-7 个工作日可领取新不动产权证（房本）。',
      icon: ClipboardCheck,
      color: 'bg-rose-500'
    },
    { 
      title: '6. 收房入住', 
      desc: '物业交割（结清水电燃气费）。实地验房，检查空鼓、门窗及防水。',
      detail: '拿到钥匙，开启装修或入住。记得更改水电户名。',
      icon: Key,
      color: 'bg-slate-500'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
            <List className="h-5 w-5 text-indigo-500"/> 全流程购房指南
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
const AssetComparisonTable = ({ data }: { data: AssetComparisonItem[] }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mb-6">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">维度</th>
            <th className="px-4 py-3 text-indigo-600 dark:text-indigo-400">房产投资</th>
            <th className="px-4 py-3 text-emerald-600 dark:text-emerald-400">金融理财</th>
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
const KnowledgeCarousel = ({ cards }: { cards: KnowledgeCardData[] }) => {
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
            <BookOpen className="h-3 w-3"/> 金融小课堂
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


const LocationGuideModal = ({ onClose, onApply }: { onClose: () => void, onApply: (score: LocationScore) => void }) => {
    const [factors, setFactors] = useState<LocationFactors>({
        transport: 5,
        education: 5,
        commercial: 5,
        environment: 5,
        potential: 5
    });

    const score = calculateLocationScore(factors);

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
                        <MapPin className="h-5 w-5 text-indigo-500"/> 地段选筹指南 (5-3-2法则)
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <p className="text-sm text-slate-500 mb-6 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
                        <List className="inline h-4 w-4 mr-1"/>
                        房地产长期看人口，中期看土地，短期看金融。但核心永远是地段。请根据目标房源实际情况打分。
                    </p>

                    <Slider label="交通通勤 (地铁/主干道)" val={factors.transport} setVal={(v: number) => setFactors({...factors, transport: v})} icon={TrendingUp} />
                    <Slider label="教育医疗 (学区/三甲)" val={factors.education} setVal={(v: number) => setFactors({...factors, education: v})} icon={BookOpen} />
                    <Slider label="商业配套 (商圈/便利)" val={factors.commercial} setVal={(v: number) => setFactors({...factors, commercial: v})} icon={Building2} />
                    <Slider label="环境宜居 (公园/噪音)" val={factors.environment} setVal={(v: number) => setFactors({...factors, environment: v})} icon={Sun} />
                    <Slider label="未来规划 (产业/拆迁)" val={factors.potential} setVal={(v: number) => setFactors({...factors, potential: v})} icon={Globe2} />
                    
                    <div className="mt-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">综合选筹得分</div>
                        <div className={`text-4xl font-black mb-2 ${score.total >= 80 ? 'text-emerald-500' : score.total >= 60 ? 'text-indigo-500' : 'text-amber-500'}`}>
                            {score.total} <span className="text-lg font-medium text-slate-400">/ 100</span>
                        </div>
                        <div className="inline-block px-3 py-1 bg-white dark:bg-slate-900 rounded-full text-sm font-bold shadow-sm mb-2">
                            评级: {score.level}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{score.advice}</p>
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={() => onApply(score)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
                    >
                        应用此评分到 AI 分析
                    </button>
                </div>
            </div>
        </div>
    );
};

const TourGuide = ({ onComplete }: { onComplete: () => void }) => {
  // ... (TourGuide impl same as before)
  const [step, setStep] = useState(0);
  const steps = [
    { targetId: 'header-title', title: '欢迎使用', content: '这是一个专业的房产投资决策工具。它通过量化计算和 AI 分析，帮您做出更明智的买房决定。', position: 'bottom' },
    { targetId: 'input-panel', title: '1. 配置参数', content: '在此输入房价、贷款、租金以及隐性成本（税费、装修）。支持商贷、公积金及组合贷款。', position: 'right' },
    { targetId: 'result-panel', title: '2. 实时分析', content: '查看初始资金分布、回报率、现金流风险和财富增长曲线（支持切换真实购买力）。', position: 'left' },
    { targetId: 'comparison-panel', title: '3. 资产对比', content: '纠结买房还是买股？这里直接对比两种方案在持有期结束后的净资产差距，并提供多维度定性分析。', position: 'top' },
    { targetId: 'ai-panel', title: '4. AI 顾问', content: '有不懂的随时问 Josephine。她知道您的税费成本和通胀设置，会给出更犀利的建议。', position: 'left' }
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
          <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">新手引导 {step + 1}/{steps.length}</span><button onClick={onComplete} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{currentStep.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{currentStep.content}</p>
          <div className="flex justify-end gap-2"><button onClick={onComplete} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium">跳过</button><button onClick={handleNext} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all">{step === steps.length - 1 ? '开始使用' : '下一步'}</button></div>
       </div>
    </div>
  );
};

const FeedbackModal = ({ onClose }: { onClose: () => void }) => {
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">意见反馈</h3>
            <div className="flex gap-2 justify-center mb-6">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110"><Coins className={`h-8 w-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} /></button>))}</div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="请描述您的问题或建议..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white mb-4 h-32 resize-none" />
            <button onClick={handleSubmit} disabled={rating === 0} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">提交反馈</button>
          </>
        ) : (
          <div className="text-center py-8 animate-fade-in"><div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500"><CheckCircle2 className="h-8 w-8" /></div><h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">感谢您的反馈!</h3><p className="text-slate-500 dark:text-slate-400 text-sm mb-2">我们会认真阅读您的建议。</p><p className="text-slate-400 dark:text-slate-500 text-xs">联系邮箱📮：3251361185@qq.com</p></div>
        )}
      </div>
    </div>
  );
};

function App() {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false); 
  const [chartGranularity, setChartGranularity] = useState<'month' | 'year'>('year'); 
  const [showSettings, setShowSettings] = useState(false); 
  const [showMethodology, setShowMethodology] = useState(false); 
  const [showExportMenu, setShowExportMenu] = useState(false); 
  const [isExporting, setIsExporting] = useState(false);
  const [showRealValue, setShowRealValue] = useState(false); 
  const [showFeedback, setShowFeedback] = useState(false);
  
  // New: Location Guide & Buying Process
  const [showLocationGuide, setShowLocationGuide] = useState(false);
  const [showBuyingProcess, setShowBuyingProcess] = useState(false);
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
    purchaseScenario: PurchaseScenario.FIRST_HOME
  });

  const result: CalculationResult = useMemo(() => calculateInvestment(params), [params]);
  const stressTest: StressTestResult[] = useMemo(() => calculateStressTest(params), [params]);
  const scheduleChartData = useMemo(() => {
      if (chartGranularity === 'year') {
          return aggregateYearlyPaymentData(result.monthlyData);
      } else {
          return result.monthlyData.filter((_, i) => i % 6 === 0 || i === result.monthlyData.length - 1).map(m => ({
              index: m.monthIndex,
              label: `第${m.monthIndex}期`,
              payment: m.payment,
              principal: m.principal,
              interest: m.interest,
              remainingPrincipal: m.remainingPrincipal
          }));
      }
  }, [result.monthlyData, chartGranularity]);

  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setDarkMode(true);
    const savedKey = localStorage.getItem('user_gemini_api_key');
    if (savedKey) { setCustomApiKey(savedKey); setTempApiKey(savedKey); }
    const hasSeenTour = localStorage.getItem('has_seen_tour');
    if (!hasSeenTour) setShowTour(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) setShowExportMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  // Pass locationScore to AI
  useEffect(() => {
    const chat = createInvestmentChat(params, result, customApiKey, locationScore);
    setChatInstance(chat);
    if (isFirstLoad.current) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        content: `您好！我是您的 AI 投资顾问 Josephine。\n\n我已经基于您当前的参数（房价 ${params.totalPrice}万, 初始投入 ${result.initialCosts.total.toFixed(2)}万）完成了计算。\n\n您可以使用顶部的【选筹指南】对目标地段进行打分，我会结合地段潜力为您提供更具体的建议。`,
        timestamp: Date.now()
      }]);
      isFirstLoad.current = false;
    }
  }, [result, customApiKey, locationScore]); 

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

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

  const handleSendMessage = async (msgOverride?: string) => {
    const msgContent = msgOverride || inputMessage;
    if (!msgContent.trim() || !chatInstance) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msgContent, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);
    try {
      const responseText = await sendMessageToAI(chatInstance, userMsg.content);
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) { console.error(e); setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "出现错误，请检查您的网络连接或 API Key。", timestamp: Date.now() }]); } 
    finally { setIsTyping(false); }
  };

  const handleApplyLocationScore = (score: LocationScore) => {
    setLocationScore(score);
    setShowLocationGuide(false);
    // Auto trigger AI to analyze the score
    handleSendMessage(`我刚刚进行了地段评分，得分为 ${score.total} 分 (${score.level}级)。请根据这个分数，评价一下这个地段的投资潜力。`);
  };

  // ... Export Handlers (Image, PDF, Markdown) ...
  const handleExportMarkdown = () => {
    const content = `# 投资报告\n...`; // Simplified
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report.md`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  const handleExportImage = async () => { setIsExporting(true); try { const element = document.getElementById('main-report'); if (element) { const canvas = await html2canvas(element, { scale: 2, backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }); const dataUrl = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.href = dataUrl; a.download = `report.png`; document.body.appendChild(a); a.click(); document.body.removeChild(a); } } catch (e) {} finally { setIsExporting(false); setShowExportMenu(false); } };
  const handleExportPDF = async () => { setIsExporting(true); try { const element = document.getElementById('main-report'); if (element) { const canvas = await html2canvas(element, { scale: 2, backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }); const imgData = canvas.toDataURL('image/png'); const pdf = new jsPDF('p', 'mm', 'a4'); const pdfWidth = pdf.internal.pageSize.getWidth(); const imgHeight = canvas.height * pdfWidth / canvas.width; pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight); pdf.save(`report.pdf`); } } catch (e) {} finally { setIsExporting(false); setShowExportMenu(false); } };

  const initialCostData = [
    { name: '首付', value: result.initialCosts.downPayment, color: '#6366f1' },
    { name: '契税', value: result.initialCosts.deedTax, color: '#f43f5e' },
    { name: '中介费', value: result.initialCosts.agencyFee, color: '#fbbf24' },
    { name: '装修', value: result.initialCosts.renovation, color: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-indigo-50/30 text-slate-900'}`}>
      
      {showTour && <TourGuide onComplete={() => { setShowTour(false); localStorage.setItem('has_seen_tour', 'true'); }} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      
      {/* New Modal */}
      {showLocationGuide && <LocationGuideModal onClose={() => setShowLocationGuide(false)} onApply={handleApplyLocationScore} />}
      {showBuyingProcess && <BuyingProcessModal onClose={() => setShowBuyingProcess(false)} />}

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3" id="header-title">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                买房投资决策计算器 <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2 align-middle">PRO</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { localStorage.removeItem('has_seen_tour'); setShowTour(true); }} className="hidden md:block px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg">教程</button>
            
            {/* New Button for Buying Process */}
            <button 
                onClick={() => setShowBuyingProcess(true)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <ClipboardCheck className="h-3.5 w-3.5" /> 购房流程
            </button>

            {/* New Button for Location Guide */}
            <button 
                onClick={() => setShowLocationGuide(true)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 dark:border-emerald-900/30"
            >
                <MapPin className="h-3.5 w-3.5" /> 选筹指南
            </button>

            <div className="relative" ref={exportMenuRef}>
               <button onClick={() => setShowExportMenu(!showExportMenu)} disabled={isExporting} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-100 dark:border-indigo-900/50">
                 {isExporting ? <Loader className="h-3.5 w-3.5 animate-spin"/> : <Share2 className="h-3.5 w-3.5" />} 导出
               </button>
               {showExportMenu && (
                 <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-fade-in">
                    <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"><FileType2 className="h-4 w-4 text-rose-500" /> 导出 PDF 报告</button>
                    <button onClick={handleExportImage} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"><ImageIcon className="h-4 w-4 text-emerald-500" /> 导出图片 (PNG)</button>
                    <button onClick={handleExportMarkdown} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"><FileText className="h-4 w-4 text-slate-500" /> 导出 Markdown</button>
                 </div>
               )}
            </div>
            <button onClick={() => setShowMethodology(true)} className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><BookOpen className="h-3.5 w-3.5" /> 计算原理</button>
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
           <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white font-bold text-lg relative z-10"><List className="h-5 w-5 text-indigo-500" /> 投资参数配置</div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 relative z-10">
               {/* Column 1 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">基础信息</h3>
                   <div className="space-y-4">
                        <InputGroup label="房屋总价 (万元)" value={params.totalPrice} onChange={v => handleInputChange('totalPrice', v)} tooltip="房屋的实际成交总价（不含税费），是计算首付和贷款的基础。" />
                        <InputGroup label="首付比例 (%)" value={params.downPaymentRatio} onChange={v => handleInputChange('downPaymentRatio', v)} subtext={`净首付: ${(result?.downPayment || 0).toFixed(2)}万`} tooltip="购房时首期需要支付的款项比例。一般首套房为30%，二套房可能更高。" />
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">一次性购房成本</div>
                            <div className="space-y-2">
                                <InputGroup label="契税 (%)" value={params.deedTaxRate} onChange={v => handleInputChange('deedTaxRate', v)} step={0.1} tooltip="房屋权属转移时向买方征收的税款。通常首套房90平以下1%，90平以上1.5%。" />
                                <InputGroup label="中介费 (%)" value={params.agencyFeeRatio} onChange={v => handleInputChange('agencyFeeRatio', v)} step={0.1} tooltip="支付给房产中介的服务费用，通常为成交价的 1% - 3%。" />
                                <InputGroup label="装修预算 (万)" value={params.renovationCost} onChange={v => handleInputChange('renovationCost', v)} tooltip="预计的装修、家具家电购置费用。这属于初始沉没成本，不产生直接利息但占用现金流。" />
                            </div>
                        </div>
                   </div>
               </div>
               {/* Column 2 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">贷款方案</h3>
                   <div className="space-y-4">
                       <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">贷款方式</label><div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg"><button onClick={() => handleInputChange('loanType', LoanType.COMMERCIAL)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.COMMERCIAL ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>商业</button><button onClick={() => handleInputChange('loanType', LoanType.PROVIDENT)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.PROVIDENT ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>公积金</button><button onClick={() => handleInputChange('loanType', LoanType.COMBINATION)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${params.loanType === LoanType.COMBINATION ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>组合</button></div></div>
                       {(params.loanType === LoanType.COMMERCIAL || params.loanType === LoanType.COMBINATION) && <InputGroup label="商贷年利率 (%)" value={params.interestRate} onChange={v => handleInputChange('interestRate', v)} step={0.01} tooltip="银行商业贷款的执行年利率（LPR + 基点）。" />}
                       {(params.loanType === LoanType.PROVIDENT || params.loanType === LoanType.COMBINATION) && <div className="space-y-4 animate-fade-in"><InputGroup label="公积金利率 (%)" value={params.providentInterestRate} onChange={v => handleInputChange('providentInterestRate', v)} step={0.01} tooltip="住房公积金贷款的年利率，通常低于商贷。" />{params.loanType === LoanType.COMBINATION && <InputGroup label="公积金贷款额度 (万)" value={params.providentQuota} onChange={v => handleInputChange('providentQuota', v)} tooltip="公积金中心规定的个人或家庭最高可贷额度。" />}</div>}
                       <InputGroup label="贷款年限 (年)" value={params.loanTerm} onChange={v => handleInputChange('loanTerm', v)} tooltip="选择贷款还款的总年数，通常最长为30年。年限越长月供越低，但总利息越高。" />
                   </div>
               </div>
               {/* Column 3 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">理财与还款</h3>
                   <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">启用提前还款</label><input type="checkbox" checked={params.enablePrepayment} onChange={(e) => handleInputChange('enablePrepayment', e.target.checked)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" /></div>
                            {params.enablePrepayment && (<div className="animate-fade-in space-y-4 pt-2"><InputGroup label="第几年还款" value={params.prepaymentYear} onChange={v => handleInputChange('prepaymentYear', v)} tooltip="预计在贷款开始后的第几年进行大额还款。" /><InputGroup label="还款金额 (万元)" value={params.prepaymentAmount} onChange={v => handleInputChange('prepaymentAmount', v)} tooltip="计划一次性偿还的本金金额。" /><div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">还款策略</label><select value={params.prepaymentStrategy} onChange={(e) => handleInputChange('prepaymentStrategy', e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"><option value={PrepaymentStrategy.REDUCE_PAYMENT}>减少月供 (年限不变)</option><option value={PrepaymentStrategy.REDUCE_TERM}>缩短年限 (月供不变)</option></select></div></div>)}
                        </div>
                        <InputGroup label="理财年化收益 (%)" value={params.alternativeReturnRate} onChange={v => handleInputChange('alternativeReturnRate', v)} step={0.1} tooltip="用于计算“机会成本”。即如果不买房，把首付和月供差额拿去理财，预计能获得的年化回报率。" />
                        <InputGroup label="通货膨胀率 (%)" value={params.inflationRate} onChange={v => handleInputChange('inflationRate', v)} step={0.1} tooltip="用于计算未来资产的“真实购买力”。即使房价涨了，如果涨幅低于通胀，实际财富可能缩水。" />
                   </div>
               </div>
               {/* Column 4 */}
               <div className="space-y-5">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">收益与风控</h3>
                   <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-2"><InputGroup label="持有年限" value={params.holdingYears} onChange={v => handleInputChange('holdingYears', v)} tooltip="预计持有该房产多少年后卖出。这将影响最终的年化回报率计算。" /><InputGroup label="月租金 (元)" value={params.monthlyRent} onChange={v => handleInputChange('monthlyRent', v)} tooltip="预计每月的租金收入。如果不自住也不出租，请填0。" /></div>
                       <div className="grid grid-cols-2 gap-2"><InputGroup label="年涨幅 (%)" value={params.appreciationRate} onChange={v => handleInputChange('appreciationRate', v)} step={0.1} tooltip="预计房价平均每年的增长比例。" /><InputGroup label="空置率 (%)" value={params.vacancyRate} onChange={v => handleInputChange('vacancyRate', v)} tooltip="每年房屋处于空置状态（无租金收入）的时间比例。例如 8.3% 约等于每年空置1个月。" /></div>
                       <div className="grid grid-cols-2 gap-2"><InputGroup label="持有成本比例 (%)" value={params.holdingCostRatio} onChange={v => handleInputChange('holdingCostRatio', v)} step={0.1} tooltip="每年用于支付物业费、取暖费、维修基金等的费用，占房产总价值的比例。" /><InputGroup label="固定维护费 (万/年)" value={params.propertyMaintenanceCost} onChange={v => handleInputChange('propertyMaintenanceCost', v)} step={0.1} tooltip="每年固定的房屋维护支出（如家电维修、翻新）。" /></div>
                       <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                           <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Building2 className="h-3 w-3"/> 现有资产</div>
                           <div className="space-y-2">
                               <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-slate-500 dark:text-slate-400">购房性质</label><select value={params.purchaseScenario} onChange={(e) => handleInputChange('purchaseScenario', e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"><option value={PurchaseScenario.FIRST_HOME}>首套刚需</option><option value={PurchaseScenario.SECOND_HOME}>二套改善</option><option value={PurchaseScenario.INVESTMENT}>纯投资</option></select></div>
                               <InputGroup label="现有房产 (套)" value={params.existingPropertyCount} onChange={v => handleInputChange('existingPropertyCount', v)} tooltip="不包含本次计划购买的房产。" />
                               <InputGroup label="现有月供 (元)" value={params.existingMonthlyDebt} onChange={v => handleInputChange('existingMonthlyDebt', v)} tooltip="您目前每月必须偿还的其他贷款（如车贷、其他房贷、信用贷）。" />
                           </div>
                       </div>
                       <InputGroup label="家庭月收入 (元)" value={params.familyMonthlyIncome} onChange={v => handleInputChange('familyMonthlyIncome', v)} tooltip="家庭每月的税后总收入，用于计算偿债能力（DTI）。" />
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
               <MetricCard label="现金回报率" value={`${result.cashOnCashReturn.toFixed(2)}%`} sub="基于真实投入" color="indigo" tooltip="（年净租金 / 初始实际投入总额）* 100%" />
               <MetricCard label="综合回报率" value={`${result.comprehensiveReturn.toFixed(2)}%`} sub="含增值" color="violet" tooltip="（总收益 / 总投入）* 100%" />
               <MetricCard label="首月月供" value={`¥${result.monthlyPaymentText}`} sub={`覆盖比: ${result.monthlyCoverageRatio.toFixed(2)}`} color="slate" tooltip="租金收入 / 月供" />
               <MetricCard label="总收益" value={`${result.totalRevenue.toFixed(1)}万`} sub={result.breakEvenYear ? `第${result.breakEvenYear}年回本` : '未回本'} color="emerald" tooltip="持有期结束时的总利润" />
            </div>

            {/* Asset Comparison & Cost */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Initial Cost */}
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 md:col-span-1 flex flex-col">
                  <h2 className="text-sm font-bold flex items-center gap-2 dark:text-white mb-4"><PieChartIcon className="h-4 w-4 text-indigo-500" /> 初始资金去向</h2>
                  <div className="flex-1 min-h-[160px] relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={initialCostData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {initialCostData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                          </Pie>
                          <RechartsTooltip formatter={(v: number) => `${v.toFixed(1)}万`} contentStyle={{borderRadius:'8px', fontSize:'12px'}} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><div className="text-lg font-bold text-slate-700 dark:text-white">{result.initialCosts.total.toFixed(0)}</div><div className="text-[10px] text-slate-400">总投入(万)</div></div>
                  </div>
                  <div className="mt-2 space-y-1">{initialCostData.map((item, i) => <div key={i} className="flex justify-between text-xs text-slate-500"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: item.color}}></span>{item.name}</span><span>{item.value.toFixed(1)}万</span></div>)}</div>
               </div>

               {/* Asset Comparison */}
               <div id="comparison-panel" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 md:col-span-2">
                  <div className={newFunction()}>
                      <h2 className="text-sm font-bold flex items-center gap-2 dark:text-white"><Landmark className="h-4 w-4 text-indigo-500" /> 资产大比拼：买房 vs 理财</h2>
                      <div className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">{params.holdingYears}年期末净权益</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={`relative p-4 rounded-2xl border transition-all ${result.assetComparison.winner === 'House' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                        {result.assetComparison.winner === 'House' && <div className="absolute -top-2 left-2 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">WINNER</div>}
                        <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-md text-indigo-600 dark:text-indigo-400"><TrendingUp className="h-4 w-4"/></div><div className="text-xs font-bold dark:text-white">投资房产</div></div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white mb-2">{result.assetComparison.houseNetWorth.toFixed(1)} <span className="text-xs font-normal text-slate-500">万</span></div>
                      </div>
                      <div className={`relative p-4 rounded-2xl border transition-all ${result.assetComparison.winner === 'Stock' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                        {result.assetComparison.winner === 'Stock' && <div className="absolute -top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">WINNER</div>}
                        <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-emerald-100 dark:bg-emerald-900 rounded-md text-emerald-600 dark:text-emerald-400"><BarChart3 className="h-4 w-4"/></div><div className="text-xs font-bold dark:text-white">金融理财</div></div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white mb-2">{result.assetComparison.stockNetWorth.toFixed(1)} <span className="text-xs font-normal text-slate-500">万</span></div>
                      </div>
                  </div>
                  
                  {/* New Asset Comparison Table */}
                  <AssetComparisonTable data={result.assetComparison.qualitative} />

                  {/* New Knowledge Carousel */}
                  <KnowledgeCarousel cards={result.assetComparison.knowledgeCards} />
               </div>
            </div>

            {/* Wealth Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white"><BarChart3 className="h-5 w-5 text-indigo-500" /> 财富增长曲线</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setShowRealValue(!showRealValue)} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border ${showRealValue ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>{showRealValue ? '已去除通胀 (真实购买力)' : '去除通胀 (看购买力)'}</button>
                    <button onClick={() => setShowSchedule(true)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><List className="h-3.5 w-3.5" /> 详细月供</button>
                  </div>
               </div>
               <div className="h-80 w-full min-w-0">
                  {result.yearlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={result.yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                           <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v)=>`第${v}年`} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <RechartsTooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: darkMode ? '#fff' : '#1e293b' }} formatter={(value: number) => [`${value.toFixed(2)} 万`, '']} />
                        <Legend iconType="circle" />
                        <Area type="monotone" dataKey={showRealValue ? "realPropertyValue" : "propertyValue"} name={showRealValue ? "房产真实价值" : "房产名义价值"} stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        <Area type="monotone" dataKey={showRealValue ? "realStockNetWorth" : "stockNetWorth"} name={showRealValue ? "理财真实净值" : "理财名义净值"} stroke="#fbbf24" fillOpacity={1} fill="url(#colorStock)" strokeWidth={2} strokeDasharray="5 5"/>
                        <Area type="monotone" dataKey="remainingLoan" name="剩余贷款" stroke="#f43f5e" fill="transparent" strokeDasharray="3 3" strokeWidth={2} />
                     </AreaChart>
                  </ResponsiveContainer>
                  ) : (<div className="flex items-center justify-center h-full text-slate-400 text-sm">暂无数据，请调整持有年限</div>)}
               </div>
            </div>
            
            {/* Stress Test */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">压力测试 (模拟不利情景)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {stressTest.map((test, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500 transition-all">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 truncate" title={test.scenarioName}>{test.scenarioName}</div>
                    <div className={`text-lg font-bold mb-1 ${test.totalRevenue < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{test.totalRevenue.toFixed(1)} 万</div>
                    <div className="flex justify-between text-xs text-slate-400"><span>回报率 {test.returnRate.toFixed(1)}%</span><span className={`${test.diffRevenue < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{test.diffRevenue > 0 ? '+' : ''}{test.diffRevenue.toFixed(1)}万</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="xl:col-span-1 space-y-8 flex flex-col h-full" id="ai-panel">
            {/* Risk Gauge */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold dark:text-white flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-orange-500"/> 风险评估</h2>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${result.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-700' : result.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{result.riskLevel === 'Low' ? '低风险' : result.riskLevel === 'Medium' ? '中风险' : '高风险'}</span>
               </div>
               <div className="space-y-4">
                  <RiskBar label="现金流压力" score={result.cashFlowRisk} max={100} color="amber" />
                  <RiskBar label="杠杆风险" score={result.leverageRisk} max={100} color="rose" />
                  <div className="pt-2 text-xs text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 space-y-1 mt-2">
                     <div className="flex justify-between items-center py-1 font-medium bg-slate-50 dark:bg-slate-800/50 px-2 -mx-2 rounded mt-2">
                        <span className="text-slate-600 dark:text-slate-300">总月供负债 (新+旧):</span>
                        <span className={`font-bold ${result.dtiRatio > 0.5 ? 'text-rose-600 dark:text-rose-400' : result.dtiRatio > 0.4 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-200'}`}>¥{result.totalMonthlyDebt.toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between items-center"><span>总偿债比 (DTI):</span> <span className={`font-bold ${result.dtiRatio > 0.5 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}`}>{(result.dtiRatio * 100).toFixed(1)}%</span></div>
                     <div className="text-[10px] opacity-70 mt-1 flex items-center gap-1">{result.dtiRatio > 0.5 && <AlertTriangle className="h-3 w-3 text-rose-500"/>}* 建议 DTI 保持在 50% 以下</div>
                  </div>
               </div>
            </div>

            {/* AI Chat Interface */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex-1 flex flex-col overflow-hidden h-[600px] xl:h-auto">
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white relative"><Bot className="h-4 w-4" />{customApiKey && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>}</div>
                     <div><div className="font-bold text-sm dark:text-white">AI 投资顾问 {customApiKey ? '(私有Key)' : ''}</div><div className="text-[10px] text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 在线</div></div>
                  </div>
                  <button onClick={() => { setMessages([]); const chat = createInvestmentChat(params, result!, customApiKey, locationScore); setChatInstance(chat); setMessages([{id: 'reset', role: 'model', content: '对话已重置。', timestamp: Date.now()}]); }} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="重新开始对话"><History className="h-4 w-4" /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/30">
                  {messages.map((msg) => (
                     <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'}`}>
                           {msg.role === 'model' ? <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /> : msg.content}
                        </div>
                     </div>
                  ))}
                  {isTyping && <div className="flex justify-start"><div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-100 dark:border-slate-700"><div className="flex gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span></div></div></div>}
                  <div ref={messagesEndRef} />
               </div>
               <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                   <ActionButton text="生成报告" onClick={() => handleSendMessage("请为我生成一份详细的投资分析报告。")} />
                   <ActionButton text="买房 vs 理财" onClick={() => handleSendMessage("买房还是买理财？")} />
                   <ActionButton text="地段点评" onClick={() => handleSendMessage("结合我的地段评分，点评一下这个房子的升值潜力。")} />
               </div>
               <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"><form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2"><input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder={isTyping ? "Josephine 正在思考..." : "问问我对这个投资的看法..."} disabled={isTyping} className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none disabled:opacity-70" /><button type="submit" disabled={!inputMessage.trim() || isTyping} className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl shadow-lg">{isTyping ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</button></form></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 mt-12">
        <div className="max-w-[1600px] mx-auto px-4 text-center">
          <div className="text-slate-400 dark:text-slate-500 text-sm mb-4 italic">"先求不败，而后求胜。做好最坏的打算，您的投资之路才会更稳健。"</div>
          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 text-sm"><span>Created by Josephine</span><span>•</span><button onClick={() => setShowDonation(true)} className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"><Coffee className="h-3 w-3" /> 赞助打赏</button><span>•</span><button onClick={() => setShowFeedback(true)} className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"><Send className="h-3 w-3" /> 意见反馈</button></div>
        </div>
      </footer>
      
      {showSettings && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"><h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><Key className="h-5 w-5 text-indigo-500"/> AI 设置</h3><button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button></div><div className="p-6 space-y-4"><div className="space-y-2"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">自定义 Gemini API Key</label><input type="password" value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} placeholder="输入以 'AIza' 开头的 Key" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" /><p className="text-[10px] text-slate-400">Key 将仅存储在您的本地浏览器中。设置后将优先使用此 Key 进行对话。</p></div><div className="flex gap-3 pt-2"><button onClick={() => { setTempApiKey(''); setCustomApiKey(''); localStorage.removeItem('user_gemini_api_key'); setShowSettings(false); }} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">清除并恢复默认</button><button onClick={handleSaveApiKey} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">保存设置</button></div></div></div></div>}
      {showDonation && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDonation(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">感谢您的支持</h3><p className="text-slate-500 dark:text-slate-400 text-xs mb-6">开发不易，您的支持是我持续更新的动力</p><div className="bg-emerald-500 p-4 rounded-xl inline-block mb-4 shadow-lg shadow-emerald-500/30"><div className="bg-white p-2 rounded-lg"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wxp://f2f0OX2-payment-placeholder" alt="Payment QR" className="w-48 h-48 object-contain"/></div></div><button onClick={() => setShowDonation(false)} className="block w-full text-sm text-slate-400 hover:text-slate-600 mt-2">关闭</button></div></div>}
      {showMethodology && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowMethodology(false)}><div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10"><h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-500"/> 计算原理说明书</h3><button onClick={() => setShowMethodology(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button></div><div className="p-8 space-y-8 text-sm text-slate-600 dark:text-slate-300">
        <section>
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">1. 核心回报指标</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>现金回报率 (Cash on Cash Return)</strong> = (年净租金收入 - 年房贷支出) / 初始实际现金投入。其中，初始投入包含首付、契税、中介费和装修款。该指标反映了每一块钱现金投入每年能产生多少净现金流。</li>
            <li><strong>综合回报率 (Comprehensive Return)</strong> = (累计净现金流 + 期末房产净值 - 初始总投入) / 初始总投入。它考虑了房产本身的增值（Capital Appreciation）和本金偿还带来的权益增加。</li>
          </ul>
        </section>
        <section>
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">2. 贷款与还款模型</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>等额本息</strong>: 每月还款金额固定。前期利息占比高，本金占比低。适合现金流紧张的购房者。</li>
            <li><strong>等额本金</strong>: 每月偿还的本金固定，利息随剩余本金减少而递减。前期月供高，总利息支出较少。</li>
            <li><strong>组合贷款</strong>: 优先使用公积金贷款额度（利率低），剩余部分使用商业贷款。还款时合并计算。</li>
          </ul>
        </section>
        <section>
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">3. 风险评估模型</h4>
          <ul className="list-disc pl-5 space-y-2">
             <li><strong>偿债比 (DTI)</strong> = (新房月供 + 现有其他月供) / 家庭月收入。建议控制在 50% 以下。超过 50% 被视为高风险。</li>
             <li><strong>月供覆盖比 (DSCR)</strong> = 月租金收入 / 月供。若小于 1.0，意味着租金无法覆盖月供，需要额外贴钱养房。</li>
          </ul>
        </section>
        <section>
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">4. 机会成本与资产对比</h4>
          <p className="mb-2">我们模拟了“如果当初不买房”的平行世界：</p>
          <ul className="list-disc pl-5 space-y-2">
             <li>将首付款、税费、装修款一次性投入理财产品（按设定的理财年化收益率复利增长）。</li>
             <li>如果在买房场景中您每月需要贴钱（月供 > 租金），在理财场景中这笔钱也会被定投进去。</li>
             <li>最终对比第 N 年结束时，两者的净资产（资产 - 负债）。</li>
          </ul>
        </section>
      </div></div></div>}
      {showSchedule && result && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSchedule(false)}><div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 rounded-t-3xl"><div className="flex items-center gap-4"><div><h3 className="text-lg font-bold dark:text-white">还款计划详情</h3><p className="text-xs text-slate-500">前 {chartGranularity === 'year' ? `${Math.ceil(result.monthlyData.length/12)} 年` : `${result.monthlyData.length} 期`} 数据 (含提前还款)</p></div><div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg"><button onClick={() => setChartGranularity('year')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartGranularity === 'year' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500'}`}>按年</button><button onClick={() => setChartGranularity('month')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartGranularity === 'month' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-500'}`}>按月</button></div></div><button onClick={() => setShowSchedule(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500"><X className="h-5 w-5"/></button></div><div className="flex-1 overflow-auto p-6 space-y-8"><div><h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> {chartGranularity === 'year' ? '年度' : '月度'}本息与余额走势</h4><div className="h-64 w-full min-w-0"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={scheduleChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} /><YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} /><RechartsTooltip /><Legend /><Bar yAxisId="left" dataKey="interest" name="支付利息" stackId="a" fill="#f43f5e" /><Bar yAxisId="left" dataKey="principal" name="偿还本金" stackId="a" fill="#10b981" /><Line yAxisId="right" type="monotone" dataKey="remainingPrincipal" name="剩余本金" stroke="#6366f1" /></ComposedChart></ResponsiveContainer></div></div></div></div></div>}

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
const ActionButton = ({ text, onClick }: any) => (<button onClick={onClick} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs rounded-full border border-slate-200 dark:border-slate-700 transition-all whitespace-nowrap">{text}</button>);
const RiskBar = ({ label, score, max, color }: any) => { const colors: any = { amber: 'bg-amber-500', rose: 'bg-rose-500' }; return (<div><div className="flex justify-between mb-1.5 text-xs"><span className="text-slate-600 dark:text-slate-400">{label}</span><span className="font-bold dark:text-white">{score}/{max}</span></div><div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden"><div className={`h-full ${colors[color]} rounded-full transition-all duration-1000`} style={{ width: `${(score/max)*100}%` }}></div></div></div>); };

export default App;
function newFunction() {
  return "flex items-center justify-between mb-4";
}

