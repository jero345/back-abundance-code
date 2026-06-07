import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CrystalSphere from '../components/bits/CrystalSphere.jsx';
import StarField from '../components/bits/StarField.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Activate() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [step, setStep] = useState(1); // 1: code entry, 2: birth data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    activationCode: '',
    name: '',
    email: '',
    password: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/activation/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('ac_token', data.token);
      localStorage.setItem('ac_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Activation failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center pt-24">
      <StarField count={60} />
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="text-center mb-10"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <CrystalSphere size={140} />
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl mb-3">
            {t('activate.h1')}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[#3D2817]/80">
            {t('activate.subtitle')}
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleActivate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-glass rounded-2xl p-8 space-y-5"
        >
          {/* Activation Code */}
          <div>
            <label className="block text-[#3D2817]/80 text-xs uppercase tracking-widest mb-2">{t('activate.code')}</label>
            <input
              type="text"
              placeholder="AC-XXXX-XXXX"
              value={form.activationCode}
              onChange={(e) => update('activationCode', e.target.value.toUpperCase())}
              className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50 font-mono text-center text-lg tracking-widest"
              required
            />
          </div>

          <hr className="border-[#E8DCC8]" />

          {/* Account */}
          <p className="text-[#3D2817]/40 text-xs uppercase tracking-widest">{t('activate.createAccount')}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3D2817]/80 text-xs mb-2">{t('activate.fullName')}</label>
              <input
                type="text"
                placeholder={t('activate.fullNamePh')}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="block text-[#3D2817]/80 text-xs mb-2">{t('activate.email')}</label>
              <input
                type="email"
                placeholder={t('activate.emailPh')}
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[#3D2817]/80 text-xs mb-2">{t('activate.password')}</label>
            <input
              type="password"
              placeholder={t('activate.passwordPh')}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50"
              required
            />
          </div>

          <hr className="border-[#E8DCC8]" />

          {/* Birth data */}
          <p className="text-[#3D2817]/40 text-xs uppercase tracking-widest">{t('activate.birthData')}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3D2817]/80 text-xs mb-2">{t('activate.birthDate')}</label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => update('birthDate', e.target.value)}
                className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] focus:outline-none focus:border-gold/50"
                required
              />
            </div>
            <div>
              <label className="block text-[#3D2817]/80 text-xs mb-2">{t('activate.birthTime')}</label>
              <input
                type="time"
                value={form.birthTime}
                onChange={(e) => update('birthTime', e.target.value)}
                className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#3D2817]/80 text-xs mb-2">{t('activate.birthPlace')}</label>
            <input
              type="text"
              placeholder={t('activate.birthPlacePh')}
              value={form.birthPlace}
              onChange={(e) => update('birthPlace', e.target.value)}
              className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('activate.loading') : t('activate.cta')}
          </button>
        </motion.form>
      </div>
    </main>
  );
}
