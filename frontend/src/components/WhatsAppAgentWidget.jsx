import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, ExternalLink, Bot, CheckCircle2, Phone, Sparkles, Dumbbell } from 'lucide-react';

export default function WhatsAppAgentWidget({ gym, customer, profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Active admin gym WhatsApp details
  const gymName = gym?.gym_name || 'FitLife Elite Gym';
  const coachName = gym?.ai_coach_name || 'FitLife AI Coach';
  const whatsappNumber = gym?.whatsapp_number || '+91 98801 23456';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  // Reset or load initial greetings when gym changes
  useEffect(() => {
    const greeting = gym?.ai_greeting || `Namaste ${customer?.name || 'there'}! I am ${coachName}, your dedicated WhatsApp AI Nutrition Coach for ${gymName}. Ask me anything about your diet, food swaps, or calories!`;
    setMessages([
      {
        id: 'init-1',
        sender: 'coach',
        text: greeting,
        time: 'Just now'
      }
    ]);
  }, [gym?.id, gym?.ai_greeting, coachName, gymName, customer?.name]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputValue.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer?.id || 1,
          message: textToSend
        })
      });
      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'coach',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            whatsappUrl: data.whatsappUrl
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'coach',
          text: `I'm having a brief sync delay, but you can ping me directly on WhatsApp at ${whatsappNumber}!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Direct WhatsApp Web / App launcher URL
  const generateDirectWhatsAppUrl = (msg = '') => {
    const defaultMsg = msg || `Hi ${coachName} (${gymName})! I'm ${customer?.name || 'Member'}, current weight: ${customer?.current_weight || 75}kg, goal: ${customer?.goal || 'Fat-loss'}. Can you review my diet today?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`;
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {!isOpen && (
          <div className="hidden sm:flex flex-col items-end">
            <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 max-w-xs text-right animate-bounce">
              <span className="font-semibold text-emerald-400">WhatsApp AI Agent Online</span>
              <p className="text-[11px] text-slate-300 truncate">Linked to {gymName} ({whatsappNumber})</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle WhatsApp AI Agent"
          className={`flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-slate-800 text-white hover:bg-slate-700'
              : 'bg-[#25D366] text-white hover:bg-[#20ba59] whatsapp-pulse'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full"></span>
            </div>
          )}
        </button>
      </div>

      {/* Floating Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[410px] max-h-[82vh] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header styled with Gym & WhatsApp Branding */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={gym?.logo_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop&q=80'}
                  alt={gymName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-300 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#075E54] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-tight leading-tight">{coachName}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <p className="text-[11px] text-emerald-100 font-medium truncate max-w-[200px]">{gymName}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-200 mt-0.5">
                  <Phone className="w-2.5 h-2.5" />
                  <span>{whatsappNumber}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* WhatsApp Direct Action Banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-3.5 py-2 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official WhatsApp AI Coach</span>
            </div>
            <a
              href={generateDirectWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#25D366] text-white px-2.5 py-1 rounded-lg hover:bg-[#20ba59] shadow-sm transition"
            >
              <span>Open in WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5]/30">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'coach' && (
                  <a
                    href={generateDirectWhatsAppUrl(msg.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-[10px] text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 ml-1"
                  >
                    <span>Continue this on WhatsApp ({whatsappNumber})</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-white px-3 py-2 rounded-2xl rounded-tl-none w-fit shadow-sm">
                <Bot className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Coach is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick AI Suggestions */}
          <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => handleSendMessage('Suggest an Indian meal swap for lunch')}
              className="whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
            >
              🥗 Swap my Lunch
            </button>
            <button
              onClick={() => handleSendMessage('What are high-protein vegetarian snacks?')}
              className="whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
            >
              🥜 Protein Snacks
            </button>
            <button
              onClick={() => handleSendMessage('Healthy choices at Indian restaurant tonight')}
              className="whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
            >
              🍽️ Restaurant Mode
            </button>
            <button
              onClick={() => handleSendMessage('Check my water intake target')}
              className="whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
            >
              💧 Water Target
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={`Message ${coachName}...`}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-[#25D366] text-white p-2 rounded-xl hover:bg-[#20ba59] disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
