import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export const WealthCompassHeader: React.FC<{ language: 'ZH' | 'EN' }> = ({ language }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-8 mb-8 bg-black border border-slate-900 shadow-2xl shadow-indigo-900/10 group animate-in fade-in zoom-in duration-700">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-baseline justify-between gap-4">
        {/* Main Logo Text with Gradient Animation */}
        <div className="flex flex-col relative group/logo">
            {/* Crawling Snail Animation */}
            <div className="absolute -top-6 left-0 animate-crawl pointer-events-none z-20">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -scale-x-100 drop-shadow-lg">
                  <path d="M19 13.5C19 11.0147 16.9853 9 14.5 9C12.0147 9 10 11.0147 10 13.5C10 14.166 10.1448 14.7968 10.4063 15.3626C10.0896 15.1274 9.69762 15 9.25 15C7.3 15 6 16.5 6 18C6 19.1046 6.89543 20 8 20H18.5C19.8807 20 21 18.8807 21 17.5C21 16.6667 21 16 21 16M16 7L16.5 4.5M13 7L12.5 4.5" stroke="url(#snail-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.5 16C15.8807 16 17 14.8807 17 13.5C17 12.1193 15.8807 11 14.5 11C13.1193 11 12 12.1193 12 13.5C12 14.8807 13.1193 16 14.5 16Z" fill="url(#snail-gradient)" fillOpacity="0.2"/>
                  <defs>
                    <linearGradient id="snail-gradient" x1="6" y1="4.5" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fbbf24" />
                      <stop offset="1" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
               </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight select-none relative">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#818cf8,#c084fc,#2dd4bf,#fbbf24,#818cf8)] bg-[length:200%_auto] animate-gradient-x font-sans relative z-10">
                WealthCompass
              </span>
              {/* Reflection/Glow Behind Text */}
              <span className="absolute inset-0 bg-clip-text text-transparent bg-[linear-gradient(to_right,#818cf8,#c084fc,#2dd4bf,#fbbf24,#818cf8)] bg-[length:200%_auto] animate-gradient-x blur-xl opacity-30">
                WealthCompass
              </span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
               <div className="h-px w-12 bg-slate-700"></div>
               <span className="text-sm md:text-base font-bold text-slate-400 tracking-[0.2em] uppercase">
                 {language === 'ZH' ? '财富罗盘终极决策系统' : 'Ultimate Decision System'}
               </span>
               <div className="h-px w-12 bg-slate-700"></div>
            </div>
        </div>

        {/* Decorative Badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#151725] border border-[#2B2D3C] px-4 py-2 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
           <Compass className="w-5 h-5 text-indigo-500 animate-spin-slow" />
           <span className="text-xs font-bold text-slate-300">
             {language === 'ZH' ? '能够穿越周期的智慧' : 'Wisdom across cycles'}
           </span>
           <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      {/* Inline Style for Custom Keyframes if not in global css */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes crawl {
          0% { left: 0; transform: scaleX(-1) translateX(0); }
          50% { left: 90%; transform: scaleX(-1) translateX(0); }
          51% { left: 90%; transform: scaleX(1) translateX(0); }
          100% { left: 0; transform: scaleX(1) translateX(0); }
        }
        .animate-crawl {
          animation: crawl 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
