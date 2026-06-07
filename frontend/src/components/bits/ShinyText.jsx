import { motion } from 'framer-motion';

export default function ShinyText({ text, className = '' }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      {text}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
          skewX: '-15deg',
        }}
        animate={{ x: ['-120%', '220%'] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
      />
    </span>
  );
}
