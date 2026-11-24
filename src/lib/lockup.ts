import { markSvg, type ColorKey, type MarkOption } from './marks.ts';
import { wordmark } from './wordmark.ts';

const R = 24; // mark radius
const GAP = 16;
const FS = 44; // wordmark font size

/** Mark plus the word "sympoies", as the inner markup of an SVG and its size. */
export function lockup(option: MarkOption, fill: (key: ColorKey) => string, textFill: string) {
  const scale = FS / 100;
  const markW = 2 * R * (Math.sqrt(3) / 2);
  const width = Math.round((markW + GAP + wordmark.width * scale + 2) * 10) / 10;
  const height = 2 * R + 2;
  const cy = height / 2;
  const tx = Math.round((markW + GAP + 1) * 100) / 100;
  const ty = Math.round((cy + (wordmark.xHeight * scale) / 2) * 100) / 100;
  const body =
    markSvg(option, markW / 2 + 1, cy, R, fill, 3) +
    `<path transform="translate(${tx} ${ty}) scale(${scale})" fill="${textFill}" d="${wordmark.d}"/>`;
  return { width, height, body };
}
