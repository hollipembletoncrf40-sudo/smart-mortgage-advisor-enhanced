import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Quote } from 'lucide-react';

import { WISDOM_QUOTES } from '../data/wisdomQuotes';

interface InvestmentWisdomCardProps {
  language?: 'ZH' | 'EN';
}

const InvestmentWisdomCard: React.FC<InvestmentWisdomCardProps> = ({ language = 'ZH' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextQuote();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % WISDOM_QUOTES.length);
      setIsAnimating(false);
    }, 500);
  };

  const currentQuote = WISDOM_QUOTES[currentIndex];
  // Calculate a subtle gradient background based on index to give variety
  const bgGradients = [
    'from-blue-600/20 to-indigo-600/20',
    'from-emerald-600/20 to-teal-600/20', 
    'from-amber-600/20 to-orange-600/20',
    'from-purple-600/20 to-pink-600/20'
  ];
  const currentBg = bgGradients[currentIndex % bgGradients.length];

  return (
    <div className="perspective-1000 w-full max-w-5xl mx-auto mt-8 mb-16">
      <div 
        onClick={handleNextQuote}
        className={`
          relative w-full cursor-pointer group transform-style-3d
          rounded-[2rem] overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/10
          transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/20
        `}
      >
        {/* Liquid Glass Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentBg} opacity-60 transition-colors duration-1000`}></div>
        <div className="absolute inset-0 bg-noise opacity-5"></div>
        
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent opacity-50 pointer-events-none"></div>

        <div className="relative p-12 md:p-16 flex flex-col items-center justify-center text-center min-h-[300px]">
          
          {/* Decorative Quote Icons */}
          <div className="absolute top-8 left-8 text-indigo-900/10 dark:text-white/10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
            <Quote size={64} className="rotate-180" />
          </div>
          <div className="absolute bottom-8 right-8 text-indigo-900/10 dark:text-white/10 transition-transform duration-500 group-hover:translate-y-2 group-hover:translate-x-2">
            <Quote size={64} />
          </div>

          {/* Content Container with 3D Flip */}
          <div 
            className={`
              transition-all duration-700 transform-style-3d flex flex-col items-center
              ${isAnimating ? 'rotate-x-90 opacity-0' : 'rotate-x-0 opacity-100'}
            `}
          >
            <h3 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 mb-8 drop-shadow-sm dark:drop-shadow-md tracking-wide leading-relaxed" style={{ fontFamily: 'serif', textWrap: 'balance' }}>
              {language === 'EN' ? currentQuote.textEn : currentQuote.text}
            </h3>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
              <p className="text-base md:text-lg font-bold text-indigo-800/80 dark:text-indigo-200/90 tracking-[0.2em] uppercase">
                {language === 'EN' ? currentQuote.authorEn : currentQuote.author}
              </p>
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
            </div>
          </div>

          {/* Footer Hint */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-60 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Sparkles size={14} className="text-indigo-500 dark:text-indigo-200" />
            <span className="text-xs text-indigo-600 dark:text-indigo-200 tracking-widest font-medium">
              {language === 'EN' ? 'CLICK TO FLIP' : '点击切换一首'}
            </span>
            <Sparkles size={14} className="text-indigo-500 dark:text-indigo-200" />
          </div>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-x-90 { transform: rotateX(90deg); }
        .rotate-x-0 { transform: rotateX(0deg); }
      `}</style>
    </div>
  );
};

export default InvestmentWisdomCard;
