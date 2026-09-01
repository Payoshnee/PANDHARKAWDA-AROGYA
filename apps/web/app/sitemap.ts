export default function sitemap() {
  return ["/", "/doctors", "/doctors/visiting", "/open-now", "/facilities", "/public-hospital", "/schemes", "/tests", "/procedures", "/health-alerts", "/ask-arogya", "/emergency"].map((path) => ({ url: `http://localhost:3000${path}`, lastModified: new Date("2026-09-01") }));
}
