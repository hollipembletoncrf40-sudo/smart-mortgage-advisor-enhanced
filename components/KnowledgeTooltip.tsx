import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { getTerm } from '../utils/knowledgeBase';

interface KnowledgeTooltipProps {
  termId?: string;
  children?: React.ReactNode;
  onTermClick?: (termId: string) => void;
  term?: string; // Support for legacy usage (text content)
}

const KnowledgeTooltip: React.FC<KnowledgeTooltipProps> = ({ termId, children, onTermClick, term: simpleText }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const kbTerm = termId ? getTerm(termId) : null;

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

  if (!kbTerm && !simpleText) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTermClick && termId) {
      onTermClick(termId);
    }
  };

  const Trigger = children ? (
    <span
      onClick={handleClick}
      className={children ? "border-b border-dotted border-indigo-400 dark:border-indigo-500 cursor-help hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors" : ""}
    >
      {children}
    </span>
  ) : (
    <HelpCircle className="h-4 w-4 text-slate-400 hover:text-indigo-500 cursor-help transition-colors" />
  );

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {Trigger}
      
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
                  {kbTerm ? (
                    <>
                      <div className="font-bold text-sm text-indigo-300 mb-1">{kbTerm.term}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{kbTerm.shortDesc}</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">{simpleText}</p>
                  )}
                </div>
              </div>
              
              {kbTerm && (
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-700">
                  💡 点击查看详细解释
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default KnowledgeTooltip;
