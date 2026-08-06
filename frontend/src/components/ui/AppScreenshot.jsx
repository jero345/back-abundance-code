import { useLang } from '../../context/LanguageContext.jsx';

/* =========================================================
   AppScreenshot — captura real de la web app.
   Existe una versión por idioma (app-es.png / app-en.png),
   así que la captura sigue al selector de idioma del sitio.
   ========================================================= */
export default function AppScreenshot({ priority = false, className = '', style = {} }) {
  const { lang, t } = useLang();

  return (
    <img
      src={`/img/app-${lang === 'es' ? 'es' : 'en'}.png`}
      alt={t('h.app.alt')}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`block w-full h-auto rounded-2xl ${className}`}
      style={{
        border: '1px solid #E8DCC8',
        boxShadow: '0 24px 70px rgba(61,40,23,0.16), 0 4px 16px rgba(61,40,23,0.06)',
        background: '#FFFDF7',
        ...style,
      }}
    />
  );
}
