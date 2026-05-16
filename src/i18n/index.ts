import { createI18n } from 'vue-i18n';
import en from './locales/en';
import zhTW from './locales/zh-TW';

export type Locale = 'en' | 'zh-TW';
const LS_KEY = 'desktop-note-app.locale';

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'en' || saved === 'zh-TW') return saved;
  } catch {
    // localStorage may be unavailable; ignore
  }
  // Default to English. Users on Chinese systems can switch via the top-right
  // EN/中 toggle, and the choice is remembered in localStorage.
  return 'en';
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-TW': zhTW,
  },
});

export function setLocale(loc: Locale) {
  i18n.global.locale.value = loc;
  try {
    localStorage.setItem(LS_KEY, loc);
  } catch {
    // ignore
  }
}

export function getLocale(): Locale {
  return i18n.global.locale.value as Locale;
}
