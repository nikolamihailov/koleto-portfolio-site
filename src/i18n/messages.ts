import bg from './locales/bg.json';
import en from './locales/en.json';

/*
 * Framework-free translation core. React components use it through useI18n()
 * (LanguageContext.tsx); vite.config.ts uses it directly to build llms.txt.
 */

export const LANGS = ['en', 'bg'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

/** en.json is the source of truth for the shape of every locale. */
export type Messages = typeof en;

// Typing bg.json as Messages turns a missing key into a compile error;
// findKeyMismatches() below also catches extra keys at build time.
const bgMessages: Messages = bg;
export const messages: Record<Lang, Messages> = { en, bg: bgMessages };

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

/** Every dot-path that ends in a string, e.g. 'nav.about' | 'hero.greeting' | … */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

/** Keys usable with t(). Long-form content (`content.*`) is read via getContent() instead. */
export type MessageKey = Leaves<Omit<Messages, 'content'>>;
export type Vars = Record<string, string | number>;

const lookup = (source: unknown, key: string) =>
  key
    .split('.')
    .reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), source);

/**
 * Returns the message for `key` in `lang`, falling back to English and then to the key itself.
 * `{name}` placeholders are replaced from `vars`.
 */
export function translate(lang: Lang, key: MessageKey, vars?: Vars): string {
  const value = lookup(messages[lang], key) ?? lookup(messages[DEFAULT_LANG], key);
  if (typeof value !== 'string') return key;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** Lists keys present in one locale but not the other (used to fail the build on drift). */
export function findKeyMismatches(a: unknown, b: unknown, path = ''): string[] {
  const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  if (!isObj(a) || !isObj(b)) {
    if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) return [`${path} (array length ${a.length} vs ${b.length})`];
    return isObj(a) !== isObj(b) ? [path] : [];
  }
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].flatMap((k) => {
    const p = path ? `${path}.${k}` : k;
    if (!(k in a) || !(k in b)) return [p];
    return findKeyMismatches(a[k], b[k], p);
  });
}
