export const locales = ['ro', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ro';

export const localeNames: Record<Locale, string> = {
  ro: 'Română',
  ru: 'Русский',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  ro: '🇷🇴',
  ru: '🇷🇺',
  en: '🇬🇧',
};
