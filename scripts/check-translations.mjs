import { readFileSync } from "node:fs";
import { load } from "cheerio";

const locales = ["zh", "fr", "de", "es", "ja", "ko", "zh-TW"];
const pages = ["", "download/", "docs/", "changelog/"];
const source = JSON.parse(readFileSync("src/i18n/messages/en.json", "utf8"));
const required = new Set();
const skip = "script, style, svg, code, pre, kbd, samp, [translate='no'], [data-language-menu]";
const literalKeys = [
  "SKILL.md", "Anthropic", "Google Gemini", "Claude Sonnet", "Claude Opus", "Claude Haiku", "GPT-6 Sol",
  "npm", "npx", "uv", "uvx", "Git", "ripgrep", "fd", "jq", "curl",
  "agents-sdk", "cloudflare", "cloudflare-email-service", "durable-objects", "frontend-design",
  "sandbox-sdk", "turnstile-spin", "web-perf", "workers-best-practices", "wrangler",
  "HERDR", "JAVASCRIPT", "PYTHON", "PI AGENT DESKTOP",
];
const protectedTerms = [
  "Pi Agent Desktop", "Pi Coding Agent", "Herdr", "Node.js", "AppImage", "GitHub Releases",
  "Anthropic", "Google Gemini", "Claude Sonnet", "Claude Opus", "Claude Haiku", "GPT-6 Sol", "SKILL.md", "PATH",
];

for (const page of pages) {
  const $ = load(readFileSync(`dist/en/${page}index.html`, "utf8"));
  $("*").contents().each((_, node) => {
    if (node.type === "text" && node.parent && !$(node.parent).closest(skip).length) {
      const phrase = node.data.trim();
      if (phrase) required.add(phrase);
    }
  });
  $("*").each((_, node) => {
    if (node.type !== "tag" || $(node).closest("script, style, svg, code, pre, kbd, samp, [translate='no']").length) return;
    for (const attribute of ["alt", "aria-label", "placeholder", "title", "content"]) {
      if (attribute === "content" && !$(node).is("meta[name='description']")) continue;
      const phrase = $(node).attr(attribute)?.trim();
      if (phrase) required.add(phrase);
    }
  });
}

let failures = 0;
for (const locale of ["en", ...locales]) {
  const catalog = locale === "en" ? source : JSON.parse(readFileSync(`src/i18n/messages/${locale}.json`, "utf8"));
  const missing = [...required].filter((phrase) => typeof catalog[phrase] !== "string" || !catalog[phrase].trim());
  if (missing.length) {
    failures++;
    console.error(`${locale}: ${missing.length} missing phrases. Examples: ${missing.slice(0, 5).join(" | ")}`);
  }
  if (locale !== "en") {
    const alteredLiterals = literalKeys.filter((key) => key in source && catalog[key] !== key);
    const damagedTerms = Object.entries(source).flatMap(([key]) =>
      protectedTerms.filter((term) => key.includes(term) && !catalog[key]?.includes(term)).map((term) => `${term}: ${key}`),
    );
    const suspicious = Object.entries(source).filter(([key]) =>
      catalog[key]?.includes("__") && !key.includes("__") ||
      key.length >= 80 && catalog[key]?.length < Math.max(12, key.length * 0.18),
    );
    if (alteredLiterals.length || damagedTerms.length || suspicious.length) {
      failures++;
      console.error(`${locale}: altered technical names, terms, or suspiciously short text. Examples: ${[
        ...alteredLiterals, ...damagedTerms, ...suspicious.map(([key]) => key),
      ].slice(0, 6).join(" | ")}`);
    }
  }
  for (const page of pages) {
    const $ = load(readFileSync(`dist/${locale === "zh" ? "" : `${locale}/`}${page}index.html`, "utf8"));
    const english = load(readFileSync(`dist/en/${page}index.html`, "utf8"));
    const expected = locale === "zh" ? "zh-CN" : locale;
    const sourceTitle = english("title").text().trim();
    const translatedTitle = locale === "en" ? sourceTitle : catalog[sourceTitle];
    const sourceNav = english(".nav-links a").map((_, node) => english(node).text().trim()).get();
    const translatedNav = $(".nav-links a").map((_, node) => $(node).text().trim()).get();
    const expectedNav = sourceNav.map((label) => locale === "en" ? label : catalog[label]);
    if (
      $("html").attr("lang") !== expected ||
      $("link[rel='alternate'][hreflang]").length !== 9 ||
      $("[data-language-link]").length !== 8 ||
      $("title").text().trim() !== translatedTitle ||
      translatedNav.some((label, index) => label !== expectedNav[index]) ||
      !$("h1").text().trim()
    ) {
      failures++;
      console.error(`${locale}/${page || "index"}: rendered localization or language metadata is incomplete`);
    }
  }
}

if (failures) process.exitCode = 1;
else console.log(`All 32 pages have language metadata and all ${required.size} source phrases are cataloged.`);
