import { defineConfig } from 'astro/config';

// One setting controls where the site is served: SITE_URL, the full public URL
// including any sub-path, e.g. https://sympoies.com/ (the deploy workflow's
// default) or a project-pages URL with a sub-path. It is split into Astro's
// `site` (origin) and `base` (path prefix).
const siteUrl = new URL(process.env.SITE_URL ?? 'http://localhost:4321/');

export default defineConfig({
  site: siteUrl.origin,
  base: siteUrl.pathname,
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    locales: ['en', 'zh-Hant'],
    defaultLocale: 'en',
  },
  devToolbar: { enabled: false },
});
