import { FeatureFlags } from "../src/feature-flags.class";

describe("Feature flags", () => {
  const featureFlags = new FeatureFlags();
  const flafKey = "flag-default";

  featureFlags.init({
    defaultFeatureFlags: { [flafKey]: true },
  });

  it("default flags are setted properly", () => {
    expect(featureFlags.getFlag(flafKey)).toBeTruthy();
  });
});
