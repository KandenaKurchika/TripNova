import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';

const TESTIMONIALS = [
  { name: 'Priya N.', trip: 'Kyoto, 6 days', quote: 'The itinerary matched our pace perfectly — we never felt rushed, and it caught a temple closure we would have missed.' },
  { name: 'Daniel R.', trip: 'Lisbon, 4 days', quote: 'Asked the assistant to swap a night out for something quieter and it rebuilt the whole evening in seconds.' },
  { name: 'Aiko T.', trip: 'Iceland, 8 days', quote: 'Budget tracking kept us honest the whole trip. We landed within $40 of the original estimate.' },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeading eyebrow="Testimonials" title="Trusted by travelers everywhere" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <Quote size={20} className="text-primary mb-3" />
            <p className="text-sm text-white/90 leading-relaxed">{t.quote}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-semibold text-ink">
                {t.name.split(' ').map((p) => p[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-slate">{t.trip}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
