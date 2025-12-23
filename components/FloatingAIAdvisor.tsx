import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Bot, User, Sparkles, History, Trash2, Plus } from 'lucide-react';
import { ChatMessage, CalculationResult } from '../types'; // Added CalculationResult
import { createInvestmentChat, sendMessageToAI } from '../services/geminiService';
import { Chat } from '@google/genai';

// Simple markdown to HTML converter
const parseMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2 text-slate-800 dark:text-white">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-4 mb-2 text-slate-800 dark:text-white">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-4 mb-2 text-slate-800 dark:text-white">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')  
    // Lists
    .replace(/^\s*- (.*$)/gim, '<li class="ml-4 text-slate-700 dark:text-slate-300">• $1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 text-slate-700 dark:text-slate-300">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
};

interface FloatingAIAdvisorProps {
  t: any;
  contextParams: any; // InvestmentParams
  result?: CalculationResult; // Added result prop
  userPhoto?: string | null; // User's photo URL for logged-in avatar
  userName?: string | null; // User's display name
  isLoggedIn?: boolean; // Whether user is logged in (required for AI advisor)
  onOpenLogin?: () => void; // Callback to open login modal
}

// Parse and extract follow-up questions from AI response
const parseFollowUpQuestions = (content: string): { mainContent: string; questions: string[] } => {
  // Look for the follow-up questions section - must find the 💡 marker after ---
  // Pattern: --- followed by 💡 or "还想了解" or "继续追问"
  const followUpPatterns = [
    /\n---\s*\n[^\n]*💡[^\n]*/,
    /\n---\s*\n[^\n]*还想了解[^\n]*/,
    /\n---\s*\n[^\n]*继续追问[^\n]*/,
    /\n---\s*\n[^\n]*您可能[^\n]*/
  ];
  
  let dividerIdx = -1;
  for (const pattern of followUpPatterns) {
    const match = content.match(pattern);
    if (match && match.index !== undefined) {
      dividerIdx = match.index;
      break;
    }
  }
  
  // If no follow-up section found, return full content
  if (dividerIdx === -1) {
    return { mainContent: content, questions: [] };
  }
  
  const mainContent = content.substring(0, dividerIdx).trim();
  const questionsSection = content.substring(dividerIdx);
  
  // Extract questions - look for numbered items
  const questionMatches = questionsSection.match(/(?:\d+)[\.、）\)]\s*([^\n？?]+[？?])/g);
  
  if (questionMatches && questionMatches.length > 0) {
    const questions = questionMatches.map(q => {
      return q
        .replace(/^\s*\d+[\.、）\)]\s*/, '')  // Remove leading number
        .replace(/\*\*/g, '')                 // Remove bold markers
        .replace(/\*/g, '')                   // Remove italic markers
        .trim();
    }).filter(q => q.length >= 5 && q.length <= 50);
    
    return { mainContent, questions: questions.slice(0, 5) };
  }
  
  return { mainContent, questions: [] };
};

// Professional AI advisor avatar (realistic female advisor)
const AI_ADVISOR_AVATAR = '/ai-advisor-avatar.png';

const FloatingAIAdvisor: React.FC<FloatingAIAdvisorProps> = ({ t, contextParams, result, userPhoto, userName, isLoggedIn = false, onOpenLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', content: t.aiWelcome.replace('{price}', contextParams.totalPrice).replace('{cost}', (contextParams.totalPrice * contextParams.downPaymentRatio / 100).toFixed(0)), timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'error' | 'needs-vpn'>('online');
  const [showConfigTips, setShowConfigTips] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // History feature
  const [showHistory, setShowHistory] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{id: string; title: string; messages: ChatMessage[]; timestamp: number}[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>(Date.now().toString());

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-advisor-history');
    if (savedHistory) {
      try {
        setConversationHistory(JSON.parse(savedHistory));
      } catch { /* ignore */ }
    }
  }, []);

  // Save current conversation to history
  const saveConversation = () => {
    if (messages.length <= 1) return; // Don't save if only welcome message
    
    const title = messages.find(m => m.role === 'user')?.content.slice(0, 30) + '...' || '新对话';
    const conversation = {
      id: currentConversationId,
      title,
      messages: messages,
      timestamp: Date.now()
    };
    
    const newHistory = [conversation, ...conversationHistory.filter(h => h.id !== currentConversationId)].slice(0, 20); // Keep last 20
    setConversationHistory(newHistory);
    localStorage.setItem('ai-advisor-history', JSON.stringify(newHistory));
  };

  // Auto-save when messages change
  useEffect(() => {
    if (messages.length > 1) {
      saveConversation();
    }
  }, [messages]);

  // Load a conversation from history
  const loadConversation = (id: string) => {
    const conv = conversationHistory.find(h => h.id === id);
    if (conv) {
      setMessages(conv.messages);
      setCurrentConversationId(id);
      setShowHistory(false);
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    setCurrentConversationId(Date.now().toString());
    setMessages([
      { id: 'welcome', role: 'model', content: t.aiWelcome.replace('{price}', contextParams.totalPrice).replace('{cost}', (contextParams.totalPrice * contextParams.downPaymentRatio / 100).toFixed(0)), timestamp: Date.now() }
    ]);
    setChatSession(null);
    setShowHistory(false);
  };

  // Delete a conversation
  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = conversationHistory.filter(h => h.id !== id);
    setConversationHistory(newHistory);
    localStorage.setItem('ai-advisor-history', JSON.stringify(newHistory));
  };
  
  // Text selection feature
  const [selectedText, setSelectedText] = useState('');
  const [selectionPopup, setSelectionPopup] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  // Listen for text selection
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // Don't trigger if we're inside the AI advisor
      const target = e.target as HTMLElement;
      if (target.closest('.ai-advisor-container')) return;
      
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        
        if (text && text.length > 2 && text.length < 500) {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();
          
          if (rect) {
            setSelectedText(text);
            setSelectionPopup({
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
              visible: true
            });
          }
        } else {
          setSelectionPopup(prev => ({ ...prev, visible: false }));
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.selection-popup')) {
        setSelectionPopup(prev => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleAskAboutSelection = () => {
    const query = `请解释并详细说明以下内容：\n\n"${selectedText}"\n\n包括：这是什么意思？有什么重要性？对我的购房决策有什么影响？`;
    setInput(query);
    setIsOpen(true);
    setSelectionPopup(prev => ({ ...prev, visible: false }));
    
    // Auto-send after opening
    setTimeout(() => {
      const sendBtn = document.querySelector('.ai-send-btn') as HTMLButtonElement;
      if (sendBtn) sendBtn.click();
    }, 300);
  };

  // Drag state - use left/top for smoother performance
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hadDraggedRef = useRef(false); // Track if user actually dragged (vs just clicked)
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Drag event handlers - smooth version
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    };
    hadDraggedRef.current = false; // Reset on new drag start
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      // Track if user actually dragged (moved more than 5px)
      const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dragDistance > 5) {
        hadDraggedRef.current = true;
      }
      
      const newX = dragStartRef.current.posX + deltaX;
      const newY = dragStartRef.current.posY + deltaY;
      
      // Keep within bounds
      const width = containerRef.current?.offsetWidth || 56;
      const height = containerRef.current?.offsetHeight || 56;
      
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - width)),
        y: Math.max(0, Math.min(newY, window.innerHeight - height))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // Resize state - larger default for better UX
  const [size, setSize] = useState({ width: 440, height: 600 }); // Wider and taller for more content
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    };
    setResizeDirection(direction);
    setIsResizing(true);
  };

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      const minW = 320;
      const minH = 300;
      const maxW = window.innerWidth - 40;
      const maxH = window.innerHeight - 40;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newX = resizeStartRef.current.posX;
      let newY = resizeStartRef.current.posY;

      if (resizeDirection.includes('e')) {
        newWidth = Math.max(minW, Math.min(maxW, resizeStartRef.current.width + deltaX));
      }
      if (resizeDirection.includes('w')) {
        const widthChange = -deltaX;
        newWidth = Math.max(minW, Math.min(maxW, resizeStartRef.current.width + widthChange));
        newX = resizeStartRef.current.posX + (resizeStartRef.current.width - newWidth);
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(minH, Math.min(maxH, resizeStartRef.current.height + deltaY));
      }
      if (resizeDirection.includes('n')) {
        const heightChange = -deltaY;
        newHeight = Math.max(minH, Math.min(maxH, resizeStartRef.current.height + heightChange));
        newY = resizeStartRef.current.posY + (resizeStartRef.current.height - newHeight);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) });
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove, { passive: true });
      document.addEventListener('mouseup', handleResizeUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeUp);
      if (!isDragging) document.body.style.userSelect = '';
    };
  }, [isResizing, resizeDirection, isDragging]);

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
        // Fallback if chat session init failed or not ready - this is an error state
        responseText = "⚠️ AI 服务未能初始化\n\n💡 解决方案：\n1. 点击右上角 ⚙️ 设置配置 API Key\n2. Gemini/OpenAI/Claude 需要 VPN\n3. 推荐使用国内 AI（通义/DeepSeek/硅基流动）";
        setApiStatus('error');
        setShowConfigTips(true);
        // Try to re-init
        if (result) {
           const chat = await createInvestmentChat(contextParams, result);
           if (chat) {
             setChatSession(chat);
             setApiStatus('online');
           }
        }
      }
      
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
      setApiStatus('online');
    } catch (error: any) {
      // Enhanced error handling with helpful tips
      const errorMessage = error?.message?.toLowerCase() || '';
      let userFriendlyMessage = t.aiError || 'AI 服务暂时不可用';
      
      // Check for API key related errors
      if (errorMessage.includes('api key') || errorMessage.includes('api_key') || 
          errorMessage.includes('401') || errorMessage.includes('403') || 
          errorMessage.includes('invalid') || errorMessage.includes('unauthorized')) {
        userFriendlyMessage = '❌ API Key 无效或未配置\n\n💡 解决方案：\n1. 点击右上角 ⚙️ 设置配置您的 API Key\n2. Gemini/OpenAI/Claude 需要 VPN 环境\n3. 推荐使用国内 AI：通义千问、DeepSeek、硅基流动（无需VPN）';
        setApiStatus('error');
        setShowConfigTips(true);
      } 
      // Check for network related errors
      else if (errorMessage.includes('network') || errorMessage.includes('fetch') || 
               errorMessage.includes('econnrefused') || errorMessage.includes('timeout') ||
               errorMessage.includes('failed to fetch') || errorMessage.includes('cors')) {
        userFriendlyMessage = '🌐 网络连接失败\n\n💡 可能原因：\n1. Gemini/OpenAI/Claude 需要 VPN 环境\n2. 请检查网络连接\n3. 推荐切换至国内 AI（通义/DeepSeek/硅基流动）';
        setApiStatus('needs-vpn');
        setShowConfigTips(true);
      }
      // Generic error fallback - also update status
      else {
        userFriendlyMessage = `⚠️ AI 服务连接失败\n\n💡 可能原因：\n1. 当前地区不支持该服务，请使用 VPN\n2. API Key 未配置或无效\n3. 推荐切换至国内 AI（通义/DeepSeek/硅基流动）\n\n点击右上角 ⚙️ 设置进行配置`;
        setApiStatus('error');
        setShowConfigTips(true);
      }
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', content: userFriendlyMessage, timestamp: Date.now() }]);
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

  // Handle floating ball click - require login
  const handleFloatingBallClick = () => {
    if (hadDraggedRef.current) return;
    
    if (!isLoggedIn) {
      // Show login required message and open login modal
      if (onOpenLogin) {
        onOpenLogin();
      }
      return;
    }
    
    // Adjust position to ensure chat panel is visible (expand towards upper-left)
    const panelWidth = size.width;
    const panelHeight = size.height;
    const margin = 20;
    
    // Calculate new position so panel doesn't go off screen
    let newX = position.x;
    let newY = position.y;
    
    // If panel would extend past right edge, move it left
    if (position.x + panelWidth > window.innerWidth - margin) {
      newX = Math.max(margin, window.innerWidth - panelWidth - margin);
    }
    
    // If panel would extend past bottom edge, move it up
    if (position.y + panelHeight > window.innerHeight - margin) {
      newY = Math.max(margin, window.innerHeight - panelHeight - margin);
    }
    
    setPosition({ x: newX, y: newY });
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <>
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onClick={handleFloatingBallClick}
          style={{ left: position.x, top: position.y }}
          className={`fixed w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group border-3 border-white/40 ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:scale-110 transition-transform'}`}
        >
          <img src={AI_ADVISOR_AVATAR} alt="AI Advisor" className="w-full h-full object-cover rounded-full pointer-events-none" />
          {/* Online indicator */}
          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white pointer-events-none ${isLoggedIn ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
          {/* Tooltip */}
          {!isDragging && (
            <div 
              className={`absolute top-1/2 -translate-y-1/2 px-4 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity text-sm pointer-events-none w-max
                ${position.x < (window.innerWidth / 2) ? 'left-full ml-4' : 'right-full mr-4'}
              `}
            >
              {isLoggedIn ? (
                <div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">Hi~ 👋</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">我是小慧，您的智能投资助手！点我开始对话~</div>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">Hi，你好！👋</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">我是你的智能AI投资助手小慧！</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">🔒 登录后即可使用</div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Text Selection Popup */}
        {selectionPopup.visible && (
          <div 
            className="selection-popup fixed z-[100] animate-fade-in"
            style={{ 
              left: selectionPopup.x, 
              top: selectionPopup.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <button
              onClick={handleAskAboutSelection}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105"
            >
              <Bot className="h-4 w-4" />
              问 AI 顾问
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-indigo-600" />
          </div>
        )}
      </>
    );
  }

  return (
    <>
    <div 
      ref={containerRef}
      style={{ 
        left: position.x, 
        top: position.y,
        width: isMinimized ? 288 : size.width,
        height: isMinimized ? 56 : size.height
      }}
      className={`ai-advisor-container fixed bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden ${(isDragging || isResizing) ? '' : 'transition-all duration-200'}`}
    >
      {/* Resize Handles - only show when not minimized */}
      {!isMinimized && (
        <>
          {/* Edge handles */}
          <div className="absolute top-0 left-4 right-4 h-1 cursor-n-resize hover:bg-indigo-400/30" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize hover:bg-indigo-400/30" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize hover:bg-indigo-400/30" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize hover:bg-indigo-400/30" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
          {/* Corner handles */}
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-indigo-400/20 rounded-br-2xl" onMouseDown={(e) => handleResizeMouseDown(e, 'se')}>
            {/* Visual indicator for SE corner */}
            <svg className="w-3 h-3 absolute bottom-1 right-1 text-slate-400" viewBox="0 0 10 10">
              <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </>
      )}
      {/* Header - Draggable */}
      <div 
        className={`bg-indigo-600 ${isMinimized ? 'p-3' : 'p-4'} flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing select-none`}
        onMouseDown={handleMouseDown}
      >
        <div className={`flex items-center gap-2 text-white ${isMinimized ? 'min-w-0 flex-1' : ''}`}>
          <Bot className={`${isMinimized ? 'h-4 w-4' : 'h-5 w-5'} shrink-0`} />
          <span className={`font-bold ${isMinimized ? 'text-sm truncate' : ''}`}>{isMinimized ? 'AI 顾问' : t.aiTitle}</span>
          {!isMinimized && (
            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
              apiStatus === 'online' ? 'bg-indigo-500' : 
              apiStatus === 'needs-vpn' ? 'bg-amber-500' : 'bg-rose-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                apiStatus === 'online' ? 'bg-green-400 animate-pulse' : 
                apiStatus === 'needs-vpn' ? 'bg-amber-200' : 'bg-rose-200'
              }`}></span>
              {apiStatus === 'online' ? t.aiOnline : apiStatus === 'needs-vpn' ? '需VPN' : '需配置'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-indigo-100">
          <button 
            onClick={(e) => { e.stopPropagation(); startNewConversation(); }}
            className="p-1 hover:bg-indigo-500 rounded transition-colors"
            title="新对话"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
            className={`p-1 hover:bg-indigo-500 rounded transition-colors ${showHistory ? 'bg-indigo-500' : ''}`}
            title="历史记录"
          >
            <History className="h-4 w-4" />
          </button>
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
          {/* History Panel */}
          {showHistory ? (
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">历史对话</span>
                <span className="text-xs text-slate-500">{conversationHistory.length} 条记录</span>
              </div>
              {conversationHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无历史对话</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {conversationHistory.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversation(conv.id)}
                      className={`p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group ${conv.id === currentConversationId ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                            {conv.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {conv.messages.length} 条消息 · {new Date(conv.timestamp).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteConversation(conv.id, e)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 transition-all"
                          title="删除"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
          /* Messages */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {/* Configuration Tips Panel */}
            {showConfigTips && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">💡 AI 顾问配置提示</p>
                    <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                      <p>• <strong>Gemini/OpenAI/Claude</strong>：需要 VPN 环境才能访问</p>
                      <p>• <strong>通义千问/文心一言</strong>：国内 AI，无需 VPN</p>
                      <p>• 请在 <strong>设置 → API Key</strong> 中配置您的密钥</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowConfigTips(false)}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar - Messenger style (smaller, at bottom of bubble) */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                    : ''
                }`}>
                  {msg.role === 'user' ? (
                    userPhoto ? (
                      <img src={userPhoto} alt={userName || '我'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )
                  ) : (
                    <img src={AI_ADVISOR_AVATAR} alt="小慧" className="w-full h-full object-cover rounded-full" />
                  )}
                </div>
                {/* Message bubble - Messenger style */}
                <div className="flex flex-col gap-1 max-w-[75%]">
                  {/* Sender name for AI */}
                  {msg.role === 'model' && idx === 0 && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">小慧 · AI 投资顾问</span>
                  )}
                  <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl rounded-br-md shadow-sm' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700'
                  }`}>
                  {msg.role === 'model' ? (() => {
                    const { mainContent, questions } = parseFollowUpQuestions(msg.content);
                    return (
                      <>
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none" 
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(mainContent) }}
                        />
                        {questions.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              您可能还想了解：
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {questions.map((q, qIdx) => (
                                <button
                                  key={qIdx}
                                  onClick={() => {
                                    setInput(q);
                                    // Auto-send after a short delay for better UX
                                    setTimeout(() => {
                                      const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                                      if (inputEl) inputEl.focus();
                                    }, 100);
                                  }}
                                  className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors border border-indigo-200 dark:border-indigo-800 text-left"
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })() : (
                    <span>{msg.content}</span>
                  )}
                  </div>
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
          )}
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
                className="ai-send-btn absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <button onClick={() => setInput("房子评价我")} className="text-xs px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 rounded-lg transition-colors whitespace-nowrap border border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600 font-medium">
                🏠 房子评价我
              </button>
            </div>
          </div>
        </>
      )}
    </div>

      {/* Text Selection Popup */}
      {selectionPopup.visible && (
        <div 
          className="selection-popup fixed z-[100] animate-fade-in"
          style={{ 
            left: selectionPopup.x, 
            top: selectionPopup.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={handleAskAboutSelection}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105"
          >
            <Bot className="h-4 w-4" />
            问 AI 顾问
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-indigo-600" />
        </div>
      )}
    </>
  );
};

export default FloatingAIAdvisor;
