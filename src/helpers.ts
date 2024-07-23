import { Flags, Source, SourcesFlags } from "./types";

export const resolveFlags = (
  sourceFlags: SourcesFlags,
  priorityOrder: Source[]
): Flags => {
  return priorityOrder.reduce((acc: Flags, current: Source) => {
    return {
      ...sourceFlags[current],
      ...acc,
    };
  }, {});
};

export const flagsAreEqual = (flags1: Flags, flags2: Flags) => {
  const sortObject = (obj: Flags) =>
    Object.keys(obj)
      .sort()
      .reduce((result: Flags, key: string) => {
        // eslint-disable-next-line no-param-reassign
        result[key] = obj[key];
        return result;
      }, {});

  return (
    JSON.stringify(sortObject(flags1)) === JSON.stringify(sortObject(flags2))
  );
};

export const ffStrToObj = (ffStr: string) => {
  if (!ffStr) return {};
  const flags = ffStr.split(",");
  return flags.reduce((acc: Flags, current: string) => {
    const flag = current.split("=");
    return { ...acc, [flag[0]]: flag[1] !== "false" };
  }, {});
};
