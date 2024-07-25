import BaseChannel from "./base-channel.class";

import { FeatureFlagsChannel, Flags } from "../types";

interface ConfigCatSourceProps {
  configCat: ConfigCat;
  options: ConfigCatInitialProps;
}

interface ConfigCatInitialProps {
  SDKKey: string;
  defaultFlags?: Flags;
  pollIntervalSeconds?: number;
}

interface CacheValue {
  key: string;
  value: boolean | undefined;
}

interface AutoPollOptions {
  pollIntervalSeconds: number;
  configChanged: () => void;
}

interface ConfigCatClient {
  getAllKeysAsync: () => Promise<string[]>;
  getValueAsync: (key: string, defaultValue: boolean) => Promise<boolean>;
  forceRefreshAsync: () => Promise<void>;
}

interface ConfigCat {
  createClientWithAutoPoll: (
    sdk: string,
    options: AutoPollOptions
  ) => ConfigCatClient;
}

export default class ConfigCatChannel
  extends BaseChannel
  implements FeatureFlagsChannel
{
  configCat: ConfigCat;
  configCatClient: ConfigCatClient | undefined;
  SDKKey: string;
  defaultFlags: Flags;
  pollIntervalSeconds: number;
  flags: Flags;

  constructor(props: ConfigCatSourceProps) {
    super();
    const { configCat, options } = props;
    const { SDKKey, defaultFlags, pollIntervalSeconds } = options;

    this.configCat = configCat;
    this.SDKKey = SDKKey;
    this.defaultFlags = defaultFlags || {};
    this.pollIntervalSeconds = pollIntervalSeconds || 150;
    this.flags = {};
  }

  init() {
    this.configCatClient = this.configCat.createClientWithAutoPoll(
      this.SDKKey,
      {
        pollIntervalSeconds: this.pollIntervalSeconds,
        configChanged: () => {
          this.updateSourceFlags();
        },
      }
    );

    this.updateSourceFlags();
  }

  private async getCacheValues(): Promise<CacheValue[]> {
    if (!this.configCatClient) return [];

    try {
      const keys: string[] = await this.configCatClient?.getAllKeysAsync();
      if (!keys) return [];
      return Promise.all(
        keys.map(async (key) => {
          const value = await this.configCatClient?.getValueAsync(
            key,
            this.flags[key] || this.defaultFlags[key]
          );
          return { key, value };
        })
      );
    } catch {
      return [];
    }
  }

  private async buildFlags(): Promise<Flags> {
    const cacheValues = await this.getCacheValues();

    if (!cacheValues?.length) return {};

    return cacheValues.reduce((flags: Flags, cacheValue: CacheValue) => {
      const { key, value } = cacheValue;
      return { ...flags, [key]: !!value };
    }, {});
  }

  private async updateSourceFlags() {
    this.flags = await this.buildFlags();
    this.update(this.flags);
  }

  async getFlags() {
    return this.flags;
  }
}
