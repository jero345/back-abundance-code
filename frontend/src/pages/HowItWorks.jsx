import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarField from '../components/bits/StarField.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function HowItWorks() {
  const { t } = useLang();

  const steps = [
    { n: '01', title: t('hiw.s1'), desc: t('hiw.s1d') },
    { n: '02', title: t('hiw.s2'), desc: t('hiw.s2d') },
    { n: '03', title: t('hiw.s3'), desc: t('hiw.s3d') },
    { n: '04', title: t('hiw.s4'), desc: t('hiw.s4d') },
    { n: '05', title: t('hiw.s5'), desc: t('hiw.s5d') },
  ];

  return (
    <main className="min-h-screen bg-[#F5F1ED] pt-24">
      <StarField count={50} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-gold text-xs uppercase tracking-[0.3em] mb-4">{t('hiw.label')}</motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-6xl mb-4">{t('hiw.h1')}</motion.h1>
          <motion.p variants={fadeUp} className="text-[#3D2817]/80 text-lg max-w-xl mx-auto">
            {t('hiw.subtitle')}
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden md:block" />
          <div className="space-y-10">
            {steps.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-8 md:pl-0"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full border border-gold/40 bg-gold/5 flex items-center justify-center text-gold font-serif text-lg">
                  {n}
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="font-serif text-xl mb-2">{title}</h3>
                  <p className="text-[#3D2817]/85 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/abundance-code-sphere" className="btn-gold text-base">
            {t('hiw.cta')}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
