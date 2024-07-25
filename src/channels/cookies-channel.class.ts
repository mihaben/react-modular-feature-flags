import BaseChannel from "./base-channel.class";

import { ffStrToObj } from "../helpers";
import { FeatureFlagsChannel, Flags } from "../types";

interface CookiesChannelProps {
  root?: Window;
  key?: string;
}

export default class CookiesChannel
  extends BaseChannel
  implements FeatureFlagsChannel
{
  root: Window;
  key: string;
  flags: Flags;

  constructor(props?: CookiesChannelProps) {
    super();
    this.root = props?.root || window;
    this.key = props?.key || "featureFlags";
    this.flags = {};
  }

  init() {
    const ffStr = this.getCookieValue();
    if (!ffStr) return;

    this.flags = ffStrToObj(ffStr);
  }

  getCookieValue() {
    const value = this.root.document?.cookie.match(
      `(^|[^;]+)\\s*${this.key}\\s*=\\s*([^;]+)`
    );
    return value ? value.pop() : "";
  }

  getFlags() {
    return this.flags;
  }
}
