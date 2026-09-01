import { expect, test } from "@playwright/test";

test("emergency page remains available after service worker cache when offline", async ({ page, context }) => {
  await page.goto("/emergency");
  await expect(page.getByRole("heading", { name: "Emergency Help" })).toBeVisible();

  await page.evaluate(async () => {
    await navigator.serviceWorker.register("/sw.js");
    const cache = await caches.open("pandharkawda-arogya-emergency-v1");
    await cache.add("/emergency");
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(async () => {
    const cache = await caches.open("pandharkawda-arogya-emergency-v1");
    return Boolean(await cache.match(new URL("/emergency", location.origin).toString()));
  });

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Emergency Help" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Call 108 Ambulance" })).toHaveAttribute("href", "tel:108");
});
