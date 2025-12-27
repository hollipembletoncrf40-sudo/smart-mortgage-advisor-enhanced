import { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowLeft, FileText, CheckCircle, Camera, Check } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword } from '../services/authService';
import { auth } from '../config/firebase';
import { updateProfile } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  t?: any;
  darkMode?: boolean;
}

type AuthView = 'login' | 'signup' | 'forgot_password' | 'terms';

export const AuthModal = ({ isOpen, onClose, t = {}, darkMode = true }: AuthModalProps) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New states for enhanced auth
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('wc_saved_email');
    const savedRemember = localStorage.getItem('wc_remember_me');
    if (savedRemember === 'true' && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      setLoading(false);
      setView('login');
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
      setSuccessMsg('');
      
      if (view === 'login') {
        await loginWithEmail(email, password);
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('wc_saved_email', email);
          localStorage.setItem('wc_remember_me', 'true');
        } else {
          localStorage.removeItem('wc_saved_email');
          localStorage.removeItem('wc_remember_me');
        }
        onClose();
        resetForm();
      } else if (view === 'signup') {
        if (!displayName.trim()) {
          setError(t.authNicknameRequired || '请输入昵称');
          return;
        }
        if (!agreeToTerms) {
          setError('请先阅读并同意服务条款');
          return;
        }
        const user = await signupWithEmail(email, password, displayName);
        
        // Upload avatar if selected
        if (avatarFile && auth.currentUser) {
          try {
            // Convert file to base64 for simple storage (in production, use Firebase Storage)
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64 = reader.result as string;
              await updateProfile(auth.currentUser!, { photoURL: base64 });
            };
            reader.readAsDataURL(avatarFile);
          } catch (avatarErr) {
            console.error('Avatar upload failed:', avatarErr);
          }
        }
        onClose();
        resetForm();
      } else if (view === 'forgot_password') {
        if (!email) {
           setError('请输入邮箱地址');
           return;
        }
        // Assuming resetPassword exists in authService, otherwise catch will handle or we mock
        await resetPassword(email); 
        setSuccessMsg('重置链接已发送，请检查您的邮箱');
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Don't reset email if remember me is on
    if (!rememberMe) {
      setEmail('');
    }
    setPassword('');
    setDisplayName('');
    setError('');
    setSuccessMsg('');
    setView('login');
    setAgreeToTerms(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('头像文件不能超过 2MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden animate-fade-in ${darkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Full Screen Grid Layout */}
      <div className="w-full h-full flex flex-col md:flex-row relative">
        
        {/* Close Button - Absolute Top Right */}
        <button 
            onClick={onClose}
            className={`absolute top-6 right-6 z-50 p-2 transition-colors rounded-full ${darkMode ? 'text-zinc-500 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}
        >
            <X className="h-6 w-6" />
        </button>

        {/* Left Panel - Premium Liquid Glass Branding */}
        <div className="hidden md:flex w-[45%] h-full relative overflow-hidden group">
            {/* Deep Cosmic Background */}
            <div className={`absolute inset-0 z-0 ${darkMode ? 'bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#020617] to-black' : 'bg-gradient-to-br from-indigo-50 via-white to-slate-50'}`}>
                {/* Animated Aurora Orbs */}
                <div className={`absolute top-[-20%] left-[-20%] w-[80%] h-[80%] blur-[120px] rounded-full animate-pulse ${darkMode ? 'bg-indigo-600/20' : 'bg-indigo-300/40'}`}></div>
                <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[100px] rounded-full animate-pulse ${darkMode ? 'bg-purple-600/10' : 'bg-purple-300/40'}`} style={{ animationDelay: '2s' }}></div>
                <div className={`absolute top-[40%] right-[-20%] w-[50%] h-[50%] blur-[90px] rounded-full animate-pulse ${darkMode ? 'bg-blue-600/10' : 'bg-blue-300/30'}`} style={{ animationDelay: '4s' }}></div>
                
                {/* Premium Noise Texture */}
                <div className="absolute inset-0 opacity-[0.04]" 
                     style={{ 
                         backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                     }}>
                </div>
                
                {/* Tech Grid Overlay */}
                <div className={`absolute inset-0 ${darkMode ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}
                     style={{
                         backgroundImage: `linear-gradient(to right, ${darkMode ? '#a5b4fc' : '#000'} 1px, transparent 1px), linear-gradient(to bottom, ${darkMode ? '#a5b4fc' : '#000'} 1px, transparent 1px)`,
                         backgroundSize: '60px 60px',
                         maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                     }}>
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
                {/* Logo Area */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>WealthCompass</span>
                </div>

                {/* Main Hero Text */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h1 className={`text-5xl font-bold leading-[1.1] tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            <span className="block">智能财富决策</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x">AI驱动的未来</span>
                        </h1>
                        <p className={`text-lg max-w-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            DeepEstate 深度决策引擎，为您提供超乎想象的房产投资洞察。
                        </p>
                    </div>

                    {/* Feature Cards - Floating Effect */}
                    <div className="space-y-4">
                        {[
                            { title: '智能财富规划', desc: '个性化资产配置，精准预测', icon: <FileText className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500' },
                            { title: '风险压力测试', desc: '全维度评估，规避潜在风险', icon: <CheckCircle className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500' },
                            { title: 'AI 决策建议', desc: '大模型深度分析，量身定制', icon: <div className="text-xs font-bold px-1">AI</div>, color: 'from-purple-500 to-pink-500' }
                        ].map((item, idx) => (
                            <div key={idx} className={`group/card flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:translate-x-1 ${darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' : 'bg-white/50 border-black/5 hover:bg-white/80'}`}>
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg opacity-80 group-hover/card:opacity-100 transition-opacity`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.title}</h3>
                                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500 group-hover/card:text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Stats - Glass Strip */}
                <div className={`flex items-center justify-between py-4 px-6 rounded-2xl border backdrop-blur-md ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/40 border-black/5'}`}>
                    {[
                        { val: '50K+', label: '用户信赖' },
                        { val: '¥2B+', label: '分析资产' },
                        { val: '98%', label: '五星好评' }
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.val}</div>
                            <div className={`text-[10px] uppercase tracking-wider font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cinematic Edge Lighting */}
            <div className={`absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent opacity-50`}></div>
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className={`flex-1 h-full flex flex-col items-center justify-center p-8 md:p-16 relative ${darkMode ? 'bg-black' : 'bg-white'}`}>
            
            <div className="w-full max-w-md space-y-8">
                
                {/* View: Terms of Service */}
                {view === 'terms' && (
                    <div className="text-white space-y-6 h-full flex flex-col animate-fade-in-up">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setView('login')} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold">服务条款</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 text-zinc-400 text-sm max-h-[60vh] border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
                            <p className="text-zinc-500 text-xs">最后更新日期：2025年10月</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">1. 服务说明与接受条款</h3>
                            <p>欢迎使用 WealthCompass（以下简称"本平台"或"我们"）。本平台由独立开发者个人运营，致力于为用户提供基于大数据分析的房产价值评估、投资回报预测、贷款计算、以及 AI 辅助决策建议服务。</p>
                            <p>当您访问或使用本平台时，即表示您已阅读、理解并同意受本服务条款（以下简称"条款"）的约束。如果您不同意本条款的任何部分，请勿使用本平台。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">2. 用户账户与注册</h3>
                            <p><strong className="text-zinc-300">2.1 账户创建：</strong>为使用本平台的全部功能，您需要注册一个账户。您同意提供真实、准确、完整的注册信息，并及时更新以保持其有效性。</p>
                            <p><strong className="text-zinc-300">2.2 账户安全：</strong>您对您的账户和密码的保密性负全部责任。您同意立即通知我们任何未经授权使用您账户或任何其他安全漏洞的情况。</p>
                            <p><strong className="text-zinc-300">2.3 账户使用：</strong>您不得将您的账户转让或出借给任何第三方。您对通过您账户进行的所有活动负责，无论是否经您授权。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">3. 服务内容与数据来源</h3>
                            <p><strong className="text-zinc-300">3.1 服务范围：</strong>本平台提供的服务包括但不限于：房产估值、贷款还款计算、投资回报分析、市场趋势预测、AI 智能建议等。</p>
                            <p><strong className="text-zinc-300">3.2 数据来源：</strong>本平台使用的数据来源于公开市场信息、政府公开数据、合作机构提供的数据以及用户自行输入的信息。我们尽力确保数据的准确性，但不对数据的完整性或时效性作出任何保证。</p>
                            <p><strong className="text-zinc-300">3.3 AI 建议：</strong>本平台提供的 AI 生成内容（包括投资建议、市场分析等）仅供参考，不构成任何形式的专业投资、法律或财务建议。在做出任何重大财务决策之前，请咨询合格的专业人士。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">4. 隐私保护与数据安全</h3>
                            <p><strong className="text-zinc-300">4.1 数据收集：</strong>我们收集您在使用服务时提供的信息，包括账户信息、查询历史、输入的房产数据等。详细信息请参阅我们的隐私政策。</p>
                            <p><strong className="text-zinc-300">4.2 数据使用：</strong>您的数据仅用于为您提供和改进服务、生成个人化分析报告、以及改善用户体验。我们不会将您的个人数据出售给任何第三方。</p>
                            <p><strong className="text-zinc-300">4.3 数据安全：</strong>我们采用行业标准的加密技术和安全措施保护您的数据。然而，互联网传输没有任何方法是完全安全的，我们无法保证绝对的安全性。</p>
                            <p><strong className="text-zinc-300">4.4 数据保留：</strong>我们将在您使用服务期间以及法律要求的期限内保留您的数据。您可以随时请求删除您的账户和相关数据。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">5. 免责声明与风险提示</h3>
                            <p><strong className="text-zinc-300">5.1 投资风险：</strong>房地产投资存在固有风险，包括但不限于市场波动、政策变化、经济衰退等。历史数据和预测不代表未来表现。您应自行评估投资风险并做出独立判断。</p>
                            <p><strong className="text-zinc-300">5.2 信息准确性：</strong>尽管我们努力确保信息的准确性，但本平台不对任何信息的准确性、完整性、可靠性或适用性作出任何明示或暗示的保证。</p>
                            <p><strong className="text-zinc-300">5.3 责任限制：</strong>在法律允许的最大范围内，本平台及其关联方不对因使用或无法使用本服务而导致的任何直接、间接、附带、特殊、惩罚性或后果性损害承担责任，包括但不限于利润损失、数据丢失或业务中断。</p>
                            <p><strong className="text-zinc-300">5.4 第三方链接：</strong>本平台可能包含第三方网站的链接。我们对这些第三方网站的内容、隐私政策或做法不承担任何责任。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">6. 知识产权</h3>
                            <p><strong className="text-zinc-300">6.1 平台权利：</strong>本平台的所有内容，包括但不限于文本、图形、徽标、图标、图像、音频剪辑、数字下载和软件，均为本平台或其内容供应商的财产，受中国和国际版权法的保护。</p>
                            <p><strong className="text-zinc-300">6.2 用户授权：</strong>通过使用本服务，您授予我们非独占的、免版税的许可，以使用您提供的信息来为您提供服务和改进平台。</p>
                            <p><strong className="text-zinc-300">6.3 禁止行为：</strong>未经我们明确书面许可，您不得复制、修改、分发、销售或出租本平台的任何部分或其内容，也不得对软件进行逆向工程或尝试提取源代码。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">7. 用户行为规范</h3>
                            <p>您同意不会：</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li>使用本服务进行任何非法活动</li>
                                <li>试图未经授权访问本平台的任何部分</li>
                                <li>干扰或破坏服务或服务器的正常运行</li>
                                <li>使用自动化手段（如机器人、爬虫）访问服务</li>
                                <li>冒充他人或虚假陈述您与任何人或实体的关系</li>
                                <li>上传或传输病毒或其他恶意代码</li>
                            </ul>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">8. 服务变更与终止</h3>
                            <p><strong className="text-zinc-300">8.1 服务变更：</strong>我们保留随时修改、暂停或终止服务（或其任何部分）的权利，恕不另行通知。我们不对您或任何第三方因服务的任何修改、暂停或终止承担责任。</p>
                            <p><strong className="text-zinc-300">8.2 条款修改：</strong>我们可能会不时修改本条款。修改后的条款将在本平台上发布时生效。继续使用服务即表示您接受修改后的条款。</p>
                            <p><strong className="text-zinc-300">8.3 账户终止：</strong>我们保留自行决定暂停或终止您的账户的权利，如果我们认为您违反了本条款或从事了不当行为。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">9. 适用法律与争议解决</h3>
                            <p><strong className="text-zinc-300">9.1 适用法律：</strong>本条款受中华人民共和国法律管辖并按其解释，不考虑法律冲突原则。</p>
                            <p><strong className="text-zinc-300">9.2 争议解决：</strong>因本条款或服务引起的或与之相关的任何争议，双方应首先通过友好协商解决。协商不成的，任何一方均可向本平台运营方所在地有管辖权的人民法院提起诉讼。</p>
                            
                            <h3 className="text-white font-semibold text-lg pt-4">10. 联系我们</h3>
                            <p>如果您对本服务条款有任何疑问或意见，请通过以下方式联系我们：</p>
                            <p className="text-zinc-300">电子邮件：hollipembletoncrf40@gmail.com</p>
                            <p className="text-zinc-300">工作时间：周一至周五 9:00-18:00 (北京时间)</p>
                            
                            <div className="border-t border-zinc-800 pt-4 mt-4">
                                <p className="text-zinc-500 text-xs">本条款自发布之日起生效。使用本平台即表示您同意受本条款的约束。</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setView('signup')}
                            className="w-full py-3.5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
                        >
                            我已阅读并同意
                        </button>
                    </div>
                )}

                {/* View: Forgot Password */}
                {view === 'forgot_password' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center space-y-2">
                             <h2 className="text-3xl font-medium text-white tracking-wide">重置密码</h2>
                             <p className="text-zinc-500 text-sm">请输入您的注册邮箱，我们将发送重置链接。</p>
                        </div>

                        {successMsg ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center space-y-4 animate-fade-in">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                                <p className="text-green-500 font-medium">{successMsg}</p>
                                <button 
                                    onClick={() => setView('login')}
                                    className="text-white text-sm hover:underline"
                                >
                                    返回登录
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailAuth} className="space-y-6">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="请输入您的邮箱"
                                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-full font-medium text-lg shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.6)] transition-all"
                                >
                                    {loading ? '发送中...' : '发送重置链接'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setView('login')}
                                    className="w-full text-zinc-500 hover:text-white text-sm transition-colors py-2"
                                >
                                    想起密码了？返回登录
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* View: Login or Signup */}
                {(view === 'login' || view === 'signup') && (
                    <>
                        <div className="text-center space-y-2 animate-fade-in">
                            <h2 className={`text-3xl font-medium tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {view === 'login' ? (t.loginWelcome || '登录您的账户') : (t.signupTitle || '创建新账户')}
                            </h2>
                            <p className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                                {view === 'login' ? '还没有账户？ ' : '已有账户？ '}
                                <button 
                                    onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); }}
                                    className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                                >
                                    {view === 'login' ? (t.signupLink || '注册') : (t.loginLink || '登录')}
                                </button>
                            </p>
                        </div>

                        <div className="space-y-3 pt-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <button 
                                onClick={handleGoogleLogin} disabled={loading}
                                className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full transition-all group ${darkMode ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white' : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900'}`}
                            >
                                {/* Real Google Logo SVG */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span className="text-sm font-medium tracking-wide">使用 Google 登录</span>
                            </button>
                            
                            {/* Email signup button - only show on login view */}
                            {view === 'login' && (
                                <button 
                                    onClick={() => setView('signup')} 
                                    className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full transition-all group ${darkMode ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white' : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900'}`}
                                >
                                    <Mail className="w-5 h-5 text-orange-400" />
                                    <span className="text-sm font-medium tracking-wide">使用邮箱注册</span>
                                </button>
                            )}
                        </div>

                        <div className="relative py-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className={`px-4 ${darkMode ? 'bg-black text-zinc-600' : 'bg-white text-slate-400'}`}>{view === 'login' ? '或使用邮箱登录' : '填写注册信息'}</span></div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {view === 'signup' && (
                                    <>
                                        {/* Avatar Upload */}
                                        <div className="flex justify-center mb-4">
                                            <div 
                                                className="relative cursor-pointer group"
                                                onClick={() => avatarInputRef.current?.click()}
                                            >
                                                <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-dashed ${avatarPreview ? 'border-orange-500' : 'border-zinc-700'} flex items-center justify-center bg-zinc-900 transition-all group-hover:border-orange-400`}>
                                                    {avatarPreview ? (
                                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Camera className="w-8 h-8 text-zinc-500 group-hover:text-zinc-400" />
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1.5 shadow-lg">
                                                    <Camera className="w-3 h-3 text-white" />
                                                </div>
                                                <input
                                                    ref={avatarInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-center text-xs text-zinc-500 -mt-2 mb-2">点击上传头像 (可选)</p>

                                        {/* Nickname */}
                                        <div className="relative group">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="昵称"
                                                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-600"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-zinc-500 group-focus-within:text-white' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="邮箱"
                                        className={`w-full rounded-xl py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all ${darkMode ? 'bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                                    />
                                </div>

                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-zinc-500 group-focus-within:text-white' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="密码"
                                        className={`w-full rounded-xl py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all ${darkMode ? 'bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                                    />
                                </div>
                            </div>

                            {/* Remember Me for Login */}
                            {view === 'login' && (
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div 
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-orange-500 border-orange-500' : darkMode ? 'border-zinc-600 group-hover:border-zinc-400' : 'border-slate-300 group-hover:border-slate-400'}`}
                                        onClick={() => setRememberMe(!rememberMe)}
                                    >
                                        {rememberMe && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={`text-sm ${darkMode ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-slate-500 group-hover:text-slate-600'}`}>记住我</span>
                                </label>
                            )}

                            {/* Terms checkbox for Signup */}
                            {view === 'signup' && (
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div 
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${agreeToTerms ? 'bg-orange-500 border-orange-500' : darkMode ? 'border-zinc-600 group-hover:border-zinc-400' : 'border-slate-300 group-hover:border-slate-400'}`}
                                        onClick={() => setAgreeToTerms(!agreeToTerms)}
                                    >
                                        {agreeToTerms && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={`text-sm ${darkMode ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-slate-500 group-hover:text-slate-600'}`}>
                                        我已阅读并同意
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setView('terms'); }}
                                            className="text-orange-500 hover:text-orange-400 underline ml-1"
                                        >
                                            服务条款
                                        </button>
                                    </span>
                                </label>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-full font-medium text-lg shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
                                <span className="relative z-10">{loading ? 'Processing...' : (view === 'login' ? '登 录' : '创建账户')}</span>
                            </button>
                        </form>

                        <div className="text-center space-y-4 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                             {view === 'login' && (
                                <button 
                                    onClick={() => setView('forgot_password')}
                                    className="text-xs text-red-500/80 hover:text-red-400 transition-colors"
                                >
                                    忘记密码?
                                </button>
                             )}
                             <div className={`flex items-center justify-center gap-4 text-[10px] ${darkMode ? 'text-zinc-600' : 'text-slate-400'}`}>
                                 <button onClick={() => setView('terms')} className={`${darkMode ? 'hover:text-zinc-400' : 'hover:text-slate-600'}`}>服务条款</button>
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

