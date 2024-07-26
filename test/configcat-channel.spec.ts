/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeatureFlags } from "../src/feature-flags.class";
import ConfigcatChannel from "../src/channels/configcat-channel.class";
import { act } from "react";

describe("Configcat channel", () => {
  const featureFlags = new FeatureFlags();

  featureFlags.init({});

  const flagKeyA = "flag-custom-configcat-A";
  const flagKeyB = "flag-custom-configcat-B";

  let configChangedFn: () => void;

  let flags: { [key: string]: boolean } = {
    [flagKeyA]: true,
  };

  const configCatClientMock = {
    getAllKeysAsync: () => Object.keys(flags),
    getValueAsync: (key: string) => flags[key],
    forceRefreshAsync: () => null,
  };

  const configCatMock = {
    createClientWithAutoPoll: (_sdk: string, { configChanged }: any) => {
      configChangedFn = configChanged;
      return configCatClientMock;
    },
    createClientWithManualPoll: () => null,
  };

  const configcatChannel = new ConfigcatChannel({
    configCat: configCatMock as any,
    options: {
      SDKKey: "configCatSDKKey",
      defaultFlags: {},
      pollIntervalSeconds: 60,
    },
  });

  featureFlags.initChannel({ priority: 1 }, configcatChannel);

  it("flags should have the correct status when the module is rendered", () => {
    expect(featureFlags.getFlag(flagKeyA)).toBeTruthy();
    expect(featureFlags.getFlag(flagKeyB)).toBeFalsy();
  });

  it("flags should have the correct status after config change", async () => {
    flags = {
      ...flags,
      [flagKeyA]: false,
      [flagKeyB]: true,
    };

    await act(async () => {
      configChangedFn();
    });

    expect(featureFlags.getFlag(flagKeyA)).toBeFalsy();
    expect(featureFlags.getFlag(flagKeyB)).toBeTruthy();
  });
});
