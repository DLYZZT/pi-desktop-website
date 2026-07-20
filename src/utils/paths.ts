const baseUrl = import.meta.env.BASE_URL;

/** Prefixes a site-internal path with Astro's configured deployment base. */
export function withBase(path = "") {
  const normalizedPath = path.replace(/^\/+/, "");
  return normalizedPath ? `${baseUrl}${normalizedPath}` : baseUrl;
}
