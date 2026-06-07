import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t" style={{ background: '#F7F3EE', borderColor: '#E8DCC8' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/img/symbol-transparent.png"
                alt="Abundance Code"
                width={44}
                height={44}
                loading="lazy"
                style={{ width: 44, height: 44, objectFit: 'contain' }}
              />
              <span className="font-sans text-sm tracking-[0.30em] uppercase font-semibold" style={{ color: '#3D2817' }}>
                Abundance Code
              </span>
            </div>
            <p className="text-[#5B3E2A] text-sm leading-relaxed" style={{ maxWidth: '32ch' }}>
              {t('footer.desc')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.32em] mb-4 font-semibold">
              {t('footer.nav')}
            </p>
            <ul className="space-y-2">
              {[
                { label: t('footer.home'),    href: '/' },
                { label: t('footer.product'), href: '/abundance-code-sphere' },
                { label: t('footer.about'),   href: '/about' },
                { label: t('footer.faq'),     href: '/faq' },
                { label: t('footer.contact'), href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[#5B3E2A] hover:text-[#3D2817] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.32em] mb-4 font-semibold">
              {t('footer.legal')}
            </p>
            <ul className="space-y-2">
              {[
                { label: t('footer.terms'),   href: '/terms' },
                { label: t('footer.privacy'), href: '/privacy' },
                { label: t('footer.refund'),  href: '/returns' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[#5B3E2A] hover:text-[#3D2817] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: '#E8DCC8' }}>
          <p className="text-[#5B3E2A] text-xs">{t('footer.rights')}</p>
          <p className="text-[#5B3E2A]/70 text-xs">www.abundancecode.com</p>
        </div>
      </div>
    </footer>
  );
}
