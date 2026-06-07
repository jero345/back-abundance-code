import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Clock, Star, Compass } from 'lucide-react';
import StarField from '../components/bits/StarField.jsx';
import ProsperityTree from '../components/bits/ProsperityTree.jsx';
import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import Aurora from '../components/bits/Aurora.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const metalStyle = {
  background: 'linear-gradient(180deg, #E6C76A 0%, #D4AF37 40%, #C9A227 70%, #E6C76A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function PortalPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-[#F5F1ED] pt-24">
      <StarField count={70} />
      <Aurora />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="text-center mb-20"
        >
          <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] font-sans font-medium mb-4" style={metalStyle}>
            {t('portal.label')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl mb-6">
            {t('portal.h1')}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[#3D2817]/85 text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            {t('portal.subtitle')}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/checkout" className="btn-gold text-base px-10">
              {t('portal.cta')}
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-3 text-[#5B3E2A]/55 text-sm font-sans">
            {t('portal.instant')}
          </motion.p>
        </motion.div>

        {/* Central symbol + mockup */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center"
          >
            <ProsperityTree size={340} />
          </motion.div>

          {/* Portal mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="w-72 card-glass rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
                <span className="text-[10px] uppercase tracking-widest font-sans" style={metalStyle}>{t('portal.todayLabel')}</span>
              </div>
              <div className="text-center mb-5">
                <p className="font-serif text-6xl font-bold" style={metalStyle}>888</p>
                <p className="text-[#5B3E2A]/65 text-xs mt-1 font-sans">{t('portal.freqLabel')}</p>
              </div>
              {/* Tree symbol preview */}
              <div className="flex justify-center mb-4">
                <ProsperityTree size={80} />
              </div>
              <div className="space-y-3">
                <div className="card-gold rounded-xl p-3">
                  <p className="text-[10px] font-sans mb-1" style={metalStyle}>Jupiter â€“ House 2</p>
                  <p className="text-[#3D2817]/90 text-sm font-sans">Financial expansion energy</p>
                </div>
                <div className="bg-white/3 rounded-xl p-3 text-center">
                  <p className="text-[#5B3E2A]/70 text-xs font-sans">Peak window Â· 08:00â€“10:00</p>
                </div>
                <div className="bg-white/3 rounded-xl p-3">
                  <p className="text-[#3D2817]/75 text-xs font-sans leading-relaxed">Trust the patterns unfolding around you today.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* What's included */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mb-20"
        >
          <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-4xl text-center mb-10">
            {t('portal.included')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: <Compass size={20} />, title: t('portal.inc1'), desc: t('portal.inc1d'), included: true },
              { icon: <Star size={20} />, title: t('portal.inc2'), desc: t('portal.inc2d'), included: true },
              { icon: <Zap size={20} />, title: t('portal.inc3'), desc: t('portal.inc3d'), included: true },
              { icon: <Clock size={20} />, title: t('portal.inc4'), desc: t('portal.inc4d'), included: true },
            ].map(({ icon, title, desc, included }) => (
              <motion.div key={title} variants={fadeUp}>
                <SpotlightCard className="card-glass rounded-2xl p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">{icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif text-base">{title}</h3>
                        {included && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/10 font-sans font-semibold" style={metalStyle}>{t('portal.included.tag')}</span>
                        )}
                      </div>
                      <p className="text-[#3D2817]/80 text-sm leading-relaxed font-sans">{desc}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upsell â€” amplify */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-gold rounded-3xl p-10 text-center mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium mb-3" style={metalStyle}>{t('portal.deeper')}</p>
          <h3 className="font-serif text-2xl md:text-3xl mb-3">{t('portal.amplify')}</h3>
          <p className="text-[#3D2817]/80 font-sans text-sm mb-6 max-w-md mx-auto">
            {t('portal.amplifyP')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/abundance-code-sphere" className="btn-ghost text-sm">{t('portal.sphereCta')}</Link>
            <Link to="/bracelet" className="btn-ghost text-sm">{t('portal.braceletCta')}</Link>
          </div>
        </motion.div>

        {/* Final CTA */}
        <div className="text-center">
          <Link to="/checkout" className="btn-gold text-base px-12 py-5">
            {t('portal.finalCta')}
          </Link>
          <p className="text-[#5B3E2A]/55 text-sm mt-4 font-sans">{t('portal.finalSub')}</p>
        </div>
      </div>
    </main>
  );
}
