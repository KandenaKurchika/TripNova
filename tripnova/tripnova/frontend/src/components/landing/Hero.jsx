import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';
import Carousel from './Carousel.jsx';

export default function Hero() {
  return (
    <section className="relative pt-36 pb-20 px-6 overflow-hidden">
      <div aria-hidden className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      <div aria-hidden className="absolute top-20 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-slate mb-6"
        >
          <Sparkles size={14} className="text-primary" />
          Your AI travel assistant, online now
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight"
        >
          Plan your dream trip <br className="hidden sm:block" />
          with <span className="text-gradient">AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-slate text-base sm:text-lg max-w-2xl mx-auto"
        >
          Generate personalized travel itineraries, discover attractions, optimize your budget,
          and explore the world with your AI travel assistant.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="group flex items-center gap-2 bg-gradient-cta text-ink font-semibold px-7 py-3.5 rounded-full hover:shadow-glow transition-shadow"
          >
            <Compass size={18} /> Start planning
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#destinations"
            className="flex items-center gap-2 glass text-white font-medium px-7 py-3.5 rounded-full hover:border-white/20 transition-colors"
          >
            Explore destinations
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
        className="relative mt-16 max-w-6xl mx-auto"
      >
        <Carousel />
      </motion.div>
    </section>
  );
}
