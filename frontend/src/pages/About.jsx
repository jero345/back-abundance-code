import { motion } from 'framer-motion';
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

function Block({ title, body, bold, extra }) {
  return (
    <motion.div variants={fadeUp} className="mb-16">
      <h2 className="font-serif text-2xl md:text-3xl mb-4">{title}</h2>
      {Array.isArray(body) ? (
        body.map((p, i) => (
          <p key={i} className="text-[#3D2817]/85 font-sans text-lg leading-relaxed mb-3">{p}</p>
        ))
      ) : (
        <p className="text-[#3D2817]/85 font-sans text-lg leading-relaxed mb-4">{body}</p>
      )}
      {bold && (
        <p className="font-serif text-xl" style={metalStyle}>{bold}</p>
      )}
      {extra && (
        <p className="text-[#3D2817]/85 font-sans text-lg leading-relaxed mt-3">{extra}</p>
      )}
    </motion.div>
  );
}

export default function About() {
  const { t } = useLang();

  return (
    <main className="relative min-h-screen bg-[#F5F1ED] pt-24 pb-20">
      <StarField count={40} />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
        >
          <motion.p variants={fadeUp} className="text-gold text-xs uppercase tracking-[0.3em] mb-4 font-sans">{t('about.label')}</motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-6xl mb-16 leading-tight">
            Abundance Code
          </motion.h1>

          <Block
            title={t('about.s1.h')}
            body={t('about.s1.p')}
            bold={t('about.s1.b')}
          />

          <Block
            title={t('about.s2.h')}
            body={t('about.s2.p')}
            bold={t('about.s2.b')}
          />

          <Block
            title={t('about.s3.h')}
            body={[t('about.s3.p1'), t('about.s3.p2')]}
            bold={t('about.s3.b')}
          />

          <Block
            title={t('about.s4.h')}
            body={t('about.s4.p')}
            bold={t('about.s4.b')}
          />

          <Block
            title={t('about.s5.h')}
            body={[t('about.s5.p1'), t('about.s5.p2')]}
            bold={t('about.s5.b')}
          />

          {/* Commitments */}
          <motion.div variants={fadeUp} className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl mb-6">{t('about.commit.h')}</h2>
            <ul className="space-y-3 mb-6">
              {[t('about.commit.1'), t('about.commit.2'), t('about.commit.3'), t('about.commit.4')].map(item => (
                <li key={item} className="flex items-start gap-3 text-[#3D2817]/85 font-sans leading-relaxed">
                  <span className="text-gold mt-1 flex-shrink-0">â€”</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-serif text-xl" style={metalStyle}>
              {t('about.commit.b')}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="text-center card-gold rounded-2xl p-10">
            <p className="font-serif text-2xl mb-2">{t('about.cta.h')}</p>
            <p className="text-[#3D2817]/80 font-sans mb-8">{t('about.cta.p')}</p>
            <Link to="/checkout" className="btn-gold text-base px-10 py-4">
              {t('about.cta.btn')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
