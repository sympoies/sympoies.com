// The color tokens in src/styles/global.css must keep readable contrast in both themes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, readTokens } from '../src/lib/tokens.ts';

const tokens = readTokens();
const text = [
  ['--text', '--bg'],
  ['--text', '--bg-alt'],
  ['--text', '--surface'],
  ['--muted', '--bg'],
  ['--muted', '--bg-alt'],
  ['--muted', '--surface'],
  ['--accent', '--bg'],
  ['--accent', '--bg-alt'],
  ['--accent', '--surface'],
  ['--btn-text', '--btn'],
  ['--btn-text', '--btn-hover'],
  ['--ok', '--bg'],
  ['--err', '--bg'],
];

for (const theme of ['light', 'dark']) {
  test(`${theme} theme: text pairs reach WCAG AA (4.5:1)`, () => {
    for (const [fg, bg] of text) {
      const ratio = contrast(tokens[theme][fg], tokens[theme][bg]);
      assert.ok(ratio >= 4.5, `${theme} ${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
    }
  });
}

test('focus ring is visible against the page in both themes', () => {
  for (const theme of ['light', 'dark']) {
    const ratio = contrast(tokens[theme]['--focus'], tokens[theme]['--bg']);
    assert.ok(ratio >= 3, `${theme} focus ring is ${ratio.toFixed(2)}:1`);
  }
});
