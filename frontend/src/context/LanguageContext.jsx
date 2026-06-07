import { createContext, useContext, useState } from 'react';
import { en } from '../i18n/en.js';
import { es } from '../i18n/es.js';

const translations = { en, es };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'es');

  const toggle = () =>
    setLang(l => {
      const next = l === 'es' ? 'en' : 'es';
      localStorage.setItem('lang', next);
      return next;
    });

  const t = (key) =>
    translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
