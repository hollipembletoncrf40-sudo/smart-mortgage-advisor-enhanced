import React, { useState, useEffect, useCallback } from 'react';
import { List, BarChart3, Zap, Clock, Gamepad2, ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionNavProps {
  t: any;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  labelKey: string;
  fallbackLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'input-panel', icon: List, labelKey: 'navInputPanel', fallbackLabel: '参数输入' },
  { id: 'roast-panel', icon: BarChart3, labelKey: 'navRoastPanel', fallbackLabel: '房子评价' },
  { id: 'interactive-dashboard', icon: Zap, labelKey: 'navInteractive', fallbackLabel: '实时仪表' },
  { id: 'timeline-panel', icon: Clock, labelKey: 'navTimeline', fallbackLabel: '时间轴' },
  { id: 'game-panel', icon: Gamepad2, labelKey: 'navGameMode', fallbackLabel: '游戏模式' },
];

const SectionNav: React.FC<SectionNavProps> = ({ t }) => {
  const [activeSection, setActiveSection] = useState<string>('input-panel');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      // Collapse on mobile after clicking
      if (isMobile) setIsCollapsed(true);
    }
  }, [isMobile]);

  return (
    <nav 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
        isCollapsed ? 'translate-x-[calc(100%-40px)]' : 'translate-x-0'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-l-xl flex items-center justify-center shadow-lg transition-colors"
        title={isCollapsed ? '展开导航' : '收起导航'}
      >
        {isCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      {/* Navigation Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-l-2xl shadow-2xl border border-r-0 border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                  isActive 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={t[item.labelKey] || item.fallbackLabel}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span className={`text-xs font-medium whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
                  {t[item.labelKey] || item.fallbackLabel}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Scroll progress indicator */}
        {!isCollapsed && (
          <div className="px-3 pb-3 pt-1">
            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${(NAV_ITEMS.findIndex(i => i.id === activeSection) + 1) / NAV_ITEMS.length * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SectionNav;
