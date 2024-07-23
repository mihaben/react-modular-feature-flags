import BaseChannel from "./base-channel.class";

import { ffStrToObj } from "../helpers";
import { FeatureFlagsSource, Flags } from "../types";

export default class CookiesSource
  extends BaseChannel
  implements FeatureFlagsSource
{
  root: Window;
  key: string;
  flags: Flags;

  constructor(root: Window, key = "featureFlags") {
    super();
    this.root = root;
    this.key = key;
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
