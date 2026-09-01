export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }], sitemap: "http://localhost:3000/sitemap.xml" };
}
