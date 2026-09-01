import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: { command: "npm run dev -- --port 3010", url: "http://127.0.0.1:3010", reuseExistingServer: true },
  use: {
    baseURL: "http://127.0.0.1:3010",
    serviceWorkers: "allow"
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } }
  ]
});
