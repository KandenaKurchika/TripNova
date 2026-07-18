import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto mb-12"
    >
      {eyebrow && <p className="text-primary text-xs font-semibold tracking-wide uppercase mb-3">{eyebrow}</p>}
      <h2 className="font-display font-bold text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="text-slate mt-4">{subtitle}</p>}
    </motion.div>
  );
}
