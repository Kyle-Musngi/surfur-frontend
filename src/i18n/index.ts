import { en } from './en';
import { ceb } from './ceb';
import type { Translation } from './en';

export type Language = 'en' | 'ceb';

export const translations: Record<Language, Translation> = { en, ceb };

export function getTranslation(lang: Language): Translation {
  return translations[lang] || en;
}

export { en, ceb };
export type { Translation };
