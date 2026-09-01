import { expect, test } from "@playwright/test";

const routes = ["/", "/doctors", "/doctors/visiting", "/open-now", "/facilities", "/public-hospital", "/schemes", "/tests", "/procedures", "/medical-explainer", "/health-alerts", "/ask-arogya", "/saved", "/emergency", "/privacy", "/accessibility", "/report-incorrect", "/admin", "/admin/doctors", "/admin/verification"];

for (const route of routes) {
  test(`${route} loads`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
    expect(errors).toEqual([]);
  });
}
