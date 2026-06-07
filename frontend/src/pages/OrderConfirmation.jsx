import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, Smartphone, Sparkles } from 'lucide-react';
import StarField from '../components/bits/StarField.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const metalStyle = {
  background: 'linear-gradient(180deg, #E6C76A 0%, #D4AF37 40%, #C9A227 70%, #E6C76A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function AnimSection({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { t } = useLang();

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/stripe/session/${sessionId}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const isPremium = order?.product === 'crystal-code-premium';

  return (
    <main className="relative min-h-screen bg-[#F5F1ED] pb-20">
      <StarField count={40} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-20">

        {/* â”€â”€ 1. HEADER â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border border-gold/30 mb-8">
            <span className="text-3xl">ðŸ”®</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl mb-4 leading-tight">
            {t('order.h1')}
          </h1>
          <p className="text-[#3D2817]/85 text-lg leading-relaxed mb-4 font-sans">
            {t('order.p1')}
          </p>
          <p className="font-serif text-xl" style={metalStyle}>
            {t('order.decision')}
          </p>
        </motion.div>

        {/* â”€â”€ 2. EMOTIONAL REINFORCEMENT â”€â”€ */}
        <AnimSection className="mb-16">
          <motion.div variants={fadeUp} className="card-gold rounded-2xl p-8 text-center">
            <p className="font-serif text-xl md:text-2xl mb-4" style={metalStyle}>
              {t('order.emotional1')}
            </p>
            <p className="text-[#3D2817]/85 font-sans leading-relaxed mb-4">
              {t('order.emotional2')}
            </p>
            <p className="font-serif text-lg" style={metalStyle}>
              {t('order.emotional3')}
            </p>
          </motion.div>
        </AnimSection>

        {/* â”€â”€ 3. WHAT HAPPENS NEXT â”€â”€ */}
        <AnimSection className="mb-16">
          <motion.h2 variants={fadeUp} className="font-serif text-2xl md:text-3xl text-center mb-8">
            {t('order.next')}
          </motion.h2>
          <div className="space-y-4 mb-6">
            {[
              { icon: <Package size={20} />, label: t('order.step1'), detail: t('order.step1d') },
              { icon: <Truck size={20} />, label: t('order.step2'), detail: '' },
              { icon: <Smartphone size={20} />, label: t('order.step3'), detail: '' },
              { icon: <Sparkles size={20} />, label: t('order.step4'), detail: '' },
            ].map(({ icon, label, detail }) => (
              <motion.div key={label} variants={fadeUp} className="card-glass rounded-2xl p-5 flex items-center gap-4">
                <span className="text-gold flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-[#3D2817] font-sans">{label}</p>
                  {detail && <p className="text-[#3D2817]/40 font-sans text-sm">{detail}</p>}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p variants={fadeUp} className="text-center text-[#3D2817]/40 font-sans italic">
            {t('order.motion')}
          </motion.p>
        </AnimSection>

        {/* â”€â”€ 4. PREPARE NOW â”€â”€ */}
        <AnimSection className="mb-16">
          <motion.div variants={fadeUp} className="card-glass rounded-2xl p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-4">{t('order.prepare')}</h2>
            <ul className="space-y-2">
              {[t('order.bd'), t('order.bt'), t('order.bp')].map(item => (
                <li key={item} className="flex items-center gap-3 text-[#3D2817]/85 font-sans">
                  <span className="text-gold">â€”</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimSection>

        {/* â”€â”€ 5. MICRO-EXPERIENCE â”€â”€ */}
        <AnimSection className="mb-16">
          <motion.div variants={fadeUp} className="card-glass rounded-2xl p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-4">{t('order.while')}</h2>
            <p className="text-[#3D2817]/85 font-sans leading-relaxed mb-4">
              {t('order.notice')}
            </p>
            <ul className="space-y-2 mb-6">
              {[t('order.n1'), t('order.n2'), t('order.n3')].map(item => (
                <li key={item} className="flex items-center gap-3 text-[#3D2817]/85 font-sans">
                  <span className="text-gold">â€”</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-serif text-lg" style={metalStyle}>
              {t('order.soon')}
            </p>
          </motion.div>
        </AnimSection>

        {/* â”€â”€ 6. UPSELL (only if not premium) â”€â”€ */}
        {!loading && !isPremium && (
          <AnimSection className="mb-16">
            <motion.div variants={fadeUp} className="card-gold rounded-2xl p-8 border border-gold/40 text-center">
              <p className="text-2xl mb-4">ðŸ”¥</p>
              <h3 className="font-serif text-xl mb-3" style={metalStyle}>
                {t('order.upsell')}
              </h3>
              <p className="text-[#3D2817]/85 font-sans leading-relaxed mb-6">
                {t('order.upsellP')}
              </p>
              <button
                disabled
                className="btn-gold w-full opacity-60 cursor-not-allowed"
              >
                {t('order.upsellBtn')}
              </button>
            </motion.div>
          </AnimSection>
        )}

        {/* â”€â”€ 7. SUPPORT â”€â”€ */}
        <AnimSection>
          <motion.div variants={fadeUp} className="text-center">
            <p className="text-[#3D2817]/40 font-sans text-sm">
              {t('order.support')}{' '}
              <a href="mailto:support@abundancecode.com" className="text-gold hover:underline">
                support@abundancecode.com
              </a>
            </p>
          </motion.div>
        </AnimSection>

      </div>
    </main>
  );
}
