import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { MessageCircle, X, Send, Sparkles, ExternalLink, CheckCheck } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const { chatMessages, sendChatMessage } = useStudio();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'Check wedding date availability',
    'What are your bridal package rates?',
    'Can I book an in-studio makeup trial?',
    'Do you travel for destination weddings?'
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal.trim(), 'client');
    setInputVal('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt, 'client');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-xs uppercase tracking-wider font-bold">
            Chat with Bridal Stylist
          </span>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-stone-900">
            1
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 font-serif-luxury font-bold text-lg">
                  DS
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-white leading-tight">
                  Deepika Sharma Studio
                </h3>
                <span className="text-[10px] text-amber-300 tracking-wider uppercase block">
                  Lakhpedabagh, Barabanki
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href="https://wa.me/919580494058?text=Namaste%20Deepika%20Sharma%20Studio,%20I%20would%20like%20to%20inquire%20about%20bridal%20makeup%20packages%20and%20date%20availability"
                target="_blank"
                rel="noreferrer"
                title="Chat directly on WhatsApp"
                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 text-xs flex items-center gap-1 border border-emerald-800/40 transition-colors"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Questions Strip */}
          <div className="p-2.5 bg-stone-900/60 border-b border-stone-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-200 rounded-full border border-stone-700/60 whitespace-nowrap shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg) => {
              const isClient = msg.sender === 'client';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl ${
                      isClient
                        ? 'bg-amber-400 text-stone-950 rounded-br-none font-medium'
                        : 'bg-stone-900 text-stone-200 border border-stone-800 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isClient && <CheckCheck className="w-3 h-3 text-amber-400" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Input */}
          <form onSubmit={handleSend} className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about wedding looks..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 p-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
