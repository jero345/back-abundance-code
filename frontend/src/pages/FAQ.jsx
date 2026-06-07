import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarField from '../components/bits/StarField.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const metalStyle = {
  background: 'linear-gradient(180deg, #E6C76A 0%, #D4AF37 40%, #C9A227 70%, #E6C76A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#E8DCC8]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-[#3D2817] font-sans font-medium pr-8">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gold flex-shrink-0"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-[#3D2817]/85 pb-5 leading-relaxed font-sans">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { t } = useLang();

  const categories = [
    {
      title: t('faq.cat1'),
      items: [
        { q: t('faq.cat1.1q'), a: t('faq.cat1.1a') },
        { q: t('faq.cat1.2q'), a: t('faq.cat1.2a') },
        { q: t('faq.cat1.3q'), a: t('faq.cat1.3a') },
        { q: t('faq.cat1.4q'), a: t('faq.cat1.4a') },
      ],
    },
    {
      title: t('faq.cat2'),
      items: [
        { q: t('faq.cat2.1q'), a: t('faq.cat2.1a') },
        { q: t('faq.cat2.2q'), a: t('faq.cat2.2a') },
        { q: t('faq.cat2.3q'), a: t('faq.cat2.3a') },
        { q: t('faq.cat2.4q'), a: t('faq.cat2.4a') },
      ],
    },
    {
      title: t('faq.cat3'),
      items: [
        { q: t('faq.cat3.1q'), a: t('faq.cat3.1a') },
        { q: t('faq.cat3.2q'), a: t('faq.cat3.2a') },
        { q: t('faq.cat3.3q'), a: t('faq.cat3.3a') },
        { q: t('faq.cat3.4q'), a: t('faq.cat3.4a') },
      ],
    },
    {
      title: t('faq.cat4'),
      items: [
        { q: t('faq.cat4.1q'), a: t('faq.cat4.1a') },
        { q: t('faq.cat4.2q'), a: t('faq.cat4.2a') },
        { q: t('faq.cat4.3q'), a: t('faq.cat4.3a') },
      ],
    },
    {
      title: t('faq.cat5'),
      items: [
        { q: t('faq.cat5.1q'), a: t('faq.cat5.1a') },
        { q: t('faq.cat5.2q'), a: t('faq.cat5.2a') },
        { q: t('faq.cat5.3q'), a: t('faq.cat5.3a') },
      ],
    },
    {
      title: t('faq.cat6'),
      items: [
        { q: t('faq.cat6.1q'), a: t('faq.cat6.1a') },
        { q: t('faq.cat6.2q'), a: t('faq.cat6.2a') },
        { q: t('faq.cat6.3q'), a: t('faq.cat6.3a') },
      ],
    },
  ];

  // Track open item per category: { catIndex: itemIndex }
  const [openMap, setOpenMap] = useState({});

  const toggle = (catIdx, itemIdx) => {
    setOpenMap(prev => {
      const current = prev[catIdx];
      return { ...prev, [catIdx]: current === itemIdx ? -1 : itemIdx };
    });
  };

  return (
    <main className="relative min-h-screen bg-[#F5F1ED] pt-24 pb-20">
      <StarField count={40} />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] mb-4 font-sans font-medium" style={metalStyle}>{t('faq.label')}</p>
          <h1 className="font-serif text-4xl md:text-5xl">{t('faq.h1')}</h1>
        </motion.div>

        <div className="space-y-12">
          {categories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.h2 variants={fadeUp} className="font-serif text-xl md:text-2xl mb-4">
                {cat.title}
              </motion.h2>
              <motion.div variants={fadeUp} className="card-glass rounded-2xl px-8">
                {cat.items.map((item, itemIdx) => (
                  <FAQItem
                    key={itemIdx}
                    q={item.q}
                    a={item.a}
                    isOpen={openMap[catIdx] === itemIdx}
                    onToggle={() => toggle(catIdx, itemIdx)}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-[#3D2817]/80 font-sans mb-4">{t('faq.still')}</p>
          <Link to="/contact" className="btn-ghost">{t('faq.contact')}</Link>
        </motion.div>
      </div>
    </main>
  );
}
