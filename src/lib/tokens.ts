import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Tokens = Record<string, string>;

/** Reads the light and dark color tokens declared in src/styles/global.css. */
// The path is relative to the project root, which is the working directory for builds and tests.
export function readTokens(cssPath = resolve(process.cwd(), 'src/styles/global.css')): { light: Tokens; dark: Tokens } {
  const css = readFileSync(cssPath, 'utf8');
  const decls = (block: string): Tokens =>
    Object.fromEntries([...block.matchAll(/(--[a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2].toLowerCase()]));
  const light = css.match(/:root\s*{([\s\S]*?)\n}/)![1];
  const dark = css.match(/prefers-color-scheme: dark\)\s*{\s*:root\s*{([\s\S]*?)\n\s*}\s*}/)![1];
  return { light: decls(light), dark: { ...decls(light), ...decls(dark) } };
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colors. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
