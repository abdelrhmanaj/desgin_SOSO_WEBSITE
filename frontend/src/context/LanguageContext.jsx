import { createContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved === 'en' ? 'en' : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.style.fontFamily = lang === 'ar'
      ? '"Cairo", "Montserrat", sans-serif'
      : '"Montserrat", "Cairo", sans-serif';
  }, [lang]);

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const t = (key) => translations[lang]?.[key] || translations.en?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
