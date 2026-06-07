import { motion } from 'framer-motion';

export default function Aurora({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Gold-purple nebula — top left */}
      <motion.div
        className="absolute rounded-full blur-[130px]"
        style={{
          width: '65%',
          height: '65%',
          top: '-25%',
          left: '-15%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(96,64,160,0.18) 45%, transparent 70%)',
          opacity: 0.6,
        }}
        animate={{ x: [0, 70, 0], y: [0, 35, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Deep indigo — right center */}
      <motion.div
        className="absolute rounded-full blur-[110px]"
        style={{
          width: '55%',
          height: '55%',
          top: '25%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(80,40,180,0.25) 0%, rgba(212,175,55,0.08) 55%, transparent 80%)',
          opacity: 0.5,
        }}
        animate={{ x: [0, -50, 0], y: [0, 55, 0], scale: [1, 1.18, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Subtle gold — bottom center */}
      <motion.div
        className="absolute rounded-full blur-[150px]"
        style={{
          width: '60%',
          height: '50%',
          bottom: '-20%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(30,10,80,0.5) 0%, rgba(212,175,55,0.08) 65%, transparent 100%)',
          opacity: 0.4,
        }}
        animate={{ x: [0, 30, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />

      {/* Soft teal accent — top right */}
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '30%',
          height: '30%',
          top: '5%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(50,180,180,0.08) 0%, transparent 70%)',
          opacity: 0.5,
        }}
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
    </div>
  );
}
