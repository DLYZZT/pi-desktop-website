import { withBase } from "../utils/paths";

export type Locale = "zh" | "en";

export const defaultLocale: Locale = "zh";

export function localizedPath(locale: Locale, path = "") {
  const normalizedPath = path.replace(/^\/+/, "");
  return locale === "en" ? withBase(`en/${normalizedPath}`) : withBase(normalizedPath);
}

export function localeRouteFromPathname(pathname: string) {
  const base = import.meta.env.BASE_URL;
  const withoutBase = base !== "/" && pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\/+/, "");
  return withoutBase.replace(/^en(?:\/|$)/, "");
}

export function alternateLocalePath(pathname: string, locale: Locale) {
  return localizedPath(locale, localeRouteFromPathname(pathname));
}
