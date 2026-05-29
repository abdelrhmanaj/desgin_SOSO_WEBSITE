import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../utils/translations';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { lang } = useLanguage();
  return translations[lang] || translations.en;
};
