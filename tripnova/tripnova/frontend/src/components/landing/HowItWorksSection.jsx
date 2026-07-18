import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';

const STEPS = [
  { n: '01', title: 'Tell us your trip', desc: 'Destination, dates, travelers, budget, and interests — one quick form.' },
  { n: '02', title: 'AI builds your plan', desc: 'TripNova checks weather, prices, and attractions to draft a full itinerary.' },
  { n: '03', title: 'Refine with chat', desc: 'Ask the assistant to tweak anything — pace, budget, cuisine, activities.' },
  { n: '04', title: 'Go explore', desc: 'Save it, share it, or export a PDF — your trip, ready to travel.' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
      <SectionHeading eyebrow="How it works" title="From idea to itinerary in minutes" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative"
          >
            <span className="font-mono text-4xl font-bold text-white/10">{s.n}</span>
            <h3 className="font-display font-semibold text-lg mt-2 mb-2">{s.title}</h3>
            <p className="text-slate text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
