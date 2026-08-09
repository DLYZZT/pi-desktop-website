import { withBase } from "../utils/paths";

const REPO = "DLYZZT/pi-desktop";
const FALLBACK_VERSION = "0.1.6";
const RELEASE_CACHE_KEY = "pi-site-release-v0.1.6";

type Platform = {
  os: "mac" | "windows" | "linux" | "unknown";
  arch: "arm64" | "x64" | null;
};

type Release = {
  version: string;
  macArmDmg: string;
  macArmZip: string;
  macX64Dmg: string;
  macX64Zip: string;
  winExe: string;
  linuxAppImage: string;
};

const root = document.documentElement;
const isEnglish = root.lang.toLowerCase().startsWith("en");

function preferredTheme(): "dark" | "light" {
  try {
    const stored = localStorage.getItem("pi-site-theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "dark" | "light") {
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

applyTheme(preferredTheme());

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element) || !target.closest("[data-theme-toggle]")) return;

  const next = root.classList.contains("dark") ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("pi-site-theme", next);
  } catch {
    // The theme still applies for the current page even if persistence fails.
  }
});

function fallbackRelease(version: string): Release {
  const base = `https://github.com/${REPO}/releases/download/v${version}`;
  return {
    version,
    macArmDmg: `${base}/Pi-Agent-Desktop-${version}-arm64.dmg`,
    macArmZip: `${base}/Pi-Agent-Desktop-${version}-arm64.zip`,
    macX64Dmg: `${base}/Pi-Agent-Desktop-${version}-x64.dmg`,
    macX64Zip: `${base}/Pi-Agent-Desktop-${version}-x64.zip`,
    winExe: `${base}/Pi-Agent-Desktop-Setup-${version}.exe`,
    linuxAppImage: `${base}/Pi-Agent-Desktop-${version}-x86_64.AppImage`,
  };
}

function findAsset(assets: Array<{ name: string; browser_download_url: string }>, pattern: RegExp) {
  return assets.find((asset) => pattern.test(asset.name))?.browser_download_url ?? null;
}

async function loadRelease(): Promise<Release> {
  try {
    const cached = sessionStorage.getItem(RELEASE_CACHE_KEY);
    if (cached) return JSON.parse(cached) as Release;
  } catch {
    // Fetch fresh release data below.
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`Release request failed: ${response.status}`);

    const data = (await response.json()) as {
      tag_name?: string;
      assets?: Array<{ name: string; browser_download_url: string }>;
    };
    const version = String(data.tag_name ?? "").replace(/^v/, "") || FALLBACK_VERSION;
    const fallback = fallbackRelease(version);
    const assets = data.assets ?? [];
    const release: Release = {
      version,
      macArmDmg: findAsset(assets, /arm64\.dmg$/) ?? fallback.macArmDmg,
      macArmZip: findAsset(assets, /arm64\.zip$/) ?? fallback.macArmZip,
      macX64Dmg: findAsset(assets, /x64\.dmg$/) ?? fallback.macX64Dmg,
      macX64Zip: findAsset(assets, /x64\.zip$/) ?? fallback.macX64Zip,
      winExe: findAsset(assets, /Setup-[\d.]+\.exe$/) ?? fallback.winExe,
      linuxAppImage: findAsset(assets, /x86_64\.AppImage$/i) ?? fallback.linuxAppImage,
    };

    try {
      sessionStorage.setItem(RELEASE_CACHE_KEY, JSON.stringify(release));
    } catch {
      // The fetched result can still be used without caching.
    }
    return release;
  } catch {
    return fallbackRelease(FALLBACK_VERSION);
  }
}

async function detectPlatform(): Promise<Platform> {
  const userAgent = navigator.userAgent || "";
  let os: Platform["os"] = "unknown";
  let arch: Platform["arch"] = null;

  if (/Windows/i.test(userAgent)) os = "windows";
  else if (/Mac OS X|macOS|Macintosh/i.test(userAgent)) os = "mac";
  else if (/Linux|X11/i.test(userAgent)) os = "linux";

  const userAgentData = (
    navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues: (hints: string[]) => Promise<{ architecture?: string; platform?: string }>;
      };
    }
  ).userAgentData;

  if (userAgentData?.getHighEntropyValues) {
    try {
      const hints = await userAgentData.getHighEntropyValues(["architecture", "platform"]);
      if (/win/i.test(hints.platform ?? "")) os = "windows";
      else if (/mac/i.test(hints.platform ?? "")) os = "mac";
      else if (/linux/i.test(hints.platform ?? "")) os = "linux";
      if (hints.architecture === "arm") arch = "arm64";
      else if (hints.architecture === "x86") arch = "x64";
    } catch {
      // Fall back to the lower-entropy user agent result.
    }
  }

  if (os === "mac" && !arch) arch = "arm64";
  return { os, arch };
}

function recommendedKey(platform: Platform): keyof Release | null {
  if (platform.os === "windows") return "winExe";
  if (platform.os === "mac") return platform.arch === "x64" ? "macX64Dmg" : "macArmDmg";
  if (platform.os === "linux" && platform.arch !== "arm64") return "linuxAppImage";
  return null;
}

function recommendedLabel(platform: Platform) {
  if (platform.os === "windows") return isEnglish ? "Download for Windows (x64)" : "下载 Windows 版（x64）";
  if (platform.os === "mac") {
    if (platform.arch === "x64") return isEnglish ? "Download for macOS (Intel)" : "下载 macOS 版（Intel）";
    return isEnglish ? "Download for macOS (Apple Silicon)" : "下载 macOS 版（Apple Silicon）";
  }
  if (platform.os === "linux" && platform.arch !== "arm64") {
    return isEnglish ? "Download for Linux (x64 AppImage)" : "下载 Linux 版（x64 AppImage）";
  }
  return null;
}

function detectedLabel(platform: Platform) {
  if (platform.os === "windows") return isEnglish ? "Windows (x64)" : "Windows（x64）";
  if (platform.os === "mac") return platform.arch === "x64" ? "macOS (Intel)" : "macOS (Apple Silicon)";
  if (platform.os === "linux") {
    if (platform.arch === "arm64") return isEnglish ? "Linux (ARM64, not yet supported)" : "Linux（ARM64，暂不支持）";
    return isEnglish ? "Linux (x64)" : "Linux（x64）";
  }
  return null;
}

function applyRelease(release: Release, platform: Platform) {
  document.querySelectorAll<HTMLAnchorElement>("[data-dl]").forEach((anchor) => {
    const key = anchor.dataset.dl as keyof Release | undefined;
    if (key && release[key]) anchor.href = release[key];
  });

  document.querySelectorAll<HTMLElement>("[data-version]").forEach((node) => {
    node.textContent = `v${release.version}`;
  });

  const heroButton = document.querySelector<HTMLAnchorElement>("[data-hero-download]");
  const heroLabel = heroButton?.querySelector<HTMLElement>("[data-hero-label]");
  const key = recommendedKey(platform);
  const label = recommendedLabel(platform);
  if (heroButton && heroLabel && key && label) {
    heroButton.href = release[key];
    heroLabel.textContent = label;
  } else if (heroButton && heroLabel) {
    heroButton.href = withBase(isEnglish ? "en/download/" : "download/");
    heroLabel.textContent = isEnglish ? "View downloads" : "前往下载";
  }

  const banner = document.querySelector<HTMLElement>("[data-detect-banner]");
  const platformLabel = banner?.querySelector<HTMLElement>("[data-detect-os]");
  const detected = detectedLabel(platform);
  if (banner && platformLabel && detected) {
    platformLabel.textContent = detected;
    banner.hidden = false;
  }

  if (key) {
    const card = document.querySelector<HTMLElement>(`[data-platform-card="${key}"]`);
    card?.classList.add("recommended");
    const badge = card?.querySelector<HTMLElement>("[data-rec-badge]");
    if (badge) badge.hidden = false;
  }
}

Promise.all([loadRelease(), detectPlatform()]).then(([release, platform]) => {
  applyRelease(release, platform);
});
