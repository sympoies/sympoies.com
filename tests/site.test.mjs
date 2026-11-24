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

test('work page links the public projects and verified demo pages in both locales', () => {
  for (const { prefix } of LOCALES) {
    const html = read(`${prefix}work/`);
    for (const url of [
      'https://github.com/sympoies/nils-cli',
      'https://github.com/sympoies/agent-runtime-kit',
      'https://github.com/sympoies/salon',
      'https://github.com/sympoies/symphony-board',
      'https://github.com/sympoies/agent-collab',
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
    assert.equal(cards.length, 5);
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
    .filter((f) => /\.(webp|svg|png|jpg)$/.test(f))
    .reduce((sum, f) => sum + statSync(join(dir, f)).size, 0);
  assert.ok(total < 200 * 1024, `image assets total ${total} bytes`);
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
