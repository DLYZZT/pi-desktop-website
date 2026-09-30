import { readFileSync, writeFileSync } from "node:fs";
import { load } from "cheerio";

const pages = ["", "download/", "docs/", "changelog/"];
const phrases = new Set();
const skip = "script, style, svg, code, pre, kbd, samp, [translate='no'], [data-language-menu]";

for (const page of pages) {
  const $ = load(readFileSync(`dist/en/${page}index.html`, "utf8"));
  $("*").contents().each((_, node) => {
    if (node.type !== "text" || !node.parent || $(node.parent).closest(skip).length) return;
    const phrase = node.data.trim();
    if (phrase) phrases.add(phrase);
  });
  $("*").each((_, node) => {
    if (node.type !== "tag" || $(node).closest("script, style, svg, code, pre, kbd, samp, [translate='no']").length) return;
    for (const attribute of ["alt", "aria-label", "placeholder", "title", "content"]) {
      if (attribute === "content" && !$(node).is("meta[name='description']")) continue;
      const phrase = $(node).attr(attribute)?.trim();
      if (phrase) phrases.add(phrase);
    }
  });
}

const source = Object.fromEntries([...phrases].sort((a, b) => a.localeCompare(b)).map((phrase) => [phrase, phrase]));
writeFileSync("src/i18n/messages/en.json", `${JSON.stringify(source, null, 2)}\n`);
console.log(`Extracted ${phrases.size} English source phrases.`);
