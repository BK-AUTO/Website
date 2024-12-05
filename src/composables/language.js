import { useLanguageStore } from '@/stores/language.js';

export const loadCurrentLanguage = () => {
  const languageStore = useLanguageStore();

  let lang = null;

  let code = languageStore.currentLocale;
  if (!code) {
    code = localStorage.getItem('i18n_locale');
  }

  lang = code || 'vi';

  languageStore.setLocale(lang);
  return lang;
};
