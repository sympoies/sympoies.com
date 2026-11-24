// Acceptance tests for the built site. They build into dist-test with a
// sub-path SITE_URL and a form endpoint, then inspect the generated HTML.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'dist-test';
const SITE = 'https://example.test/base/';
const DEFAULT_ENDPOINT = 'https://formspree.io/f/xgakpbak';
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
    assert.ok(html.includes('mailto:terry@sympoies.com'));
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
