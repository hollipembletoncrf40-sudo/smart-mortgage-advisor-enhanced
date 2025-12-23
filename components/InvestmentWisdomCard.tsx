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
    <div 
      onClick={handleNextQuote}
      className={`
        relative w-full max-w-4xl mx-auto mt-6 mb-12 cursor-pointer group
        rounded-3xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl
        transition-all duration-500 hover:scale-[1.01] hover:shadow-indigo-500/20
      `}
    >
      {/* Liquid Glass Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentBg} opacity-60 transition-colors duration-1000`}></div>
      <div className="absolute inset-0 bg-noise opacity-5"></div>
      
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>

      <div className="relative p-8 md:p-10 flex flex-col items-center justify-center text-center min-h-[220px]">
        
        {/* Decorative Quote Icon */}
        <div className="absolute top-6 left-6 text-indigo-900/10 dark:text-white/20">
          <Quote size={48} className="rotate-180" />
        </div>
        <div className="absolute bottom-6 right-6 text-indigo-900/10 dark:text-white/20">
          <Quote size={48} />
        </div>

        {/* Content Container */}
        <div className={`transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          <h3 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-slate-100 mb-6 drop-shadow-sm dark:drop-shadow-md tracking-wide leading-relaxed" style={{ fontFamily: 'serif' }}>
            {language === 'EN' ? currentQuote.textEn : currentQuote.text}
          </h3>
          
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-indigo-500/30 dark:bg-indigo-300/50"></div>
            <p className="text-sm md:text-base font-medium text-indigo-800/80 dark:text-indigo-100/90 tracking-widest uppercase">
              {language === 'EN' ? currentQuote.authorEn : currentQuote.author}
            </p>
            <div className="h-[1px] w-12 bg-indigo-500/30 dark:bg-indigo-300/50"></div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
          <Sparkles size={12} className="text-indigo-500 dark:text-indigo-200" />
          <span className="text-[10px] text-indigo-600 dark:text-indigo-200 tracking-wider">
            {language === 'EN' ? 'Click to change' : '点击切换一首'}
          </span>
          <Sparkles size={12} className="text-indigo-500 dark:text-indigo-200" />
        </div>
      </div>
    </div>
  );
};

export default InvestmentWisdomCard;
