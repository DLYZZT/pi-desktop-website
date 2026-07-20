import { defineConfig } from "astro/config";
import icon from "astro-icon";

const githubRepository = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const [githubOwner, githubRepo] = githubRepository;
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

function normalizeBase(value) {
  if (!value || value === "/") return "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

const inferredSite =
  isGitHubActions && githubOwner ? `https://${githubOwner.toLowerCase()}.github.io` : undefined;
const inferredBase =
  isGitHubActions && githubRepo && githubRepo.toLowerCase() !== `${githubOwner?.toLowerCase()}.github.io`
    ? `/${githubRepo}`
    : "/";

export default defineConfig({
  integrations: [icon()],
  output: "static",
  site: process.env.ASTRO_SITE_URL?.trim() || inferredSite,
  base: normalizeBase(process.env.ASTRO_BASE_PATH?.trim() || inferredBase),
  trailingSlash: "always",
  server: {
    host: "0.0.0.0",
  },
  vite: {
    server: {
      allowedHosts: ["terminal.local"],
    },
  },
});
