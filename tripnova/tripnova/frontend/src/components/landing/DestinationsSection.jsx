import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';

const DESTINATIONS = [
  { name: 'Santorini', country: 'Greece', seed: 'santorini2', price: 1240, rating: 4.9 },
  { name: 'Kyoto', country: 'Japan', seed: 'kyoto2', price: 1580, rating: 4.8 },
  { name: 'Bali', country: 'Indonesia', seed: 'bali2', price: 980, rating: 4.7 },
  { name: 'Marrakech', country: 'Morocco', seed: 'marrakech', price: 890, rating: 4.6 },
  { name: 'Queenstown', country: 'New Zealand', seed: 'queenstown', price: 1720, rating: 4.9 },
  { name: 'Lisbon', country: 'Portugal', seed: 'lisbon2', price: 1050, rating: 4.7 },
];

export default function DestinationsSection() {
  return (
    <section id="destinations" className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Popular destinations"
        title="Where travelers are headed"
        subtitle="Hand-picked by our AI from thousands of real trips, updated with live pricing and seasonality."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESTINATIONS.map((d, i) => (
          <motion.div
            key={d.seed}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={`https://picsum.photos/seed/${d.seed}/600/400`}
                alt={`${d.name}, ${d.country}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-semibold text-lg">{d.name}</p>
                  <p className="text-slate text-sm">{d.country}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Star size={13} fill="currentColor" /> {d.rating}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate">From</span>
                <span className="font-mono text-secondary">${d.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
