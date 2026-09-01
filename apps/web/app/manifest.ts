import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pandharkawda Arogya",
    short_name: "Arogya",
    description: "Bilingual healthcare information and emergency navigation for Pandharkawda.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f7f2",
    theme_color: "#0f766e",
    lang: "en-IN",
    categories: ["health", "medical", "navigation"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
