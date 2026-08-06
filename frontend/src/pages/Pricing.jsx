import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import {
  PRICE_INITIAL,
  PRICE_MONTHLY,
  INCLUDED_DAYS,
  money,
} from '../config.js';

/* =========================================================
   ABUNDANCE CODE — Precios
   Aquí se cobra: el formulario abre Stripe Checkout en modo
   suscripción. Al terminar, Stripe devuelve al usuario
   directamente a la app con su token de acceso.
   Los importes vienen de config.js, nunca del i18n.
   ========================================================= */

const API = (import.meta.env.VITE_API_URL || '') + '/api';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function AccentDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <span className="block w-8 h-px bg-[#D4AF37]" />
      <span className="text-[#D4AF37] text-sm leading-none">✦</span>
      <span className="block w-8 h-px bg-[#D4AF37]" />
    </div>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="#D4AF37" strokeWidth="2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const INCLUDED_KEYS = ['pr.inc1', 'pr.inc2', 'pr.inc3', 'pr.inc4', 'pr.inc5', 'pr.inc6'];

export default function Pricing() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const [email, setEmail]     = useState('');
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [notice, setNotice]   = useState('');

  /* Sustituye {days} por los días que cubre el pago inicial. */
  const days = (text) => text.replace('{days}', INCLUDED_DAYS);

  /* De qué sección del sitio vino el clic. Viaja hasta Stripe como metadato
     para poder atribuir la venta después. */
  const campaign = searchParams.get('from')
    || searchParams.get('utm_campaign')
    || 'pricing-direct';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email.trim()) { setError(t('pr.errEmail')); return; }
    setLoading(true);

    try {
      const res = await fetch(`${API}/stripe/create-subscription-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: email.trim(),
          customerName:  name.trim(),
          utmCampaign:   campaign,
        }),
      });
      const data = await res.json();

      /* Ya es cliente: en vez de cobrarle otra vez, se le manda a recuperar
         su enlace de acceso. */
      if (data.alreadySubscribed) {
        setNotice(t('pr.alreadySubscribed'));
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError(data.message || t('pr.errGeneric'));
      setLoading(false);
    } catch {
      setError(t('pr.errNetwork'));
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F5F1ED] pt-24 pb-4">

      {/* ===== Encabezado ===== */}
      <section className="px-4 md:px-6">
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p variants={fadeUp} className="eyebrow mb-3">{t('pr.eyebrow')}</motion.p>
          <AccentDivider />
          <motion.h1 variants={fadeUp}
            className="uppercase font-semibold text-[#3D2817] mb-4"
            style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)', lineHeight: 1.15, letterSpacing: '0.01em' }}
          >
            {t('pr.h1')}
          </motion.h1>
          <motion.p variants={fadeUp}
            className="text-[#3D2817]/80 max-w-xl mx-auto"
            style={{ fontSize: '0.92rem', lineHeight: 1.6 }}
          >
            {days(t('pr.sub'))}
          </motion.p>
        </motion.div>
      </section>

      {/* ===== Tarjeta del plan ===== */}
      <section id="plan" className="section-pad pt-12" style={{ scrollMarginTop: '6rem' }}>
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#FFFDF7',
              border: '1px solid rgba(212,175,55,0.45)',
              boxShadow: '0 20px 60px rgba(61,40,23,0.10)',
            }}
          >
            {/* Franja superior */}
            <div className="text-center py-3" style={{ background: '#3D2817' }}>
              <p className="text-[#D4AF37] uppercase tracking-[0.28em]" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                {days(t('pr.badge'))}
              </p>
            </div>

            <div className="p-8">
              {/* Precio: lo que se paga hoy, y lo que se paga después */}
              <div className="text-center pb-7 mb-7 border-b" style={{ borderColor: '#E8DCC8' }}>
                <p className="text-[#5B3E2A] uppercase tracking-[0.22em] mb-4" style={{ fontSize: '0.72rem' }}>
                  {t('pr.planName')}
                </p>

                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-[#3D2817] font-semibold" style={{ fontSize: '3rem', lineHeight: 1 }}>
                    ${money(PRICE_INITIAL)}
                  </span>
                  <span className="text-[#5B3E2A]" style={{ fontSize: '0.85rem' }}>{t('pr.today')}</span>
                </div>

                <p className="text-[#3D2817]/70 mt-2" style={{ fontSize: '0.82rem' }}>
                  {days(t('pr.includes30'))}
                </p>

                {/* Lo que pasa el día 31 — en su propio bloque, no en letra pequeña */}
                <div className="mt-5 rounded-xl px-5 py-4" style={{ background: '#F5F1ED' }}>
                  <p className="text-[#5B3E2A] uppercase tracking-[0.2em] mb-1"
                    style={{ fontSize: '0.64rem', fontWeight: 600 }}
                  >
                    {days(t('pr.afterLabel'))}
                  </p>
                  <p className="text-[#3D2817] font-semibold" style={{ fontSize: '1.1rem' }}>
                    ${money(PRICE_MONTHLY)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{t('pr.perMonth')}</span>
                  </p>
                  <p className="text-[#5B3E2A] mt-1.5" style={{ fontSize: '0.76rem', lineHeight: 1.5 }}>
                    {t('pr.afterDetail')}
                  </p>
                </div>
              </div>

              {/* Incluye */}
              <p className="text-[#3D2817] uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                {t('pr.includes')}
              </p>
              <ul className="space-y-3 mb-8">
                {INCLUDED_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-[#3D2817]" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    <IconCheck />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>

              {/* Formulario de compra — abre Stripe Checkout */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('pr.namePlaceholder')}
                  autoComplete="name"
                  className="w-full rounded-xl px-4 py-3 outline-none transition-colors"
                  style={{ background: '#F5F1ED', border: '1px solid #E8DCC8', color: '#3D2817', fontSize: '0.9rem' }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('pr.emailPlaceholder')}
                  autoComplete="email"
                  className="w-full rounded-xl px-4 py-3 outline-none transition-colors"
                  style={{ background: '#F5F1ED', border: '1px solid #E8DCC8', color: '#3D2817', fontSize: '0.9rem' }}
                />

                <p className="text-[#5B3E2A]" style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>
                  {t('pr.emailNote')}
                </p>

                {error && (
                  <p className="text-center" style={{ color: '#B0413E', fontSize: '0.8rem' }}>{error}</p>
                )}
                {notice && (
                  <p className="text-center text-[#3D2817]" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                    {notice}{' '}
                    <Link to="/activar-acceso" className="text-[#D4AF37] underline underline-offset-4">
                      {t('pr.recoverLink')}
                    </Link>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-center"
                  style={loading ? { opacity: 0.6, cursor: 'wait' } : undefined}
                >
                  {loading ? t('pr.loading') : t('pr.cta')}
                </button>
              </form>

              <p className="text-center text-[#5B3E2A] mt-4" style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                {t('pr.noCard')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Tranquilizadores ===== */}
      <section className="section-pad pt-0">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { t: 'pr.r1.t', d: 'pr.r1.d' },
            { t: 'pr.r2.t', d: 'pr.r2.d' },
            { t: 'pr.r3.t', d: 'pr.r3.d' },
          ].map((r) => (
            <motion.div key={r.t}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-6"
              style={{ background: '#FFFDF7', border: '1px solid #E8DCC8' }}
            >
              <p className="text-[#3D2817] uppercase tracking-[0.18em] mb-2" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                {t(r.t)}
              </p>
              <p className="text-[#5B3E2A]" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                {t(r.d)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Cierre ===== */}
      <section className="section-pad" style={{ background: '#E8DCC8' }}>
        <div className="max-w-2xl mx-auto text-center">
          <AccentDivider />
          <h2 className="text-[#3D2817] font-semibold uppercase mb-4"
            style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', letterSpacing: '0.02em' }}
          >
            {t('pr.close.h2')}
          </h2>
          <p className="text-[#3D2817]/85 mb-7" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
            {t('pr.close.body')}
          </p>
          {/* Sube al formulario de arriba en vez de duplicarlo */}
          <a href="#plan" className="btn-primary px-10">
            {t('pr.close.cta')}
          </a>
          <p className="mt-6" style={{ fontSize: '0.78rem' }}>
            <Link to="/faq" className="text-[#5B3E2A] underline underline-offset-4 hover:text-[#3D2817] transition-colors">
              {t('pr.close.faq')}
            </Link>
          </p>
        </div>
      </section>

    </main>
  );
}
