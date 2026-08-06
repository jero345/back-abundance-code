import { createContext, useContext, useState } from 'react';
import { en } from '../i18n/en.js';
import { es } from '../i18n/es.js';
import { TRIAL_ENABLED } from '../config.js';

const translations = { en, es };

/* Mientras la app no ofrezca prueba gratis (TRIAL_ENABLED = false), cualquier
   texto que la prometa se sustituye por su variante `<key>.paid`, si existe.
   Así el copy de la prueba no se borra: se reactiva cambiando la constante. */
const variant = (key) => (TRIAL_ENABLED ? key : `${key}.paid`);

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'es');

  const toggle = () =>
    setLang(l => {
      const next = l === 'es' ? 'en' : 'es';
      localStorage.setItem('lang', next);
      return next;
    });

  const lookup = (key) =>
    translations[lang]?.[key] ?? translations['en']?.[key] ?? null;

  const t = (key) => lookup(variant(key)) ?? lookup(key) ?? key;

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
