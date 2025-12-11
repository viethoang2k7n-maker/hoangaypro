import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, RefreshCw, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GenerateContentResponse } from '@google/genai';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Xin chào! Mình là SmartStudy AI. Bạn cần giúp đỡ gì về bài tập hay lập trình hôm nay?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null); // Keep session consistent

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Create a placeholder message for the model response
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date(),
      }]);

      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
            fullText += text;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMsgId ? { ...msg, text: fullText } : msg
            ));
        }
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Trợ Lý SmartStudy</h3>
                <p className="text-blue-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online • Gemini 2.5 Flash
                </p>
            </div>
        </div>
        <button 
            onClick={() => {
                setMessages([]);
                chatSessionRef.current = createChatSession();
            }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Cuộc trò chuyện mới"
        >
            <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
                {msg.role === 'model' && !msg.text ? (
                    <div className="flex gap-1 items-center h-5 px-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    </div>
                ) : (
                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                         <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về Java, Python, hoặc bài tập..."
                className="w-full p-3 pr-12 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none max-h-32 shadow-inner"
                rows={1}
                style={{ minHeight: '48px' }}
            />
            <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"
            >
                {isTyping ? <StopCircle className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
            </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
            AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
        </p>
      </div>
    </div>
  );
};
