export const OFFLINE_SAFE_URLS = ["/", "/emergency", "/manifest.webmanifest", "/icon.svg", "/emergency-offline.json"] as const;

export const NETWORK_ONLY_URL_PREFIXES = [
  "/api/v1/facilities/open-now",
  "/api/v1/search",
  "/api/v1/visiting-sessions",
  "/api/v1/doctors",
  "/api/v1/facilities"
] as const;

export function isOfflineSafeUrl(pathname: string) {
  return OFFLINE_SAFE_URLS.some((safePath) => safePath === pathname);
}

export function isNetworkOnlyHealthcareUrl(pathname: string) {
  return NETWORK_ONLY_URL_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
