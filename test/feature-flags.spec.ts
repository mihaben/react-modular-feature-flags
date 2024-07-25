import { FeatureFlags } from "../src/feature-flags.class";

describe("Feature flags", () => {
  const featureFlags = new FeatureFlags();
  const flagKey = "flag-default";

  featureFlags.init({
    defaultFeatureFlags: { [flagKey]: true },
  });

  it("default flags are setted properly", () => {
    expect(featureFlags.getFlag(flagKey)).toBeTruthy();
  });
});
