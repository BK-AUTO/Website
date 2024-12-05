import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import vi from '@/locales/vi.json';
import { useLanguageStore } from '@/stores/language.js';
import { LANG_EN, LANG_VN } from './composables/constants';

export default createI18n({
  legacy: false,
  locale: LANG_VN,
  fallbackLocale: LANG_EN,
  messages: {
    en,
    vi,
  },
});

export function setI18nLanguage(locale) {
  const languageStore = useLanguageStore();

  languageStore.setLocale(locale);
  document.querySelector('html').setAttribute('lang', locale);
}
