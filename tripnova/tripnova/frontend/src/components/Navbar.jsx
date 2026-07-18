import { Compass, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10/60 bg-ink/80 backdrop-blur">
      <div className="flex items-center gap-2">
        <Compass className="text-primary" size={22} strokeWidth={2.2} />
        <span className="font-display text-xl tracking-tight">Trip<span className="text-primary">AI</span></span>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate hidden sm:inline">Hi, {user.name.split(' ')[0]}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate hover:text-white transition-colors"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </header>
  );
}
