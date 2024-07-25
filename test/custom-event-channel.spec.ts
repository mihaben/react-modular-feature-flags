import { FeatureFlags } from "../src/feature-flags.class";
import CustomEventChannel from "../src/channels/custom-event-channel.class";

describe("Custom event channel", () => {
  const featureFlags = new FeatureFlags();
  featureFlags.init({});

  const flagKey = "flag-custom-event";
  const eventName = "custom-event";

  const eventListeners = {} as EventListener;

  const rootMock = {
    addEventListener: (event: string, cb: (data?: unknown) => null) => {
      eventListeners[event] = cb;
    },
  } as Window;

  const customEventChannel = new CustomEventChannel({
    root: rootMock,
    options: { eventName },
  });

  featureFlags.initChannel({ priority: 0 }, customEventChannel);

  it("flag should be false by default", () => {
    expect(featureFlags.getFlag(flagKey)).toBeFalsy();
  });

  it("flag should be true after the event is dispatched", () => {
    eventListeners[eventName]({ detail: { [flagKey]: true } });
    expect(featureFlags.getFlag(flagKey)).toBeTruthy();
  });
});
