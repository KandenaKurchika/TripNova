import { Link, useLocation } from 'react-router-dom';
import { MapPinned, MessageSquarePlus, Luggage } from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'My Trips', icon: Luggage },
  { to: '/plan', label: 'New Itinerary', icon: MessageSquarePlus },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="w-60 shrink-0 border-r border-white/10/60 py-6 px-3 hidden md:flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active ? 'bg-card/70 text-primary' : 'text-slate hover:bg-card/60 hover:text-white'
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        );
      })}
      <div className="mt-auto px-3 pt-4 border-t border-white/10/40 flex items-center gap-2 text-xs text-slate">
        <MapPinned size={14} /> Powered by Claude
      </div>
    </aside>
  );
}
