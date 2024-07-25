import BaseChannel from "./base-channel.class";

import { ffStrToObj } from "../helpers";
import { FeatureFlagsChannel, Flags } from "../types";

interface QueryParamsClientChannelProps {
  root?: Window;
  key?: string;
}

export default class QueryParamsClientChannel
  extends BaseChannel
  implements FeatureFlagsChannel
{
  root: Window;
  key: string;
  flags: Flags;

  constructor(props?: QueryParamsClientChannelProps) {
    super();

    this.root = props?.root || window;
    this.key = props?.key || "featureFlags";
    this.flags = {};
  }

  init() {
    const initialSearch = this.getLocationSearch();
    this.updateSourceFlags(initialSearch);

    this.root.addEventListener("popstate", () => {
      const search = this.getLocationSearch();
      this.updateSourceFlags(search);
      this.update(this.flags);
    });
  }

  private getLocationSearch() {
    return this.root.location?.search;
  }

  private updateSourceFlags(search: string) {
    const ffStr = this.getQueryParam(search);
    if (!ffStr) return;

    this.flags = { ...this.flags, ...ffStrToObj(ffStr) };
  }

  private getQueryParam(search: string) {
    const searchParams = new URLSearchParams(search);
    return searchParams.get(this.key);
  }

  getFlags() {
    return this.flags;
  }
}
