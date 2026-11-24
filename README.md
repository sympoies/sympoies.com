# sympoies.com

Source for the sympoies.com website: software development, consulting and AI workflow adoption. English first, with Traditional Chinese (zh-Hant).

The site is a static [Astro](https://astro.build) project using Astro's built-in i18n routing. It ships plain HTML and CSS, with a few lines of script only on the contact page. There is no tracking or analytics.

## Develop

Requires Node.js 22.23.4 or newer (`.node-version` pins the version CI uses).

```bash
npm ci
npm run dev       # local server at http://localhost:4321/
npm run check     # type-check Astro and TypeScript
npm test          # build and verify the generated pages
npm run build     # static output in dist/
```

## Edit the copy

All page text lives in two dictionaries with the same shape:

- `src/i18n/en.ts` — English
- `src/i18n/zh-Hant.ts` — Traditional Chinese (a missing or extra key fails `npm run check`)

Other places you may want to change:

| What | Where |
| ---- | ----- |
| Contact email, GitHub link | `src/lib/site.ts` |
| Projects on the Work page (links, demo links) | `src/lib/projects.ts`, text in the dictionaries under `work.projects` |
| Colors, spacing, fonts | `src/styles/global.css` (tokens at the top; dark mode follows the visitor's system setting) |
| Page layout | `src/views/*View.astro`, shared by both locales |

English pages live at `/`, `/services/`, `/work/`, `/contact/`; Traditional Chinese pages at the same paths under `/zh-Hant/`.

## Configuration

Both settings are read at build time.

| Variable | Purpose | Default |
| -------- | ------- | ------- |
| `SITE_URL` | Full public URL, including any sub-path. Controls links, canonical URLs and asset paths. | `http://localhost:4321/` |
| `PUBLIC_CONTACT_ENDPOINT` | Optional override of the contact form's endpoint. It is public, not a secret. | the endpoint in `src/lib/site.ts` |

In CI both come from repository variables (`SITE_URL`, `CONTACT_ENDPOINT`) with a preview default for `SITE_URL`, so no code change is needed.

### Contact form

The site is static, so the form posts to a form-forwarding service (Formspree). The default endpoint is set in `src/lib/site.ts`; to point the form at another service that accepts a standard form POST and can answer with JSON, set `CONTACT_ENDPOINT` as a repository variable (or `PUBLIC_CONTACT_ENDPOINT` locally). The contact address is always shown as a plain `mailto:` link, and the form's error message asks visitors to email directly.

## Deploy

`.github/workflows/pages.yml` type-checks, tests and builds on every pull request, and deploys `dist/` to GitHub Pages on every push to `main`. In the repository settings, Pages must use **GitHub Actions** as its source.

To serve the site from the custom domain, set the repository variable `SITE_URL` to `https://sympoies.com/` and point the domain at GitHub Pages.
