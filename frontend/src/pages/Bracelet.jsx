import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Shield } from 'lucide-react';
import StarField from '../components/bits/StarField.jsx';
import ProsperityTree from '../components/bits/ProsperityTree.jsx';
import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const metalStyle = {
  background: 'linear-gradient(180deg, #E6C76A 0%, #D4AF37 40%, #C9A227 70%, #E6C76A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function BraceletVisual({ size = 280 }) {
  const cx = size / 2;
  const cy = size / 2;
  const rx = size * 0.38;
  const ry = size * 0.2;
  const thickness = size * 0.055;

  return (
    <motion.div
      animate={{ rotateY: [0, 8, 0, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size * 0.7 }}
      className="flex items-center justify-center"
    >
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`} fill="none">
        <defs>
          <linearGradient id="braceletGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A227" />
            <stop offset="25%" stopColor="#E6C76A" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#E6C76A" />
            <stop offset="100%" stopColor="#C9A227" />
          </linearGradient>
          <linearGradient id="braceletGoldV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6C76A" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#E6C76A" stopOpacity="0.8" />
          </linearGradient>
          <filter id="braceletGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx={cx} cy={cy * 1.38} rx={rx * 0.9} ry={ry * 0.3} fill="rgba(0,0,0,0.35)" />

        {/* Bottom band edge (depth) */}
        <ellipse cx={cx} cy={cy + thickness / 2} rx={rx} ry={ry} stroke="url(#braceletGoldV)" strokeWidth={thickness} fill="none" strokeLinecap="round" opacity="0.6" />

        {/* Main band */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke="url(#braceletGold)" strokeWidth={thickness} fill="none" filter="url(#braceletGlow)" />

        {/* Inner shine */}
        <ellipse cx={cx} cy={cy - thickness * 0.1} rx={rx * 0.88} ry={ry * 0.82} stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />

        {/* Engraved tree symbol at center of bracelet */}
        <g transform={`translate(${cx - 12}, ${cy - 16}) scale(1.8)`}>
          {/* Trunk */}
          <line x1="6.5" y1="14" x2="6.5" y2="4" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          {/* Branches */}
          <line x1="6.5" y1="8" x2="3" y2="5" stroke="#D4AF37" strokeWidth="0.7" strokeLinecap="round" opacity="0.7" />
          <line x1="6.5" y1="8" x2="10" y2="5" stroke="#D4AF37" strokeWidth="0.7" strokeLinecap="round" opacity="0.7" />
          <line x1="3" y1="5" x2="1.5" y2="3" stroke="#D4AF37" strokeWidth="0.5" strokeLinecap="round" opacity="0.55" />
          <line x1="3" y1="5" x2="4.5" y2="2.5" stroke="#D4AF37" strokeWidth="0.5" strokeLinecap="round" opacity="0.55" />
          <line x1="10" y1="5" x2="8.5" y2="2.5" stroke="#D4AF37" strokeWidth="0.5" strokeLinecap="round" opacity="0.55" />
          <line x1="10" y1="5" x2="11.5" y2="3" stroke="#D4AF37" strokeWidth="0.5" strokeLinecap="round" opacity="0.55" />
          {/* Roots */}
          <line x1="6.5" y1="14" x2="4" y2="16.5" stroke="#D4AF37" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
          <line x1="6.5" y1="14" x2="9" y2="16.5" stroke="#D4AF37" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
          {/* Leaf dots */}
          <circle cx="1.5" cy="3" r="1" fill="#E6C76A" opacity="0.8" />
          <circle cx="4.5" cy="2.5" r="1" fill="#E6C76A" opacity="0.8" />
          <circle cx="6.5" cy="4" r="1" fill="#E6C76A" opacity="0.9" />
          <circle cx="8.5" cy="2.5" r="1" fill="#E6C76A" opacity="0.8" />
          <circle cx="11.5" cy="3" r="1" fill="#E6C76A" opacity="0.8" />
        </g>

        {/* Surface gleam */}
        <motion.ellipse
          cx={cx - rx * 0.3}
          cy={cy - ry * 0.4}
          rx={rx * 0.15}
          ry={ry * 0.25}
          fill="rgba(255,255,255,0.18)"
          animate={{ opacity: [0.18, 0.3, 0.18] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  );
}

export default function Bracelet() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-[#F5F1ED] pt-24">
      <StarField count={50} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium px-4 py-2 rounded-full card-gold" style={metalStyle}>
            {t('bracelet.label')}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            <BraceletVisual size={320} />
            <div className="flex gap-8 text-center">
              {[
                { label: t('bracelet.geo'), sub: t('bracelet.geoSub') },
                { label: t('bracelet.color'), sub: t('bracelet.colorSub') },
                { label: t('bracelet.fit'), sub: t('bracelet.fitSub') },
              ].map(({ label, sub }) => (
                <div key={label}>
                  <p className="text-[#3D2817] font-sans font-medium text-sm">{label}</p>
                  <p className="text-[#3D2817]/40 text-xs font-sans">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.3em] mb-3 font-sans font-medium" style={metalStyle}>
              {t('bracelet.tag')}
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-4">
              {t('bracelet.h1')}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#3D2817]/85 text-lg mb-8 leading-relaxed font-sans">
              {t('bracelet.p')}
            </motion.p>

            {/* Details */}
            <motion.div variants={fadeUp} className="card-glass rounded-2xl p-6 mb-8">
              <p className="text-[#5B3E2A]/70 text-[10px] uppercase tracking-widest mb-4 font-sans">{t('bracelet.details')}</p>
              <ul className="space-y-3">
                {[t('bracelet.d1'), t('bracelet.d2'), t('bracelet.d3'), t('bracelet.d4'), t('bracelet.d5')].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#3D2817]/90 font-sans text-sm">
                    <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Price + CTA */}
            <motion.div variants={fadeUp}>
              <p className="font-serif text-5xl mb-2" style={metalStyle}>$39 USD</p>
              <p className="text-[#5B3E2A]/65 text-sm mb-6 font-sans">{t('bracelet.shipping')}</p>
              <button className="btn-gold w-full text-base mb-3">
                {t('bracelet.cta')}
              </button>
              <p className="text-center text-[#5B3E2A]/55 text-xs font-sans">{t('bracelet.stripe')}</p>
            </motion.div>

            {/* Trust */}
            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: <Shield size={18} />, label: t('bracelet.securePay') },
                { icon: <Truck size={18} />, label: t('bracelet.freeShip') },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-gold">{icon}</span>
                  <p className="text-[#5B3E2A]/70 text-xs font-sans">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Symbol section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center card-gold rounded-3xl p-12 mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium mb-4" style={metalStyle}>{t('bracelet.symbol.tag')}</p>
          <h3 className="font-serif text-2xl md:text-3xl mb-4">{t('bracelet.symbol.h')}</h3>
          <p className="text-[#3D2817]/80 font-sans text-sm mb-8 max-w-lg mx-auto">
            {t('bracelet.symbol.p')}
          </p>
          <div className="flex justify-center">
            <ProsperityTree size={180} />
          </div>
        </motion.div>

        {/* Comparison / upsell */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="mb-16"
        >
          <motion.h2 variants={fadeUp} className="font-serif text-3xl text-center mb-10">
            {t('bracelet.complete')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-5">
            <motion.div variants={fadeUp}>
              <SpotlightCard className="card-glass rounded-2xl p-6 h-full">
                <p className="text-[10px] uppercase tracking-widest font-sans font-medium mb-2" style={metalStyle}>{t('bracelet.entry')}</p>
                <h3 className="font-serif text-xl mb-2">{t('bracelet.portalH')}</h3>
                <p className="text-[#3D2817]/80 text-sm font-sans mb-4">{t('bracelet.portalP')}</p>
                <Link to="/portal" className="btn-ghost text-sm">{t('bracelet.portalCta')}</Link>
              </SpotlightCard>
            </motion.div>
            <motion.div variants={fadeUp}>
              <SpotlightCard className="card-glass rounded-2xl p-6 h-full">
                <p className="text-[10px] uppercase tracking-widest font-sans font-medium mb-2" style={metalStyle}>{t('bracelet.amplifier')}</p>
                <h3 className="font-serif text-xl mb-2">{t('bracelet.sphereH')}</h3>
                <p className="text-[#3D2817]/80 text-sm font-sans mb-4">{t('bracelet.sphereP')}</p>
                <Link to="/abundance-code-sphere" className="btn-ghost text-sm">{t('bracelet.sphereCta')}</Link>
              </SpotlightCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
