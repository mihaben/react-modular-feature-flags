import { FeatureFlags } from "../src/feature-flags.class";
import QueryParamsChannel from "../src/channels/query-params-client-channel.class";

describe("Query params channel", () => {
  const featureFlags = new FeatureFlags();
  featureFlags.init({});

  const flagKeyA = "flag-custom-query-params-A";
  const flagKeyB = "flag-custom-query-params-B";

  const eventListeners = {} as EventListener;

  const rootMock = {
    location: {
      search: `featureFlags=${flagKeyA}`,
    },
    addEventListener: (event: string, cb: (data?: unknown) => null) => {
      eventListeners[event] = cb;
    },
  } as Window;

  const queryParamsChannel = new QueryParamsChannel({
    root: rootMock,
  });

  featureFlags.initChannel({ priority: 1 }, queryParamsChannel);

  it("should update the value of flag when the page is rendered", () => {
    expect(featureFlags.getFlag(flagKeyA)).toBeTruthy();
  });

  it("should update the value of flag when the query params change", () => {
    rootMock.location.search = `featureFlags=${flagKeyB},${flagKeyA}=false`;
    eventListeners["popstate"]();
    expect(featureFlags.getFlag(flagKeyB)).toBeTruthy();
    expect(featureFlags.getFlag(flagKeyA)).toBeFalsy();
  });
});
