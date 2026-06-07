import { motion } from 'framer-motion';

export default function BlurText({ text, className = '', delay = 0, once = true }) {
  const words = text.split(' ');

  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 16 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once }}
          transition={{ duration: 0.6, delay: delay + i * 0.08, ease: 'easeOut' }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          className={className}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}
