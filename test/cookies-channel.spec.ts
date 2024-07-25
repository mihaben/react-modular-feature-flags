import { FeatureFlags } from "../src/feature-flags.class";
import CookiesChannel from "../src/channels/cookies-channel.class";

describe("Cookies channel", () => {
  const featureFlags = new FeatureFlags();
  featureFlags.init({
    defaultFeatureFlags: { baz: true },
  });

  const cookie = "featureFlags=foo,bar,baz=false";

  const rootMock = {
    document: {
      cookie,
    },
  } as Window;

  const cookiesChannel = new CookiesChannel({
    root: rootMock,
  });

  featureFlags.initChannel({ priority: 1 }, cookiesChannel);

  it("flags should have the correct status", () => {
    expect(featureFlags.getFlag("foo")).toBeTruthy();
    expect(featureFlags.getFlag("bar")).toBeTruthy();
    expect(featureFlags.getFlag("baz")).toBeFalsy();
  });
});
