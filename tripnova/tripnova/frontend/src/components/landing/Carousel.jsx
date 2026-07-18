import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  { name: 'Santorini, Greece', seed: 'santorini', tag: 'Whitewashed cliffs & sunsets' },
  { name: 'Kyoto, Japan', seed: 'kyoto', tag: 'Temples & cherry blossoms' },
  { name: 'Bali, Indonesia', seed: 'bali', tag: 'Rice terraces & surf breaks' },
  { name: 'Reykjavik, Iceland', seed: 'reykjavik', tag: 'Glaciers & northern lights' },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const go = (dir) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative rounded-3xl overflow-hidden glass h-72 sm:h-96">
      <AnimatePresence mode="wait">
        <motion.div
          key={SLIDES[index].seed}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={`https://picsum.photos/seed/${SLIDES[index].seed}/1200/700`}
            alt={SLIDES[index].name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:left-8">
            <p className="font-display font-bold text-xl sm:text-2xl">{SLIDES[index].name}</p>
            <p className="text-slate text-sm mt-1">{SLIDES[index].tag}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => go(-1)} aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 glass rounded-full p-2 hover:border-white/20"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => go(1)} aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 glass rounded-full p-2 hover:border-white/20"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-6 right-6 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.seed} aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
