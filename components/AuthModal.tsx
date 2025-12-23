import { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, PieChart, BrainCircuit, Building2 } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, signupWithEmail } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  t?: any;
}

export const AuthModal = ({ isOpen, onClose, t = {} }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cachedName, setCachedName] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const name = localStorage.getItem('last_username');
      if (name) {
        setCachedName(name);
      }
    }
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setError(t.authNicknameRequired || '请输入昵称');
          return;
        }
        await signupWithEmail(email, password, displayName);
      }
      
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
    setMode('login');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Left Side - Brand & Benefits */}
        <div className="w-full md:w-2/5 bg-slate-50 dark:bg-black p-8 relative flex flex-col justify-between overflow-hidden border-r border-slate-100 dark:border-slate-800">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                    <div className="p-2 bg-white dark:bg-slate-900 shadow-sm rounded-lg">
                        {/* Simple Logo Placeholder */}
                        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">WealthCompass</span>
                </div>

                <h3 className="text-3xl font-bold mb-4 leading-tight text-slate-900 dark:text-white">
                    {t.authWelcomeTitle || '开启您的\n专业投资之旅'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                    {t.authWelcomeDesc || '登录账号，解锁全方位房产投资决策支持，让每一分投资都更明智。'}
                </p>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 group">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                            <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.authBenefit1 || '全周期还款现金流精算透视'}</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                         <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                            <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.authBenefit2 || '私人银行级 AI 投资决策顾问'}</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                         <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.authBenefit3 || '微观级小区价值与趋势洞察'}</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-12 text-xs text-slate-400 dark:text-slate-600">
                &copy; 2025 WealthCompass Pro
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 bg-white dark:bg-black relative">
            <button 
                onClick={handleClose} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="max-w-sm mx-auto mt-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {mode === 'login' ? (cachedName ? `${t.authWelcomeBack || '欢迎回来'}，${cachedName}` : (t.authLoginTitle || '欢迎回来')) : (t.authSignupTitle || '创建账号')}
                </h2>
                <p className="text-slate-500 text-sm mb-8">
                    {mode === 'login' ? '请登录以继续您的投资分析' : '只需几步即可开始使用'}
                </p>

                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-medium text-slate-700 dark:text-gray-200">{t.authGoogleLogin || '使用 Google 账号继续'}</span>
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">{t.authOrEmail || '或使用邮箱'}</span>
                    </div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white outline-none transition-all placeholder:text-slate-400"
                                    placeholder={t.authNicknamePlaceholder || '您的昵称'}
                                    required={mode === 'signup'}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white outline-none transition-all placeholder:text-slate-400"
                                placeholder={t.authEmailPlaceholder || 'you@example.com'}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white outline-none transition-all placeholder:text-slate-400"
                                placeholder={t.authPasswordPlaceholder || '密码 (至少6位)'}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm animate-shake">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-4 py-3.5 font-bold hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        {loading ? (t.authProcessing || '处理中...') : mode === 'login' ? (t.authLoginBtn || '立即登录') : (t.authSignupBtn || '创建账号')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-slate-500">{mode === 'login' ? (t.authNoAccount || '还没有账号？') : (t.authHasAccount || '已有账号？')}</span>
                    <button
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setError('');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 font-bold ml-1 hover:underline decoration-2 underline-offset-4"
                    >
                        {mode === 'login' ? (t.authSignupNow || '免费注册') : (t.authLoginNow || '直接登录')}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
