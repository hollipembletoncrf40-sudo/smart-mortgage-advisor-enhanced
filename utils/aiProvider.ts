// AI Provider Configuration and API Integration
export type AIProvider = 'gemini' | 'claude' | 'openai' | 'deepseek';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Default models for each provider
export const DEFAULT_MODELS = {
  gemini: 'gemini-1.5-flash',
  claude: 'claude-3-5-sonnet-20241022',
  openai: 'gpt-4o-mini',
  deepseek: 'deepseek-chat'
};

// API endpoints
const API_ENDPOINTS = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
  claude: 'https://api.anthropic.com/v1/messages',
  openai: 'https://api.openai.com/v1/chat/completions',
  deepseek: 'https://api.deepseek.com/v1/chat/completions'
};

/**
 * Send a chat message to the configured AI provider
 */
export async function sendAIMessage(
  config: AIConfig,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const { provider, apiKey, model = DEFAULT_MODELS[provider] } = config;

  if (!apiKey) {
    throw new Error(`No API key configured for ${provider}`);
  }

  switch (provider) {
    case 'gemini':
      return sendGeminiMessage(apiKey, model, messages, systemPrompt);
    case 'claude':
      return sendClaudeMessage(apiKey, model, messages, systemPrompt);
    case 'openai':
      return sendOpenAIMessage(apiKey, model, messages, systemPrompt);
    case 'deepseek':
      return sendDeepSeekMessage(apiKey, model, messages, systemPrompt);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Gemini API integration
 */
async function sendGeminiMessage(
  apiKey: string,
  model: string,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const url = `${API_ENDPOINTS.gemini}/${model}:generateContent?key=${apiKey}`;
  
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const requestBody: any = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  if (systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Claude API integration
 */
async function sendClaudeMessage(
  apiKey: string,
  model: string,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const url = API_ENDPOINTS.claude;
  
  const requestBody: any = {
    model,
    max_tokens: 2048,
    messages: messages.map(msg => ({
      role: msg.role === 'system' ? 'user' : msg.role,
      content: msg.content
    }))
  };

  if (systemPrompt) {
    requestBody.system = systemPrompt;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * OpenAI API integration
 */
async function sendOpenAIMessage(
  apiKey: string,
  model: string,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const url = API_ENDPOINTS.openai;
  
  const chatMessages = [...messages];
  if (systemPrompt) {
    chatMessages.unshift({ role: 'system', content: systemPrompt });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * DeepSeek API integration (OpenAI-compatible)
 */
async function sendDeepSeekMessage(
  apiKey: string,
  model: string,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const url = API_ENDPOINTS.deepseek;
  
  const chatMessages = [...messages];
  if (systemPrompt) {
    chatMessages.unshift({ role: 'system', content: systemPrompt });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Load AI configuration from localStorage
 */
export function loadAIConfig(): AIConfig {
  const provider = (localStorage.getItem('ai_provider') as AIProvider) || 'gemini';
  const apiKey = localStorage.getItem(`${provider}_api_key`) || '';
  const model = localStorage.getItem(`${provider}_model`) || DEFAULT_MODELS[provider];
  
  return { provider, apiKey, model };
}

/**
 * Save AI configuration to localStorage
 */
export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem('ai_provider', config.provider);
  localStorage.setItem(`${config.provider}_api_key`, config.apiKey);
  if (config.model) {
    localStorage.setItem(`${config.provider}_model`, config.model);
  }
}

/**
 * Get provider display name
 */
export function getProviderName(provider: AIProvider): string {
  const names = {
    gemini: 'Google Gemini',
    claude: 'Anthropic Claude',
    openai: 'OpenAI GPT',
    deepseek: 'DeepSeek'
  };
  return names[provider];
}
