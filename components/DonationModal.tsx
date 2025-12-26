import React, { useState, useEffect } from 'react';
import { Heart, X, Sparkles, Coffee } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  qrCodeSrc: string;
}

// Floating heart component
const FloatingHeart = ({ delay, size, left, duration }: { delay: number; size: number; left: number; duration: number }) => (
  <div
    className="absolute bottom-0 text-pink-400 animate-float opacity-0"
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      fontSize: `${size}rem`,
    }}
  >
    <Heart className="fill-current" style={{ width: `${size}rem`, height: `${size}rem` }} />
  </div>
);

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, t, qrCodeSrc }) => {
  const [phase, setPhase] = useState<'heart' | 'reveal'>('heart');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase('heart');
      setShowQR(false);
      
      // After heart animation, reveal QR
      const timer = setTimeout(() => {
        setPhase('reveal');
        setTimeout(() => setShowQR(true), 300);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const floatingHearts = Array.from({ length: 12 }, (_, i) => ({
    delay: Math.random() * 2,
    size: 1 + Math.random() * 1.5,
    left: 5 + Math.random() * 90,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-rose-900/80 via-pink-900/70 to-purple-900/80 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(244, 114, 182, 0.6)); }
          50% { filter: drop-shadow(0 0 40px rgba(244, 114, 182, 0.9)); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float-up ease-out forwards; }
        .animate-pulse-heart { animation: pulse-heart 0.8s ease-in-out infinite, glow 1.5s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 1s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
      `}</style>

      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingHearts.map((heart, i) => (
          <FloatingHeart key={i} {...heart} />
        ))}
      </div>

      {/* Main content */}
      <div 
        className="relative max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Central Heart Animation Phase */}
        {phase === 'heart' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              {/* Sparkles around heart */}
              {[...Array(6)].map((_, i) => (
                <Sparkles 
                  key={i}
                  className="absolute text-yellow-300 animate-sparkle"
                  style={{
                    top: `${20 + 60 * Math.sin(i * Math.PI / 3)}%`,
                    left: `${20 + 60 * Math.cos(i * Math.PI / 3)}%`,
                    animationDelay: `${i * 0.15}s`,
                    width: '1.5rem',
                    height: '1.5rem',
                  }}
                />
              ))}
              
              {/* Giant pulsing heart */}
              <Heart 
                className="text-rose-500 fill-rose-500 animate-pulse-heart"
                style={{ width: '12rem', height: '12rem' }}
              />
            </div>
            
            <p className="mt-8 text-2xl font-bold text-white animate-pulse">
              {t.donationHeartMessage || '感谢你的温暖 💕'}
            </p>
          </div>
        )}

        {/* QR Code Reveal Phase */}
        {phase === 'reveal' && (
          <div className={`bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-2xl shadow-pink-500/20 ${showQR ? 'animate-slide-up' : 'opacity-0'}`}>
            {/* Header with coffee icon */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Coffee className="h-8 w-8 text-amber-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                {t.donationTitle || '请作者喝杯咖啡'}
              </h3>
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500 animate-bounce" />
            </div>

            {/* Emotional message */}
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
              {t.donationEmotionalDesc || '你的每一份支持，都是我继续创作的动力。一杯咖啡的温度，足以温暖一颗创作者的心 ☕✨'}
            </p>

            {/* QR Codes with decorative border - WeChat & Alipay */}
            <div className="flex gap-4 justify-center mb-6">
              {/* WeChat QR */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur opacity-75" />
                  <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl">
                    <div className="bg-white p-2 rounded-lg">
                      <img 
                        src="/ad88ddc9ecdef607de5d09ef28e17af7.png" 
                        alt="WeChat Pay" 
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  </div>
                </div>
                <span className="mt-2 text-xs font-medium text-green-500">微信支付</span>
              </div>

              {/* Alipay QR */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-75" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
                    <div className="bg-white p-2 rounded-lg">
                      <img 
                        src="/httpsqr.alipay.comfkx19665ghh0z6cyvf6ut4c.png" 
                        alt="Alipay" 
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  </div>
                </div>
                <span className="mt-2 text-xs font-medium text-blue-500">支付宝</span>
              </div>
            </div>

            {/* Thank you note with signature style */}
            <div className="text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <p className="italic">
                {t.donationThanks || '"无论金额大小，都是对我最大的认可"'}
              </p>
              <p className="font-medium text-rose-500">
                — Josephine 💝
              </p>
            </div>

            {/* Close hint */}
            <button 
              onClick={onClose}
              className="mt-6 text-sm text-slate-400 hover:text-rose-500 transition-colors"
            >
              {t.donationClose || '点击关闭'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
