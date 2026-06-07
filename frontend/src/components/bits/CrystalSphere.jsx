import { motion } from 'framer-motion';

export default function CrystalSphere({ size = 320, className = '' }) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: size * 1.4, height: size * 1.4 }}
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)' }}
        />
      </motion.div>

      {/* SVG Sphere */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="sphere-glow"
      >
        <defs>
          {/* Base crystal gradient */}
          <radialGradient id="sphereBase" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#E8E0FF" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#B8A0E8" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#6040A0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1A0840" stopOpacity="0.9" />
          </radialGradient>

          {/* Gold inner light */}
          <radialGradient id="goldLight" cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>

          {/* Specular highlight */}
          <radialGradient id="specular" cx="32%" cy="28%" r="30%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Bottom reflection */}
          <radialGradient id="bottomReflect" cx="65%" cy="75%" r="28%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>

          <filter id="blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Shadow beneath sphere */}
        <ellipse cx="200" cy="380" rx="90" ry="12" fill="rgba(0,0,0,0.4)" filter="url(#softBlur)" />

        {/* Main sphere */}
        <circle cx="200" cy="200" r="175" fill="url(#sphereBase)" />

        {/* Gold inner glow */}
        <circle cx="200" cy="200" r="175" fill="url(#goldLight)" />

        {/* Bottom gold reflection */}
        <circle cx="200" cy="200" r="175" fill="url(#bottomReflect)" />

        {/* Specular highlight */}
        <circle cx="200" cy="200" r="175" fill="url(#specular)" />

        {/* Edge rim light */}
        <circle cx="200" cy="200" r="175" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1.5" />

        {/* Inner glow lines — subtle engraving effect */}
        <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" />

        {/* Engraved symbol (abstract) */}
        <g opacity="0.3" transform="translate(200,200)">
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#D4AF37" strokeWidth="0.8" />
          <line x1="0" y1="-40" x2="0" y2="40" stroke="#D4AF37" strokeWidth="0.8" />
          <circle r="28" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
          <circle r="12" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
        </g>
      </svg>

      {/* Animated light flare */}
      <motion.div
        className="absolute rounded-full bg-white pointer-events-none"
        style={{ width: size * 0.08, height: size * 0.08, top: '22%', left: '30%' }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
