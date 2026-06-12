import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext.jsx';
import { TestimonialBar, TestimonialCards } from '../components/sections/Testimonials.jsx';
import AnimatedSphere from '../components/bits/AnimatedSphere.jsx';

/* =========================================================
   ABUNDANCE CODE — Home
   Layout based on "Nuevo diseño Pagina web.pdf"
   Palette: Ivory #F5F1ED · Beige #E8DCC8 · Champagne #D4AF37 · Moka #3D2817
   Typography: Montserrat (única fuente)
   Sections:
     1. Hero — dolor
     2. Identificación emocional
     3. Patrones y ciclos
     4. Cómo funciona
     5. Qué desbloquea tu portal
     6. Inside the box
     7. Lifestyle / experiencia diaria
     8. Final CTA + FAQ link
   ========================================================= */

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function AnimSection({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AccentDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <span className="block w-8 h-px bg-[#D4AF37]" />
      <span className="text-[#D4AF37] text-sm leading-none">✦</span>
      <span className="block w-8 h-px bg-[#D4AF37]" />
    </div>
  );
}

/* Inline SVG icons — line style, champagne stroke */
function IconMoney() {
  return (
    <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" stroke="#D4AF37" strokeWidth="1.4">
      <circle cx="24" cy="24" r="20" />
      <path d="M24 12v24M30 17h-9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6h-9" strokeLinecap="round" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" stroke="#D4AF37" strokeWidth="1.4">
      <circle cx="24" cy="24" r="20" />
      <path d="M24 32s-9-5.2-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.8-9 12-9 12z" strokeLinejoin="round" />
    </svg>
  );
}
function IconGrowth() {
  return (
    <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" stroke="#D4AF37" strokeWidth="1.4">
      <circle cx="24" cy="24" r="20" />
      <path d="M14 32l6-6 4 4 10-12M28 18h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" stroke="#D4AF37" strokeWidth="1.4">
      <circle cx="24" cy="24" r="20" />
      <path d="M24 14v6M24 28v6M14 24h6M28 24h6M18 18l4 4M30 30l-4-4M18 30l4-4M30 18l-4 4" strokeLinecap="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#D4AF37" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#D4AF37" strokeWidth="1.5">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 11h18M7 16h4" strokeLinecap="round" />
    </svg>
  );
}
function IconSphere() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#D4AF37" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <ellipse cx="12" cy="12" rx="8" ry="3.5" />
      <path d="M4 12h16" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#D4AF37" strokeWidth="1.5">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" strokeLinecap="round" />
    </svg>
  );
}
function IconDiamond() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#D4AF37" strokeWidth="1.5">
      <path d="M6 4h12l3 5-9 11L3 9l3-5zM9 4l3 5 3-5M3 9h18" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#D4AF37" strokeWidth="2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Real sphere photo (transparent PNG over ivory background) */
function SphereImage({ size = 420, className = '', priority = false }) {
  return (
    <img
      src="/img/sphere-transparent.png"
      alt="Esfera de cristal Abundance Code"
      width={size}
      height={size}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`block object-contain ${className}`}
      style={{ width: '100%', maxWidth: size, height: 'auto' }}
    />
  );
}

/* Dashboard mockup image */
function DashboardImage({ src = '/img/dashboard.png', alt = 'Vista del portal personal Abundance Code' }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="block w-full h-auto rounded-2xl"
      style={{
        boxShadow: '0 20px 60px rgba(61,40,23,0.12), 0 4px 16px rgba(61,40,23,0.06)',
        background: '#FFFDF7',
      }}
    />
  );
}

/* Real box / unboxing photo */
function BoxImage() {
  return (
    <img
      src="/img/box.png"
      alt="Caja Abundance Code con esfera, tarjeta de activación y código personal"
      loading="lazy"
      decoding="async"
      className="block w-full h-auto rounded-2xl"
      style={{ boxShadow: '0 24px 60px rgba(61,40,23,0.28), 0 6px 20px rgba(61,40,23,0.14)' }}
    />
  );
}

export default function Home() {
  const { t } = useLang();
  return (
    <main className="bg-[#F5F1ED] pt-16 md:pt-20">

      {/* =========================================================
          1. HERO
          ========================================================= */}
      <section className="px-4 md:px-6 pt-6 pb-12 md:pt-10 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">

            {/* Left — copy */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="eyebrow mb-3"
              >
                {t('h.hero.eyebrow')}
              </motion.p>

              <div className="accent-line mb-5"><span className="text-[#D4AF37] text-xs">✦</span></div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="uppercase font-semibold text-[#3D2817] mb-5"
                style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)', lineHeight: 1.15, letterSpacing: '0.01em' }}
              >
                {t('h.hero.h1.line1')}<br/>{t('h.hero.h1.line2')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-[#3D2817]/80 leading-relaxed mb-7 max-w-md"
                style={{ fontSize: '0.9rem' }}
              >
                {t('h.hero.body.line1')}<br/>
                {t('h.hero.body.line2')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex items-center gap-3 mb-7 text-[#5B3E2A]"
                style={{ fontSize: '0.78rem' }}
              >
                <span className="text-[#D4AF37]">✦</span>
                <span>{t('h.hero.bullet')}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <Link to="/checkout" className="btn-primary w-full sm:w-auto text-center">{t('h.hero.cta1')}</Link>
                <Link to="/como-funciona" className="btn-outline w-full sm:w-auto text-center">{t('h.hero.cta2')}</Link>
              </motion.div>

              {/* bullets */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-5 text-[#3D2817]"
              >
                <div className="flex items-center gap-2 text-[0.72rem] tracking-[0.18em] uppercase">
                  <IconSphere /> <span>{t('h.hero.b1')}</span>
                </div>
                <div className="flex items-center gap-2 text-[0.72rem] tracking-[0.18em] uppercase">
                  <IconCard /> <span>{t('h.hero.b2')}</span>
                </div>
                <div className="flex items-center gap-2 text-[0.72rem] tracking-[0.18em] uppercase">
                  <IconLock /> <span>{t('h.hero.b3')}</span>
                </div>
              </motion.div>
            </div>

            {/* Right — animated sphere over dashboard backdrop */}
            <div className="relative flex justify-center items-center">
              {/* Dashboard backdrop (blurred, low-opacity) */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ filter: 'blur(1.5px)', opacity: 0.5 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                aria-hidden="true"
              >
                <img
                  src="/img/dashboard.png"
                  alt=""
                  className="w-full max-w-md h-auto rounded-2xl"
                  style={{
                    transform: 'translateX(8%) rotate(-2deg)',
                    boxShadow: '0 30px 80px rgba(61,40,23,0.18)',
                  }}
                />
              </motion.div>
              {/* Sphere foreground — premium animation */}
              <div className="relative z-10 w-full flex justify-center">
                <AnimatedSphere size={440} priority />
              </div>
            </div>
          </div>

          {/* Testimonial carousel bar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 md:mt-12 relative"
          >
            <TestimonialBar />
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          2. IDENTIFICACIÓN EMOCIONAL
          ========================================================= */}
      <section className="section-pad" style={{ background: '#FFFDF7' }}>
        <div className="max-w-5xl mx-auto">
          <AnimSection className="text-center">
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold uppercase mb-4"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', letterSpacing: '0.02em' }}
            >
              {t('h.id.h2.line1')}<br/>{t('h.id.h2.line2')}
            </motion.h2>
            <motion.p variants={fadeUp}
              className="text-[#3D2817]/75 max-w-2xl mx-auto mb-12"
              style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
            >
              {t('h.id.sub')}
            </motion.p>

            {/* 4 cards */}
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: <IconMoney  />, key: 'h.id.card1' },
                { icon: <IconHeart  />, key: 'h.id.card2' },
                { icon: <IconGrowth />, key: 'h.id.card3' },
                { icon: <IconSpark  />, key: 'h.id.card4' },
              ].map((c, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="rounded-2xl p-6 flex items-center gap-5 text-left"
                  style={{ background: '#E8DCC8' }}
                >
                  <div className="flex-shrink-0">{c.icon}</div>
                  <p className="text-[#3D2817]" style={{ fontSize: '0.88rem', lineHeight: 1.55 }}>
                    {t(c.key)}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p variants={fadeUp}
              className="text-[#5B3E2A] italic mt-10"
              style={{ fontSize: '0.92rem' }}
            >
              {t('h.id.outro')}
            </motion.p>
          </AnimSection>
        </div>
      </section>

      {/* =========================================================
          3. ¿QUÉ PUEDE AYUDARTE A DESCUBRIR ABUNDANCE CODE?
          ========================================================= */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto">
          <AnimSection className="text-center">
            <motion.p variants={fadeUp} className="eyebrow mb-3">
              {t('h.cyc.eyebrow')}
            </motion.p>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold mb-12 max-w-3xl mx-auto"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.2 }}
            >
              {t('h.cyc.h2')}
            </motion.h2>

            {/* 3 tarjetas */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
              {[
                { icon: '🔒', tKey: 'h.cyc.c1.t', dKey: 'h.cyc.c1.d' },
                { icon: '💎', tKey: 'h.cyc.c2.t', dKey: 'h.cyc.c2.d' },
                { icon: '✨', tKey: 'h.cyc.c3.t', dKey: 'h.cyc.c3.d' },
              ].map((c, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="rounded-2xl p-7 flex flex-col"
                  style={{ background: '#FFFDF7', border: '1px solid #E8DCC8', boxShadow: '0 6px 20px rgba(61,40,23,0.05)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl"
                    style={{ background: '#E8DCC8', color: '#3D2817' }}
                  >
                    <span>{c.icon}</span>
                  </div>
                  <h3 className="text-[#3D2817] font-semibold mb-2" style={{ fontSize: '1rem' }}>
                    {t(c.tKey)}
                  </h3>
                  <p className="text-[#3D2817]/80" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {t(c.dKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* =========================================================
          4. CÓMO FUNCIONA
          ========================================================= */}
      <section className="section-pad" style={{ background: '#FFFDF7' }}>
        <div className="max-w-6xl mx-auto">
          <AnimSection className="text-center">
            <p className="eyebrow mb-3">{t('h.how.eyebrow')}</p>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold uppercase mb-4"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '0.02em' }}
            >
              {t('h.how.h2')}
            </motion.h2>
            <motion.p variants={fadeUp}
              className="text-[#3D2817]/75 max-w-2xl mx-auto mb-12"
              style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
            >
              {t('h.how.sub')}
            </motion.p>

            {/* 3 pasos */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { n: 1, tKey: 'h.how.s1.title', dKey: 'h.how.s1.desc' },
                { n: 2, tKey: 'h.how.s2.title', dKey: 'h.how.s2.desc' },
                { n: 3, tKey: 'h.how.s3.title', dKey: 'h.how.s3.desc' },
              ].map((s) => (
                <motion.div key={s.n} variants={fadeUp}
                  className="rounded-2xl p-6 text-left flex flex-col"
                  style={{ background: '#F5F1ED', border: '1px solid #E8DCC8' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
                      style={{ border: '1px solid #D4AF37', color: '#D4AF37' }}
                    >
                      {s.n}
                    </span>
                    <h3 className="text-[#3D2817] font-semibold" style={{ fontSize: '1rem' }}>
                      {t(s.tKey)}
                    </h3>
                  </div>
                  <p className="text-[#3D2817]/75" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
                    {t(s.dKey)}
                  </p>
                </motion.div>
              ))}
            </div>

            <AccentDivider />
            <motion.p variants={fadeUp}
              className="text-[#D4AF37] uppercase tracking-[0.32em] mt-4"
              style={{ fontSize: '0.8rem' }}
            >
              {t('h.how.tagline')}
            </motion.p>

            {/* trust strip */}
            <motion.div variants={fadeUp}
              className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left"
            >
              {[
                { icon: <IconCard />,    tKey: 'h.how.f1.t', dKey: 'h.how.f1.d' },
                { icon: <IconLock />,    tKey: 'h.how.f2.t', dKey: 'h.how.f2.d' },
                { icon: <IconStar />,    tKey: 'h.how.f3.t', dKey: 'h.how.f3.d' },
                { icon: <IconDiamond />, tKey: 'h.how.f4.t', dKey: 'h.how.f4.d' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-[#3D2817] uppercase tracking-[0.18em]" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                      {t(f.tKey)}
                    </p>
                    <p className="text-[#5B3E2A] mt-1" style={{ fontSize: '0.72rem', lineHeight: 1.45 }}>
                      {t(f.dKey)}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimSection>
        </div>
      </section>

      {/* =========================================================
          5. QUÉ DESBLOQUEA TU PORTAL
          ========================================================= */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto">
          <AnimSection className="text-center">
            <p className="eyebrow mb-3">{t('h.unl.eyebrow')}</p>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold uppercase mb-4"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '0.02em' }}
            >
              {t('h.unl.h2')}
            </motion.h2>
            <motion.p variants={fadeUp}
              className="text-[#3D2817]/75 max-w-2xl mx-auto mb-12"
              style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
            >
              {t('h.unl.sub')}
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                { n: '01', tKey: 'h.unl.c1.t', dKey: 'h.unl.c1.d', preview: 'pattern' },
                { n: '02', tKey: 'h.unl.c2.t', dKey: 'h.unl.c2.d', preview: 'alignment' },
                { n: '03', tKey: 'h.unl.c3.t', dKey: 'h.unl.c3.d', preview: 'ask' },
              ].map((c) => (
                <motion.div key={c.n} variants={fadeUp}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: '#FFFDF7', border: '1px solid #E8DCC8' }}
                >
                  <div className="p-6">
                    <p className="text-[#D4AF37] tracking-[0.3em] mb-2" style={{ fontSize: '0.7rem' }}>{c.n}</p>
                    <h3 className="text-[#3D2817] font-semibold mb-2 uppercase" style={{ fontSize: '0.92rem', letterSpacing: '0.04em' }}>
                      {t(c.tKey)}
                    </h3>
                    <p className="text-[#3D2817]/75" style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
                      {t(c.dKey)}
                    </p>
                  </div>
                  {/* mock preview */}
                  <div className="mx-4 mb-4 rounded-lg p-4 text-[#3D2817]"
                    style={{ background: c.preview === 'alignment' ? '#1E1A16' : '#F5F1ED',
                             color: c.preview === 'alignment' ? '#F5F1ED' : '#3D2817' }}>
                    {c.preview === 'pattern' && (
                      <div className="text-[10px] space-y-1">
                        <p className="font-semibold">{t('h.unl.c1.t')}</p>
                        <p className="opacity-70">{t('h.unl.c1.preview')}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="h-6 rounded" style={{ background: '#E8DCC8' }} />
                          ))}
                        </div>
                        <p className="text-[#D4AF37] mt-2 text-[9px]">{t('h.unl.c1.cta')}</p>
                      </div>
                    )}
                    {c.preview === 'alignment' && (
                      <div className="text-[10px] space-y-2">
                        <p className="font-semibold tracking-widest" style={{ color: '#D4AF37' }}>{t('h.unl.c2.label')}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full flex items-center justify-center font-semibold"
                            style={{ border: '2px solid #D4AF37', fontSize: '14px' }}>78%</div>
                          <div className="space-y-1 text-[9px] opacity-80">
                            <p>{t('h.unl.c2.line1')}</p>
                            <p>{t('h.unl.c2.line2')}</p>
                            <p>{t('h.unl.c2.line3')}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {c.preview === 'ask' && (
                      <div className="text-[10px] space-y-2">
                        <p className="font-semibold">{t('h.unl.c3.t')}</p>
                        <div className="rounded-md px-3 py-2" style={{ background: '#E8DCC8' }}>
                          {t('h.unl.c3.q')}
                        </div>
                        <p className="opacity-70 text-[9px] leading-snug">
                          {t('h.unl.c3.a')}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp}
              className="mt-10 rounded-2xl py-6 px-4"
              style={{ background: '#E8DCC8' }}
            >
              <p className="text-[#3D2817] font-semibold mb-1" style={{ fontSize: '1rem' }}>
                {t('h.unl.banner.t')}
              </p>
              <p className="text-[#D4AF37] uppercase tracking-[0.32em]" style={{ fontSize: '0.78rem' }}>
                {t('h.unl.banner.s')}
              </p>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      {/* =========================================================
          6. INSIDE THE BOX
          ========================================================= */}
      <section className="section-pad" style={{ background: '#FFFDF7' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left — box photo */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <BoxImage />
            </motion.div>

            {/* Right — content list */}
            <AnimSection>
              <motion.p variants={fadeUp} className="eyebrow mb-3">
                {t('h.box.eyebrow')}
              </motion.p>
              <motion.h2 variants={fadeUp}
                className="text-[#3D2817] font-semibold mb-4"
                style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1.2 }}
              >
                {t('h.box.h2.line1')}<br/>{t('h.box.h2.line2')}
              </motion.h2>
              <motion.p variants={fadeUp}
                className="text-[#3D2817]/75 mb-6"
                style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
              >
                {t('h.box.sub')}
              </motion.p>

              <ul className="space-y-3 mb-6">
                {[
                  { icon: '🔮', key: 'h.box.item1' },
                  { icon: '💡', key: 'h.box.item2' },
                  { icon: '🎴', key: 'h.box.item3' },
                  { icon: '🌐', key: 'h.box.item4' },
                  { icon: '🌟', key: 'h.box.item5' },
                  { icon: '🎁', key: 'h.box.item6' },
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp}
                    className="flex items-start gap-3 text-[#3D2817]"
                    style={{ fontSize: '0.88rem', lineHeight: 1.5 }}
                  >
                    <span
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ background: '#E8DCC8' }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="pt-1">{t(item.key)}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={fadeUp} className="pt-5 border-t" style={{ borderColor: '#E8DCC8' }}>
                <p className="text-[#5B3E2A] flex items-center gap-2" style={{ fontSize: '0.85rem' }}>
                  <span className="text-[#D4AF37]">✦</span>
                  <span>{t('h.box.outro.lead')} <em className="text-[#D4AF37] not-italic">{t('h.box.outro.gold')}</em></span>
                </p>
              </motion.div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. TESTIMONIOS
          ========================================================= */}
      <section className="section-pad">
        <TestimonialCards />
      </section>

      {/* =========================================================
          8. FINAL CTA + FAQ link
          ========================================================= */}
      <section className="section-pad" style={{ background: '#E8DCC8' }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimSection>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold uppercase mb-4"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '0.02em' }}
            >
              {t('h.cta.h2')}
            </motion.h2>
            <motion.p variants={fadeUp}
              className="text-[#3D2817]/85 max-w-xl mx-auto mb-8"
              style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
            >
              {t('h.cta.body.line1')}<br/>
              {t('h.cta.body.line2')}
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center mb-8">
              <Link to="/checkout" className="btn-primary px-10 sm:px-12">{t('h.cta.btn1')}</Link>
            </motion.div>
            <motion.p variants={fadeUp}
              className="inline-flex items-center gap-2 text-[#5B3E2A]"
              style={{ fontSize: '0.78rem' }}
            >
              <IconCheck /> <span>{t('h.cta.note')}</span>
            </motion.p>
          </AnimSection>
        </div>
      </section>

    </main>
  );
}
