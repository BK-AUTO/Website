import { LANG_EN, LANG_VN } from '@/composables/constants';
import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language_state', {
  persist: true,
  state: () => ({
    locale: localStorage.getItem('i18n_locale') || LANG_VN,
    localeList: [
      { value: LANG_VN, label: 'Tiếng Việt' },
      { value: LANG_EN, label: 'English' },
    ],
  }),
  getters: {
    currentLocale: (state) => state.locale,
    findLocale: (state) => (locale) => {
      return state.localeList.find((d) => d.value === locale);
    },
  },
  actions: {
    setLocale(newLocale) {
      this.locale = newLocale;
      localStorage.setItem('i18n_locale', newLocale);
    },
  },
});
