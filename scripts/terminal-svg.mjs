// Renders src/assets/work/nils-cli-terminal.svg: an animated terminal window that replays
// the session below. The output text was captured from real nils-cli commands run in a
// disposable repository with synthetic commits (emoji prefixes removed). Run with:
//   node scripts/terminal-svg.mjs
import { writeFileSync } from 'node:fs';

const session = [
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

const W = 520;
const LINE = 22;
const TOP = 66;
const H = 325; // 16:10 with the 520 width
const TOTAL = 13; // seconds per loop
const START = 0.4; // first line appears
const END = 9; // last line appears, then hold until TOTAL

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const step = (END - START) / (session.length - 1);

let css = '';
const rows = session
  .map((row, i) => {
    const t = START + i * step;
    const a = ((t / TOTAL) * 100).toFixed(2);
    const b = (((t + 0.12) / TOTAL) * 100).toFixed(2);
    css += `@keyframes l${i}{0%,${a}%{opacity:0}${b}%,96%{opacity:1}100%{opacity:0}}`;
    const y = TOP + i * LINE;
    const text = row.cmd
      ? `<tspan class="p">$ </tspan><tspan class="c">${esc(row.cmd)}</tspan>`
      : `<tspan class="o">${esc(row.out)}</tspan>`;
    return `<text class="l" style="animation-name:l${i}" x="24" y="${y}" xml:space="preserve">${text}</text>`;
  })
  .join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<style>
  .bg{fill:#011627}.bar{fill:#0b2942}
  text{font:15px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre}
  .p{fill:#addb67}.c{fill:#82aaff}.o{fill:#d6deeb}
  .l{animation-duration:${TOTAL}s;animation-iteration-count:infinite;animation-timing-function:step-end}
  ${css}
  @media (prefers-reduced-motion:reduce){.l{animation:none;opacity:1}}
</style>
<rect class="bg" width="${W}" height="${H}" rx="12"/>
<path class="bar" d="M0 12a12 12 0 0 1 12-12h${W - 24}a12 12 0 0 1 12 12v24H0z"/>
<circle cx="24" cy="18" r="6" fill="#ff5f56"/><circle cx="44" cy="18" r="6" fill="#ffbd2e"/><circle cx="64" cy="18" r="6" fill="#27c93f"/>
  ${rows}
</svg>
`;
writeFileSync(new URL('../src/assets/work/nils-cli-terminal.svg', import.meta.url), svg);
console.log(`wrote ${svg.length} bytes, ${W}x${H}`);
