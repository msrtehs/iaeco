import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowRight, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage, ViewState } from '../types';

interface ChatAssistantProps {
  setView: (view: ViewState) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ setView }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Olá! Sou o Assistente Eco 🤖. Como posso ajudar você hoje? Pode perguntar sobre reciclagem, horários de coleta ou como descartar itens específicos.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    // Timeout ensures layout calculates after keyboard opens/screen resizes
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Keep focus on mobile to allow continuous typing, or blur to close keyboard? 
    // Usually keeping focus is better for chat.
    inputRef.current?.focus();

    try {
      const response = await getChatResponse(input);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        actions: response.actions
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Error handling is inside service
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Onde descarto pilhas?",
    "Isopor é reciclável?",
    "Quero pedir coleta",
    "Dia da coleta no Centro"
  ];

  return (
    /* 
      Mobile Height Fix: 
      h-[calc(100dvh-6rem)] ensures it fits perfectly between the top header (App.tsx pt-20) 
      and the bottom safe area, preventing double scrollbars.
    */
    <div className="w-full max-w-4xl mx-auto h-[calc(100dvh-6.5rem)] md:h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Header */}
      <div className="bg-green-700 p-3 text-white flex items-center shadow-md z-10 shrink-0">
        <div className="bg-white/20 p-2 rounded-full mr-3">
          <Bot size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <h2 className="font-bold text-base md:text-lg">Assistente Eco</h2>
          <p className="text-green-200 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-slate-50 scroll-smooth overscroll-contain">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-sm relative text-[15px] md:text-base leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
            `}>
              <div className="flex items-start gap-2">
                {msg.role === 'assistant' && <Bot size={16} className="text-green-600 mt-1 shrink-0" />}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {/* Action Buttons in Chat */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {msg.actions.map((act, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        if (act.action === 'goto_request') setView('request');
                      }}
                      className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl font-semibold hover:bg-green-100 active:bg-green-200 transition-colors flex items-center"
                    >
                      {act.label}
                      <ArrowRightIcon className="ml-1 w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-2">
                <Loader2 className="animate-spin text-green-600" size={16} />
                <span className="text-xs text-gray-500 font-medium">Digitando...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 md:p-4 bg-white border-t border-gray-100 shrink-0 safe-area-bottom">
        {/* Quick Questions - Scrollable Chips */}
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 px-1 scrollbar-hide -mx-1">
            {quickQuestions.map((q, i) => (
              <button 
                key={i}
                onClick={() => setInput(q)}
                className="shrink-0 bg-gray-50 active:bg-green-100 text-gray-600 active:text-green-800 text-xs font-medium px-4 py-2 rounded-full border border-gray-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onFocus={scrollToBottom}
            placeholder="Digite sua dúvida..."
            /* text-base prevents iOS zoom on focus */
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 max-h-32"
            enterKeyHint="send"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white p-3 rounded-2xl transition-all shadow-md active:scale-95 shrink-0 mb-[1px]"
            aria-label="Enviar mensagem"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for icon
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
)

export default ChatAssistant;