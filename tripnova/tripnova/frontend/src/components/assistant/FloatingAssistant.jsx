import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axiosClient.js';

const QUICK_PROMPTS = [
  'Suggest a destination for a beach trip',
  'Plan a 5-day budget trip to Southeast Asia',
  'What\u2019s the best time to visit Japan?',
];

const GREETING = {
  role: 'assistant',
  content: "Hi, I'm the TripNova assistant \u2708\ufe0f I can help you pick a destination, sketch a rough budget, or answer travel questions. What are you planning?",
};

export default function FloatingAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setMessages((m) => [...m, { role: 'user', content }]);
    setInput('');
    setSending(true);
    try {
      if (user) {
        // Authenticated: use the persistent, itinerary-aware assistant.
        const { data } = await api.post(`/chat/${sessionId || ''}`, { message: content });
        setSessionId(data.sessionId);
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
      } else {
        // Guest: stateless endpoint, client keeps the short history itself.
        const history = messages.slice(-10);
        const { data } = await api.post('/chat/guest', { message: content, history });
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      const friendly = err.response?.status === 429
        ? "You've hit the guest chat limit — sign in for unlimited planning help."
        : "Sorry, I couldn't reach the assistant just now.";
      setMessages((m) => [...m, { role: 'assistant', content: friendly }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close travel assistant' : 'Open travel assistant'}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-cta text-ink shadow-glow flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary animate-pulse" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[520px] glass rounded-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center">
                <Sparkles size={15} className="text-ink" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">TripNova assistant</p>
                <p className="text-[11px] text-slate mt-0.5">{user ? 'Personalized to your trips' : 'Guest mode \u00b7 sign in for more'}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === 'user' ? 'bg-card text-white rounded-br-sm' : 'bg-white/5 text-white rounded-bl-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] text-slate italic">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-[11px] text-slate border border-white/10 rounded-full px-3 py-1.5 hover:border-white/25 hover:text-white transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 p-3 border-t border-white/10"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a destination, budget, or dates…"
                className="flex-1 bg-card border border-white/10 rounded-full px-3.5 py-2 text-[13px] placeholder:text-slate outline-none focus:border-primary/60"
              />
              <button
                type="submit"
                disabled={sending}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-gradient-cta text-ink flex items-center justify-center disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>

            {!user && (
              <a href="/signup" className="flex items-center justify-center gap-1.5 text-[11px] text-primary bg-primary/10 py-2 hover:bg-primary/15 transition-colors">
                <Compass size={12} /> Sign in to build a full itinerary
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
