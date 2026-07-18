import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Instagram, Github } from 'lucide-react';

const COLUMNS = [
  { title: 'Product', links: ['Destinations', 'Features', 'How it works', 'Pricing'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help center', 'Visa guides', 'Travel safety', 'API docs'] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-primary" size={20} />
            <span className="font-display font-bold text-lg">Trip<span className="text-gradient">Nova</span></span>
          </div>
          <p className="text-slate text-sm max-w-xs">Your AI travel assistant for personalized itineraries, smart budgets, and stress-free planning.</p>
          <div className="flex gap-3 mt-5">
            {[Twitter, Instagram, Github].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="glass rounded-full p-2 hover:border-white/20">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="text-slate text-sm hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mt-12 pt-6 border-t border-white/10 text-xs text-slate">
        <p>© {new Date().getFullYear()} TripNova. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="#" className="hover:text-white">Privacy</Link>
          <Link to="#" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
