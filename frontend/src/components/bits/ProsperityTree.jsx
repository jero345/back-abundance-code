import { motion } from 'framer-motion';

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function ProsperityTree({ size = 380, className = '' }) {
  const cx = 200;
  const cy = 200;
  const outerR = 170;
  const midR = 148;
  const innerR = 128;

  const branches = [
    { x1: cx, y1: cy - 10, x2: cx - 42, y2: cy - 42 },
    { x1: cx, y1: cy - 10, x2: cx + 42, y2: cy - 42 },
    { x1: cx - 42, y1: cy - 42, x2: cx - 66, y2: cy - 68 },
    { x1: cx - 42, y1: cy - 42, x2: cx - 22, y2: cy - 72 },
    { x1: cx + 42, y1: cy - 42, x2: cx + 22, y2: cy - 72 },
    { x1: cx + 42, y1: cy - 42, x2: cx + 66, y2: cy - 68 },
    { x1: cx - 66, y1: cy - 68, x2: cx - 80, y2: cy - 88 },
    { x1: cx - 66, y1: cy - 68, x2: cx - 54, y2: cy - 90 },
    { x1: cx - 22, y1: cy - 72, x2: cx - 32, y2: cy - 94 },
    { x1: cx - 22, y1: cy - 72, x2: cx - 10, y2: cy - 93 },
    { x1: cx + 22, y1: cy - 72, x2: cx + 10, y2: cy - 93 },
    { x1: cx + 22, y1: cy - 72, x2: cx + 32, y2: cy - 94 },
    { x1: cx + 66, y1: cy - 68, x2: cx + 54, y2: cy - 90 },
    { x1: cx + 66, y1: cy - 68, x2: cx + 80, y2: cy - 88 },
  ];

  const roots = [
    { x1: cx, y1: cy + 55, x2: cx - 38, y2: cy + 84 },
    { x1: cx, y1: cy + 55, x2: cx + 38, y2: cy + 84 },
    { x1: cx - 38, y1: cy + 84, x2: cx - 60, y2: cy + 106 },
    { x1: cx - 38, y1: cy + 84, x2: cx - 18, y2: cy + 108 },
    { x1: cx + 38, y1: cy + 84, x2: cx + 18, y2: cy + 108 },
    { x1: cx + 38, y1: cy + 84, x2: cx + 60, y2: cy + 106 },
    { x1: cx - 60, y1: cy + 106, x2: cx - 74, y2: cy + 122 },
    { x1: cx - 60, y1: cy + 106, x2: cx - 48, y2: cy + 124 },
    { x1: cx + 60, y1: cy + 106, x2: cx + 48, y2: cy + 124 },
    { x1: cx + 60, y1: cy + 106, x2: cx + 74, y2: cy + 122 },
  ];

  const leaves = [
    { x: cx - 80, y: cy - 88, delay: 0 },
    { x: cx - 54, y: cy - 90, delay: 0.3 },
    { x: cx - 32, y: cy - 94, delay: 0.6 },
    { x: cx - 10, y: cy - 93, delay: 0.9 },
    { x: cx + 10, y: cy - 93, delay: 1.2 },
    { x: cx + 32, y: cy - 94, delay: 1.5 },
    { x: cx + 54, y: cy - 90, delay: 1.8 },
    { x: cx + 80, y: cy - 88, delay: 2.1 },
    { x: cx, y: cy - 30, delay: 0.4 },
  ];

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 55%, transparent 75%)',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Static tree SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <defs>
          <radialGradient id={`treeGlow-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          <filter id={`treeSoftGlow-${size}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`goldMetal-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6C76A" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="65%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#E6C76A" />
          </linearGradient>
          <linearGradient id={`goldFaint-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6C76A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Background glow */}
        <circle cx={cx} cy={cy} r="160" fill={`url(#treeGlow-${size})`} />

        {/* Inner dashed ring */}
        <circle cx={cx} cy={cy} r={innerR} stroke="rgba(212,175,55,0.18)" strokeWidth="0.6" fill="none" strokeDasharray="4 6" />

        {/* Cardinal diamonds */}
        {[0, 90, 180, 270].map((deg) => {
          const angle = (deg - 90) * (Math.PI / 180);
          const x = cx + innerR * Math.cos(angle);
          const y = cy + innerR * Math.sin(angle);
          return (
            <g key={deg} transform={`translate(${x}, ${y}) rotate(${deg})`}>
              <polygon points="0,-3.5 2.5,0 0,3.5 -2.5,0" fill="#D4AF37" opacity="0.55" />
            </g>
          );
        })}

        {/* Sacred geometry overlay */}
        <circle cx={cx - 20} cy={cy - 10} r="42" stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" fill="none" />
        <circle cx={cx + 20} cy={cy - 10} r="42" stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" fill="none" />

        {/* Tree */}
        <g filter={`url(#treeSoftGlow-${size})`}>
          {/* Trunk */}
          <line x1={cx} y1={cy + 55} x2={cx} y2={cy - 30}
            stroke={`url(#goldMetal-${size})`} strokeWidth="2.5" strokeLinecap="round" />

          {/* Branches */}
          {branches.map((b, i) => (
            <line key={`b${i}`} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
              stroke={`url(#goldMetal-${size})`}
              strokeWidth={i < 2 ? 1.8 : i < 6 ? 1.2 : 0.8}
              strokeLinecap="round"
              opacity={i < 2 ? 1 : i < 6 ? 0.85 : 0.65} />
          ))}

          {/* Roots */}
          {roots.map((r, i) => (
            <line key={`r${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke={`url(#goldFaint-${size})`}
              strokeWidth={i < 2 ? 1.6 : i < 6 ? 1.1 : 0.7}
              strokeLinecap="round"
              opacity={i < 2 ? 0.65 : i < 6 ? 0.45 : 0.3} />
          ))}

          {/* Static leaf dots */}
          {leaves.map((l, i) => (
            <circle key={`l${i}`} cx={l.x} cy={l.y} r="2.5" fill="#E6C76A" opacity="0.85" />
          ))}

          {/* Central seed */}
          <circle cx={cx} cy={cy + 10} r="5" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.7" />
          <circle cx={cx} cy={cy + 10} r="2" fill="#D4AF37" opacity="0.9" />
        </g>
      </svg>

      {/* Rotating zodiac ring — separate SVG with CSS animation */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        style={{
          animation: 'zodiacSpin 90s linear infinite',
          transformOrigin: '50% 50%',
          transformBox: 'view-box',
        }}
      >
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={outerR} stroke="rgba(212,175,55,0.28)" strokeWidth="0.8" fill="none" />
        {/* Mid ring */}
        <circle cx={cx} cy={cy} r={midR} stroke="rgba(212,175,55,0.14)" strokeWidth="0.5" fill="none" />

        {/* 12 zodiac positions */}
        {ZODIAC_SYMBOLS.map((symbol, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const symR = (outerR + midR) / 2;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);
          return (
            <g key={i}>
              <line
                x1={cx + (midR + 2) * dx} y1={cy + (midR + 2) * dy}
                x2={cx + (outerR - 2) * dx} y2={cy + (outerR - 2) * dy}
                stroke="rgba(212,175,55,0.45)" strokeWidth="1"
              />
              <circle cx={cx + outerR * dx} cy={cy + outerR * dy} r="2.5" fill="#D4AF37" opacity="0.65" />
              <text
                x={cx + symR * dx} y={cy + symR * dy}
                fill="rgba(212,175,55,0.5)"
                fontSize="9" textAnchor="middle" dominantBaseline="central"
              >
                {symbol}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Animated leaf pulses — rendered as divs on top */}
      {leaves.map((l, i) => {
        const scale = size / 400;
        const left = l.x * scale - 4;
        const top = l.y * scale - 4;
        return (
          <motion.div
            key={`lp${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{ width: 8, height: 8, left, top, background: '#E6C76A' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2 + i * 0.25, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
          />
        );
      })}
    </div>
  );
}
