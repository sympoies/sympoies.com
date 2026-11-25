// Acceptance tests for the built site. They build into dist-test with a
// sub-path SITE_URL and a form endpoint, then inspect the generated HTML.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'dist-test';
const SITE = 'https://example.test/base/';
const DEFAULT_ENDPOINT = 'https://formspree.io/f/xyewbawr';
const OVERRIDE_ENDPOINT = 'https://forms.example.test/f/abc';
const PAGES = ['', 'services/', 'work/', 'contact/'];
const LOCALES = [
  { prefix: '', lang: 'en' },
  { prefix: 'zh-Hant/', lang: 'zh-Hant' },
];

const read = (p) => readFileSync(join(OUT, p, 'index.html'), 'utf8');

function build(env) {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', OUT], {
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });
}

before(() => build({ SITE_URL: SITE, PUBLIC_CONTACT_ENDPOINT: '' }));

test('every page exists in both locales with the right lang', () => {
  for (const { prefix, lang } of LOCALES) {
    for (const page of PAGES) {
      const html = read(prefix + page);
      assert.match(html, new RegExp(`<html lang="${lang}"`), `${prefix}${page}`);
    }
  }
});

test('pages link to their translation with hreflang and canonical URLs under the base', () => {
  const html = read('zh-Hant/work/');
  assert.match(html, /rel="canonical" href="https:\/\/example\.test\/base\/zh-Hant\/work\/"/);
  assert.match(html, /hreflang="en" href="https:\/\/example\.test\/base\/work\/"/);
  assert.match(html, /hreflang="zh-Hant" href="https:\/\/example\.test\/base\/zh-Hant\/work\/"/);
  assert.match(html, /<a href="\/base\/work\/"[^>]*hreflang="en"/);
});

test('internal links and assets honor the configured base path', () => {
  for (const { prefix } of LOCALES) {
    const html = read(prefix);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"/][^"]*)"/g)) {
      assert.ok(href.startsWith('/base/'), `unexpected root-relative URL ${href}`);
    }
  }
});

test('the Work page shows projects in showcase order and links their sources and demos in both locales', () => {
  const order = ['symphony-board', 'nils-cli', 'agent-runtime-kit', 'agent-collab', 'nils-alfredworkflow', 'salon'];
  for (const { prefix } of LOCALES) {
    const html = read(`${prefix}work/`);
    const names = [...html.matchAll(/<h2 class="project-name">\s*<span class="mono">([^<]+)<\/span>/g)]
      .map(([, name]) => name);
    assert.deepEqual(names, order, `${prefix}work card order`);
    for (const url of [
      'https://github.com/sympoies/nils-cli',
      'https://github.com/sympoies/agent-runtime-kit',
      'https://github.com/sympoies/salon',
      'https://github.com/sympoies/symphony-board',
      'https://github.com/sympoies/agent-collab',
      'https://github.com/sympoies/nils-alfredworkflow',
      'https://github.com/sympoies/nils-alfredworkflow/releases',
      'https://sympoies.github.io/symphony-board/',
      'https://sympoies.github.io/agent-collab/?demo',
    ]) {
      assert.ok(html.includes(`href="${url}"`), `${prefix}work missing ${url}`);
    }
  }
});

test('contact form posts to the default endpoint and shows the mailto link', () => {
  for (const { prefix } of LOCALES) {
    const html = read(`${prefix}contact/`);
    for (const field of ['name', 'email', 'company', 'message']) {
      assert.match(html, new RegExp(`id="${field}" name="${field}"`), `${prefix}${field}`);
    }
    assert.match(html, /id="company" name="company"[^>]*>/);
    assert.doesNotMatch(html.match(/<input id="company"[^>]*>/)[0], /required/);
    assert.ok(html.includes('mailto:hello@sympoies.com'));
    assert.match(html, new RegExp(`<form[^>]*action="${DEFAULT_ENDPOINT}"[^>]*method="post"`));
  }
});

test('contact form sends a subject template so notifications are recognizable', () => {
  for (const { prefix } of LOCALES) {
    const html = read(`${prefix}contact/`);
    assert.match(html, /<input type="hidden" name="subject" value="sympoies\.com contact: \{\{ name \}\}"/, `${prefix}contact`);
  }
});

test('PUBLIC_CONTACT_ENDPOINT overrides the default endpoint', () => {
  build({ SITE_URL: SITE, PUBLIC_CONTACT_ENDPOINT: OVERRIDE_ENDPOINT });
  const html = read('contact/');
  assert.match(html, new RegExp(`<form[^>]*action="${OVERRIDE_ENDPOINT}"`));
  assert.ok(!html.includes(DEFAULT_ENDPOINT));
});

test('no external scripts or tracking', () => {
  for (const { prefix } of LOCALES) {
    for (const page of PAGES) {
      const html = read(prefix + page);
      assert.doesNotMatch(html, /<script[^>]+src="https?:/);
      assert.doesNotMatch(html, /google-analytics|googletagmanager|plausible|gtag\(/);
    }
  }
});

test('every project on the Work page has a visual with localized alt text and dimensions', () => {
  for (const { prefix } of LOCALES) {
    const html = read(`${prefix}work/`);
    const cards = html.split('<li class="card project">').slice(1);
    for (const card of cards) {
      const visual = card.match(/<div class="visual">([\s\S]*?)<\/div>/)[1];
      const alt = visual.match(/<img[^>]*\balt="([^"]+)"/)?.[1] ?? visual.match(/<svg[^>]*aria-label="([^"]+)"/)?.[1];
      assert.ok(alt, `${prefix}work: visual without alt text`);
      if (prefix) assert.match(alt, /[\u4e00-\u9fff]/, `alt text not translated: ${alt}`);
      for (const img of visual.match(/<img[^>]*>/g) ?? []) {
        assert.match(img, /\bwidth="\d+"/);
        assert.match(img, /\bheight="\d+"/);
      }
    }
  }
});

test('screenshots below the fold are lazy-loaded', () => {
  const html = read('work/');
  const imgs = html.match(/<img[^>]*>/g);
  assert.ok(imgs.length >= 3);
  const lazy = imgs.filter((i) => /loading="lazy"/.test(i));
  assert.ok(lazy.length >= 2, 'expected the terminal and Salon images to be lazy');
});

test('work screenshots follow the system color scheme in both locales', () => {
  for (const { prefix } of LOCALES) {
    const html = read(`${prefix}work/`);
    for (const name of ['symphony-board', 'agent-collab', 'salon']) {
      const card = html.split('<li class="card project">').find((part) => part.includes(`<span class="mono">${name}</span>`));
      const context = `${prefix}work: ${name}`;
      const picture = card?.match(/<picture\b[^>]*>([\s\S]*?)<\/picture>/)?.[1];
      assert.ok(picture, `${context} needs a theme-aware picture`);
      const dark = picture.match(/<source\b[^>]*media="\(prefers-color-scheme: dark\)"[^>]*>/)?.[0];
      const light = picture.match(/<img\b[^>]*>/)?.[0];
      assert.ok(dark && light, `${context} needs a dark source and a light default`);

      const variants = [light, dark].map((tag) => {
        assert.match(tag, /\bsizes="[^"]+"/, context);
        const srcset = tag.match(/\bsrcset="([^"]+)"/)?.[1];
        assert.ok(srcset, `${context} needs a responsive srcset`);
        const candidates = srcset.split(', ').map((entry) => {
          const match = entry.match(/^\/base\/(\S+\.(?:webp|avif)) (\d+)w$/);
          assert.ok(match && existsSync(join(OUT, match[1])), `${context}: invalid candidate ${entry}`);
          return { file: match[1], width: Number(match[2]) };
        });
        assert.ok(candidates.some(({ width }) => width <= 420), `${context} needs a phone size`);
        assert.ok(candidates.some(({ width }) => width >= 1440), `${context} needs a 2x size for the widest card`);
        return candidates;
      });
      const lightFiles = variants[0].map(({ file }) => file);
      assert.ok(variants[1].every(({ file }) => !lightFiles.includes(file)), `${context} reuses the light capture in dark mode`);
    }
  }
});

test('home and services show icons for each service and process step in both locales', () => {
  for (const { prefix } of LOCALES) {
    const home = read(prefix);
    assert.match(home, /class="hero-art"/);
    assert.equal((home.match(/class="card-icon"/g) ?? []).length, 3);
    assert.equal((home.match(/class="flow-node"/g) ?? []).length, 5);
    const services = read(`${prefix}services/`);
    assert.equal((services.match(/class="card-icon"/g) ?? []).length, 3);
    assert.equal((services.match(/class="flow-node"/g) ?? []).length, 4);
  }
});

test('visual assets stay within a modest budget', () => {
  const dir = join(OUT, '_astro');
  const total = readdirSync(dir)
    .filter((f) => /\.(avif|webp|svg|png|jpe?g)$/.test(f))
    .reduce((sum, f) => sum + statSync(join(dir, f)).size, 0);
  // Include every emitted variant and unreferenced asset in the build budget.
  assert.ok(total < 820 * 1024, `image assets total ${total} bytes`);
});

test('Work page image payload stays under 200 KiB in either theme', () => {
  const html = read('work/');
  const assetSize = (url) => statSync(join(OUT, url.replace(/^\/base\//, ''))).size;
  const pictures = [...html.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/g)];
  const staticBytes = [...html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/g, '').matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)]
    .reduce((sum, [, url]) => sum + assetSize(url), 0);
  // A visit loads one candidate per picture, not every width in both themes.
  for (const [theme, tag] of [['light', 'img'], ['dark', 'source']]) {
    const total = pictures.reduce((sum, [, picture]) => {
      const srcset = picture.match(new RegExp(`<${tag}\\b[^>]*\\bsrcset="([^"]+)"`))[1];
      const largest = Math.max(...srcset.split(', ').map((entry) => assetSize(entry.split(' ')[0])));
      return sum + largest;
    }, staticBytes);
    assert.ok(total < 200 * 1024, `${theme} Work page images total ${total} bytes`);
  }
});

test('every page carries the logo lockup, favicons and apple touch icon', () => {
  for (const { prefix } of LOCALES) {
    const html = read(`${prefix}services/`);
    assert.match(html, /<a class="brand" href="[^"]*" aria-label="Sympoies"><svg class="logo"/);
    assert.match(html, /rel="icon" type="image\/svg\+xml" href="\/base\/favicon\.svg"/);
    assert.match(html, /rel="icon" type="image\/png" sizes="32x32" href="\/base\/favicon-32\.png"/);
    assert.match(html, /rel="apple-touch-icon" href="\/base\/apple-touch-icon\.png"/);
  }
  for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) {
    assert.ok(existsSync(join(OUT, f)), `${f} missing from the build`);
  }
});

test('brand page shows the three mark options, is hidden from search engines and has no translations', () => {
  const html = read('brand/');
  for (const o of ['A', 'B', 'C']) assert.ok(html.includes(`Option ${o}:`), `option ${o} missing`);
  assert.match(html, /<meta name="robots" content="noindex"/);
  assert.doesNotMatch(html, /hreflang/);
  assert.doesNotMatch(read(''), /href="[^"]*\/brand\/"/, 'brand page must not be linked from the site');
});

test('every page shows the localized city below the footer brand', () => {
  for (const { prefix, lang } of LOCALES) {
    const location = lang === 'en' ? 'Taipei, Taiwan' : '台灣・台北';
    for (const page of prefix ? PAGES : [...PAGES, 'brand/']) {
      const html = read(prefix + page);
      const footer = html.slice(html.indexOf('<footer'));
      assert.match(footer, new RegExp(`<p class="footer-brand">.*?</p>\\s*<p[^>]*>${location}</p>`), prefix + page);
    }
  }
});

test('footer GitHub link is an icon with an accessible name in both locales', () => {
  const names = { '': 'GitHub', 'zh-Hant/': 'GitHub' };
  for (const [prefix, label] of Object.entries(names)) {
    const html = read(prefix);
    const footer = html.slice(html.indexOf('<footer'));
    const link = footer.match(/<a[^>]*href="https:\/\/github\.com\/sympoies"[^>]*>/);
    assert.ok(link, `${prefix} footer links to the GitHub profile`);
    assert.match(link[0], new RegExp(`aria-label="${label}"`));
    assert.match(footer, /<a[^>]*social-link[^>]*>\s*<svg[^>]*aria-hidden="true"/);
  }
});

test('footer GitHub mark stays black on light and white on dark, including on hover', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  assert.match(css, /\.social-link:hover\s*\{[^}]*color:\s*#000/);
  assert.match(css, /prefers-color-scheme: dark\)\s*\{\s*\.social-link,\s*\.social-link:hover\s*\{\s*color:\s*#fff/);
});

test('contact form sends the same subject on every submission and after a reset', async () => {
  const html = read('contact/');
  const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  const subjectInput = html.match(/<input type="hidden" name="(_?subject)" value="([^"]*)"/);
  assert.ok(subjectInput, 'the form has a hidden subject input');

  // A hidden input as browsers model it: assigning value also moves defaultValue,
  // and form.reset() restores value from defaultValue.
  const field = (name, value) => ({ name, value, defaultValue: value });
  const fields = {
    name: field('name', ''),
    [subjectInput[1]]: field(subjectInput[1], subjectInput[2].replace(/&#123;/g, '{')),
  };
  const sent = [];
  const handlers = {};
  const form = {
    action: 'https://example.invalid/f/x',
    dataset: {},
    elements: { namedItem: (n) => fields[n] ?? null },
    querySelector: () => ({ disabled: false }),
    addEventListener: (type, fn) => { handlers[type] = fn; },
    reset: () => { for (const f of Object.values(fields)) f.value = f.defaultValue; },
  };
  const status = { textContent: '', className: '' };
  const document = { getElementById: (id) => (id === 'contact-form' ? form : id === 'form-status' ? status : null) };
  class FormData { constructor() { this.subject = fields[subjectInput[1]].value; } }
  const fetch = async () => { sent.push(fields[subjectInput[1]].value); return { ok: true }; };
  new Function('document', 'FormData', 'fetch', script)(document, FormData, fetch);

  for (const who of ['Alice', 'Bob']) {
    fields.name.value = who;
    await handlers.submit({ preventDefault() {} });
  }
  assert.equal(sent.length, 2);
  assert.equal(sent[1], sent[0], 'the second submission carries the same subject as the first');
  assert.ok(!sent[1].includes('Alice'), 'a previous visitor name never leaks into the subject');
});
