import { motion } from 'framer-motion';
import { Wand2, Wallet, Map, CloudSun, MessageCircle, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';

const FEATURES = [
  { icon: Wand2, title: 'AI-generated itineraries', desc: 'Full day-wise plans built around your interests, pace, and travel style in seconds.' },
  { icon: Wallet, title: 'Budget optimization', desc: 'Real-time cost breakdowns across flights, stays, food, and activities.' },
  { icon: Map, title: 'Interactive maps', desc: 'Every hotel, restaurant, and attraction plotted with live directions.' },
  { icon: CloudSun, title: 'Weather-aware planning', desc: 'Itineraries that adapt to forecasts, so rainy days never ruin the plan.' },
  { icon: MessageCircle, title: 'AI chat assistant', desc: 'Ask for changes anytime — "swap day 3 for something more relaxed."' },
  { icon: ShieldCheck, title: 'Safety & visa guidance', desc: 'Entry requirements, local advisories, and emergency numbers in one place.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need, planned by AI"
        subtitle="TripNova brings every part of trip planning into one intelligent, connected workspace."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="glass rounded-2xl p-6 hover:border-white/20 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center mb-4">
              <Icon size={20} className="text-ink" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
            <p className="text-slate text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
