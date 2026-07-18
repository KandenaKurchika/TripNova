import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';

const FAQS = [
  { q: 'How does TripNova generate itineraries?', a: 'You share your destination, dates, budget, and interests, and our AI (built on Claude) drafts a full day-wise plan, cross-checked against live weather and pricing signals.' },
  { q: 'Can I edit the plan afterwards?', a: 'Yes — chat with the assistant to swap activities, change pace, or adjust budget, or edit any day directly on the timeline.' },
  { q: 'Is TripNova free to use?', a: 'Creating an account and generating itineraries is free. Optional bookings through partner hotels and activities may carry their own pricing.' },
  { q: 'Which destinations are supported?', a: 'Anywhere Google Maps can geocode — TripNova is not limited to a fixed destination list.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <SectionHeading eyebrow="FAQ" title="Common questions" />
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={f.q} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-medium text-sm sm:text-base">{f.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={18} className="text-slate" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 overflow-hidden"
                >
                  <p className="text-slate text-sm pb-4 leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
