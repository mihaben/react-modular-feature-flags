import { ffStrToObj, flagsAreEqual, resolveFlags } from "../src/helpers";
import { ChannelFlags } from "../src/types";

describe("Feature Flags helpers", () => {
  describe("ffStrToObj", () => {
    it("should return an empty object when we don`t have featureFlags", () => {
      const featureFlagsMock = "";

      expect(ffStrToObj(featureFlagsMock)).toEqual({});
    });

    it("should transform the featureFlags string into an valid flags object", () => {
      const featureFlagsMock = "demo1,demo2,demo3=false,demo4";
      const featureFlagsMock2 = "demo1";

      const expectedResult = {
        demo1: true,
        demo2: true,
        demo3: false,
        demo4: true,
      };

      const expectedResult2 = {
        demo1: true,
      };

      expect(ffStrToObj(featureFlagsMock)).toEqual(expectedResult);
      expect(ffStrToObj(featureFlagsMock2)).toEqual(expectedResult2);
    });
  });

  describe("flagsAreEqual", () => {
    it("should return true if the flags object have the same keys and values", () => {
      const featureFlagsMock = { demo1: true, demo2: true, demo3: false };
      const featureFlagsMock2 = { demo2: true, demo1: true, demo3: false };

      expect(flagsAreEqual(featureFlagsMock, featureFlagsMock2)).toBeTruthy();
    });

    it("should return false if the flags object have different keys or values", () => {
      const featureFlagsMock = { demo1: true, demo2: true, demo3: false };
      const featureFlagsMock2 = { demo2: false, demo1: true, demo3: true };

      expect(flagsAreEqual(featureFlagsMock, featureFlagsMock2)).toBeFalsy();
    });
  });

  describe("resolveFlags", () => {
    it("should merge all the flags from different channels according to their priority", () => {
      const channelsFlagsMock: ChannelFlags = {
        DEFAULT: {
          flags: { flag7: false, flag8: true },
          priority: 0,
        },
        COOKIES: {
          flags: { flag1: true, flag4: false },
          priority: 1,
        },
        QUERY_PARAMS: {
          flags: { flag1: true, flag2: false, flag3: true },
          priority: 2,
        },
        REMOTE_FLAGGER: {
          flags: { flag5: true, flag6: true },
          priority: 3,
        },
      };

      const expectedResult = {
        flag1: true,
        flag2: false,
        flag3: true,
        flag4: false,
        flag5: true,
        flag6: true,
        flag7: false,
        flag8: true,
      };

      expect(resolveFlags(channelsFlagsMock)).toEqual(expectedResult);
    });
  });
});
