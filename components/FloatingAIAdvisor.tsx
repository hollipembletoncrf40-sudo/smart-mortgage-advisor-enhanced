import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, CalculationResult } from '../types'; // Added CalculationResult
import { createInvestmentChat, sendMessageToAI } from '../services/geminiService';
import { Chat } from '@google/genai';

interface FloatingAIAdvisorProps {
  t: any;
  contextParams: any; // InvestmentParams
  result?: CalculationResult; // Added result prop
}

const FloatingAIAdvisor: React.FC<FloatingAIAdvisorProps> = ({ t, contextParams, result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', content: t.aiWelcome.replace('{price}', contextParams.totalPrice).replace('{cost}', (contextParams.totalPrice * contextParams.downPaymentRatio / 100).toFixed(0)), timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize chat session when opened or params change
  useEffect(() => {
    if (isOpen && !chatSession && result) {
      const initChat = async () => {
        const chat = await createInvestmentChat(contextParams, result);
        if (chat) {
          setChatSession(chat);
        }
      };
      initChat();
    }
  }, [isOpen, contextParams, result]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      if (chatSession) {
        responseText = await sendMessageToAI(chatSession, input);
      } else {
        // Fallback if chat session init failed or not ready
        responseText = "AI 服务正在初始化，请稍后再试。";
        // Try to re-init
        if (result) {
           const chat = await createInvestmentChat(contextParams, result);
           if (chat) setChatSession(chat);
        }
      }
      
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', content: t.aiError, timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
      >
        <Bot className="h-8 w-8" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        <div className="absolute right-full mr-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm font-medium pointer-events-none">
          {t.aiTitle || 'AI 顾问在线'}
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 z-50 overflow-hidden ${isMinimized ? 'w-72 h-14' : 'w-80 md:w-96 h-[500px]'}`}>
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center justify-between shrink-0 cursor-pointer" onClick={() => !isMinimized && setIsMinimized(true)}>
        <div className="flex items-center gap-2 text-white">
          <Bot className="h-5 w-5" />
          <span className="font-bold">{t.aiTitle}</span>
          <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            {t.aiOnline}
          </span>
        </div>
        <div className="flex items-center gap-2 text-indigo-100">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="p-1 hover:bg-indigo-500 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="p-1 hover:bg-indigo-500 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-100 dark:bg-indigo-900/50'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4 text-slate-600 dark:text-slate-300" /> : <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t.aiPlaceholderAsk || "Ask me anything..."}
                className="w-full pl-4 pr-10 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => setInput(t.aiMsgReport)} className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors whitespace-nowrap border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800">
                Generate Report
              </button>
              <button onClick={() => setInput(t.aiMsgCompare)} className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors whitespace-nowrap border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800">
                Buy vs Invest
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingAIAdvisor;
