import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';

/* =========================================================
   ABUNDANCE CODE — Recuperar el acceso

   Para quien pagó y perdió su enlace: correo en spam, pestaña
   cerrada, enlace caducado. Pide el correo de la compra y el
   backend le reenvía un token nuevo.

   El backend responde siempre lo mismo exista o no la
   suscripción, para no filtrar quién es cliente. Así que esta
   página tampoco puede prometer más de lo que sabe.
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

export default function AccessRecovery() {
  const { t } = useLang();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError(t('rec.errEmail')); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/access/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error('request failed');
      setSent(true);
    } catch {
      setError(t('rec.errNetwork'));
    }
    setLoading(false);
  };

  return (
    <main className="bg-[#F5F1ED] pt-24 pb-4 min-h-screen">
      <section className="section-pad">
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-md mx-auto text-center"
        >
          <motion.p variants={fadeUp} className="eyebrow mb-3">{t('rec.eyebrow')}</motion.p>
          <AccentDivider />
          <motion.h1 variants={fadeUp}
            className="uppercase font-semibold text-[#3D2817] mb-4"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.2, letterSpacing: '0.01em' }}
          >
            {t('rec.h1')}
          </motion.h1>

          {sent ? (
            <motion.div variants={fadeUp}
              className="rounded-2xl p-8 mt-6"
              style={{ background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.45)' }}
            >
              <p className="text-[#3D2817] mb-3" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                {t('rec.sent')}
              </p>
              <p className="text-[#5B3E2A]" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                {t('rec.sentNote')}
              </p>
            </motion.div>
          ) : (
            <>
              <motion.p variants={fadeUp}
                className="text-[#3D2817]/80 mb-8"
                style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
              >
                {t('rec.sub')}
              </motion.p>

              <motion.form variants={fadeUp} onSubmit={handleSubmit}
                className="rounded-2xl p-7 text-left space-y-3"
                style={{ background: '#FFFDF7', border: '1px solid #E8DCC8' }}
              >
                <label htmlFor="rec-email" className="block text-[#3D2817] uppercase tracking-[0.18em]"
                  style={{ fontSize: '0.68rem', fontWeight: 600 }}
                >
                  {t('rec.label')}
                </label>
                <input
                  id="rec-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('rec.placeholder')}
                  autoComplete="email"
                  className="w-full rounded-xl px-4 py-3 outline-none"
                  style={{ background: '#F5F1ED', border: '1px solid #E8DCC8', color: '#3D2817', fontSize: '0.9rem' }}
                />

                {error && (
                  <p className="text-center" style={{ color: '#B0413E', fontSize: '0.8rem' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-center"
                  style={loading ? { opacity: 0.6, cursor: 'wait' } : undefined}
                >
                  {loading ? t('rec.loading') : t('rec.cta')}
                </button>
              </motion.form>
            </>
          )}

          <motion.p variants={fadeUp} className="mt-8" style={{ fontSize: '0.78rem' }}>
            <Link to="/contact" className="text-[#5B3E2A] underline underline-offset-4 hover:text-[#3D2817] transition-colors">
              {t('rec.help')}
            </Link>
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
