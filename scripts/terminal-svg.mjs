// Run `node scripts/terminal-svg.mjs` to regenerate the two Work page terminal illustrations.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readTokens } from '../src/lib/tokens.ts';

// Captured in a disposable repository with synthetic commits (emoji prefixes removed).
const nilsSession = [
  { cmd: 'git-scope all' },
  { out: 'Changed files:' },
  { out: '  ➔ [M] src/lib.rs' },
  { out: '  ➔ [M] src/main.rs' },
  { out: '' },
  { cmd: 'git-scope commit HEAD' },
  { out: 'Commit Message:' },
  { out: '   feat: add retry helper' },
  { out: '' },
  { out: 'Changed files:' },
  { out: '  ➤ [A] src/lib.rs  [+1 / -0]' },
  { out: '  Total: +1 / -0' },
];

// Fictional transcript, not instructions or output from a real repository.
const runtimeSession = [
  { cmd: 'git push origin main' },
  { out: 'Blocked: direct pushes to main are disabled.', tone: 'err' },
  { out: 'Hint: push a feature branch and open a PR.' },
  { out: '' },
  { cmd: 'git-cli push' },
  { out: 'Published feat/update-docs.' },
  { out: '' },
  { cmd: 'forge-cli pr create …' },
  { out: '✓ Pull request #42 opened for review.', tone: 'ok' },
];

const W = 520;
const H = 325; // 16:10
const LINE = 22;
const TOP = 66;
const TOTAL = 13; // seconds per loop
const START = 0.4; // first line appears
const END = 9; // last line appears, then hold until TOTAL
const { light, dark } = readTokens(fileURLToPath(new URL('../src/styles/global.css', import.meta.url)));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function renderTerminal(session, { title, animated = false, runtime = false } = {}) {
  const step = (END - START) / (session.length - 1);
  const rows = session.map((row, i) => {
    const text = row.cmd
      ? `<tspan class="p">$ </tspan><tspan class="c">${esc(row.cmd)}</tspan>`
      : `<tspan class="${row.tone ?? 'o'}">${esc(row.out)}</tspan>`;
    const animation = animated ? ` class="l" style="animation-name:l${i}"` : '';
    return `<text${animation} x="24" y="${TOP + i * LINE}" xml:space="preserve">${text}</text>`;
  });
  const animationCSS = animated ? `
  .l{animation-duration:${TOTAL}s;animation-iteration-count:infinite;animation-timing-function:step-end}
  ${session.map((_, i) => {
    const t = START + i * step;
    const a = ((t / TOTAL) * 100).toFixed(2);
    const b = (((t + 0.12) / TOTAL) * 100).toFixed(2);
    return `@keyframes l${i}{0%,${a}%{opacity:0}${b}%,96%{opacity:1}100%{opacity:0}}`;
  }).join('')}
  @media (prefers-reduced-motion:reduce){.l{animation:none;opacity:1}}` : '';
  const runtimeCSS = runtime ? `
  .heading{font-size:12px;fill:${light['--muted']}}
  .ok{fill:${light['--ok']}}.err{fill:${light['--err']}}` : '';
  const runtimeDarkCSS = runtime ? `
    .heading{fill:${dark['--muted']}}
    .ok{fill:${dark['--ok']}}.err{fill:${dark['--err']}}` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<style>
  .bg{fill:${light['--surface']}}.bar{fill:${light['--bg-alt']}}
  text{font:15px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre}
  .p{fill:${light['--ok']}}.c{fill:${light[runtime ? '--ok' : '--accent']}}.o{fill:${light['--text']}}${runtimeCSS}
  @media (prefers-color-scheme:dark){
    .bg{fill:#011627}.bar{fill:#0b2942}
    .p{fill:#addb67}.c{fill:${runtime ? dark['--ok'] : '#82aaff'}}.o{fill:#d6deeb}${runtimeDarkCSS}
  }${animationCSS}
</style>
<rect class="bg" width="${W}" height="${H}" rx="12"/>
<path class="bar" d="M0 12a12 12 0 0 1 12-12h${W - 24}a12 12 0 0 1 12 12v24H0z"/>
<circle cx="24" cy="18" r="6" fill="#ff5f56"/><circle cx="44" cy="18" r="6" fill="#ffbd2e"/><circle cx="64" cy="18" r="6" fill="#27c93f"/>
  ${title ? `<text class="heading" x="496" y="22" text-anchor="end">${esc(title)}</text>\n  ` : ''}${rows.join('\n  ')}
</svg>
`;
}

for (const [name, svg] of [
  ['nils-cli', renderTerminal(nilsSession, { animated: true })],
  ['agent-runtime-kit', renderTerminal(runtimeSession, { title: 'agent-runtime-kit  /  delivery guard', runtime: true })],
]) {
  writeFileSync(new URL(`../src/assets/work/${name}-terminal.svg`, import.meta.url), svg);
}
