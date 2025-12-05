import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { getTerm } from '../utils/knowledgeBase';

interface KnowledgeTooltipProps {
  termId: string;
  children: React.ReactNode;
  onTermClick?: (termId: string) => void;
}

const KnowledgeTooltip: React.FC<KnowledgeTooltipProps> = ({ termId, children, onTermClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const term = getTerm(termId);

  useEffect(() => {
    if (showTooltip && wrapperRef.current && tooltipRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Check if tooltip would overflow top of viewport
      if (wrapperRect.top - tooltipRect.height < 20) {
        setTooltipPosition('bottom');
      } else {
        setTooltipPosition('top');
      }
    }
  }, [showTooltip]);

  if (!term) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTermClick) {
      onTermClick(termId);
    }
  };

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        onClick={handleClick}
        className="border-b border-dotted border-indigo-400 dark:border-indigo-500 cursor-help hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors"
      >
        {children}
      </span>
      
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`absolute left-1/2 transform -translate-x-1/2 z-50 w-72 animate-in fade-in slide-in-from-${tooltipPosition === 'top' ? 'bottom' : 'top'}-2 duration-200 ${
            tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl p-4 border border-slate-700">
            {/* Arrow */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 dark:bg-slate-800 border-slate-700 rotate-45 ${
              tooltipPosition === 'top' ? 'bottom-[-6px] border-b border-r' : 'top-[-6px] border-t border-l'
            }`} />
            
            <div className="relative z-10">
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-sm text-indigo-300 mb-1">{term.term}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{term.shortDesc}</p>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-700">
                💡 点击查看详细解释
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default KnowledgeTooltip;
