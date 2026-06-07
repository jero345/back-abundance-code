import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext.jsx';
import { TestimonialCards } from '../components/sections/Testimonials.jsx';

/* =========================================================
   ABUNDANCE CODE — Product page
   Spec from "abundance_code_product_page" brief:
     Hero
     S1 · El dolor
     S2 · La promesa (3 cards)
     S3 · El producto físico (6 items + box image)
     S4 · Romper la objeción principal
     S5 · Testimonios
     S6 · Precio + CTA final + garantía
     Cierre final · frase + CTA
   ========================================================= */

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function AnimSection({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
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

export default function Product() {
  const { t } = useLang();

  return (
    <main className="bg-[#F5F1ED] pt-16 md:pt-20">

      {/* =========================================================
          HERO  (40% copy / 60% sphere)
          ========================================================= */}
      <section className="px-4 md:px-6 pt-8 pb-14 md:pt-12 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 md:gap-12 items-center">

            {/* Left 40% — copy */}
            <div className="md:col-span-2">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="eyebrow mb-4"
              >
                {t('p.hero.eyebrow')}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-[#3D2817] font-semibold mb-5"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', lineHeight: 1.2 }}
              >
                {t('p.hero.h1')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-[#3D2817]/85 leading-relaxed mb-7"
                style={{ fontSize: '0.92rem' }}
              >
                {t('p.hero.sub')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <Link to="/checkout" className="btn-primary w-full sm:w-auto text-center">{t('p.hero.cta1')}</Link>
                <a href="#includes" className="btn-outline w-full sm:w-auto text-center">{t('p.hero.cta2')}</a>
              </motion.div>
            </div>

            {/* Right 60% — sphere hyper-real (solo la esfera) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="md:col-span-3 flex justify-center"
            >
              <img
                src="/img/sphere-transparent.png"
                alt="Esfera de cristal Abundance Code"
                width={560}
                height={560}
                loading="eager"
                decoding="async"
                className="block w-full h-auto"
                style={{ maxWidth: 560 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 1 — EL DOLOR
          ========================================================= */}
      <section className="section-pad" style={{ background: '#FFFDF7' }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimSection>
            <motion.p variants={fadeUp} className="eyebrow mb-3">{t('p.s1.eyebrow')}</motion.p>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold mb-6"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1.2 }}
            >
              {t('p.s1.h2')}
            </motion.h2>
            <motion.p variants={fadeUp}
              className="text-[#3D2817]/85 mb-4"
              style={{ fontSize: '0.95rem', lineHeight: 1.7 }}
            >
              {t('p.s1.p1')}
            </motion.p>
            <motion.p variants={fadeUp}
              className="text-[#3D2817] font-semibold mb-6"
              style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
            >
              {t('p.s1.p2')}
            </motion.p>
            <motion.p variants={fadeUp}
              className="italic"
              style={{ fontSize: '0.95rem', color: '#D4AF37', lineHeight: 1.5 }}
            >
              {t('p.s1.outro')}
            </motion.p>
          </AnimSection>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 2 — LA PROMESA (3 columnas)
          ========================================================= */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto">
          <AnimSection className="text-center">
            <motion.p variants={fadeUp} className="eyebrow mb-3">{t('p.s2.eyebrow')}</motion.p>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold mb-12 max-w-3xl mx-auto"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1.25 }}
            >
              {t('p.s2.h2')}
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
              {[
                { icon: '🔑', tKey: 'p.s2.c1.t', dKey: 'p.s2.c1.d' },
                { icon: '💕', tKey: 'p.s2.c2.t', dKey: 'p.s2.c2.d' },
                { icon: '✨', tKey: 'p.s2.c3.t', dKey: 'p.s2.c3.d' },
              ].map((c, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="rounded-2xl p-7 flex flex-col"
                  style={{ background: '#FFFDF7', border: '1px solid #E8DCC8', boxShadow: '0 6px 20px rgba(61,40,23,0.05)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl"
                    style={{ background: '#E8DCC8' }}
                    aria-hidden="true"
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
          SECCIÓN 3 — EL PRODUCTO FÍSICO (box + 6 items)
          ========================================================= */}
      <section id="includes" className="section-pad" style={{ background: '#FFFDF7' }}>
        <div className="max-w-6xl mx-auto">
          <AnimSection className="text-center mb-10">
            <motion.p variants={fadeUp} className="eyebrow mb-3">{t('p.s3.eyebrow')}</motion.p>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold mb-6"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1.25 }}
            >
              {t('p.s3.h2')}
            </motion.h2>
            <motion.p variants={fadeUp}
              className="text-[#3D2817]/80 max-w-2xl mx-auto mb-2"
              style={{ fontSize: '0.92rem', lineHeight: 1.6 }}
            >
              {t('p.s3.p1')}
            </motion.p>
            <motion.p variants={fadeUp}
              className="text-[#3D2817] font-semibold max-w-2xl mx-auto"
              style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
            >
              {t('p.s3.p2')}
            </motion.p>
          </AnimSection>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Box image */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:sticky md:top-24"
            >
              <img
                src="/img/box.png"
                alt="Caja Abundance Code con esfera, tarjeta de activación y código personal"
                loading="lazy"
                decoding="async"
                className="block w-full h-auto rounded-2xl"
                style={{ boxShadow: '0 24px 60px rgba(61,40,23,0.28), 0 6px 20px rgba(61,40,23,0.14)' }}
              />
            </motion.div>

            {/* Items list */}
            <AnimSection>
              <ul className="space-y-5">
                {[
                  { icon: '🔮', tKey: 'p.s3.i1.t', dKey: 'p.s3.i1.d' },
                  { icon: '💡', tKey: 'p.s3.i2.t', dKey: 'p.s3.i2.d' },
                  { icon: '🎴', tKey: 'p.s3.i3.t', dKey: 'p.s3.i3.d' },
                  { icon: '🌐', tKey: 'p.s3.i4.t', dKey: 'p.s3.i4.d' },
                  { icon: '🌟', tKey: 'p.s3.i5.t', dKey: 'p.s3.i5.d' },
                  { icon: '🎁', tKey: 'p.s3.i6.t', dKey: 'p.s3.i6.d' },
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex gap-4 items-start">
                    <span
                      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl"
                      style={{ background: '#E8DCC8' }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="text-[#3D2817] font-semibold mb-1" style={{ fontSize: '0.95rem' }}>
                        {t(item.tKey)}
                      </h3>
                      <p className="text-[#3D2817]/80" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>
                        {t(item.dKey)}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={fadeUp} className="mt-8 pt-6 border-t" style={{ borderColor: '#E8DCC8' }}>
                <p className="italic flex items-center gap-2" style={{ color: '#D4AF37', fontSize: '0.9rem' }}>
                  <span>✦</span><span>{t('p.s3.outro')}</span>
                </p>
              </motion.div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 4 — ROMPER LA OBJECIÓN
          ========================================================= */}
      <section className="section-pad">
        <div className="max-w-3xl mx-auto">
          <AnimSection>
            <motion.p variants={fadeUp} className="eyebrow mb-3 text-center">{t('p.s4.eyebrow')}</motion.p>
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold text-center mb-8"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1.25 }}
            >
              {t('p.s4.h2')}
            </motion.h2>

            <div className="space-y-5 text-[#3D2817]/85" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
              <motion.p variants={fadeUp}>{t('p.s4.p1')}</motion.p>
              <motion.p variants={fadeUp}>{t('p.s4.p2')}</motion.p>
              <motion.p variants={fadeUp}>{t('p.s4.p3')}</motion.p>

              <motion.div variants={fadeUp}
                className="rounded-xl p-5 my-2"
                style={{ background: '#E8DCC8' }}
              >
                <p className="text-[#3D2817] mb-1">{t('p.s4.p4.q1')}</p>
                <p className="text-[#3D2817] font-semibold">{t('p.s4.p4.q2')}</p>
              </motion.div>

              <motion.p variants={fadeUp}>{t('p.s4.p5')}</motion.p>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 5 — TESTIMONIOS
          ========================================================= */}
      <section className="section-pad" style={{ background: '#FFFDF7' }}>
        <TestimonialCards />
      </section>

      {/* =========================================================
          SECCIÓN 6 — PRECIO + CTA FINAL + GARANTÍA
          ========================================================= */}
      <section className="section-pad" style={{ background: '#E8DCC8' }}>
        <div className="max-w-3xl mx-auto">
          <AnimSection className="text-center">
            <motion.p variants={fadeUp} className="eyebrow mb-3">{t('p.s6.eyebrow')}</motion.p>
            <AccentDivider />
            <motion.h2 variants={fadeUp}
              className="text-[#3D2817] font-semibold mb-8"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.2 }}
            >
              {t('p.s6.h2')}
            </motion.h2>

            {/* Price block */}
            <motion.div variants={fadeUp}
              className="rounded-2xl p-7 md:p-9 mb-7"
              style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.4)', boxShadow: '0 10px 30px rgba(61,40,23,0.10)' }}
            >
              <p className="text-[#3D2817] font-semibold mb-2"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                {t('p.s6.price')}
              </p>
              <p className="text-[#5B3E2A] mb-5" style={{ fontSize: '0.78rem' }}>
                {t('p.s6.price.note')}
              </p>

              <div className="pt-5 border-t text-left max-w-md mx-auto" style={{ borderColor: '#E8DCC8' }}>
                <p className="text-[#3D2817] font-semibold mb-3 uppercase tracking-[0.18em]" style={{ fontSize: '0.7rem' }}>
                  {t('p.s6.val.title')}
                </p>
                <ul className="space-y-2">
                  {['p.s6.val.1', 'p.s6.val.2', 'p.s6.val.3', 'p.s6.val.4'].map((k) => (
                    <li key={k} className="flex items-start gap-2 text-[#3D2817]" style={{ fontSize: '0.85rem' }}>
                      <span className="text-[#D4AF37] mt-0.5">✦</span>
                      <span>{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8">
              <Link to="/checkout" className="btn-primary w-full sm:w-auto text-center">
                {t('p.s6.cta1')}
              </Link>
              <Link to="/contact" className="btn-outline w-full sm:w-auto text-center">
                {t('p.s6.cta2')}
              </Link>
            </motion.div>

            {/* Garantía */}
            <motion.div variants={fadeUp}
              className="rounded-2xl p-6 text-left"
              style={{ background: '#FFFDF7', border: '1px solid #E8DCC8' }}
            >
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: '#E8DCC8' }} aria-hidden="true">
                  🛡️
                </span>
                <div>
                  <p className="text-[#3D2817] font-semibold mb-1" style={{ fontSize: '0.95rem' }}>
                    {t('p.s6.guarantee.t')}
                  </p>
                  <p className="text-[#3D2817]/80" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {t('p.s6.guarantee.d')}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      {/* =========================================================
          CIERRE FINAL
          ========================================================= */}
      <section className="section-pad">
        <div className="max-w-2xl mx-auto text-center">
          <AnimSection>
            <motion.p variants={fadeUp}
              className="italic text-[#3D2817] mb-8"
              style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)', lineHeight: 1.6 }}
            >
              "{t('p.end.line')}"
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/checkout" className="btn-primary px-12">{t('p.end.cta')}</Link>
            </motion.div>
          </AnimSection>
        </div>
      </section>

    </main>
  );
}
