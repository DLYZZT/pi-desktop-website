/** Text inserted after page load; rendered into the page so it uses the same catalogs. */
export const clientPhrases = {
  windowsDownload: "Download for Windows (x64)",
  macIntelDownload: "Download for macOS (Intel)",
  macSiliconDownload: "Download for macOS (Apple Silicon)",
  linuxDownload: "Download for Linux (x64 AppImage)",
  windowsDetected: "Windows (x64)",
  macIntelDetected: "macOS (Intel)",
  macSiliconDetected: "macOS (Apple Silicon)",
  linuxArmDetected: "Linux (ARM64, not yet supported)",
  linuxDetected: "Linux (x64)",
  viewDownloads: "View downloads",
} as const;

export type ClientPhrase = keyof typeof clientPhrases;
