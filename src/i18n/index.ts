import { withBase } from "../utils/paths";

export const locales = ["zh", "en", "fr", "de", "es", "ja", "ko", "zh-TW"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";
export const localeNames: Record<Locale, string> = {
  zh: "简体中文", en: "English", fr: "Français", de: "Deutsch", es: "Español",
  ja: "日本語", ko: "한국어", "zh-TW": "繁體中文",
};
export const htmlLanguages: Record<Locale, string> = {
  zh: "zh-CN", en: "en", fr: "fr", de: "de", es: "es", ja: "ja", ko: "ko", "zh-TW": "zh-TW",
};

export function localizedPath(locale: Locale, path = "") {
  const normalizedPath = path.replace(/^\/+/, "");
  return locale === defaultLocale ? withBase(normalizedPath) : withBase(`${locale}/${normalizedPath}`);
}

export function localeRouteFromPathname(pathname: string) {
  const base = import.meta.env.BASE_URL;
  const withoutBase = base !== "/" && pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\/+/, "");
  const prefix = locales.filter((locale) => locale !== defaultLocale).join("|");
  return withoutBase.replace(new RegExp(`^(?:${prefix})(?:/|$)`), "");
}

export function localeFromPathname(pathname: string): Locale {
  const base = import.meta.env.BASE_URL;
  const withoutBase = base !== "/" && pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\/+/, "");
  const first = withoutBase.split("/")[0];
  return locales.find((locale) => locale !== defaultLocale && locale === first) ?? defaultLocale;
}

export function alternateLocalePath(pathname: string, locale: Locale) {
  return localizedPath(locale, localeRouteFromPathname(pathname));
}
