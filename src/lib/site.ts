export const locales = ['en', 'zh-Hant'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const pages = ['home', 'services', 'work', 'contact'] as const;
export type PageKey = (typeof pages)[number];

const slugs: Record<PageKey, string> = {
  home: '',
  services: 'services/',
  work: 'work/',
  contact: 'contact/',
};

export const site = {
  name: 'Sympoies',
  email: 'terry@sympoies.com',
  github: 'https://github.com/sympoies',
  // Form-forwarding endpoint (a public URL, not a secret). The build-time
  // variable PUBLIC_CONTACT_ENDPOINT overrides the default when set and non-empty.
  contactEndpoint: import.meta.env.PUBLIC_CONTACT_ENDPOINT || 'https://formspree.io/f/xgakpbak',
};

/** Path of a page in a locale, including the configured base path. */
export function pagePath(locale: Locale, page: PageKey): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const prefix = locale === defaultLocale ? '' : `${locale}/`;
  return `${base}${prefix}${slugs[page]}`;
}
