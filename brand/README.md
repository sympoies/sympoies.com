# Brand sources

- The original artwork is not part of this repository. Brand colors were sampled from it: navy `#122D4A`, mid navy `#174166`, blue `#0486BA`, gray `#AAACAA`, paper `#F3EEEA`, stone `#E8E4E0`.
- `logo/`: generated logo files, three mark options (`a`, `b`, `c`). For each: `mark-*.svg`, `mark-*-on-dark.svg`, `mark-*-small.svg` (less detail, for 24 px and below), `mark-*-mono.svg` and `mark-*-mono-white.svg` (single color), and `lockup-*.svg` / `lockup-*-on-dark.svg` (mark with the word "sympoies"). `logo/png/` has PNG exports of the active option.

Do not edit `logo/` by hand. Change `src/lib/marks.ts` or `src/lib/brand.ts` and run `node scripts/brand.mjs`.
