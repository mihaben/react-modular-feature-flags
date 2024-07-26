import { act, renderHook } from "@testing-library/react";
import featureFlags from "../src/feature-flags.class";

import useFeatureFlag from "../src/use-feature-flag";
import { FeatureFlagsChannel, Flags } from "../src/types";
import BaseChannel from "../src/channels/base-channel.class";

class MockChannel extends BaseChannel implements FeatureFlagsChannel {
  flags = {};
  init = () => null;
  getFlags = () => this.flags;

  test(flags: Flags) {
    this.flags = flags;
    this.update(flags);
  }
}

describe("useFeatureFlag", () => {
  const flagKey = "flag-use-feature-flag";

  featureFlags.init({});

  const mockChannel = new MockChannel();
  featureFlags.initChannel({ priority: 1 }, mockChannel);

  it("should return a boolean value", () => {
    const { result } = renderHook(() => useFeatureFlag(flagKey));
    expect(typeof result.current).toBe("boolean");
  });

  it("should return default value", () => {
    const { result } = renderHook(() => useFeatureFlag(flagKey));
    expect(result.current).toBe(false);
  });

  it("should update to true after the flag is set to true", () => {
    const { result } = renderHook(() => useFeatureFlag(flagKey));

    expect(result.current).toBe(false);

    act(() => {
      mockChannel.test({ [flagKey]: true });
    });

    expect(result.current).toBe(true);
  });
});
