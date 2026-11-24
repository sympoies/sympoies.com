import type { Locale } from '../lib/site';
import { en, type Dict } from './en';
import { zhHant } from './zh-Hant';

const dictionaries: Record<Locale, Dict> = { en, 'zh-Hant': zhHant };

export function t(locale: Locale): Dict {
  return dictionaries[locale];
}
