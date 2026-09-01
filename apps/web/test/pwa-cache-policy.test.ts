import { describe, expect, it } from "vitest";
import { isNetworkOnlyHealthcareUrl, isOfflineSafeUrl } from "../lib/pwa-cache-policy";

describe("PWA cache policy", () => {
  it("allows emergency assets in the offline cache", () => {
    expect(isOfflineSafeUrl("/emergency")).toBe(true);
    expect(isOfflineSafeUrl("/emergency-offline.json")).toBe(true);
  });

  it("keeps changing healthcare availability data network-only", () => {
    expect(isNetworkOnlyHealthcareUrl("/api/v1/facilities/open-now")).toBe(true);
    expect(isNetworkOnlyHealthcareUrl("/api/v1/search")).toBe(true);
    expect(isNetworkOnlyHealthcareUrl("/api/v1/doctors")).toBe(true);
  });

  it("does not treat open-now as offline-safe content", () => {
    expect(isOfflineSafeUrl("/open-now")).toBe(false);
  });
});
