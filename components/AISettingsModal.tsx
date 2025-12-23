import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle } from 'lucide-react';
import { AIProvider, loadAIConfig, saveAIConfig, getProviderName, DEFAULT_MODELS } from '../utils/aiProvider';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, t }) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('gemini');
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    gemini: '',
    claude: '',
    openai: '',
    deepseek: '',
    qwen: '',
    moonshot: '',
    siliconflow: '',
    zhipu: '',
    grok: '',
    xiaomi: '',
    custom: ''
  });
  const [models, setModels] = useState<Record<AIProvider, string>>({
    gemini: DEFAULT_MODELS.gemini,
    claude: DEFAULT_MODELS.claude,
    openai: DEFAULT_MODELS.openai,
    deepseek: DEFAULT_MODELS.deepseek,
    qwen: DEFAULT_MODELS.qwen,
    moonshot: DEFAULT_MODELS.moonshot,
    siliconflow: DEFAULT_MODELS.siliconflow,
    zhipu: DEFAULT_MODELS.zhipu,
    grok: DEFAULT_MODELS.grok,
    xiaomi: DEFAULT_MODELS.xiaomi,
    custom: DEFAULT_MODELS.custom
  });
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load saved configuration
      const config = loadAIConfig();
      setSelectedProvider(config.provider);
      
      // Load all API keys from localStorage
      const providerIds: AIProvider[] = ['gemini', 'claude', 'openai', 'deepseek', 'qwen', 'moonshot', 'siliconflow', 'zhipu', 'grok', 'xiaomi', 'custom'];
      const loadedKeys: Record<AIProvider, string> = {} as Record<AIProvider, string>;
      const loadedModels: Record<AIProvider, string> = {} as Record<AIProvider, string>;
      
      providerIds.forEach(provider => {
        loadedKeys[provider] = localStorage.getItem(`${provider}_api_key`) || '';
        loadedModels[provider] = localStorage.getItem(`${provider}_model`) || DEFAULT_MODELS[provider];
      });
      
      setApiKeys(loadedKeys);
      setModels(loadedModels);
      setCustomEndpoint(localStorage.getItem('custom_api_endpoint') || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    // Save selected provider and its configuration
    saveAIConfig({
      provider: selectedProvider,
      apiKey: apiKeys[selectedProvider],
      model: models[selectedProvider]
    });
    
    // Save all API keys
    Object.entries(apiKeys).forEach(([provider, key]) => {
      if (key) {
        localStorage.setItem(`${provider}_api_key`, key);
      }
    });
    
    // Save all models
    Object.entries(models).forEach(([provider, model]) => {
      localStorage.setItem(`${provider}_model`, model);
    });
    
    // Save custom endpoint if set
    if (customEndpoint) {
      localStorage.setItem('custom_api_endpoint', customEndpoint);
    }
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  const handleClear = (provider: AIProvider) => {
    setApiKeys(prev => ({ ...prev, [provider]: '' }));
    localStorage.removeItem(`${provider}_api_key`);
  };

  const providers: { id: AIProvider; name: string; description: string; placeholder: string; needsVPN?: boolean; apiLink?: string }[] = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: '强大的多模态模型，支持长上下文',
      placeholder: 'AIza...',
      needsVPN: true,
      apiLink: 'https://aistudio.google.com/app/apikey'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      description: '擅长分析和推理的AI助手',
      placeholder: 'sk-ant-...',
      needsVPN: true,
      apiLink: 'https://console.anthropic.com/'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      description: '最流行的对话AI模型',
      placeholder: 'sk-...',
      needsVPN: true,
      apiLink: 'https://platform.openai.com/api-keys'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      description: '高性价比的国产大模型',
      placeholder: 'sk-...',
      needsVPN: false,
      apiLink: 'https://platform.deepseek.com/api_keys'
    },
    {
      id: 'qwen',
      name: '通义千问',
      description: '阿里云 AI，国内直连无需VPN',
      placeholder: 'sk-...',
      needsVPN: false,
      apiLink: 'https://dashscope.console.aliyun.com/apiKey'
    },
    {
      id: 'moonshot',
      name: 'Moonshot (Kimi)',
      description: '高性能长文本处理，国内直连',
      placeholder: 'sk-...',
      needsVPN: false,
      apiLink: 'https://platform.moonshot.cn/console/api-keys'
    },
    {
      id: 'siliconflow',
      name: '硅基流动',
      description: '多模型中转站，免费额度充足',
      placeholder: 'sk-...',
      needsVPN: false,
      apiLink: 'https://cloud.siliconflow.cn/account/ak'
    },
    {
      id: 'zhipu',
      name: '智谱 GLM',
      description: '清华系大模型，国内直连',
      placeholder: 'sk-...',
      needsVPN: false,
      apiLink: 'https://open.bigmodel.cn/usercenter/apikeys'
    },
    {
      id: 'grok',
      name: 'Grok (xAI)',
      description: '马斯克 xAI 模型，需VPN',
      placeholder: 'xai-...',
      needsVPN: true,
      apiLink: 'https://console.x.ai/'
    },
    {
      id: 'xiaomi',
      name: '小米 MiMo',
      description: '小米大模型，国内直连',
      placeholder: 'sk-...',
      needsVPN: false,
      apiLink: 'https://platform.xiaomimimo.com/#/docs/welcome'
    },
    {
      id: 'custom',
      name: '自定义/中转站',
      description: '兼容 OpenAI 格式的第三方 API',
      placeholder: 'sk-...',
      needsVPN: false
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                <Key className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.settingsTitle || 'AI 模型设置'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.settingsDesc || '配置您的 AI 助手'}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Provider Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-white mb-3">
              {t.selectProvider || '选择 AI 模型'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {providers.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedProvider === provider.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{provider.name}</h4>
                    {apiKeys[provider.id] && (
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{provider.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Configuration */}
          <div className="space-y-4">
            {providers.map(provider => (
              <div
                key={provider.id}
                className={`transition-all ${
                  selectedProvider === provider.id ? 'block' : 'hidden'
                }`}
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {provider.name} API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKeys[provider.id]}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                    placeholder={provider.placeholder}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-24 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                  />
                  {apiKeys[provider.id] && (
                    <button
                      onClick={() => handleClear(provider.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                      {t.clear || '清除'}
                    </button>
                  )}
                </div>

                {/* Model Selection */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t.model || '模型'}
                  </label>
                  <input
                    type="text"
                    value={models[provider.id]}
                    onChange={(e) => setModels(prev => ({ ...prev, [provider.id]: e.target.value }))}
                    placeholder={DEFAULT_MODELS[provider.id]}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {t.defaultModel || '默认'}: {DEFAULT_MODELS[provider.id]}
                  </p>
                </div>

                {/* API Key Tips */}
                <div className={`mt-3 p-3 rounded-lg border ${provider.needsVPN ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900'}`}>
                  <div className="flex gap-2">
                    <AlertCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${provider.needsVPN ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`} />
                    <div className={`text-xs ${provider.needsVPN ? 'text-amber-700 dark:text-amber-300' : 'text-blue-700 dark:text-blue-300'}`}>
                      {provider.needsVPN && (
                        <p className="font-bold text-amber-600 dark:text-amber-400 mb-1">⚠️ 需要 VPN 环境才能访问</p>
                      )}
                      {!provider.needsVPN && (
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 国内直连，无需 VPN</p>
                      )}
                      <p className="font-medium mb-1">{t.howToGetKey || '如何获取 API Key'}:</p>
                      {provider.apiLink ? (
                        <a href={provider.apiLink} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                          {provider.name} 官网获取 →
                        </a>
                      ) : (
                        <p className="text-slate-500">自定义端点需兼容 OpenAI 格式</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Endpoint Input (only for custom provider) */}
                {provider.id === 'custom' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      API 端点 (Endpoint)
                    </label>
                    <input
                      type="text"
                      value={customEndpoint}
                      onChange={(e) => setCustomEndpoint(e.target.value)}
                      placeholder="https://your-proxy.com/v1/chat/completions"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      支持 OpenRouter、One-api、New-api 等中转站
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.cancel || '取消'}
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKeys[selectedProvider]}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  {t.saved || '已保存'}
                </>
              ) : (
                t.save || '保存设置'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettingsModal;
