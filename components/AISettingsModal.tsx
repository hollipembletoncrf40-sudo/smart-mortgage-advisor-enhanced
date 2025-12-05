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
    deepseek: ''
  });
  const [models, setModels] = useState<Record<AIProvider, string>>({
    gemini: DEFAULT_MODELS.gemini,
    claude: DEFAULT_MODELS.claude,
    openai: DEFAULT_MODELS.openai,
    deepseek: DEFAULT_MODELS.deepseek
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load saved configuration
      const config = loadAIConfig();
      setSelectedProvider(config.provider);
      
      // Load all API keys from localStorage
      const providers: AIProvider[] = ['gemini', 'claude', 'openai', 'deepseek'];
      const loadedKeys: Record<AIProvider, string> = {} as any;
      const loadedModels: Record<AIProvider, string> = {} as any;
      
      providers.forEach(provider => {
        loadedKeys[provider] = (localStorage.getItem(`${provider}_api_key`) || '') as string;
        loadedModels[provider] = (localStorage.getItem(`${provider}_model`) || DEFAULT_MODELS[provider]) as string;
      });
      
      setApiKeys(loadedKeys);
      setModels(loadedModels);
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

  const providers: { id: AIProvider; name: string; description: string; placeholder: string }[] = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: '强大的多模态模型，支持长上下文',
      placeholder: 'AIza...'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      description: '擅长分析和推理的AI助手',
      placeholder: 'sk-ant-...'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      description: '最流行的对话AI模型',
      placeholder: 'sk-...'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      description: '高性价比的国产大模型',
      placeholder: 'sk-...'
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
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">{t.howToGetKey || '如何获取 API Key'}:</p>
                      {provider.id === 'gemini' && (
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 dark:hover:text-blue-200">
                          Google AI Studio →
                        </a>
                      )}
                      {provider.id === 'claude' && (
                        <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 dark:hover:text-blue-200">
                          Anthropic Console →
                        </a>
                      )}
                      {provider.id === 'openai' && (
                        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 dark:hover:text-blue-200">
                          OpenAI Platform →
                        </a>
                      )}
                      {provider.id === 'deepseek' && (
                        <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 dark:hover:text-blue-200">
                          DeepSeek Platform →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
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
