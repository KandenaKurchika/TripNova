import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';

const LINKS = ['Destinations', 'Features', 'How It Works', 'Testimonials', 'FAQ'];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors ${scrolled ? 'glass' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-primary" size={22} />
          <span className="font-display font-bold text-xl">Trip<span className="text-gradient">Nova</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate">
          {LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate hover:text-white transition-colors">Sign in</Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-gradient-cta text-ink px-4 py-2 rounded-full hover:shadow-glow transition-shadow"
          >
            Start planning
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass mx-4 mb-4 rounded-2xl p-4 flex flex-col gap-3 text-sm">
          {LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setOpen(false)} className="text-slate hover:text-white">
              {l}
            </a>
          ))}
          <hr className="border-white/10" />
          <Link to="/login" className="text-slate hover:text-white">Sign in</Link>
          <Link to="/signup" className="bg-gradient-cta text-ink text-center py-2 rounded-full font-medium">Start planning</Link>
        </div>
      )}
    </motion.header>
  );
}
