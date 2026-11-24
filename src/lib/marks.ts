// Geometry of the Sympoies logo mark, derived from the "Recursive Lattice of Intent" artwork
// (not included in this repository). Everything is built from one pointy-top hexagon split into the three
// rhombus faces of an isometric cube, and then nested toward the centre.
//
// This module is plain, erasable TypeScript so that both the Astro components and
// scripts/brand.mjs can import it.

export type MarkOption = 'a' | 'b' | 'c';
export type ColorKey = 'dark' | 'mid' | 'bright' | 'gray' | 'paper';
export type Point = [number, number];
export interface Poly {
  points: Point[];
  fill: ColorKey;
}

/** Brand colors sampled from the artwork. */
export const brandColors = {
  navy: '#122D4A',
  midNavy: '#174166',
  blue: '#0486BA',
  gray: '#AAACAA',
  darkGray: '#878C8E',
  paper: '#F3EEEA',
  stone: '#E8E4E0',
} as const;

/** Mark fills on a light background, and on a dark one. */
export const markPalettes: Record<'light' | 'dark', Record<ColorKey, string>> = {
  light: { dark: '#122D4A', mid: '#174166', bright: '#0486BA', gray: '#AAACAA', paper: '#F3EEEA' },
  dark: { dark: '#F3EEEA', mid: '#7FA3C7', bright: '#2FB0E8', gray: '#3B4F66', paper: '#0B1A2C' },
};

const S = Math.sqrt(3) / 2;
const unit: Point[] = [
  [0, -1],
  [S, -0.5],
  [S, 0.5],
  [0, 1],
  [-S, 0.5],
  [-S, -0.5],
];

function vertex(cx: number, cy: number, r: number, k: number): Point {
  return [cx + unit[k][0] * r, cy + unit[k][1] * r];
}

function regularHexagon(cx: number, cy: number, r: number, fill: ColorKey): Poly {
  return { points: unit.map((_, k) => vertex(cx, cy, r, k)), fill };
}

type Faces = { left: ColorKey; right: ColorKey; top: ColorKey };

/** One isometric cube as three rhombus faces. */
function cube(cx: number, cy: number, r: number, f: Faces): Poly[] {
  const c: Point = [cx, cy];
  const v = (k: number) => vertex(cx, cy, r, k);
  return [
    { points: [v(5), c, v(3), v(4)], fill: f.left },
    { points: [c, v(1), v(2), v(3)], fill: f.right },
    { points: [v(5), v(0), v(1), c], fill: f.top },
  ];
}

// A hexagon of radius r/2 centred on a face of a radius-r cube touches that
// face's edges exactly, so cubes nest without gaps.
function faceCentre(cx: number, cy: number, r: number, face: 'left' | 'right' | 'top'): Point {
  const v = (k: number) => vertex(cx, cy, r, k);
  const quad =
    face === 'left' ? [v(5), [cx, cy] as Point, v(3), v(4)]
    : face === 'right' ? [[cx, cy] as Point, v(1), v(2), v(3)]
    : [v(5), v(0), v(1), [cx, cy] as Point];
  return [quad.reduce((s, p) => s + p[0], 0) / 4, quad.reduce((s, p) => s + p[1], 0) / 4];
}

const chainFaces: Faces[] = [
  { left: 'dark', right: 'mid', top: 'gray' },
  { left: 'bright', right: 'dark', top: 'paper' },
  { left: 'dark', right: 'bright', top: 'gray' },
  { left: 'mid', right: 'dark', top: 'bright' },
];

/** Option A: a cube whose top face holds a smaller cube, and so on toward the centre. */
function chain(levels: number): Poly[] {
  const out: Poly[] = [];
  let cx = 0;
  let cy = 0;
  let r = 1;
  for (let i = 0; i < levels; i++) {
    out.push(...cube(cx, cy, r, chainFaces[i]));
    [cx, cy] = faceCentre(cx, cy, r, 'top');
    r /= 2;
  }
  return out;
}

/** Option B: concentric hexagons with a small cube at the heart. */
function rings(levels: number): Poly[] {
  const radii = [1, 0.76, 0.54, 0.34];
  const fills: ColorKey[] = ['dark', 'paper', 'mid', 'bright'];
  const out: Poly[] = [];
  for (let i = 0; i < Math.min(levels, 4); i++) out.push(regularHexagon(0, 0, radii[i], fills[i]));
  if (levels > 3) out.push(...cube(0, 0, 0.2, { left: 'dark', right: 'mid', top: 'paper' }));
  return out;
}

/** Option C: a cube whose three faces each hold a smaller cube. */
function lattice(levels: number): Poly[] {
  const out = cube(0, 0, 1, { left: 'mid', right: 'dark', top: 'gray' });
  if (levels < 2) return out;
  const inner: Faces[] = [
    { left: 'dark', right: 'bright', top: 'paper' },
    { left: 'bright', right: 'paper', top: 'dark' },
    { left: 'paper', right: 'bright', top: 'mid' },
  ];
  (['left', 'right', 'top'] as const).forEach((face, i) => {
    const [fx, fy] = faceCentre(0, 0, 1, face);
    out.push(...cube(fx, fy, 0.5, inner[i]));
    if (levels > 2 && face === 'top') {
      const [tx, ty] = faceCentre(fx, fy, 0.5, 'top');
      out.push(...cube(tx, ty, 0.25, { left: 'dark', right: 'bright', top: 'paper' }));
    }
  });
  return out;
}

/**
 * Polygons of a mark in unit coordinates (the hexagon has radius 1, centred on 0,0).
 * `levels` is the detail: use 2 at 24px and below, 3 or more above that.
 */
export function markPolys(option: MarkOption, levels = 3): Poly[] {
  if (option === 'a') return chain(levels);
  if (option === 'b') return rings(levels + 1);
  return lattice(levels);
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000);

/** SVG polygon elements for a mark. `x`, `y` is the centre and `r` the hexagon radius. */
export function markSvg(
  option: MarkOption,
  x: number,
  y: number,
  r: number,
  fill: (key: ColorKey) => string,
  levels = 3,
): string {
  return markPolys(option, levels)
    .map((p) => {
      const pts = p.points.map(([px, py]) => `${fmt(x + px * r)},${fmt(y + py * r)}`).join(' ');
      return `<polygon points="${pts}" fill="${fill(p.fill)}"/>`;
    })
    .join('');
}

export const markOptions: { id: MarkOption; name: string; note: string }[] = [
  { id: 'a', name: 'Recursive cube', note: 'A cube whose top face holds a smaller cube, nested toward the centre.' },
  { id: 'b', name: 'Concentric hexagons', note: 'Rings of hexagons closing in on a small cube. Closest to the artwork and the clearest at 16 px.' },
  { id: 'c', name: 'Cube of cubes', note: 'Each face of the cube holds its own smaller cube.' },
];

const monoTint: Record<ColorKey, number> = { dark: 1, mid: 0.62, bright: 0.34, gray: 0.2, paper: 0 };

/**
 * Single-color version of a mark: faces become tints of one color and "paper" faces are
 * cut out. `id` must be unique within the page because it names the SVG mask.
 */
export function markMonoSvg(option: MarkOption, size: number, color: string, id: string, levels = 3): string {
  const r = size / 2 - 1;
  const gray = (key: ColorKey) => {
    const v = Math.round(monoTint[key] * 255);
    return `rgb(${v},${v},${v})`;
  };
  return (
    `<defs><mask id="${id}"><rect width="${size}" height="${size}" fill="#000"/>` +
    markSvg(option, size / 2, size / 2, r, gray, levels) +
    `</mask></defs><rect width="${size}" height="${size}" fill="${color}" mask="url(#${id})"/>`
  );
}
