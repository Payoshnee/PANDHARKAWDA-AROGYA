import { describe, expect, it } from "vitest";
import emergency from "../public/emergency-offline.json";

describe("offline emergency payload", () => {
  it("contains static emergency numbers for PWA cache", () => {
    expect(emergency.ambulance_108).toBe("108");
    expect(emergency.referral_102).toBe("102");
    expect(emergency.health_advice_104).toBe("104");
  });
});
