import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, MessageCircle } from 'lucide-react';
import StarField from '../components/bits/StarField.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: connect to backend /api/contact
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[#F5F1ED] pt-24">
      <StarField count={40} />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">{t('contact.label')}</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{t('contact.h1')}</h1>
          <p className="text-[#3D2817]/80 max-w-md mx-auto">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {[
              { icon: <Mail size={18} />, label: t('contact.email'), val: 'support@abundancecode.com' },
              { icon: <Clock size={18} />, label: t('contact.response'), val: t('contact.responseVal') },
              { icon: <MessageCircle size={18} />, label: t('contact.hours'), val: t('contact.hoursVal') },
            ].map(({ icon, label, val }) => (
              <div key={label} className="card-glass rounded-xl p-5">
                <div className="text-gold mb-2">{icon}</div>
                <p className="text-[#3D2817]/40 text-xs uppercase tracking-wide mb-1">{label}</p>
                <p className="text-[#3D2817] text-sm">{val}</p>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            {sent ? (
              <div className="card-glass rounded-2xl p-12 text-center">
                <p className="text-gold font-serif text-2xl mb-3">{t('contact.sent')}</p>
                <p className="text-[#3D2817]/80">{t('contact.sentSub')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { k: 'name', label: t('contact.name'), type: 'text', placeholder: t('contact.namePh') },
                    { k: 'email', label: t('contact.email'), type: 'email', placeholder: t('contact.emailPh') },
                  ].map(({ k, label, type, placeholder }) => (
                    <div key={k}>
                      <label className="block text-[#3D2817]/40 text-xs uppercase tracking-wide mb-2">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[k]}
                        onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                        className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[#3D2817]/40 text-xs uppercase tracking-wide mb-2">{t('contact.subject')}</label>
                  <input
                    type="text"
                    placeholder={t('contact.subjectPh')}
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-[#3D2817]/40 text-xs uppercase tracking-wide mb-2">{t('contact.message')}</label>
                  <textarea
                    rows={5}
                    placeholder={t('contact.messagePh')}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full bg-[#E8DCC8]/40 border border-[#E8DCC8] rounded-xl px-4 py-3 text-[#3D2817] placeholder-white/20 focus:outline-none focus:border-gold/50 resize-none"
                    required
                  />
                </div>
                <button type="submit" className="btn-gold w-full">{t('contact.send')}</button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
