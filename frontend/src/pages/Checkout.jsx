import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, RefreshCw, ChevronRight, Check, Sparkles } from 'lucide-react';
import StarField from '../components/bits/StarField.jsx';
import CrystalSphere from '../components/bits/CrystalSphere.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const PRODUCTS = {
  'crystal-code': { key: 'crystal-code', name: 'Crystal Code', price: 177, label: 'ðŸ”®' },
  'crystal-code-premium': { key: 'crystal-code-premium', name: 'Crystal Code Premium', price: 217, label: 'âœ¨' },
};

const metalStyle = {
  background: 'linear-gradient(180deg, #E6C76A 0%, #D4AF37 40%, #C9A227 70%, #E6C76A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialProduct = searchParams.get('product') === 'crystal-code-premium'
    ? 'crystal-code-premium'
    : 'crystal-code';

  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { t } = useLang();

  const product = PRODUCTS[selectedProduct];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError(t('checkout.errorEmail')); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail: email, customerName: name, product: selectedProduct }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t('checkout.errorGeneric'));
        setLoading(false);
      }
    } catch {
      setError(t('checkout.errorNetwork'));
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F1ED] pt-24 pb-20">
      <StarField count={30} />
      <div className="relative z-10 max-w-2xl mx-auto px-6">

        {/* Header â€” micro-close */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-10"
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] font-sans font-medium mb-3" style={metalStyle}>
            {t('checkout.label')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-3xl md:text-4xl mb-2">
            {t('checkout.h1')}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[#3D2817]/40 font-sans text-sm">
            {t('checkout.subtitle')}
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Product selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-[#3D2817]/80 text-xs uppercase tracking-widest font-sans mb-3">{t('checkout.choose')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Crystal Code */}
              <button
                type="button"
                onClick={() => setSelectedProduct('crystal-code')}
                className={`relative rounded-2xl p-5 text-left transition-all border ${
                  selectedProduct === 'crystal-code'
                    ? 'border-gold/60 bg-gold/5'
                    : 'border-[#E8DCC8] bg-white/3 hover:border-[#D4AF37]/50'
                }`}
              >
                {selectedProduct === 'crystal-code' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                    <Check size={11} className="text-black" />
                  </span>
                )}
                <p className="text-xl mb-1">ðŸ”®</p>
                <p className="font-serif text-base text-[#3D2817] mb-0.5">Crystal Code</p>
                <ul className="text-[#3D2817]/75 text-xs font-sans space-y-0.5 mb-3">
                  <li>{t('checkout.cc.items')}</li>
                  <li>{t('checkout.cc.items2')}</li>
                  <li>{t('checkout.cc.items3')}</li>
                  <li>{t('checkout.cc.items4')}</li>
                </ul>
                <p className="font-serif text-xl" style={metalStyle}>$177 USD</p>
              </button>

              {/* Crystal Code Premium */}
              <button
                type="button"
                onClick={() => setSelectedProduct('crystal-code-premium')}
                className={`relative rounded-2xl p-5 text-left transition-all border ${
                  selectedProduct === 'crystal-code-premium'
                    ? 'border-gold/60 bg-gold/5'
                    : 'border-[#E8DCC8] bg-white/3 hover:border-[#D4AF37]/50'
                }`}
              >
                {selectedProduct === 'crystal-code-premium' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                    <Check size={11} className="text-black" />
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xl">âœ¨</p>
                  <span className="text-[10px] uppercase tracking-widest font-sans px-2 py-0.5 rounded-full bg-gold/20 text-gold">{t('checkout.premium.best')}</span>
                </div>
                <p className="font-serif text-base text-[#3D2817] mb-0.5">Crystal Code Premium</p>
                <ul className="text-[#3D2817]/75 text-xs font-sans space-y-0.5 mb-3">
                  <li>{t('checkout.premium.items1')}</li>
                  <li className="text-gold/80">{t('checkout.premium.items2')}</li>
                </ul>
                <p className="font-serif text-xl" style={metalStyle}>$217 USD</p>
              </button>
            </div>

            {/* Order bump â€” only shown when Crystal Code is selected */}
            {selectedProduct === 'crystal-code' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 rounded-xl border border-gold/25 bg-gold/5 p-4 flex items-center gap-4"
              >
                <div className="flex-shrink-0">
                  <Sparkles size={20} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#3D2817] text-sm font-sans font-medium">ðŸ”¥ {t('checkout.bump.text')} <span style={metalStyle} className="font-semibold">{t('checkout.bump.more')}</span></p>
                  <p className="text-[#3D2817]/40 text-xs font-sans mt-0.5">{t('checkout.bump.desc')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProduct('crystal-code-premium')}
                  className="flex-shrink-0 text-xs font-sans font-semibold px-3 py-1.5 rounded-lg bg-gold text-black hover:bg-gold/90 transition-colors"
                >
                  {t('checkout.bump.add')}
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-[#E8DCC8] bg-white/3 p-6 mb-5"
          >
            <p className="text-[#3D2817]/80 text-xs uppercase tracking-widest font-sans mb-4">{t('checkout.details')}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[#3D2817]/80 text-xs font-sans mb-1.5">{t('checkout.fullName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('checkout.fullNamePh')}
                  className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 text-sm font-sans focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#3D2817]/80 text-xs font-sans mb-1.5">{t('checkout.emailLabel')} <span className="text-gold">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 text-sm font-sans focus:outline-none focus:border-gold/50 transition-colors"
                />
                <p className="text-[#5B3E2A]/55 text-xs font-sans mt-1.5">{t('checkout.emailHelp')}</p>
              </div>
            </div>
          </motion.div>

          {/* Security block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-[#E8DCC8] p-4 mb-5 flex flex-wrap gap-6 justify-center"
          >
            {[
              { icon: <Lock size={15} />, label: t('checkout.secure') },
              { icon: <Shield size={15} />, label: t('checkout.methods') },
              { icon: <RefreshCw size={15} />, label: t('checkout.guarantee') },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[#3D2817]/40 text-xs font-sans">
                <span className="text-gold/70">{icon}</span>
                {label}
              </div>
            ))}
          </motion.div>

          {/* Final reinforcement */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-center mb-6"
          >
            <p className="font-serif text-[#3D2817] text-lg mb-1">{t('checkout.reinforceH')}</p>
            <p className="font-serif text-[#3D2817]/85 text-base">{t('checkout.reinforceP')}</p>
          </motion.div>

          {error && (
            <p className="text-red-400 text-sm font-sans text-center mb-4">{error}</p>
          )}

          {/* Payment button */}
          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full btn-gold text-lg py-5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mb-4 font-semibold"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                {t('checkout.loading')}
              </>
            ) : (
              <>
                {t('checkout.cta')} â€” ${product.price} USD
                <ChevronRight size={18} />
              </>
            )}
          </motion.button>

          {/* Micro-objections below button */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-[#5B3E2A]/65 text-xs font-sans">
            {[t('checkout.lifetime'), t('checkout.ships'), t('checkout.moneyBack')].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </form>

        {/* Order summary sticky */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 rounded-2xl border border-gold/20 bg-gold/5 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{product.label}</span>
              <div>
                <p className="font-serif text-[#3D2817] text-sm">{product.name}</p>
                <p className="text-[#3D2817]/40 text-xs font-sans">{t('checkout.summaryDesc')}</p>
              </div>
            </div>
            <p className="font-serif text-lg" style={metalStyle}>${product.price} USD</p>
          </div>
          <p className="text-[#5B3E2A]/65 text-xs font-sans">
            {t('checkout.afterPurchase')}
          </p>
        </motion.div>
      </div>
    </main>
  );
}
