export const RELEASE_VERSION = "0.4.0";
export const RELEASE_URL = `https://github.com/DLYZZT/pi-desktop/releases/tag/v${RELEASE_VERSION}`;

export function releaseDownloads(version = RELEASE_VERSION) {
  const base = `https://github.com/DLYZZT/pi-desktop/releases/download/v${version}`;
  return {
    version,
    macArmDmg: `${base}/Pi-Agent-Desktop-${version}-arm64.dmg`,
    macArmZip: `${base}/Pi-Agent-Desktop-${version}-arm64.zip`,
    macX64Dmg: `${base}/Pi-Agent-Desktop-${version}-x64.dmg`,
    macX64Zip: `${base}/Pi-Agent-Desktop-${version}-x64.zip`,
    winExe: `${base}/Pi-Agent-Desktop-Unsigned-Beta-Setup-${version}.exe`,
    linuxAppImage: `${base}/Pi-Agent-Desktop-${version}-x86_64.AppImage`,
  };
}
