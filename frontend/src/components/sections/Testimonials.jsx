import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LanguageContext.jsx';

/* =========================================================
   ABUNDANCE CODE — Testimonials
   Two components sharing the same data:
   - <TestimonialBar />    compact, for the Hero bottom strip
   - <TestimonialCards />  full, for Section 7 + Product page
   ========================================================= */

const TESTIMONIALS = [
  { id: 1, key: 'tm.1', initials: 'V', gradient: 'linear-gradient(135deg, #D4AF37, #3D2817)' },
  { id: 2, key: 'tm.2', initials: 'C', gradient: 'linear-gradient(135deg, #E8DCC8, #D4AF37)' },
  { id: 3, key: 'tm.3', initials: 'L', gradient: 'linear-gradient(135deg, #5B3E2A, #D4AF72)' },
];

/* Avatar placeholder — replace with <img src="/img/testimonials/xxx.jpg"> when photos are ready */
function Avatar({ initials, gradient, size = 40, ring = true, photo = null }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold select-none"
      style={{
        width: size,
        height: size,
        background: photo ? `url(${photo}) center/cover` : gradient,
        color: '#F5F1ED',
        fontSize: size * 0.4,
        border: ring ? '2px solid #F5F1ED' : 'none',
        boxShadow: '0 4px 12px rgba(61,40,23,0.15)',
      }}
    >
      {!photo && initials}
    </div>
  );
}

/* ------------------------------------------------------------------
   Hero bar — compact rotating testimonial with 3 small avatars
   ------------------------------------------------------------------ */
export function TestimonialBar() {
  const { t } = useLang();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI(x => (x + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(id);
  }, []);

  const cur = TESTIMONIALS[i];

  return (
    <div
      className="rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6"
      style={{ background: '#FFFDF7', border: '1px solid #E8DCC8' }}
    >
      <span className="text-[#D4AF37] text-xl shrink-0">✦</span>

      <div className="flex-1 min-h-[3rem] text-center md:text-left">
        <AnimatePresence mode="wait">
          <motion.p
            key={cur.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-[#3D2817]/85 italic"
            style={{ fontSize: '0.85rem', lineHeight: 1.55 }}
          >
            &ldquo;{t(`${cur.key}.text`).slice(0, 140)}{t(`${cur.key}.text`).length > 140 ? '…' : ''}&rdquo;
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex -space-x-2">
          {TESTIMONIALS.map((tm) => (
            <Avatar key={tm.id} initials={tm.initials} gradient={tm.gradient} size={36} />
          ))}
        </div>
        <p className="text-[#5B3E2A] text-xs">
          <strong className="text-[#3D2817]">+2.400</strong><br/>
          <span className="text-[10px]">{t('h.hero.count.label')}</span>
        </p>
      </div>

      {/* dots */}
      <div className="flex items-center gap-1.5 md:absolute md:bottom-1.5 md:left-1/2 md:-translate-x-1/2">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Testimonio ${idx + 1}`}
            className="rounded-full transition-all"
            style={{
              width: idx === i ? 16 : 6,
              height: 6,
              background: idx === i ? '#D4AF37' : '#E8DCC8',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Full section — 3-card layout with photo, quote, name, result
   ------------------------------------------------------------------ */
export function TestimonialCards({ withSubtitle = true, eyebrow, h2, sub }) {
  const { t } = useLang();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        {eyebrow !== false && (
          <p className="eyebrow mb-3">{eyebrow || t('tm.eyebrow')}</p>
        )}
        <h2
          className="text-[#3D2817] font-semibold mb-3"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.2 }}
        >
          {h2 || t('tm.h2')}
        </h2>
        {withSubtitle && (
          <p className="text-[#3D2817]/75 max-w-2xl mx-auto" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
            {sub || t('tm.sub')}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((tm, idx) => (
          <motion.article
            key={tm.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: '#FFFDF7', border: '1px solid #E8DCC8', boxShadow: '0 6px 20px rgba(61,40,23,0.06)' }}
          >
            <span className="text-[#D4AF37] text-2xl leading-none mb-3">"</span>
            <p
              className="text-[#3D2817]/90 italic mb-6 flex-1"
              style={{ fontSize: '0.92rem', lineHeight: 1.7 }}
            >
              {t(`${tm.key}.text`)}
            </p>

            <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: '#E8DCC8' }}>
              <Avatar initials={tm.initials} gradient={tm.gradient} size={48} ring={false} />
              <div>
                <p className="text-[#3D2817] font-semibold" style={{ fontSize: '0.92rem' }}>
                  {t(`${tm.key}.name`)}
                </p>
                <p className="text-[#5B3E2A]" style={{ fontSize: '0.78rem' }}>
                  {t(`${tm.key}.loc`)}
                </p>
              </div>
            </div>

            <p
              className="mt-3 inline-flex items-start gap-2 text-[#D4AF37] uppercase"
              style={{ fontSize: '0.7rem', letterSpacing: '0.18em', lineHeight: 1.4 }}
            >
              <span>✦</span><span>{t(`${tm.key}.result`)}</span>
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
