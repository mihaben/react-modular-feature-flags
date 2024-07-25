import { ffStrToObj } from "../src/helpers";

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
});
