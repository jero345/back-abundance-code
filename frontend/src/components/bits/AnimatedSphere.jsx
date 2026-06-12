import { useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/* =========================================================
   ABUNDANCE CODE — AnimatedSphere (premium)
   Layered scene over /img/sphere-transparent.png

   Layers back → front:
     0. Deep ambient halo (slow pulse, large, blurred)
     1. Energy beams (radial rays rotating slowly)
     2. Inner zodiac ring  (CW 60s)
     3. Outer constellation (CCW 90s)
     4. Drifting dust / fireflies (20 particles)
     5. Bright pulsing halo (5.5s)
     6. THE SPHERE — float + continuous Z-axis rotation (50s/turn)
                     + mouse tilt parallax (desktop only)
     7. Orbiting sparkles ✦ on elliptical path

   Respects `prefers-reduced-motion`.
   ========================================================= */

const SPARKLE_COUNT  = 12;
const PARTICLE_COUNT = 22;
const ROTATION_SECS  = 60;          // slow, mystical full revolution of the ball
const FLOAT_SECS     = 5.5;

/* Source PNG composition (base + ball in a single image).
 * Values measured on /img/sphere-transparent.png (1080x1350px).
 * Tune these if the asset is re-cropped. */
const BALL_CX_PCT = 50;    // center X of the ball (% of image width)
const BALL_CY_PCT = 32;    // center Y of the ball (% of image height)
const BALL_R_PCT  = 28;    // radius of the ball (% of image width)
const PNG_ASPECT_HW_FALLBACK = 1.25;  // height / width — replaced by onLoad measurement

export default function AnimatedSphere({
  size = 440,
  priority = false,
  className = '',
}) {
  const reduce = useReducedMotion();
  const [enableParallax, setEnableParallax] = useState(false);
  const [pngAspect, setPngAspect] = useState(PNG_ASPECT_HW_FALLBACK);

  /* Derive peephole geometry from the ball position constants.
   * window  = circular div sized to the ball, positioned over it.
   * inner   = full PNG nested inside, rotating around the ball center. */
  const WIN_LEFT_PCT    = BALL_CX_PCT - BALL_R_PCT;            // 20
  const WIN_TOP_PCT     = BALL_CY_PCT - BALL_R_PCT;            // 8
  const WIN_WIDTH_PCT   = BALL_R_PCT * 2;                      // 60
  const IMG_WIDTH_PCT   = 100 / (WIN_WIDTH_PCT / 100);         // 166.67
  const IMG_HEIGHT_PCT  = IMG_WIDTH_PCT * pngAspect;           // ~190
  const IMG_LEFT_OFFSET = 50 - IMG_WIDTH_PCT / 2;              // -33.33
  const IMG_TOP_OFFSET  = 50 - (IMG_HEIGHT_PCT * BALL_CY_PCT) / 100;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine) and (min-width: 768px)');
    const apply = () => setEnableParallax(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  /* Mouse tilt (parallax) — independent of the spin */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 70, damping: 18, mass: 0.6 };
  const rotX = useSpring(useTransform(my, [-1, 1], [8, -8]),  springCfg);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-10, 10]), springCfg);
  const transX = useSpring(useTransform(mx, [-1, 1], [-8, 8]),  springCfg);
  const transY = useSpring(useTransform(my, [-1, 1], [-6, 6]),  springCfg);

  function handleMove(e) {
    if (!enableParallax || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    mx.set(x * 2);
    my.set(y * 2);
  }
  function handleLeave() { mx.set(0); my.set(0); }

  /* Pre-computed particle field — stable across renders */
  const particles = useMemo(() => {
    // Use a tiny seeded pseudo-random so SSR/CSR match and each sphere
    // looks the same on every render.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const angle  = rand() * Math.PI * 2;
      const radius = 55 + rand() * 35;          // % of half-container
      const baseX  = 50 + radius * Math.cos(angle) * 0.6;
      const baseY  = 50 + radius * Math.sin(angle) * 0.6;
      return {
        i,
        baseX,
        baseY,
        driftX:   (rand() - 0.5) * 14,           // px
        driftY:   -8 - rand() * 18,              // negative = floats up
        size:     1 + rand() * 2.5,
        delay:    rand() * 6,
        duration: 5 + rand() * 5,
      };
    });
  }, []);

  /* ── Reduced-motion fallback ──────────────────────────── */
  if (reduce) {
    return (
      <div className={`relative inline-block ${className}`} style={{ width: '100%', maxWidth: size }}>
        <div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 55%, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.12) 35%, transparent 65%)',
            filter: 'blur(22px)',
          }}
        />
        <img
          src="/img/sphere-transparent.png"
          alt="Esfera de cristal Abundance Code"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="block relative w-full h-auto"
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      style={{ width: '100%', maxWidth: size, perspective: 1200 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── 0. Deep ambient halo (back, large, slow) ──── */}
      <motion.div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          left: '-30%', right: '-30%', top: '-25%', bottom: '-25%',
          background:
            'radial-gradient(circle at 50% 55%, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.10) 25%, rgba(212,175,55,0.02) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.95, 1.06, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── 1. Energy beams (radial rays slow CCW) ────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" style={{ width: '140%', height: '140%' }} className="opacity-30">
          <defs>
            <radialGradient id="beam-fade" cx="50%" cy="50%" r="50%">
              <stop offset="20%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="55%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 100 100)`}>
              <rect x="98.5" y="0" width="3" height="200" fill="url(#beam-fade)" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* ── 2. Inner zodiac ring (CW, 60s) ─────────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" className="opacity-35" style={{ width: '94%', height: '94%' }}>
          <circle
            cx="100" cy="100" r="92"
            fill="none" stroke="#D4AF37" strokeWidth="0.6"
            strokeDasharray="2 4"
          />
          {[...Array(12)].map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const r1 = 82, r2 = 92;
            return (
              <line key={i}
                x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)}
                x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)}
                stroke="#D4AF37" strokeWidth="0.6" opacity="0.7"
              />
            );
          })}
        </svg>
      </motion.div>

      {/* ── 3. Outer constellation (CCW, 90s) ──────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" className="opacity-35" style={{ width: '108%', height: '108%' }}>
          {[...Array(28)].map((_, i) => {
            const a = (i * (360 / 28) * Math.PI) / 180;
            const r = 98;
            const big = i % 4 === 0;
            return (
              <circle key={i}
                cx={100 + r * Math.cos(a)} cy={100 + r * Math.sin(a)}
                r={big ? 1.1 : 0.5}
                fill="#D4AF37" opacity={big ? 1 : 0.55}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* ── 4. Drifting dust / fireflies ───────────────── */}
      {particles.map((p) => (
        <motion.span
          key={p.i}
          aria-hidden
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${p.baseX}%`,
            top:  `${p.baseY}%`,
            width:  p.size,
            height: p.size,
            background: '#D4AF37',
            boxShadow: '0 0 4px rgba(212,175,55,0.8)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x:       [0, p.driftX, 0],
            y:       [0, p.driftY, 0],
            opacity: [0, 0.9, 0],
            scale:   [0.6, 1.1, 0.6],
          }}
          transition={{
            duration: p.duration,
            delay:    p.delay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}

      {/* ── 5. Bright pulsing halo (close to sphere) ───── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          left: '-10%', right: '-10%', top: '-5%', bottom: '-5%',
          background:
            'radial-gradient(circle at 50% 55%, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.18) 30%, rgba(212,175,55,0.04) 55%, transparent 70%)',
          filter: 'blur(22px)',
        }}
        animate={{ opacity: [0.65, 1, 0.65], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: FLOAT_SECS, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── 6. THE PRODUCT (static base + spinning ball) ──
             • 6a renders the full PNG — base of wood with the "ABUNDANCE
               CODE" plate and the crystal, perfectly still and centred.
             • 6b is a circular "peephole" sized to the ball, positioned
               exactly over it. Inside the peephole we layer the same PNG
               again, but THIS copy rotates around the ball's center.
               Since the wooden base sits OUTSIDE the peephole's circle,
               it never enters the viewport — so only the crystal sphere
               appears to spin while everything else stays put.
             • Both layers share the same float (y) so the whole product
               gently levitates as one object.
             • Mouse-tilt parallax wraps both for cohesive 3D response.
         ─────────────────────────────────────────────────── */}
      <motion.div
        className="relative"
        style={{
          rotateX: enableParallax ? rotX : 0,
          rotateY: enableParallax ? rotY : 0,
          x:       enableParallax ? transX : 0,
          y:       enableParallax ? transY : 0,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* 6a — STATIC base + ball (the actual product, fixed and centred) */}
        <motion.img
          src="/img/sphere-transparent.png"
          alt="Esfera de cristal Abundance Code"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={priority ? 'high' : 'auto'}
          className="block w-full h-auto"
          style={{
            filter: 'drop-shadow(0 18px 40px rgba(61,40,23,0.28))',
            willChange: 'transform',
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: FLOAT_SECS, repeat: Infinity, ease: 'easeInOut' }}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              setPngAspect(img.naturalHeight / img.naturalWidth);
            }
          }}
          draggable={false}
        />

        {/* 6b — SPINNING ball through a circular peephole over the crystal.
               clip-path: circle() is used instead of overflow:hidden because
               it is unaffected by ancestor transform-style: preserve-3d. */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left:        `${WIN_LEFT_PCT}%`,
            top:         `${WIN_TOP_PCT}%`,
            width:       `${WIN_WIDTH_PCT}%`,
            aspectRatio: '1 / 1',
            clipPath:        'circle(50% at 50% 50%)',
            WebkitClipPath:  'circle(50% at 50% 50%)',
            willChange:      'transform',
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: FLOAT_SECS, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.img
            src="/img/sphere-transparent.png"
            alt=""
            aria-hidden="true"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute block"
            style={{
              width:           `${IMG_WIDTH_PCT}%`,
              height:          'auto',
              left:            `${IMG_LEFT_OFFSET}%`,
              top:             `${IMG_TOP_OFFSET}%`,
              transformOrigin: `${BALL_CX_PCT}% ${BALL_CY_PCT}%`,
              willChange:      'transform',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: ROTATION_SECS, repeat: Infinity, ease: 'linear' }}
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* ── 7. Orbiting sparkles ✦ ─────────────────────── */}
      {Array.from({ length: SPARKLE_COUNT }).map((_, i) => {
        const angle = (i * (360 / SPARKLE_COUNT) * Math.PI) / 180;
        const rx = 44, ry = 36;
        const cx = 50 + rx * Math.cos(angle);
        const cy = 52 + ry * Math.sin(angle);
        const big = i % 3 === 0;
        return (
          <motion.span
            key={i}
            aria-hidden
            className="absolute pointer-events-none text-[#D4AF37]"
            style={{
              left: `${cx}%`,
              top:  `${cy}%`,
              fontSize: big ? '0.9rem' : '0.65rem',
              transform: 'translate(-50%, -50%)',
              textShadow: '0 0 6px rgba(212,175,55,0.7)',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale:   [0.4, big ? 1.25 : 1, 0.4],
            }}
            transition={{
              duration: 2.6 + (i % 4) * 0.35,
              delay:    (i * 0.42) % 3,
              repeat:   Infinity,
              ease:     'easeInOut',
            }}
          >
            ✦
          </motion.span>
        );
      })}
    </motion.div>
  );
}
