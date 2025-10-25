import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

const loadedLanguages = new Set(['en']);

export const loadLanguage = async (lang: string): Promise<void> => {
  if (loadedLanguages.has(lang)) {
    return Promise.resolve();
  }

  try {
    let translations;
    switch (lang) {
      case 'es':
        translations = (await import('./locales/es.json')).default;
        break;
      case 'fr':
        translations = (await import('./locales/fr.json')).default;
        break;
      case 'ar':
        translations = (await import('./locales/ar.json')).default;
        break;
      default:
        return Promise.resolve();
    }
    
    i18n.addResourceBundle(lang, 'translation', translations, true, true);
    loadedLanguages.add(lang);
    await i18n.changeLanguage(lang);
  } catch (error) {
  }
};

const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (lng: string, ...args: any[]) => {
  await loadLanguage(lng);
  return originalChangeLanguage(lng, ...args);
};

const currentLang = i18n.language;
if (currentLang && currentLang !== 'en' && !currentLang.startsWith('en-')) {
  loadLanguage(currentLang);
}

export default i18n;
