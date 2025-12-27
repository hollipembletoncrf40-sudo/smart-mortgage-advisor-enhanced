import React, { useState, useEffect, useCallback } from 'react';
import { List, BarChart3, Zap, Clock, Gamepad2, TrendingUp, LayoutGrid, Bot, HelpCircle, CalendarDays, MessageSquare, Coffee, ArrowUp } from 'lucide-react';

interface SectionNavProps {
  t: any;
  onTabChange: (tab: any) => void;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  labelKey: string;
  fallbackLabel: string;
  fallbackLabelEN: string;
  targetTab?: string; // New: optional target tab
}

const NAV_ITEMS: NavItem[] = [
  { id: 'input-panel', icon: List, labelKey: 'navInputPanel', fallbackLabel: '参数输入', fallbackLabelEN: 'Parameters' },
  { id: 'comparison-panel', icon: TrendingUp, labelKey: 'navComparison', fallbackLabel: '资产对比', fallbackLabelEN: 'Comparison' },
  { id: 'tabs-section', icon: LayoutGrid, labelKey: 'navAnalysis', fallbackLabel: '分析工具', fallbackLabelEN: 'Analysis' },
  { id: 'roast-panel', icon: BarChart3, labelKey: 'navRoastPanel', fallbackLabel: '房子评价', fallbackLabelEN: 'Evaluation' },
  { id: 'interactive-dashboard', icon: Zap, labelKey: 'navInteractive', fallbackLabel: '实时仪表', fallbackLabelEN: 'Dashboard' },
  { id: 'timeline-panel', icon: Clock, labelKey: 'navTimeline', fallbackLabel: '时间轴', fallbackLabelEN: 'Timeline' },
  { id: 'game-panel', icon: Gamepad2, labelKey: 'navGameMode', fallbackLabel: '游戏模式', fallbackLabelEN: 'Game Mode' },

  { id: 'payment-schedule', icon: CalendarDays, labelKey: 'navPaymentSchedule', fallbackLabel: '还款计划', fallbackLabelEN: 'Payment Schedule', targetTab: 'repayment_detail' },
  { id: 'faq-section', icon: HelpCircle, labelKey: 'navFAQ', fallbackLabel: '常见问题', fallbackLabelEN: 'FAQ' },
  { id: 'feedback-trigger-btn', icon: MessageSquare, labelKey: 'navFeedback', fallbackLabel: '反馈与建议', fallbackLabelEN: 'Feedback' },
  { id: 'donate-trigger-btn', icon: Coffee, labelKey: 'navDonate', fallbackLabel: '打赏作者', fallbackLabelEN: 'Donate' },
];

const SectionNav: React.FC<SectionNavProps> = ({ t, onTabChange }) => {
  const [activeSection, setActiveSection] = useState<string>('input-panel');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect English by checking appTitle
  const isEN = t.appTitle === 'WealthCompass';

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0.2, 0.5]
      }
    );

    NAV_ITEMS.forEach((item) => {
      // For feedback button, we don't need to observe it for active state strictly, 
      // but if it exists we can observe it.
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string, targetTab?: string) => {
    if (targetTab) {
      onTabChange(targetTab);
      // Give React a moment to render the tab content before trying to scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(id);
        } else {
             // Fallback: scroll to top of tabs section if element not found immediately
             const tabs = document.getElementById('tabs-section');
             if(tabs) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      if (isMobile) setIsExpanded(false);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Use center for button visibility
      setActiveSection(id);
      
      // Special animation for feedback and donate buttons
      if (id === 'feedback-trigger-btn' || id === 'donate-trigger-btn') {
        element.classList.add('ring-4', 'ring-indigo-500', 'ring-offset-2', 'transition-all', 'duration-500', 'scale-110');
        setTimeout(() => {
           element.classList.remove('ring-4', 'ring-indigo-500', 'ring-offset-2', 'scale-110');
        }, 1500);
      }

      // Collapse on mobile after clicking
      if (isMobile) setIsExpanded(false);
    }
  }, [isMobile, onTabChange]);

  return (
    <nav 
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Navigation Panel - hover to expand */}
      <div 
        className={`bg-white dark:bg-slate-900 rounded-l-2xl shadow-2xl border border-r-0 border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-40' : 'w-12'
        }`}
      >
        <div className="p-2 space-y-1">
          {/* Scroll to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all text-left group text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
            title={isEN ? 'Back to Top' : '回到顶部'}
          >
            <ArrowUp className="h-4 w-4 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform" />
            <span 
              className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 absolute'
              }`}
            >
              {isEN ? 'Back to Top' : '回到顶部'}
            </span>
          </button>
          
          {/* Separator */}
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const fallback = isEN ? item.fallbackLabelEN : item.fallbackLabel;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id, item.targetTab)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all text-left group ${
                  isActive 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={t[item.labelKey] || fallback}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span 
                  className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 absolute'
                  }`}
                >
                  {t[item.labelKey] || fallback}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Scroll progress indicator */}
        <div className={`px-2 pb-2 pt-1 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${(NAV_ITEMS.findIndex(i => i.id === activeSection) + 1) / NAV_ITEMS.length * 100}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SectionNav;
