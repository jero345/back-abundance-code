import { motion } from 'framer-motion';
import { useLang } from '../../context/LanguageContext.jsx';

export default function LegalPage({ title, updated, children }) {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-[#F5F1ED] pt-24">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#5B3E2A]/65 text-xs uppercase tracking-widest mb-3">{t('legal.label')}</p>
          <h1 className="font-serif text-4xl mb-2">{title}</h1>
          {updated && <p className="text-[#5B3E2A]/65 text-sm mb-10">Last updated: {updated}</p>}
          <div className="prose-legal space-y-6 text-[#3D2817]/90 leading-relaxed">
            <style>{`
              .prose-legal h2 { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: rgba(255,255,255,0.9); margin-top: 2rem; margin-bottom: 0.5rem; }
              .prose-legal p { margin-bottom: 1rem; }
              .prose-legal ul { list-style: disc; padding-left: 1.5rem; space-y: 0.5rem; }
            `}</style>
            {children}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
