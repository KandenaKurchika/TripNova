import ReactMarkdown from 'react-markdown';
import { Compass, User } from 'lucide-react';

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  // Hide the raw ```json structured block from the chat transcript; it's rendered separately.
  const display = content.replace(/```json[\s\S]*?```/i, '').trim();

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-card text-white' : 'bg-primary text-ink'
      }`}>
        {isUser ? <User size={16} /> : <Compass size={16} />}
      </div>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser ? 'bg-card text-white rounded-tr-sm' : 'bg-card text-white rounded-tl-sm'
      }`}>
        <ReactMarkdown className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
          {display}
        </ReactMarkdown>
      </div>
    </div>
  );
}
