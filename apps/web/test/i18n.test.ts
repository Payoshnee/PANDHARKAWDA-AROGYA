import { describe, expect, it } from "vitest";
import { t } from "../lib/i18n";

describe("i18n", () => {
  it("returns curated Marathi emergency copy", () => {
    expect(t("mr", "call108")).toContain("108");
  });
});
