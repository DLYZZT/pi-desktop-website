import { defineMiddleware } from "astro:middleware";
import { load } from "cheerio";
import { localeFromPathname, localeRouteFromPathname, localizedPath } from "./i18n";
import type { Locale } from "./i18n";
import zh from "./i18n/messages/zh.json";
import fr from "./i18n/messages/fr.json";
import de from "./i18n/messages/de.json";
import es from "./i18n/messages/es.json";
import ja from "./i18n/messages/ja.json";
import ko from "./i18n/messages/ko.json";
import zhTW from "./i18n/messages/zh-TW.json";

const messages: Record<Exclude<Locale, "en">, Record<string, string>> = {
  zh, fr, de, es, ja, ko, "zh-TW": zhTW,
};

/** English is the source language. Translation keys are the exact rendered phrases. */
export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  const locale = localeFromPathname(url.pathname);
  if (locale === "en" || !response.headers.get("content-type")?.includes("text/html")) return response;

  const dictionary = messages[locale];
  const $ = load(await response.text());
  const translate = (value: string) => {
    const phrase = value.trim();
    if (!phrase || !dictionary[phrase]) return value;
    return value.replace(phrase, dictionary[phrase]);
  };

  $("*").contents().each((_, node) => {
    if (node.type !== "text") return;
    const parent = node.parent;
    if (!parent || $(parent).closest("script, style, svg, code, pre, kbd, samp, [translate='no'], [data-language-menu]").length) return;
    node.data = translate(node.data);
  });
  $("*").each((_, node) => {
    if (node.type !== "tag") return;
    for (const attribute of ["alt", "aria-label", "placeholder", "title", "content"]) {
      const value = $(node).attr(attribute);
      if (value && (attribute !== "content" || $(node).is("meta[name='description']"))) {
        $(node).attr(attribute, translate(value));
      }
    }
  });

  // Links written in the English content template follow the active locale.
  $("a[href]").not("[data-language-link]").each((_, node) => {
    const href = $(node).attr("href");
    if (!href || !/^\/(?:[^?#]*\/)?en\//.test(href)) return;
    const [pathAndQuery, hash = ""] = href.split("#", 2);
    const [path, query = ""] = pathAndQuery.split("?", 2);
    $(node).attr("href", `${localizedPath(locale, localeRouteFromPathname(path))}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`);
  });

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response($.html(), { status: response.status, statusText: response.statusText, headers });
});
