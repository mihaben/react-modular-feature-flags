import { Flags, ChannelFlags } from "./types";

export const resolveFlags = (channelFlags: ChannelFlags): Flags => {
  return Object.values(channelFlags)
    .sort((a, b) => a.priority - b.priority)
    .reduce((acc: Flags, { flags }) => {
      return {
        ...acc,
        ...flags,
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
