import React, { useState, useEffect } from 'react';
import { Timer, Calendar, Sparkles, Snowflake, Flame, Hourglass } from 'lucide-react';

export const AestheticTimeHeader: React.FC<{ language: 'ZH' | 'EN' }> = ({ language }) => {
  const [time, setTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 10 Greetings including the mandatory one
  const greetings = [
    { zh: "今年经历了所有的曲折，往后的路尽是坦途。", en: "Having weathered all storms this year, the road ahead is smooth sailing." },
    { zh: "愿你的财富像时间一样，积少成多，滚滚而来。", en: "May your wealth grow like time, compounding endlessly." },
    { zh: "星光不问赶路人，时光不负有心人。", en: "Starlight asks not the traveler; time fails not the determined." },
    { zh: "凡是过往，皆为序章；凡是未来，皆有可期。", en: "What's past is prologue; what's to come is full of hope." },
    { zh: "在不确定的世界里，做一个确定的长期主义者。", en: "In an uncertain world, be a certain long-termist." },
    { zh: "时间是财富最好的朋友，耐心是投资最高的智慧。", en: "Time is wealth's best friend; patience is investment's highest wisdom." },
    { zh: "愿你历尽千帆，归来仍是少年；阅尽沧桑，内心依旧安详。", en: "May you return young at heart after a thousand sails; calm within after seeing the world." },
    { zh: "种一棵树最好的时间是十年前，其次是现在。", en: "The best time to plant a tree was 10 years ago. The second best is now." },
    { zh: "保持热爱，奔赴山海，前路浩浩荡荡，万事尽可期待。", en: "Keep your passion, cross mountains and seas; the road is vast, everything is possible." },
    { zh: "所有的运气，都是实力的积攒；所有的惊喜，都是人品的爆发。", en: "Luck is the accumulation of ability; surprises are the rewards of character." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Greeting Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
        setIsTransitioning(false);
      }, 500); // Wait for fade out
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Target: Chinese New Year 2026 (Feb 17, 2026 - Year of the Horse)
    const cnyDate = new Date('2026-02-17T00:00:00');
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = cnyDate.getTime() - now.getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ZH' ? 'zh-CN' : 'en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'ZH' ? 'zh-CN' : 'en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 py-3 overflow-hidden group">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-full bg-indigo-600/10 blur-[80px] animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-full bg-rose-600/10 blur-[80px] animate-pulse delay-700"></div>
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Card 1: Time & Date */}
        <div className="bg-slate-900/60 backdrop-blur-lg border border-white/10 rounded-xl px-5 py-2 flex items-center gap-4 shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 group/time">
           <div className="flex items-center gap-2 border-r border-white/10 pr-4">
              <Calendar className="w-4 h-4 text-indigo-400 group-hover/time:text-indigo-300 transition-colors" />
              <span className="text-sm font-bold text-slate-300 tracking-wide font-mono">
                {formatDate(time)}
              </span>
           </div>
           <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-xl font-black font-mono bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent filter drop-shadow-sm">
                {formatTime(time)}
              </span>
           </div>
        </div>

        {/* Card 2: Rotating Greeting (Center) */}
        <div className="flex-1 w-full md:w-auto flex justify-center perspective-1000">
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-xl px-10 py-5 shadow-[0_0_25px_rgba(251,191,36,0.1)] flex items-center gap-4 min-w-[500px] justify-center relative overflow-hidden group/greeting transform-style-3d transition-all duration-300 hover:scale-[1.02]">
             {/* Shimmer effect */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/greeting:animate-shimmer" />
             
             <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-pulse" />
             <div 
               className={`transition-all duration-700 transform-style-3d ${
                 isTransitioning 
                   ? 'rotate-x-90 opacity-0' 
                   : 'rotate-x-0 opacity-100'
               } text-center flex-1`}
             >
               <p className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent tracking-wide leading-relaxed font-serif whitespace-nowrap">
                 {language === 'ZH' ? greetings[greetingIndex].zh : greetings[greetingIndex].en}
               </p>
               <div className="h-0.5 w-1/3 mx-auto bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mt-2"></div>
             </div>
             <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-pulse delay-75" />
          </div>
        </div>

        {/* Card 3: CNY Countdown */}
        <div className="bg-slate-900/60 backdrop-blur-lg border border-white/10 rounded-xl px-5 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all duration-300 group/cny">
           <div className="flex items-center gap-2">
             <Flame className="w-4 h-4 text-rose-500 group-hover/cny:scale-110 transition-transform duration-300" />
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
               {language === 'ZH' ? '距26年春节' : 'CNY 2026'}
             </span>
           </div>
           
           {timeLeft && (
             <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-rose-400 font-extrabold text-lg">{timeLeft.days}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">{language === 'ZH' ? '天' : 'd'}</span>
                
                <div className="flex items-center gap-0.5 text-rose-300/80 text-sm font-bold">
                  <span>{String(timeLeft.hours).padStart(2,'0')}</span>
                  <span className="animate-pulse">:</span>
                  <span>{String(timeLeft.minutes).padStart(2,'0')}</span>
                  <span className="animate-pulse">:</span>
                  <span>{String(timeLeft.seconds).padStart(2,'0')}</span>
                </div>
             </div>
           )}
        </div>

      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-x-90 {
          transform: rotateX(90deg);
        }
        .rotate-x-0 {
          transform: rotateX(0deg);
        }
      `}</style>
    </div>
  );
};
