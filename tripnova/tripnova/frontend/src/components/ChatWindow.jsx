import { useEffect, useRef, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import api from '../api/axiosClient.js';

export default function ChatWindow({ sessionId, setSessionId, tripContext, onStructured }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, I'm TripNova ✈️ Tell me where you'd like to go, or fill in the trip form to get a full day-wise itinerary." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const content = text ?? input;
    if (!content.trim() || sending) return;
    setMessages((m) => [...m, { role: 'user', content }]);
    setInput('');
    setSending(true);
    try {
      const { data } = await api.post(`/chat/${sessionId || ''}`, { message: content, tripContext });
      setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
      if (data.structured) onStructured?.(data.structured);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong reaching TripNova. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2">
        {messages.map((m, i) => <MessageBubble key={i} {...m} />)}
        {sending && <MessageBubble role="assistant" content="_typing…_" />}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="flex items-center gap-2 mt-3 bg-card/60 rounded-full px-4 py-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about destinations, hotels, or say 'plan my trip'…"
          className="flex-1 bg-transparent text-sm placeholder:text-slate outline-none"
        />
        <button type="submit" disabled={sending} className="text-primary disabled:opacity-40">
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
}
